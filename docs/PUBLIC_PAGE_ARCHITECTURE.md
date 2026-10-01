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

For the detailed UI/UX contract of public detail pages, see [DETAIL_PAGE_UIUX.md](./DETAIL_PAGE_UIUX.md).

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

The full page-level composition, responsive layout, evidence behavior, sticky rules, loading states, and anti-pattern gate are defined in [DETAIL_PAGE_UIUX.md](./DETAIL_PAGE_UIUX.md).

Non-negotiable summary:
- title and summary dominate the opening,
- metadata is visually quieter and usually aligned in a rail/group rather than a specifications card,
- primary evidence appears early when meaningful,
- body section hierarchy follows the story,
- media may break beyond the reading column,
- only relevant sections render,
- metrics require evidence and context,
- mobile uses a deliberate one-column reading order rather than a compressed desktop layout.

## 5. Insights index

Purpose: expose useful written thinking, not blog volume.

Hierarchy:
- editorial intro,
- featured/recent piece if justified,
- simple list/grid,
- topic filters only when enough content exists.

## 6. Insight detail

The full article-page UI/UX is defined in [DETAIL_PAGE_UIUX.md](./DETAIL_PAGE_UIUX.md).

Non-negotiable summary:
- title/dek first,
- metadata remains tertiary,
- readable article measure,
- optional TOC only for long structured pieces,
- media may break out wider,
- related Work is contextually integrated,
- no generic blog-template chrome.

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
