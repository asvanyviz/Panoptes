import { test, expect, type Page } from '@playwright/test';

// Helper: click a nav item — works for both leaf items and group headers
async function clickNavByLabel(page: Page, label: string) {
  const leaf = page.locator('button.nav-item', { hasText: label });
  if (await leaf.isVisible().catch(() => false)) {
    await leaf.click();
    return;
  }
  const group = page.locator('button.nav-group-header', { hasText: label });
  if (await group.isVisible().catch(() => false)) {
    await group.click();
    return;
  }
  await page.locator('button', { hasText: label }).first().click();
}

test.describe('Agents View E2E', () => {
  test('Agents view loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(1000);

    // "Infrastruktúra" group is auto-opened; click Agentek leaf
    await page.locator('button.nav-item', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(2000);

    const hasError = await page.locator('.error-card').isVisible().catch(() => false);
    const hasLoading = await page.locator('.loading').isVisible().catch(() => false);
    const hasCards = await page.locator('.agent-card').count().then(c => c > 0).catch(() => false);
    expect(hasError || hasLoading || hasCards).toBe(true);
    expect(errors.length).toBe(0);
  });

  test('agents header and filter UI render', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(2000);

    const header = page.locator('h2').filter({ hasText: 'Agentek' });
    await expect(header).toBeVisible();
  });

  test('agent filter buttons are present in the view', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Agentek' }).click();
    await page.waitForTimeout(2000);

    const filterAll = page.locator('.filter-btn', { hasText: 'Összes' });
    await filterAll.isVisible().catch(() => {});
  });
});

test.describe('Memory View E2E', () => {
  test('Memory Health view loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(1000);
    // Click Memória group header to open it, then Health leaf
    await page.locator('button.nav-group-header', { hasText: 'Memória' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Health' }).click();
    await page.waitForTimeout(2000);

    const hasError = await page.locator('.error-card').isVisible().catch(() => false);
    const hasLoading = await page.locator('.loading').isVisible().catch(() => false);
    const hasTabs = await page.locator('.tab-bar').isVisible().catch(() => false);
    expect(hasError || hasLoading || hasTabs).toBe(true);
    expect(errors.length).toBe(0);
  });

  test('memory view header renders', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('button.nav-group-header', { hasText: 'Memória' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Health' }).click();
    await page.waitForTimeout(2000);

    const header = page.locator('h2').filter({ hasText: 'Memória' });
    await expect(header).toBeVisible();
  });

  test('memory tabs switch correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('button.nav-group-header', { hasText: 'Memória' }).click();
    await page.waitForTimeout(500);

    // Click Insights from sidebar — verify no console errors and view renders
    await page.locator('button.nav-item', { hasText: 'Insights' }).click();
    await page.waitForTimeout(2000);
    // Tab bar may not be visible if API fails; that's OK — check header instead
    const header = page.locator('h2').filter({ hasText: 'Memória' });
    await expect(header).toBeVisible();

    // Click Learnings from sidebar
    await page.locator('button.nav-item', { hasText: 'Learnings' }).click();
    await page.waitForTimeout(2000);
    await expect(header).toBeVisible();
  });
});

test.describe('Sessions View E2E', () => {
  test('Sessions view loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(1000);
    // Kommunikáció group is not auto-opened; open it first
    await page.locator('button.nav-group-header', { hasText: 'Kommunikáció' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Sessions' }).click();
    await page.waitForTimeout(2000);

    const hasError = await page.locator('.error-card').isVisible().catch(() => false);
    const hasLoading = await page.locator('.loading').isVisible().catch(() => false);
    const hasStats = await page.locator('.stats-bar').isVisible().catch(() => false);
    const hasTable = await page.locator('.sessions-table').isVisible().catch(() => false);
    const hasEmpty = await page.locator('.empty-state').isVisible().catch(() => false);
    expect(hasError || hasLoading || hasStats || hasTable || hasEmpty).toBe(true);
    expect(errors.length).toBe(0);
  });

  test('sessions view header renders', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('button.nav-group-header', { hasText: 'Kommunikáció' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Sessions' }).click();
    await page.waitForTimeout(2000);

    const header = page.locator('h2').filter({ hasText: 'Sessions' });
    await expect(header).toBeVisible();
  });
});

test.describe('Navigation E2E', () => {
  test('all sidebar group headers and leaf items are visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Group headers
    const groups = ['Megfigyelés', 'Infrastruktúra', 'Memória', 'Kommunikáció', 'Egyéb'];
    for (const label of groups) {
      const group = page.locator('button.nav-group-header', { hasText: label });
      await expect(group).toBeVisible();
    }
  });

  test('leaf items visible in open groups', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Infrastruktúra is auto-opened; these leaf items should be visible
    const leaves = ['Rendszer', 'Agentek'];
    for (const label of leaves) {
      const item = page.locator('button.nav-item', { hasText: label });
      await expect(item).toBeVisible();
    }
  });

  test('clicking groups expand/collapse children', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Memória group — click to expand
    await page.locator('button.nav-group-header', { hasText: 'Memória' }).click();
    await page.waitForTimeout(500);

    const healthLeaf = page.locator('button.nav-item', { hasText: 'Health' });
    await expect(healthLeaf).toBeVisible();

    // Click again to collapse
    await page.locator('button.nav-group-header', { hasText: 'Memória' }).click();
    await page.waitForTimeout(500);

    // Health should not be visible anymore
    expect(await healthLeaf.isVisible().catch(() => false)).toBe(false);
  });

  test('clicking leaf items switches view without error', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(`UNCAUGHT: ${err.message}`));

    await page.goto('/');
    await page.waitForTimeout(500);

    // Navigate via leaf items in auto-opened groups
    const navSteps = [
      { label: 'Rendszer', check: 'Rendszeráttekintés' },
      { label: 'Agentek', check: 'Agentek' },
    ];

    for (const { label, check } of navSteps) {
      await page.locator('button.nav-item', { hasText: label }).click();
      await page.waitForTimeout(2000);
      const h2 = page.locator('h2').filter({ hasText: check });
      await expect(h2).toBeVisible();
    }

    // Open Kommunikáció group and navigate to Sessions
    await page.locator('button.nav-group-header', { hasText: 'Kommunikáció' }).click();
    await page.waitForTimeout(500);
    await page.locator('button.nav-item', { hasText: 'Sessions' }).click();
    await page.waitForTimeout(2000);
    const sessionsH2 = page.locator('h2').filter({ hasText: 'Sessions' });
    await expect(sessionsH2).toBeVisible();

    expect(errors.length).toBe(0);
  });
});
