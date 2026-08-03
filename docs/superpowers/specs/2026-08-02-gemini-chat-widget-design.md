# Gemini Chat Widget Design

## Purpose and Context
Adding an AI Chatbot to the portfolio using the Google Gemini (`@google/genai`) SDK. The chatbot acts as an interactive assistant that answers questions about the user's experience, projects, and skills. This showcases multi-agent AI pipeline skills in a practical, interactive format, adding strong narrative value for hiring managers.

## Constraints & Security
To prevent abuse of the API quota and ensure the AI remains on-brand:
1. **Rate Limiting**: 
   - **Per-IP limit**: e.g., 10 requests per minute using Upstash Redis.
   - **Global Hard Daily Cap**: A global circuit breaker (e.g., 500 requests/day total across all users) to prevent distributed or IP rotation attacks from draining the API quota.
2. **Bot Protection**: Cloudflare Turnstile token verified on the first interaction to establish a session, returning a short-lived internal session token to secure subsequent messages.
3. **Prompt Scoping & Grounding**: 
   - The AI must be strictly grounded using a system prompt that explicitly limits responses to the provided context (CMS data from Supabase).
   - Rule: "Only answer based on the provided experience/projects/skills data. If the answer is not in the data, state that you don't know. Do not hallucinate or improvise."
4. **Performance/UX**: 
   - Floating chat widget, **closed by default** to avoid conflicting with the primary CTA.
   - **Lazy-loaded**: The Gemini client, Turnstile, and Upstash logic are only engaged when the widget is opened, preventing unnecessary bundle bloat on initial page load.
5. **Data Caching**: Grounding data from Supabase must be cached (e.g., via Next.js `unstable_cache`) with a multi-minute TTL to avoid redundant queries on every chat turn.

## Architecture

### Frontend (`src/components/chat-widget.tsx`)
- A floating widget built with `shadcn/ui` components (Card, Input, Button, ScrollArea).
- Uses React state (`useState`) to manage conversation history and session token locally.
- Uses Cloudflare Turnstile component to generate a one-time token for the first message.
- Replaces Turnstile token with the short-lived session token (returned by API) for subsequent messages.
- The component code is dynamically imported (`next/dynamic` or React `lazy`) so it doesn't inflate the main layout bundle until interacted with.

### API Route (`src/app/api/chat/route.ts`)
- **Method**: POST
- **Payload Schema**: `{ messages: Array<{role, parts}>, turnstileToken?: string, sessionToken?: string }`
- **Execution Flow**:
  1. **Authentication / Anti-Bot**:
     - If `turnstileToken` is present (first message): Validate with Cloudflare. On success, generate a short-lived signed session token (HMAC-signed, ~30 min expiry).
     - If `sessionToken` is present (subsequent messages): Validate signature and expiry.
     - Fail if neither is valid.
  2. **Rate Limiting**:
     - Check Upstash Redis for global daily cap (e.g., `gemini-global-daily-cap`). If exceeded, return 429 Error.
     - Check Upstash Redis for IP-based rate limit (e.g., 10 req/min). If exceeded, return 429 Error.
  3. **Grounding Data**: 
     - Fetch grounding data (projects, experience, skills) from Supabase, wrapped in a cache (`unstable_cache`) to avoid re-querying every turn.
  4. **Gemini Invocation**:
     - Construct the payload and use `ai.models.generateContent`:
       ```ts
       await ai.models.generateContent({
         model: "gemini-2.5-flash",
         systemInstruction: SYSTEM_PROMPT,
         contents: [...history, newMessage],
       });
       ```
  5. **Response**: Return the AI message, plus the `sessionToken` if generated on this turn.

## Data Flow
1. User clicks the chat bubble -> Widget opens (lazy loaded).
2. Turnstile widget mounts and generates a token.
3. User types message -> hits `/api/chat` passing `turnstileToken`.
4. API validates Turnstile -> Rate Limits -> Fetches Cached CMS Data -> Calls Gemini -> Returns AI message + `sessionToken`.
5. UI updates with the new message and stores `sessionToken` in memory.
6. User types next message -> hits `/api/chat` passing `sessionToken`.
7. API validates `sessionToken` -> Rate Limits -> Fetches Cached CMS Data -> Calls Gemini -> Returns AI message.

## Error Handling
- **Rate Limit Exceeded (429)**: Display a polite message in the chat UI: "I'm currently receiving too many messages. Please try again later."
- **Turnstile / Auth Failure (403)**: Display "Verification failed. Please try again." (or session expired).
- **Gemini API Error (500)**: Display "I'm having trouble connecting to my brain right now. Please try again."

## Open Questions / Clarifications
- None currently. The design aligns with all requested constraints.
