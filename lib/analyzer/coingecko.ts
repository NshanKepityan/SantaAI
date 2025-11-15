// lib/analyzer/coingecko.ts

const COINGECKO_BASE_URL = "https://api.geckoterminal.com/api/v2";
const NETWORK = "solana";

/** Rate limiting for GeckoTerminal API */
let lastApiCall = 0;
const MIN_API_INTERVAL_MS = 1200; // ~50 calls/minute
const apiCache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes

async function rateLimitApi() {
  const now = Date.now();
  const diff = now - lastApiCall;
  if (diff < MIN_API_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_API_INTERVAL_MS - diff));
  }
  lastApiCall = Date.now();
}

async function retryFetch(url: string, retries = 3): Promise<Response | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await rateLimitApi();
      const res = await fetch(url, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });

      if (res.status === 429 && attempt < retries) {
        const delay = Math.min(2000 * 2 ** attempt, 10000);
        console.warn(
          `GeckoTerminal rate limited (429). Retrying in ${delay}ms (attempt ${
            attempt + 1
          }/${retries + 1})`,
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      return res;
    } catch (err) {
      if (attempt === retries) {
        console.error(
          `Failed to fetch ${url} after ${retries + 1} attempts`,
          err,
        );
        return null;
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return null;
}

function cacheGet(key: string) {
  const now = Date.now();
  const hit = apiCache.get(key);
  if (hit && hit.expires > now) return hit.data;
  return null;
}

function cacheSet(key: string, data: any) {
  apiCache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

function toNum(v: any): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = parseFloat(v.trim());
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

/** ---------- Public API wrappers ---------- */

/** /networks/{network}/tokens/{address} */
export async function getTokenData(address: string): Promise<any | null> {
  const key = `tokenData:${address}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const url = `${COINGECKO_BASE_URL}/networks/${NETWORK}/tokens/${address}`;
  const res = await retryFetch(url);
  if (!res || !res.ok) return null;

  const json = await res.json().catch(() => null);
  if (!json) return null;

  cacheSet(key, json);
  return json;
}

/** /networks/{network}/tokens/{address}/info */
export async function getTokenInfo(address: string): Promise<any | null> {
  const key = `tokenInfo:${address}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const url = `${COINGECKO_BASE_URL}/networks/${NETWORK}/tokens/${address}/info`;
  const res = await retryFetch(url);
  if (!res || !res.ok) return null;

  const json = await res.json().catch(() => null);
  if (!json) return null;

  cacheSet(key, json);
  return json;
}

/** /networks/{network}/pools/{pool_id} */
export async function getPoolInfo(poolId: string): Promise<any | null> {
  const key = `pool:${poolId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const url = `${COINGECKO_BASE_URL}/networks/${NETWORK}/pools/${poolId}`;
  const res = await retryFetch(url);
  if (!res || !res.ok) return null;

  const json = await res.json().catch(() => null);
  if (!json) return null;

  cacheSet(key, json);
  return json;
}

/** Shape returned for analyzer/index.ts */
export type ExtractedAnalysis = {
  top1Share: number; // 0..1
  top10Share: number; // 0..1
  metadataMutable: boolean;
  customFeesDetected: boolean;
  depthSOL: number | null;
  lpStatus: "burned" | "locked" | "unlocked" | "unknown";
  poolState: string;
  lockedLiquidityPct: number | null; // 0..100 or null
};

/**
 * Orchestrator:
 *  - getTokenData (basic token + relationships)
 *  - getTokenInfo (holders, mint/freeze authority, honeypot)
 *  - getPoolInfo (top pool from relationships.top_pools.data)
 *  - Merge into ExtractedAnalysis
 */
export async function extractAnalysisData(
  address: string,
): Promise<ExtractedAnalysis> {
  const [tokenData, infoData] = await Promise.all([
    getTokenData(address).catch(() => null),
    getTokenInfo(address).catch(() => null),
  ]);

  // ----- resolve top pool id -----
  let poolData: any = null;
  try {
    const rel = tokenData?.data?.relationships;
    const topPools = rel?.top_pools?.data;
    if (Array.isArray(topPools) && topPools.length > 0) {
      const poolId = topPools[0]?.id;
      if (poolId) {
		const poolIdWithoutNetwork = poolId.replace(`${NETWORK}_`,"");
        poolData = await getPoolInfo(poolIdWithoutNetwork).catch(() => null);
      }
    }
  } catch {
    // ignore
  }

  const tokenAttrs: any = tokenData?.data?.attributes ?? {};
  const infoAttrs: any = infoData?.data?.attributes ?? {};
  const poolAttrs: any = poolData?.data?.attributes ?? {};

  /* ---------- Holders / concentration (from /info) ---------- */
  let top1Share = 0;
  let top10Share = 0;

  const holdersObj = infoAttrs.holders;
  if (holdersObj && typeof holdersObj === "object") {
    const dist =
      holdersObj.distribution_percentage || holdersObj.distribution || null;

    if (dist && typeof dist === "object") {
      const top10Raw = toNum(dist.top_10 ?? dist.top10 ?? dist["top-10"]);
      if (top10Raw !== null) {
        top10Share = Math.max(0, Math.min(1, top10Raw / 100));
      }

      const top1Raw = toNum(dist.top_1 ?? dist.top1 ?? dist["top-1"]);
      if (top1Raw !== null) {
        top1Share = Math.max(0, Math.min(1, top1Raw / 100));
      }
    }
  }

  /* ---------- Metadata mutability ---------- */
  const mintAuth = infoAttrs.mint_authority;
  const freezeAuth = infoAttrs.freeze_authority;

  const metadataMutable = !!(
    (mintAuth && mintAuth !== "no" && mintAuth !== "null") ||
    (freezeAuth && freezeAuth !== "no" && freezeAuth !== "null")
  );

  /* ---------- Custom fees / honeypot-ish risk ---------- */
  const isHoneypot = infoAttrs.is_honeypot;
  const customFeesDetected =
    isHoneypot === true ||
    isHoneypot === "yes" ||
    isHoneypot === "likely";

  /* ---------- Liquidity / LP status (from pool) ---------- */
  let depthSOL: number | null = null;
  let lpStatus: ExtractedAnalysis["lpStatus"] = "unknown";
  let poolState = "No active pool found";
  let lockedLiquidityPct: number | null = null;

  if (poolData) {
    const liquidityUsd =
      toNum(poolAttrs.reserve_in_usd) ??
      toNum(poolAttrs.liquidity_usd) ??
      toNum(poolAttrs.tvl_usd) ??
      toNum(tokenAttrs.liquidity_usd) ??
      0;

    const solPriceUsd =
      toNum(poolAttrs.sol_price_usd) ??
      toNum(tokenAttrs.sol_price_usd) ??
      100;

    if (liquidityUsd && solPriceUsd) {
      depthSOL = liquidityUsd / solPriceUsd;
    }

    const dexName =
      poolAttrs.dex_name ?? poolAttrs.dex ?? poolAttrs.name ?? "DEX";

    const lockedPctRaw =
      toNum(poolAttrs.locked_liquidity_percentage) ??
      toNum(poolAttrs.locked_lp_percentage) ??
      null;

    if (lockedPctRaw !== null) {
      lockedLiquidityPct = Math.max(0, Math.min(100, lockedPctRaw));
    }

    if (lockedLiquidityPct !== null) {
      if (lockedLiquidityPct >= 95) {
        lpStatus = "burned";
        poolState = `LP effectively burned (${dexName}) – ${lockedLiquidityPct.toFixed(
          1,
        )}% locked`;
      } else if (lockedLiquidityPct >= 50) {
        lpStatus = "locked";
        poolState = `LP majority locked (${dexName}) – ${lockedLiquidityPct.toFixed(
          1,
        )}% locked`;
      } else if (lockedLiquidityPct > 0) {
        lpStatus = "unlocked";
        poolState = `LP partially locked (${dexName}) – ${lockedLiquidityPct.toFixed(
          1,
        )}% locked`;
      } else {
        lpStatus = "unlocked";
        poolState = `Active pool (${dexName}) – LP unlockable`;
      }
    } else if (depthSOL !== null && depthSOL > 0) {
      lpStatus = "unlocked";
      poolState = `Active pool (${dexName})`;
    } else {
      lpStatus = "unknown";
      poolState = `Pool detected (${dexName}), depth unknown`;
    }

    if (depthSOL !== null) {
      poolState += `, depth ${depthSOL.toFixed(2)} SOL`;
    }
  } else {
    poolState = "No pool info resolved from top_pools relationships";
  }

  const result: ExtractedAnalysis = {
    top1Share,
    top10Share,
    metadataMutable,
    customFeesDetected,
    depthSOL,
    lpStatus,
    poolState,
    lockedLiquidityPct,
  };

  console.log("extractAnalysisData result:", result);
  return result;
}
