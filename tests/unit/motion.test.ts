import { describe, expect, it, vi } from 'vitest';
import { resolveMotionEffect, type MotionRegistry } from '../../src/motion';

const registry: MotionRegistry = {
    none: {
        from: {},
        to: {},
        transition: { duration: 0, easing: 'linear', properties: ['opacity'] },
        reducedMotion: 'always',
    },
    fade: {
        from: { opacity: 0 },
        to: { opacity: 1 },
        transition: { duration: 160, easing: 'ease-out', properties: ['opacity'] },
        reducedMotion: 'respect-user',
    },
    press: {
        from: {},
        to: { transform: 'scale(0.98)' },
        transition: { duration: 100, easing: 'ease-out', properties: ['transform'] },
        reducedMotion: 'respect-user',
    },
};

describe('motion', () => {
    it('resolves semantic effects from the registry', () => {
        expect(resolveMotionEffect('press', registry)).toMatchObject({
            to: { transform: 'scale(0.98)' },
            transition: {
                duration: 100,
                easing: 'ease-out',
                properties: ['transform'],
            },
        });
    });

    it('returns the none effect when disabled locally', () => {
        expect(resolveMotionEffect(false, registry, 'fade')).toMatchObject({
            from: {},
            to: {},
            transition: {
                duration: 0,
                easing: 'linear',
            },
        });
    });

    it('respects the user reduced motion preference', () => {
        const matchMedia = vi.fn().mockReturnValue({ matches: true });
        vi.stubGlobal('matchMedia', matchMedia);

        expect(resolveMotionEffect('fade', registry)).toMatchObject({
            from: {},
            to: {},
            transition: {
                duration: 0,
                easing: 'linear',
            },
        });

        vi.unstubAllGlobals();
    });
});
