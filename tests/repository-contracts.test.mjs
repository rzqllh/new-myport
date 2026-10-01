import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
