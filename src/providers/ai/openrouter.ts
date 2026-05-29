import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const OPENROUTER_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'openrouter',
    label: 'OpenRouter',
    configKey: 'openRouterApiKey',
    defaultModel: 'openai/gpt-4',
    fallbackModels: ['openai/gpt-4', 'openai/gpt-5-nano', 'anthropic/claude-3.7-sonnet'],
    baseUrl: 'https://openrouter.ai/api/v1',
});
