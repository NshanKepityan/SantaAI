// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getMintData, openAiTools } from "@/lib/ai/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
    }

    // 1) Initial call with tools enabled
    const first = await client.chat.completions.create({
      model: "gpt-4.1", // or gpt-4.1-mini if you want cheaper
      messages: [
        {
          role: "system",
          content:
            "You are SantaAI, a warm but brutally honest Solana token risk analyst. " +
            "You can call tools to analyze mints and then explain the results in simple trader language.",
        },
        ...messages,
      ],
      tools: openAiTools as any,
      tool_choice: "auto",
    });

    const choice = first.choices[0];

    // 2) If no tool calls, just return AI’s answer
    const toolCalls = choice.message.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      return NextResponse.json({
        messages: [
          {
            role: "assistant",
            content: choice.message.content,
          },
        ],
      });
    }

    // 3) Handle tool calls (we expect 1 here, but loop to be safe)
    const toolMessages: any[] = [];

    for (const toolCall of toolCalls) {
      // Fix: handle both OpenAI tool call types (function or legacy structure)
      // OpenAI "function" tool calls have .function property, custom might not.
      let name: string | undefined;
      let argsJson: string | undefined;

      if ("function" in toolCall && toolCall.function) {
        name = toolCall.function.name;
        argsJson = toolCall.function.arguments;
      } else if ("name" in toolCall && "arguments" in toolCall) {
        // Fallback: support custom tool call types
        name = (toolCall as any).name;
        argsJson = (toolCall as any).arguments;
      }
      const callId = toolCall.id;
      let toolResult: any = null;

      if (name === "getMintData") {
        const args = JSON.parse(argsJson || "{}");
        const mint = String(args.mint || "").trim();
        if (!mint) {
          toolResult = { error: "No mint provided to getMintData" };
        } else {
          try {
            const data = await getMintData(mint);
            toolResult = data;
          } catch (err: any) {
            toolResult = { error: err?.message || "Failed to analyze mint" };
          }
        }
      } else {
        toolResult = { error: `Unknown tool: ${name}` };
      }

      toolMessages.push({
        role: "tool",
        tool_call_id: callId,
        name,
        content: JSON.stringify(toolResult),
      });
    }

    // 4) Second call: send model the tool results so it can respond
    const second = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are SantaAI, a Solana token safety assistant. " +
            "Use the tool results to explain mint risks clearly. " +
            "Always mention: LP status, holder concentration, mutability, fees, and a final conclusion whether it's degen, risky, or relatively safer.",
        },
        ...messages,
        choice.message, // the assistant message that requested tool calls
        ...toolMessages,
      ],
    });

    const finalMessage = second.choices[0].message;

    return NextResponse.json({
      messages: [
        {
          role: "assistant",
          content: finalMessage.content,
        },
      ],
    });
  } catch (e: any) {
    console.error("ai-chat error", e);
    return NextResponse.json(
      { error: e?.message || "Internal AI error" },
      { status: 500 }
    );
  }
}
