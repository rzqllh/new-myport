# Changelog

All notable changes to this project are documented here.

## Unreleased

### Admin
- Rebuilt the admin shell around grouped information architecture and responsive navigation.
- Replaced the stats-first dashboard with attention, recent-edit, and publishing-state hierarchy.
- Reworked Work and Insights lists into editorial rows with search and publication-state filtering.
- Rebuilt Work and Insight editing around outline / canvas / inspector hierarchy.
- Added EN/ID authoring, permalink locking/change flow, unsaved-change protection, preview, publication state, and locale-aware SEO editing.
- Added dedicated bilingual Site Content editing for navigation and public page/section copy.
- Separated editorial copy from operational Settings.
- Removed fabricated hero-stat defaults from the admin settings model; location, availability, social profiles, SEO defaults, and resume remain factual operational settings.
- Added safe dual-write compatibility for the staged schema-v2 rollout.

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

### Engineering
- Standardized the repository on pnpm and added lint/typecheck/test/build CI.
- Added repository contract tests.
- Removed the development-only public project API endpoint.
- Removed broad ESLint suppression from the auth proxy.

### Documentation
- Added the portfolio redesign PRD and supporting design/editorial/content contracts.
- Added dedicated visitor-facing UI/UX contracts for Work and Insight detail pages.
- Added phased implementation and v2 schema migration documentation.
