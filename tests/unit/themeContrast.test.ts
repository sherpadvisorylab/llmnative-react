import { describe, expect, it } from 'vitest';
import { BUILT_IN_THEMES, type ColorScale } from '../../src/Theme';

// WCAG 2.x contrast of the built-in themes, in both modes, on the token pairs the components draw.
// A theme's dark mode is `colors` overridden by `dark`, as the CSS cascade applies them.

function hslToRgb(token: string): [number, number, number] {
    const [h, s, l] = token.trim().split(/\s+/).map((part) => Number.parseFloat(part));
    const sat = s / 100;
    const light = l / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = sat * Math.min(light, 1 - light);
    const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
}

function luminance(token: string): number {
    const [r, g, b] = hslToRgb(token).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
}

type Token = keyof ColorScale;
type Palette = Record<Token, string>;

/** [foreground, surface, minimum ratio] */
const PAIRS: Array<[Token, Token, number]> = [
    ['foreground', 'background', 4.5],
    ['foreground', 'canvas', 4.5],
    ['cardForeground', 'card', 4.5],
    ['popoverForeground', 'popover', 4.5],
    ['mutedForeground', 'background', 4.5],
    ['mutedForeground', 'canvas', 4.5],
    ['mutedForeground', 'card', 4.5],
    ['mutedForeground', 'muted', 4.5],
    ['primaryForeground', 'primary', 4.5],
    ['secondaryForeground', 'secondary', 4.5],
    ['accentForeground', 'accent', 4.5],
    // Primary as text (links, the active SideNav entry) and the focus ring: non-text contrast.
    ['primary', 'card', 3],
    ['ring', 'background', 3],
    // A card edge must be visible over the card itself.
    ['border', 'card', 1.15],
];

/** Themes compiled as a light/dark pair share both palettes: each pair is checked once. */
const PAIRED_WITH: Record<string, string> = {
    'vscode-light-modern': 'vscode-dark-modern',
    'vscode-light-plus': 'vscode-dark-plus',
    'tokyo-night-light': 'tokyo-night',
};

/**
 * Known failures, measured and kept on purpose: each one is a choice of the palette's authors that
 * the framework reproduces faithfully. A new failure, or a listed one getting worse, fails the test.
 */
const KNOWN_FAILURES: Record<string, number> = {
    // Tailwind/shadcn slate: slate-500 on slate-100, ring blue-700 on slate-950.
    'default/light mutedForeground/muted': 4.34,
    'default/dark ring/background': 2.98,
    'flat/light mutedForeground/background': 4.05,
    'flat/light mutedForeground/canvas': 4.05,
    'flat/light mutedForeground/card': 4.23,
    'flat/light mutedForeground/muted': 3.6,
    'flat/dark mutedForeground/card': 4.44,
    'flat/dark mutedForeground/muted': 3.76,
    'flat/dark primaryForeground/primary': 3.76,
    'cyber/light mutedForeground/background': 4.05,
    'cyber/light mutedForeground/canvas': 4.05,
    'cyber/light mutedForeground/card': 4.23,
    'cyber/light mutedForeground/muted': 3.67,
    'cyber/light primary/card': 2.59,
    'cyber/light ring/background': 2.48,
    // VS Code Light+: descriptionForeground #717171 on the side bar and on list hover.
    'vscode-dark-plus/light mutedForeground/canvas': 4.4,
    'vscode-dark-plus/light mutedForeground/muted': 3.99,
    // VS Code Dark+: the button blue #0E639C is a fill for white text, dim as text on dark surfaces.
    'vscode-dark-plus/dark primary/card': 2.39,
    // Tokyo Night: low-contrast by design (descriptions, translucent focus border, dark borders).
    'tokyo-night/light mutedForeground/background': 3.86,
    'tokyo-night/light mutedForeground/canvas': 3.34,
    'tokyo-night/light mutedForeground/card': 3.86,
    'tokyo-night/light mutedForeground/muted': 3.68,
    'tokyo-night/light secondaryForeground/secondary': 2.31,
    'tokyo-night/light ring/background': 1.25,
    'tokyo-night/dark popoverForeground/popover': 4.4,
    'tokyo-night/dark mutedForeground/background': 2.37,
    'tokyo-night/dark mutedForeground/canvas': 2.49,
    'tokyo-night/dark mutedForeground/card': 2.37,
    'tokyo-night/dark mutedForeground/muted': 2.56,
    'tokyo-night/dark secondaryForeground/secondary': 2.58,
    'tokyo-night/dark primary/card': 2.24,
    'tokyo-night/dark ring/background': 1.18,
    'tokyo-night/dark border/card': 1.11,
};

function palettesOf(id: string): Array<['light' | 'dark', Palette]> {
    const { colors, dark } = BUILT_IN_THEMES[id as keyof typeof BUILT_IN_THEMES].preset;
    const withCanvas = (scale: ColorScale) => ({ ...scale, canvas: scale.canvas ?? scale.background }) as Palette;
    return [['light', withCanvas({ ...colors })], ['dark', withCanvas({ ...colors, ...dark })]];
}

const CASES = Object.keys(BUILT_IN_THEMES)
    .filter((id) => !(id in PAIRED_WITH))
    .flatMap((id) => palettesOf(id).map(([mode, palette]) => [`${id}/${mode}`, palette] as [string, Palette]));

describe('built-in theme contrast', () => {
    it.each(CASES)('%s meets WCAG AA or its known failures', (name, palette) => {
        const failures: string[] = [];
        for (const [fg, surface, minimum] of PAIRS) {
            const ratio = contrast(palette[fg], palette[surface]);
            const key = `${name} ${fg}/${surface}`;
            const allowed = KNOWN_FAILURES[key];
            if (ratio >= minimum || (allowed !== undefined && ratio >= allowed)) continue;
            failures.push(`${key} ${ratio} < ${allowed ?? minimum}`);
        }
        expect(failures).toEqual([]);
    });

    it.each(CASES)('%s cards are never darker than the canvas', (_name, palette) => {
        expect(luminance(palette.card)).toBeGreaterThanOrEqual(luminance(palette.canvas));
    });

    it.each(Object.entries(PAIRED_WITH))('%s shares both palettes with %s', (id, pairedId) => {
        expect(palettesOf(id)).toEqual(palettesOf(pairedId));
    });

    it('lists only failures that still fail', () => {
        const passing = Object.keys(KNOWN_FAILURES).filter((key) => {
            const [name, pair] = key.split(' ');
            const [fg, surface] = pair.split('/') as [Token, Token];
            const palette = CASES.find(([caseName]) => caseName === name)?.[1];
            const minimum = PAIRS.find(([f, s]) => f === fg && s === surface)?.[2];
            return !palette || minimum === undefined || contrast(palette[fg], palette[surface]) >= minimum;
        });
        expect(passing, 'remove these from KNOWN_FAILURES').toEqual([]);
    });
});
