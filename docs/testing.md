# Testing and Quality Gates

This document owns test strategy, verified commands, fixture rules, required checks, release evidence, and handling of skipped or flaky tests.

## Document Status

- Status: Draft / Approved / Superseded
- Owner:
- Last verified:

## Quality Risk Summary

| Risk area | Failure impact | Test level or control | Required before release |
|---|---|---|:---:|
| Critical business rules |  |  |  |
| Authentication and authorization |  |  |  |
| Database integrity and migrations |  |  |  |
| External integrations |  |  |  |
| Critical user journeys |  |  |  |
| Performance and capacity |  |  |  |
| Accessibility |  |  |  |

## Verified Commands

Only record commands after successfully running them in the named environment.

| Purpose | Command | Preconditions | Expected result | Verified on |
|---|---|---|---|---|
| Lint |  |  |  |  |
| Format check |  |  |  |  |
| Typecheck |  |  |  |  |
| Unit tests |  |  |  |  |
| Integration tests |  |  |  |  |
| End-to-end tests |  |  |  |  |
| Contract tests |  |  |  |  |
| Migration tests |  |  |  |  |
| Security checks |  |  |  |  |
| Production build |  |  |  |  |

## Test Levels and Ownership

| Level | Purpose | Runs where | External dependencies | Owner |
|---|---|---|---|---|
| Static checks |  |  |  |  |
| Unit |  |  |  |  |
| Integration |  |  |  |  |
| Contract |  |  |  |  |
| End-to-end |  |  |  |  |
| Manual acceptance |  |  |  |  |
| Performance |  |  |  |  |
| Security |  |  |  |  |

## Required Checks by Change Type

| Change | Minimum required validation |
|---|---|
| Documentation only | Link, example, and consistency review |
| UI layout only | Visual review at supported breakpoints and accessibility checks |
| UI behavior | Component or E2E coverage for success, loading, empty, error, keyboard, and permissions |
| Business logic | Unit tests for rules, boundaries, transitions, and invalid cases |
| API or event contract | Schema, validation, authorization, compatibility, success, and failure tests |
| External integration | Sandbox or mock contract tests, timeout, retry, duplicate, and fallback behavior |
| Database schema | Migration from representative prior state, constraints, indexes, data preservation, and rollback or forward-fix review |
| Authentication or permissions | Positive and negative tests across roles, ownership, and tenant boundaries |
| Background job | Idempotency, retry, concurrency, partial failure, and rerun tests |
| Bug fix | Reproduction test that fails before the fix and passes after it |
| Deployment or configuration | Build, configuration validation, health check, rollout, and rollback evidence |

## Acceptance Traceability

Every MVP acceptance criterion must map to evidence.

| Feature spec | Acceptance criterion | Test or manual evidence | Environment | Status |
|---|---|---|---|---|
|  |  |  |  |  |

## Fixtures, Factories, and Test Data

- Factory or fixture location:
- Seed command:
- Stable test roles and accounts:
- Required boundary values:
- Required invalid and unauthorized records:
- Time and randomness control:
- Network and external-service isolation:
- Cleanup and isolation strategy:
- Parallel execution safety:
- Production data prohibition and sanitization:

## Database and Migration Testing

- Fresh database setup:
- Upgrade from previous release:
- Backfill verification:
- Constraint and race-condition tests:
- Representative query plans or performance checks:
- Downgrade or forward-fix validation:

## Non-functional Testing

### Performance

- Scenarios:
- Dataset size:
- Concurrency:
- Latency or throughput target:
- Resource limit:

### Accessibility

- Automated checks:
- Keyboard paths:
- Screen-reader paths:
- Zoom or text scaling:
- Contrast verification:

### Resilience

- Timeout simulation:
- Retry and duplicate simulation:
- Dependency outage behavior:
- Queue backlog or job failure:
- Process restart and recovery:

## Coverage Policy

Coverage is a diagnostic, not the product objective.

- Critical business and permission paths:
- New or changed behavior:
- Branch or line target if used:
- Exclusions and rationale:

## Flaky, Quarantined, or Skipped Tests

| Test | Reason | Risk | Owner or issue | Expiry or review date |
|---|---|---|---|---|
|  |  |  |  |  |

A skipped test without an owner and review date is unresolved work, not interior decoration.

## Manual Acceptance Record

For user-facing releases, record:

- build or commit:
- environment:
- role or account:
- steps performed:
- expected versus actual result:
- browser, device, or viewport:
- screenshots or recording location:
- tester and date:

## Passing Change Definition

- All required commands pass.
- Acceptance criteria have evidence.
- Negative, boundary, unauthorized, and failure paths are tested where applicable.
- No assertion, validation, authorization check, or test was weakened just to accept the implementation.
- Any unrun check is reported with reason and risk.
