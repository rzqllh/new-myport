# Phase 10D — Motion and Interaction Quality

## Goal

Make the portfolio feel continuous and responsive without delaying reading or navigation.

## Principles

Motion is feedback, not decoration.

Public motion may communicate:
- route arrival,
- major hierarchy entering the viewport,
- current navigation state,
- hover, press, and selection state,
- dialog, sheet, search, and assistant continuity.

Admin motion stays functional:
- panel open/close,
- save/publish feedback,
- reordering,
- focused state changes.

## Macro interaction

- Route changes replace the previous page immediately; there is no exit-animation wait.
- New page content may use a short arrival transition.
- Major public sections may reveal once when they enter the viewport.
- Detail-page reading flow is not interrupted by staggered animation.
- No scroll-jacking, parallax, animated backgrounds, or long entrance sequences.

## Micro interaction

- Desktop navigation uses a shared active indicator that moves between sections.
- Editorial list rows use restrained hover-state feedback.
- Buttons use explicit color, border, shadow, and transform transitions instead of transition-all.
- Search selection and assistant surfaces use short, consistent motion.
- Existing dialogs and sheets retain task-oriented transitions.

## Timing

Guidance:
- press/hover/state feedback: roughly 120–180 ms,
- route arrival: roughly 200–240 ms,
- section reveal: roughly 320–420 ms.

Easing should settle quickly and avoid overshoot unless the interaction is explicitly spring-based, such as the active navigation indicator.

## Reduced motion

Every JavaScript-driven public motion path must honor the user's reduced-motion preference.

When reduced motion is requested:
- content is immediately visible,
- route changes have no transform animation,
- active states remain visually clear without relying on movement,
- CSS animation/transition duration is reduced by the global accessibility rule.

## Performance and accessibility

- Motion cannot be required to discover content or actions.
- Motion cannot introduce layout shift.
- Avoid transition-all on shared primitives.
- Do not animate expensive layout properties when opacity/transform or color is sufficient.
- Keyboard and focus behavior remain independent from animation.

## Gate

- Route transitions do not use wait-mode exit sequencing.
- Major public pages use the shared reveal primitive consistently.
- Navigation and assistant motion honor reduced-motion.
- Shared buttons avoid transition-all.
- Existing global prefers-reduced-motion CSS remains active.
- Lint, typecheck, tests, and production build pass.
