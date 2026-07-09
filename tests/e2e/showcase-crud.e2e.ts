import { test, expect } from '@playwright/test';

test.describe('Grid CRUD operations', () => {
    test('full CRUD flow: add, edit, and delete a record', async ({ page }) => {
        await page.goto('/components/grid', { waitUntil: 'load' });

        await expect(page.locator('h2').filter({ hasText: 'Actions and editing' })).toBeVisible();

        // ── CREATE ─────────────────────────────────────────────────────────────
        await page.getByRole('button', { name: /^Add$/ }).click();

        await expect(page.locator('input[name="name"]')).toBeVisible();

        await page.locator('input[name="name"]').fill('E2E Test User');
        await page.locator('input[name="email"]').fill('e2e@test.com');
        await page.locator('select[name="role"]').selectOption('admin');
        await page.locator('select[name="status"]').selectOption('active');
        await page.locator('input[name="team"]').fill('QA');
        await page.locator('input[name="city"]').fill('London');

        await page.getByRole('button', { name: 'Save' }).click();

        const row = page.locator('td').filter({ hasText: 'E2E Test User' }).first();
        await expect(row).toBeVisible({ timeout: 5000 });

        // ── EDIT ───────────────────────────────────────────────────────────────
        await page.locator('tr').filter({ hasText: 'E2E Test User' }).first().click({ force: true });

        await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('input[name="name"]')).toHaveValue('E2E Test User');

        // force: true skips stability check — avoids React StrictMode detach
        await page.locator('input[name="name"]').fill('E2E Updated User', { force: true });

        // evaluate click bypasses React re-render detachment in dev mode
        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Save');
            btn?.click();
        });

        await expect(page.locator('td').filter({ hasText: 'E2E Updated User' }).first()).toBeVisible({ timeout: 5000 });
        await expect(page.locator('td').filter({ hasText: 'E2E Test User' })).toHaveCount(0);

        // ── DELETE ─────────────────────────────────────────────────────────────
        await page.locator('tr').filter({ hasText: 'E2E Updated User' }).first().click({ force: true });

        await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15000 });

        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Delete');
            btn?.click();
        });

        await page.waitForTimeout(1000);
        await expect(page.locator('td').filter({ hasText: 'E2E Updated User' })).toHaveCount(0);
    });
});
