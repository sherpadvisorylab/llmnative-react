import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const OPENAI_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'openai',
    label: 'OpenAI',
    configKey: 'openaiApiKey',
    defaultModel: 'gpt-5.2',
    fallbackModels: ['gpt-5.2', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano'],
    baseUrl: 'https://api.openai.com/v1',
    dashboardUrl: 'https://platform.openai.com/api-keys',
});

