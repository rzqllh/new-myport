# Baseline Audit — Before Redesign

Baseline inspected: `master@8120a9e`.

This document records current implementation debt that the redesign plan must resolve. It is not an implementation diff.

## Repository and workflow

- Default branch is `master`.
- There is no GitHub Actions workflow.
- Vercel currently reports successful deployment status on the baseline commit.
- Branch protection is not currently enforced.
- Both `package-lock.json` and `pnpm-lock.yaml` exist while documentation instructs pnpm.
- The previous README materially understates the current runtime stack and CMS surface.

## Public content architecture

### Duplicated sources of truth
Current content is split across:
- Supabase tables,
- `src/lib/constants.ts`,
- `src/lib/project-content.ts`,
- component-level fallbacks,
- hardcoded JSX.

Examples:
- mobile navigation contains a hardcoded CV URL,
- social URLs are partly hardcoded,
- Hero contains a fallback email,
- Work/project fallback content exists in source,
- project detail narrative content exists in `PROJECT_DETAILS_DATA`,
- article fallback content is hardcoded in the detail route,
- location copy is hardcoded in public UI.

Target: CMS-managed editorial content with explicit technical fallbacks only.

### Developer-centric terminology
Current routes and content use:
- /projects
- /blog
- Web Applications / Tools / UI-UX categories

Target:
- /work
- /insights
- broader Work taxonomy that can represent PM, product, engineering, research/design, tools, and systems.

## Slug and routing

Current project form:
- auto-generates slug directly from title,
- treats slug as a normal form field,
- has no published permalink lifecycle,
- has no redirect history.

Current article/project routes use the stored slug directly.

Target:
- short stable slugs,
- explicit permalink UX,
- title changes do not mutate published slug,
- permanent redirects for deliberate slug changes,
- bilingual route support.

## Admin UX

Current admin shell:
- flat sidebar navigation,
- generic page title header,
- dashboard primarily composed of equal statistic cards,
- “Quick Actions” area contains placeholder content,
- no attention-first content health,
- project list is a basic CRUD table,
- article list is a basic CRUD row list.

Current editors:
- expose database-oriented form order,
- title and slug are treated as peer fields,
- no outline/canvas/inspector hierarchy,
- no locale workflow,
- no first-class preview/publish context,
- no content completeness model.

Target: editorial workspace defined in `ADMIN_EDITORIAL_WORKSPACE.md`.

## Public detail UX

Current project detail includes a mostly fixed sequence:
- title/metadata,
- specification card,
- metrics banner when present,
- demo/case-study visual,
- challenge,
- solution,
- architecture,
- capability sections.

Problem:
- structure is component-driven rather than story-driven,
- metadata is over-contained,
- metrics can become a layout pattern rather than evidence,
- PM/research/engineering work is pushed toward one template.

Target: flexible narrative Work detail defined in `PUBLIC_PAGE_ARCHITECTURE.md`.

Current article detail is a conventional narrow prose layout with hardcoded fallback articles. It lacks the intended relationship to Work, flexible editorial media, and bilingual content architecture.

## Claims and skills

Current site settings include default hero-stat values such as client satisfaction, delivery, team count, and years of experience.

These defaults must not be published unless supported by reliable evidence.

Current skills model includes numeric proficiency from 0–100. This is arbitrary precision for a portfolio and should migrate to capability/evidence relationships or a coarse non-numeric model.

## Rendering and data fetching

- Home is forced dynamic.
- Work/projects listing is forced dynamic with revalidate 0.
- Root layout and metadata both read site settings.
- GitHub activity is fetched in more than one place.
- Several public sections depend on runtime Supabase reads that can be cached or revalidated more deliberately.

Target:
- cached server accessors,
- ISR where appropriate,
- on-demand revalidation after admin publishing,
- optional integrations isolated from core content.

## Security and validation

Positive baseline:
- Turnstile verification exists for contact submissions.
- AI chat has Upstash rate limiting and signed session handling.
- Supabase RLS is enabled in the initial schema.

Items requiring audit:
- broad authenticated-user admin RLS model,
- public insert policy for messages/contact path,
- contact rate limiting beyond CAPTCHA,
- server input validation consistency,
- security headers/CSP,
- broad `/* eslint-disable */` in auth proxy/admin areas,
- API exposure and development-only routes.

A public `/api/test-projects` endpoint currently exists and should be removed in Phase 1.

## Environment and documentation

`.env.example` currently duplicates Turnstile keys and should be normalized.

README previously documented only a subset of required services. The redesign documentation now records the broader stack, while Phase 1 must align environment and operational setup precisely.

## Design-system debt

Current public/admin UI inherits a large amount of default “rounded card + muted surface + primary accent” composition.

Observed problems:
- too many equivalent containers,
- several labels and technical elements use mono styling decoratively,
- mobile navigation is information-dense,
- admin hierarchy is mostly determined by cards/tables rather than task priority,
- public Work detail hierarchy is heavily componentized.

Target: the semantic and hierarchy rules in `DESIGN.md`.

## Phase mapping

- Repository/security/performance debt -> Phase 1 and Phase 9.
- Data-source duplication and bilingual schema -> Phase 2 and Phase 5.
- Admin hierarchy -> Phase 3 and Phase 4.
- Public page hierarchy/design -> Phase 6 and Phase 7.
- Slug/route migration -> Phase 8.
