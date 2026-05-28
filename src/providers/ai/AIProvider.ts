import type { PromptVariables } from '../../conf/Prompt';
import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface AIModelDescriptor {
    id: string;
    provider: string;
    model: string;
    label: string;
    deprecated?: boolean;
}

export interface AIProviderCapabilities {
    models: AIModelDescriptor[];
    supportsTemperature?: boolean;
}

export interface AIRequestOptions {
    language?: string;
    voice?: string;
    style?: string;
    role?: string;
    model?: string;
    temperature?: number;
}

export interface AICompleteRequest extends AIRequestOptions {
    prompt: string;
    data?: PromptVariables;
}

export interface AIProviderAdapter extends ProviderConfigurable {
    id: string;
    label: string;
    defaultModel: string;
    getCapabilities(forceRefresh?: boolean): Promise<AIProviderCapabilities>;
    complete(request: AICompleteRequest): Promise<string | null>;
}

export interface AIModelRef {
    provider: string;
    model: string;
}

export const formatAIModelRef = (provider: string, model: string): string => `${provider}/${model}`;

export const parseAIModelRef = (value?: string | null): AIModelRef | null => {
    if (!value) return null;

    const separator = value.indexOf('/');
    if (separator <= 0 || separator === value.length - 1) return null;

    return {
        provider: value.slice(0, separator),
        model: value.slice(separator + 1),
    };
};
