import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const DEEPSEEK_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'deepseek',
    label: 'DeepSeek',
    configKey: 'deepSeekApiKey',
    defaultModel: 'deepseek-chat',
    fallbackModels: ['deepseek-chat', 'deepseek-reasoner'],
    baseUrl: 'https://api.deepseek.com',
    dashboardUrl: 'https://platform.deepseek.com/api_keys',
});
