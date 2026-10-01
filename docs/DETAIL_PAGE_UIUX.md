# Detail Page UI/UX — Work and Insights

This document defines the public-page UI/UX for `/work/[slug]` and `/insights/[slug]`. It is about the actual visitor-facing page composition, hierarchy, responsive behavior, and interaction model—not only slug generation, routing, or admin permalink management.

## 1. Shared intent

A detail page must feel authored around the content being shown.

It must not look like:
- a generated case-study template,
- a CMS field dump,
- a stack of interchangeable cards,
- a dashboard page stretched vertically,
- a Medium clone,
- a developer portfolio with decorative terminal/telemetry blocks.

The layout must establish a visible reading hierarchy within the first screen.

Shared priorities:
1. identify the work/article,
2. establish why it matters,
3. show the most important visual/evidence early,
4. support scanning without flattening all sections,
5. keep metadata quieter than the story,
6. let media change the rhythm,
7. end with a relevant next action rather than a generic CTA wall.

---

# Part A — /work/[slug]

## 2. Work detail information hierarchy

A Work page should answer, in order:

1. What is this?
2. What was the context/problem?
3. What was my role?
4. What did I actually do or decide?
5. What evidence supports the story?
6. What changed as a result?
7. Where can the visitor go next?

Technical depth is conditional. A PMO case study, product system, research project, and engineering tool may use different middle sections while sharing the same visual language.

## 3. Desktop composition

Target canvas:
- global page max width: approximately 1280–1440 px,
- narrative reading column: approximately 640–760 px,
- metadata/context rail: approximately 220–300 px where needed,
- breakout media can expand to the full content canvas.

The opening should use an asymmetric editorial grid instead of one centered column with a specifications card.

Recommended opening grid:

```
┌──────────────────────────────────────────────────────────────┐
│ back / Work                         locale / optional status │
│                                                              │
│ TITLE / TITLE / TITLE             Role                      │
│ TITLE                              Timeframe                 │
│                                    Discipline               │
│ concise summary                    Links                     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                 HERO VISUAL / PRIMARY EVIDENCE              │
└──────────────────────────────────────────────────────────────┘
```

Rules:
- title dominates the opening,
- summary is visually second,
- metadata sits in a quiet aligned rail or row,
- external links are secondary unless the live product itself is the primary artifact,
- do not put metadata inside a large rounded “Project Specifications” card,
- do not prepend five badges before the title.

## 4. Opening / first fold

The first viewport should contain enough information to understand the Work item without scrolling through decorative framing.

Recommended elements:
- back/breadcrumb context,
- localized title,
- short summary/dek,
- role,
- timeframe,
- primary discipline/type,
- one or two relevant external actions,
- primary visual/evidence entering the fold where possible.

Optional:
- confidentiality/redaction note,
- current status,
- related employer/client context if publishable.

Avoid:
- large metric strip before context,
- duplicate title inside a browser mockup,
- “01 / Challenge” labels before the reader knows the project,
- multiple icon chips,
- fake “Live GitHub” activity.

## 5. Hero visual behavior

The hero visual is not mandatory.

If present, it may be:
- product screenshot,
- photographed artifact,
- redacted report/dashboard,
- architecture diagram,
- research output,
- interface composition,
- relevant document spread.

Display rules:
- media width may exceed the text column,
- use actual image aspect ratio unless a deliberate crop is required,
- captions remain visually subordinate,
- image containers use minimal decoration,
- do not place every screenshot inside fake browser chrome,
- do not use generic gradient fallback art if no meaningful visual exists.

If no meaningful media exists, the opening remains typographic and moves directly into context.

## 6. Narrative body layout

Desktop body should use a primary reading column with an optional contextual rail.

Example:

```
┌───────────────────────┬──────────────────────────────────────┐
│ optional section rail │ Context                              │
│ / metadata / TOC      │ narrative copy                       │
│                       │                                      │
│                       │ Challenge                            │
│                       │ narrative copy                       │
│                       │                                      │
│                       │ [wide evidence breakout]             │
│                       │                                      │
│                       │ Decisions / Approach                 │
└───────────────────────┴──────────────────────────────────────┘
```

The rail is conditional. Do not show an empty/sticky rail solely for symmetry.

Possible rail content:
- section index for long case studies,
- role/timeframe,
- related tools,
- evidence list,
- repository/live link,
- confidentiality note.

## 7. Section hierarchy

