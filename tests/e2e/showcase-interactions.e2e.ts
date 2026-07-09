import { test, expect } from '@playwright/test';

test.describe('Showcase navigation', () => {
    test('key component pages render without 404', async ({ page }) => {
        const pages = [
            '/components/badge',
            '/components/card',
            '/components/code',
            '/components/dropdown',
            '/components/icon',
            '/components/image',
            '/components/loader',
            '/components/tab',
            '/components/pagination',
            '/components/percentage',
        ];

        for (const url of pages) {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await expect(page).toHaveURL(url);
            await expect(page.locator('body')).not.toHaveText(/404|not found/i);
        }
    });

    test('block component pages render correctly', async ({ page }) => {
        const pages = [
            '/components/brand',
            '/components/menu',
            '/components/search',
            '/components/theme-switcher',
        ];

        for (const url of pages) {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await expect(page).toHaveURL(url);
            await expect(page.locator('body')).not.toHaveText(/404|not found/i);
        }
    });
});

test.describe('Showcase form fields', () => {
    test('form field pages render correctly', async ({ page }) => {
        const pages = [
            '/components/autocomplete',
            '/components/checklist',
            '/components/crop',
            '/components/image-field',
            '/components/label',
            '/components/select',
            '/components/textarea',
            '/components/switch',
            '/components/context-menu',
        ];

        for (const url of pages) {
            await page.goto(url);
            await expect(page).toHaveURL(url);
            await expect(page.locator('body')).not.toHaveText(/404|not found/i);
        }
    });
});

test.describe('Showcase widgets', () => {
    test('widget pages render correctly', async ({ page }) => {
        const pages = [
            '/components/grid',
            '/components/grid/array',
            '/components/form',
            '/components/form/draft',
            '/components/form/validation',
            '/components/form/custom-actions',
            '/components/prompt',
            '/components/markdown-reader',
            '/components/auth',
        ];

        for (const url of pages) {
            await page.goto(url);
            await expect(page).toHaveURL(url);
            await expect(page.locator('body')).not.toHaveText(/404|not found/i);
        }
    });
});
