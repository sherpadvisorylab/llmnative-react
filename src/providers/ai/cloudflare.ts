import { fetchJson } from '../../libs/fetch';
import { proxyFetch } from '../proxy';
import type { ProviderDescriptor } from '../ProviderDescriptor';
import type { AIConversationTurn } from './AIProvider';
import { extractProviderError, type AIProviderDefinition } from './shared';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';
const MODELS_PAGE_SIZE = 100;
/** Safety cap on catalog pagination — the text-generation catalog is ~30 entries today. */
const MODELS_MAX_PAGES = 5;
/** Listed under 'Text Generation' but are safety classifiers, not chat models (e.g. llama-guard-3-8b). */
const NON_CHAT_MODEL_PATTERN = /-guard-/;

const LABEL = 'Cloudflare Workers AI';
const DESCRIPTION = 'Open-weight models (Llama, GPT-OSS, Qwen, Gemma, GLM…) with a free daily allowance.';
const DASHBOARD_URL = 'https://dash.cloudflare.com/?to=/:account/ai/workers-ai';
const CREDENTIALS_HINT = 'Cloudflare dashboard → AI → Workers AI → REST API: create a Workers AI API token and copy the Account ID.';
const CREDENTIAL_FIELDS: ProviderDescriptor['credentialFields'] = [
    { key: 'apiKey',    label: 'API Token',  type: 'password' },
    { key: 'accountId', label: 'Account ID', type: 'text', placeholder: '32-character account id' },
];

type CloudflareModelProperty = { property_id?: string; value?: unknown };
type CloudflareModel = { name?: string; properties?: CloudflareModelProperty[] };
type CloudflareSearchResponse = { success?: boolean; result?: CloudflareModel[]; errors?: unknown[] };

export type CloudflareProviderOptions = {
    accountId: string;
    defaultModel?: string;
    /** Keep models flagged `require_workers_paid` in discovery (they fail with 403 on the Free plan). */
    includePaidModels?: boolean;
};

const hasProperty = (model: CloudflareModel, propertyId: string) =>
    (model.properties ?? []).some((p) => p.property_id === propertyId && String(p.value) === 'true');

/** Workers AI rejects `content: null` on an assistant turn that carries tool_calls (error 5006
 * on llama-3.3, gpt-oss, qwen3 — verified live), while every model accepts `''`. The shared
 * OpenAI mapper sends null (correct for OpenAI), so normalize here instead of changing it. */
const withEmptyAssistantContent = (history?: AIConversationTurn[]) =>
    history?.map((turn) => (turn.role === 'assistant' && !turn.content ? { ...turn, content: '' } : turn));

/** Built per account: the account id is part of every Workers AI URL, while
 * AIProviderDefinition.complete()/discoverModels() only ever receive the API token. */
export const createCloudflareProviderDefinition = ({
    accountId,
    defaultModel = '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    includePaidModels = false,
}: CloudflareProviderOptions): AIProviderDefinition => {
    const accountUrl = `${CLOUDFLARE_API_BASE}/accounts/${encodeURIComponent(accountId.trim())}`;
    const searchUrl = `${accountUrl}/ai/models/search`;

    const searchModels = (apiKey: string, page: number, perPage: number): Promise<CloudflareSearchResponse | null> => {
        const params = new URLSearchParams({
            task: 'Text Generation',
            hide_experimental: 'true',
            page: String(page),
            per_page: String(perPage),
        });
        return fetchJson(`${searchUrl}?${params}`, { headers: { Authorization: `Bearer ${apiKey}` } }, proxyFetch);
    };

    const base = createOpenAICompatibleProviderDefinition({
        id: 'cloudflare',
        label: LABEL,
        description: DESCRIPTION,
        configKey: 'cloudflare',
        requiredConfigKeys: ['ai.cloudflare.apiToken', 'ai.cloudflare.accountId'],
        defaultModel,
        fallbackModels: [defaultModel, '@cf/openai/gpt-oss-120b', '@cf/qwen/qwen3-30b-a3b-fp8', '@cf/meta/llama-4-scout-17b-16e-instruct']
            .filter((model, index, all) => all.indexOf(model) === index),
        baseUrl: `${accountUrl}/ai/v1`,
        dashboardUrl: DASHBOARD_URL,
        credentialsHint: CREDENTIALS_HINT,
        // /ai/v1/models does not exist (405): one catalog call checks token, account id and
        // the Workers AI permission together — tokens/verify would only check the token.
        validateApiKey: async (apiKey) => {
            try {
                const response = await searchModels(apiKey, 1, 1);
                if (response === null) return { valid: false, error: 'Nessuna risposta dal server (CORS o proxy non attivo)' };
                if (response.success) return { valid: true };
                return { valid: false, error: extractProviderError(response) };
            } catch (err) {
                return { valid: false, error: extractProviderError(err) };
            }
        },
    });

    return {
        ...base,
        credentialFields: CREDENTIAL_FIELDS,
        discoverModels: async (apiKey) => {
            const models: string[] = [];
            for (let page = 1; page <= MODELS_MAX_PAGES; page++) {
                const response = await searchModels(apiKey, page, MODELS_PAGE_SIZE);
                const result = Array.isArray(response?.result) ? response.result : [];
                result
                    .filter((model) => !NON_CHAT_MODEL_PATTERN.test(model.name ?? ''))
                    .filter((model) => includePaidModels || !hasProperty(model, 'require_workers_paid'))
                    .forEach((model) => { if (model.name) models.push(model.name); });
                if (result.length < MODELS_PAGE_SIZE) break;
            }
            return models;
        },
        complete: (apiKey, request) => base.complete(apiKey, {
            ...request,
            history: withEmptyAssistantContent(request.history),
        }),
    };
};

/** "Connect this provider" metadata — the working definition needs an account id, so (like
 * openai-compatible) it is built only once one is configured; see createAIProviderRegistry. */
export const CLOUDFLARE_PROVIDER_DESCRIPTOR: ProviderDescriptor = {
    id: 'cloudflare',
    label: LABEL,
    description: DESCRIPTION,
    credentialFields: CREDENTIAL_FIELDS,
    credentialsUrl: DASHBOARD_URL,
    credentialsHint: CREDENTIALS_HINT,
};
