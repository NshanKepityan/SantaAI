'use client';
import React from "react";

type Item = { name: string; value: number; color: string; sub?: string };

export default function TokenomicsBars({
  data = [
    { name: "Holder Rewards", value: 60, color: "#22C55E", sub: "Rewards distributed to holders" },
    { name: "Dev Vault",      value: 38, color: "#7B00FF", sub: "Growth, listings, buybacks, tools" },
    { name: "Burn",           value: 2,  color: "#F59E0B", sub: "Every trade shrinks supply" },
  ],
}: { data?: Item[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {data.map((d) => (
        <div
          key={d.name}
          className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          {/* Bar */}
          <div className="mb-6 flex h-56 items-end justify-center">
            <div className="flex h-full w-16 flex-col justify-end rounded-xl bg-white/10 ring-1 ring-white/10">
              <div
                className="w-full rounded-t-xl"
                style={{
                  height: `${d.value}%`,
                  background: d.color,
                  boxShadow: `0 0 24px ${d.color}44`,
                  transition: "height 900ms ease-out",
                }}
                aria-hidden
              />
            </div>
          </div>

          {/* Value */}
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight">
              {d.value}<span className="text-white/70">%</span>
            </div>
            <div className="mt-2 text-lg font-semibold" style={{ color: d.color }}>
              {d.name.toUpperCase()}
            </div>
            {d.sub && <div className="mt-1 text-sm text-white/70">{d.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
