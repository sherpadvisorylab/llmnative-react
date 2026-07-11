import { Prompt } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition } from './shared';
import { parseTextResponse, createBrowserTransportError } from './shared';

const OPENCODE_MODELS_URL = 'https://opencode.ai/zen/v1/models';
const OPENCODE_CHAT_URL = 'https://opencode.ai/zen/v1/chat/completions';

const OPENCODE_FALLBACK_MODELS = [
    'big-pickle',
    'deepseek-v4-flash-free',
    'glm-5',
    'glm-5.1',
    'grok-build-0.1',
    'kimi-k2.5',
    'kimi-k2.6',
    'mimo-v2.5-free',
    'minimax-m2.5',
    'minimax-m2.7',
    'nemotron-3-super-free',
];

type OpenCodeModelEntry = {
    id?: string;
    endpoint?: string;
    ai_sdk_package?: string;
    aiSdkPackage?: string;
};

const isChatCompletionsModel = (entry: OpenCodeModelEntry) => {
    const endpoint = entry.endpoint || '';
    const sdkPackage = entry.ai_sdk_package || entry.aiSdkPackage || '';

    return endpoint.includes('/chat/completions')
        || sdkPackage.includes('openai-compatible');
};

export const OPENCODE_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'opencode',
    label: 'OpenCode',
    description: 'OpenCode Zen — a curated set of coding-focused models.',
    configKey: 'openCodeApiKey',
    defaultModel: 'deepseek-v4-flash-free',
    fallbackModels: OPENCODE_FALLBACK_MODELS,
    dashboardUrl: 'https://opencode.ai',
    credentialsHint: 'OpenCode Zen dashboard → API Keys → Create Key.',
    credentialFields: [{ key: 'apiKey', label: 'API Key', type: 'password' }],
    capabilities: { supportsTemperature: true },
    discoverModels: async (apiKey) => {
        const response = await fetchJson(OPENCODE_MODELS_URL, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        }, proxyFetch);

        const items = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.models)
                ? response.models
                : Array.isArray(response)
                    ? response
                    : [];

        return items
            .filter((entry: OpenCodeModelEntry) => isChatCompletionsModel(entry))
            .map((entry: OpenCodeModelEntry) => entry.id)
            .filter((value: unknown): value is string => typeof value === 'string' && value.length > 0);
    },
    complete: async (apiKey, request) => {
        const response = await fetchJson(OPENCODE_CHAT_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: {
                model: request.model,
                messages: [
                    ...(request.role ? [{ role: 'system', content: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) }] : []),
                    { role: 'user', content: request.prompt },
                ],
                ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
            },
        }, proxyFetch);

        if (!response) {
            throw createBrowserTransportError('OpenCode');
        }

        return parseTextResponse(response?.choices?.[0]?.message?.content);
    },
};
