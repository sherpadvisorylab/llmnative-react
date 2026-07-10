import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

export const GLM_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'glm',
    label: 'ZhipuAI (GLM)',
    description: 'Zhipu AI\'s GLM model family.',
    configKey: 'glmApiKey',
    defaultModel: 'glm-4-flash',
    fallbackModels: ['glm-4-flash', 'glm-4', 'glm-z1-preview', 'glm-z1-plus', 'glm-4-long'],
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    dashboardUrl: 'https://bigmodel.cn/usercenter/apikeys',
});
