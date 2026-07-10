import type { AIConfig } from '../../Config';
import type { ProviderDescriptor } from '../ProviderDescriptor';
import type { AIProviderAdapter } from './AIProvider';
import { ANTHROPIC_PROVIDER_DEFINITION } from './anthropic';
import { DEEPSEEK_PROVIDER_DEFINITION } from './deepseek';
import { GEMINI_PROVIDER_DEFINITION } from './gemini';
import { MISTRAL_PROVIDER_DEFINITION } from './mistral';
import { OPENAI_PROVIDER_DEFINITION } from './openai';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';
import { GLM_PROVIDER_DEFINITION } from './glm';
import { OPENCODE_PROVIDER_DEFINITION } from './opencode';
import { OPENROUTER_PROVIDER_DEFINITION } from './openrouter';
import { getAIModelCatalog, type AIProviderDefinition, type AIModelCatalog, RuntimeAIProvider } from './shared';

export type { AIProviderAdapter, AIKeyValidationResult, AIModelDescriptor, AIProviderCapabilities, AIRequestOptions, AIAttachment } from './AIProvider';
export { formatAIModelRef, parseAIModelRef } from './AIProvider';
export type { AIModelCatalog, AIProviderDefinition } from './shared';
export { getAIModelCatalog } from './shared';

export const AI_PROVIDER_DEFINITIONS: AIProviderDefinition[] = [
    OPENAI_PROVIDER_DEFINITION,
    OPENROUTER_PROVIDER_DEFINITION,
    OPENCODE_PROVIDER_DEFINITION,
    DEEPSEEK_PROVIDER_DEFINITION,
    GEMINI_PROVIDER_DEFINITION,
    ANTHROPIC_PROVIDER_DEFINITION,
    MISTRAL_PROVIDER_DEFINITION,
    GLM_PROVIDER_DEFINITION,
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

export const AI_PROVIDER_DESCRIPTORS: ProviderDescriptor[] = AI_PROVIDER_DEFINITIONS.map(toProviderDescriptor);

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
    const baseUrl = aiConfig?.openAICompatible?.baseUrl?.trim();
    if (!baseUrl) return [];

    return [
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

export const createAIProviderRegistry = (aiConfig?: AIConfig): Record<string, AIProviderAdapter> => {
    if (!aiConfig) return {};

    const definitions = [
        ...AI_PROVIDER_DEFINITIONS,
        ...getDynamicAIProviderDefinitions(aiConfig),
    ];

    return definitions.reduce<Record<string, AIProviderAdapter>>((registry, definition) => {
        const apiKey = definition.id === 'openai-compatible'
            ? aiConfig.openAICompatible?.apiKey?.trim() || ''
            : typeof definition.configKey === 'string' && typeof aiConfig[definition.configKey as keyof AIConfig] === 'string'
                ? String(aiConfig[definition.configKey as keyof AIConfig] || '').trim()
                : '';

        if (apiKey) {
            registry[definition.id] = new RuntimeAIProvider(definition, apiKey);
        }

        return registry;
    }, {});
};
