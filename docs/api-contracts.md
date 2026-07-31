# API, Events, Jobs, and Integration Contracts

This document owns externally observable contracts between clients, services, workers, webhooks, and third-party systems. Generated specifications remain the implementation source of truth where available.

## Document Status

- Status: Draft / Approved / Superseded
- Owner:
- Last verified:
- Generated API or schema path:

## Contract Conventions

- Protocol and style:
- Base path or service address:
- Versioning strategy:
- Authentication transport:
- Content type and encoding:
- Field naming convention:
- Date and time format:
- Time-zone convention:
- Monetary value convention:
- Identifier format:
- Null versus omitted-field behavior:
- Unknown-field behavior:
- Maximum request and upload size:

## Standard Response and Error Model

Success envelope:

```json
{
  "replace": "with the approved shape or mark no envelope"
}
```

Error envelope:

```json
{
  "code": "STABLE_MACHINE_CODE",
  "message": "Safe user-facing or client-facing message",
  "details": {},
  "request_id": "correlation identifier"
}
```

| Error code | Status or outcome | Meaning | Safe to retry | Client behavior |
|---|---:|---|:---:|---|
|  |  |  |  |  |

## Authentication, Authorization, and Scoping

- Unauthenticated operations:
- Authentication requirements:
- Tenant or workspace scoping:
- Resource ownership checks:
- Service-to-service authentication:
- Token or session expiry behavior:
- Revocation behavior:

Detailed security requirements belong in `docs/security.md`.

## HTTP or RPC Operations

Copy this section for each public or internal operation.

### Operation: `[METHOD /path or RPC name]`

- Purpose:
- Actor or caller:
- Required permission:
- Idempotent: Yes / No / Conditional
- Rate limit class:
- Transaction boundary:
- Feature spec:

Path or method parameters:

| Name | Type | Required | Validation | Meaning |
|---|---|:---:|---|---|
|  |  |  |  |  |

Request body:

| Field | Type | Required | Validation | Sensitive | Meaning |
|---|---|:---:|---|:---:|---|
|  |  |  |  |  |  |

Success responses:

| Status or outcome | Schema | When returned | Side effects |
|---|---|---|---|
|  |  |  |  |

Failure responses:

| Status or outcome | Stable error code | Trigger | Information disclosure limit |
|---|---|---|---|
|  |  |  |  |

Authorization and data filtering:

- `[rule]`

Idempotency and duplicate behavior:

- `[rule or not applicable]`

Observability:

- Log fields:
- Metrics:
- Trace or correlation behavior:

## List, Search, Pagination, and Sorting

- Pagination style:
- Default and maximum page size:
- Cursor stability:
- Allowed sort fields:
- Tie-breaker order:
- Filter syntax:
- Search semantics:
- Total-count behavior:
- Empty-result behavior:

## File Upload and Download Contracts

| Operation | Allowed type | Size limit | Validation or scanning | Storage visibility | Expiry | Error behavior |
|---|---|---:|---|---|---|---|
|  |  |  |  |  |  |  |

- Signed URL policy:
- Filename and metadata sanitization:
- Range or streaming support:
- Deletion behavior:

## Events and Messages

Copy this section for each event.

### Event: `[event.name.v1]`

- Producer:
- Consumers:
- Trigger:
- Delivery semantics:
- Ordering guarantee:
- Partition or routing key:
- Schema source:
- Sensitive fields:

| Field | Type | Required | Meaning | Compatibility rule |
|---|---|:---:|---|---|
|  |  |  |  |  |

- Duplicate handling:
- Retry and dead-letter behavior:
- Replay behavior:
- Schema evolution:

## Background and Scheduled Jobs

| Job | Trigger or schedule | Input | Idempotency key | Timeout | Retry | Concurrency | Failure owner |
|---|---|---|---|---:|---|---:|---|
|  |  |  |  |  |  |  |  |

- Missed-run behavior:
- Backfill behavior:
- Manual rerun procedure:
- Partial-completion behavior:

## Webhooks

| Webhook | Direction | Authentication or signature | Retry | Duplicate handling | Ordering | Endpoint owner |
|---|---|---|---|---|---|---|
|  | inbound / outbound |  |  |  |  |  |

- Signature verification and replay protection:
- Subscription lifecycle:
- Secret rotation:
- Payload versioning:
- Disablement after repeated failure:

## External Integration Contracts

| System | Capability used | Sandbox | Credentials owner | Timeout | Retry | Quota | Fallback | Data shared |
|---|---|:---:|---|---:|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## Compatibility, Deprecation, and Rollout

- Compatibility guarantee:
- Additive versus breaking-change definition:
- Deprecation notice period:
- Consumer inventory:
- Dual-read or dual-write plan when applicable:
- Contract test location:
- Rollback behavior:

## Open Contract Decisions

| Question | Affected consumers | Blocking | Owner | Needed by |
|---|---|:---:|---|---|
|  |  | Yes / No |  |  |
