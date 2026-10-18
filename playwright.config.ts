import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"]] : [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: { timeout: 7_500 },
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure", video: "off", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@mobile/,
    },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // Exercise the built artifact in CI; avoid Turbopack/font-loader dev flakiness.
        command: process.env.CI
          ? "pnpm build && pnpm start --hostname 127.0.0.1"
          : "pnpm dev --hostname 127.0.0.1",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: process.env.CI ? 240_000 : 120_000,
        env: {
          NEXT_PUBLIC_SUPABASE_URL:
            process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "ci-placeholder-anon-key",
          NEXT_PUBLIC_SITE_URL: baseURL,
          CHAT_SESSION_SECRET:
            process.env.CHAT_SESSION_SECRET ??
            "local-e2e-chat-session-secret-at-least-32-characters",
        },
      },
});
