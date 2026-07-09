import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '*.e2e.ts',
    timeout: 30000,
    retries: 1,
    use: {
        baseURL: 'http://127.0.0.1:3000',
        headless: true,
        viewport: { width: 1280, height: 720 },
    },
    webServer: {
        command: 'npm run dev',
        cwd: './clients/showcase',
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});
