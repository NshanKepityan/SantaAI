export const metadata = {
  title: "SantaAI — Solana Mint Analyzer",
  description: "Paste a mint, get LP status, warnings, and a Santa Score."
};

import "./../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
