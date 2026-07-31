# Feature Specification: `[Feature Name]`

Copy this file to `docs/features/<feature-name>.md`. One feature spec should describe one coherent user or system capability.

## Metadata

- Status: Draft / Approved / In progress / Shipped / Superseded
- Owner:
- Last verified:
- Related request, issue, or evidence:
- Dependencies:

## Outcome

`[Actor] can [capability] so that [observable value].`

## Context

- Current behavior:
- Problem or trigger:
- Why it belongs in the approved scope:
- Relevant evidence:

## Scope

Included:

- `[behavior]`

Not included:

- `[explicit non-goal]`

## Actors, Permissions, and Ownership

| Action | Actor or role | Allowed when | Data scope | Denied behavior |
|---|---|---|---|---|
|  |  |  |  |  |

## Business Rules

| ID | Rule | Enforcement point | Failure behavior |
|---|---|---|---|
| FR-001 | When `[condition]`, the system must `[behavior]`. |  |  |

## User or System Flow

- Entry condition:
- Trigger:

1. `[step]`
2. `[validation or authorization]`
3. `[state change or side effect]`
4. `[result]`

Alternative, cancellation, timeout, duplicate, and recovery behavior:

- `[condition]` → `[expected behavior]`

## State Model

```mermaid
stateDiagram-v2
  %% Replace with approved states and transitions, or write "Not applicable".
```

| From | Action or event | Guard | To | Side effect | Actor |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Data Impact

- New or changed entities:
- New or changed fields:
- Constraints and indexes:
- Ownership or tenant impact:
- Migration and backfill:
- Retention or deletion impact:
- Seed or fixture impact:

Update `docs/data-model.md` for durable changes.

## API, Event, Job, or Integration Impact

- Operation or contract:
- Request or event fields:
- Response or result:
- Validation:
- Authorization:
- Idempotency or duplicate handling:
- Timeout and retry:
- Compatibility and versioning:
- External failure or fallback:

Update `docs/api-contracts.md` for durable changes.

## UI and Content Requirements

- Routes, screens, or components:
- Primary action:
- Loading state:
- Empty state:
- Validation error:
- Request error and retry:
- Success feedback:
- Disabled state:
- Unauthorized state:
- Destructive confirmation:
- Responsive behavior:
- Keyboard and screen-reader behavior:
- Product copy or localization:

Update `DESIGN.md` for shared patterns.

## Security and Privacy Impact

- Threat or abuse cases:
- Sensitive data:
- Access-control change:
- Logging and redaction:
- Rate limit or quota:
- Audit event:
- Security review required:

## Acceptance Criteria

Use externally observable behavior and include negative cases.

- [ ] Given `[precondition]`, when `[action]`, then `[observable result]`.
- [ ] Given `[boundary or invalid input]`, when `[action]`, then `[safe result]`.
- [ ] Given an actor without `[permission or ownership]`, when `[action]`, then access is denied without exposing forbidden data.
- [ ] Duplicate, retry, refresh, or concurrent execution preserves correct data where applicable.
- [ ] Loading, empty, error, success, and destructive states behave as specified where applicable.

## Analytics and Observability

| Signal | Trigger | Properties | Sensitive-data restriction | Purpose |
|---|---|---|---|---|
|  |  |  |  |  |

- Diagnostic logs:
- Metrics or dashboard:
- Alert impact:

## Rollout and Rollback

- Feature flag or kill switch:
- Deployment order:
- Migration dependency:
- Compatibility window:
- Rollout audience or percentage:
- Success and abort signals:
- Rollback or forward-fix path:

## Test Plan

| Test level | Scenario | Expected result | Fixture or dependency |
|---|---|---|---|
| Unit |  |  |  |
| Integration |  |  |  |
| Contract |  |  |  |
| End-to-end |  |  |  |
| Manual or accessibility |  |  |  |

## Open Questions

| Question | Why it matters | Blocking | Owner | Needed by |
|---|---|:---:|---|---|
|  |  | Yes / No |  |  |
