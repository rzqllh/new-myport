# Security

## Supported version

Security fixes are applied to the current production branch.

## Reporting a vulnerability

Please use GitHub's private security reporting / security advisory flow for this repository when available. Do not open a public issue containing credentials, exploit details, personal data, or a reproducible attack against the live site.

Include:
- affected route or feature,
- impact,
- reproduction steps,
- relevant request/response details with secrets removed.

## Secrets

Runtime credentials belong in the deployment environment and must not be committed.

The repository expects separate credentials for:
- database/auth,
- media storage,
- anti-abuse verification,
- AI,
- rate limiting,
- chat-session signing.

Client-exposed variables must use the explicit public prefix. Service-role, API-secret, signing-secret, and rate-limit credentials are server-only.

## Security baseline

The application uses:
- authenticated admin routes,
- database row-level security,
- server-side input validation,
- anti-abuse verification on the contact form,
- rate limiting for public write/AI endpoints,
- security response headers,
- short-lived signed chat sessions.

The current audit and deferred hardening work are documented in `docs/SECURITY_AUDIT.md`.
