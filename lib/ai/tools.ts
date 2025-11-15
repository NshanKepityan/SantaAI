// lib/ai/tools.ts
export type MintAnalysis = {
  mint: string;
  lpStatus: "burned" | "locked" | "unlocked" | "unknown";
  poolState: string;
  creationDate: string;
  creator: string;
  creatorNotes?: string;
  taxNote?: string;
  warnings: string[];
  finalScore: number;
  subscores?: {
    lp: number;
    creator: number;
    tax: number;
    trading: number;
    warnings: number;
  };
  sources: { label: string; url?: string }[];
  permalink?: string;
  top1Share?: number;
  top10Share?: number;
  depthSOL?: number | null;
  metadataMutable?: boolean;
  customFeesDetected?: boolean;
};

// This is the actual server-side function the "tool" will use.
export async function getMintData(mint: string): Promise<MintAnalysis> {
  // If your analyzer is in a function, you can import and call it directly:
  //   return await analyzeMint({ mint });

  // Easiest: call your existing /api/analyze endpoint locally
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mint }),
  });

  if (!res.ok) {
    throw new Error(`Analyzer API error: ${res.status}`);
  }

  const data = (await res.json()) as MintAnalysis;
  return data;
}

// OpenAI "tool" schema (for function calling)
export const openAiTools = [
  {
    type: "function",
    function: {
      name: "getMintData",
      description:
        "Fetch detailed on-chain analysis for a Solana mint address for trading and risk decisions.",
      parameters: {
        type: "object",
        properties: {
          mint: {
            type: "string",
            description: "The Solana mint address to analyze (base58).",
          },
        },
        required: ["mint"],
      },
    },
  },
] as const;
