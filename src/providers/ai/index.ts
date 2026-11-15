import type { AIConfig } from '../../Config';
import type { ProviderDescriptor } from '../ProviderDescriptor';
import type { AIProviderAdapter } from './AIProvider';
import { ANTHROPIC_PROVIDER_DEFINITION } from './anthropic';
import { CLOUDFLARE_PROVIDER_DESCRIPTOR, createCloudflareProviderDefinition } from './cloudflare';
import { DEEPSEEK_PROVIDER_DEFINITION } from './deepseek';
import { GEMINI_PROVIDER_DEFINITION } from './gemini';
import { MISTRAL_PROVIDER_DEFINITION } from './mistral';
import { OPENAI_PROVIDER_DEFINITION } from './openai';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';
import { GLM_PROVIDER_DEFINITION } from './glm';
import { GROQ_PROVIDER_DEFINITION } from './groq';
import { OPENCODE_PROVIDER_DEFINITION } from './opencode';
import { OPENCODE_GO_PROVIDER_DEFINITION } from './opencodeGo';
import { OPENROUTER_PROVIDER_DEFINITION } from './openrouter';
import { getAIModelCatalog, type AICredential, type AIProviderDefinition, type AIModelCatalog, type BuiltInAIProviderId, RuntimeAIProvider } from './shared';
import { serverCredential } from './serverCredentials';
import { createVertexProviderDefinition, VERTEX_CREDENTIAL_FIELDS } from './vertex';

export type {
    AIProviderAdapter, AIKeyValidationResult, AIModelDescriptor, AIModelPricing, AIProviderCapabilities, AIRequestOptions, AIReasoningLevel, AIAttachment,
    AICompleteRequest, AICompleteResult, AIConversationTurn, AIToolDefinition, AIToolCall, AIToolResult,
    AIStructuredOutput, AIStructuredOutputMode, AIUsage, AIDataRegion,
} from './AIProvider';
export { formatAIModelRef, parseAIModelRef, isFreeAIModel, AIOutputError } from './AIProvider';
export { validateJsonSchema, extractJson } from '../../libs/jsonSchema';
export type { JsonSchema, JsonSchemaType } from '../../libs/jsonSchema';
export type { DiscoveredAIModel, AICredential } from './shared';
export { isModelInRegion } from './connections';
export type { AIConnectionStore, AIConnectionsSnapshot, AIConnectionResult, AIConnectionAccount, AIProviderConnectionView, AIConnectionExhausted, AIConnector, AIRegionRule } from './connections';
export type { AIModelCatalog, AIProviderDefinition } from './shared';
export { getAIModelCatalog } from './shared';
export { CLOUDFLARE_PROVIDER_DESCRIPTOR, createCloudflareProviderDefinition } from './cloudflare';
export { createOpenAICompatibleProviderDefinition } from './openaiCompatible';
export { createVertexProviderDefinition, vertexHost, vertexDataRegion, isVertexClaudeModel, VertexAIError, VERTEX_CREDENTIAL_FIELDS } from './vertex';
export type { VertexLocation, VertexProviderOptions, VertexAIErrorCode } from './vertex';
export type { CloudflareProviderOptions } from './cloudflare';
export { AI_PROVIDER_HOSTS, isAIProviderTarget, serverCredential, SERVER_CREDENTIAL_PREFIX } from './serverCredentials';
export type { ServerAIConnection } from './serverCredentials';
export { canonicalModelName, buildModelIdentityIndex, resolveModel, modelOffers, loadModelIdentityIndex } from './modelIdentity';
export type { ModelIdentity, ModelIdentityEntry, ModelIdentityIndex, ResolvedModel, ModelOffer, ModelCost } from './modelIdentity';

export const AI_PROVIDER_DEFINITIONS: AIProviderDefinition[] = [
    OPENAI_PROVIDER_DEFINITION,
    OPENROUTER_PROVIDER_DEFINITION,
    OPENCODE_PROVIDER_DEFINITION,
    OPENCODE_GO_PROVIDER_DEFINITION,
    DEEPSEEK_PROVIDER_DEFINITION,
    GEMINI_PROVIDER_DEFINITION,
    ANTHROPIC_PROVIDER_DEFINITION,
    MISTRAL_PROVIDER_DEFINITION,
    GLM_PROVIDER_DEFINITION,
    GROQ_PROVIDER_DEFINITION,
];

