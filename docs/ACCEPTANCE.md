# Portfolio Production Acceptance — qa/portfolio-production-acceptance

**Baseline:** `cce89ddf715572124fa920124ed7f77e54ceff7c` (`origin/master`)
**Worktree:** `qa/portfolio-production-acceptance` @ `_sandbox/new-myport-production-qa`
**Date:** 2026-10-18
**Live deployment:** `https://rzqllh-port.vercel.app` (Vercel, commit `cce89dd`)
**Local verification target:** `http://127.0.0.1:3201` (fresh production build, placeholder Supabase env)

> Produksi tetap read-only. Operasi rilis yang membutuhkan persetujuan dihentikan di batas itu tanpa menandainya PASS.

## Summary

Production readiness is **conditionally verified for public routes**; CMS remains **BLOCKED** on isolated infrastructure (no docker/psql/supabase, `TEST_DATABASE_URL=UNSET`), documented as a blocker — not marked PASS by static review. Two verified Home defects were fixed and re-proven deterministically. All automated gates pass under release governance.

## Contract preserved

Editorial/premium/oxblood, warm neutral + oxblood, EN/ID bilingual, CMS Work/Insights contracts, public routes/aliases/SEO/assistant/admin shells, security gates + single GHSA #20 exception. No generic SaaS patterns, no fake case studies/metrics/testimonials/claims.

## Defects fixed (verified)

1. **VERIFIED DEFECT — Home `<title>` duplication** — `src/app/(public)/page.tsx` returned `title: copy["home.hero"].name` which concatenated with layout template `"Hafizh… | …"`. Fixed to `title: { absolute: copy["home.hero"].name }`. Proven by: `curl` title extraction (`Hafizh Rizqullah Prasetya` exact vs `Hafizh … | Hafizh …` before), browser audit `title` field for `/` and `/id` (desktop EN/ID), and regression `tests/e2e/portfolio-polish.spec.ts` (`home title does not repeat`).

2. **DESIGN INCONSISTENCY — Duplicate editorial contact closure** — `src/components/layout/footer.tsx` rendered `copy.heading`/`copy.body` on every route, duplicating Home's closing section (`src/app/(public)/page.tsx` § contact closure). Fixed with `isHome = pathname === "/" || pathname === "/id" || pathname === "/id/"` guard (`!isHome && copy.heading/body`). Proven by: `node http GET / vs /about` (`font-display text-2xl` false on HOME vs true on ABOUT, footer still renders nav), and `home has one editorial contact closure` (exact count 1).

3. **TOOLING — Unused import / lint noise** — `src/components/image-upload.tsx` removed unused `useCallback`.

4. **DEPENDENCY — `postcss-selector-parser` moderate** — `package.json` `pnpm.overrides["postcss-selector-parser"] = "7.1.6"` eliminates the single production moderate that previously required a pending triage; lockfile reconciled.

5. **WORKSPACE — Local QA artifact hygiene** — `eslint.config.mjs` `globalIgnores` for `playwright-report/**, test-results/**, docs/qa-evidence/**, playwright.local.config.ts`; `.gitignore` mirrors the same set plus `scripts/portfolio-browser-audit.mjs`. Local helpers remain uncommitted on purpose.

## Evidence — automated acceptance (deterministic, workers=1)

