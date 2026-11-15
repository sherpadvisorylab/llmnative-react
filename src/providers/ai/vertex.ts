// Vertex AI (CR-133): Gemini and Claude on Google Cloud, paid on the project's account, in the location the
// project picks. No API key: a Google access token (from a service account, the identity of the server, or the
// proxy of the app). Browser-safe: the ways to get a token on a server are in `./vertexAuth.ts`.

import { proxyFetch } from '../proxy/core';
import { LLM_LOG_ID_HEADER } from '../proxy/logHeader';
import { anthropicMessagesBody, parseAnthropicResponse } from './anthropic';
import { geminiRequestBody, parseGeminiResponse } from './gemini';
import type { AIDataRegion } from './AIProvider';
import type { AIProviderDefinition, AIDefinitionCompleteRequest } from './shared';

/** Where Vertex AI runs: `eu` or `us` (multi-region, data kept there), `global` (no guarantee), or a region (`europe-west4`). */
export type VertexLocation = 'eu' | 'us' | 'global' | (string & {});

export type VertexProviderOptions = {
    projectId: string;
    location: VertexLocation;
    defaultModel?: string;
    /**
     * The project billed for the calls that list models, sent as `x-goog-user-project`. Needed with the
     * credentials of a person (gcloud's application default credentials); a service account bills its own
     * project. `true`: the `projectId`.
     */
    quotaProject?: string | boolean;
};

const LOCATION_PATTERN = /^(?:eu|us|global|[a-z]+-[a-z]+\d+)$/;
const PROJECT_PATTERN = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/;

/** The host of a location: the multi-region endpoints (`eu`, `us`) are `aiplatform.<loc>.rep.googleapis.com`. */
export function vertexHost(location: VertexLocation): string {
    if (location === 'global') return 'aiplatform.googleapis.com';
    if (location === 'eu' || location === 'us') return `aiplatform.${location}.rep.googleapis.com`;
    return `${location}-aiplatform.googleapis.com`;
}

/** Where a location keeps the data: its multi-region, `global` (no guarantee), or the region itself. */
export function vertexDataRegion(location: VertexLocation): AIDataRegion {
    if (location === 'eu' || location.startsWith('europe-')) return 'eu';
    if (location === 'us' || location.startsWith('us-')) return 'us';
    return location;
}

/** Why a Vertex AI call failed, by its status: never the prompt, the answer or the token. */
export type VertexAIErrorCode = 'unauthorized' | 'forbidden' | 'not-found' | 'quota' | 'invalid' | 'unavailable';

export class VertexAIError extends Error {
    constructor(readonly code: VertexAIErrorCode, readonly status: number | undefined, message: string) {
        super(`Vertex AI: ${message}`);
        this.name = 'VertexAIError';
    }
}

const errorCode = (status: number): VertexAIErrorCode => (
    status === 401 ? 'unauthorized'
        : status === 403 ? 'forbidden'
        : status === 404 ? 'not-found'
        : status === 429 ? 'quota'
        : status >= 400 && status < 500 ? 'invalid'
        : 'unavailable'
);

/** The safe text of an error answer of Google: its status word and message, cut, no request data. */
const googleMessage = (body: unknown): string => {
    const error = (body as { error?: { status?: string; message?: string } } | undefined)?.error
        ?? (Array.isArray(body) ? (body[0] as { error?: { status?: string; message?: string } })?.error : undefined);
    const text = [error?.status, error?.message].filter(Boolean).join(': ');
    return text.slice(0, 300);
};

type VertexCall = { method?: 'GET' | 'POST'; body?: unknown; signal?: AbortSignal; logId?: string; userProject?: string };

async function vertexFetch(url: string, token: string, { method = 'GET', body, signal, logId, userProject }: VertexCall = {}): Promise<any> {
    let response: Response;
    try {
        response = await proxyFetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                ...(userProject ? { 'x-goog-user-project': userProject } : {}),
                ...(logId ? { [LLM_LOG_ID_HEADER]: logId } : {}),
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            signal,
        });
    } catch (error) {
        if ((error as Error)?.name === 'AbortError') throw error;
        throw new VertexAIError('unavailable', undefined, 'the request did not reach Google (network or proxy)');
    }
    const text = await response.text();
    let json: unknown;
    try {
        json = text ? JSON.parse(text) : undefined;
    } catch {
        json = undefined;
    }
    if (!response.ok) {
        const detail = googleMessage(json);
        throw new VertexAIError(errorCode(response.status), response.status, `HTTP ${response.status}${detail ? ` ${detail}` : ''}`);
    }
    return json;
}

/** The models of the catalog that answer text: no images, speech, embeddings or live audio. */
const TEXT_GEMINI = /^gemini-/;
const NOT_TEXT = /(image|tts|embedding|transcribe|live|audio|banana|omni|translate|veo|imagen)/;
const TEXT_CLAUDE = /^claude-/;

