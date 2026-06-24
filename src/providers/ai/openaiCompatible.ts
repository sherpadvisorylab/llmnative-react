import { Prompt } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition, BuiltInAIProviderId } from './shared';
import { parseTextResponse, createBrowserTransportError, extractProviderError } from './shared';

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
    dashboardUrl?: string;
    /** Override the default validateApiKey when the models endpoint is public or uses a non-standard error format. */
    validateApiKey?: AIProviderDefinition['validateApiKey'];
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
    dashboardUrl,
    validateApiKey: validateApiKeyOverride,
}: OpenAICompatibleDefinitionOptions): AIProviderDefinition => {
    const normalizedBaseUrl = trimTrailingSlash(baseUrl);
    const resolvedModelsUrl = modelsUrl || `${normalizedBaseUrl}/models`;
    const resolvedChatUrl = chatCompletionsUrl || `${normalizedBaseUrl}/chat/completions`;

    const defaultValidateApiKey: AIProviderDefinition['validateApiKey'] = async (apiKey) => {
        try {
            const response = await fetchJson(resolvedModelsUrl, {
                headers: { Authorization: `Bearer ${apiKey}` },
            }, proxyFetch);
            if (response === null) return { valid: false, error: 'Nessuna risposta dal server (CORS o proxy non attivo)' };
            // Some providers (e.g. Mistral) return { message: "Unauthorized" } instead of { error: { message } }
            if (typeof response?.message === 'string' && !Array.isArray(response?.data)) {
                return { valid: false, error: response.message };
            }
            return { valid: true };
        } catch (err) {
            return { valid: false, error: extractProviderError(err) };
        }
    };

    return {
        id,
        label,
        configKey,
        requiredConfigKeys,
        defaultModel,
        fallbackModels,
        dashboardUrl,
        capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: false },
        validateApiKey: validateApiKeyOverride ?? defaultValidateApiKey,
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
            const imageAttachments = (request.attachments ?? []).filter((a) => a.mimeType.startsWith('image/'));
            const userContent = imageAttachments.length > 0
                ? [
                    ...imageAttachments.map((a) => ({
                        type: 'image_url' as const,
                        image_url: { url: `data:${a.mimeType};base64,${a.base64}` },
                    })),
                    { type: 'text' as const, text: request.prompt },
                  ]
                : request.prompt;

            const response = await fetchJson(resolvedChatUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                body: {
                    model: request.model,
                    messages: [
                        ...(request.role ? [{ role: 'system', content: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) }] : []),
                        { role: 'user', content: userContent },
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
