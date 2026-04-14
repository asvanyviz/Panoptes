import { test, expect } from '@playwright/test';

test.describe('Agents - Végrehajtók E2E', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(1000);
    // Agentek group is not auto-opened; open it
    await page.locator('button.nav-group-header', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Végrehajtók' }).click();
    await page.waitForTimeout(2000);

    const header = page.locator('h2').filter({ hasText: 'Végrehajtók' });
    await expect(header).toBeVisible();
    expect(errors.length).toBe(0);
  });
});

test.describe('Rendszer - Áttekintés', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(2000);

    const header = page.locator('h2').filter({ hasText: 'Áttekintés' });
    await expect(header).toBeVisible();
    expect(errors.length).toBe(0);
  });
});

test.describe('Infra - Cron', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('button.nav-group-header', { hasText: 'Infrastruktúra' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Cron jobs' }).click();
    await page.waitForTimeout(2000);

    const header = page.locator('h2').filter({ hasText: 'Cron jobs' });
    await expect(header).toBeVisible();
    expect(errors.length).toBe(0);
  });
});

test.describe('Navigation E2E', () => {
  test('all group headers present', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const groups = ['Rendszer', 'Infrastruktúra', 'Agentek'];
    for (const label of groups) {
      await expect(page.locator('button.nav-group-header', { hasText: label })).toBeVisible();
    }
  });

  test('expand/collapse works', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    // Agentek is closed; open it
    await page.locator('button.nav-group-header', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('button.nav-item', { hasText: 'Végrehajtók' })).toBeVisible();
    // Close it again
    await page.locator('button.nav-group-header', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(500);
    expect(await page.locator('button.nav-item', { hasText: 'Végrehajtók' }).isVisible().catch(() => false)).toBe(false);
  });

  test('nav switching works', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Rendszer > Áttekintés (default active)
    await expect(page.locator('h2').filter({ hasText: 'Áttekintés' })).toBeVisible();

    // Open Infrastruktúra
    await page.locator('button.nav-group-header', { hasText: 'Infrastruktúra' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Cron jobs' }).click();
    await page.waitForTimeout(2000);
    await expect(page.locator('h2').filter({ hasText: 'Cron jobs' })).toBeVisible();

    // Open Agentek
    await page.locator('button.nav-group-header', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Végrehajtók' }).click();
    await page.waitForTimeout(2000);
    await expect(page.locator('h2').filter({ hasText: 'Végrehajtók' })).toBeVisible();
  });
});