/** Claude models answer through Anthropic's Messages format (`rawPredict`); the others through `generateContent`. */
export const isVertexClaudeModel = (model: string) => TEXT_CLAUDE.test(model);

export const VERTEX_CREDENTIAL_FIELDS: NonNullable<AIProviderDefinition['credentialFields']> = [
    { key: 'projectId', label: 'Project ID', type: 'text', placeholder: 'my-project' },
    { key: 'location', label: 'Location', type: 'text', placeholder: 'eu' },
    { key: 'serviceAccount', label: 'Service account (JSON)', type: 'password' },
];

/**
 * The definition of Vertex AI for one project and location (CR-133). Its "key" is an access token: give the
 * adapter a function that returns a fresh one (`createVertexAIProvider` on a server), or a server-credential
 * placeholder the app's proxy turns into one (CR-102).
 */
export function createVertexProviderDefinition({ projectId, location, defaultModel, quotaProject }: VertexProviderOptions): AIProviderDefinition {
    const project = projectId.trim();
    const where = location.trim();
    if (!PROJECT_PATTERN.test(project)) throw new Error(`Vertex AI: "${project}" is not a Google Cloud project id`);
    if (!LOCATION_PATTERN.test(where)) throw new Error(`Vertex AI: "${where}" is not a location (eu, us, global or a region such as europe-west4)`);
    const base = `https://${vertexHost(where)}`;
    const userProject = quotaProject === true ? project : quotaProject || undefined;
    const modelUrl = (publisher: 'google' | 'anthropic', model: string, verb: string) =>
        `${base}/v1/projects/${project}/locations/${where}/publishers/${publisher}/models/${encodeURIComponent(model)}:${verb}`;

    const listPublisher = async (token: string, publisher: 'google' | 'anthropic'): Promise<string[]> => {
        const names: string[] = [];
        let pageToken = '';
        for (let page = 0; page < 10; page += 1) {
            const response = await vertexFetch(`${base}/v1beta1/publishers/${publisher}/models?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`, token, { userProject });
            for (const entry of (response?.publisherModels ?? []) as Array<{ name?: string }>) {
                const id = entry.name?.split('/').pop();
                if (id) names.push(id);
            }
            pageToken = response?.nextPageToken ?? '';
            if (!pageToken) break;
        }
        return names;
    };

    return {
        id: 'vertex',
        label: 'Vertex AI',
        description: 'Gemini and Claude on Google Cloud, in the location you pick (eu keeps the data in the EU).',
        configKey: 'vertex',
        requiredConfigKeys: ['ai.vertex.projectId', 'ai.vertex.location'],
        defaultModel: defaultModel ?? 'gemini-3.5-flash',
        fallbackModels: [defaultModel ?? 'gemini-3.5-flash'],
        dashboardUrl: 'https://console.cloud.google.com/vertex-ai',
        credentialsHint: 'Google Cloud → IAM → a service account with the role Vertex AI User → Keys → JSON. On Google Cloud itself the identity of the server is enough.',
        credentialFields: VERTEX_CREDENTIAL_FIELDS,
        capabilities: { supportsTemperature: true, supportsVision: true, supportsDocuments: true },
        structuredOutput: 'native',
        dataRegion: vertexDataRegion(where),
        cacheKey: `vertex:${project}:${where}`,
        discoverModels: async (token) => {
            const [google, anthropic] = await Promise.all([
                listPublisher(token, 'google'),
                listPublisher(token, 'anthropic').catch(() => [] as string[]),
            ]);
            return [
                ...google.filter((model) => TEXT_GEMINI.test(model) && !NOT_TEXT.test(model)),
                ...anthropic.filter((model) => TEXT_CLAUDE.test(model)),
            ].sort();
        },
        validateApiKey: async (token) => {
            try {
                await listPublisher(token, 'google');
                return { valid: true };
            } catch (error) {
                return { valid: false, error: error instanceof Error ? error.message : String(error) };
            }
        },
        complete: async (token, request: AIDefinitionCompleteRequest) => {
            if (isVertexClaudeModel(request.model)) {
                const { body, structured } = anthropicMessagesBody(request);
                const response = await vertexFetch(modelUrl('anthropic', request.model, 'rawPredict'), token, {
                    method: 'POST',
                    body: { anthropic_version: 'vertex-2023-10-16', ...body },
                    signal: request.signal,
                    logId: request.logId,
                });
                return parseAnthropicResponse(response, structured);
            }
            const response = await vertexFetch(modelUrl('google', request.model, 'generateContent'), token, {
                method: 'POST',
                body: geminiRequestBody(request),
                signal: request.signal,
                logId: request.logId,
            });
            return parseGeminiResponse(response);
        },
    };
}
