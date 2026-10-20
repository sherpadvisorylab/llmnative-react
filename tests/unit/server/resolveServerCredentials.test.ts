import { describe, expect, it, vi } from 'vitest';

import { resolveServerCredentials } from '../../../src/server';
import { buildServerCredentialPlaceholder, aiProviderHosts } from '../../../src/providers/ai/AIProvider';

const credentials: Record<string, string> = {
    't1:openai': 'sk-openai-real',
    't1:gemini': 'gemini-real-key',
    't1:cloudflare': 'cloudflare-token',
    't1:openai-compatible': 'gateway-real-key',
};

const lookup = (scope: string, provider: string) => credentials[`${scope}:${provider}`];

describe('resolveServerCredentials', () => {
    it('replaces the placeholder in an Authorization header for the provider host', () => {
        const placeholder = buildServerCredentialPlaceholder('t1', 'openai');
        const { url, headers } = resolveServerCredentials(
            { url: 'https://api.openai.com/v1/chat/completions', headers: { Authorization: `Bearer ${placeholder}` } },
            lookup,
        );

        expect(headers.get('authorization')).toBe('Bearer sk-openai-real');
        expect(url).toBe('https://api.openai.com/v1/chat/completions');
    });

    it('replaces the Gemini key carried in the query string', () => {
        const placeholder = buildServerCredentialPlaceholder('t1', 'gemini');
        const { url } = resolveServerCredentials(
            { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${placeholder}` },
            lookup,
        );

        expect(url).not.toContain(placeholder);
        expect(new URL(url).searchParams.get('key')).toBe('gemini-real-key');
    });

    it('replaces the Cloudflare account id carried in the path', () => {
        const placeholder = buildServerCredentialPlaceholder('t1', 'cloudflare');
        const { url } = resolveServerCredentials(
            { url: `https://api.cloudflare.com/client/v4/accounts/${placeholder}/ai/v1/chat/completions` },
            lookup,
        );

        expect(url).not.toContain(placeholder);
        expect(new URL(url).pathname).toContain('/accounts/cloudflare-token/ai/');
    });

    it('replaces the placeholder for a whitelisted openai-compatible baseUrl', () => {
        const placeholder = buildServerCredentialPlaceholder('t1', 'openai-compatible');
        const { headers } = resolveServerCredentials(
            { url: 'https://gateway.example.com/v1/models', headers: { Authorization: `Bearer ${placeholder}` } },
            lookup,
            { hosts: { ...aiProviderHosts, 'openai-compatible': ['gateway.example.com'] } },
        );

        expect(headers.get('authorization')).toBe('Bearer gateway-real-key');
    });

    it('refuses a target outside the provider hosts', () => {
        const placeholder = buildServerCredentialPlaceholder('t1', 'openai');
        expect(() => resolveServerCredentials(
            { url: 'https://evil.example.com/v1/chat/completions', headers: { Authorization: `Bearer ${placeholder}` } },
            lookup,
        )).toThrow(/refusing to send "openai" credentials/);
    });

    it('refuses an unknown provider', () => {
        const placeholder = buildServerCredentialPlaceholder('t1', 'not-a-provider');
        expect(() => resolveServerCredentials(
            { url: 'https://api.openai.com/v1/chat/completions', headers: { Authorization: `Bearer ${placeholder}` } },
            lookup,
        )).toThrow(/unknown server-credential provider/);
    });

    it('throws when no credential is configured for the scope/provider', () => {
        const placeholder = buildServerCredentialPlaceholder('missing-scope', 'openai');
        expect(() => resolveServerCredentials(
            { url: 'https://api.openai.com/v1/chat/completions', headers: { Authorization: `Bearer ${placeholder}` } },
            lookup,
        )).toThrow(/no credential configured/);
    });

    it('leaves real values untouched', () => {
        const { headers, url } = resolveServerCredentials(
            { url: 'https://api.openai.com/v1/models', headers: { Authorization: 'Bearer real-key' } },
            lookup,
        );

        expect(headers.get('authorization')).toBe('Bearer real-key');
        expect(url).toBe('https://api.openai.com/v1/models');
    });

    it('rejects a relative URL', () => {
        expect(() => resolveServerCredentials({ url: '/api/proxy' }, lookup)).toThrow(/not an absolute URL/);
    });

    it('does not call the lookup when there is nothing to resolve', () => {
        const spy = vi.fn(lookup);
        resolveServerCredentials(
            { url: 'https://api.openai.com/v1/models', headers: { 'x-test': 'plain' } },
            spy,
        );
        expect(spy).not.toHaveBeenCalled();
    });
});
