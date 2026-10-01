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
