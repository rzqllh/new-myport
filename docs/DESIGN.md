# Design Direction — Editorial Professional Workspace

## 1. Design intent

The design should feel like a well-edited professional portfolio and a serious publishing workspace.

It must avoid:
- generic SaaS dashboard styling,
- purple/blue gradient identity,
- terminal cosplay,
- excessive glassmorphism,
- card-inside-card composition,
- badge and pill overuse,
- decorative telemetry,
- equal visual weight for every element,
- section templates repeated without editorial reason.

Public pages are more spacious and narrative.
Admin pages are denser and task-oriented.
Both use the same semantic system.

## 2. Visual hierarchy

Every page must define:
1. primary task or message,
2. primary content,
3. supporting metadata,
4. secondary actions,
5. tertiary/system information.

If two unrelated elements compete visually, hierarchy is unresolved.

Rules:
- One dominant heading per page state.
- Primary actions are scarce.
- Metadata is quieter than content.
- Borders separate structure; cards are used only where containment is meaningful.
- Whitespace is a hierarchy tool, not decoration.
- Repeated eyebrow labels are optional, never mandatory.
- Mono typography is metadata, not a personality effect.

## 3. Color system

Baseline direction: warm editorial neutrals with one oxblood accent.

Semantic roles are fixed; exact token values may be tuned during visual implementation after contrast and device review.

### Light
- canvas: #F5F2EB
- surface: #FBF9F4
- surface-subtle: #ECE7DE
- text: #191816
- text-muted: #6E6961
- border: #D7D0C5
- accent: #8F3430
- accent-strong: #712622
- success: restrained green
- warning: restrained amber
- danger: semantic red, distinct from brand accent

### Dark
- canvas: #131210
- surface: #1B1916
- surface-subtle: #24211D
- text: #F2EEE6
- text-muted: #AAA299
- border: #38332C
- accent: #D26A61
- accent-strong: #E07A70

Rules:
- No gradients as default decoration.
- Accent is for emphasis, current state, important links, and primary action—not for every icon.
- Status colors remain semantic.
- Dark mode must preserve hierarchy rather than invert light tokens mechanically.

## 4. Typography

Three roles only:

### Display
Editorial page and section headings. Strong character, used selectively.

### Sans
Primary interface, body, navigation, forms, tables, and general copy.

### Mono
Slug, dates, code, repository identifiers, technical metadata, and compact system labels.

Current fonts may be retained initially if they satisfy these roles, but implementation may change the exact families after visual testing. Do not add font families without a clear role.

## 5. Layout system

- Shared max-width logic across public pages.
- Public reading measure stays narrower than showcase media.
- Detail pages use asymmetry when it improves storytelling.
- Admin uses persistent desktop navigation and task context, not generic empty chrome.
- Layout must degrade intentionally across desktop, tablet, and mobile.
- Mobile cannot be a squeezed desktop grid.

Recommended responsive behavior:
- Desktop admin editor: outline / canvas / inspector.
- Tablet: collapsible outline + canvas + inspector drawer.
- Mobile: canvas first; outline and inspector become sheets.

## 6. Spacing and density

Use a consistent spacing scale.
Public:
- larger section separation,
- fewer visible controls,
- more breathing room around narrative transitions.

Admin:
- compact lists,
- strong grouping,
- persistent actions,
- less decorative whitespace.

Do not solve hierarchy by increasing every margin.

## 7. Components

### Buttons
- one clear primary style,
- quiet secondary/ghost actions,
- destructive actions visually separated,
- icon-only actions require accessible labels,
- do not append arrows to every CTA.

### Badges
Use only for real categorical/status information.
Do not convert ordinary labels into pills.

### Cards
Use where an object is genuinely self-contained:
- Work preview,
- media asset,
- message summary,
- discrete dashboard attention item.

Do not wrap whole page sections in cards by default.

### Tables and editorial lists
Use tables for comparable structured data.
Use editorial rows for content management where title, summary, status, locale completeness, and modified time matter more than strict columns.

### Forms
Group by decision, not database schema.
Helper copy explains consequences, not obvious labels.

### Empty states
State why the area is empty and the relevant next action. No generic illustration is required.

## 8. Motion

Motion communicates:
- navigation state,
- panel transitions,
- reordering,
- publish/save feedback,
- lightweight public content reveal.

Avoid:
- long entrance sequences,
- parallax as decoration,
- animated background noise,
- motion on every card,
- page transitions that delay navigation.

Reduced-motion must be respected.

## 9. Public page language

Public pages should feel editorial, not dashboard-like:
- fewer boxes,
- stronger typographic composition,
- media can span wider than text,
- metadata clusters use alignment rather than cards,
- evidence may become the dominant visual when it matters.

## 10. Admin language

Admin is an editorial workspace:
- context is always visible,
- publication state is clear,
- actions reflect priority,
- forms are replaced by task-based editing structures,
- status is not communicated only by color,
- preview is a first-class action.

## 11. Cross-page consistency

The following must remain consistent across all pages:
- semantic colors,
- type roles,
- spacing scale,
- border/radius logic,
- icon family and weight logic,
- focus treatment,
- button hierarchy,
- motion rules,
- empty/error/loading states,
- responsive breakpoints and panel behavior.

Page-level creativity must happen through composition and content, not by inventing a new design system.

## 12. Explicit anti-patterns

Reject during review:
- multiple equally loud CTAs,
- unnecessary metric rows,
- arbitrary progress percentages,
- every section in a rounded card,
- icon bubbles next to every heading,
- gradients used to fake visual interest,
- excessive uppercase mono labels,
- fake terminal/Git status decoration,
- generic “innovative / scalable / future-ready” copy,
- content duplicated in code and CMS,
- desktop-only layouts patched for mobile at the end.
