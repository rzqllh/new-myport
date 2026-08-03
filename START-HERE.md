# Project Bootstrap Workflow

Use this workflow before substantial implementation. Its purpose is to establish a coherent project baseline without turning discovery into an endless interview.

## Operating Mode

Select one:

- `[ ] Greenfield`: no meaningful implementation exists yet.
- `[ ] Existing repository`: inspect current code, configuration, migrations, tests, and deployment files before proposing changes.

## Evidence Labels

Every material statement created during bootstrap must be one of:

- **Confirmed**: explicitly provided by the owner or verified in the repository.
- **Inferred**: derived from strong evidence; cite that evidence.
- **Proposed**: a recommended, reversible choice awaiting approval.
- **Unknown**: not enough information; keep it visible as an open question.

Never present **Inferred**, **Proposed**, or **Unknown** information as confirmed fact.

## Decision Policy

An agent may choose a sensible default without blocking only when the choice is:

- low risk;
- easy to reverse;
- internal rather than user-visible or contractual;
- recorded as **Proposed** in the relevant document.

The agent must stop and request a decision before making irreversible or high-impact assumptions about:

- product scope or paid behavior;
- roles, permissions, ownership, or data visibility;
- authentication and account recovery;
- destructive actions or deletion policy;
- legal, privacy, compliance, financial, or safety behavior;
- database identifiers, tenancy, or migration strategy when production data exists;
- public APIs, external integrations, billing, notifications, or deployment ownership.

## Bootstrap Steps

### 1. Inspect

For an existing repository, inspect at minimum:

- repository tree and package manifests;
- lockfiles and runtime version files;
- environment examples and configuration loaders;
- schema, migrations, seeds, and generated clients;
- routes, API definitions, jobs, events, and integrations;
- authentication and authorization code;
- tests, lint, typecheck, and build scripts;
- container, CI/CD, infrastructure, and deployment files;
- existing documentation and open issues supplied by the owner.

Record verified commands and source paths. Do not infer a stack from filenames alone when executable configuration is available.

### 2. Discover

Ask only high-leverage questions that block the baseline. Group related questions and avoid asking for details that can be verified from the repository.

The minimum discovery set is:

1. Who uses the product, and what outcome must each role achieve?
2. What is included in the first deployable scope, and what is explicitly excluded?
3. What business rules, approvals, ownership rules, or destructive actions matter?
4. What data is stored, who may see or change it, and how long must it exist?
5. Which platforms, integrations, operational limits, deadlines, or compliance constraints apply?
6. What evidence will prove the project is ready to release?

### 3. Establish the Baseline

Fill documents in this order:

1. `PROJECT.md`
2. `docs/feature-spec-template.md` copied into `docs/features/<feature>.md` for each MVP feature
3. `ARCHITECTURE.md`
4. `docs/data-model.md`
5. `docs/api-contracts.md`
6. `docs/security.md`
7. `DESIGN.md`
8. `docs/testing.md`
9. `docs/deployment.md`
10. `docs/decisions.md`, `docs/status.md`, and `docs/execution-plan.md`

Do not design the database before product entities, ownership, permissions, and lifecycle rules are understood. Tables are not a substitute for requirements, despite their excellent posture.

### 4. Cross-check

Before coding, verify that:

- every MVP capability has at least one user journey and acceptance criterion;
- every role and permission agrees across product, feature, API, security, UI, and data documents;
- every persisted concept has an owner, lifecycle, retention rule, and deletion behavior;
- every relation has cardinality and foreign-key behavior;
- every public operation has validation, authorization, success, failure, and idempotency behavior where relevant;
- every UI flow covers loading, empty, error, success, unauthorized, and destructive states where relevant;
- every production dependency has configuration, timeout, retry, observability, and failure handling;
- database migrations and deployments have a safe order and rollback or forward-fix path;
- acceptance criteria map to tests and release checks;
- no unresolved blocking question has been silently converted into implementation.

### 5. Readiness Report

Present a concise report containing:

- confirmed scope and non-goals;
- recommended stack and material trade-offs;
- system diagram and data model summary;
- MVP features and acceptance coverage;
- security and permission model;
- deployment target and release path;
- unresolved blockers;
- implementation milestones.

## Baseline Approval Gate

Implementation may begin only when all applicable items are true:

- [ ] Product scope and non-goals are explicit.
- [ ] Roles, permissions, ownership, and critical business rules are explicit.
- [ ] MVP feature specs have testable acceptance criteria.
- [ ] Architecture and dependency boundaries are coherent.
- [ ] Database schema, relations, constraints, migration, and retention are defined.
- [ ] API and integration contracts are defined.
- [ ] Security-sensitive choices have no unresolved assumptions.
- [ ] UI routes, flows, states, responsive behavior, and accessibility target are defined.
- [ ] Test commands and required quality gates are defined.
- [ ] Deployment, rollback, backup, monitoring, and secret handling are defined.
- [ ] Blocking questions are resolved or implementation is explicitly limited around them.
