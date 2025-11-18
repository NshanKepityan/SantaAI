export const metadata = {
  metadataBase: new URL("https://santaai.space"),
  title: {
    default: "SantaAI — Solana Mint Analyzer & SantaScore",
    template: "%s | SantaAI"
  },
  description:
    "SantaAI analyzes any Solana mint instantly — LP lock %, liquidity depth, holder concentration, metadata risks & SantaScore. AI-powered Solana security tool.",
  keywords: [
    "Solana",
    "SantaAI",
    "SantaScore",
    "mint analyzer",
    "Solana LP lock",
    "Solana token scanner",
    "pumpfun tokens",
    "Solana safety checker",
    "crypto analyzer",
    "meme coin scanner"
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },

  openGraph: {
    title: "SantaAI — Solana Mint Analyzer & SantaScore",
    description:
      "Check LP lock %, liquidity depth, holder concentration, metadata immutability & AI SantaScore.",
    type: "website",
    url: "https://santaai.space",
    images: [
      {
        url: "/banner.png",
        width: 1500,
        height: 500,
        alt: "SantaAI Banner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@Santa_AI_sol",
    title: "SantaAI — Solana Mint Analyzer",
    description: "AI-powered Solana mint scanning with SantaScore.",
    images: "/banner.png",
  },

  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },

  alternates: {
    canonical: "https://santaai.space",
  },
};


import "./../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
