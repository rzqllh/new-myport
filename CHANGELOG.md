# Changelog

All notable changes to this project are documented here.

## Unreleased

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
- Added the portfolio redesign PRD.
- Added unified public/admin design direction.
- Added bilingual editorial and anti-slop copy standards.
- Added Work/Insights routing, slug, permalink, redirect, and locale contracts.
- Added CMS content model and source-of-truth rules.
- Added the admin editorial workspace specification.
- Added public page hierarchy contracts.
- Added dedicated visitor-facing UI/UX contracts for Work and Insight slug/detail pages.
- Added phased implementation plan and verification gates.
- Added the v2 schema migration and compatibility strategy.
- Updated README to point to the tracked redesign documentation.
