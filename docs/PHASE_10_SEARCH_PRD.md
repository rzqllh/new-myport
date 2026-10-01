# Phase 10B — Global Portfolio Search

## Goal

Provide one fast keyboard-accessible way to find published Work, Insights, and core profile pages.

## User value

Visitors can move directly to relevant evidence without navigating multiple index pages.

## Scope

- Add a global search dialog available from desktop and mobile navigation.
- Keyboard shortcut: Cmd/Ctrl+K.
- Search published Work and Insights from the same CMS-backed public data layer.
- Include core destinations: About, Contact, Resume.
- Respect the current locale and canonical routes.
- Client-side ranking only; no additional search service or dependency.
- Empty state explains that only published portfolio content is searchable.

## Non-goals

- No fuzzy-search package.
- No command execution.
- No admin search.
- No search analytics in this phase.

## UX

- Search input receives focus on open.
- Arrow-key result navigation and Enter activation are supported.
- Escape closes the dialog.
- Results expose content type and short supporting text.
- UI follows the editorial design language, not terminal/command-palette cosplay.

## Gate

- Keyboard flow works.
- Locale paths are correct.
- Search corpus contains no unpublished content.
- Lint, typecheck, tests, and production build pass.