/** Generic "connect this provider" view of an AIProviderDefinition — the shape a CMS/admin
 * UI needs (label, description, credential fields, where to find them), independent of the
 * runtime completion contract (discoverModels/complete) it also carries. */
export const toProviderDescriptor = (definition: AIProviderDefinition): ProviderDescriptor => ({
    id: definition.id,
    label: definition.label,
    description: definition.description ?? '',
    credentialFields: definition.credentialFields ?? [{ key: 'apiKey', label: 'API Key', type: 'password' }],
    credentialsUrl: definition.dashboardUrl,
    credentialsHint: definition.credentialsHint,
});

/** Vertex AI (CR-133): what a "connect" UI asks (project, location, service account). */
export const VERTEX_PROVIDER_DESCRIPTOR: ProviderDescriptor = {
    id: 'vertex',
    label: 'Vertex AI',
    description: 'Gemini and Claude on Google Cloud, in the location you pick (eu keeps the data in the EU).',
    credentialFields: VERTEX_CREDENTIAL_FIELDS,
    credentialsUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts',
    credentialsHint: 'Google Cloud → IAM → a service account with the role Vertex AI User → Keys → JSON.',
};

/** Includes Cloudflare: like openai-compatible its working definition needs a second credential
 * (the account id) before it can be built, but unlike openai-compatible it is a fixed, named
 * vendor — a "connect" UI should list it alongside the others. */
export const AI_PROVIDER_DESCRIPTORS: ProviderDescriptor[] = [
    ...AI_PROVIDER_DEFINITIONS.map(toProviderDescriptor),
    CLOUDFLARE_PROVIDER_DESCRIPTOR,
    VERTEX_PROVIDER_DESCRIPTOR,
];

/** The user-configurable "bring your own endpoint" slot — metadata-only counterpart of the
 * dynamic definition getDynamicAIProviderDefinitions() builds once a baseUrl is actually
 * known. Not part of AI_PROVIDER_DEFINITIONS (there's nothing to build a working adapter
 * from until the user supplies that URL), but a "connect" UI still needs to offer it. */
export const OPENAI_COMPATIBLE_PROVIDER_DESCRIPTOR: ProviderDescriptor = {
    id: 'openai-compatible',
    label: 'OpenAI-compatible',
    description: 'Any OpenAI-compatible endpoint (self-hosted or third-party).',
    credentialFields: [
        { key: 'apiKey',  label: 'API Key',  type: 'password' },
        { key: 'baseUrl', label: 'Base URL', type: 'text', placeholder: 'https://api.example.com/v1' },
    ],
};

const getDynamicAIProviderDefinitions = (aiConfig?: AIConfig): AIProviderDefinition[] => {
    const definitions: AIProviderDefinition[] = [];

    const cloudflareAccountId = aiConfig?.cloudflare?.accountId?.trim();
    if (cloudflareAccountId) {
        definitions.push(createCloudflareProviderDefinition({
            accountId: cloudflareAccountId,
            defaultModel: aiConfig?.cloudflare?.defaultModel?.trim() || undefined,
            includePaidModels: aiConfig?.cloudflare?.includePaidModels,
        }));
    }

    const vertex = aiConfig?.vertex;
    if (vertex?.projectId?.trim() && vertex.location?.trim()) {
        try {
            definitions.push(createVertexProviderDefinition({
                projectId: vertex.projectId,
                location: vertex.location,
                defaultModel: vertex.defaultModel?.trim() || undefined,
            }));
        } catch (error) {
            console.warn('AIProvider:vertex not registered', error);
        }
    }

    const baseUrl = aiConfig?.openAICompatible?.baseUrl?.trim();
    if (!baseUrl) return definitions;

    return [
        ...definitions,
        createOpenAICompatibleProviderDefinition({
            id: 'openai-compatible',
            label: aiConfig?.openAICompatible?.label?.trim() || 'OpenAI-compatible',
            description: 'Any OpenAI-compatible endpoint (self-hosted or third-party).',
            configKey: 'openAICompatible',
            requiredConfigKeys: ['ai.openAICompatible.apiKey', 'ai.openAICompatible.baseUrl'],
            defaultModel: aiConfig?.openAICompatible?.defaultModel?.trim() || 'default',
            fallbackModels: aiConfig?.openAICompatible?.fallbackModels?.filter(Boolean) || ['default'],
            baseUrl,
            modelsUrl: aiConfig?.openAICompatible?.modelsUrl?.trim() || undefined,
            chatCompletionsUrl: aiConfig?.openAICompatible?.chatCompletionsUrl?.trim() || undefined,
        }),
    ];
};

