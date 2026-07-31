# Security and Privacy

This document owns the security model, authentication, authorization, trust boundaries, abuse controls, secret handling, and sensitive-data protections. Security requirements must also be enforced in code, infrastructure, tests, and database policies where applicable.

## Document Status

- Status: Draft / Approved / Superseded
- Security owner:
- Last reviewed:
- Required compliance or policy baseline:

## Assets and Trust Boundaries

| Asset | Value or impact | Who may access it | Where stored or processed | Classification |
|---|---|---|---|---|
|  |  |  |  |  |

```mermaid
flowchart LR
  %% Replace with trust boundaries and data flows that matter to security.
```

## Threat Model

| Threat or abuse case | Entry point | Impact | Likelihood | Prevent | Detect | Respond |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

Explicitly consider, where applicable:

- broken access control and cross-tenant access;
- credential theft, session fixation, and account takeover;
- injection, unsafe deserialization, and untrusted file handling;
- CSRF, XSS, SSRF, open redirects, and clickjacking;
- brute force, scraping, spam, denial of service, and resource exhaustion;
- webhook replay and forged callbacks;
- secret leakage through source, logs, errors, builds, or client bundles;
- dependency, CI/CD, and supply-chain compromise;
- destructive or fraudulent workflows;
- sensitive-data exposure in analytics, support tools, backups, or exports.

## Authentication

- Identity provider or method:
- Supported login methods:
- Password requirements if applicable:
- Multi-factor authentication:
- Email or phone verification:
- Session or token storage:
- Session duration and idle timeout:
- Refresh and rotation:
- Logout and revocation:
- Password reset or account recovery:
- Failed-attempt and lockout behavior:
- Device or location notifications:
- Service account authentication:

## Authorization

Use deny-by-default behavior. This matrix must agree with `PROJECT.md`, feature specs, APIs, UI behavior, and database access policies.

| Resource | Action | Role or principal | Allowed when | Enforcement points | Negative test |
|---|---|---|---|---|---|
|  |  |  |  | API / service / database |  |

- Tenant or workspace isolation:
- Resource ownership resolution:
- Administrative override rules:
- Impersonation or support access:
- Permission caching and invalidation:
- Object-level and field-level restrictions:

## Input, Output, and File Safety

| Boundary | Input source | Validation and normalization | Output encoding or filtering | Size or rate limit |
|---|---|---|---|---|
|  |  |  |  |  |

- HTML or rich-text sanitization:
- URL allowlist or SSRF protection:
- Redirect validation:
- Upload type verification:
- Malware scanning:
- Filename and path handling:
- Archive and decompression limits:
- CSV or spreadsheet formula safety:

## Browser and Client Security

- Cookie attributes:
- CSRF protection:
- Content Security Policy:
- CORS policy:
- Clickjacking protection:
- Referrer policy:
- Sensitive client storage:
- Client-visible environment variables:
- Deep-link or custom-protocol validation:

## Secrets and Key Management

| Secret or key | Used by | Storage | Access owner | Rotation | Revocation or emergency action |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

- No real secrets in source, examples, prompts, logs, fixtures, or screenshots.
- Local secret distribution:
- Production secret injection:
- Key-encryption or signing-key policy:
- Least-privilege credentials:

## Data Protection and Privacy

- Data classifications: see `docs/data-model.md`.
- Encryption in transit:
- Encryption at rest:
- Field-level encryption or tokenization:
- Log redaction:
- Analytics and telemetry minimization:
- Consent and lawful basis if applicable:
- Data export and portability:
- User deletion and retention:
- Backup expiry and deletion limitations:
- Data residency:
- Third-party processors:

## Rate Limits and Abuse Controls

| Operation | Principal or key | Limit | Burst | Response | Bypass owner |
|---|---|---:|---:|---|---|
|  |  |  |  |  |  |

- Bot or automation policy:
- Fraud or anomalous behavior signals:
- Resource quotas:
- Cost-amplification protections:

## Audit and Security Logging

| Event | Actor | Target | Required fields | Retention | Alert condition |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

Logs must avoid credentials, session tokens, sensitive payloads, and unnecessary personal data.

## Dependencies and Supply Chain

- Dependency review policy:
- Lockfile policy:
- Vulnerability scanning:
- License review:
- Pinned actions or build images:
- Artifact signing or provenance:
- Secret scanning:
- Update and patch ownership:

## Security Verification

- Static analysis:
- Dependency scan:
- Secret scan:
- Authorization tests:
- Abuse and rate-limit tests:
- Manual review or penetration test:
- Required evidence before release:

## Security Incident Basics

- Detection channel:
- Incident owner:
- Credential revocation procedure:
- Containment path:
- User or regulator notification requirement:
- Evidence preservation:
- Post-incident review location:

## Accepted Risks and Open Questions

| Risk or question | Impact | Current control | Accepted by or owner | Review trigger |
|---|---|---|---|---|
|  |  |  |  |  |
