# Product and UI Design

This document owns information architecture, interaction behavior, visual rules, responsive behavior, accessibility, and product language.

## Document Status

- Status: Draft / Approved / Superseded
- Owner:
- Last verified:
- Design source or file:

## Experience Direction

- Intended feeling:
- Primary interaction style:
- Product personality:
- Should resemble:
- Must not resemble:

## Design Principles

1. `[principle tied to user need]`
2. `[principle tied to clarity or efficiency]`
3. `[principle tied to consistency or accessibility]`

## Information Architecture

| Route, screen, or surface | Purpose | Allowed roles | Primary action | Entry point | Exit or next step |
|---|---|---|---|---|---|
| `[path]` |  |  |  |  |  |

Navigation model:

- Global navigation:
- Contextual navigation:
- Breadcrumb or hierarchy behavior:
- Deep-link behavior:
- Back-button behavior:
- Unauthorized or missing-route behavior:

## Critical User Flows

### Flow: `[name]`

- Actor:
- Entry condition:
- Required data:

1. `[step]`
2. `[validation or system decision]`
3. `[confirmation or destructive step]`
4. `[success destination]`

Recovery and alternate paths:

- `[condition]` → `[expected behavior]`

## Screen and Component Inventory

| Screen or component | Data source | Actions | Permissions | States required | Feature spec |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Required States

Define applicable states for every data-driven screen and action.

| State | Required behavior |
|---|---|
| Initial | Clear starting state and primary next action |
| Loading | Preserve layout where practical and prevent duplicate actions |
| Empty | Explain why no data exists and provide an allowed next action |
| Validation error | Point to the affected field and preserve entered data |
| Request error | Explain safe recovery and preserve user work |
| Success | Confirm the result and reflect persisted state |
| Disabled | Explain prerequisites when not obvious |
| Unauthorized | Reveal no forbidden data and provide a safe route |
| Offline or timeout | Define stale data, retry, and queued-action behavior if applicable |
| Partial data | Mark unavailable sections without breaking valid content |
| Destructive confirmation | State impact, affected records, and reversibility |

## Responsive and Layout Rules

- Content width and density:
- Spacing or grid unit:
- Mobile behavior:
- Tablet behavior:
- Desktop and wide-screen behavior:
- Navigation transformation:
- Tables and dense data on small screens:
- Overflow, truncation, and long-content behavior:
- Touch target minimum:
- Print or export behavior if applicable:

## Design Tokens

Code is the executable source of truth. Document naming and intent here.

### Color

| Token | Value | Usage | Contrast requirement |
|---|---|---|---|
| `--color-*` |  |  |  |

### Typography

| Token or style | Font | Size | Weight | Line height | Usage |
|---|---|---:|---:|---:|---|
|  |  |  |  |  |  |

### Shape, Spacing, and Elevation

- Base spacing unit:
- Radius scale:
- Border rules:
- Elevation or shadow rules:
- Icon family and sizing:
- Content density options:

## Components and Forms

- Component library and customization policy:
- Form label and helper-text behavior:
- Required versus optional field treatment:
- Validation timing:
- Error placement and summary behavior:
- Unsaved changes behavior:
- Destructive action confirmation:
- Toast, banner, dialog, and inline-feedback rules:
- Table, pagination, filtering, sorting, and selection rules:
- Search behavior and debounce:
- Date, time, number, percentage, and currency formatting:
- File upload behavior, limits, preview, progress, and failure:

## Accessibility

- Target standard:
- Keyboard navigation and visible focus:
- Semantic controls and landmarks:
- Heading order:
- Form labels and error association:
- Dialog focus entry, trap, and return:
- Text alternatives for meaningful images:
- Color contrast and non-color indicators:
- Reduced motion:
- Screen-reader announcements for dynamic updates:
- Minimum supported zoom or text scaling:

## Motion

- Fast duration:
- Standard duration:
- Easing:
- Reduced-motion behavior:
- Motion may be used for:
- Motion must not be used for:

## Content, Locale, and Voice

- Product language and locale:
- Tone:
- Terminology source: `PROJECT.md#glossary`
- Date and time format:
- Time-zone display behavior:
- Number and currency format:
- Pluralization and translation approach:
- Button-label convention:
- Error-message convention:
- Empty-state convention:

## Analytics and Consent UI

- Events requiring visible consent:
- Cookie or tracking controls:
- Preference management:
- Privacy or data-export entry points:

## Explicitly Banned

- `[visual, copy, or interaction pattern]`
- Hidden or misleading destructive actions.
- Authorization enforced only by hiding UI controls.
- Placeholder copy that reaches production.

## References

| Reference | What to adopt | What not to copy | License or ownership |
|---|---|---|---|
|  |  |  |  |

## Open Design Questions

| Question | Why it matters | Blocking | Owner | Needed by |
|---|---|:---:|---|---|
|  |  | Yes / No |  |  |
