import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['tests/integration/**/*.test.ts'],
        exclude: ['node_modules/**'],
        setupFiles: [],
        testTimeout: 15000,
    },
});
