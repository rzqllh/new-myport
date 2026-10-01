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
  assert.match(workDetail, /Next work/);
  assert.match(insightDetail, /Related work/);
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