All runs below on the fresh build (`rm -rf .next` → `pnpm build` BUILD 0 → `pnpm start :3201` 200).

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | EXIT 0 |
| Typecheck | `pnpm typecheck` | EXIT 0 |
| Unit/contract | `pnpm test` | 12/12 pass |
| Client boundary | `pnpm audit:client` | passed 11 public route + 6 shell files |
| Build | `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co … pnpm build` | EXIT 0, 32/32 pages |
| Prod audit high | `pnpm audit --prod --audit-level high` | EXIT 0 — **0 advisories** |
| Full audit high | `pnpm audit --audit-level high` | EXIT 0 — **1 high (1 ignored)** = `GHSA-vfj7-8cjw-p6xm` dev-only `braces@3.0.3` |
| Smoke local | `SMOKE_BASE_URL=http://127.0.0.1:3201 node scripts/production-smoke.mjs` | 23 checks passed |
| Smoke live | `SMOKE_BASE_URL=https://rzqllh-port.vercel.app node scripts/production-smoke.mjs` | 23 checks passed |
| E2E public desktop | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3201 pnpm exec playwright test --config playwright.local.config.ts tests/e2e/public.spec.ts --project chromium-desktop --workers 1` | 20/20 |
| E2E polish desktop | `… portfolio-polish.spec.ts --project chromium-desktop --workers 1` | 4/4 |
| E2E polish mobile | `… portfolio-polish.spec.ts --project chromium-mobile --workers 1` | 36/36 |

Browser channel: installed Chrome `155.0.8059.80` via `QA_BROWSER_CHANNEL=chrome` (`playwright.local.config.ts`); CI remains pinned `chromium` (`playwright.config.ts`). `PLAYWRIGHT_BROWSERS_PATH=… pnpm exec playwright install chromium` download failed — documented fallback, not a product defect.

## Browser audit

`QA_BASE_URL=http://127.0.0.1:3201 QA_PHASE=after QA_BROWSER_CHANNEL=chrome node scripts/portfolio-browser-audit.mjs`

- **36 rows** — 12 routes × 3 viewports (desktop 1440, tablet 768, mobile 375): `/, /work, /insights, /about, /contact, /resume, /id, /id/work, /id/insights, /id/about, /id/contact, /id/resume`.
- `overflow: 0`, `consoleErrors: 0`, `missingImages: 0`, `status: 200` for every row.
- `blocked: 4` — `/work/[slug], /id/work/[slug], /insights/[slug], /id/insights/[slug]` — no published detail link in production collection; populated acceptance unavailable. **CONTENT GAP**, not fabricated.
- Before vs after: title `"/"` and `"/id"` desktop corrected from `"Hafizh … | Hafizh …"` to `"Hafizh Rizqullah Prasetya"`; overflow/consoleErrors unchanged at 0.

Stored at `docs/qa-evidence/before/audit.json` (70,968 chars) and `after/audit.json` — local-only, intentionally gitignored (`# QA / E2E artifacts`). Not committed, but the `after` run above is the acceptance witness.

Plus: `curl` probes — `200` for `/ /id /work /about /resume`, legacy aliases `/projects → /work`, `/blog → /insights`, `/id/projects`, `/id/blog`, canonical `link[rel=canonical]` and `hreflang` EN/ID present, `lang` attribute `en`/`id`, security headers `content-security-policy, referrer-policy, x-content-type-options, x-frame-options`, `robots.txt`/`sitemap.xml` 200.

### Print media (resume) — previously flaky, now resolved after rebuild

`src/app/globals.css` `@media print` and `data-print-hidden` on chrome were intermittently absent from the served chunk before `rm -rf .next` (chunk `2c252nkh9ngo8.css` 404). After `rm -rf .next` + fresh build + restart `:3201`, `curl _next/static/chunks/*.css` 200 and `grep data-print-hidden` found; `public.spec --grep "resume print"` passes twice consecutively (including `emulateMedia({media:'print'})` → `display:none` for `[data-print-hidden]`). The flake is classified as stale build artifact, not a product regression.

## CMS verification

**BLOCKED — isolated infrastructure unavailable.**

- Checks: `command -v docker` not found, `psql` not found, `supabase` not found, `TEST_DATABASE_URL=UNSET`, `supabase/config.toml` exists but no running DB, migrations `006_content_model_v2.sql`/`007_editorial_revisions.sql` not applied.
- Migration-backed tests skipped — expected, not faked.
- Static review only: `supabase/migrations/*`, `src/lib/content/{admin-content-health,schema-compat,public-content}.ts`, `src/app/{admin,api/admin/*}`, `src/lib/supabase/{server,client}.ts`, `src/proxy.ts`, `src/lib/{preview-auth,admin-auth,observability,rate-limit}.ts` — RLS/admin contracts and revalidation/preview/export/revisions paths exist, but **no PASS claimed**. Follow-up requires an isolated Postgres (docker/supabase) and `TEST_DATABASE_URL` with seeded `is_portfolio_admin` etc.
- Audited via read-only delegate — no env reads, no production mutation, no network writes.