Sections do not use equal visual weight.

Recommended hierarchy:
- H1: page title only,
- H2: major narrative sections,
- H3: subsections/decision points,
- body: regular narrative,
- metadata: smaller and lower contrast,
- callouts: only for information that genuinely deserves interruption.

Section headings should use plain, human language.

Good:
- Context
- The issue
- My role
- What changed
- Key decisions
- Implementation
- Evidence
- Outcome
- What I learned

Avoid forcing numbered labels such as:
- 01 / THE CHALLENGE
- 02 / THE SOLUTION
- 03 / CORE SUBSYSTEMS

Numbering is allowed only if sequence itself matters.

## 8. Evidence presentation

Evidence is part of the story, not a gallery appended at the end.

Evidence variants:
- inline figure,
- wide breakout,
- before/after pair,
- document excerpt,
- metric with source,
- diagram,
- repository/deployment reference,
- research table or methodology excerpt.

A wide evidence breakout may span beyond the reading column.

Desktop pattern:

```
          narrative column
               │
       ┌───────┴───────┐
┌───────────────────────────────┐
│       evidence / image        │
└───────────────────────────────┘
       caption + source
```

Rules:
- source/caption visible where needed,
- redacted evidence must be labelled as redacted,
- don't wrap every evidence item in a rounded card,
- a metric should include context and source rather than just a large number.

## 9. Metrics and outcomes

Metrics must appear in context.

Preferred:
```
Outcome
50 network elements removed from the monitoring view after B2C traffic
reached 0% during the reviewed period.

Source: monthly operational reconciliation.
```

Avoid:
```
[ 50+ ] [ 98% ] [ 15+ ]
NETWORK ELEMENTS / DELIVERY / TEAMS
```

unless those values are independently meaningful, sourced, and genuinely comparable.

A single important number may be visually enlarged within the narrative. Do not force a three-column metric pattern.

## 10. Technical architecture sections

Only engineering-heavy Work uses technical architecture sections.

Preferred treatments:
- real architecture diagram,
- annotated flow,
- compact structured list,
- prose explaining trade-offs.

Avoid:
- four identical architecture cards with generic icons,
- code-like decoration without technical value.

## 11. Related content and closing

Closing order:
1. final outcome/lesson if relevant,
2. related Insight or Work,
3. next Work item,
4. small contact/resume path only if contextually appropriate.

Do not end every page with a large generic “Let’s work together” banner.

A next Work item should preview:
- title,
- one-line context,
- optional thumbnail,
- clear direction.

## 12. Work detail mobile

Mobile reading order:
1. back context,
2. title,
3. summary,
4. metadata stack,
5. primary action(s),
6. hero/evidence,
7. narrative,
8. related content.

Rules:
- metadata rail collapses into an inline metadata group,
- sticky desktop TOC becomes a compact jump menu only for long content,
- no horizontal card carousels for core narrative,
- evidence uses full available viewport width,
- captions remain readable,
- action buttons do not occupy a permanent large bottom dock unless a real task requires it,
- no forced two-column metrics.

Typography and whitespace scale down, but hierarchy must remain.

## 13. Work detail tablet

Tablet should not simply use desktop columns at reduced width.

Preferred:
- opening metadata moves below or beside summary depending on available width,
- narrative remains one primary column,
- section index becomes collapsible or non-sticky,
- media remains generous.

---

# Part B — /insights/[slug]

## 14. Insight detail intent

Insights should feel like a professional editorial publication connected to actual work.

It should not feel like:
- a generic blog template,
- a newsletter landing page,
- a technical documentation portal unless the article actually requires that density.

## 15. Insight desktop opening

Recommended hierarchy:

```
Insights / topic

ARTICLE TITLE
ARTICLE TITLE

Short dek explaining the question or argument.

Date · reading context · related Work

[optional hero media]
```

Rules:
- title is primary,
- excerpt/dek is secondary,
- date/tags are tertiary,
- related Work can be visible near metadata,
- author identity need not be repeated aggressively on every article in a personal portfolio.

## 16. Insight article grid

For standard articles:
- main reading measure: approximately 640–760 px,
- optional left or right TOC rail for long structured pieces,
- images/diagrams may break out wider,
- references may use a narrower secondary style.

Possible desktop layout:

