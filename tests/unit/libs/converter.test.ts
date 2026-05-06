import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));

import { converter } from '../../../src/libs/converter';

describe('converter.toCamel', () => {
    // signature: toCamel(str, separator='', delimiter=['-','_',' '])
    // separator = string inserted BEFORE each capitalised word in the output
    // delimiter = chars that split words in the input
    // Note: the first character is also capitalised → effectively PascalCase
    it('converts snake_case to PascalCase with no output separator', () => {
        expect(converter.toCamel('hello_world')).toBe('HelloWorld');
    });
    it('converts kebab-case to PascalCase with no output separator', () => {
        expect(converter.toCamel('hello-world')).toBe('HelloWorld');
    });
    it('capitalises single word', () => {
        expect(converter.toCamel('hello')).toBe('Hello');
    });
    it('inserts output separator before each capital when separator is given', () => {
        // separator='_' → _Hello_World
        expect(converter.toCamel('hello_world', '_')).toBe('_Hello_World');
    });
});

describe('converter.toUpper', () => {
    it('uppercases a string', () => {
        expect(converter.toUpper('hello')).toBe('HELLO');
    });
});

describe('converter.toLower', () => {
    it('lowercases a string', () => {
        expect(converter.toLower('HELLO')).toBe('hello');
    });
});

describe('converter.toSlug', () => {
    it('converts spaces to hyphens and lowercases', () => {
        expect(converter.toSlug('Hello World')).toBe('hello-world');
    });
    it('replaces apostrophe with hyphen (delegates to normalizeKey)', () => {
        // apostrophe → '-', so "it's" becomes "it-s"
        expect(converter.toSlug("it's great!")).toBe('it-s-great');
    });
});

describe('converter.truncate', () => {
    it('truncates to given length with ellipsis', () => {
        const result = converter.truncate('Hello World', 5);
        expect(result.length).toBeLessThanOrEqual(8); // 5 + '...'
        expect(result).toContain('Hello');
    });
    it('returns original string if shorter than limit', () => {
        expect(converter.truncate('Hi', 10)).toBe('Hi');
    });
});

describe('converter.toQueryString', () => {
    it('builds query string from params', () => {
        const qs = converter.toQueryString({ a: '1', b: '2' }, '?');
        expect(qs).toContain('a=1');
        expect(qs).toContain('b=2');
        expect(qs.startsWith('?')).toBe(true);
    });
    it('returns empty string for empty params', () => {
        expect(converter.toQueryString({}, '?')).toBe('');
    });
});

describe('converter.parse', () => {
    it('interpolates {key} placeholders from a record', () => {
        const result = converter.parse({ name: 'Alice', role: 'admin' }, '{name} ({role})');
        expect(result).toBe('Alice (admin)');
    });
    it('leaves unknown placeholders empty', () => {
        const result = converter.parse({ name: 'Alice' }, '{name} {missing}');
        expect(result).toBe('Alice ');
    });
});

describe('converter.subStringCount', () => {
    it('counts occurrences of substring', () => {
        expect(converter.subStringCount('aababc', 'ab')).toBe(2);
    });
    it('returns 0 when substring not found', () => {
        expect(converter.subStringCount('hello', 'xyz')).toBe(0);
    });
});
