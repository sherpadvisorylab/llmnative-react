import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import { extractProviderError } from './shared';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const OPENROUTER_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'openrouter',
    label: 'OpenRouter',
    description: 'Unified access to many model providers through one API.',
    configKey: 'openRouterApiKey',
    defaultModel: 'openai/gpt-4',
    fallbackModels: ['openai/gpt-4', 'openai/gpt-5-nano', 'anthropic/claude-3.7-sonnet'],
    baseUrl: 'https://openrouter.ai/api/v1',
    dashboardUrl: 'https://openrouter.ai/settings/keys',
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
