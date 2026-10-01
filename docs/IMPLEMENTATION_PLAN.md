# Implementation Plan

This plan is intentionally phased. Each phase must complete its verification gate before the next phase introduces dependent behavior.

Implementation status: Phases 0–10 are complete on the portfolio-redesign branch. Final merge verification remains the only outstanding step.

## Phase 0 — Documentation and baseline

Status: complete when the documentation foundation and detail-page UI/UX correction are merged.

Tasks:
- track docs in git,
- align README,
- establish route/content/design/editorial contracts,
- establish visitor-facing Work/Insight detail-page UI/UX contracts,
- record baseline technical debt,
- add and maintain CHANGELOG,
- no product implementation in this phase.

Gate:
- documents do not contradict each other,
- route and locale model is consistent,
- CMS ownership is explicit,
- design direction and anti-patterns are explicit,
- Work/Insight detail pages have desktop/mobile hierarchy contracts independent of slug-routing/admin UX.

## Phase 1 — Foundation and repository hygiene

Tasks:
- choose pnpm as the single package manager and remove lockfile ambiguity,
- clean .env.example duplication,
- remove development-only public endpoint(s),
- remove broad eslint-disable usage where possible,
- add SECURITY documentation,
- maintain CHANGELOG as implementation proceeds,
- add lint/typecheck/test/build CI,
- add initial test stack,
- audit dependencies and remove unused packages,
- audit RLS and admin authorization,
- add public-write rate limiting and server validation,
- add security headers,
- consolidate site-settings server access,
- define on-demand revalidation utilities.

Gate:
- CI green,
- production build green,
- no known public dev endpoint,
- RLS/security checklist reviewed,
- no secret/client-boundary issues.

## Phase 2 — Content schema and migration

Tasks:
- introduce Work and Insight entities/translations,
- introduce site_content,
- introduce media/evidence/redirect models,
- remove arbitrary skill percentages,
- migrate project/blog data,
- migrate hardcoded public editorial copy,
- create redirect map,
- add locale readiness state,
- keep current production routes functional during migration.

Gate:
- migration verified on representative data,
- no published content lost,
- old and new content can be compared,
- redirect collisions resolved,
- EN/ID entity relations valid.

## Phase 3 — Admin shell and information architecture

Tasks:
- redesign admin navigation groups,
- redesign header/context actions,
- rebuild dashboard as attention-first,
- establish shared admin layout primitives,
- implement responsive panel behavior,
- implement standard loading/error/empty patterns.

Gate:
- keyboard navigation works,
- mobile/tablet behavior reviewed,
- no page relies on generic stat-card hierarchy,
- visual tokens align with DESIGN.md.

## Phase 4 — Editorial canvas

Tasks:
- build Work editor outline/canvas/inspector,
- build Insight editor on the same model,
- locale switch and readiness,
- permalink management,
- preview,
- unsaved-change warning,
- draft/publish states,
- section validation,
- evidence/media workflows,
- SEO inspector.

Gate:
- create/edit/preview/publish works for Work and Insight,
- changing a published slug creates redirect history,
- EN and ID can be maintained independently,
- draft content is not public.

## Phase 5 — Site Content and settings separation

Tasks:
- build Site Content editor,
- Home/About/Work/Insights/Contact/Nav/Footer copy,
- move social/location/availability/resume to operational settings,
- remove duplicated hardcoded public copy,
- preview localized page copy.

Gate:
- public editorial content can be updated without code changes,
- no hardcoded CV/social/location divergence,
- locale completeness visible.

## Phase 6 — Public design system and shell

Tasks:
- implement semantic palette,
- typography roles,
- navigation,
- footer,
- buttons/links,
- media,
- shared content primitives,
- responsive rules,
- dark-mode parity,
- reduced-motion behavior.

Gate:
- desktop/tablet/mobile visual review,
- light/dark hierarchy parity,
- accessibility smoke review,
- no unapproved gradient/card/badge patterns.

## Phase 7 — Public page redesign

Tasks:
- Home,
- Work index,
- Work detail,
- Insights index,
- Insight detail,
- About,
- Contact,
- Resume,
- related content,
- evidence presentation,
- create explicit desktop and mobile compositions for Work detail before implementation,
- create explicit desktop and mobile compositions for Insight detail before implementation,
- verify opening fold, narrative measure, rail/TOC behavior, media breakouts, related-content closure, and state behavior against DETAIL_PAGE_UIUX.md.

Gate:
- each page passes hierarchy review,
- page layouts are related but not template-identical,
- Work and Insight detail implementations pass DETAIL_PAGE_UIUX.md,
- slug/detail pages are reviewed at mobile, tablet, small desktop, and large desktop widths,
- no generic specifications-card opening,
- no fixed Challenge/Solution/Architecture/Features template across all Work types,
- no fabricated metrics,
- all relevant data is CMS-driven.

## Phase 8 — Routing and bilingual release

Tasks:
- switch /projects to /work,
- switch /blog to /insights,
- enable /id routes,
- permanent redirects,
- locale switch,
- hreflang,
- canonical URLs,
- sitemap/robots review,
- localized OG/SEO.

Gate:
- old URLs resolve correctly,
- no redirect loops,
- canonical/hreflang verified,
- EN/ID route smoke tests green.

## Phase 9 — Performance and reliability

Tasks:
- remove unnecessary force-dynamic,
- use ISR/cached reads,
- on-demand revalidation after admin publish,
- image optimization,
- consolidate duplicate network reads,
- degraded-state review,
- route-level performance audit.

Gate:
- no optional integration can break core portfolio browsing,
- performance budgets are documented as explicit targets,
- cache, media, degraded-state, and production-build contracts are verified,
- real-user field measurements are recorded only after a production release is available; CI/build success is not presented as field performance.

## Phase 10 — Differentiators

Status: selected 10A–10D scope implemented; final merge verification remains.

Only after the core product is stable.

Candidates:
- grounded portfolio assistant with citations,
- global command/search,
- /now,
- recruiter-focused quick profile,
- live project metadata,
- private-friendly analytics,
- admin content-health checks,
- revision history,
- scheduled publishing.

Selected implementation:
- 10A grounded portfolio assistant with server-selected source links and deterministic retrieval harness,
- 10B global CMS-backed portfolio search,
- 10C deterministic admin content-health checks,
- 10D motion and interaction quality with non-blocking route arrival, restrained hierarchy reveal, microinteraction feedback, and reduced-motion parity.

Each selected candidate has its own small PRD. Deferred candidates and rationale are recorded in `PHASE_10_DECISIONS.md`. No feature is added only because it looks impressive.

## Execution rules

For every phase:
1. inspect current implementation,
2. define scoped task,
3. write/update tests first where behavior is testable,
4. implement without speculative abstraction,
5. verify locally/CI,
6. update docs if contract changes,
7. commit and push by completed task,
8. merge only when the phase merge gate is satisfied.

Do not mix unrelated redesign, schema, copy, and infrastructure work into a single giant PR.
