import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));

import { Sanitizer, normalizeVisualChars } from '../../../src/libs/sanitizer';

describe('normalizeVisualChars', () => {
    it('normalizes fullwidth plus/minus', () => {
        expect(normalizeVisualChars('＋')).toBe('+');
        expect(normalizeVisualChars('－')).toBe('-');
    });
    it('normalizes fullwidth symbols', () => {
        expect(normalizeVisualChars('＠')).toBe('@');
        expect(normalizeVisualChars('＃')).toBe('#');
        expect(normalizeVisualChars('＄')).toBe('$');
        expect(normalizeVisualChars('％')).toBe('%');
    });
    it('normalizes fullwidth digits', () => {
        expect(normalizeVisualChars('１')).toBe('1');
        expect(normalizeVisualChars('５')).toBe('5');
        expect(normalizeVisualChars('９')).toBe('9');
    });
    it('normalizes fullwidth letters', () => {
        expect(normalizeVisualChars('Ａ')).toBe('A');
        expect(normalizeVisualChars('ｚ')).toBe('z');
    });
    it('returns empty string for falsy input', () => {
        expect(normalizeVisualChars('')).toBe('');
        expect(normalizeVisualChars(undefined as unknown as string)).toBe('');
    });
    it('applies NFKC normalization before character mapping', () => {
        const result = normalizeVisualChars('\uFF21'); // fullwidth A
        expect(result).toBe('A');
    });
    it('preserves already-normal text', () => {
        expect(normalizeVisualChars('hello@example.com')).toBe('hello@example.com');
    });
});

describe('Sanitizer.apply with built-in rules', () => {
    const s = new Sanitizer();

    it('email rule removes spaces and lowercases', () => {
        expect(s.apply('email', 'John @ Doe ')).toBe('john@doe');
    });
    it('email rule trims leading/trailing whitespace', () => {
        expect(s.apply('email', '  USER@Example.COM  ')).toBe('user@example.com');
    });

    it('phone rule removes all non-digit characters', () => {
        expect(s.apply('phone', '+1 (555) 123-4567')).toBe('15551234567');
    });
    it('phone rule handles pure digits', () => {
        expect(s.apply('phone', '15551234567')).toBe('15551234567');
    });

    it('price rule removes non-numeric chars except dot and minus', () => {
        const result = s.apply('price', '$1,234.56');
        expect(result).not.toContain('$');
        expect(result).not.toContain(',');
    });

    it('name rule is a no-op when ucwords and trim masks are unavailable', () => {
        expect(s.apply('name', 'john doe')).toBe('john doe');
    });
    it('name rule leaves whitespace unchanged when trim mask unavailable', () => {
        expect(s.apply('name', '  alice  ')).toBe('  alice  ');
    });

    it('slug rule lowercases and replaces spaces with hyphens', () => {
        const result = s.apply('slug', 'Hello World');
        expect(result).toBe('hello-world');
    });
    it('slug rule removes special characters', () => {
        const result = s.apply('slug', 'Hello! World?');
        expect(result).toBe('hello-world');
    });

    it('returns value unchanged for unknown rule', () => {
        expect(s.apply('nonexistent' as any, 'hello')).toBe('hello');
    });
    it('applies autoCast for unknown rule when autoCast is true', () => {
        const result = s.apply('nonexistent' as any, '42', true);
        expect(result).toBe(42);
    });
});

describe('Sanitizer.apply with exclusions', () => {
    it('returns empty string when exclusion phrase is found', () => {
        const s = new Sanitizer({
            testRule: {
                exclusions: [{ phrase: 'badword' }],
                transformations: [],
                mask: [],
            },
        });
        expect(s.apply('testRule', 'contains badword here')).toBe('');
    });
    it('does not exclude when phrase is absent', () => {
        const s = new Sanitizer({
            testRule: {
                exclusions: [{ phrase: 'badword' }],
                transformations: [],
                mask: [],
            },
        });
        expect(s.apply('testRule', 'clean text')).toBe('clean text');
    });
    it('exclusion is case-insensitive', () => {
        const s = new Sanitizer({
            testRule: {
                exclusions: [{ phrase: 'BADWORD' }],
                transformations: [],
                mask: [],
            },
        });
        expect(s.apply('testRule', 'has BadWord here')).toBe('');
    });
    it('ignores empty exclusion phrases', () => {
        const s = new Sanitizer({
            testRule: {
                exclusions: [{ phrase: '' }, { phrase: '  ' }],
                transformations: [],
                mask: [],
            },
        });
        expect(s.apply('testRule', 'anything')).toBe('anything');
    });
});

