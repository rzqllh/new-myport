# Portfolio Redesign Documentation

This directory is the source of truth for the next portfolio architecture and redesign. Implementation must follow these documents unless a later approved decision explicitly supersedes them.

## Documents

1. [PRD.md](./PRD.md) — product goals, scope, requirements, success criteria, and non-goals.
2. [DESIGN.md](./DESIGN.md) — visual language, hierarchy, responsive behavior, components, motion, accessibility, and anti-patterns.
3. [EDITORIAL.md](./EDITORIAL.md) — English and Indonesian writing rules, terminology, claims, CTA language, and anti-slop copy guidance.
4. [ROUTING_AND_I18N.md](./ROUTING_AND_I18N.md) — route model, locale behavior, slug rules, redirects, canonical URLs, and permalink lifecycle.
5. [CONTENT_MODEL.md](./CONTENT_MODEL.md) — CMS ownership, bilingual content model, entities, evidence, taxonomy, and dynamic-content rules.
6. [ADMIN_EDITORIAL_WORKSPACE.md](./ADMIN_EDITORIAL_WORKSPACE.md) — admin information architecture and editorial canvas UX.
7. [PUBLIC_PAGE_ARCHITECTURE.md](./PUBLIC_PAGE_ARCHITECTURE.md) — hierarchy and content contracts for public pages and detail pages.
8. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — phased execution plan and verification gates.

## Governing principles

- Code owns layout, behavior, validation, accessibility, and rendering.
- Admin/CMS owns public editorial content and site configuration.
- Product UI copy belongs to structured locale dictionaries, not ad-hoc database rows.
- English and Indonesian are authored variants of the same meaning, not literal translations.
- Claims must be factual, attributable, or clearly qualitative. No fabricated metrics or generic marketing claims.
- Public and admin experiences share one design language but use different density.
- A page must have a clear primary task and visual hierarchy. Equal visual weight everywhere is a defect.
- Existing routes must remain reachable through permanent redirects during migrations.
- No implementation phase may silently reinterpret the contracts in these documents.

## Reference direction

The redesign draws principles from Impeccable, UI/UX Pro Max, anti-slop, and Taste: audit first, establish hierarchy, use a coherent system, avoid generic card-and-badge composition, and treat anti-slop as a quality gate rather than a visual style.
