import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("pnpm is the only committed package-manager lockfile", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.match(pkg.packageManager, /^pnpm@/);
  assert.equal(existsSync(new URL("../pnpm-lock.yaml", import.meta.url)), true);
  assert.equal(existsSync(new URL("../package-lock.json", import.meta.url)), false);
});

test(".env.example has no duplicate variable names", () => {
  const names = read(".env.example")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => line.split("=")[0]);

  assert.equal(new Set(names).size, names.length);
});

test("development-only project API is not shipped", () => {
  assert.equal(
    existsSync(new URL("../src/app/api/test-projects/route.ts", import.meta.url)),
    false
  );
});

test("auth proxy does not disable eslint globally", () => {
  assert.doesNotMatch(read("src/proxy.ts"), /\/\*\s*eslint-disable\s*\*\//);
});

test("security headers are configured", () => {
  const config = read("next.config.ts");

  for (const header of [
    "Content-Security-Policy",
    "Referrer-Policy",
    "X-Content-Type-Options",
    "Permissions-Policy",
  ]) {
    assert.match(config, new RegExp(header));
  }
});

test("Work and Insight editors use the editorial workspace and permalink contract", () => {
  const workEditor = read("src/components/admin/project-form.tsx");
  const insightEditor = read("src/app/admin/(dashboard)/blog/blog-form.tsx");

  for (const source of [workEditor, insightEditor]) {
    assert.match(source, /EditorialWorkspace/);
    assert.match(source, /LocaleSwitch/);
    assert.match(source, /Change permalink/);
    assert.match(source, /content_redirects/);
    assert.match(source, /beforeunload/);
  }
});

test("site content is separate from operational settings", () => {
  const settings = read("src/app/admin/(dashboard)/settings/settings-form.tsx");
  const siteContent = read(
    "src/app/admin/(dashboard)/site-content/site-content-form.tsx"
  );

  assert.doesNotMatch(settings, /client_satisfaction|on_time_delivery|teams_collaborated/);
  assert.match(settings, /Profile & availability/);
  assert.match(siteContent, /site_content/);
  assert.match(siteContent, /LocaleSwitch/);
});

test("public shell uses editorial tokens and avoids the old glass navigation treatment", () => {
  const css = read("src/app/globals.css");
  const nav = read("src/components/layout/navbar.tsx");
  const root = read("src/app/layout.tsx");
  const publicLayout = read("src/app/(public)/layout.tsx");

  assert.match(css, /#f5f2eb/i);
  assert.match(css, /#8f3430/i);
  assert.doesNotMatch(css, /\.glass\s*\{/);
  assert.doesNotMatch(nav, /Available for opportunities|Live GitHub|Navigation\s*<\/p>/);
  assert.doesNotMatch(root, /ChatWidget/);
  assert.match(publicLayout, /ChatWidget/);
});

test("public index pages use the CMS compatibility layer instead of hardcoded portfolio fallbacks", () => {
  const home = read("src/app/(public)/page.tsx");
  const work = read("src/app/(public)/projects/page.tsx");
  const insights = read("src/app/(public)/blog/page.tsx");

  for (const source of [home, work, insights]) {
    assert.doesNotMatch(source, /FALLBACK_PROJECTS|DEFAULT_POSTS|PROJECT_DETAILS_DATA/);
  }

  assert.match(home, /getPublicWork/);
  assert.match(work, /getPublicWork/);
  assert.match(insights, /getPublicInsights/);
});


test("public detail and profile pages avoid hardcoded portfolio fallbacks", () => {
  const paths = [
    "src/app/(public)/projects/[slug]/page.tsx",
    "src/app/(public)/blog/[slug]/page.tsx",
    "src/app/(public)/about/page.tsx",
  ];

  for (const path of paths) {
    const source = read(path);
    assert.doesNotMatch(
      source,
      /FALLBACK_PROJECTS|DEFAULT_POSTS|DEFAULT_EXPERIENCES|PROJECT_DETAILS_DATA|FALLBACK_ARTICLES/
    );
  }
});

test("detail pages follow the editorial hierarchy instead of the old specification template", () => {
  const workDetail = read("src/app/(public)/projects/[slug]/page.tsx");
  const insightDetail = read("src/app/(public)/blog/[slug]/page.tsx");

  assert.doesNotMatch(
    workDetail,
    /Project Specifications|01 \/|02 \/|Metrics Banner|fake browser/i
  );
  assert.match(workDetail, /EvidenceFigure/);
  assert.match(workDetail, /ui\.nextWork/);
  assert.match(insightDetail, /ui\.relatedWork/);
});

test("public factual profile data is not duplicated in root structured data", () => {
  const root = read("src/app/layout.tsx");
  const contact = read("src/app/(public)/contact/page.tsx");
  const about = read("src/app/(public)/about/page.tsx");

  assert.doesNotMatch(
    root,
    /Telkom Indonesia|Gunadarma University|worksFor|alumniOf/
  );
  assert.doesNotMatch(contact, /hrizqullah484@gmail\.com|within 24 hours/i);
  assert.doesNotMatch(about, /DEFAULT_EXPERIENCES/);
});

test("resume is a tracked printable public route", () => {
  assert.equal(
    existsSync(new URL("../src/app/(public)/resume/page.tsx", import.meta.url)),
    true
  );
  assert.match(read("src/app/(public)/resume/page.tsx"), /print-resume/);
  assert.match(read("src/app/globals.css"), /@media print/);
});

test("default site copy does not claim availability unless intentionally configured", () => {
  const copy = read("src/lib/content/site-copy.ts");
  assert.doesNotMatch(
    copy,
    /Open to relevant opportunities|Terbuka untuk peluang yang relevan/
  );
});


test("canonical public routes and locale rewrites are explicit", () => {
  const config = read("next.config.ts");

  assert.match(config, /source: "\/projects"/);
  assert.match(config, /destination: "\/work"/);
  assert.match(config, /source: "\/blog"/);
  assert.match(config, /destination: "\/insights"/);
  assert.match(config, /permanent: true/);
  assert.match(config, /source: "\/id\/work"/);
  assert.match(config, /locale=id/);
});

test("public shell is locale-aware and links to canonical route segments", () => {
  const nav = read("src/components/layout/navbar.tsx");
  const footer = read("src/components/layout/footer.tsx");
  const layout = read("src/app/(public)/layout.tsx");

  assert.match(nav, /publicPath/);
  assert.match(nav, /switchLocalePath/);
  assert.doesNotMatch(nav, /href: "\/projects"|href: "\/blog"/);
  assert.match(footer, /localeFromPathname/);
  assert.match(layout, /getSiteCopy\("id"\)/);
});

test("sitemap uses canonical bilingual CMS routes without hardcoded content fallbacks", () => {
  const sitemap = read("src/app/sitemap.ts");

  assert.match(sitemap, /getPublicWork\("id"\)/);
  assert.match(sitemap, /\/work\//);
  assert.match(sitemap, /\/insights\//);
  assert.doesNotMatch(sitemap, /FALLBACK_PROJECTS|FALLBACK_POST_SLUGS/);
});


test("bilingual public rendering never falls back to legacy English content for Indonesian routes", () => {
  const content = read("src/lib/content/public-content.ts");

  assert.match(content, /locale === "en" \? getLegacyWorkCollection\(\) : \[\]/);
  assert.match(content, /locale === "en" \? getLegacyInsights\(\) : \[\]/);
  assert.match(content, /if \(locale === "id"\) return \[\]/);
});

test("localized pages use canonical work and insights paths with alternate-language metadata", () => {
  const paths = [
    "src/app/(public)/page.tsx",
    "src/app/(public)/projects/page.tsx",
    "src/app/(public)/projects/[slug]/page.tsx",
    "src/app/(public)/blog/page.tsx",
    "src/app/(public)/blog/[slug]/page.tsx",
    "src/app/(public)/about/page.tsx",
    "src/app/(public)/contact/page.tsx",
    "src/app/(public)/resume/page.tsx",
  ];

  for (const path of paths) {
    const source = read(path);
    assert.match(source, /publicPath|alternateLanguages/);
    assert.doesNotMatch(source, /canonical:\s*`?\/projects|canonical:\s*`?\/blog/);
  }
});

test("detail routes support redirect history and explicit unavailable-translation states", () => {
  const content = read("src/lib/content/public-content.ts");
  const workDetail = read("src/app/(public)/projects/[slug]/page.tsx");
  const insightDetail = read("src/app/(public)/blog/[slug]/page.tsx");

  assert.match(content, /getContentRedirect/);
  assert.match(workDetail, /permanentRedirect/);
  assert.match(insightDetail, /permanentRedirect/);
  assert.match(workDetail, /translationUnavailable/);
  assert.match(insightDetail, /translationUnavailable/);
});

test("document language follows the public locale forwarded by proxy", () => {
  const proxy = read("src/proxy.ts");
  const layout = read("src/app/layout.tsx");

  assert.match(proxy, /x-portfolio-locale/);
  assert.match(layout, /x-portfolio-locale/);
  assert.match(layout, /lang=\{documentLocale\}/);
});

test("admin previews and shared navigation constants use canonical public routes", () => {
  const paths = [
    "src/components/admin/project-form.tsx",
    "src/app/admin/(dashboard)/projects/page.tsx",
    "src/app/admin/(dashboard)/blog/page.tsx",
    "src/app/admin/(dashboard)/blog/blog-form.tsx",
    "src/lib/constants.ts",
  ];

  for (const path of paths) {
    const source = read(path);
    assert.doesNotMatch(source, /href=\{?`?\/projects\//);
    assert.doesNotMatch(source, /href=\{?`?\/blog\//);
  }
});

test("contact form carries locale into localized server-side validation", () => {
  const form = read("src/components/contact-form.tsx");
  const action = read("src/app/(public)/contact/actions.ts");

  assert.match(form, /name="locale"/);
  assert.match(action, /const messages =/);
  assert.match(action, /String\(formData\.get\("locale"\)/);
});


test("public CMS reads use a shared cacheable anonymous data path", () => {
  const publicContent = read("src/lib/content/public-content.ts");
  const siteContent = read("src/lib/content/site-content-server.ts");
  const publicClient = read("src/lib/supabase/public.ts");

  assert.match(publicContent, /unstable_cache/);
  assert.match(publicContent, /createPublicClient/);
  assert.doesNotMatch(publicContent, /supabase\/server/);
  assert.match(siteContent, /PUBLIC_CONTENT_CACHE_TAG/);
  assert.match(publicClient, /persistSession: false/);
});

test("public settings are consolidated instead of re-queried by root and public layouts", () => {
  const root = read("src/app/layout.tsx");
  const publicLayout = read("src/app/(public)/layout.tsx");

  assert.match(root, /getPublicSettings/);
  assert.match(publicLayout, /getPublicSettings/);
  assert.doesNotMatch(root, /from\("site_settings"\)/);
  assert.doesNotMatch(publicLayout, /from\("site_settings"\)/);
});

test("admin content mutations invalidate the tagged public cache through an authenticated route", () => {
  const route = read("src/app/api/admin/revalidate/route.ts");
  const forms = [
    "src/components/admin/project-form.tsx",
    "src/app/admin/(dashboard)/blog/blog-form.tsx",
    "src/app/admin/(dashboard)/site-content/site-content-form.tsx",
    "src/app/admin/(dashboard)/settings/settings-form.tsx",
    "src/app/admin/(dashboard)/about/about-form.tsx",
  ];

  assert.match(route, /auth\.getUser/);
  assert.match(route, /is_portfolio_admin/);
  assert.match(route, /revalidateTag\(PUBLIC_CONTENT_CACHE_TAG, "max"\)/);

  for (const path of forms) {
    assert.match(read(path), /revalidatePublicContent/);
  }
});


test("AI grounding contains no hardcoded portfolio fallback facts", () => {
  const grounding = read("src/lib/gemini-grounding.ts");

  assert.doesNotMatch(
    grounding,
    /FALLBACK_PROJECTS|DEFAULT_GROUNDING_EXPERIENCE|proficiency/
  );
  assert.match(grounding, /getPublicWork/);
  assert.match(grounding, /PUBLIC_CONTENT_CACHE_TAG/);
  assert.match(grounding, /path: "\/work\/" \+ item\.slug/);
  assert.match(grounding, /grounding-ranker/);
});

test("optional GitHub activity is cacheable and not a core dynamic dependency", () => {
  const route = read("src/app/api/github-status/route.ts");

  assert.match(route, /force-static/);
  assert.doesNotMatch(route, /force-dynamic/);
  assert.match(route, /revalidate = 300/);
  assert.doesNotMatch(route, /public_repos/);
});

test("public media uses responsive provider-safe transformations", () => {
  const helper = read("src/lib/content/public-image.ts");
  const work = read("src/app/(public)/projects/[slug]/page.tsx");
  const about = read("src/app/(public)/about/page.tsx");

  assert.match(helper, /f_auto,q_auto,c_limit/);
  assert.match(work, /responsiveImageProps/);
  assert.match(work, /srcSet/);
  assert.match(about, /responsiveImageProps/);
});

test("portfolio assistant is deferred from the initial public render", () => {
  const layout = read("src/app/(public)/layout.tsx");
  const deferred = read("src/components/deferred-chat-widget.tsx");

  assert.match(layout, /DeferredChatWidget/);
  assert.match(deferred, /dynamic\(/);
  assert.match(deferred, /requestIdleCallback|setTimeout/);
});

test("performance documentation distinguishes targets from measured claims", () => {
  const performance = read("docs/PERFORMANCE.md");

  assert.match(performance, /targets, not measured claims/i);
  assert.match(performance, /LCP <= 2\.5 s/);
  assert.match(performance, /CI build success is not a substitute/);
});


test("Capabilities admin uses qualitative v2 levels and no arbitrary percentage UI", () => {
  const page = read("src/app/admin/(dashboard)/skills/page.tsx");
  const client = read("src/app/admin/(dashboard)/skills/skills-client.tsx");

  assert.match(page, /capabilities/);
  assert.match(client, /primary/);
  assert.match(client, /working/);
  assert.match(client, /familiar/);
  assert.doesNotMatch(client, /proficiency|%\)/i);
});

test("Experience admin authors localized copy while preserving shared factual fields", () => {
  const page = read("src/app/admin/(dashboard)/experience/page.tsx");
  const client = read(
    "src/app/admin/(dashboard)/experience/experience-client.tsx"
  );

  assert.match(page, /experience_translations/);
  assert.match(client, /locale: "en"/);
  assert.match(client, /locale: "id"/);
  assert.match(client, /company/);
  assert.match(client, /start_date/);
});

test("About narrative belongs to bilingual Site Content instead of the legacy profile form", () => {
  const siteCopy = read("src/lib/content/site-copy.ts");
  const profileForm = read("src/app/admin/(dashboard)/about/about-form.tsx");
  const publicContent = read("src/lib/content/public-content.ts");
  const migration = read("supabase/migrations/006_content_model_v2.sql");

  assert.match(siteCopy, /"about\.profile"/);
  assert.match(publicContent, /\.eq\("namespace", "about\.profile"\)/);
  assert.match(migration, /'about\.profile'/);
  assert.doesNotMatch(profileForm, /philosophy|hobbies|\bbio\b/);
  assert.match(profileForm, /Site Content/);
});


test("portfolio assistant sources are selected by server-side grounding, not invented by the model", () => {
  const grounding = read("src/lib/gemini-grounding.ts");
  const route = read("src/app/api/chat/route.ts");
  const widget = read("src/components/chat-widget.tsx");

  assert.match(grounding, /selectGroundingSources/);
  assert.match(grounding, /formatGroundingSources/);
  assert.match(route, /sources: selectedSources\.map/);
  assert.match(route, /Do not invent source paths or citation labels/);
  assert.match(widget, /message\.sources/);
  assert.match(widget, /publicPath\(locale, source\.path\)/);
});

test("portfolio assistant session retry preserves the submitted question", () => {
  const widget = read("src/components/chat-widget.tsx");

  assert.match(widget, /const text = input\.trim\(\)/);
  assert.match(widget, /const history = messages/);
  assert.match(widget, /for \(let attempt = 0; attempt < 2; attempt \+= 1\)/);
  assert.match(widget, /messages: \[\.\.\.history, userMessage\]/);
  assert.doesNotMatch(widget, /setTimeout\(\(\) => sendMessage\(1\)/);
});

test("assistant UI copy is localized through the shared public UI dictionary", () => {
  const routes = read("src/lib/content/public-routes.ts");
  const widget = read("src/components/chat-widget.tsx");

  assert.match(routes, /assistantOpen/);
  assert.match(routes, /assistantSources/);
  assert.match(widget, /PUBLIC_UI\[locale\]/);
});


test("global public search is built only from published CMS-backed public readers", () => {
  const layout = read("src/app/(public)/layout.tsx");
  const search = read("src/components/public-search.tsx");

  assert.match(layout, /getPublicWork\("en"\)/);
  assert.match(layout, /getPublicWork\("id"\)/);
  assert.match(layout, /getPublicInsights\("en"\)/);
  assert.match(layout, /getPublicInsights\("id"\)/);
  assert.doesNotMatch(layout, /from\("projects"\)|from\("blog_posts"\)/);
  assert.match(search, /rankItems/);
});

test("global public search supports one dialog with keyboard navigation and Cmd or Ctrl K", () => {
  const navbar = read("src/components/layout/navbar.tsx");
  const search = read("src/components/public-search.tsx");

  assert.match(navbar, /GlobalSearchDialog/);
  assert.match(navbar, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(navbar, /event\.key\.toLowerCase\(\) === "k"/);
  assert.match(search, /ArrowDown/);
  assert.match(search, /ArrowUp/);
  assert.match(search, /event\.key === "Enter"/);
  assert.match(search, /role="listbox"/);
});

test("global public search uses canonical locale routes and localized UI copy", () => {
  const layout = read("src/app/(public)/layout.tsx");
  const search = read("src/components/public-search.tsx");
  const routes = read("src/lib/content/public-routes.ts");

  assert.match(layout, /publicPath\(locale, "\/work\/" \+ item\.slug\)/);
  assert.match(layout, /publicPath\(locale, "\/insights\/" \+ item\.slug\)/);
  assert.match(search, /PUBLIC_UI\[locale\]/);
  assert.match(routes, /searchPlaceholder/);
  assert.match(routes, /searchKeyboardHelp/);
});


test("admin content health uses deterministic CMS checks without fabricated scoring", () => {
  const health = read("src/lib/content/admin-content-health.ts");
  const dashboard = read("src/app/admin/(dashboard)/page.tsx");

  assert.match(health, /getAdminContentHealth/);
  assert.match(health, /work_translations/);
  assert.match(health, /insight_translations/);
  assert.match(health, /work_evidence/);
  assert.match(health, /media_translations/);
  assert.match(health, /capability_translations/);
  assert.match(health, /isV2SchemaUnavailable/);
  assert.match(dashboard, /Content health/);
  assert.match(dashboard, /Deterministic checks/);
  assert.doesNotMatch(health, /healthScore|qualityScore|generateContent|fetch\(/);
  assert.doesNotMatch(dashboard, /\b\d+\s*\/\s*100\b|health score/i);
});

test("admin content health flags locale, SEO, accessibility, and sourced-claim gaps", () => {
  const health = read("src/lib/content/admin-content-health.ts");

  assert.match(health, /has no published Indonesian translation/);
  assert.match(health, /missing an English SEO description/);
  assert.match(health, /missing an Indonesian SEO description/);
  assert.match(health, /missing English alt text/);
  assert.match(health, /missing Indonesian alt text/);
  assert.match(health, /missing Indonesian copy/);
  assert.match(health, /quantified claim without published evidence/);
});

test("admin content health degrades safely when schema v2 is unavailable", () => {
  const health = read("src/lib/content/admin-content-health.ts");
  const dashboard = read("src/app/admin/(dashboard)/page.tsx");

  assert.match(health, /schemaV2Available: false/);
  assert.match(
    health,
    /Content health checks are limited until schema v2 is active/
  );
  assert.match(dashboard, /!contentHealth\.schemaV2Available/);
  assert.match(dashboard, /legacy Work item/);
});


test("assistant retrieval harness runs in CI against the production ranker", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.match(pkg.scripts.test, /assistant-grounding\.test\.mts|tests\/\*\.test\.mts/);
  assert.equal(
    existsSync(new URL("../tests/assistant-grounding.test.mts", import.meta.url)),
    true
  );
  assert.equal(
    existsSync(new URL("../src/lib/grounding-ranker.ts", import.meta.url)),
    true
  );
});


test("public route motion does not delay navigation and honors reduced motion", () => {
  const transition = read("src/components/layout/page-transition.tsx");
  const reveal = read("src/components/motion/editorial-reveal.tsx");
  const css = read("src/app/globals.css");

  assert.match(transition, /useReducedMotion/);
  assert.doesNotMatch(transition, /mode="wait"|AnimatePresence|exit=/);
  assert.match(reveal, /whileInView/);
  assert.match(reveal, /once: true/);
  assert.match(reveal, /useReducedMotion/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("public navigation uses a reduced-motion-safe shared active indicator", () => {
  const navbar = read("src/components/layout/navbar.tsx");

  assert.match(navbar, /layoutId="public-nav-active"/);
  assert.match(navbar, /useReducedMotion/);
  assert.match(navbar, /aria-current/);
});

test("major public page hierarchy uses the shared editorial reveal primitive", () => {
  for (const path of [
    "src/app/(public)/page.tsx",
    "src/app/(public)/projects/page.tsx",
    "src/app/(public)/blog/page.tsx",
    "src/app/(public)/about/page.tsx",
    "src/app/(public)/contact/page.tsx",
  ]) {
    assert.match(read(path), /EditorialReveal/);
  }
});

test("shared microinteraction motion avoids transition-all and assistant respects reduced motion", () => {
  const button = read("src/components/ui/button.tsx");
  const assistant = read("src/components/chat-widget.tsx");

  assert.doesNotMatch(button, /transition-all/);
  assert.match(button, /transition-\[color,background-color,border-color,box-shadow,transform\]/);
  assert.match(assistant, /useReducedMotion/);
});

test("phase 10 motion contract is tracked", () => {
  assert.equal(
    existsSync(new URL("../docs/PHASE_10_MOTION_PRD.md", import.meta.url)),
    true
  );
});


function walkFiles(path) {
  const root = new URL(`../${path}/`, import.meta.url);
  const files = [];

  function visit(url, relative) {
    for (const entry of readdirSync(url)) {
      const child = new URL(entry, url);
      const childRelative = relative ? `${relative}/${entry}` : entry;
      if (statSync(child).isDirectory()) {
        visit(new URL(`${entry}/`, url), childRelative);
      } else {
        files.push({ url: child, path: childRelative });
      }
    }
  }

  visit(root, "");
  return files;
}

test("source tree has no broad eslint-disable file suppression", () => {
  const offenders = walkFiles("src")
    .filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file.path))
    .filter((file) => /\/\*\s*eslint-disable\s*\*\//.test(readFileSync(file.url, "utf8")))
    .map((file) => file.path);

  assert.deepEqual(offenders, []);
});

test("runtime dependencies use one animation stack", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.equal(pkg.dependencies.gsap, undefined);
  assert.ok(pkg.dependencies.motion);
});

test("operational profile facts do not get invented code fallbacks", () => {
  const settings = read("src/app/admin/(dashboard)/settings/settings-form.tsx");

  assert.doesNotMatch(settings, /location:\s*initialSettings\.profile\?\.location\s*\?\?\s*"Indonesia"/);
});

test("GitHub Actions are pinned to immutable reviewed SHAs", () => {
  const ci = read(".github/workflows/ci.yml");

  assert.match(ci, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(ci, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
  assert.match(ci, /pnpm\/action-setup@ea17c68df8912ef543352723c149a84f56e3d413/);
  assert.doesNotMatch(ci, /uses:\s+[^\s]+@v\d+/);
});


test("public chat writes enforce origin, bounded model output, and timeout", () => {
  const route = read("src/app/api/chat/route.ts");

  assert.match(route, /isAllowedWriteOrigin/);
  assert.match(route, /ORIGIN_NOT_ALLOWED/);
  assert.match(route, /CHAT_MAX_OUTPUT_TOKENS = 512/);
  assert.match(route, /CHAT_TIMEOUT_MS = 12_000/);
  assert.match(route, /AI_TIMEOUT/);
  assert.match(route, /x-request-id/);
});

test("operational logging schema excludes user content and identity fields", () => {
  const observability = read("src/lib/observability.ts");
  const chat = read("src/app/api/chat/route.ts");
  const contact = read("src/app/(public)/contact/actions.ts");

  assert.doesNotMatch(observability, /messageText|email|name|token|rawIp/);
  assert.doesNotMatch(chat, /(reason|message|text):\s*latestQuestion/);
  assert.doesNotMatch(contact, /(reason|message|text|data):\s*parsed\.data/);
});

test("Turnstile verification and public rate-limit dependencies fail closed with bounded upstream work", () => {
  const auth = read("src/lib/chat-auth.ts");
  const contact = read("src/app/(public)/contact/actions.ts");

  assert.match(auth, /AbortSignal\.timeout\(10_000\)/);
  assert.match(contact, /contact\.rate_limit_unavailable/);
  assert.match(contact, /process\.env\.NODE_ENV === "production"/);
});


test("CMS resilience tracks editorial revisions without restoring structural metadata", () => {
  const migration = read("supabase/migrations/007_editorial_revisions.sql");
  const restore = read("src/app/api/admin/revisions/restore/route.ts");
  const revisions = read("src/components/admin/revision-history.tsx");

  assert.match(migration, /content_revisions/);
  assert.match(migration, /work_translation/);
  assert.match(migration, /insight_translation/);
  assert.match(migration, /site_content/);
  assert.doesNotMatch(migration, /resource_type IN \([^)]*work_item/);
  assert.doesNotMatch(restore, /slug|published_at|repository_url|live_url/);
  assert.match(revisions, /current version will remain in revision history/i);
});

test("authenticated CMS backup excludes contact and authentication data", () => {
  const route = read("src/app/api/admin/export/route.ts");

  assert.match(route, /getPortfolioAdminClient/);
  assert.match(route, /portfolio-content-backup\.json/);
  assert.match(route, /content_revisions/);
  assert.doesNotMatch(route, /contacts|messages|portfolio_admins|auth\.users/);
  assert.match(route, /Cache-Control.*no-store/s);
});

test("draft preview tokens are short-lived, scoped, and production-secret backed", () => {
  const auth = read("src/lib/preview-auth.ts");
  const route = read("src/app/api/admin/preview-token/route.ts");

  assert.match(auth, /PREVIEW_TOKEN_SECRET/);
  assert.match(auth, /setExpirationTime\("15m"\)/);
  assert.match(auth, /portfolio-preview/);
  assert.match(route, /getPortfolioAdminClient/);
  assert.match(route, /resourceType/);
  assert.match(route, /resourceId/);
});

test("content health detects source-less evidence and redirect integrity failures", () => {
  const health = read("src/lib/content/admin-content-health.ts");

  assert.match(health, /Published evidence is missing a source or media artifact/);
  assert.match(health, /Redirect history contains a self-redirect/);
  assert.match(health, /Redirect history contains a cycle/);
});


test("security workflows are least-privilege, immutable-pinned, and silent in PR comments", () => {
  const codeql = read(".github/workflows/codeql.yml");
  const review = read(".github/workflows/dependency-review.yml");

  assert.match(codeql, /github\/codeql-action\/init@2892aa5e19bbd11bc0cff5427e3b750a04d9e3c2/);
  assert.match(codeql, /github\/codeql-action\/analyze@2892aa5e19bbd11bc0cff5427e3b750a04d9e3c2/);
  assert.match(codeql, /security-events:\s*write/);
  assert.match(review, /actions\/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294/);
  assert.match(review, /fail-on-severity:\s*high/);
  assert.match(review, /comment-summary-in-pr:\s*never/);
  assert.match(review, /continue-on-error:\s*true/);
  assert.match(review, /pnpm audit --audit-level high/);
  assert.doesNotMatch(review, /pull-requests:\s*write/);
});

test("Dependabot is review-only and groups routine updates without auto-merge", () => {
  const config = read(".github/dependabot.yml");

  assert.match(config, /package-ecosystem:\s*npm/);
  assert.match(config, /interval:\s*weekly/);
  assert.match(config, /production-dependencies/);
  assert.match(config, /development-dependencies/);
  assert.doesNotMatch(config, /auto-merge|automerge/i);
});

test("release governance tracks required gates and the external branch-protection target", () => {
  const governance = read("docs/RELEASE_GOVERNANCE.md");

  assert.match(governance, /CI `quality` green/);
  assert.match(governance, /CI `e2e` green/);
  assert.match(governance, /CodeQL green/);
  assert.match(governance, /Dependency security gate green/);
  assert.match(governance, /block force-push/);
  assert.match(governance, /cannot mutate branch-protection administration/);
  assert.match(governance, /No bot\/Codex\/GPT review comments/);
});


test("public and admin route groups have actionable error boundaries", () => {
  const publicError = read("src/app/(public)/error.tsx");
  const adminError = read("src/app/admin/error.tsx");

  assert.match(publicError, /reset/);
  assert.match(publicError, /Kembali ke beranda/);
  assert.match(adminError, /reset/);
  assert.match(adminError, /Unsaved browser state is not treated as successfully persisted/);
});

test("CI audits public client boundaries before production build", () => {
  const pkg = JSON.parse(read("package.json"));
  const ci = read(".github/workflows/ci.yml");
  const audit = read("scripts/client-boundary-audit.mjs");

  assert.equal(pkg.scripts["audit:client"], "node scripts/client-boundary-audit.mjs");
  assert.match(ci, /Client boundary audit/);
  assert.match(ci, /pnpm audit:client/);
  assert.match(audit, /@tiptap\//);
  assert.match(audit, /react-image-crop/);
  assert.match(audit, /@\/lib\/supabase\/client/);
  assert.match(audit, /turns a route page\/layout into a client component/);
});

test("resume print layout is part of browser release QA", () => {
  const e2e = read("tests/e2e/public.spec.ts");

  assert.match(e2e, /emulateMedia\(\{ media: "print" \}\)/);
  assert.match(e2e, /\.print-resume/);
  assert.match(e2e, /data-print-hidden/);
  assert.match(e2e, /scrollWidth/);
});

test("authenticated content audit exports deterministic health findings", () => {
  const route = read("src/app/api/admin/content-audit/route.ts");
  const health = read("src/lib/content/admin-content-health.ts");

  assert.match(route, /getPortfolioAdminClient/);
  assert.match(route, /getAdminContentHealth/);
  assert.match(route, /portfolio-content-health\.json/);
  assert.match(route, /Cache-Control.*no-store/s);
  assert.match(health, /invalid source URL/);
  assert.match(health, /invalid asset URL/);
  assert.doesNotMatch(health, /fetch\(/);
});

test("performance documentation distinguishes targets, lab results, and field evidence", () => {
  const performance = read("docs/PERFORMANCE.md");

  assert.match(performance, /These are targets, not measured claims/);
  assert.match(performance, /separate lab data from field data/);
  assert.match(performance, /record that field data is unavailable/);
  assert.match(performance, /No analytics or monitoring vendor is added/);
});
