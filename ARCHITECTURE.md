# System Architecture

This document owns durable technical boundaries and runtime decisions. Avoid duplicating facts that are already reliably expressed by manifests, generated schemas, or infrastructure code; link to them instead.

## Document Status

- Status: Draft / Approved / Superseded
- Owner:
- Last verified:
- Related ADRs:

## System Context

- Clients and actors:
- Application or services:
- Primary database and storage:
- External systems:
- Trust boundaries:
- Regions or network boundaries:

```mermaid
flowchart LR
  %% Replace this comment with the approved system-context diagram.
```

## Architecture Style

- Selected style:
- Why it fits the current scope:
- Explicitly rejected complexity:
- Expected scale and likely evolution trigger:

Examples include a modular monolith, client-server application, serverless application, event-driven service, or multiple services. Select one because the project requires it, not because diagrams enjoy company.

## Technology Stack

Pin major versions and link to executable sources of truth.

| Area | Choice and version | Purpose | Why selected | Source of truth |
|---|---|---|---|---|
| Runtime |  |  |  |  |
| Language |  |  |  |  |
| Web or application framework |  |  |  |  |
| UI framework |  |  |  |  |
| Database |  |  |  |  |
| ORM or query layer |  |  |  |  |
| Cache or queue |  |  |  |  |
| Object or file storage |  |  |  |  |
| Authentication |  |  |  |  |
| Validation and serialization |  |  |  |  |
| Testing |  |  |  |  |
| Build and package manager |  |  |  |  |
| Hosting and infrastructure |  |  |  |  |
| Observability |  |  |  |  |

Dependency policy:

- Automatically allowed:
- Requires approval:
- Banned or unsupported:
- Version and upgrade policy:

## Components and Boundaries

| Component or module | Responsibility | Owns data or contracts | May depend on | Must not depend on |
|---|---|---|---|---|
| `[component]` |  |  |  |  |

Cross-cutting rules:

- Domain and business rules live in:
- Database access occurs through:
- External integrations are isolated behind:
- Input validation occurs at:
- Authorization occurs at:
- Transaction boundaries are owned by:
- Shared code may contain:
- Shared code must not contain:

## Critical Runtime Flows

### Flow: `[name]`

Describe validation, authentication, authorization, persistence, transactions, side effects, retries, and response behavior.

```mermaid
sequenceDiagram
  %% Replace this comment with the approved sequence.
```

## Repository Layout

Document ownership, not every folder.

```text
[path]/      # responsibility
[path]/      # responsibility
```

| Path | Owner or responsibility | Allowed dependencies | Generated or hand-written |
|---|---|---|---|
|  |  |  |  |

## Runtime and Process Model

- Long-running processes:
- Request-serving process:
- Background workers:
- Scheduled jobs:
- Queue or event consumers:
- State held in memory:
- Horizontal scaling assumptions:
- Graceful shutdown behavior:

## External Integrations

| System | Purpose | Direction | Auth | Timeout | Retry | Failure or fallback | Sandbox available |
|---|---|---|---|---:|---|---|:---:|
|  |  | inbound / outbound |  |  |  |  |  |

Detailed contracts belong in `docs/api-contracts.md`.

## Configuration and Environments

| Environment | Purpose | Data policy | External services | Deployment trigger | Access owner |
|---|---|---|---|---|---|
| Local |  |  |  |  |  |
| Test |  |  |  |  |  |
| Staging |  |  |  |  |  |
| Production |  |  |  |  |  |

- Environment variable source of truth:
- Configuration validation behavior:
- Secret manager:
- Feature flag approach:
- Local dependency approach:
- Production configuration ownership:

## Data, Cache, Files, and Search

- Primary persistence:
- Cache purpose and invalidation:
- Queue purpose and delivery semantics:
- File upload and storage path:
- Search indexing and consistency:
- Data replication or read replicas:

Detailed relational design belongs in `docs/data-model.md`.

## Compatibility and Versioning

- Public API compatibility policy:
- Database migration compatibility window:
- Client/server version skew:
- Event schema evolution:
- Deprecated behavior removal policy:

## Performance and Capacity

Only use measurable constraints.

| Operation or resource | Expected load or size | Target | Measurement method |
|---|---:|---:|---|
|  |  |  |  |

- Maximum payload or upload size:
- Known hot paths:
- Capacity trigger that requires redesign:

## Reliability Principles

- Timeout policy:
- Retry policy:
- Idempotency policy:
- Circuit breaker or fallback policy:
- Partial failure behavior:
- Health and readiness behavior:

Detailed release and operations requirements belong in `docs/deployment.md`.

## Known Trade-offs and Technical Debt

| Trade-off or debt | Reason accepted | Impact | Owner | Revisit trigger |
|---|---|---|---|---|
|  |  |  |  |  |

## Open Architecture Decisions

| Question | Options considered | Blocking | Owner | Needed by |
|---|---|:---:|---|---|
|  |  | Yes / No |  |  |
