import { expect, test } from '@playwright/test';

for (const route of ['/', '/id']) {
  test(`${route} home title does not repeat the owner's name`, async ({ page }) => {
    await page.goto(route);
    const name = (await page.locator('h1').innerText()).trim();
    expect(await page.title()).toBe(name);
  });

  test(`${route} home has one editorial contact closure`, async ({ page }) => {
    await page.goto(route);
    const closure = page.locator('main section').last().locator('h2');
    const heading = (await closure.innerText()).trim();
    await expect(page.getByText(heading, { exact: true })).toHaveCount(1);
    await expect(page.locator('footer nav')).toBeVisible();
    await expect(page.locator(`footer a[href="${route === '/id' ? '/id' : ''}/contact"]`).first()).toBeVisible();
  });
}

for (const width of [320, 768, 1440]) {
  for (const route of ['/', '/work', '/insights', '/about', '/contact', '/resume', '/id', '/id/work', '/id/insights', '/id/about', '/id/contact', '/id/resume']) {
    test(`@mobile ${route} fits ${width}px with reduced motion and correct locale`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error' && /hydration|hydrating|did not match/i.test(message.text())) errors.push(message.text());
      });
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', route.startsWith('/id') ? 'id' : 'en');
      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
      expect(errors).toEqual([]);
    });
  }
}
