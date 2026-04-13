import { test, expect } from '@playwright/test';

test.describe('System View E2E', () => {
  test('app loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await page.waitForTimeout(2000);

    expect(errors.length).toBe(0);
  });

  test('sidebar renders with navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const sidebar = page.locator('nav, .sidebar, aside').first();
    await expect(sidebar).toBeVisible();
  });

  test('System view loads and renders cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Click System menu item if exists
    const systemLink = page.locator('text=Rendszer, text=System, [data-view="system"]').first();
    if (await systemLink.isVisible()) {
      await systemLink.click();
      await page.waitForTimeout(1500);
    }

    // Check for any rendered content in main area
    const mainArea = page.locator('main, .main-content, .content').first();
    const isVisible = await mainArea.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('no network failures on main routes', async ({ page }) => {
    const networkErrors: string[] = [];
    page.on('requestfailed', req => {
      networkErrors.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    expect(networkErrors.length).toBe(0);
  });
});