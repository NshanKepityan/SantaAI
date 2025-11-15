import { NextRequest, NextResponse } from "next/server";
import { analyzeMint } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { mint } = await req.json();
    if (!mint || typeof mint !== "string") {
      return NextResponse.json({ error: "Mint address required" }, { status: 400 });
    }

    const result = await analyzeMint({
      mint,
      // you can override per-request flags here if you want:
      // enableLiquidity: true,
    });

    return NextResponse.json(result);
  } catch (e: any) {
    // Handle rate limit errors specifically
    const errorMessage = String(e?.message || '').toLowerCase();
    if (errorMessage.includes('429') || 
        errorMessage.includes('too many requests') || 
        errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again in a few seconds.",
          code: "RATE_LIMITED"
        }, 
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: e?.message || "Internal error" }, 
      { status: 500 }
    );
  }
}
