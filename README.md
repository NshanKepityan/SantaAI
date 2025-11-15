# SantaAI — Solana Mint Analyzer

A Next.js 14 app with a built‑in analyzer for Solana Pump.fun tokens. Paste a mint and get LP status, creation date, creator info, warnings, and a final **Santa Score**.

## Quick start
```bash
npm i
npm run dev
# open http://localhost:3000
```

Optional (recommended) set an RPC URL in `.env.local`:
```
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Features
- React + Tailwind + Framer Motion + lucide-react
- Analyzer UI with permalink `?mint=...`
- Backend API `POST /api/analyze` using:
  - DexScreener (pool/liquidity)
  - Solscan (account + txs)
  - Solana RPC via @solana/web3.js (LP mint authority + largest accounts for locker heuristic)

## Notes
- Locker detection is heuristic; integrate a specific locker API/IDL to show exact `lockUntil`.
- If the backend fails, UI shows a **demo** fallback so you can still preview the UX.

---
Built for your **SantaAI** launch 🎅🔥
