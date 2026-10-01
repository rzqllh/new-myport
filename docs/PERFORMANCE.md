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
