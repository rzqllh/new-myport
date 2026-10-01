import { expect, test } from "@playwright/test";

const canonicalRoutes = [
  "/",
  "/work",
  "/insights",
  "/about",
  "/contact",
  "/resume",
  "/id",
  "/id/work",
  "/id/insights",
  "/id/about",
  "/id/contact",
  "/id/resume",
];

test.describe("release-critical public flows", () => {
  for (const route of canonicalRoutes) {
    test(`${route} renders a usable document`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("body")).not.toContainText("Application error");
    });
  }

  test("legacy collection routes resolve to canonical routes", async ({ page }) => {
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/work\/?$/);

    await page.goto("/blog");
    await expect(page).toHaveURL(/\/insights\/?$/);

    await page.goto("/id/projects");
    await expect(page).toHaveURL(/\/id\/work\/?$/);

    await page.goto("/id/blog");
    await expect(page).toHaveURL(/\/id\/insights\/?$/);
  });

  test("document language and locale switch preserve the route", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.getByRole("link", { name: "Bahasa Indonesia" }).first().click();
    await expect(page).toHaveURL(/\/id\/about\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");

    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/about\/?$/);
  });

  test("keyboard search opens and can navigate to a core destination", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+K");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const searchbox = dialog.getByRole("textbox");
    await expect(searchbox).toBeFocused();
    await searchbox.fill("about");

    const result = dialog.getByRole("option").first();
    await expect(result).toBeVisible();
    await result.press("Enter");
    await expect(page).toHaveURL(/\/about\/?$/);
  });

  test("unauthenticated admin access redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login\/?$/);
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("contact required fields expose native validity state", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();

    expect(await page.locator("#name").evaluate((node) => !node.checkValidity())).toBe(true);
    expect(await page.locator("#email").evaluate((node) => !node.checkValidity())).toBe(true);
    expect(await page.locator("#message").evaluate((node) => !node.checkValidity())).toBe(true);
  });

  test("assistant is deferred but keyboard-accessible", async ({ page }) => {
    await page.goto("/");
    const launcher = page.getByRole("button", { name: "Open portfolio assistant" });
    await expect(launcher).toBeVisible({ timeout: 5_000 });
    await launcher.click();

    const dialog = page.getByRole("dialog", { name: "Portfolio assistant" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("reduced motion still exposes page content immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/work");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("@mobile mobile navigation exposes canonical destinations", async ({ page }) => {
    await page.goto("/");
    const navigationButton = page.getByRole("button", { name: "Navigation" });
    await expect(navigationButton).toBeVisible();
    await navigationButton.click();

    await expect(page.getByRole("link", { name: "Work" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "About" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Insights" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" }).last()).toBeVisible();
  });
});
