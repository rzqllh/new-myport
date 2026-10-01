# Routing, Locale, Slug, and Permalink Contract

## 1. Canonical public routes

Default English:
- /
- /work
- /work/[slug]
- /insights
- /insights/[slug]
- /about
- /contact
- /resume

Indonesian:
- /id
- /id/work
- /id/work/[slug]
- /id/insights
- /id/insights/[slug]
- /id/about
- /id/contact
- /id/resume

## 2. Legacy redirects

Permanent redirects:
- /projects -> /work
- /projects/[slug] -> /work/[slug]
- /blog -> /insights
- /blog/[slug] -> /insights/[slug]

If legacy Indonesian routes are introduced during migration, they must also redirect to the new canonical structure.

## 3. Locale strategy

- English is default and has no locale prefix.
- Indonesian uses /id.
- Shared entity slug is used across locales.
- Display labels may be localized independently from route segments.
- Missing locale content has an explicit fallback policy; it must never pretend to be translated content.

Recommended fallback:
- listing may show only content available in the active locale,
- a direct URL to an unavailable translation may offer the English version with a clear language switch,
- canonical metadata must match the rendered locale.

## 4. Slug design

Slug is a stable content identifier, not a normalized full title.

Good Work slugs:
- lumina
- rangkai
- network-monitoring
- mobile-banking-research

Good Insight slugs:
- windows-diagnostics
- monitoring-data-quality
- semantic-dark-mode

Avoid:
- full-sentence slugs,
- dates unless required for collision,
- category duplication,
- meaningless generated IDs,
- changing slug whenever title changes.

## 5. Slug lifecycle

### Draft
- suggested automatically from initial title,
- editable,
- uniqueness checked,
- reserved words blocked.

### First publish
- slug becomes the canonical permalink.

### After publish
- title changes do not update slug.
- slug change requires an explicit permalink-change action.
- old permalink is stored and permanently redirected.

## 6. Redirect history

Maintain a redirect entity with:
- id,
- content_type,
- content_id,
- old_slug,
- new_slug/current target,
- locale scope if ever needed,
- created_at.

Redirect loops and duplicate sources are invalid.

## 7. Slug generation rules

- Unicode normalize.
- Lowercase.
- Transliterate where needed.
- Replace separators with one hyphen.
- Trim hyphens.
- Reasonable max length.
- Check uniqueness within content type.
- Handle collision explicitly.
- Block reserved names.

Reserved examples:
- admin
- api
- new
- edit
- settings
- work
- insights
- about
- contact
- resume
- id

## 8. Admin permalink UX

Show:
- canonical base URL,
- editable slug segment,
- availability state,
- draft/published lock state,
- consequence copy.

Published edit flow must display:
“Changing this permalink keeps the previous URL active with a permanent redirect.”

## 9. SEO

Each localized page must define:
- canonical URL,
- alternate locale URL,
- hreflang,
- localized title and description,
- locale-correct Open Graph metadata.

Sitemap includes both locales and last-modified values when reliable.

## 10. Migration safety

Before route migration:
- inventory current published slugs,
- generate redirect map,
- detect collisions,
- test all old URLs,
- verify canonical and sitemap output,
- verify internal links and admin previews use new routes.
