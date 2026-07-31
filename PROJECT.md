# Project Definition

This document owns product intent. Keep implementation details in the architecture, data, API, security, design, testing, and deployment documents.

## Document Status

- Status: Draft / Approved / Superseded
- Owner:
- Last verified:
- Evidence labels used: Confirmed / Inferred / Proposed / Unknown

## Product Summary

`[Product] helps [specific user] achieve [observable outcome] by [core mechanism].`

## Problem and Context

- Problem:
- Who experiences it:
- Current workaround:
- Cost or consequence of the current state:
- Why this project should exist now:

## Users, Actors, and Roles

Include human users, administrators, service accounts, scheduled jobs, and external systems that initiate actions.

| Actor or role | Description | Primary goal | Data they own | Data they may access | Authentication method |
|---|---|---|---|---|---|
| `[role]` |  |  |  |  |  |

## Goals

Use observable outcomes rather than implementation tasks.

- `[outcome]`
- `[outcome]`

## Non-goals

Explicitly exclude tempting adjacent work.

- `[not included]`
- `[not included]`

## Success and Release Evidence

| Outcome | Baseline | Target or completion signal | Measurement or evidence | Owner |
|---|---:|---:|---|---|
| `[outcome]` |  |  |  |  |

## Scope Matrix

| Capability | MVP | Later | Out of scope | Notes or dependency |
|---|:---:|:---:|:---:|---|
| `[capability]` |  |  |  |  |

## Core User Journeys

### Journey: `[name]`

- Actor:
- Starting condition:
- Trigger:

1. `[action or system event]`
2. `[validation or decision]`
3. `[system response]`
4. `[successful outcome]`

Alternative, failure, cancellation, and recovery paths:

- `[condition]` → `[expected behavior]`

## Business Rules

Write rules that can become tests or constraints.

| ID | Rule | Applies to | Enforcement point | Failure behavior |
|---|---|---|---|---|
| BR-001 | When `[condition]`, the system must `[behavior]`. |  | UI / API / service / database |  |

## Ownership and Permission Summary

This summary must agree with feature specs, `docs/security.md`, APIs, and database access policies.

| Resource | Action | Allowed actor | Conditions | Denied behavior |
|---|---|---|---|---|
| `[resource]` | create/read/update/delete |  |  |  |

## Product Lifecycle and State Rules

| Object or process | States | Allowed transitions | Terminal states | Who may transition it |
|---|---|---|---|---|
| `[object]` |  |  |  |  |

## Constraints

- Supported clients, devices, or browsers:
- Required language, locale, time zone, currency, or accessibility:
- Deadline or release window:
- Hosting, budget, or team constraints:
- Legal, privacy, compliance, or audit requirements:
- Required integrations or existing systems:
- Availability, performance, or volume expectations:
- Offline, weak-network, or device constraints:

## Assumptions

Only reversible assumptions may remain here. Label each one.

| Assumption | Evidence label | Risk if wrong | Validation owner and date |
|---|---|---|---|
|  | Proposed |  |  |

## Glossary

| Term | Exact project meaning | Must not be confused with |
|---|---|---|
| `[term]` |  |  |

## Open Questions

| Question | Why it matters | Blocking | Owner | Needed by |
|---|---|:---:|---|---|
|  |  | Yes / No |  |  |
