import React, { createContext, useContext, useMemo } from 'react';
import type { CredentialsAdapter } from './CredentialsProvider';

type CredentialsProviderContextValue = {
    registry: Record<string, CredentialsAdapter>;
    defaultKey: string;
};

const CredentialsProviderContext = createContext<CredentialsProviderContextValue | null>(null);

export const CredentialsProvider = ({
    registry,
    defaultKey,
    children,
}: CredentialsProviderContextValue & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <CredentialsProviderContext.Provider value={value}>{children}</CredentialsProviderContext.Provider>;
};

export const useCredentialsProvider = (name?: string): CredentialsAdapter => {
    const ctx = useContext(CredentialsProviderContext);
    if (!ctx) throw new Error('useCredentialsProvider must be used inside <App providers={...} />.');
    const key = name ?? ctx.defaultKey;
    const provider = ctx.registry[key];
    if (!provider) throw new Error(`CredentialsProvider '${key}' is not registered. Available: ${Object.keys(ctx.registry).join(', ')}`);
    return provider;
};

export default CredentialsProviderContext;
