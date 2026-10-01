# Product Requirements Document — Portfolio Redesign

## 1. Product definition

The portfolio is a bilingual professional portfolio, work archive, editorial publication, and lightweight content management system for Hafizh Rizqullah Prasetya.

The product must present a coherent professional identity across three connected capabilities:

- IT project management and coordination,
- product and systems thinking,
- technical implementation and engineering.

The portfolio must not read as a generic developer template, a design showcase without evidence, or a corporate marketing landing page. It should show work through context, decisions, artifacts, evidence, and outcomes.

## 2. Primary audiences

### Recruiter or hiring manager
Needs a fast understanding of current role, experience, relevant work, skills, and contact/resume access.

### Technical reviewer
Needs enough implementation detail to assess architecture, technical judgment, source code, demos, and engineering trade-offs.

### Project or business stakeholder
Needs to understand project scope, coordination responsibilities, operating context, decisions, evidence, and results without reading implementation-heavy material.

### Owner/editor
Needs to maintain content, bilingual copy, projects, articles, experience, media, SEO, and publication state without editing source code.

## 3. Product goals

1. Make the professional positioning understandable within the first screen and the first two minutes of browsing.
2. Replace developer-centric project presentation with a broader Work model.
3. Replace Blog with Insights, covering technical notes, PM practice, research, product thinking, and retrospectives.
4. Make all editorial public content manageable from /admin.
5. Introduce first-class English and Indonesian authoring.
6. Establish stable short permalinks with redirect history.
7. Redesign admin as an editorial workspace instead of CRUD pages.
8. Redesign Work and Insights detail pages around narrative hierarchy and evidence.
9. Remove fabricated, arbitrary, or unverifiable metrics.
10. Improve performance, accessibility, SEO, security, testing, and maintainability.
11. Keep all pages and sections visually related through one design system.
12. Support preview-before-publish and safe content iteration.

## 4. Non-goals

- Building a general-purpose CMS for multiple users.
- Creating a social network, comments platform, or newsletter service.
- Making every string database-driven.
- Implementing machine translation as the canonical bilingual workflow.
- Turning the site into an analytics dashboard.
- Adding decorative AI features without a clear visitor task.
- Requiring every Work item to use the same case-study template.
- Inventing numbers to make case studies look more impressive.

## 5. Information architecture

Public baseline:

- /
- /work
- /work/[slug]
- /insights
- /insights/[slug]
- /about
- /contact
- /resume
- /id
- /id/work
- /id/work/[slug]
- /id/insights
- /id/insights/[slug]
- /id/about
- /id/contact
- /id/resume

Legacy routes remain supported with permanent redirects:
- /projects -> /work
- /projects/[slug] -> /work/[slug]
- /blog -> /insights
- /blog/[slug] -> /insights/[slug]

Default locale is English without a prefix. Indonesian uses /id.

## 6. Core product requirements

### 6.1 Home
Must communicate:
- current professional identity,
- current focus or role,
- concise positioning,
- selected Work,
- relevant experience or capabilities,
- selected Insights,
- clear contact/resume paths.

The home page must not rely on decorative statistics to create credibility.

### 6.2 Work
Work replaces Projects.

Work supports:
- professional case studies,
- product/system work,
- engineering,
- research/design,
- tools/automation.

Each Work item may use only the sections relevant to it.

### 6.3 Insights
Insights replaces Blog.

Allowed content:
- project retrospectives,
- technical notes,
- PM and operating practice,
- research and design findings,
- lessons learned,
- documented explorations.

No filler SEO articles.

### 6.4 About
Must explain the relationship between project management, systems/product thinking, and technical execution. It must not be a long autobiography.

### 6.5 Contact
Must be short, secure, and reliable. Direct-contact fallback must remain available if the form service is unavailable.

### 6.6 Resume
Must provide a stable public resume route and a downloadable current resume managed from admin. Content should share sources with Experience where practical to reduce drift.

### 6.7 Admin
Admin must provide:
- overview and attention items,
- Work management,
- Insights management,
- Experience,
- Skills/capabilities,
- Testimonials if used,
- Messages,
- Media,
- Site Content,
- Settings,
- preview and publication workflows,
- locale completion status,
- permalink management.

## 7. Dynamic content ownership

Editorial content that must be manageable from admin:
- Home copy,
- About copy,
- Work listing intro,
- Insights listing intro,
- Contact copy,
- Footer copy,
- navigation labels,
- SEO defaults,
- Work and Insight content,
- Experience,
- capabilities/skills,
- testimonials,
- social links,
- location display,
- availability state,
- resume/CV,
- media and evidence.

Code may contain safe defaults for degraded rendering, but those defaults are not a second editorial source of truth.

## 8. Bilingual requirements

English and Indonesian must be stored as related translations of one content entity.

Requirements:
- shared non-language metadata,
- independent draft/publish readiness per locale,
- locale switch in admin,
- no runtime machine translation as canonical content,
- natural Indonesian professional language,
- concise professional English,
- hreflang and locale-aware canonical metadata,
- missing translation must have an explicit state rather than silently copying another language.

## 9. Evidence requirements

Work claims may reference:
- public repository,
- live deployment,
- screenshot,
- architecture diagram,
- redacted document,
- public artifact,
- research method,
- source metric,
- release or commit history.

Evidence is optional per claim, but numbers and outcome statements must not be invented.

## 10. AI assistant requirements

If retained:
- grounded only in approved portfolio content,
- cite or link relevant Work, Insight, or Experience sources when useful,
- input and output limits,
- abuse protection and rate limits,
- clear unavailable state,
- no stale hardcoded biography as silent fallback,
- no claim generation beyond available portfolio data.

AI is secondary to navigation and content.

## 11. Quality requirements

### Performance
- Avoid force-dynamic unless data freshness requires it.
- Prefer ISR/cached server reads and on-demand revalidation.
- Optimize media and responsive images.
- Consolidate repeated server reads.

### Accessibility
- Full keyboard navigation.
- Visible focus.
- Semantic headings and landmarks.
- Reduced-motion support.
- Accessible dialogs, drawers, forms, tables/lists, and validation.
- WCAG AA contrast target.

### Security
- RLS audit.
- Admin authorization review.
- Input validation.
- Rate limiting for public write endpoints.
- CSP and standard security headers.
- No server secrets in client bundles.

### Testing
Minimum merge gate:
- lint,
- typecheck,
- unit/component tests,
- production build.

Critical flows receive end-to-end coverage.

## 12. Success criteria

A release is successful when:
- public routes use Work and Insights terminology,
- old routes redirect correctly,
- Work and Insights have stable permalink management,
- EN and ID content can be independently maintained,
- Home and core page copy are editable in admin,
- Work detail supports flexible case-study sections,
- admin editor has a clear outline/canvas/inspector hierarchy,
- claims do not rely on fabricated metrics,
- the public site and admin clearly share one design language,
- the site passes agreed CI, accessibility, and production smoke gates.
