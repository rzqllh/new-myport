import assert from "node:assert/strict";
import test from "node:test";
import { getRequestIp } from "../src/lib/request-ip.ts";
import { isAllowedWriteOrigin } from "../src/lib/request-origin.ts";
import { TimeoutError, withTimeout } from "../src/lib/timeout.ts";

test("write-origin policy accepts same-origin requests", () => {
  const request = new Request("https://portfolio.example/api/chat", {
    method: "POST",
    headers: { origin: "https://portfolio.example" },
  });

  assert.equal(isAllowedWriteOrigin(request), true);
});

test("write-origin policy rejects a foreign explicit origin", () => {
  const request = new Request("https://portfolio.example/api/chat", {
    method: "POST",
    headers: { origin: "https://attacker.example" },
  });

  assert.equal(isAllowedWriteOrigin(request), false);
});

test("request IP prefers Vercel forwarding over generic forwarding", () => {
  const headers = new Headers({
    "x-vercel-forwarded-for": "203.0.113.7, 10.0.0.1",
    "x-forwarded-for": "198.51.100.20",
    "x-real-ip": "192.0.2.9",
  });

  assert.equal(getRequestIp(headers), "203.0.113.7");
});

test("Cloudflare connecting IP is considered only with a Cloudflare ray", () => {
  const withoutRay = new Headers({
    "cf-connecting-ip": "203.0.113.10",
    "x-real-ip": "192.0.2.10",
  });
  const withRay = new Headers({
    "cf-ray": "abc123",
    "cf-connecting-ip": "203.0.113.10",
    "x-real-ip": "192.0.2.10",
  });

  assert.equal(getRequestIp(withoutRay), "192.0.2.10");
  assert.equal(getRequestIp(withRay), "203.0.113.10");
});

test("timeout helper returns fast operations and rejects stalled operations", async () => {
  assert.equal(await withTimeout(Promise.resolve("ok"), 50), "ok");

  await assert.rejects(
    withTimeout(new Promise(() => {}), 5),
    (error) => error instanceof TimeoutError
  );
});
