import { describe, expect, it, vi } from 'vitest';
import { resolveMotionConfig } from '../../src/motion';

describe('motion', () => {
    it('resolves preset defaults and overrides', () => {
        expect(resolveMotionConfig({ preset: 'subtle', duration: 90 })).toMatchObject({
            duration: 90,
            pressScale: 0.99,
        });
    });

    it('disables motion when reducedMotion is always', () => {
        expect(resolveMotionConfig({ preset: 'expressive', reducedMotion: 'always' })).toMatchObject({
            duration: 0,
            pressScale: 1,
            enterDistance: 0,
        });
    });

    it('respects the user reduced motion preference', () => {
        const matchMedia = vi.fn().mockReturnValue({ matches: true });
        vi.stubGlobal('matchMedia', matchMedia);

        expect(resolveMotionConfig({ preset: 'standard', reducedMotion: 'respect-user' })).toMatchObject({
            duration: 0,
            pressScale: 1,
        });

        vi.unstubAllGlobals();
    });
});
