import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { AIModelPricing } from './AIProvider';
import { extractProviderError } from './shared';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

/** `/models` prices are USD per token as decimal strings; `-1` marks routers with a variable
 * price (openrouter/auto…), which count as "price not found". */
export const parseOpenRouterPricing = (pricing: unknown): AIModelPricing | undefined => {
    if (!pricing || typeof pricing !== 'object') return undefined;
    const { prompt, completion } = pricing as { prompt?: unknown; completion?: unknown };
    const input = Number(prompt);
    const output = Number(completion);
    if (prompt === undefined || completion === undefined || !Number.isFinite(input) || !Number.isFinite(output) || input < 0 || output < 0) {
        return undefined;
    }
    // Per token → per 1M tokens, rounded away from float noise (0.000003 * 1e6 = 2.9999999999999996).
    const perMillion = (value: number) => Math.round(value * 1e12) / 1e6;
    return { input: perMillion(input), output: perMillion(output), currency: 'USD', source: 'provider' };
};

export const OPENROUTER_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'openrouter',
    label: 'OpenRouter',
    description: 'Unified access to many model providers through one API.',
    configKey: 'openRouterApiKey',
    defaultModel: 'openai/gpt-4',
    fallbackModels: ['openai/gpt-4', 'openai/gpt-5-nano', 'anthropic/claude-3.7-sonnet'],
    baseUrl: 'https://openrouter.ai/api/v1',
    dashboardUrl: 'https://openrouter.ai/settings/keys',
    credentialsHint: 'OpenRouter → Settings → API Keys → Create Key.',
    mapModelEntry: (entry) => (typeof entry.id === 'string'
        ? { model: entry.id, pricing: parseOpenRouterPricing(entry.pricing) }
        : undefined),
    // OpenRouter's /models endpoint is public — use /auth/key which requires a valid key
    validateApiKey: async (apiKey) => {
        try {
            const response = await fetchJson('https://openrouter.ai/api/v1/auth/key', {
                headers: { Authorization: `Bearer ${apiKey}` },
            }, proxyFetch);
            if (response === null) return { valid: false, error: 'Nessuna risposta dal server (CORS o proxy non attivo)' };
            if (response?.data?.label !== undefined || response?.data?.usage !== undefined) return { valid: true };
            if (response?.error) return { valid: false, error: extractProviderError(response) };
            return { valid: false, error: 'Chiave non riconosciuta da OpenRouter' };
        } catch (err) {
            return { valid: false, error: extractProviderError(err) };
        }
    },
});