/**
 * One adapter of a built-in provider with its key, or what gives a fresh one (CR-132): what a server uses
 * (e.g. Cloud Functions) without the config of <App>. `openai-compatible` and Cloudflare need their own
 * definition (`createCloudflareProviderDefinition`, `createOpenAICompatibleProviderDefinition`), passed
 * instead of the id.
 */
export const createAIProvider = (provider: BuiltInAIProviderId | AIProviderDefinition, apiKey: AICredential): AIProviderAdapter => {
    const definition = typeof provider === 'string' ? AI_PROVIDER_DEFINITIONS.find((entry) => entry.id === provider) : provider;
    if (!definition) throw new Error(`createAIProvider: unknown provider "${String(provider)}"`);
    return new RuntimeAIProvider(definition, apiKey);
};

export const createAIProviderRegistry = (aiConfig?: AIConfig): Record<string, AIProviderAdapter> => {
    if (!aiConfig) return {};

    const definitions = [
        ...AI_PROVIDER_DEFINITIONS,
        ...getDynamicAIProviderDefinitions(aiConfig),
    ];

    return definitions.reduce<Record<string, AIProviderAdapter>>((registry, definition) => {
        const apiKey = definition.id === 'openai-compatible'
            ? aiConfig.openAICompatible?.apiKey?.trim() || ''
            : definition.id === 'cloudflare'
            ? aiConfig.cloudflare?.apiToken?.trim() || ''
            : definition.id === 'vertex'
            ? aiConfig.vertex?.accessToken?.trim() || ''
            : typeof definition.configKey === 'string' && typeof aiConfig[definition.configKey as keyof AIConfig] === 'string'
                ? String(aiConfig[definition.configKey as keyof AIConfig] || '').trim()
                : '';

        if (apiKey) {
            registry[definition.id] = new RuntimeAIProvider(definition, apiKey);
        }

        return registry;
    }, {});
};

/** A provider connected on the app's server, as the browser may know it: never its key. */
export type ServerAIProviderConnection = {
    id: BuiltInAIProviderId;
    /** Cloudflare: the account in every Workers AI URL. */
    accountId?: string;
    /** openai-compatible: the endpoint. */
    baseUrl?: string;
    /** openai-compatible: its name and default model. */
    label?: string;
    defaultModel?: string;
    /** Vertex AI: the Google Cloud project and the location. */
    projectId?: string;
    location?: string;
};

/**
 * The adapters of the providers connected on the app's server (CR-102): the same ones
 * createAIProviderRegistry() builds, with a placeholder where the key goes. Each adapter writes it
 * exactly where it would write the key; the app's proxy swaps it for the key of `scope` with
 * resolveServerCredentials() from `@llmnative/react/server`. Needs the proxy: proxyFetch never
 * sends a placeholder straight to a provider.
 */
export const createServerCredentialAIRegistry = (
    connections: ServerAIProviderConnection[],
    { scope }: { scope: string },
): Record<string, AIProviderAdapter> => {
    const config = connections.reduce<AIConfig>((next, connection) => {
        const placeholder = serverCredential(scope, connection.id);
        if (connection.id === 'openai-compatible') {
            return connection.baseUrl
                ? { ...next, openAICompatible: { apiKey: placeholder, baseUrl: connection.baseUrl, label: connection.label, defaultModel: connection.defaultModel } }
                : next;
        }
        if (connection.id === 'cloudflare') {
            return connection.accountId ? { ...next, cloudflare: { apiToken: placeholder, accountId: connection.accountId } } : next;
        }
        if (connection.id === 'vertex') {
            return connection.projectId && connection.location
                ? { ...next, vertex: { accessToken: placeholder, projectId: connection.projectId, location: connection.location, defaultModel: connection.defaultModel } }
                : next;
        }
        const configKey = AI_PROVIDER_DEFINITIONS.find((definition) => definition.id === connection.id)?.configKey;
        return configKey ? { ...next, [configKey]: placeholder } : next;
    }, {});
    return createAIProviderRegistry(config);
};
