# Hafizh Rizqullah Prasetya — Portfolio

Personal portfolio, work archive, editorial site, and content-management workspace.

The current production implementation is being prepared for a structured redesign focused on:
- IT project management and delivery,
- product and systems thinking,
- technical implementation,
- bilingual English/Indonesian content,
- evidence-backed Work and Insights.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Cloudinary
- Gemini
- Upstash Redis
- Cloudflare Turnstile
- Phosphor Icons

## Development

Use pnpm as the canonical package manager.

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and provide the required local credentials.

## Product documentation

The redesign contracts are tracked in [docs/](./docs/README.md).

Start with:
- [PRD](./docs/PRD.md)
- [Design direction](./docs/DESIGN.md)
- [Editorial standard](./docs/EDITORIAL.md)
- [Routing and i18n](./docs/ROUTING_AND_I18N.md)
- [Content model](./docs/CONTENT_MODEL.md)
- [Admin editorial workspace](./docs/ADMIN_EDITORIAL_WORKSPACE.md)
- [Public page architecture](./docs/PUBLIC_PAGE_ARCHITECTURE.md)
- [Implementation plan](./docs/IMPLEMENTATION_PLAN.md)

These documents are the source of truth for the upcoming redesign. Implementation should not silently diverge from them.
