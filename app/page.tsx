"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Twitter,
  Send,
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

import SectionHeader from "@/components/SectionHeader";
import SectionHeaderHighliteLeft from "@/components/SectionHeaderHighliteLeft";

/**
 * SantaAI — Pump.fun Token Website (Solana)
 * React + Tailwind single page with Mint Analyzer hooked to /api/analyze
 */

const SANTA_MINT = "EEAJy2y48DVMHxXp2ej9bpaLNPYgTL8yT4xxttRkpump";
const PUMP_FUN = "https://pump.fun/coin/EEAJy2y48DVMHxXp2ej9bpaLNPYgTL8yT4xxttRkpump";
const DEX = "https://dexscreener.com/solana/EEAJy2y48DVMHxXp2ej9bpaLNPYgTL8yT4xxttRkpump";
const TWITTER = "https://x.com/Santa_AI_sol";

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
    <div className="min-h-screen w-full overflow-x-hidden scroll-smooth bg-[#0a0118]-950/40 text-white">
      <Snow />
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#050014]/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="h-9 w-9 grid place-items-center rounded-2xl bg-fuchsia-500/30 ring-1 ring-white/20 shadow"
            >
              <Image
                src="/logo.png"
                alt="SantaAI"
                width={28}
                height={28}
                className="rounded-full"
              />
            </motion.div>
            <span className="text-lg font-semibold tracking-tight">SantaAI</span>
            <span className="text-xs text-slate-400">on Solana · pump.fun</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition" href="#about">About</a>
            <a className="hover:text-white transition" href="#analyzer">Analyzer</a>
            <a className="hover:text-white transition" href="#why">Why SantaScore</a>
            <a className="hover:text-white transition" href="#roadmap">Roadmap</a>
            <a className="hover:text-white transition" href="#how">How it works</a>
            <a className="hover:text-white transition" href="#community">FAQ</a>
          </nav>
          <a
            href="#analyzer"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-400 hover:to-cyan-300 transition px-4 py-2 text-sm font-medium shadow-lg shadow-fuchsia-500/30"
          >
            <Sparkles className="h-4 w-4" /> Try Mint Analyzer
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
	<section
	  className="relative min-h-[90vh] bg-cover bg-center bg-no-repeat flex items-center"
	  style={{ backgroundImage: "url('/hero_1.png')" }}
	>
	  {/* Optional dark overlay */}
	  <div className="absolute inset-0 bg-black/40"></div>

	  <div className="relative mx-auto max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
		{/* Left side text */}
		<div>
		  <motion.h1
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-xl"
		  >
			SantaAI 🎅🤖 — Analyze Any{" "}
			<span className="text-red-300">Solana Mint</span>
		  </motion.h1>

		  <p className="mt-4 text-slate-200 text-lg max-w-xl">
			Paste a Solana mint address and instantly get LP status, liquidity, holder concentration, metadata risks, and a final SantaScore™.
		  </p>

		  {/* Mint input copy block */}
		  <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4 flex items-center gap-3 font-mono text-sm text-slate-200">
				
					<span className="truncate max-w-[clamp(12rem,70vw,32rem)] font-mono text-xl text-white/70 select-all">
					  {SANTA_MINT}
					</span>
					<button
					  onClick={() => {
						navigator.clipboard.writeText(SANTA_MINT);
						const toast = document.createElement('div');
						toast.textContent = 'Copied!';
						toast.className =
						  'fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-black shadow-lg animate-[fade_1.5s_ease-out_forwards]';
						document.body.appendChild(toast);
						setTimeout(() => toast.remove(), 1500);
					  }}
					  className="shrink rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/30 transition"
					>
					  Copy
					</button>

			  <style jsx>{`
				@keyframes fade {
				  0% { opacity: 0; transform: translateY(6px) translateX(-50%); }
				  15% { opacity: 1; transform: translateY(0) translateX(-50%); }
				  85% { opacity: 1; transform: translateY(0) translateX(-50%); }
				  100% { opacity: 0; transform: translateY(-6px) translateX(-50%); }
				}
			  `}</style>
            </div>

		  {/* Coin action links */}
		  <div className="mt-6 flex flex-wrap gap-3">
			<a
			  href={PUMP_FUN}
			  target="_blank"
			  className="px-5 py-2.5 rounded-2xl font-medium bg-red-500/90 hover:bg-red-500 border border-white/10 shadow-red-500/20 shadow-lg"
			>
				Pump.fun
			</a>

			<a
			  href="#analyzer"
			  className="px-5 py-2.5 rounded-2xl font-medium border border-white/20 hover:bg-white/10 transition"
			>
			  Analyzer
			</a>

			<a
			  href={DEX}
			  target="_blank"
			  className="px-5 py-2.5 rounded-2xl font-medium bg-white/10 hover:bg-white/20 border border-white/10"
			>
			  DexScreener
			</a>

			
			<a
            href={TWITTER}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-2xl font-medium bg-white/10 hover:bg-white/20 border border-white/10"
          >
            <Twitter className="h-8 w-8" />
          </a>
		  </div>
		</div>

		{/* Preview box */}
		<motion.div
		  initial={{ opacity: 0, scale: 0.98 }}
		  animate={{ opacity: 1, scale: 1 }}
		  transition={{ duration: 0.6 }}
		  className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl"
		>
		  <div className="text-sm text-slate-300">Analyzer preview</div>
		  <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-200 space-y-2 text-xs">
			<div className="flex items-center gap-2 text-slate-300">
			  <ShieldCheck className="h-4 w-4" /> LP: Locked · depth 32 SOL
			</div>
			<div className="flex items-center gap-2 text-slate-300">
			  <Coins className="h-4 w-4" /> Locked liquidity: 82%
			</div>
			<div className="flex items-center gap-2 text-slate-300">
			  <Wallet className="h-4 w-4" /> Top 10 wallets: 74%
			</div>
			<div className="flex items-center gap-2 text-slate-300">
			  <Info className="h-4 w-4" /> Metadata immutable
			</div>
			<div className="flex items-center gap-2 text-slate-300">
			  <Gauge className="h-4 w-4" /> SantaScore: 68/100
			</div>
		  </div>
		</motion.div>
	  </div>
	</section>

      {/* ABOUT SANTAAI */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-1">
		  
			<SectionHeader title="What is" highlight="SantaAI" />
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              SantaAI is your neon–Christmas guardian for Solana mints. It aggregates liquidity,
              holder concentration, metadata mutability and transfer fee flags into a single
              <span className="text-fuchsia-300 font-semibold"> SantaScore</span>. Use it before
              aping into any new token, sharing CA on X, or shilling in Telegram.
            </p>
            <p className="mt-4 text-sm md:text-base text-slate-300 leading-relaxed">
              The goal: become Solana’s trusted AI security assistant for new mints, while keeping
              the vibes fun, degen and on-brand for the season.
            </p>
          </div>
          <div className="order-2 justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src="/side.png"
                alt="SantaAI abstract side art"
                width={600}
                height={600}
                className="rounded-3xl shadow-2xl border border-white/10"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-fuchsia-400/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

     

      {/* ANALYZER */}
<section
  id="analyzer"
  className="relative py-24"
>
  {/* FULL BACKGROUND */}
  <div className="absolute inset-0 -z-10">
    <Image
      src="/side.png"
      alt="Analyzer Background"
      fill
      className="object-cover object-center"
    />
    {/* Dark fade overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#050014]/80 via-[#050014]/85 to-[#050014]/95" />
  </div>

  {/* HEADER — centered inside the whole section */}
  <div className="px-4">
    <SectionHeaderHighliteLeft
      highlight="SantaAI"
      title="Mint Analyzer"
    />
  </div>

  {/* CONTENT WRAPPER */}
  <div className="mx-auto max-w-7xl px-4 pb-16">
    <div className="grid lg:grid-cols-3 gap-6">

      {/* LEFT ANALYZER PANEL */}
      <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Mint Analyzer</div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyPermalink}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Copy permalink"
            >
              <Link2 className="h-3.5 w-3.5" /> Copy link
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runAnalyze();
            }}
            placeholder="Paste Solana mint address (e.g., DUhEx… or GU8idb…)"
            className="flex-1 rounded-2xl bg-[#050016]/80 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/50 font-mono"
          />
          <button
            onClick={() => runAnalyze()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-400 hover:to-cyan-300 disabled:opacity-60 px-4 py-3 text-sm font-medium shadow-md shadow-fuchsia-500/30"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>

        <div className="mt-4">
          {error && (
            <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-xs text-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <Skeleton />
          ) : result ? (
            <AnalysisCard data={result} />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-300 bg-black/30">
              Results will appear here. We’ll check LP status (burned/locked/unlocked), holder concentration,
              liquidity depth, metadata mutability, custom fees, and compute a final Santa Score.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="space-y-4">
        <InfoCard
          title="Scoring at a glance"
          items={[
            { icon: <Lock className="h-4 w-4" />, label: "LP locked / burned", val: "+30 / +20" },
            { icon: <ShieldCheck className="h-4 w-4" />, label: "Fair holder spread", val: "+10" },
            { icon: <Coins className="h-4 w-4" />, label: "Liquidity ≥ 20 SOL", val: "+6" },
            { icon: <TriangleAlert className="h-4 w-4" />, label: "Whale / top-10 heavy", val: "−30" },
            { icon: <Flame className="h-4 w-4" />, label: "Custom fees / honeypot", val: "−8" },
          ]}
        />

        <InfoCard
          title="Tips"
          items={[
            { icon: <Info className="h-4 w-4" />, label: "Compare SantaScore with your own research" },
            { icon: <Info className="h-4 w-4" />, label: "Check LP lock on the locker link too" },
            { icon: <Info className="h-4 w-4" />, label: "Avoid tokens where 1–2 wallets control everything" },
          ]}
        />
      </aside>
    </div>
  </div>
</section>

 {/* WHY SANTASCORE MATTERS */}
      <section
        id="why"
        className="relative border-y border-white/10 py-20 overflow-hidden"
      >

        <div className="mx-auto max-w-7xl px-4">
          
		  <SectionHeader title="Why " highlight="SantaScore Matters" />
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur">
              <h3 className="font-semibold text-fuchsia-200 mb-2">Holder Risk</h3>
              <p className="text-slate-300">
                Detects whale dominance, top-10 wallet concentration and flags
                potentially dangerous private wallets.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur">
              <h3 className="font-semibold text-cyan-200 mb-2">Metadata & Fees</h3>
              <p className="text-slate-300">
                Checks if metadata is mutable, mint/freeze authority is still active and if
                Token-2022 custom transfer fees are present.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur">
              <h3 className="font-semibold text-emerald-200 mb-2">Liquidity Safety</h3>
              <p className="text-slate-300">
                Evaluates LP lock status, locked liquidity percentage and depth in SOL — thin,
                unlockable liquidity is treated as high risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
<section
  id="roadmap"
  className="relative py-28 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/roadmap_bg.png')" }}
>
  {/* Overlay for contrast */}
  <div className="absolute inset-0 bg-black/55"></div>

  <div className="relative mx-auto max-w-7xl px-4">
  
		  <SectionHeaderHighliteLeft highlight="🎄 SantaAI " title="Roadmap" />

    {/* PHASES — 2 COLUMN GRID (from sm upward) */}
    <div className="grid sm:grid-cols-2 gap-10">

      {/* COLUMN 1 */}
      <div className="space-y-8">
        {/* Phase 1 */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl backdrop-blur">
          <h3 className="text-xl font-semibold text-red-300">🎄 Phase 1 — Launch & Foundation</h3>
          <ul className="mt-3 text-sm text-slate-200 space-y-2">
            <li>✔ Launch SantaAI website</li>
            <li>✔ SantaAI Mint Analyzer</li>			
			<li>✔ Provide holder concentration scoring</li>
			<li>✔ Provide metadata risk detection</li>
			<li>✔ Liquidity lock tracking</li>
			<li>✔ SantaScore system</li>    
            <li>✔ Launch token on Pump.fun</li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl backdrop-blur">
          <h3 className="text-xl font-semibold text-emerald-300">🎁 Phase 2 — Ecosystem Growth</h3>
          <ul className="mt-3 text-sm text-slate-200 space-y-2">
            <li>🔥 Bond and migrate to live-market trading</li>
            <li>🔥 Reach 500 holders milestone</li>
            <li>🎅 Expand analyzer with:</li>
			<li>🎅 Honeypot & dev wallet analyzer</li>
            <li>🎅 Dev wallet analyze</li>
            <li>🎅 Bundled wallets detection</li>
            <li>🎁 SantaScore dashboard expansion</li>
            <li>🎁 Hot mints leaderboard</li>
            <li>🎁 Social shareable SantaScore cards</li>
          </ul>
        </div>
      </div>

      {/* COLUMN 2 */}
      <div className="space-y-8">
        {/* Phase 3 */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl backdrop-blur">
          <h3 className="text-xl font-semibold text-indigo-300">🤖 Phase 3 — Analyzer Bot</h3>
          <ul className="mt-3 text-sm text-slate-200 space-y-2">
            <li>🤖 Telegram SantaAI Analyzer Bot release</li>
            <li>Paste mint → instant LP, holders, liquidity, SantaScore</li>
            <li>🎁 GPL (Good Project List): Santa-approved mints</li>
          </ul>
        </div>

        {/* Phase 4 */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl backdrop-blur">
          <h3 className="text-xl font-semibold text-yellow-300">🛎 Phase 4 — Buy Bot</h3>
          <ul className="mt-3 text-sm text-slate-200 space-y-2">
            <li>🤖 Telegram SantaAI Buy Bot release</li>
            <li>Neon-themed buy/sell alerts</li>
            <li>Holder milestones & LP change alerts</li>
            <li>SantaScore badge per alert</li>
          </ul>
        </div>

        {/* Long-Term Vision */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl backdrop-blur">
          <h3 className="text-xl font-semibold text-pink-300">🎅 Long-Term Vision</h3>
          <ul className="mt-3 text-sm text-slate-200 space-y-2">
            <li>🎄 Become the trusted AI security layer for Solana mints</li>
            <li>🎄 AI-powered verification for token creators</li>
            <li>🎄 SantaAI API for third-party platforms</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>



      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-white/10 bg-[#060112]/80">
        <div className="mx-auto max-w-7xl px-4 py-16">
		
		  <SectionHeader  title="How" highlight="SantaAI analyzes mints" />
          <ol className="mt-6 grid md:grid-cols-3 gap-5 text-sm text-slate-300">
            {[
              {
                step: "1",
                title: "Collect on-chain & DEX data",
                body: "Pulls token, pool and holder concentration statistics from Solana DEX / analytics APIs.",
              },
              {
                step: "2",
                title: "Evaluate risks",
                body: "Checks LP lock %, liquidity depth, holder concentration, metadata mutability and custom fees.",
              },
              {
                step: "3",
                title: "Compute SantaScore",
                body: "Aggregates everything into a 0–100 score with transparent sub-scores and human-readable warnings.",
              },
            ].map((s, i) => (
              <li key={i} className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
                <div className="text-3xl font-bold text-slate-500/70">{s.step}</div>
                <div className="mt-2 font-medium">{s.title}</div>
                <div className="mt-1 text-slate-400">{s.body}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

	{/* COMMUNITY */}
<section id="community" className="border-t border-white/10 bg-slate-900/40">
  <div className="mx-auto max-w-7xl px-4 py-16">
    <div className="grid items-center gap-10 md:grid-cols-2">
      {/* Logo / token icon */}
      <div className="flex justify-center">
        <img
          src="/logo-512.png"
          alt="SantaAI token icon"
          className="w-28 sm:w-36 md:w-44 rounded-full ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/20"
        />
      </div>

      {/* Text + buttons */}
      <div className="min-w-0">
        {/* Assuming you already have this component */}
        <SectionHeader title="Join the" highlight="SantaAI Community" />

        <p className="mt-3 text-sm md:text-base text-white/80">
          Follow updates, giveaways and dev reports. New art, stickers and utility rollouts
          will be announced in Telegram and X.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
          <a
            href={TWITTER}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15 hover:bg-white/15 hover:-translate-y-0.5 transition transform"
          >
            <Twitter className="h-8 w-8" />
            <span>Follow X</span>
          </a>

        </div>
      </div>
    </div>
  </div>
</section>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-400 flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="SantaAI logo small"
            width={60}
            height={60}
            className="opacity-80"
          />
          <div>SantaAI © {new Date().getFullYear()} · Not financial advice.</div>
        </div>
      </footer>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 animate-pulse">
      <div className="h-5 w-40 bg-white/10 rounded mb-3" />
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 h-16" />
        ))}
      </div>
      <div className="mt-4 h-24 rounded-xl border border-white/10 bg-white/5" />
      <div className="mt-4 h-4 w-64 bg-white/10 rounded" />
    </div>
  );
}

function toneClass(tone: "good" | "warn" | "bad" | "neutral") {
  switch (tone) {
    case "good":
      return "text-emerald-300 border-emerald-500/40 bg-emerald-500/5";
    case "warn":
      return "text-amber-300 border-amber-500/40 bg-amber-500/5";
    case "bad":
      return "text-red-300 border-red-500/40 bg-red-500/5";
    default:
      return "text-slate-200 border-white/10 bg-slate-900/60";
  }
}

function AnalysisCard({ data }: { data: AnalysisResult }) {
  const badge =
    data.lpStatus === "burned" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-1 text-xs">
        <CheckCircle2 className="h-3 w-3" /> LP effectively burned
      </span>
    ) : data.lpStatus === "locked" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 text-indigo-300 px-2 py-1 text-xs">
        <Lock className="h-3 w-3" /> LP locked
      </span>
    ) : data.lpStatus === "unlocked" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-300 px-2 py-1 text-xs">
        <XCircle className="h-3 w-3" /> LP unlockable
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 text-slate-300 px-2 py-1 text-xs">
        <Info className="h-3 w-3" /> LP unknown
      </span>
    );

  const lockedPct = data.lockedLiquidityPct;
  const depth = typeof data.depthSOL === "number" ? data.depthSOL : null;

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
    depth != null ? (depth >= 50 ? "good" : depth >= 20 ? "warn" : "bad") : "neutral";

  const top10Tone: "good" | "warn" | "bad" | "neutral" =
    top10Pct >= 70 ? "bad" : top10Pct >= 50 ? "warn" : "good";

  const metaTone: "good" | "warn" | "bad" | "neutral" =
    data.metadataMutable ? "warn" : "good";

  const feeTone: "good" | "warn" | "bad" | "neutral" =
    data.customFeesDetected ? "bad" : "good";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
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
              <LinkIcon className="h-3.5 w-3.5" /> Copy link
            </button>
          ) : null}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
        <KV label="Pool & LP" value={data.poolState} icon={<Coins className="h-4 w-4" />} tone={lpTone} />
        <KV
          label="Liquidity depth"
          value={depth != null ? `${depth.toFixed(2)} SOL` : "Unknown"}
          icon={<Gauge className="h-4 w-4" />}
          tone={depthTone}
        />
        <KV
          label="Locked liquidity"
          value={lockedPct != null ? `${lockedPct.toFixed(1)}%` : "Unknown"}
          icon={<Lock className="h-4 w-4" />}
          tone={lpTone}
        />
        <KV
          label="Top 10 holders"
          value={`${top10Pct}% of supply`}
          icon={<Wallet className="h-4 w-4" />}
          tone={top10Tone}
        />
        <KV
          label="Metadata"
          value={
            data.metadataMutable ? "Mutable (authority present)" : "Immutable (no mint/freeze authority)"
          }
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
            <TriangleAlert className="h-4 w-4" /> Warnings
          </div>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-400 space-y-1">
            {data.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
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
              {s.url ? <ExternalLink className="inline h-3 w-3 ml-1" /> : null}
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
    pct >= 70
      ? "bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400"
      : pct >= 40
      ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-300"
      : "bg-gradient-to-r from-red-400 via-amber-300 to-yellow-300";

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
    <div className="rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur">
      <div className="text-sm font-medium text-slate-200">{title}</div>
      <ul className="mt-3 space-y-3">
        {items.map((it, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm"
          >
            <div className="flex items-center gap-2 text-slate-300">
              {it.icon}
              <span>{it.label}</span>
            </div>
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

function RoadmapCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur shadow-lg shadow-fuchsia-500/10">
      <div className="font-semibold text-fuchsia-200 mb-2">{title}</div>
      <ul className="text-slate-200/90 text-xs md:text-sm space-y-1.5">
        {items.map((it, i) => (
          <li key={i}>• {it}</li>
        ))}
      </ul>
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
    sources: [{ label: "Demo source" }],
    permalink:
      typeof window !== "undefined"
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
