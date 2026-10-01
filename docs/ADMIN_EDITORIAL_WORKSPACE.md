# Admin Editorial Workspace

## 1. Objective

/admin is not a CRUD dashboard. It is the operating workspace for maintaining the portfolio.

Primary design goals:
- clear hierarchy,
- low cognitive load,
- fast content updates,
- safe publishing,
- visible locale completeness,
- preview before publish,
- fewer page transitions for common editorial tasks.

## 2. Admin information architecture

### Overview
Attention-first dashboard.

### Content
- Work
- Insights
- Experience
- Capabilities/Skills
- Testimonials

### Communication
- Messages

### Library
- Media

### Site
- Site Content
- Navigation
- SEO
- Settings

Exact labels may be refined, but grouping is required. A flat nine-item sidebar is not the target.

## 3. Dashboard hierarchy

Order:
1. Needs attention
2. Recent drafts / recently edited
3. Incoming messages
4. Site/content health
5. Secondary counts

Needs-attention examples:
- missing Indonesian translation,
- unpublished draft,
- broken external link,
- missing alt text,
- missing SEO description,
- message unread,
- evidence-required metric with no source.

Do not make four equal statistic cards the main dashboard.

## 4. Content list pages

Work and Insights lists use editorial rows or a hybrid list.

Each row may contain:
- thumbnail/cover,
- title,
- short summary or type,
- slug,
- publication state,
- EN/ID readiness,
- last modified,
- featured state,
- quick actions.

Toolbar:
- search,
- status filter,
- locale readiness filter,
- discipline/type filter for Work,
- sort,
- create action.

Destructive actions do not sit at the same visual priority as Edit/Open.

## 5. Editor architecture

### Desktop
Three functional areas:

Left — Outline
- sections,
- completeness,
- validation markers,
- quick jump.

Center — Canvas
- title and main editorial content,
- section-specific editors,
- media/evidence blocks,
- natural document flow.

Right — Inspector
- publication,
- locale,
- permalink,
- classification,
- relations,
- SEO,
- visibility,
- preview/publish actions.

### Tablet
- outline collapsible,
- canvas primary,
- inspector as drawer or collapsible panel.

### Mobile
- canvas first,
- outline sheet,
- inspector bottom sheet,
- sticky compact save/publish bar when needed.

## 6. Work editor outline

Suggested sections:
- Overview
- Context
- Role
- Challenge
- Approach
- Decisions
- Outcome
- Evidence
- Gallery
- SEO

Sections can be omitted if irrelevant.

The editor must not expose database field order as the information architecture.

## 7. Insight editor outline

- Overview
- Body
- Cover/Media
- Tags
- Related Work
- SEO

Long article body uses a focused editorial writing area.

## 8. Bilingual workflow

Locale control is visible near editor context:
EN | ID

Show state:
- Published
- Draft
- Missing
- Needs review if later added

Shared metadata remains outside locale-specific canvas where practical.

Do not display both full language forms at once on desktop unless comparison mode is intentionally introduced.

## 9. Permalink workflow

In inspector:
- full URL preview,
- slug status,
- edit action,
- published lock state,
- redirect consequence.

Slug is not a plain peer field next to Title.

## 10. Publication controls

Required:
- Save draft
- Preview
- Publish / Update
- Unpublish where supported

Show:
- saving,
- saved,
- error,
- last saved time where reliable.

Unsaved navigation must warn the editor.

## 11. Site Content

Dedicated editor for:
- Home
- About
- Work index
- Insights index
- Contact
- Navigation
- Footer
- SEO defaults

Each page exposes section structure and EN/ID content.

Do not store every microcopy string as an arbitrary database row.

## 12. Media Library

Functions:
- upload,
- search/filter,
- alt text,
- dimensions/metadata,
- usage context where practical,
- replace,
- safe delete behavior.

Do not allow deletion of a used asset without clear consequence handling.

## 13. Error and validation

Validation is close to the relevant field/section.
Inspector shows summary of blocking publication issues.
Technical database errors are logged but not dumped raw into the public admin UI.

## 14. Visual design

Admin shares the public design tokens but uses:
- denser spacing,
- quieter display typography,
- more visible state,
- persistent controls,
- fewer decorative containers.

Do not turn admin into a visually theatrical portfolio page.
