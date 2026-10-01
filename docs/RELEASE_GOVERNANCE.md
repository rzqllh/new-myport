# Release and repository governance

## Priority

Repository governance protects the release path; it does not replace product tests.

Required release evidence, in order:
1. CI `quality` green.
2. CI `e2e` green.
3. CodeQL green or reviewed with no unresolved high-confidence issue.
4. Dependency review green for pull requests that change the dependency graph.
5. Production smoke after a production deployment exists.

## Branching

- `master` is the production source of truth.
- Product work uses scoped branches.
- The post-redesign hardening program uses stacked phase branches and merges them only after every phase is green.
- Do not force-push `master`.
- Do not bypass a failing test by weakening or deleting the assertion unless the contract itself is intentionally changed and documented.

## Pull requests

- No bot/Codex/GPT review comments are required or permitted by the automated workflows in this repository.
- Dependency Review explicitly uses `comment-summary-in-pr: never`.
- Dependabot may open dependency PRs, but nothing auto-merges them.
- High or critical dependency findings require review before merge.
- PR descriptions must identify user-visible, schema, security, or deployment implications.

## Dependency policy

- pnpm is the only package manager.
- Lockfile updates are committed with dependency changes.
- Runtime dependency additions need a concrete product requirement.
- Prefer existing dependencies over a second library solving the same problem.
- Dependabot groups minor/patch runtime and development updates separately.
- Major updates remain individual decisions.

## GitHub Actions supply chain

- Third-party actions are pinned to immutable commit SHAs.
- Version comments next to SHAs document the reviewed upstream release.
- Workflow permissions are least-privilege.
- Security workflows never receive application production secrets.

## Branch protection / ruleset target

The GitHub connection available to this implementation can read repository rulesets but cannot mutate branch-protection administration. The intended `master` ruleset is:

- require pull request before merge,
- require branch to be up to date,
- require `quality`, `e2e`, `analyze / javascript-typescript`, and `dependency-review` when applicable,
- block force-push,
- block branch deletion,
- do not allow bypass except explicit repository-owner emergency recovery.

This is an account/repository administration control, not an application-code setting. Its live repository state must be verified independently from this tracked contract.

## Production release

A Git merge is not evidence that production updated successfully.

After deployment:
- verify deployed commit SHA,
- run the environment-driven Production smoke workflow,
- confirm canonical redirects, EN/ID document language, sitemap/robots, and security headers,
- record field performance only from the live deployment.

If Vercel rejects a deployment because of platform quota/rate limiting, keep `master` as the source of truth and do not promote an older preview as a substitute.
