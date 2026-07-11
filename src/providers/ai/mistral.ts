import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const MISTRAL_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'mistral',
    label: 'Mistral',
    description: 'European-hosted open and commercial language models.',
    configKey: 'mistralApiKey',
    defaultModel: 'mistral-medium-3',
    fallbackModels: ['mistral-medium-3', 'mistral-small-3.1', 'ministral-8b-latest'],
    baseUrl: 'https://api.mistral.ai/v1',
    dashboardUrl: 'https://console.mistral.ai/api-keys',
    credentialsHint: 'Mistral Console → API Keys → Create new key.',
    // Mistral returns { message: "Unauthorized" } on 401, handled by defaultValidateApiKey in the factory
});
