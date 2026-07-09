import { test, expect } from '@playwright/test';

test.describe('Showcase smoke tests', () => {
    test('homepage loads with title and navigation', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('nav,header,[class*="nav"],[class*="header"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('navigates to Alert component page', async ({ page }) => {
        await page.goto('/components/alert');
        await expect(page).toHaveURL(/\/components\/alert/);
    });

    test('Buttons page renders', async ({ page }) => {
        await page.goto('/components/buttons');
        await expect(page.locator('button,a[class*="btn"],a[class*="button"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('Modal page renders', async ({ page }) => {
        await page.goto('/components/modal');
        await expect(page).toHaveURL(/\/components\/modal/);
    });

    test('Grid page renders', async ({ page }) => {
        await page.goto('/components/grid');
        await expect(page).toHaveURL(/\/components\/grid/);
    });

    test('Form page renders', async ({ page }) => {
        await page.goto('/components/form');
        await expect(page).toHaveURL(/\/components\/form/);
    });

    test('Input page renders', async ({ page }) => {
        await page.goto('/components/input');
        await expect(page).toHaveURL(/\/components\/input/);
    });

    test('Select page renders', async ({ page }) => {
        await page.goto('/components/select');
        await expect(page).toHaveURL(/\/components\/select/);
    });

    test('Table page renders', async ({ page }) => {
        await page.goto('/components/table');
        await expect(page).toHaveURL(/\/components\/table/);
    });

    test('Gallery page renders', async ({ page }) => {
        await page.goto('/components/gallery');
        await expect(page).toHaveURL(/\/components\/gallery/);
    });

    test('Upload page renders', async ({ page }) => {
        await page.goto('/components/upload');
        await expect(page).toHaveURL(/\/components\/upload/);
    });
});
