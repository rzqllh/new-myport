# Content Model and CMS Ownership

## 1. Source-of-truth rule

The portfolio currently mixes content across Supabase, constants, component fallbacks, and hardcoded JSX. The redesign must remove that ambiguity.

Ownership:
- CMS/database: editorial content and site configuration.
- Locale dictionaries: product/interface copy.
- Code: rendering, layout, behavior, schema validation, safe technical defaults.

A hardcoded fallback may support degraded rendering but must not become a second editable editorial database.

## 2. Core entities

### work_items
Shared non-language fields:
- id
- slug
- status
- visibility
- discipline
- type
- role_key or shared role metadata where appropriate
- timeframe/start/end
- featured
- sort_order
- live_url
- repository_url
- cover_media_id
- published_at
- created_at
- updated_at

### work_translations
- work_id
- locale
- title
- short_title optional
- summary
- tagline optional
- context
- challenge
- approach
- decisions
- outcome
- lessons optional
- seo_title
- seo_description
- publication state/readiness

Long-form sections may be represented as structured blocks if that improves flexible case studies.

### insights
Shared fields:
- id
- slug
- status
- cover_media_id
- published_at
- tags
- related_work_id optional
- created_at
- updated_at

### insight_translations
- insight_id
- locale
- title
- excerpt
- body
- seo_title
- seo_description
- publication state/readiness

### experience
Shared dates, ordering, company identity, and visibility may be separated from localized title/description where necessary.

### site_content
Structured page/section content rather than arbitrary one-row-per-string key/value storage.

Example namespaces:
- home.hero
- home.work_intro
- home.insights_intro
- about.intro
- work.index
- insights.index
- contact.intro
- footer
- navigation

Each supports locale variants.

### media
- id
- provider/public id
- URL
- type
- width/height
- alt text per locale where useful
- caption
- created_at
- usage/reference metadata if practical

### evidence
- id
- work_id
- type
- title
- description
- media_id or URL
- visibility
- source/date
- sort_order

Types may include:
- screenshot,
- architecture,
- repository,
- deployment,
- document_excerpt,
- research,
- metric_source,
- other.

### redirects
Defined in ROUTING_AND_I18N.md.

## 3. Work taxonomy

Do not use only developer-centric categories.

Recommended two-axis model:

Discipline:
- project-management
- product
- engineering
- research-design

Type:
- case-study
- product
- tool
- research
- system

A Work item can have one primary discipline and one type. Tags may add detail without becoming navigation taxonomy.

## 4. Skills and capabilities

Remove arbitrary proficiency percentages.

Prefer evidence relationships:
- skill/capability,
- category,
- level label only if needed,
- related Work items,
- sort order,
- visibility.

Potential level vocabulary:
- primary,
- working,
- familiar

Do not imply measurement precision that does not exist.

## 5. Site settings

Keep operational settings distinct from editorial content.

Settings:
- social profiles,
- contact address,
- location display,
- availability state,
- resume file,
- site URL,
- analytics flags,
- integration configuration references.

Editorial copy belongs in site_content, not generic settings JSON.

## 6. Translation model

Shared factual metadata is stored once.
Language-dependent copy is stored per locale.

Required supported locales:
- en
- id

Do not create two unrelated Work rows for the same project.

## 7. Publication model

Content must support:
- draft,
- published,
- archived where relevant.

Locale readiness may differ.
A Work item can exist while only English is published.

Preview must be able to render draft content for authenticated admin without exposing it publicly.

## 8. Evidence and claims

A metric field must support its source or evidence reference if published as a factual result.

If no reliable source exists, use qualitative outcome copy.

## 9. Migration principles

- preserve IDs where practical,
- map current projects to Work,
- map blog_posts to Insights,
- migrate slugs without unnecessary changes,
- migrate hardcoded project detail content into translation/content records,
- migrate hardcoded site copy into site_content,
- remove fallback editorial duplication only after CMS data is verified,
- migration must be repeatable or clearly one-time with documented verification.
