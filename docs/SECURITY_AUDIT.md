# Security Audit

Baseline reviewed from the redesign branch.

## Implemented in Phase 1

- Single committed package-manager lockfile policy.
- Duplicate environment-variable declarations removed.
- Development-only public project endpoint removed.
- Broad ESLint disable removed from the auth proxy.
- Security headers added at the Next.js boundary.
- Chat request shape and message limits validated with Zod.
- Chat payload size guarded before model invocation.
- Chat rate limiting made lazy and fail-closed in production when unavailable.
- Contact submissions rate-limited server-side in addition to anti-abuse verification.
- Request IP extraction normalized before it is used as a rate-limit key.
- Chat signing secret no longer silently falls back to a production default.
- CI runs lint, typecheck, repository-contract tests, and production build.

## RLS/admin authorization finding

The initial schema grants full content-management access to any authenticated Supabase user via policies using `auth.role() = 'authenticated'`.

That is acceptable only if the Auth project is strictly closed to a single trusted administrator. It is not a strong authorization model for future multi-user auth.

Phase 2 must replace this assumption with an explicit administrator authorization contract while preserving access for the current owner. The migration must be staged so production admin access is not accidentally locked out.

## Contact schema drift

The current server action writes to `contacts`, while the initial migration in this repository defines a `messages` table. The live database therefore appears to have schema history not fully represented by the tracked migrations.

Phase 2 must reconcile the live content/contact schema before making destructive or ownership-changing migrations. Do not guess at production table state.

## CSP note

The initial CSP intentionally allows inline scripts/styles needed by the current Next.js/application stack and allows HTTPS/WSS connections broadly enough not to break existing integrations. It is a baseline, not the final narrow policy.

After the redesign stabilizes, tighten origins based on actual production traffic and remove allowances that are no longer required.

## Required follow-up

- explicit admin authorization,
- authoritative schema reconciliation,
- least-privilege RLS for the final content model,
- confirm service-role key usage remains server-only,
- review file upload authorization and deletion,
- validate final CSP against production integrations,
- add end-to-end authorization tests once the new admin model exists.


## Post-redesign hardening

The production-hardening pass adds:
- same-origin enforcement for the public chat write endpoint,
- request IDs on chat responses for support correlation,
- bounded Gemini output and a 12-second application timeout,
- a 10-second Turnstile verification timeout,
- explicit trusted-header precedence for rate-limit IP keys,
- fail-closed public rate-limit dependencies in production,
- structured operational events limited to event metadata.

Operational events must not include chat text, contact-form content, names, email addresses, session tokens, verification tokens, or raw IP addresses. Detailed user content remains outside the operational log contract.

Next.js Server Actions retain the framework's origin protections. The explicit application origin policy is applied to the standalone public chat route where the application directly owns the POST boundary.
