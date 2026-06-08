import { Prompt } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition, BuiltInAIProviderId } from './shared';
import { parseTextResponse, createBrowserTransportError } from './shared';

type OpenAICompatibleDefinitionOptions = {
    id: BuiltInAIProviderId;
    label: string;
    configKey: string;
    requiredConfigKeys?: string[];
    defaultModel: string;
    fallbackModels: string[];
    baseUrl: string;
    modelsUrl?: string;
    chatCompletionsUrl?: string;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const createOpenAICompatibleProviderDefinition = ({
    id,
    label,
    configKey,
    requiredConfigKeys,
    defaultModel,
    fallbackModels,
    baseUrl,
    modelsUrl,
    chatCompletionsUrl,
}: OpenAICompatibleDefinitionOptions): AIProviderDefinition => {
    const normalizedBaseUrl = trimTrailingSlash(baseUrl);
    const resolvedModelsUrl = modelsUrl || `${normalizedBaseUrl}/models`;
    const resolvedChatUrl = chatCompletionsUrl || `${normalizedBaseUrl}/chat/completions`;

    return {
        id,
        label,
        configKey,
        requiredConfigKeys,
        defaultModel,
        fallbackModels,
        capabilities: { supportsTemperature: true },
        discoverModels: async (apiKey) => {
            const response = await fetchJson(resolvedModelsUrl, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            }, proxyFetch);
            return Array.isArray(response?.data)
                ? response.data.map((entry: { id?: string }) => entry.id).filter(Boolean)
                : [];
        },
        complete: async (apiKey, request) => {
            const response = await fetchJson(resolvedChatUrl, {
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
                throw createBrowserTransportError(label);
            }

            return parseTextResponse(response?.choices?.[0]?.message?.content);
        },
    };
};
