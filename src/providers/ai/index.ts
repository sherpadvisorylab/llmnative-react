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
import { OPENROUTER_PROVIDER_DEFINITION } from './openrouter';
import { getAIModelCatalog, buildServerCredentialPlaceholder, type AIProviderDefinition, type AIModelCatalog, RuntimeAIProvider } from './shared';

export type {
    AIProviderAdapter, AIKeyValidationResult, AIModelDescriptor, AIModelPricing, AIProviderCapabilities, AIRequestOptions, AIAttachment,
    AICompleteRequest, AICompleteResult, AIConversationTurn, AIToolDefinition, AIToolCall, AIToolResult,
} from './AIProvider';
export { formatAIModelRef, parseAIModelRef, isFreeAIModel } from './AIProvider';
export {
    SERVER_CREDENTIAL_PREFIX, aiProviderHosts, buildServerCredentialPlaceholder,
    parseServerCredentialPlaceholder, isServerCredentialPlaceholder, containsServerCredential,
    replaceServerCredentialPlaceholders,
} from './AIProvider';
export type { AIProviderHosts, AIServerCredentialRef } from './AIProvider';
export type { DiscoveredAIModel } from './shared';
export type { AIModelCatalog, AIProviderDefinition } from './shared';
export { getAIModelCatalog } from './shared';
export { CLOUDFLARE_PROVIDER_DESCRIPTOR, createCloudflareProviderDefinition } from './cloudflare';
export type { CloudflareProviderOptions } from './cloudflare';

export const AI_PROVIDER_DEFINITIONS: AIProviderDefinition[] = [
    OPENAI_PROVIDER_DEFINITION,
    OPENROUTER_PROVIDER_DEFINITION,
    OPENCODE_PROVIDER_DEFINITION,
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

/** Includes Cloudflare: like openai-compatible its working definition needs a second credential
 * (the account id) before it can be built, but unlike openai-compatible it is a fixed, named
 * vendor — a "connect" UI should list it alongside the others. */
export const AI_PROVIDER_DESCRIPTORS: ProviderDescriptor[] = [
    ...AI_PROVIDER_DEFINITIONS.map(toProviderDescriptor),
    CLOUDFLARE_PROVIDER_DESCRIPTOR,
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

/** Reads the plaintext key a built-in definition would use from the given connections. Used only
 * to decide *whether* a provider is configured; the server-credential registry never sends it. */
const resolveConnectionKey = (definition: AIProviderDefinition, aiConfig: AIConfig): string => {
    if (definition.id === 'openai-compatible') return aiConfig.openAICompatible?.apiKey?.trim() || '';
    if (definition.id === 'cloudflare') return aiConfig.cloudflare?.apiToken?.trim() || '';
    if (typeof definition.configKey === 'string' && typeof aiConfig[definition.configKey as keyof AIConfig] === 'string') {
        return String(aiConfig[definition.configKey as keyof AIConfig] || '').trim();
    }
    return '';
};

export const createAIProviderRegistry = (aiConfig?: AIConfig): Record<string, AIProviderAdapter> => {
    if (!aiConfig) return {};

    const definitions = [
        ...AI_PROVIDER_DEFINITIONS,
        ...getDynamicAIProviderDefinitions(aiConfig),
    ];

    return definitions.reduce<Record<string, AIProviderAdapter>>((registry, definition) => {
        const apiKey = resolveConnectionKey(definition, aiConfig);

        if (apiKey) {
            registry[definition.id] = new RuntimeAIProvider(definition, apiKey);
        }

        return registry;
    }, {});
};

export type ServerCredentialRegistryOptions = {
    /** Identifies which server-held credential set this browser registry belongs to. The
     * placeholder sent upstream is `llmnative-server-credential:<scope>:<provider>`. */
    scope: string;
};

/** Browser-side twin of createAIProviderRegistry for apps that never hold provider keys in the
 * browser: same built-in adapters, same "is it configured" rule, but every adapter is built with
 * the opaque server-credential placeholder instead of the real key. The server entry
 * (`@llmnative/react/server`) swaps the placeholder for the secret of `scope` + provider just
 * before the request leaves the server. `createAIProviderRegistry` and `AIConfig` are unchanged. */
export const createServerCredentialAIRegistry = (
    aiConfig?: AIConfig,
    options: ServerCredentialRegistryOptions = { scope: '' },
): Record<string, AIProviderAdapter> => {
    if (!aiConfig) return {};

    const scope = options.scope?.trim();
    if (!scope) {
        throw new Error('createServerCredentialAIRegistry: a non-empty { scope } is required.');
    }

    const definitions = [
        ...AI_PROVIDER_DEFINITIONS,
        ...getDynamicAIProviderDefinitions(aiConfig),
    ];

    return definitions.reduce<Record<string, AIProviderAdapter>>((registry, definition) => {
        if (resolveConnectionKey(definition, aiConfig)) {
            registry[definition.id] = new RuntimeAIProvider(
                definition,
                buildServerCredentialPlaceholder(scope, definition.id),
            );
        }

        return registry;
    }, {});
};
