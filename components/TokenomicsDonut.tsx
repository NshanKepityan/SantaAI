'use client';
import React from 'react';

type Slice = { name: string; value: number; color: string };

export default function TokenomicsDonut({
  data = [
    { name: 'Holder Rewards', value: 68, color: '#22C55E' },
    { name: 'Dev Vault', value: 30, color: '#6366F1' },
    { name: 'Burn', value: 2, color: '#F59E0B' },
  ],
}: { data?: Slice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 80;
  const cx = 100, cy = 100;
  let angle = -90;
  const paths = data.map((d) => {
    const a0 = angle;
    const a1 = angle + (d.value / total) * 360;
    angle = a1;
    const rad = (a: number) => (a * Math.PI) / 180;
    const x0 = cx + r * Math.cos(rad(a0));
    const y0 = cy + r * Math.sin(rad(a0));
    const x1 = cx + r * Math.cos(rad(a1));
    const y1 = cy + r * Math.sin(rad(a1));
    const largeArc = a1 - a0 > 180 ? 1 : 0;
    const dPath = [`M ${cx} ${cy}`, `L ${x0} ${y0}`, `A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1}`, "Z"].join(" ");
    return { dPath, color: d.color, label: d.name, value: d.value };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <svg viewBox="0 0 200 200" className="w-full h-64">
        {paths.map((p, i) => (<path key={i} d={p.dPath} fill={p.color} opacity={0.9} />))}
        <circle cx={cx} cy={cy} r={50} fill="#0A0118" />
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="font-semibold">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