## Security

- `RELEASE_GOVERNANCE.md` preserved: single documented exception `GHSA-vfj7-8cjw-p6xm` / `CVE-2026-93687` in `braces@3.0.3` via `eslint-config-next > … > braces`, tracked in `https://github.com/rzqllh/new-myport/issues/20` (OPEN). Compensating gate: `pnpm audit --prod --audit-level high` passes with **zero ignored prod advisories**; full audit passes with 1 ignored (the narrowly scoped dev-only advisory). No wildcard exceptions, no `--ignore-unfixable`, no `|| true`.
- This branch adds `postcss-selector-parser@7.1.6` override to clear the prior prod moderate — prod now 0, full 1 ignored. Next review due 2026-12-18 or sooner on patch.
- Client-boundary audit and CodeQL remain green (last CI `cce89dd`: CI success, CodeQL success `39115185206`).
- No credential/secret values read or changed; test placeholders redacted as `[REDACTED]` in logs.

## Git

- Baseline `origin/master` `cce89ddf715572124fa920124ed7f77e54ceff7c` — `git fetch --prune` clean, `HEAD` ≡ `origin/master` before commits.
- This branch `qa/portfolio-production-acceptance` holds 4 commits (see log):
  - `fix(public): correct home title and editorial closure duplication`
  - `chore(lint): ignore local QA artifacts and clean unused import`
  - `chore(security): pin postcss-selector-parser via pnpm override`
  - `docs(qa): record portfolio production acceptance`
- `.gitignore` + `eslint.config.mjs` ensure `docs/qa-evidence/, playwright-report/, test-results/, playwright.local.config.ts, scripts/portfolio-browser-audit.mjs, .next/, node_modules/` stay local-only (verified via `git check-ignore` and `git status --ignored`).
- Dirty checkout `C:/Users/Hafizh Rizqullah/Documents/Code/_active/rzqllh-port` untouched (worktree isolation via `_sandbox/new-myport-production-qa`).

## What remains (requires approval — not executed)

- Push branch and open PR (`gh pr create`) — **blocked pending explicit approval**; no network writes per task.
- CI (`quality`, `e2e`, `analyze`, dependency) on the PR — verify green after push, never claim without `gh pr checks`.
- Vercel preview of this branch and `SMOKE_BASE_URL=<preview> node scripts/production-smoke.mjs`.
- Production release and post-deploy smoke (`verify deployed SHA`, redirects, `lang`, `hreflang`, headers, sitemap/robots).

## How to verify locally

```bash
git fetch origin --prune && git rev-parse HEAD && git rev-parse origin/master
pnpm lint && pnpm typecheck && pnpm test && pnpm audit:client
pnpm audit --prod --audit-level high
pnpm audit --audit-level high
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-placeholder-anon-key \
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3201 \
CHAT_SESSION_SECRET=ci-placeholder-chat-session-secret-at-least-32-characters \
pnpm build
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co … pnpm start --hostname 127.0.0.1 --port 3201
SMOKE_BASE_URL=http://127.0.0.1:3201 node scripts/production-smoke.mjs
SMOKE_BASE_URL=https://rzqllh-port.vercel.app node scripts/production-smoke.mjs
QA_BASE_URL=http://127.0.0.1:3201 QA_PHASE=after QA_BROWSER_CHANNEL=chrome node scripts/portfolio-browser-audit.mjs
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3201 pnpm exec playwright test --config playwright.local.config.ts tests/e2e/public.spec.ts --project chromium-desktop --workers 1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3201 pnpm exec playwright test --config playwright.local.config.ts tests/e2e/portfolio-polish.spec.ts --project chromium-desktop --workers 1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3201 pnpm exec playwright test --config playwright.local.config.ts tests/e2e/portfolio-polish.spec.ts --project chromium-mobile --workers 1
```
