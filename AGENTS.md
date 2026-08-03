<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository Instructions for Coding Agents

Read `START-HERE.md` before bootstrapping a project. This file contains repository-wide working rules. Keep detailed facts in their owning documents.

## Source of Truth

- Product goals, scope, users, journeys, and business rules: `PROJECT.md`
- System boundaries, stack, runtime, integrations, and environments: `ARCHITECTURE.md`
- Database schema, relations, constraints, indexes, and migrations: `docs/data-model.md`
- HTTP APIs, events, background jobs, webhooks, and external contracts: `docs/api-contracts.md`
- Authentication, authorization, secrets, threats, and data protection: `docs/security.md`
- Routes, UI flows, states, visual system, responsive behavior, and accessibility: `DESIGN.md`
- Feature behavior and acceptance criteria: applicable files in `docs/features/`
- Test commands and quality gates: `docs/testing.md`
- Deployment, rollback, backup, monitoring, and operations: `docs/deployment.md`
- Durable decisions and trade-offs: `docs/decisions.md`
- Active substantial work: `docs/execution-plan.md`
- Current implementation state: `docs/status.md`

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Icons:** @phosphor-icons/react (duotone only — no lucide-react)
- **Animation:** Motion (framer-motion) primary + GSAP + ScrollTrigger for scroll-driven
- **Database:** Supabase (PostgreSQL + Auth)
- **Image storage:** Cloudinary
- **Spam protection:** Cloudflare Turnstile
- **Rich text:** Tiptap
- **Hosting:** Vercel

## Key Rules

1. English-only content (bilingual deferred).
2. No AI-generated mockups presented as real product screenshots.
3. No lucide-react — Phosphor duotone only.
4. No anime.js — Motion + GSAP only.
5. All animations respect `prefers-reduced-motion`.
6. Semantic shadcn colors only (`bg-primary`, not `bg-blue-500`).
7. No `h-screen` — use `min-h-[100dvh]`.
8. No `window.addEventListener("scroll")` — use Motion/GSAP.
9. Design: Space Grotesk (display) + Archivo (body) + JetBrains Mono (code).
10. Palette: Cool slate neutrals + Electric Blue accent (#2563EB light / #3B82F6 dark).
