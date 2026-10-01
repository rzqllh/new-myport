# Hafizh Rizqullah Prasetya — Portfolio

Personal portfolio, Work archive, Insights publication, and bilingual content-management workspace.

The current implementation is organized around:
- IT project management and delivery,
- product and systems thinking,
- technical implementation,
- bilingual English/Indonesian editorial content,
- evidence-backed Work and Insights,
- an admin-managed public content model.

## Public structure

Canonical English routes:
- `/work`
- `/work/[slug]`
- `/insights`
- `/insights/[slug]`
- `/about`
- `/contact`
- `/resume`

Bahasa Indonesia uses the `/id` prefix. Legacy `/projects` and `/blog` URLs permanently redirect to their canonical equivalents.

## Admin

`/admin` manages public editorial content and operational site settings, including:
- Work and evidence,
- Insights,
- bilingual Site Content,
- Experience,
- qualitative Capabilities,
- profile media,
- social/contact/resume settings,
- content-health checks.

Public editorial copy should not be duplicated in source-code fallbacks unless the documented compatibility layer explicitly requires it.

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

Verification:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Product documentation

The implementation contracts are tracked in [docs/](./docs/README.md).

Start with:
- [PRD](./docs/PRD.md)
- [Design direction](./docs/DESIGN.md)
- [Editorial standard](./docs/EDITORIAL.md)
- [Routing and i18n](./docs/ROUTING_AND_I18N.md)
- [Content model](./docs/CONTENT_MODEL.md)
- [Admin editorial workspace](./docs/ADMIN_EDITORIAL_WORKSPACE.md)
- [Public page architecture](./docs/PUBLIC_PAGE_ARCHITECTURE.md)
- [Detail-page UI/UX](./docs/DETAIL_PAGE_UIUX.md)
- [Performance and reliability](./docs/PERFORMANCE.md)
- [Implementation plan](./docs/IMPLEMENTATION_PLAN.md)

These documents are the source of truth. Implementation should not silently diverge from them.
