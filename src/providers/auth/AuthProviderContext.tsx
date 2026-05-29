import React, { createContext, useContext, useMemo } from 'react';
import type { AuthProviderAdapter } from './AuthProvider';

type AuthProviderContextValue = {
    registry: Record<string, AuthProviderAdapter>;
    defaultKey: string;
};

const AuthProviderContext = createContext<AuthProviderContextValue | null>(null);

export const AuthProvider = ({
    registry,
    defaultKey,
    children,
}: AuthProviderContextValue & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>;
};

export const useAuthProvider = (name?: string): AuthProviderAdapter => {
    const ctx = useContext(AuthProviderContext);
    if (!ctx) throw new Error('useAuthProvider must be used inside <App providers={...} />.');
    const key = name ?? ctx.defaultKey;
    const provider = ctx.registry[key];
    if (!provider) throw new Error(`AuthProvider '${key}' is not registered. Available: ${Object.keys(ctx.registry).join(', ')}`);
    return provider;
};

export default AuthProviderContext;
