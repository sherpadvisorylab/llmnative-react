import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const MISTRAL_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'mistral',
    label: 'Mistral',
    configKey: 'mistralApiKey',
    defaultModel: 'mistral-medium-3',
    fallbackModels: ['mistral-medium-3', 'mistral-small-3.1', 'ministral-8b-latest'],
    baseUrl: 'https://api.mistral.ai/v1',
});
