# Changelog

All notable changes to this project are documented here.

## Unreleased

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
- Added dedicated visitor-facing UI/UX contracts for Work and Insight slug/detail pages, including desktop/mobile composition, evidence behavior, section hierarchy, rails/TOC, and anti-pattern gates.
- Added phased implementation plan and verification gates.
- Updated README to point to the tracked redesign documentation.