describe('Sanitizer.apply with custom transformations', () => {
    it('applies regex transformations in order', () => {
        const s = new Sanitizer({
            trimmer: {
                transformations: [
                    { pattern: '\\s+', replace: '-' },
                    { pattern: '-+', replace: '-' },
                ],
                mask: [],
            },
        });
        expect(s.apply('trimmer', 'hello   world')).toBe('hello-world');
    });
    it('supports empty replacement', () => {
        const s = new Sanitizer({
            remover: {
                transformations: [{ pattern: '[aeiou]', replace: '' }],
                mask: [],
            },
        });
        expect(s.apply('remover', 'hello')).toBe('hll');
    });
});

describe('Sanitizer.applyMatches', () => {
    it('applies email rule to fields matching email*', () => {
        const s = new Sanitizer();
        const result = s.applyMatches({ email_work: ' User@Example.COM ' });
        expect(result.email_work).toBe('user@example.com');
    });
    it('applies price rule to fields matching *_price', () => {
        const s = new Sanitizer();
        const result = s.applyMatches({ product_price: '$1,234.56' });
        expect(result.product_price).not.toContain('$');
    });
    it('applies name rule to fields matching name* (no-op when ucwords/trim masks unavailable)', () => {
        const s = new Sanitizer();
        const result = s.applyMatches({ full_name: 'john doe' });
        expect(result.full_name).toBe('john doe');
    });
    it('leaves non-matching fields unchanged', () => {
        const s = new Sanitizer();
        const result = s.applyMatches({ unknown: '  hello  ' });
        expect(result.unknown).toBe('  hello  ');
    });
    it('handles custom match patterns', () => {
        const s = new Sanitizer(
            { trimRule: { transformations: [{ pattern: '^\\s+|\\s+$', replace: '' }], mask: [] } },
            [{ pattern: 'trim*', use: 'trimRule' }],
        );
        const result = s.applyMatches({ trim_me: '  spaced  ' });
        expect(result.trim_me).toBe('spaced');
    });
});

describe('Sanitizer.addRule and addMatch', () => {
    it('addRule adds a new rule that can be applied', () => {
        const s = new Sanitizer();
        s.addRule('upper', { transformations: [], mask: ['toUpper'] });
        expect(s.apply('upper', 'hello')).toBe('HELLO');
    });
    it('addMatch allows field matching with custom rule', () => {
        const s = new Sanitizer();
        s.addRule('reverse', { transformations: [], mask: [] });
        s.addMatch('rev_*', 'reverse');
        const result = s.applyMatches({ rev_name: 'test' });
        expect(result.rev_name).toBe('test');
    });
});

describe('Sanitizer.getOptions', () => {
    it('returns sorted list of rule descriptions', () => {
        const s = new Sanitizer();
        const options = s.getOptions();
        expect(options.length).toBeGreaterThanOrEqual(6);
        const names = options.map(o => o.value);
        expect(names).toContain('email');
        expect(names).toContain('phone');
        expect(names).toContain('price');
        expect(names).toContain('slug');
    });
    it('includes custom rules after addRule', () => {
        const s = new Sanitizer();
        s.addRule('custom', { description: 'My custom rule', transformations: [], mask: [] });
        const options = s.getOptions();
        expect(options.find(o => o.value === 'custom')?.label).toBe('My custom rule');
    });
});

describe('Sanitizer default matches', () => {
    it('maps email_* to email rule', () => {
        const s = new Sanitizer();
        const result = s.applyMatches({
            email_address: '  Test@Example.COM  ',
            name_field: 'john doe',
        });
        expect(result.email_address).toBe('test@example.com');
        expect(result.name_field).toBe('john doe');
    });
});

describe('Sanitizer wildcardToRegExp (via applyMatches)', () => {
    it('matches prefix wildcard email*', () => {
        const s = new Sanitizer();
        expect(s.applyMatches({ email_work: ' A ' }).email_work).toBe('a');
    });
    it('matches suffix wildcard *_price', () => {
        const s = new Sanitizer();
        expect(s.applyMatches({ retail_price: '$ 5' }).retail_price).not.toBe('$ 5');
    });
});
