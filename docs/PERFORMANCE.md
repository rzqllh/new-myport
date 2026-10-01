# Performance and Reliability Contract

## Purpose

Public portfolio browsing must remain fast and useful even when optional integrations are slow or unavailable.

This document defines implementation targets. It does not claim production field performance that has not been measured.

## Data path

Public CMS reads:
- use the anonymous, cookie-free Supabase client,
- are cached for 300 seconds,
- share one public-content cache tag,
- are invalidated by authenticated admin mutations,
- never require an authenticated session to render published content.

Operational/admin reads remain session-aware and do not use the public anonymous client.

## Optional integrations

Core pages must not depend on GitHub activity or the AI assistant.

Failure policy:
- GitHub failure returns an unavailable state and does not affect page rendering.
- AI failure stays inside the assistant surface and does not affect navigation or content.
- CMS content remains the authority for portfolio facts.

## AI grounding

The assistant grounding corpus is built only from published About, Experience, Capabilities, and Work data.

There is no hardcoded biography, project, metric, or skill fallback. If verified content is unavailable, the corpus states that explicitly.

## Images

Cloudinary public images use automatic format selection, automatic quality, responsive width candidates, and c_limit to avoid upscaling.

Non-Cloudinary images keep their original URL rather than receiving guessed provider-specific transforms.

## Rendering

Avoid explicit force-dynamic unless request-specific data requires it.

The root document remains request-aware because document language follows the route locale forwarded by Proxy. Public CMS data itself is cached independently.

## Production measurement targets

These are targets, not measured claims:
- LCP <= 2.5 s at p75
- INP <= 200 ms at p75
- CLS <= 0.1 at p75
- optional integrations must not block the first useful render
- no duplicate site-settings read in the same render path

Field metrics should be recorded only after a production deployment is available. CI build success is not a substitute for real-user performance data.


## Client-boundary budget

The repository uses a deterministic static audit in CI:
- public route pages/layouts remain Server Components,
- public routes cannot import admin/editor components,
- public routes cannot import the browser Supabase client,
- TipTap and image-crop dependencies stay out of public route/shell source.

This is a regression contract, not a byte-size claim. Bundle size should be measured from a production build/deployment before setting numeric JS budgets.

## Print / resume verification

Playwright verifies the resume under print media:
- application chrome marked with `data-print-hidden` is absent,
- `.print-resume` remains visible,
- the document does not introduce horizontal overflow.

## Production measurement procedure

After the final `master` commit is deployed successfully:
1. record the exact deployment commit SHA,
2. run the Production smoke workflow against the production URL,
3. measure Home, Work index, representative Work detail, Insights index, representative Insight detail, and Resume,
4. record LCP, INP, CLS, and TTFB with the measurement source and date,
5. separate lab data from field data,
6. compare p75 field data only when the source has enough real-user samples,
7. optimize the measured bottleneck rather than adding speculative caching or client code.

No analytics or monitoring vendor is added by this phase. If a field source such as CrUX or an already-enabled hosting dashboard has insufficient traffic, record that field data is unavailable rather than substituting lab results.
