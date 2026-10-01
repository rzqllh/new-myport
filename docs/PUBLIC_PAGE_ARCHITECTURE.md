# Public Page Architecture

## 1. Shared page contract

Each page must have:
- one clear primary purpose,
- one dominant heading or statement,
- a deliberate reading order,
- responsive hierarchy,
- localized editorial content,
- meaningful empty/degraded states.

Public pages should not all reuse “eyebrow + title + paragraph + grid of cards” as a default template.

## 2. Home

Suggested hierarchy:
1. Hero — identity, current focus, positioning, primary paths
2. Selected Work — 3–4 strongest items
3. Experience/capability bridge — why the combination of PM, systems thinking, and implementation matters
4. Selected Insights
5. Contact/resume closure

Testimonials are optional and should appear only if credible and attributable.

GitHub activity is secondary and should not dominate the hero.

## 3. Work index

Purpose: help visitors choose relevant evidence.

Hierarchy:
- concise editorial intro,
- filters only when they help,
- selected/featured work,
- remaining work.

Filters may use discipline/type. Avoid a control-heavy gallery for a small dataset.

## 4. Work detail

The detail page is narrative, not a fixed component checklist.

### Opening
- breadcrumb/back context,
- discipline/type/status when meaningful,
- title,
- short summary,
- role/timeframe,
- primary external action if relevant,
- hero visual or evidence when available.

Do not place all metadata inside a “Project Specifications” card by default.

### Body
Possible sections:
- Context
- Challenge
- Role and responsibilities
- Approach
- Key decisions
- Implementation/architecture
- Evidence
- Outcome
- Lessons
- Related insight/work

Only render relevant sections.

### Evidence
Evidence may interrupt the text column and expand to a wider media canvas. It should feel integrated into the story.

### Metrics
Render only sourced, relevant metrics. Never render a three-stat banner as a mandatory visual pattern.

## 5. Insights index

Purpose: expose useful written thinking, not blog volume.

Hierarchy:
- editorial intro,
- featured/recent piece if justified,
- simple list/grid,
- topic filters only when enough content exists.

## 6. Insight detail

### Header
- title,
- concise dek/excerpt,
- publish/update date,
- topic metadata,
- related Work if applicable.

### Article body
- readable measure,
- strong heading hierarchy,
- images/diagrams can break out wider,
- code blocks only when necessary,
- optional TOC for genuinely long pieces,
- references/notes where relevant.

### End
- related Work,
- related Insights,
- contact or resume only when contextually appropriate.

## 7. About

Purpose:
Explain the professional through-line.

Recommended:
- current role/focus,
- career narrative,
- operating style,
- experience timeline,
- capabilities linked to evidence,
- education where relevant,
- resume/contact.

Avoid skill-cloud decoration and arbitrary proficiency bars.

## 8. Contact

Keep the page simple:
- short intro,
- direct contact path,
- secure form,
- social/profile links,
- availability if intentionally maintained.

## 9. Resume

- clean web resume,
- printable,
- downloadable file,
- sourced from current structured content where practical,
- no conflicting dates or role names versus About.

## 10. Navigation

English labels:
- Work
- About
- Insights
- Contact

Indonesian labels may use:
- Karya / Pekerjaan
- Tentang
- Insight / Catatan
- Kontak

Final Indonesian display labels should be chosen through editorial review, not literal translation rules.

Route segments remain stable independent of display labels.

## 11. Loading, empty, and degraded states

- Work/Insight unavailable: show clear fallback or retry-safe state.
- GitHub unavailable: omit secondary activity rather than showing alarming error UI.
- AI unavailable: assistant reports unavailability without affecting navigation.
- Media unavailable: preserve layout and content hierarchy.

Core portfolio content must remain useful when optional integrations fail.
