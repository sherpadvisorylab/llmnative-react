import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isMenuEntry } from '../../src/App';
import { BUILT_IN_THEMES } from '../../src/Theme';

// CR-126: the frame of an app (top bar, side bar, status bar) in the colors of its theme, and a menu of pages only.

const root = join(__dirname, '../..');
const FRAME = ['header', 'headerForeground', 'headerBorder', 'sidebar', 'sidebarForeground', 'sidebarBorder', 'sidebarAccent', 'sidebarAccentForeground', 'footer', 'footerForeground', 'footerBorder'] as const;

describe('the frame of the app', () => {
    it('comes from the IDE for every theme compiled from one, light and dark', () => {
        for (const id of ['vscode-light-modern', 'vscode-dark-modern', 'vscode-light-plus', 'vscode-dark-plus', 'tokyo-night', 'tokyo-night-light'] as const) {
            const { colors, dark } = BUILT_IN_THEMES[id].preset;
            for (const token of FRAME) {
                expect(colors?.[token], `${id} light ${token}`).toMatch(/^\d/);
                expect(dark?.[token], `${id} dark ${token}`).toMatch(/^\d/);
            }
        }
        // VS Code Light+: the gray title bar and the blue status bar of the IDE.
        expect(BUILT_IN_THEMES['vscode-light-plus'].preset.colors?.header).toBe('0 0% 86.7%');
        expect(BUILT_IN_THEMES['vscode-light-plus'].preset.colors?.footer).toBe('204.1 100% 40%');
    });

    it('falls back to the base tokens for a theme without it', () => {
        expect(BUILT_IN_THEMES.default.preset.colors?.header).toBeUndefined();
        const css = readFileSync(join(root, 'src/globals.css'), 'utf8');
        expect(css).toContain('--color-header: hsl(var(--rf-header, var(--rf-background)));');
        expect(css).toContain('--color-sidebar: hsl(var(--rf-sidebar, var(--rf-card)));');
        expect(css).toContain('--color-footer-border: hsl(var(--rf-footer-border, var(--rf-border)));');
    });

    it('draws a border without a color in the border of the theme', () => {
        const css = readFileSync(join(root, 'src/globals.css'), 'utf8');
        expect(css).toMatch(/\*,\s*::before,\s*::after,[^{]*\{\s*border-color: hsl\(var\(--rf-border\)\);/);
    });

    it('is what the scaffold gives: no border without a color in its templates, the frame in its CSS', () => {
        const files: string[] = [];
        const walk = (dir: string) => {
            for (const entry of readdirSync(dir, { withFileTypes: true })) {
                const path = join(dir, entry.name);
                if (entry.isDirectory()) walk(path);
                else if (entry.name.endsWith('.tsx')) files.push(path);
            }
        };
        walk(join(root, 'templates'));
        for (const file of files) {
            for (const [, classes] of readFileSync(file, 'utf8').matchAll(/className="([^"]*)"/g)) {
                const list = classes.split(/\s+/);
                const borders = list.filter((name) => /^border(-[btlrxy])?$/.test(name));
                if (!borders.length) continue;
                expect(list.some((name) => /^border-(?!\d|[btlrxy]$|[btlrxy]-\d)[a-z]/.test(name)), `${file}: ${classes}`).toBe(true);
            }
        }
        const header = readFileSync(join(root, 'templates/_shared/sections/Header.tsx'), 'utf8');
        expect(header).toContain('border-header-border bg-header');
        const footer = readFileSync(join(root, 'templates/_shared/sections/Footer.tsx'), 'utf8');
        expect(footer).toContain('border-footer-border bg-footer');
        const setup = readFileSync(join(root, 'scripts/cli/setup-project.js'), 'utf8');
        expect(setup).toContain("const DEFAULT_THEME = 'vscode-light-modern';");
        expect(setup).toContain('--color-sidebar-accent:');
    });
});

describe('the entries of a menu', () => {
    it('are the pages to navigate to: a title, no parameter, no wildcard, not hidden', () => {
        expect(isMenuEntry({ path: '/', title: 'Home' })).toBe(true);
        expect(isMenuEntry({ path: '/settings' })).toBe(false);
        expect(isMenuEntry({ path: '/settings', title: '  ' })).toBe(false);
        expect(isMenuEntry({ path: '/invite/:token', title: 'Invite' })).toBe(false);
        expect(isMenuEntry({ path: ':id', title: 'Item' })).toBe(false);
        expect(isMenuEntry({ path: '*', title: 'Not found' })).toBe(false);
        expect(isMenuEntry({ path: '/sign-in', title: 'Sign in', hidden: true })).toBe(false);
        // A parent stays for its entries.
        expect(isMenuEntry({ path: '/admin', children: [{ path: '/admin/users', title: 'Users' }] })).toBe(true);
        expect(isMenuEntry({ path: '/admin', children: [{ path: '/admin/:id' }] })).toBe(false);
    });
});
