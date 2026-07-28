import { Prompt } from '../../conf/Prompt';
import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import { PromptUtils } from '../../libs/promptUtils';
import { LLM_LOG_ID_HEADER } from '../proxy/logHeader';
import type { AIProviderDefinition } from './shared';
import { createBrowserTransportError } from './shared';
import { toOpenAITool, toOpenAIMessages, parseOpenAIResponse } from './openaiCompatible';

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
    capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
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
        // Stesso wire format OpenAI Chat Completions dell'endpoint Zen (vedi
        // isChatCompletionsModel sopra) — stesso trattamento allegati di openaiCompatible.ts,
        // mai duplicato a mano: prima di questa correzione request.attachments veniva
        // silenziosamente ignorato, il file allegato non arrivava mai al modello.
        const attachments = request.attachments ?? [];
        const userContent = attachments.length > 0
            ? attachments.map((a) => {
                if (a.mimeType.startsWith('image/')) {
                  return { type: 'image_url' as const, image_url: { url: `data:${a.mimeType};base64,${a.base64}` } };
                }
                if (PromptUtils.isTextAttachment(a.mimeType)) {
                  return { type: 'text' as const, text: `[File: ${a.name}]\n${PromptUtils.decodeBase64Text(a.base64)}` };
                }
                return { type: 'text' as const, text: `[File attached: ${a.name} (${a.mimeType})]` };
              }).concat({ type: 'text' as const, text: request.prompt })
            : request.prompt;

        const response = await fetchJson(OPENCODE_CHAT_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                ...(request.logId ? { [LLM_LOG_ID_HEADER]: request.logId } : {}),
            },
            body: {
                model: request.model,
                messages: [
                    ...(request.role ? [{ role: 'system', content: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) }] : []),
                    ...(request.history ?? []).flatMap(toOpenAIMessages),
                    ...(request.prompt ? [{ role: 'user', content: userContent }] : []),
                ],
                ...(request.tools?.length ? { tools: request.tools.map(toOpenAITool) } : {}),
                ...(typeof request.temperature === 'number' ? { temperature: request.temperature } : {}),
            },
            signal: request.signal,
        }, proxyFetch);

        if (!response) {
            throw createBrowserTransportError('OpenCode');
        }

        return parseOpenAIResponse(response);
    },
};
