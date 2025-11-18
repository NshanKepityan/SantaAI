export default function MarqueeTicker({
  items,
}: { items: string[] }) {
  const line = items.join("   •   ");

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-midnight">
      <div className="whitespace-nowrap animate-marquee">
        <span
          className="inline-block px-6 py-3 text-sm text-solanaCyan font-medium tracking-wide"
          style={{
            textShadow:
              "0 0 8px rgba(0,255,224,0.3), 0 0 16px rgba(0,255,224,0.15)",
          }}
        >
          {line}
        </span>
        <span
          className="inline-block px-6 py-3 text-sm text-solanaCyan font-medium tracking-wide"
          style={{
            textShadow:
              "0 0 8px rgba(0,255,224,0.3), 0 0 16px rgba(0,255,224,0.15)",
          }}
        >
          {line}
        </span>
      </div>
    </div>
  );
}
