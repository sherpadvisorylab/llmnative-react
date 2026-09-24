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

const OPENCODE_DEFAULT_MODEL = 'deepseek-v4.1-flash';

/** Ids present in the live `/zen/v1/models` listing on 2026-09-24, free-tier ones excluded. */
const OPENCODE_FALLBACK_MODELS = [
    OPENCODE_DEFAULT_MODEL,
    'deepseek-v4-pro',
    'glm-5.3',
    'glm-5.3-flash',
    'grok-build-0.1',
    'kimi-k3',
    'minimax-m3',
    'qwen3.8-flash',
];

/** Zen's free tier answers every API call with "OpenCode's free tier can only be used from
 * within OpenCode" (verified live 2026-09-24 on all of them), so offering these models in a
 * picker only leads to a failed run. The listing carries no flag for it: free models are the
 * `-free` suffixed ids plus `big-pickle` (0/0 on models.dev). */
const OPENCODE_FREE_TIER_PATTERN = /-free$/;
const OPENCODE_FREE_TIER_IDS = new Set(['big-pickle']);

export const isOpenCodeFreeTierModel = (id: string) =>
    OPENCODE_FREE_TIER_PATTERN.test(id) || OPENCODE_FREE_TIER_IDS.has(id);

type OpenCodeModelEntry = {
    id?: string;
};

export const OPENCODE_PROVIDER_DEFINITION: AIProviderDefinition = {
    id: 'opencode',
    label: 'OpenCode',
    description: 'OpenCode Zen — a curated set of coding-focused models.',
    configKey: 'openCodeApiKey',
    defaultModel: OPENCODE_DEFAULT_MODEL,
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

        // Every model `/zen/v1/models` lists is already invokable through the one Zen gateway
        // endpoint above (OPENCODE_CHAT_URL) — Zen normalizes all of them to the same
        // OpenAI-compatible chat-completions wire format regardless of the underlying provider
        // (xAI, NVIDIA, MiniMax, ...), so there is no real per-model compatibility check to make
        // here. A previous filter tried to check `entry.endpoint`/`entry.ai_sdk_package`, fields
        // this endpoint's response never actually carries (verified against the live response —
        // every entry is just `{id, object, created, owned_by}`) — it silently matched nothing,
        // so `discoverModels` always returned an empty array and every caller fell back to
        // `OPENCODE_FALLBACK_MODELS` unconditionally (see `AIProvider.getCapabilities` in
        // shared.ts: falls back only when `discovered.length === 0`). Real discovery never
        // actually ran; this list was always the static fallback in practice.
        return items
            .map((entry: OpenCodeModelEntry) => entry.id)
            .filter((value: unknown): value is string => typeof value === 'string' && value.length > 0)
            .filter((id: string) => !isOpenCodeFreeTierModel(id));
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
