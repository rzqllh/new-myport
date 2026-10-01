const rawBase = process.env.SMOKE_BASE_URL;

if (!rawBase) {
  console.error("SMOKE_BASE_URL is required, e.g. https://example.com");
  process.exit(2);
}

const base = rawBase.replace(/\/$/, "");
const failures = [];

async function request(path) {
  return fetch(base + path, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
}

function fail(message) {
  failures.push(message);
  console.error("FAIL:", message);
}

function pass(message) {
  console.log("PASS:", message);
}

for (const path of [
  "/", "/work", "/insights", "/about", "/contact", "/resume",
  "/id", "/id/work", "/id/insights", "/id/about", "/id/contact", "/id/resume",
  "/robots.txt", "/sitemap.xml",
]) {
  try {
    const response = await request(path);
    if (response.status >= 200 && response.status < 400) pass(`${path} -> ${response.status}`);
    else fail(`${path} returned ${response.status}`);
  } catch (error) {
    fail(`${path} request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const [legacy, canonical] of [
  ["/projects", "/work"],
  ["/blog", "/insights"],
  ["/id/projects", "/id/work"],
  ["/id/blog", "/id/insights"],
]) {
  try {
    const response = await request(legacy);
    const location = response.headers.get("location") ?? "";
    if (
      [301, 302, 307, 308].includes(response.status) &&
      (location === canonical || location === base + canonical)
    ) pass(`${legacy} redirects to ${canonical}`);
    else fail(`${legacy} expected redirect to ${canonical}; got ${response.status} ${location}`);
  } catch (error) {
    fail(`${legacy} redirect check failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const response = await request("/");
  for (const header of [
    "content-security-policy",
    "referrer-policy",
    "x-content-type-options",
    "x-frame-options",
  ]) {
    if (response.headers.get(header)) pass(`security header ${header}`);
    else fail(`missing security header ${header}`);
  }
} catch (error) {
  fail(`security header check failed: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const response = await request("/id");
  const html = await response.text();
  if (html.includes('lang="id"')) pass("Indonesian document language");
  else fail("Indonesian document does not declare lang=id");
} catch (error) {
  fail(`locale document check failed: ${error instanceof Error ? error.message : String(error)}`);
}

if (failures.length) {
  console.error(`\n${failures.length} production smoke check(s) failed.`);
  process.exit(1);
}

console.log("\nProduction smoke checks passed.");
