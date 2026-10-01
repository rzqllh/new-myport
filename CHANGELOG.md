# Changelog

All notable changes to this project are documented here.

## Unreleased

### Routing & localization
- Added canonical public route infrastructure for /work, /insights, /about, /contact, and /resume with Indonesian /id equivalents.
- Added permanent redirects from legacy /projects and /blog routes, including legacy Indonesian variants.
- Added locale-aware public navigation/footer and an EN/ID switch that preserves the current canonical path.
- Rebuilt the sitemap from CMS-backed Work/Insight data and both supported locales.
- Added crawler exclusions for admin and API routes.
- Made Home, Work, Insights, About, Contact, Resume, and both detail-page families locale-aware.
- Added locale-correct canonical, hreflang, Open Graph locale, and document-language behavior.
- Indonesian routes now render only published Indonesian v2 translations; they never silently reuse legacy English editorial content.
- Added explicit unavailable-translation states for direct Indonesian detail URLs and dynamic permanent redirects from CMS redirect history.
- Updated admin previews and shared navigation constants to canonical /work and /insights paths.
- Localized contact-form UI and server-side validation messages.

### Public portfolio
- Added a CMS-first public content compatibility layer that reads the bilingual v2 model when available and falls back to the existing database tables before the production migration is applied.
- Removed hardcoded project/article fallback content from Home, Work index, and Insights index rendering.
- Rebuilt Home around professional positioning, selected Work, a capability/experience bridge, selected Insights, and a restrained contact closure.
- Rebuilt Work and Insights indexes as editorial collections rather than card-heavy galleries.
- Rebuilt Work detail around title/summary hierarchy, quiet metadata, optional evidence/media, conditional narrative sections, and next-work navigation.
- Rebuilt Insight detail around article reading measure, tertiary metadata, and contextual related Work.
- Rebuilt About from CMS-managed profile, experience, and qualitative capability data without hardcoded career fallbacks.
- Simplified Contact and removed unsupported response-time and hardcoded-email claims.
- Added a printable web Resume sourced from the same profile, experience, capability, Work, and operational settings data.
- Removed hardcoded employer, education, and skill claims from root structured data.
- Default availability copy is empty until intentionally configured.

### Design system
- Replaced the neutral default palette with the tracked warm-paper, ink, and oxblood semantic tokens in light and dark modes.
- Simplified public navigation into a restrained editorial header and removed floating-glass, numbered-menu, and decorative availability treatments.
- Rebuilt the footer around Site Content, operational settings, and direct navigation instead of decorative activity telemetry.
- Moved the portfolio assistant out of the root application shell so it no longer appears in admin.
- Changed the default theme to follow the operating-system preference while retaining explicit theme control.
- Added print-specific resume behavior.

### Admin
- Rebuilt the admin shell around grouped information architecture and responsive navigation.
- Replaced the stats-first dashboard with attention, recent-edit, and publishing-state hierarchy.
- Reworked Work and Insights lists into editorial rows with search and publication-state filtering.
- Rebuilt Work and Insight editing around outline / canvas / inspector hierarchy.
- Added EN/ID authoring, permalink locking/change flow, unsaved-change protection, preview, publication state, and locale-aware SEO editing.
- Added dedicated bilingual Site Content editing for navigation and public page/section copy.
- Separated editorial copy from operational Settings.
- Removed fabricated hero-stat defaults from the admin settings model.
- Added safe dual-write compatibility for the staged schema-v2 rollout.

### Content-model closure
- Replaced the legacy Skills percentage editor with bilingual qualitative Capabilities using primary / working / familiar levels.
- Added bilingual Experience authoring while keeping company and dates as shared factual fields.
- Moved About biography, working approach, and outside-work narrative into bilingual Site Content; Profile now owns only shared profile media.
- Kept legacy English tables as compatibility fallbacks without treating them as a second public editorial source.

### Data model
- Added an additive bilingual Work/Insights content model with media, evidence, site content, redirect history, localized experience, and qualitative capabilities.
- Added a staged explicit-admin authorization model that preserves owner access during bootstrap.
- Added contact-schema compatibility for the existing runtime `contacts` path and legacy `messages` data.
- Added PostgreSQL migration verification in CI with representative legacy data.

### Security
- Added baseline response security headers.
- Added server-side contact rate limiting and normalized request-IP handling.
- Added validated, size-bounded chat requests and fail-closed production rate limiting.
- Removed the production chat signing-secret fallback.
- Added a tracked security audit and reporting guidance.

### Performance & reliability
- Added a cookie-free anonymous Supabase client for public CMS reads.
- Added tagged five-minute caching for public Work, Insights, profile, settings, capabilities, experience, redirects, and Site Content reads.
- Consolidated root/public-layout site-settings reads onto the shared cached accessor.
- Added an authenticated admin cache-revalidation endpoint and wired public-content mutations to invalidate cached reads after save/delete.
- Rebuilt AI grounding from published CMS data only and removed stale hardcoded biography, project, metric, and proficiency fallbacks.
- Changed optional GitHub activity to a five-minute static/revalidated endpoint and removed its redundant profile request.
- Added provider-safe responsive Cloudinary delivery for public profile and Work evidence media.
- Deferred the optional portfolio assistant until browser idle time so it does not compete with the first useful render.
- Added an explicit performance/reliability contract with degraded-state rules and production measurement targets.

### Differentiators
- Added a grounded portfolio assistant corpus that selects relevant published sources for each question.
- Assistant responses now return server-selected source links separately from model text, preventing model-generated citation paths.
- Reworked the assistant UI into a restrained bilingual portfolio surface with canonical source links.
- Fixed expired-session retry so the original submitted question is preserved.
- Added bilingual global portfolio search across published Work, Insights, About, Contact, and Resume.
- Added Cmd/Ctrl+K access plus arrow-key and Enter navigation without adding a search dependency or external service.
- Added deterministic admin content-health checks for bilingual readiness, SEO completeness, localized media alt text, capability translations, and evidence-backed quantified Work claims.
- Split dashboard attention into workflow state and content health, with blocking/review/info severity instead of an arbitrary health score.
- Content-health checks degrade safely when schema v2 or a required query is unavailable; no external link status is claimed without an actual check.

### Engineering
- Standardized the repository on pnpm and added lint/typecheck/test/build CI.
- Added repository contract tests.
- Removed the development-only public project API endpoint.
- Removed broad ESLint suppression from the auth proxy.

### Documentation
- Added the portfolio redesign PRD and supporting design/editorial/content contracts.
- Added dedicated visitor-facing UI/UX contracts for Work and Insight detail pages.
- Added phased implementation and v2 schema migration documentation.
- Added performance and reliability documentation covering caching, optional integrations, media delivery, AI grounding, and field-measurement targets.
