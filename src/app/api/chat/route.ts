import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { verifyChatSession, signChatSession, verifyTurnstileToken } from '@/lib/chat-auth';
import { getCachedGroundingData } from '@/lib/gemini-grounding';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ipRateLimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m') });
const globalRateLimit = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(500, '1 d') });

export async function POST(req: Request) {
  try {
    const { messages, turnstileToken, sessionToken } = await req.json();

    let newSessionToken;

    if (sessionToken) {
      if (!(await verifyChatSession(sessionToken))) {
        return NextResponse.json({ error: 'Session expired', code: 'SESSION_EXPIRED' }, { status: 401 });
      }
    } else if (turnstileToken) {
      if (!(await verifyTurnstileToken(turnstileToken))) {
        return NextResponse.json({ error: 'Verification failed', code: 'TURNSTILE_FAILED' }, { status: 403 });
      }
      newSessionToken = await signChatSession();
    } else {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const [globalRes, ipRes] = await Promise.all([
      globalRateLimit.limit('global-gemini-cap'),
      ipRateLimit.limit(ip)
    ]);

    if (!globalRes.success || !ipRes.success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT' }, { status: 429 });
    }

    const groundingData = await getCachedGroundingData();
    const systemInstruction = `Only answer based on the provided data. Do not hallucinate. Data:\n${groundingData}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      systemInstruction,
      contents: messages,
    });

    return NextResponse.json({
      message: response.text,
      ...(newSessionToken && { sessionToken: newSessionToken }),
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
