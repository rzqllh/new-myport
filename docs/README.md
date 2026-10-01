# Portfolio Redesign Documentation

This directory is the source of truth for the portfolio architecture and redesign. Implementation must follow these documents unless a later approved decision explicitly supersedes them.

## Documents

1. [PRD.md](./PRD.md) — product goals, scope, requirements, success criteria, and non-goals.
2. [DESIGN.md](./DESIGN.md) — visual language, hierarchy, responsive behavior, components, motion, accessibility, and anti-patterns.
3. [EDITORIAL.md](./EDITORIAL.md) — English and Indonesian writing rules, terminology, claims, CTA language, and anti-slop copy guidance.
4. [ROUTING_AND_I18N.md](./ROUTING_AND_I18N.md) — route model, locale behavior, slug rules, redirects, canonical URLs, and permalink lifecycle.
5. [CONTENT_MODEL.md](./CONTENT_MODEL.md) — CMS ownership, bilingual content model, entities, evidence, taxonomy, and dynamic-content rules.
6. [ADMIN_EDITORIAL_WORKSPACE.md](./ADMIN_EDITORIAL_WORKSPACE.md) — admin information architecture and editorial canvas UX.
7. [PUBLIC_PAGE_ARCHITECTURE.md](./PUBLIC_PAGE_ARCHITECTURE.md) — hierarchy and content contracts for public pages.
8. [DETAIL_PAGE_UIUX.md](./DETAIL_PAGE_UIUX.md) — visitor-facing UI/UX, layout, hierarchy, evidence, and responsive contracts for Work and Insight slug/detail pages.
9. [DECISIONS.md](./DECISIONS.md) — approved decisions that implementation must not silently reinterpret.
10. [BASELINE_AUDIT.md](./BASELINE_AUDIT.md) — repository debt mapped to the redesign phases.
11. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — phased execution plan and verification gates.
12. [PERFORMANCE.md](./PERFORMANCE.md) — public caching, degraded-state behavior, media delivery, AI grounding, and measurable production performance targets.
13. [PHASE_10_ASSISTANT_PRD.md](./PHASE_10_ASSISTANT_PRD.md) — grounded assistant scope, sources, UX, and gate.
14. [PHASE_10_SEARCH_PRD.md](./PHASE_10_SEARCH_PRD.md) — global public search scope, keyboard UX, and gate.
15. [PHASE_10_CONTENT_HEALTH_PRD.md](./PHASE_10_CONTENT_HEALTH_PRD.md) — deterministic admin content-health checks and gate.
16. [PHASE_10_DECISIONS.md](./PHASE_10_DECISIONS.md) — selected and deferred differentiators with rationale.

## Governing principles

- Code owns layout, behavior, validation, accessibility, and rendering.
- Admin/CMS owns public editorial content and site configuration.
- Product UI copy belongs to structured locale dictionaries, not ad-hoc database rows.
- English and Indonesian are authored variants of the same meaning, not literal translations.
- Claims must be factual, attributable, or clearly qualitative. No fabricated metrics or generic marketing claims.
- Public and admin experiences share one design language but use different density.
- A page must have a clear primary task and visual hierarchy. Equal visual weight everywhere is a defect.
- Existing routes must remain reachable through permanent redirects during migrations.
- A slug/detail route is not considered designed merely because routing, permalink, and editor UX exist; the visitor-facing page composition is a separate required contract.
- Optional integrations must degrade independently from core portfolio browsing.
- No implementation phase may silently reinterpret the contracts in these documents.

## Reference direction

The redesign draws principles from Impeccable, UI/UX Pro Max, anti-slop, and Taste: audit first, establish hierarchy, use a coherent system, avoid generic card-and-badge composition, and treat anti-slop as a quality gate rather than a visual style.
