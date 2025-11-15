// lib/analyzer/risk.ts

type RiskInput = {
  // Kept for compatibility, but not heavily used now
  creator: string;
  creationBlockTime: number | null;

  depthSOL: number | null;           // Liquidity depth in SOL
  lpAuthority?: string | null;       // Not relied on anymore for LP, but kept for future
  lockProvider?: string | null;      // e.g. "GeckoTerminal" if LP is marked locked

  lockedLiquidityPct: number | null; // 0..100 or null if unknown

  top1Share: number;                 // 0..1
  top10Share: number;                // 0..1

  metadataMutable: boolean;
  customFeesDetected: boolean;
};

export function computeRisksAndScore(input: RiskInput) {
  // ---------------- Thresholds ----------------
  // Holder concentration
  const THRESH_TOP1_WARN = 0.15;      // 15% - moderate
  const THRESH_TOP1_BAD  = 0.30;      // 30% - high risk

  const THRESH_TOP10_WARN = 0.50;     // 50% - moderate
  const THRESH_TOP10_BAD  = 0.70;     // 70% - high risk

  // Liquidity
  const THRESH_LIQ_LOW   = 10;        // <10 SOL = bad
  const THRESH_LIQ_OK    = 20;        // 10–20 SOL = weak but acceptable
  const THRESH_LIQ_GOOD  = 50;        // ≥50 SOL = strong

  const warnings: string[] = [];

  // ---------------- LP / Liquidity subscore ----------------
  let lpScore = 0;

  const lockedPct = input.lockedLiquidityPct;
  if (lockedPct != null) {
    if (lockedPct >= 95) {
      // Effectively burned
      lpScore += 30;
    } else if (lockedPct >= 50) {
      // Majority locked
      lpScore += 22;
    } else if (lockedPct > 0) {
      // Some lock, but owner still has flexibility
      lpScore += 8;
    } else {
      // 0% locked → fully removable LP
      lpScore -= 15;
      warnings.push("LP fully unlockable (0% locked) — higher rug risk.");
    }
  } else {
    // Unknown lock %, neutral score but add a note
    warnings.push("LP lock percentage unknown — verify lock status manually.");
  }

  // Liquidity depth effect
  let tradingScore = 0;
  if (typeof input.depthSOL === "number") {
    if (input.depthSOL >= THRESH_LIQ_GOOD) {
      tradingScore += 10;
    } else if (input.depthSOL >= THRESH_LIQ_OK) {
      tradingScore += 6;
    } else if (input.depthSOL >= THRESH_LIQ_LOW) {
      tradingScore += 3;
      warnings.push(
        `Liquidity is modest (~${input.depthSOL.toFixed(
          2,
        )} SOL) — expect volatility.`,
      );
    } else if (input.depthSOL > 0) {
      tradingScore -= 5;
      warnings.push(
        `Insufficient liquidity (~${input.depthSOL.toFixed(
          2,
        )} SOL) — very high volatility/risk.`,
      );
    } else {
      tradingScore -= 5;
      warnings.push("No liquidity detected in the main pool.");
    }
  } else {
    warnings.push("Liquidity depth unknown — pool data incomplete.");
  }

  // ---------------- Holder concentration ----------------
  const top1Pct = Math.round(input.top1Share * 100);
  const top10Pct = Math.round(input.top10Share * 100);

  let top1Penalty = 0;
  let top10Penalty = 0;

  // Top 1 wallet
  if (input.top1Share >= THRESH_TOP1_BAD) {
    top1Penalty = -30;
    warnings.push(
      `Private wallet holds ${top1Pct}% of supply (high rug risk / heavy centralization).`,
    );
  } else if (input.top1Share >= THRESH_TOP1_WARN) {
    top1Penalty = -15;
    warnings.push(
      `Private wallet holds ${top1Pct}% of supply (moderate centralization risk).`,
    );
  }

  // Top 10 wallets
  if (input.top10Share >= THRESH_TOP10_BAD) {
    top10Penalty = -25;
    warnings.push(
      `Top 10 wallets hold ${top10Pct}% of supply (high concentration / whale risk).`,
    );
  } else if (input.top10Share >= THRESH_TOP10_WARN) {
    top10Penalty = -12;
    warnings.push(
      `Top 10 wallets hold ${top10Pct}% of supply (moderate concentration).`,
    );
  }

  // ---------------- Metadata & custom fees ----------------
  const mutPenalty = input.metadataMutable ? -10 : 0;
  if (input.metadataMutable) {
    warnings.push(
      "Metadata mutability risk: mint or freeze authority present — token parameters can still be changed.",
    );
  }

  const feePenalty = input.customFeesDetected ? -8 : 0;
  if (input.customFeesDetected) {
    warnings.push(
      "Custom fees / honeypot risk: extra transfer fees or blocking patterns detected by upstream data.",
    );
  }

  // ---------------- Creator signal (soft, currently neutral) ----------------
  // Right now we don't have a solid creator reputation feed from CoinGecko/GeckoTerminal,
  // so we keep this neutral to avoid false confidence.
  const creatorScore = 0;

  // ---------------- Combine into Santa Score ----------------
  // We start from a neutral baseline (50) and adjust up/down based on risk factors.
  const base = 50;

  const finalScore = clamp(
    base +
      lpScore +
      tradingScore +
      creatorScore +
      feePenalty +
      top1Penalty +
      top10Penalty +
      mutPenalty,
    0,
    100,
  );

  return {
    warnings,
    finalScore,
    subscores: {
      lp: lpScore,                            // LP lock % impact
      creator: creatorScore,                  // reserved for future reputation data
      tax: feePenalty,                        // custom fee / honeypot penalty
      trading: tradingScore,                  // liquidity depth
      warnings: top1Penalty + top10Penalty + mutPenalty, // concentration + metadata
    },
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
