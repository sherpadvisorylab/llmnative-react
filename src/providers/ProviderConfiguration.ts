export interface ProviderConfigurationState {
    configured: boolean;
    reason?: string;
    missingKeys?: string[];
}

export interface ProviderConfigurable {
    isConfigured?(): boolean;
    getConfigurationState?(): ProviderConfigurationState;
}

export const getMissingKeys = (
    config: Record<string, unknown> | undefined,
    keys: string[],
    prefix = ''
): string[] => keys
    .filter((key) => {
        const value = config?.[key];
        return value === undefined || value === null || value === '';
    })
    .map((key) => `${prefix}${key}`);

export const createConfigurationState = (
    provider: string,
    missingKeys: string[]
): ProviderConfigurationState => ({
    configured: missingKeys.length === 0,
    missingKeys,
    reason: missingKeys.length
        ? `${provider} is not configured. Missing: ${missingKeys.join(', ')}.`
        : undefined,
});

export const getProviderConfigurationState = (
    provider: ProviderConfigurable | null | undefined,
    fallbackName = 'Provider'
): ProviderConfigurationState => {
    if (!provider) {
        return {
            configured: false,
            reason: `${fallbackName} is not registered.`,
        };
    }

    if (provider.getConfigurationState) {
        return provider.getConfigurationState();
    }

    if (provider.isConfigured) {
        const configured = provider.isConfigured();
        return {
            configured,
            reason: configured ? undefined : `${fallbackName} is not configured.`,
        };
    }

    return { configured: true };
};
