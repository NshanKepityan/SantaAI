"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  Info,
  TriangleAlert,
  Calendar,
  Wallet,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Gauge,
  Gift,
  Coins,
  Lock,
  Flame,
  Link2,
  ExternalLink,
  Loader2,
} from "lucide-react";

/**
 * SantaAI — Pump.fun Token Website (Solana)
 * React + Tailwind single page with Mint Analyzer hooked to /api/analyze
 */

export default function Page() {
  return <SantaAISite />;
}

function SantaAISite() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState<"analyze" | "chat">("analyze");
  const [mint, setMint] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Ho-Ho-HODL! I’m SantaAI 🎅🤖. Paste a Solana mint and I’ll score it for you." },
  ]);

  // Auto-read ?mint= from URL and analyze on load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const m = url.searchParams.get("mint");
    if (m && m.length > 20) {
      setMint(m);
      setTimeout(() => runAnalyze(m), 0);
    }
  }, []);

  function copyPermalink() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (mint) url.searchParams.set("mint", mint);
    navigator.clipboard.writeText(url.toString());
  }

  async function runAnalyze(m?: string) {
    const current = (m ?? mint).trim();
    if (!current) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mint: current }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (e: any) {
      try {
        const fallback = mockAnalysis(current);
        setResult(fallback);
        setError("Using demo analysis (backend not connected)");
      } catch {
        setError("Could not analyze this mint. Please check the address and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function runChat() {
    if (!prompt.trim()) return;
    const userMsg = { role: "user" as const, content: prompt };
    setChat((m) => [...m, userMsg]);
    setPrompt("");
    setTimeout(() => {
      setChat((m) => [
        ...m,
        { role: "assistant", content: "Ask me about LP status, holder concentration, or how the Santa Score works." },
      ]);
    }, 400);
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Snow />
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="h-9 w-9 grid place-items-center rounded-2xl bg-red-500/20 ring-1 ring-white/10 shadow"
            >
              <Gift className="h-5 w-5 text-red-300" />
            </motion.div>
            <span className="text-lg font-semibold tracking-tight">SantaAI</span>
            <span className="text-xs text-slate-400">on Solana · pump.fun</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition" href="#analyzer">Analyzer</a>
            <a className="hover:text-white transition" href="#how">How it works</a>
            <a className="hover:text-white transition" href="#faq">FAQ</a>
          </nav>
          <a
            href="#analyzer"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-500/90 hover:bg-red-500 transition px-4 py-2 text-sm font-medium shadow-lg shadow-red-500/20"
          >
            <Sparkles className="h-4 w-4" /> Try Mint Analyzer
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-20 bg-red-500" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-20 bg-emerald-500" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              SantaAI 🎅🤖 — Score any{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-emerald-200">
                Solana
              </span>{" "}
              mint
            </motion.h1>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Paste a mint address. Get LP status, holder concentration, liquidity depth, metadata risks, and a final{" "}
              <em>Santa Score</em> in seconds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#analyzer"
                className="rounded-2xl bg-red-500/90 hover:bg-red-500 px-5 py-2.5 font-medium shadow-lg shadow-red-500/20"
              >
                Open Analyzer
              </a>
              <a
                href="#how"
                className="rounded-2xl border border-white/10 hover:border-white/20 px-5 py-2.5 font-medium"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl"
          >
            <div className="text-sm text-slate-300">Analyzer preview</div>
            <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400"><ShieldCheck className="h-4 w-4"/> LP: Majority locked · depth 32 SOL</div>
              <div className="flex items-center gap-2 text-slate-400"><Coins className="h-4 w-4"/> Locked liquidity: 82% (green)</div>
              <div className="flex items-center gap-2 text-slate-400"><Wallet className="h-4 w-4"/> Top 10 wallets: 74% (high risk)</div>
              <div className="flex items-center gap-2 text-slate-400"><Info className="h-4 w-4"/> Metadata: immutable · No custom fees</div>
              <div className="flex items-center gap-2 text-slate-400"><Gauge className="h-4 w-4"/> Santa Score: 68/100</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ANALYZER */}
      <section id="analyzer" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-200">Mint Analyzer</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyPermalink}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"
                  title="Copy permalink"
                >
                  <Link2 className="h-3.5 w-3.5"/> Copy link
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") runAnalyze(); }}
                placeholder="Paste Solana mint address (e.g., DUhEx… or GU8idb…)"
                className="flex-1 rounded-2xl bg-slate-800/80 border border-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/40 font-mono"
              />
              <button
                onClick={() => runAnalyze()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-500/90 hover:bg-red-500 disabled:opacity-60 px-4 py-3 text-sm font-medium"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <SearchIcon className="h-4 w-4"/>}
                {loading ? "Analyzing…" : "Analyze"}
              </button>
            </div>

            <div className="mt-4">
              {error && (
                <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                  {error}
                </div>
              )}
              {loading ? (
                <Skeleton />
              ) : result ? (
                <AnalysisCard data={result} />
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">
                  Results will appear here. We’ll check LP status (burned/locked/unlocked), holder concentration, liquidity depth,
                  metadata mutability, custom fees, and compute a final Santa Score.
                </div>
              )}
            </div>
          </div>

          {/* Side panel / helper */}
          <aside className="space-y-4">
            <InfoCard
              title="Scoring at a glance"
              items={[
                { icon: <Lock className="h-4 w-4"/>, label: "LP locked / burned", val: "+30 / +20" },
                { icon: <ShieldCheck className="h-4 w-4"/>, label: "Fair holder spread", val: "+10" },
                { icon: <Coins className="h-4 w-4"/>, label: "Liquidity ≥ 20 SOL", val: "+6" },
                { icon: <TriangleAlert className="h-4 w-4"/>, label: "Whale / top-10 heavy", val: "−30" },
                { icon: <Flame className="h-4 w-4"/>, label: "Custom fees / honeypot", val: "−8" },
              ]}
            />

            <InfoCard
              title="Tips"
              items={[
                { icon: <Info className="h-4 w-4"/>, label: "Compare Santa Score with your own research" },
                { icon: <Info className="h-4 w-4"/>, label: "Check LP lock on the locker link too" },
                { icon: <Info className="h-4 w-4"/>, label: "Avoid tokens where 1–2 wallets control everything" },
              ]}
            />
          </aside>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h3 className="text-xl font-semibold">How SantaAI analyzes mints</h3>
          <ol className="mt-6 grid md:grid-cols-3 gap-5 text-sm text-slate-300">
            {[
              { step: "1", title: "Collect on-chain data", body: "Pulls token, pool and holder concentration data from on-chain DEX APIs." },
              { step: "2", title: "Evaluate risks", body: "Checks LP lock %, liquidity depth, holder concentration, metadata mutability, custom fees." },
              { step: "3", title: "Compute Santa Score", body: "Aggregates everything into a 0–100 score with transparent sub-scores and warnings." },
            ].map((s, i) => (
              <li key={i} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="text-3xl font-bold text-slate-500/60">{s.step}</div>
                <div className="mt-2 font-medium">{s.title}</div>
                <div className="mt-1 text-slate-400">{s.body}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-5 text-sm text-slate-300">
          <FaqItem q="What does LP status mean?" a="Whether liquidity is mostly locked/burned or freely removable. Locked/burned is generally safer." />
          <FaqItem q="How is the Santa Score computed?" a="LP, holder concentration, liquidity depth, metadata mutability, and custom fees all contribute to the 0–100 score." />
          <FaqItem q="Is this financial advice?" a="No. SantaAI is an informational tool. Always do your own research." />
          <FaqItem q="What chains are supported?" a="Solana first; more later if the elves keep up." />
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-slate-400">
          SantaAI © {new Date().getFullYear()} · Not financial advice.
        </div>
      </footer>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 animate-pulse">
      <div className="h-5 w-40 bg-white/10 rounded mb-3"/>
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 h-16"/>
        ))}
      </div>
      <div className="mt-4 h-24 rounded-xl border border-white/10 bg-white/5"/>
      <div className="mt-4 h-4 w-64 bg-white/10 rounded"/>
    </div>
  );
}

function toneClass(tone: "good" | "warn" | "bad" | "neutral") {
  switch (tone) {
    case "good": return "text-emerald-300 border-emerald-500/40 bg-emerald-500/5";
    case "warn": return "text-amber-300 border-amber-500/40 bg-amber-500/5";
    case "bad": return "text-red-300 border-red-500/40 bg-red-500/5";
    default: return "text-slate-200 border-white/10 bg-slate-900/60";
  }
}

function AnalysisCard({ data }: { data: AnalysisResult }) {
  const badge =
    data.lpStatus === "burned" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-1 text-xs">
        <CheckCircle2 className="h-3 w-3"/> LP effectively burned
      </span>
    ) : data.lpStatus === "locked" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 text-indigo-300 px-2 py-1 text-xs">
        <Lock className="h-3 w-3"/> LP locked
      </span>
    ) : data.lpStatus === "unlocked" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-300 px-2 py-1 text-xs">
        <XCircle className="h-3 w-3"/> LP unlockable
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 text-slate-300 px-2 py-1 text-xs">
        <Info className="h-3 w-3"/> LP unknown
      </span>
    );

  const lockedPct = data.lockedLiquidityPct;
  const depth = typeof data.depthSOL === "number" ? data.depthSOL : null;

  const top1Pct = Math.round((data.top1Share || 0) * 100);
  const top10Pct = Math.round((data.top10Share || 0) * 100);

  const lpTone: "good" | "warn" | "bad" | "neutral" =
    lockedPct != null
      ? lockedPct >= 95
        ? "good"
        : lockedPct >= 50
          ? "good"
          : lockedPct > 0
            ? "warn"
            : "bad"
      : "neutral";

  const depthTone: "good" | "warn" | "bad" | "neutral" =
    depth != null
      ? depth >= 50
        ? "good"
        : depth >= 20
          ? "warn"
          : "bad"
      : "neutral";

  const top1Tone: "good" | "warn" | "bad" | "neutral" =
    top1Pct >= 30 ? "bad" : top1Pct >= 15 ? "warn" : "good";

  const top10Tone: "good" | "warn" | "bad" | "neutral" =
    top10Pct >= 70 ? "bad" : top10Pct >= 50 ? "warn" : "good";

  const metaTone: "good" | "warn" | "bad" | "neutral" =
    data.metadataMutable ? "warn" : "good";

  const feeTone: "good" | "warn" | "bad" | "neutral" =
    data.customFeesDetected ? "bad" : "good";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium text-slate-200">
          Mint: <span className="font-mono text-slate-300">{shorten(data.mint)}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          {data.permalink ? (
            <button
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
              onClick={() => navigator.clipboard.writeText(data.permalink!)}
              title="Copy permalink"
            >
              <LinkIcon className="h-3.5 w-3.5"/> Copy link
            </button>
          ) : null}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
        <KV
          label="Pool & LP"
          value={data.poolState}
          icon={<Coins className="h-4 w-4" />}
          tone={lpTone}
        />
        <KV
          label="Liquidity depth"
          value={depth != null ? `${depth.toFixed(2)} SOL` : "Unknown"}
          icon={<Gauge className="h-4 w-4" />}
          tone={depthTone}
        />
        <KV
          label="Locked liquidity"
          value={
            lockedPct != null
              ? `${lockedPct.toFixed(1)}%`
              : "Unknown"
          }
          icon={<Lock className="h-4 w-4" />}
          tone={lpTone}
        />
        <KV
          label="Top 1 holder"
          value={`${top1Pct}% of supply`}
          icon={<Wallet className="h-4 w-4" />}
          tone={top1Tone}
        />
        <KV
          label="Top 10 holders"
          value={`${top10Pct}% of supply`}
          icon={<Wallet className="h-4 w-4" />}
          tone={top10Tone}
        />
        <KV
          label="Metadata"
          value={data.metadataMutable ? "Mutable (authority present)" : "Immutable (no mint/freeze authority)"}
          icon={<Info className="h-4 w-4" />}
          tone={metaTone}
        />
        <KV
          label="Custom fees / honeypot"
          value={
            data.customFeesDetected
              ? data.taxNote || "Custom fee / honeypot risk detected"
              : "No custom fees / honeypot flags"
          }
          icon={<TriangleAlert className="h-4 w-4" />}
          tone={feeTone}
        />
      </div>

      {/* Warnings */}
      {data.warnings?.length ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <TriangleAlert className="h-4 w-4"/> Warnings
          </div>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-400 space-y-1">
            {data.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      ) : null}

      {/* Score breakdown */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <ScoreBar score={data.finalScore} />
          <div className="text-xs text-slate-400">Santa Score</div>
        </div>
        {data.subscores ? (
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(data.subscores).map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-xs flex items-center justify-between"
              >
                <span className="capitalize text-slate-300">{labelize(k)}</span>
                <span className="tabular-nums text-slate-400">{v >= 0 ? `+${v}` : v}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {data.sources?.length ? (
        <div className="mt-4 text-[11px] text-slate-500">
          Sources:
          {data.sources.map((s, i) => (
            <a
              key={i}
              href={s.url || "#"}
              target="_blank"
              className="underline decoration-dotted mx-2 hover:text-slate-300"
            >
              {s.label}
              {s.url ? <ExternalLink className="inline h-3 w-3 ml-1"/> : null}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function KV({
  label,
  value,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  tone?: "good" | "warn" | "bad" | "neutral";
}) {
  return (
    <div className={`rounded-xl border px-3 py-3 ${toneClass(tone)}`}>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        {icon} <span className="text-slate-300">{label}</span>
      </div>
      <div className="mt-1 text-sm break-words">{value}</div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const barTone =
    pct >= 70 ? "bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400" :
    pct >= 40 ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-300" :
    "bg-gradient-to-r from-red-400 via-amber-300 to-yellow-300";

  return (
    <div className="flex items-center gap-2">
      <div className="w-48 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full ${barTone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm tabular-nums">{pct}/100</span>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: { icon: React.ReactNode; label: string; val?: string }[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
      <div className="text-sm font-medium text-slate-200">{title}</div>
      <ul className="mt-3 space-y-3">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm">
            <div className="flex items-center gap-2 text-slate-300">{it.icon}<span>{it.label}</span></div>
            {it.val ? <span className="text-xs text-slate-400">{it.val}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <div className="font-medium text-slate-200">{q}</div>
      <div className="mt-1 text-slate-400">{a}</div>
    </div>
  );
}

function shorten(a: string, left = 4, right = 3) {
  if (!a) return "";
  return a.length > left + right ? `${a.slice(0, left)}…${a.slice(-right)}` : a;
}

function labelize(k: string) {
  const m: Record<string, string> = {
    lp: "LP / Liquidity",
    creator: "Creator signal",
    tax: "Fees / honeypot",
    trading: "Trading depth",
    warnings: "Risk penalties",
  };
  return m[k] || k;
}

function Snow() {
  return (
    <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(white,transparent_70%)] opacity-[0.18]">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
            <circle cx="14" cy="10" r="0.8" fill="white" />
            <circle cx="22" cy="20" r="0.6" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

// ===== Types & Mock =====
export type AnalysisResult = {
  mint: string;
  lpStatus: "burned" | "locked" | "unlocked" | "unknown";
  poolState: string;
  depthSOL: number | null;
  lockedLiquidityPct: number | null;
  top1Share: number;
  top10Share: number;
  metadataMutable: boolean;
  customFeesDetected: boolean;
  taxNote?: string;
  warnings: string[];
  finalScore: number;
  subscores?: { lp: number; creator: number; tax: number; trading: number; warnings: number };
  sources: { label: string; url?: string }[];
  permalink?: string;
};

function mockAnalysis(mint: string): AnalysisResult {
  const lastChar = mint.trim().slice(-1);
  const burned = ["a", "e", "i", "o", "u"].includes(lastChar.toLowerCase());
  const locked = !burned && /[0-4]/.test(lastChar);
  const lpStatus: AnalysisResult["lpStatus"] = burned ? "burned" : locked ? "locked" : "unlocked";

  const depthSOL = burned ? 40 : locked ? 25 : 6;
  const lockedLiquidityPct = burned ? 99.5 : locked ? 72.3 : 0;

  const top1Share = burned ? 0.12 : 0.22;
  const top10Share = burned ? 0.55 : 0.78;

  const metadataMutable = !burned;
  const customFeesDetected = /[xyz]$/i.test(mint);

  const warnings: string[] = [];
  if (top1Share > 0.3) warnings.push("Single wallet holds a very large chunk of supply.");
  if (top10Share > 0.7) warnings.push("Top 10 wallets hold more than 70% of supply.");
  if (depthSOL < 10) warnings.push("Low liquidity — high volatility/risk.");
  if (customFeesDetected) warnings.push("Custom fee / honeypot-like behavior detected (demo heuristic).");

  const lpScore = lpStatus === "burned" ? 30 : lpStatus === "locked" ? 20 : 0;
  const tradingScore = depthSOL >= 50 ? 10 : depthSOL >= 20 ? 6 : depthSOL >= 10 ? 3 : 0;
  const creatorScore = 0;
  const taxScore = customFeesDetected ? -8 : 0;
  const warnPenalty = -5 * warnings.length;
  const finalScore = clamp(lpScore + tradingScore + creatorScore + taxScore + warnPenalty, 0, 100);

  return {
    mint,
    lpStatus,
    poolState:
      lpStatus === "unlocked"
        ? "Active pool (demo DEX), LP unlockable"
        : lpStatus === "locked"
        ? "Majority LP locked (demo DEX)"
        : "LP effectively burned (demo DEX)",
    depthSOL,
    lockedLiquidityPct,
    top1Share,
    top10Share,
    metadataMutable,
    customFeesDetected,
    taxNote: customFeesDetected ? "Custom fee risk (demo)" : "No custom fees detected (demo)",
    warnings,
    finalScore,
    subscores: {
      lp: lpScore,
      creator: creatorScore,
      tax: taxScore,
      trading: tradingScore,
      warnings: warnPenalty,
    },
    sources: [
      { label: "Demo source" },
    ],
    permalink: typeof window !== "undefined"
      ? (() => {
          const url = new URL(window.location.href);
          url.searchParams.set("mint", mint);
          return url.toString();
        })()
      : undefined,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
