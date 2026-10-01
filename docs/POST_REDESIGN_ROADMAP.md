# Post-redesign hardening roadmap

This roadmap starts after the portfolio redesign baseline merged to `master`.

Priority is based on production risk and maintenance value, not feature novelty. Each phase is implemented on its own stacked branch. Branches are merged into `master` only after every phase gate is green.

## P1 — Critical: release QA and browser verification

Branch: `phase/11-release-qa`

Scope:
- Playwright browser harness,
- canonical and legacy-route verification,
- EN/ID document semantics,
- keyboard search,
- unauthenticated admin protection,
- contact native validation,
- assistant surface,
- mobile navigation,
- reduced-motion browser coverage,
- manual production smoke workflow.

## P2 — High: security, assistant safety, and observability

Branch: `phase/12-security-observability`

Scope:
- public-write origin policy,
- bounded model output and upstream timeout,
- proxy/IP normalization contract,
- privacy-safe operational events,
- expanded assistant adversarial/retrieval harness,
- degraded-state telemetry.

## P3 — High/medium: CMS resilience

Branch: `phase/13-cms-resilience`

Scope:
- editorial revision snapshots and guarded restore,
- authenticated export/backup,
- preview-token foundation for draft review,
- deterministic content-health expansion.

## P4 — Medium: supply chain and governance

Branch: `phase/14-governance`

Scope:
- CodeQL,
- Dependabot policy,
- dependency review on pull requests,
- merge/release governance documentation.

## P5 — Lower: performance and content maturity

Branch: `phase/15-performance-content`

Scope:
- bundle/client-boundary audit contracts,
- route error/degraded states,
- resume/print QA refinements,
- media/content evidence audit tooling,
- field-performance measurement guide after production deployment.

## Merge rule

P2 starts from P1 head, P3 from P2, and so on. At completion, merge P1 through P5 into `master` in order. Do not deploy or merge intermediate phases merely to satisfy tooling.
