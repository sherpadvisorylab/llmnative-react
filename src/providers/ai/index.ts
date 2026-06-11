import type { AIConfig } from '../../Config';
import type { AIProviderAdapter } from './AIProvider';
import { ANTHROPIC_PROVIDER_DEFINITION } from './anthropic';
import { DEEPSEEK_PROVIDER_DEFINITION } from './deepseek';
import { GEMINI_PROVIDER_DEFINITION } from './gemini';
import { MISTRAL_PROVIDER_DEFINITION } from './mistral';
import { OPENAI_PROVIDER_DEFINITION } from './openai';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';
import { OPENCODE_PROVIDER_DEFINITION } from './opencode';
import { OPENROUTER_PROVIDER_DEFINITION } from './openrouter';
import { getAIModelCatalog, type AIProviderDefinition, type AIModelCatalog, RuntimeAIProvider } from './shared';

export type { AIProviderAdapter, AIModelDescriptor, AIProviderCapabilities, AIRequestOptions, AIAttachment } from './AIProvider';
export { formatAIModelRef, parseAIModelRef } from './AIProvider';
export type { AIModelCatalog } from './shared';
export { getAIModelCatalog } from './shared';

export const AI_PROVIDER_DEFINITIONS: AIProviderDefinition[] = [
    OPENAI_PROVIDER_DEFINITION,
    OPENROUTER_PROVIDER_DEFINITION,
    OPENCODE_PROVIDER_DEFINITION,
    DEEPSEEK_PROVIDER_DEFINITION,
    GEMINI_PROVIDER_DEFINITION,
    ANTHROPIC_PROVIDER_DEFINITION,
    MISTRAL_PROVIDER_DEFINITION,
];

const getDynamicAIProviderDefinitions = (aiConfig?: AIConfig): AIProviderDefinition[] => {
    const baseUrl = aiConfig?.openAICompatible?.baseUrl?.trim();
    if (!baseUrl) return [];

    return [
        createOpenAICompatibleProviderDefinition({
            id: 'openai-compatible',
            label: aiConfig?.openAICompatible?.label?.trim() || 'OpenAI-compatible',
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
