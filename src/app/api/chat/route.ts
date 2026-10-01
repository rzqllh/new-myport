import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyChatSession, signChatSession } from "@/lib/chat-auth";
import { getCachedGroundingData } from "@/lib/gemini-grounding";
import { checkChatRateLimits } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z
          .array(
            z.object({
              text: z.string().trim().min(1).max(4_000),
            })
          )
          .min(1)
          .max(4),
      })
    )
    .min(1)
    .max(24),
  sessionToken: z.string().max(4_096).optional(),
});

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (Number.isFinite(contentLength) && contentLength > 32_768) {
      return NextResponse.json(
        { error: "Request is too large.", code: "PAYLOAD_TOO_LARGE" },
        { status: 413 }
      );
    }

    const parsed = chatRequestSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request.", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const { messages, sessionToken } = parsed.data;

    let newSessionToken: string | undefined;

    if (sessionToken) {
      if (!(await verifyChatSession(sessionToken))) {
        return NextResponse.json(
          { error: "Session expired", code: "SESSION_EXPIRED" },
          { status: 401 }
        );
      }
    } else {
      newSessionToken = await signChatSession();
    }

    const ip = getRequestIp(req.headers);
    const rateLimit = await checkChatRateLimits(ip);

    if (!rateLimit.configured && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error: "Chat is temporarily unavailable.",
          code: "RATE_LIMIT_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests", code: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    const ai = getAiClient();

    if (!ai) {
      return NextResponse.json(
        { error: "Chat is temporarily unavailable.", code: "AI_UNAVAILABLE" },
        { status: 503 }
      );
    }

    const groundingData = await getCachedGroundingData();
    const systemInstruction = [
      "Answer only from the supplied portfolio data.",
      "Do not invent experience, metrics, outcomes, employers, projects, or skills.",
      "If the data does not support an answer, say that the portfolio does not provide enough information.",
      "",
      groundingData,
    ].join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: { systemInstruction },
      contents: messages,
    });

    return NextResponse.json({
      message: response.text || "No response was generated.",
      ...(newSessionToken && { sessionToken: newSessionToken }),
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
