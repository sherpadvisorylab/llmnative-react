import '@testing-library/jest-dom';
import { afterEach, beforeAll } from 'vitest';
import { lucideSdk } from '../src/providers/icon/LucideIconProvider';
import { phosphorSdk } from '../src/providers/icon/PhosphorIconProvider';

// CR-154 — the icon packages load on demand; in an app `<App>` waits for the active one before its first render.
// Loaded here so that a component rendered on its own draws its icons at once, as before. A suite that mocks a
// package as missing (the optional-peer tests) just leaves it unloaded.
beforeAll(async () => {
    await Promise.allSettled([lucideSdk.load(), phosphorSdk.load()]);
}, 300_000); // the cost the static imports of the two packages had before, now paid here (slow on a busy machine)

// localStorage is shared global state across test cases in the same environment (happy-dom) —
// components that persist to it (e.g. ThemeProvider) would otherwise leak state between tests.
// Guarded because some suites run under `--environment node` (no DOM globals at all).
afterEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear();
});
