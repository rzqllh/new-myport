# Gemini Chat Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, rate-limited, and lazy-loaded AI chatbot widget on the portfolio grounded in CMS data using the Gemini SDK.

**Architecture:** A floating widget (`chat-widget.tsx`) hits `/api/chat`. The API route validates Turnstile once, issues a JWT session token for subsequent turns, enforces Upstash rate limits (IP & Global), fetches cached grounding data from Supabase, and uses `@google/genai` to generate the response.

**Tech Stack:** Next.js 15 App Router, `@google/genai`, `@upstash/ratelimit`, `@upstash/redis`, `@marsidev/react-turnstile`, `jose` (for JWT).

## Global Constraints

- Use `ai.models.generateContent` (do NOT use `ai.chats.create()`).
- Cache grounding data with `unstable_cache` with a multi-minute TTL.
- Validate Turnstile once per session and issue a short-lived internal session token.
- Handle `SESSION_EXPIRED` to auto-retry Turnstile verification and message in the background (capped at 1 retry).
- Strict Ponytail implementation: minimal boilerplate, zero unrequested abstraction, leverage native tools.

---

### Task 1: Dependencies and Environment

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

**Interfaces:**
- Consumes: N/A
- Produces: Installed packages and env vars.

- [ ] **Step 1: Install packages**

```bash
pnpm add @google/genai @upstash/ratelimit @upstash/redis jose @marsidev/react-turnstile
```

- [ ] **Step 2: Add to .env.example**

Add the following keys to `.env.example`:
```
# Gemini AI
GEMINI_API_KEY=

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Chat Widget Auth
CHAT_SESSION_SECRET=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "chore: add dependencies for gemini chat widget"
```

---

### Task 2: Auth Token Utilities

**Files:**
- Create: `src/lib/chat-auth.ts`

**Interfaces:**
- Consumes: `process.env.CHAT_SESSION_SECRET`, `process.env.TURNSTILE_SECRET_KEY`
- Produces: `signChatSession()`, `verifyChatSession()`, `verifyTurnstileToken()`

- [ ] **Step 1: Create token utility file**

Write `src/lib/chat-auth.ts` to export functions using `jose` to sign and verify a short-lived JWT (e.g., 30m expiry). Also add `verifyTurnstileToken(token: string, ip: string)` using `fetch` to `https://challenges.cloudflare.com/turnstile/v0/siteverify`.

- [ ] **Step 2: Commit**

```bash
git add src/lib/chat-auth.ts
git commit -m "feat: add token verification and signing utilities for chat"
```

---

### Task 3: Grounding Data Cache

**Files:**
- Create: `src/lib/gemini-grounding.ts`

**Interfaces:**
- Consumes: `src/lib/supabase/server.ts`
- Produces: `getCachedGroundingData()` returning a formatted string of the user's experience, projects, and skills.

- [ ] **Step 1: Create caching function**

Write `src/lib/gemini-grounding.ts` using Next.js `unstable_cache` wrapping a Supabase query for projects, experience, and skills. Set `revalidate: 3600` (1 hour). The return value should be a clean string summarizing the data for the system prompt.

- [ ] **Step 2: Commit**

```bash
git add src/lib/gemini-grounding.ts
git commit -m "feat: add cached grounding data fetcher for gemini"
```

---

### Task 4: API Route

**Files:**
- Create: `src/app/api/chat/route.ts`

**Interfaces:**
- Consumes: `chat-auth.ts`, `gemini-grounding.ts`, `@google/genai`, `@upstash/ratelimit`
- Produces: POST endpoint returning `{ message: string, sessionToken?: string }` or error `{ error: string, code: string }`.

- [ ] **Step 1: Implement Route Logic**

Create `src/app/api/chat/route.ts`:
1. Parse `{ messages, turnstileToken, sessionToken }` from request.
2. If `sessionToken`, verify via `verifyChatSession`. If expired, return `401` with `{ code: 'SESSION_EXPIRED' }`.
3. If no `sessionToken` but `turnstileToken`, verify via `verifyTurnstileToken`. If invalid, return `403` with `{ code: 'TURNSTILE_FAILED' }`. Generate a new `sessionToken`.
4. If neither `sessionToken` nor `turnstileToken` is provided, return `401` with `{ code: 'UNAUTHORIZED' }`.
5. Initialize Upstash and check:
   - Global cap (e.g., 500 req/day): `identifier: 'global-gemini-cap'`
   - IP limit (e.g., 10 req/minute): `identifier: ip`
   - Return `429` if exceeded.
6. Fetch `getCachedGroundingData()`.
7. Call `ai.models.generateContent` where `systemInstruction` explicitly concatenates the rule and the grounding data:
   `systemInstruction: "Only answer based on the provided data. Do not hallucinate. Data:\n" + groundingData`
8. Return JSON response.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add secure api route for gemini chat"
```

---

### Task 5: Chat Widget UI Component

**Files:**
- Create: `src/components/chat-widget.tsx`

**Interfaces:**
- Consumes: `@marsidev/react-turnstile`, `/api/chat`
- Produces: `<ChatWidget />` exported component.

- [ ] **Step 1: Create Widget Component**

Write `src/components/chat-widget.tsx`.
- State: `isOpen`, `messages`, `input`, `isLoading`, `sessionToken`.
- Include `<Turnstile />` component (hidden or visible) that triggers on first open to get a token.
- `sendMessage` function:
  - Posts to `/api/chat` with history + `sessionToken` (or `turnstileToken` if first).
  - Handles `SESSION_EXPIRED`: silently resets Turnstile, waits for new token, then auto-retries the failed message. Cap at 1 retry; if fails again, show manual "please try again" error.
  - Updates history.

- [ ] **Step 2: Commit**

```bash
git add src/components/chat-widget.tsx
git commit -m "feat: build lazy-loaded chat widget ui with turnstile"
```

---

### Task 6: Global Integration

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `src/components/chat-widget.tsx`
- Produces: Floating widget on all pages.

- [ ] **Step 1: Add to Layout**

Import `ChatWidget` dynamically using `next/dynamic` so it doesn't load until mounted. Add it to the root `<body>`.

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: integrate chat widget into global layout"
```
