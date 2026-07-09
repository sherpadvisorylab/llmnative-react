import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['tests/integration/**', 'tests/e2e/**', 'node_modules/**'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/__tests__/**',
                'src/**/*.d.ts',
                'src/providers/data/firebase.ts',
                'src/providers/storage/firebase.ts',
                'src/providers/auth/google/**',
                'src/providers/firebase-init.ts',
            ],
            reporter: ['text', 'lcov'],
        },
    },
});
