"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Briefcase,
  Zap,
  Network,
  CheckCircle,
  ChartSpline
} from "lucide-react";
import React from "react";

type Item = { text: string; done?: boolean };

const PATH =
  "M60,220 C240,80 420,350 640,300 C830,260 880,120 1080,200 C1200,260 1250,340 1240,380";
  
export default function RoadmapPath() {
  return (
    <section
      id="roadmap"
      className="
        relative bg-[#080214] text-white
        pt-24 md:pt-36 pb-32 md:pb-44
        overflow-visible
      "
    >
      {/* soft Vaulty brand glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_30%,#ffb34a22_0%,transparent_60%),radial-gradient(50%_60%_at_20%_80%,#00fff522_0%,transparent_60%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center" />

      <div className="relative mx-auto max-w-7xl px-6">
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-300 bg-clip-text text-transparent">
              $VAULTY Roadmap
            </span>
          </h2>
          <p className="mt-3 text-white/70">
            A winding path the Fox takes to guard your bags.
          </p>
        </header>

        {/* Wave path */}
        <svg
		viewBox="0 0 1200 420"
		className="mx-auto w-full h-[220px] md:h-[260px] lg:h-[280px]"
		preserveAspectRatio="xMidYMid slice"
		shapeRendering="geometricPrecision"
	  >
		<defs>
		  <linearGradient id="vaultyStroke" x1="0" x2="1" y1="0" y2="0">
			<stop offset="0%" stopColor="#00fff0" />
			<stop offset="50%" stopColor="#8a2be2" />
			<stop offset="100%" stopColor="#ffaf4d" />
		  </linearGradient>

		  {/* optional soft glow */}
		  <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="6" result="blur" />
			<feMerge>
			  <feMergeNode in="blur" />
			  <feMergeNode in="SourceGraphic" />
			</feMerge>
		  </filter>
		</defs>

		{/* 1) HALO (same path, thicker, low opacity) */}
		<path
		  d={PATH}
		  stroke="url(#vaultyStroke)"
		  strokeWidth="12"
		  opacity="0.22"	
		  fill="none"
		  strokeLinecap="round"
		  strokeLinejoin="round"
		  filter="url(#softGlow)"
		/>

		{/* 2) BASE (animated draw) */}
		<motion.path
		  d={PATH}
		  stroke="url(#vaultyStroke)"
		  strokeWidth="5"
		  fill="none"
		  strokeLinecap="round"
		  strokeLinejoin="round"
		  initial={{ pathLength: 0 }}
		  whileInView={{ pathLength: 1 }}
		  viewport={{ once: true }}
		  transition={{ duration: 2.1, ease: "easeInOut" }}
		/>

		{/* 3) SUBTLE HIGHLIGHT to hide any seam */}
		<path
		  d={PATH}
		  stroke="rgba(255,255,255,0.25)"
		  strokeWidth="1"
		  fill="none"
		  strokeLinecap="round"
		  strokeLinejoin="round"
		  style={{ mixBlendMode: "screen" }}
		/>
	  </svg>

        {/* Non-linear cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-x-6 mt-4">
          {/* Phase 1 */}
          <div className="md:col-span-4 lg:col-span-3 md:-mt-20">
            <PhaseCard
                tone="from-emerald-500/25 to-green-700/15"
                ring="ring-emerald-400/60"
                icon={<ChartSpline className="h-5 w-5 text-emerald-300" />}
                title="Phase 1 – The Awakening"
                status="💼 In Progress"
                blurb="Laying the foundation for the Vault."
                items={[
				  { text: "Token creation & deployment", done: true },
				  { text: "LP locked", done: true },
				  { text: "Website launch", done: true },
				  { text: "X & Telegram setup", done: true },
				  { text: "Branding complete", done: true },
				  { text: "500 holders", done: false},
				  { text: "$100K MC", done: false}
				]}
				goal = "🎯 Create community of vault keepers"
                hereLabel="We are here" 	// marker at end of Phase 1
              />
          </div>

          {/* Phase 2 */}
          <div className="md:col-span-4 lg:col-span-3 md:-mt-8">
            <PhaseCard
              tone="from-amber-500/20 to-orange-700/15"
              ring="ring-orange-400/60"
              icon={<Briefcase className="h-5 w-5 text-orange-300" />}
              title="Phase 2 – The Expansion"
              status="💼 In Progress"
              blurb="Building community and recognition."
              items={[
                { text: "“Guard Your Bags” movement" },
                { text: "Marketing & influencer collabs" },
                { text: "Collaboration with TaxSplit" },
              ]}
              goal="🎯 1,000 holders | $500K MC"
            />
          </div>

          {/* Phase 3 */}
          <div className="md:col-span-4 lg:col-span-3 md:-mt-10 lg:-mt-10">
            <PhaseCard
              tone="from-cyan-500/25 to-sky-700/15"
              ring="ring-cyan-400/60"
              icon={<Zap className="h-5 w-5 text-cyan-300" />}
              title="Phase 3 – The Re-Vault"
              status="⚡ Coming Soon"
              blurb="Next-gen investor reward protocol."
              items={[
                { text: "Re-Vault utility coin launch" },
                { text: "Dynamic on-chain redistribution" },
                { text: "Compounding auto-rewards" },
                { text: "Re-Vault Buy Bot" },
              ]}
              goal="🎯 Evolving reward system with volume"
            />
          </div>

          {/* Phase 4 */}
          <div className="md:col-span-12 lg:col-span-3 md:-mt-10 lg:-mt-14">
            <PhaseCard
              tone="from-fuchsia-500/25 to-purple-700/15"
              ring="ring-fuchsia-400/60"
              icon={<Network className="h-5 w-5 text-fuchsia-300" />}
              title="Phase 4 – The Vault Network"
              status="🔥 Expansion"
              blurb="Expanding the fox’s territory."
              items={[
                { text: "Multi-token Re-Vault integration" },
                { text: "Integration Bot launch" },
                { text: "Reward dashboard & analytics" },
                { text: "$VAULTY as stable asset for Re-Vault" },
              ]}
            />
          </div>
        </div>

        {/* Mobile fallback: stacked cards */}
        <div className="md:hidden mt-10 space-y-6">
          <MobilePhase
            icon={<CheckCircle className="h-5 w-5 text-emerald-300" />}
            title="Phase 1 – The Awakening"
            status="✅ Completed"
            blurb="Laying the foundation for the Vault."
            items={[
              { text: "Token creation & deployment", done: true },
              { text: "LP locked", done: true },
              { text: "Website launch", done: true },
              { text: "X & Telegram setup", done: true },
              { text: "Branding complete", done: true },
            ]}
            goal="🎯 500 holders | $100K MC"
            badge="We are here"
          />
          <MobilePhase
            icon={<Briefcase className="h-5 w-5 text-orange-300" />}
            title="Phase 2 – The Expansion"
            status="💼 In Progress"
            blurb="Building community and recognition."
            items={[
              { text: "“Guard Your Bags” movement" },
              { text: "Marketing & influencer collabs" },
              { text: "Collaboration with TaxSplit" },
            ]}
            goal="🎯 1,000 holders | $500K MC"
          />
          <MobilePhase
            icon={<Zap className="h-5 w-5 text-cyan-300" />}
            title="Phase 3 – The Re-Vault"
            status="⚡ Coming Soon"
            blurb="Next-gen investor reward protocol."
            items={[
              { text: "Re-Vault utility coin launch" },
              { text: "Dynamic on-chain redistribution" },
              { text: "Compounding auto-rewards" },
              { text: "Re-Vault Buy Bot" },
            ]}
            goal="🎯 Evolving reward system with volume"
          />
          <MobilePhase
            icon={<Network className="h-5 w-5 text-fuchsia-300" />}
            title="Phase 4 – The Vault Network"
            status="🔥 Expansion"
            blurb="Expanding the fox’s territory."
            items={[
              { text: "Multi-token Re-Vault integration" },
              { text: "Integration Bot launch" },
              { text: "Reward dashboard & analytics" },
              { text: "$VAULTY as stable asset for Re-Vault" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------ Phase Card ------------- */
function PhaseCard({
  title,
  status,
  blurb,
  items,
  goal,
  icon,
  tone,
  ring,
  hereLabel,
}: {
  title: string;
  status: string;
  blurb: string;
  items: Item[];
  goal?: string;
  icon: React.ReactNode;
  tone: string; // gradient
  ring: string; // ring color class
  hereLabel?: string;
}) {
  return (
    <div className="relative">
      {/* anchor dot — skip if we render 'We are here' */}
	  <motion.span
		  className={`absolute -top-10 left-8 h-5 w-5 rounded-full ${
			hereLabel ? "bg-cyan-400 ring-4 ring-cyan-500/50" : "bg-white/90 ring-4 " + ring
		  }`}
		  animate={{ scale: [1, 1.15, 1] }}
		  transition={{ duration: 1.6, repeat: Infinity }}
		  style={{ zIndex: hereLabel ? 0 : 10 }}
		/>

      <div
        className={`rounded-2xl border border-white/10 bg-gradient-to-br ${tone}
        backdrop-blur-md shadow-xl p-6 md:p-8 transform md:-translate-y-4
        hover:-translate-y-2 transition-transform duration-300
        ${items.every((i) => i.done) ? "ring-1 ring-emerald-400/40 shadow-emerald-500/20" : ""}
        `}
      >
        <div className="mb-2 flex items-center gap-3">
          {icon}
          <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
          <span className="ml-auto text-sm text-white/70">{status}</span>
        </div>

        <p className="text-base text-white/80 mb-4">{blurb}</p>

        <ul className="text-base text-white/80 space-y-2 mb-4">
          {items.map((i) => (
            <li key={i.text} className="flex items-start gap-2">
              {i.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 text-white/35 shrink-0" />
              )}
              <span className={i.done ? "text-white/90" : "text-white/75"}>
                {i.text}
              </span>
            </li>
          ))}
        </ul>

        {goal ? <p className="text-sm md:text-base font-semibold text-cyan-300">{goal}</p> : null}

        {hereLabel && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1.5 text-xs md:text-sm font-semibold text-cyan-300 ring-1 ring-cyan-400/40">
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
            {hereLabel}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- Mobile Card -------- */
function MobilePhase({
  icon,
  title,
  status,
  blurb,
  items,
  goal,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  blurb: string;
  items: Item[];
  goal?: string;
  badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-2 flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="ml-auto text-xs text-white/70">{status}</span>
      </div>
      <p className="text-sm text-white/80 mb-3">{blurb}</p>
      <ul className="text-sm text-white/80 space-y-1.5 mb-3">
        {items.map((i) => (
          <li key={i.text} className="flex items-start gap-2">
            {i.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 text-white/35 shrink-0" />
            )}
            <span className={i.done ? "text-white/90" : "text-white/75"}>
              {i.text}
            </span>
          </li>
        ))}
      </ul>
      {goal ? <p className="text-sm font-semibold text-cyan-300">{goal}</p> : null}
      {badge && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-400/40">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          {badge}
        </div>
      )}
    </div>
  );
}
