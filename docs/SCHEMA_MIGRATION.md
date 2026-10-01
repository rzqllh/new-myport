# Content Schema v2 Migration

## Strategy

Migration 006 is deliberately additive.

The existing `projects`, `blog_posts`, `project_images`, `experiences`, `skills`, `messages`, `site_settings`, and `about` tables remain available while the redesigned public/admin surfaces are introduced.

This prevents a route or editor cutover from becoming a destructive database migration.

## New model

The migration introduces:

- `work_items` + `work_translations`
- `insights` + `insight_translations`
- `media_assets` + `media_translations`
- `work_media`
- `work_evidence` + localized evidence copy
- `site_content`
- `content_redirects`
- `experience_translations`
- `capabilities` + localized names/descriptions
- `portfolio_admins`
- a tracked `contacts` compatibility table

## Legacy data

Existing English projects, posts, experiences, images, and skills are copied into the v2 model without deleting the legacy source rows.

Legacy numeric skill proficiency is intentionally not copied. Migrated capabilities begin with the qualitative `working` level.

## Admin authorization

The previous schema treated every authenticated Supabase user as an administrator.

Migration 006 introduces `portfolio_admins` and `is_portfolio_admin()`.

To avoid locking the current owner out during migration:
- while `portfolio_admins` is empty, the existing authenticated-user behavior remains;
- the first authenticated user may claim their own ID;
- after an admin row exists, authorization resolves against the explicit admin table.

The admin UI must expose the bootstrap/verification state before the legacy fallback is considered removable.

## Contact drift

Runtime currently writes to `contacts`, while the oldest tracked schema defines `messages`.

Migration 006 ensures `contacts` exists and copies legacy message rows into it. The old table is retained until the admin Inbox cutover is complete.

## Verification

CI starts a clean PostgreSQL 16 service, runs every tracked migration in order, inserts representative legacy rows before migration 006, and verifies that Work, Insight, Capability, site-content, and admin-authorization data are created correctly.

This verifies migration syntax and the legacy-copy path independently of the production database.

## Production application

Apply migrations in numeric order through the normal Supabase migration workflow before enabling admin/public code that requires v2 tables.

Do not drop the legacy tables during the redesign release. Removal requires a separate, explicitly verified cleanup migration after production data has been reconciled.
