import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// localStorage is shared global state across test cases in the same environment (happy-dom) —
// components that persist to it (e.g. ThemeProvider) would otherwise leak state between tests.
// Guarded because some suites run under `--environment node` (no DOM globals at all).
afterEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
});
