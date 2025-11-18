export default function WavyDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative h-16 w-full overflow-hidden ${flip ? "rotate-180" : ""}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="vaultyGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00FFE0" />
            <stop offset="100%" stopColor="#7B00FF" />
          </linearGradient>
        </defs>
        <path
          d="M0,64 C240,160 480,-32 720,32 C960,96 1200,96 1440,32 L1440,120 L0,120 Z"
          fill="url(#vaultyGrad)"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
