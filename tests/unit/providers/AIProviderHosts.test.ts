import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(async () => ({ data: [] })),
}));

import { AI_PROVIDER_DEFINITIONS, createCloudflareProviderDefinition } from '../../../src/providers/ai';
import { aiProviderHosts } from '../../../src/providers/ai/AIProvider';
import * as fetchLib from '../../../src/libs/fetch';

const hostOfLastCall = (): string => {
    const url = String(vi.mocked(fetchLib.fetchJson).mock.calls.at(-1)?.[0]);
    return new URL(url).hostname;
};

beforeEach(() => vi.clearAllMocks());

describe('aiProviderHosts', () => {
    it('covers the discovery endpoint host of every built-in adapter', async () => {
        for (const definition of AI_PROVIDER_DEFINITIONS) {
            await definition.discoverModels('test-key');
            const host = hostOfLastCall();
            expect(aiProviderHosts[definition.id], `provider "${definition.id}" (${host})`).toContain(host);
        }
    });

    it('covers the Cloudflare Workers AI host', async () => {
        const cloudflare = createCloudflareProviderDefinition({ accountId: 'acc-id' });
        await cloudflare.discoverModels('test-key');

        expect(aiProviderHosts.cloudflare).toContain(hostOfLastCall());
    });
});
