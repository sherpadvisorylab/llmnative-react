import { fetchJson } from '../../libs/fetch';
import { Prompt } from '../../conf/Prompt';
import { proxyFetch } from '../proxy';
import type { AIProviderDefinition } from './shared';

const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_CONTENT_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GEMINI_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'gemini',
    label: 'Gemini',
    configKey: 'geminiApiKey',
    defaultModel: 'gemini-2.5-pro',
    fallbackModels: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
    capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
    discoverModels: async (apiKey) => {
        const response = await fetchJson(`${GEMINI_MODELS_URL}?key=${apiKey}`, null, proxyFetch);
        return Array.isArray(response?.models)
            ? response.models
                .map((entry: { name?: string }) => entry.name?.replace(/^models\//, ''))
                .filter(Boolean)
            : [];
    },
    complete: async (apiKey, request) => {
        const attachments = request.attachments ?? [];
        const parts = [
            ...attachments.map((a) => ({ inline_data: { mime_type: a.mimeType, data: a.base64 } })),
            { text: request.prompt },
        ];

        const response = await fetchJson(`${GEMINI_CONTENT_URL}/${request.model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            body: {
                contents: [{ parts }],
                ...(request.role ? { systemInstruction: { parts: [{ text: Prompt.parseRole(request.role, request as unknown as import("../../conf/Prompt").PromptVariables) }] } } : {}),
                generationConfig: typeof request.temperature === 'number'
                    ? { temperature: request.temperature }
                    : undefined,
            },
        }, proxyFetch);
        const responseParts = response?.candidates?.[0]?.content?.parts;
        return Array.isArray(responseParts)
            ? responseParts.map((part: unknown) => (part && typeof part === 'object' && 'text' in part ? String((part as { text: unknown }).text) : '')).join('\n').trim() || null
            : null;
    },
};
