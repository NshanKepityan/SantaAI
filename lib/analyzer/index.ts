// lib/analyzer/index.ts
import { extractAnalysisData } from "./coingecko";
import { computeRisksAndScore } from "./risk";

/** ---------- Configuration (env) ---------- */
const ANALYZE_CACHE_TTL_MS = Number(
  process.env.ANALYZE_CACHE_TTL_MS || 5 * 60_000,
);
const MAX_CONCURRENT = Number(process.env.ANALYZE_MAX_CONCURRENCY || 2);

/** ---------- Shared state ---------- */
type CacheEntry<T> = { data: T; expires: number };
const respCache = new Map<string, CacheEntry<any>>();

let inFlight = 0;
const q: (() => void)[] = [];

function acquire(): Promise<void> {
  return new Promise((resolve) => {
    const go = () => {
      if (inFlight < MAX_CONCURRENT) {
        inFlight++;
        resolve();
      } else {
        q.push(go);
      }
    };
    go();
  });
}

function release() {
  inFlight = Math.max(0, inFlight - 1);
  const next = q.shift();
  if (next) next();
}

/** ---------- Types ---------- */
export type AnalyzeOptions = {
  mint: string;
  network?: string; // Optional network override (default: solana)
};

export type AnalysisResult = {
  mint: string;

  // LP / Liquidity
  lpStatus: "burned" | "locked" | "unlocked" | "unknown";
  poolState: string;
  depthSOL: number | null;
  lockedLiquidityPct: number | null;

  // Risks / metrics
  top10Share: number; // 0..1
  metadataMutable: boolean;
  customFeesDetected: boolean;

  taxNote?: string;
  warnings: string[];
  finalScore: number;
  subscores: {
    lp: number;
    creator: number;
    tax: number;
    trading: number;
    warnings: number;
  };

  sources: { label: string; url?: string }[];
  permalink?: string;
};

/** ---------- Main entry ---------- */
export async function analyzeMint(opts: AnalyzeOptions): Promise<AnalysisResult> {
  const ck = `analyze:${opts.mint}`;
  const now = Date.now();
  const cached = respCache.get(ck);
  if (cached && cached.expires > now) {
    return cached.data as AnalysisResult;
  }

  await acquire();
  try {
    const again = respCache.get(ck);
    if (again && again.expires > Date.now()) {
      return again.data as AnalysisResult;
    }

    // Single orchestrated call to GeckoTerminal
    const analysisData = await extractAnalysisData(opts.mint);

    const scored = computeRisksAndScore({
	  creator: "Unknown", // not available from this API (kept for future)
	  creationBlockTime: null,
	  depthSOL: analysisData.depthSOL,
	  lpAuthority: undefined, // we rely on lockedLiquidityPct instead
	  lockProvider: analysisData.lpStatus === "locked" ? "GeckoTerminal" : null,
	  lockedLiquidityPct: analysisData.lockedLiquidityPct ?? null,
	  top10Share: analysisData.top10Share,
	  metadataMutable: analysisData.metadataMutable,
	  customFeesDetected: analysisData.customFeesDetected,
	});

    const result: AnalysisResult = {
      mint: opts.mint,

      lpStatus: analysisData.lpStatus,
      poolState: analysisData.poolState,
      depthSOL: analysisData.depthSOL,
      lockedLiquidityPct: analysisData.lockedLiquidityPct,
      top10Share: analysisData.top10Share,
      metadataMutable: analysisData.metadataMutable,
      customFeesDetected: analysisData.customFeesDetected,

      taxNote: analysisData.customFeesDetected
        ? "Custom fees / honeypot-ish risk detected by on-chain info"
        : "No custom fees / honeypot detected by on-chain info",
      warnings: scored.warnings,
      finalScore: scored.finalScore,
      subscores: scored.subscores,

      sources: [
        {
          label: "GeckoTerminal: token",
          url: `https://www.geckoterminal.com/${opts.network || "solana"}/tokens/${opts.mint}`,
        },
      ],
    };

    respCache.set(ck, { data: result, expires: Date.now() + ANALYZE_CACHE_TTL_MS });
    return result;
  } finally {
    release();
  }
}
