# Locked Decisions

These decisions are approved for the redesign foundation. An implementation task must not silently change them.

## Product and information architecture

1. Public portfolio terminology uses **Work** instead of Projects.
2. Public editorial terminology uses **Insights** instead of Blog.
3. Canonical English routes:
   - /work
   - /work/[slug]
   - /insights
   - /insights/[slug]
4. English is the default locale without a prefix.
5. Indonesian uses the /id prefix.
6. Shared content entities use one stable slug across locales.
7. Legacy /projects and /blog routes remain reachable through permanent redirects.
8. Published slugs do not change automatically when titles change.
9. Explicit post-publication permalink changes preserve the previous URL through redirect history.

## Content ownership

10. Public editorial content must be maintainable from /admin.
11. Product/UI microcopy belongs to structured locale dictionaries rather than arbitrary database rows.
12. CMS/database is the source of truth for editable site content.
13. Hardcoded editorial fallbacks may exist only for safe degraded rendering and may not become a second editorial source of truth.
14. Social links, location display, availability, resume/CV, and similar operational site data are admin-managed.
15. Project/Work detail narrative content currently hardcoded in source must migrate to CMS-managed structured content.

## Bilingual editorial

16. English and Indonesian are authored variants of the same facts, not literal translations.
17. Indonesian copy uses natural professional/business language, with common technical English terms retained where appropriate.
18. English copy is concise, factual, and evidence-led.
19. Runtime machine translation is not the canonical content workflow.

## Claims

20. No fabricated marketing metrics.
21. No arbitrary skill/proficiency percentages.
22. Numerical claims require a reliable source or evidence.
23. Qualitative outcomes are preferred when reliable quantitative evidence does not exist.

## Design

24. Public and admin share one semantic design language.
25. Public pages are editorial and spacious; admin is denser and task-oriented.
26. Admin is redesigned as an editorial workspace rather than a CRUD dashboard.
27. The Work/Insight editor follows an outline / canvas / inspector model on desktop.
28. Pages must have explicit visual hierarchy; equal visual weight everywhere is considered a defect.
29. Card-inside-card, badge soup, decorative telemetry, generic gradients, and terminal cosplay are rejected patterns.
30. Warm editorial neutrals + one oxblood accent are the baseline palette direction. Exact token values may be tuned during visual implementation, but semantic roles remain stable.
31. Mono typography is reserved for technical metadata, slug/date/code/repository identifiers, not used as decorative “tech” styling.
32. Motion supports navigation, feedback, panels, reordering, and light content reveal; it must not delay reading or navigation.

## Work and Insights detail pages

33. Work detail is narrative and flexible; not every project uses the same section template.
34. Evidence is a first-class content type.
35. Metrics are rendered only when sourced and relevant.
36. Insights are not SEO filler; every article must come from real work, research, practice, or documented exploration.
37. The UI/UX of `/work/[slug]` and `/insights/[slug]` is a first-class design deliverable separate from routing/permalink and admin-editor UX.
38. Work detail opening uses title/summary hierarchy plus quiet metadata; a generic specifications card is not the default composition.
39. Detail-page media/evidence may break beyond the narrative reading column and must be integrated into the story rather than appended as a generic gallery.
40. Mobile detail pages have an explicit one-column reading order; desktop side rails do not survive as squeezed sidebars.
41. Every detail-page family requires desktop and mobile composition review before implementation is accepted.
42. A fixed Challenge/Solution/Architecture/Features sequence may not be imposed on every Work type.

## Engineering and delivery

43. pnpm is the canonical package manager.
44. Core public browsing must remain useful if GitHub, AI, analytics, or another optional integration fails.
45. Unnecessary force-dynamic rendering should be removed in favor of appropriate caching/ISR and on-demand revalidation.
46. Minimum merge gates are lint, typecheck, tests, and production build once Phase 1 establishes CI.
47. Large redesign work must be split into scoped PRs by phase/task.
48. A contract change requires updating the relevant documentation in the same change.
