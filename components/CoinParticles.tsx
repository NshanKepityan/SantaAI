'use client';
import { useEffect, useState } from 'react';

type Coin = {
  id: number;
  left: number;      // vw
  delay: number;     // s
  duration: number;  // s
  scale: number;
  rotate: number;
};

export default function CoinParticles({ count = 14 }: { count?: number }) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const generated: Coin[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 6,
      scale: 0.7 + Math.random() * 0.8,
      rotate: Math.random() * 360,
    }));
    setCoins(generated);
    setMounted(true);
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
      suppressHydrationWarning
    >
      {mounted &&
        coins.map((c) => (
          <span
            key={c.id}
            className="absolute select-none"
            style={{
              left: `${c.left}vw`,
              animation: `coin ${c.duration}s linear ${c.delay}s infinite`,
              transform: `rotate(${c.rotate}deg) scale(${c.scale})`,
              top: "-10vh",
              fontSize: "22px",
            }}
          >
            🪙
          </span>
        ))}

      {/* Self-contained keyframes so Tailwind config is not required */}
      <style jsx>{`
        @keyframes coin {
          0%   { transform: translateY(-10vh) rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
