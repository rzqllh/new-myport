# Database and Data Model

This document owns the logical database design, entity relationships, field meaning, constraints, indexes, transactions, migration safety, and data lifecycle. Executable schema and migrations remain the implementation source of truth.

## Document Status

- Status: Draft / Approved / Superseded
- Owner:
- Last verified:
- Executable schema path:
- Migration path:

## Storage Overview

| Storage | Product and version | Purpose | Source of truth | Backup required |
|---|---|---|---|:---:|
| Primary database |  |  |  |  |
| Cache |  |  |  |  |
| Object or file storage |  |  |  |  |
| Search index |  |  |  |  |
| Queue or event store |  |  |  |  |

Conventions:

- Schema or namespace strategy:
- Table and column naming:
- Primary-key strategy:
- Foreign-key naming:
- Time storage and precision:
- Time-zone policy:
- Monetary value representation:
- Enum representation:
- JSON usage policy:
- Soft-delete policy:
- Tenant or workspace isolation strategy:
- Audit-column policy:

## Entity Relationship Diagram

Replace the comment with the approved logical ERD. Include all persisted MVP entities and associative tables. Cardinality must agree with the relationship matrix and executable schema.

```mermaid
erDiagram
  %% ENTITY_A ||--o{ ENTITY_B : relationship_name
```

## Entity Catalog

| Entity | Purpose | Owner or tenant boundary | Created by | Lifecycle summary | Retention |
|---|---|---|---|---|---|
| `[Entity]` |  |  |  |  |  |

## Entity Definitions

Copy this section for every entity, including join tables whose constraints carry business meaning.

### Entity: `[EntityName]`

- Purpose:
- Source feature or business rule:
- Ownership or tenant boundary:
- Expected row count at launch:
- Expected growth:

| Column | Database type | Application type | Null | Default | Key or constraint | Meaning and validation | Sensitive class |
|---|---|---|:---:|---|---|---|---|
| `id` |  |  | No |  | PK |  |  |
| `created_at` |  |  | No |  |  |  |  |
| `updated_at` |  |  | No |  |  |  |  |

Keys and constraints:

| Name | Type | Columns or expression | Business rule enforced | Deferrable |
|---|---|---|---|:---:|
|  | PK / FK / UNIQUE / CHECK / EXCLUDE |  |  |  |

Relationships:

| Local column | Target entity and column | Cardinality | Required | On update | On delete | Ownership implication |
|---|---|---|:---:|---|---|---|
|  |  | one-to-one / one-to-many / many-to-many |  |  | restrict / cascade / set null |  |

Lifecycle and state transitions:

```mermaid
stateDiagram-v2
  %% Replace with approved states and transitions, or write "Not applicable".
```

Invariants that must always remain true:

- `[invariant]`

Derived or denormalized fields:

| Field | Derived from | Update strategy | Consistency expectation | Rebuild method |
|---|---|---|---|---|
|  |  |  |  |  |

## Relationship Matrix

This is the cross-entity review table. Do not leave important delete behavior implicit.

| Parent | Child or join entity | Cardinality | Foreign key | On delete | Orphan allowed | Cross-tenant relation allowed | Reason |
|---|---|---|---|---|:---:|:---:|---|
|  |  |  |  |  |  |  |  |

## Access and Row-Level Data Rules

This must agree with `PROJECT.md`, feature specs, and `docs/security.md`.

| Entity or view | Operation | Actor or role | Row condition | Column restrictions | Enforcement layer |
|---|---|---|---|---|---|
|  | SELECT / INSERT / UPDATE / DELETE |  |  |  | service / database policy / both |

## Query Patterns and Indexes

Design indexes from known queries, ordering, uniqueness, and expected scale.

| ID | Query or screen | Filters | Sort | Join path | Expected rows scanned or returned | Index or partition |
|---|---|---|---|---|---:|---|
| Q-001 |  |  |  |  |  |  |

Index catalog:

| Index | Entity | Columns or expression | Type | Unique | Supports query IDs | Write cost accepted |
|---|---|---|---|:---:|---|---|
|  |  |  | B-tree / GIN / full-text / other |  |  |  |

## Transactions, Concurrency, and Idempotency

| Operation | Tables or resources | Atomicity requirement | Isolation or locking | Race protected by | Idempotency behavior |
|---|---|---|---|---|---|
|  |  |  |  | unique constraint / version / lock |  |

- Long-running transaction risks:
- Deadlock-sensitive order:
- Optimistic concurrency field:
- Duplicate submission strategy:
- Event or outbox consistency strategy:

## Validation Boundaries

| Rule | UI validation | API validation | Domain validation | Database enforcement |
|---|:---:|:---:|:---:|:---:|
|  |  |  |  |  |

Business-critical invariants should use database constraints when the database can enforce them safely.

## Migration and Backfill Strategy

- Migration tool and command:
- Naming convention:
- Expand-and-contract policy:
- Backward-compatible deployment window:
- Lock and table-scan review:
- Large-table strategy:
- Backfill batching and resumability:
- Verification query:
- Rollback or forward-fix policy:
- Production migration owner:

### Migration Template

| Step | Change | Compatible with old app | Compatible with new app | Verification | Rollback or forward fix |
|---|---|:---:|:---:|---|---|
| 1 |  |  |  |  |  |

## Seed, Fixtures, and Demo Data

- Seed command:
- Idempotent seed behavior:
- Required local accounts and roles:
- Required boundary and failure records:
- Stable identifiers allowed:
- Production-like volume generation:
- Personal or production data sanitization rule:

## Data Classification, Retention, and Deletion

| Data or column group | Classification | Encryption or masking | Logged | Retention | Deletion or anonymization trigger | Exportable |
|---|---|---|:---:|---|---|:---:|
|  | Public / Internal / Confidential / Restricted |  |  |  |  |  |

Deletion workflow:

- User-requested deletion:
- Account or tenant deletion:
- Legal hold:
- Backup expiry behavior:
- Search, cache, analytics, and file cleanup:

## Backup, Restore, and Recovery Data Requirements

- Backup scope:
- Recovery point objective:
- Recovery time objective:
- Restore test frequency:
- Point-in-time recovery:
- Integrity verification:

Operational implementation belongs in `docs/deployment.md`.

## Open Data Decisions

| Question | Affected entities or migrations | Blocking | Owner | Needed by |
|---|---|:---:|---|---|
|  |  | Yes / No |  |  |
