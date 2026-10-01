# Phase 10C — Admin Content Health

## Goal

Turn the admin dashboard's attention area into deterministic editorial quality checks.

## User value

The owner can see concrete publish-quality gaps before visitors encounter incomplete portfolio content.

## Scope

Checks use existing database data only:
- Work missing Indonesian published translation.
- Work missing SEO description.
- Work missing summary.
- Published Work without evidence when the narrative contains a numeric claim.
- Insight missing Indonesian published translation.
- Insight missing SEO description.
- Public media missing localized alt text.
- Capabilities missing Indonesian copy.
- Existing draft and unread-message checks remain.

## Non-goals

- No external broken-link crawler.
- No AI-generated quality score.
- No arbitrary numeric health score.
- No background job.

## UX

- Group issues by severity: blocking, review, informational.
- Link each issue to the closest admin editor.
- Show an explicit all-clear state when deterministic checks pass.
- Avoid equal-weight statistic cards.

## Gate

- Checks are derived from CMS state, not hardcoded content.
- No false claim that an external URL is healthy without checking it.
- Dashboard remains usable if schema v2 is not yet available.
- Lint, typecheck, tests, and production build pass.
