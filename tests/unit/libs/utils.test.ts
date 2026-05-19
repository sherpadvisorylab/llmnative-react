import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Prevent Firebase initialization side-effects at import time
vi.mock('../../../src/Config', () => ({
    getConfig: vi.fn(() => ({})),
    onConfigChange: vi.fn(),
    default: {},
}));
vi.mock('../../../src/providers/firebase-init', () => ({ default: vi.fn(), getSafeAuth: vi.fn() }));

import { trimSlash, trimPath, normalizePath, normalizeKey, sanitizeKey, isEmpty, safeClone } from '../../../src/libs/utils';

describe('trimSlash', () => {
    it('removes leading slash from string', () => {
        expect(trimSlash('/users/1')).toBe('users/1');
    });
    it('returns unchanged string without leading slash', () => {
        expect(trimSlash('users/1')).toBe('users/1');
    });
    it('returns empty string for falsy input', () => {
        expect(trimSlash('')).toBe('');
        expect(trimSlash(undefined)).toBe('');
    });
    it('converts number to string', () => {
        expect(trimSlash(42)).toBe('42');
    });
    it('converts boolean to string', () => {
        expect(trimSlash(true)).toBe('true');
        expect(trimSlash(false)).toBe('false');
    });
});

describe('normalizePath', () => {
    it('lowercases and replaces spaces with hyphens', () => {
        expect(normalizePath('My Page')).toBe('my-page');
    });
    it('replaces apostrophe with hyphen (treated as word separator)', () => {
        // apostrophe → '-', so "it's" becomes "it-s"
        expect(normalizePath("it's here!")).toBe('it-s-here');
    });
    it('collapses multiple hyphens', () => {
        expect(normalizePath('a--b---c')).toBe('a-b-c');
    });
    it('returns empty string for falsy input', () => {
        expect(normalizePath(undefined)).toBe('');
        expect(normalizePath('')).toBe('');
    });
    it('preserves path separators', () => {
        expect(normalizePath('/users/my page')).toBe('/users/my-page');
    });
});

describe('trimPath', () => {
    it('removes both leading and trailing slashes', () => {
        expect(trimPath('/users/')).toBe('users');
        expect(trimPath('/users/1/')).toBe('users/1');
    });
    it('normalizes spaces in path segments', () => {
        expect(trimPath('/my section/')).toBe('my-section');
    });
});

describe('normalizeKey', () => {
    it('replaces dots, @, # with hyphens', () => {
        expect(normalizeKey('user@domain.com')).toBe('user-domain-com');
    });
    it('removes leading slash before normalizing', () => {
        expect(normalizeKey('/users')).toBe('users');
    });
    it('replaces slashes with pipe', () => {
        expect(normalizeKey('a/b/c')).toBe('a|b|c');
    });
    it('lowercases the result', () => {
        expect(normalizeKey('MyKey')).toBe('mykey');
    });
    it('trims leading/trailing hyphens', () => {
        expect(normalizeKey('-hello-')).toBe('hello');
    });
});

describe('isEmpty', () => {
    it('returns true for null, undefined, empty string', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
    });
    it('returns false for non-empty string', () => {
        expect(isEmpty('hello')).toBe(false);
    });
    it('returns true for zero and false (treated as empty)', () => {
        // isEmpty considers 0, false, '0' as empty — intentional design for form field handling
        expect(isEmpty(0)).toBe(true);
        expect(isEmpty(false)).toBe(true);
    });
});

describe('safeClone', () => {
    it('deep clones an object', () => {
        const original = { a: { b: 1 } };
        const clone = safeClone(original);
        clone.a.b = 99;
        expect(original.a.b).toBe(1);
    });
    it('deep clones an array', () => {
        const original = [{ x: 1 }];
        const clone = safeClone(original);
        clone[0].x = 99;
        expect(original[0].x).toBe(1);
    });
    it('returns primitives as-is', () => {
        expect(safeClone(42)).toBe(42);
        expect(safeClone('hello')).toBe('hello');
        expect(safeClone(null)).toBe(null);
    });
    it('preserves React elements while cloning surrounding objects', () => {
        const original = {
            title: 'Card',
            media: React.createElement('img', { src: 'https://example.com/demo.png', alt: 'demo' }),
            meta: { featured: true },
        };

        const clone = safeClone(original);

        expect(clone).not.toBe(original);
        expect(clone.meta).not.toBe(original.meta);
        expect(clone.meta.featured).toBe(true);
        expect(React.isValidElement(clone.media)).toBe(true);
        expect(clone.media).toBe(original.media);
    });
});
