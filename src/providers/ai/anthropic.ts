import { fetchJson } from '../../libs/fetch';
import { Prompt } from '../../conf/Prompt';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition } from './shared';
import { parseTextResponse } from './shared';

const ANTHROPIC_MODELS_URL = 'https://api.anthropic.com/v1/models';
const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';

export const ANTHROPIC_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'anthropic',
    label: 'Anthropic',
    description: 'Claude models via the Anthropic API.',
    configKey: 'anthropicApiKey',
    defaultModel: 'claude-sonnet-4-0',
    fallbackModels: ['claude-sonnet-4-0', 'claude-opus-4-1', 'claude-3-7-sonnet-latest'],
    dashboardUrl: 'https://console.anthropic.com/settings/keys',
    credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password' }],
    capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
    discoverModels: async (apiKey) => {
        const response = await fetchJson(ANTHROPIC_MODELS_URL, {
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
        }, proxyFetch);
        return Array.isArray(response?.data)
            ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
            : [];
    },
    complete: async (apiKey, request) => {
        const attachments = request.attachments ?? [];
        const userContent = attachments.length > 0
            ? [
                ...attachments.map((a) => a.mimeType.startsWith('image/')
                    ? { type: 'image', source: { type: 'base64', media_type: a.mimeType, data: a.base64 } }
                    : { type: 'document', source: { type: 'base64', media_type: a.mimeType, data: a.base64 } }
                ),
                { type: 'text', text: request.prompt },
              ]
            : request.prompt;

        const response = await fetchJson(ANTHROPIC_MESSAGES_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: {
                model: request.model,
                max_tokens: 4096,
                ...(request.role ? { system: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) } : {}),
                messages: [{ role: 'user', content: userContent }],
                ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
            },
        }, proxyFetch);
        return parseTextResponse(response?.content);
    },
};