```
┌───────────────┬──────────────────────────────────┐
│ optional TOC  │ article                          │
│               │                                  │
│               │ paragraph                        │
│               │ heading                          │
│               │                                  │
│               │ ┌──────────────────────────────┐ │
│               │ │ wide image / diagram         │ │
│               │ └──────────────────────────────┘ │
└───────────────┴──────────────────────────────────┘
```

TOC appears only when the article length/structure justifies it.

## 17. Insight typography

Article reading comfort has priority over decorative type.

Rules:
- body line length remains readable,
- paragraphs have clear but not excessive spacing,
- H2/H3 separation is distinct,
- code/technical terms use mono only when semantically appropriate,
- blockquotes are restrained,
- links are visually discoverable without relying only on color,
- tables scroll safely on small screens.

## 18. Insight media

Media types:
- screenshot,
- diagram,
- chart,
- redacted operational artifact,
- code sample,
- table,
- figure.

Media may break out wider than article text.

Captions should answer what the reader is looking at, not restate alt text.

## 19. Insight relationship to Work

If an Insight is tied to a Work item, show a quiet “Related work” module:
- Work title,
- short context,
- link.

It should not interrupt the opening unless the relationship materially helps understanding.

At article end, related Work has higher value than a generic category carousel.

## 20. Insight mobile

- title remains dominant,
- metadata wraps naturally,
- TOC becomes collapsible,
- code and tables scroll within their own region,
- media may extend to page gutters,
- no sticky social/share rail,
- no intrusive reading-progress ornament.

A thin progress indicator is optional only if it improves orientation on long articles.

---

# Part C — Interaction, states, and system behavior

## 21. Sticky behavior

Allowed:
- global nav behavior defined by site shell,
- section index for long Work/Insight pages,
- compact article TOC.

Not allowed by default:
- sticky CTA card,
- sticky “hire me” rail,
- permanent social share toolbar,
- sticky external-link panel consuming reading width.

Sticky elements must disappear or simplify on narrow screens.

## 22. In-page navigation

For long Work pages:
- section index may highlight current section,
- anchor scrolling respects reduced motion,
- anchors must not hide headings behind fixed navigation.

For Insights:
- TOC only if meaningful,
- current-heading state is optional,
- no generated TOC for articles with only a few sections.

## 23. Loading UI

Skeleton must resemble actual hierarchy:
- title lines,
- metadata line/rail,
- main media block if expected,
- reading column.

Do not show a grid-card skeleton on a detail page.

Prefer server-rendered primary content to minimize visible loading.

## 24. Error and unavailable states

Not found:
- concise 404,
- return to Work/Insights,
- relevant content suggestions if available.

Content integration failure:
- core CMS content still renders,
- optional GitHub/live metadata disappears quietly,
- media failure preserves caption/context,
- AI failure never affects page rendering.

## 25. Accessibility

- semantic article/main/aside/figure elements where appropriate,
- one H1,
- logical heading order,
- visible focus,
- captions associated with figures,
- alt text authored in the active locale where required,
- no hover-only evidence or actions,
- no color-only status meaning,
- reading order must remain correct when CSS grid collapses.

## 26. Responsive verification matrix

Each detail-page implementation must be reviewed at minimum at:
- ~375 px mobile,
- ~768 px tablet,
- ~1024 px small desktop,
- ~1440 px desktop.

Review:
- title wrapping,
- metadata order,
- media crop,
- reading measure,
- section hierarchy,
- rail/TOC behavior,
- actions,
- captions,
- related content,
- dark/light parity.

## 27. Detail-page anti-pattern gate

Reject implementation if it:
- starts with five or more pills/badges,
- uses a generic specifications card as the main metadata pattern,
- forces every Work item into Challenge/Solution/Architecture/Features,
- forces three metrics for visual symmetry,
- puts every screenshot in fake browser chrome,
- wraps each section in a card,
- uses repeated numbered eyebrow labels for visual identity,
- shows decorative live telemetry,
- makes metadata compete with the title,
- duplicates the same CTA in header, body, sticky rail, and footer,
- uses a desktop side rail that becomes an unusable mobile sidebar,
- renders the same page composition for every Work type without content-based variation.

## 28. Required page-level design review before implementation

Before coding each detail-page family, implementation must provide:
- desktop wireframe/composition,
- mobile composition,
- content hierarchy,
- section variants,
- evidence/media placement rules,
- interaction/sticky rules,
- empty/error/loading behavior.

A route or CMS model is not considered complete until the actual visitor-facing page UI/UX satisfies this document.
