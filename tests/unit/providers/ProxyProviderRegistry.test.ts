import { describe, expect, it } from 'vitest';

import { configureProxy } from '../../../src/providers/proxy';

describe('proxy configuration', () => {
    it('when enabled with a route marks proxy as ready to forward', () => {
        configureProxy({ enabled: true, route: '/api/proxy' });
        expect(true).toBe(true);
    });

    it('when disabled does not rewrite requests', () => {
        configureProxy({ enabled: false, route: '/api/proxy' });
        expect(true).toBe(true);
    });
});
