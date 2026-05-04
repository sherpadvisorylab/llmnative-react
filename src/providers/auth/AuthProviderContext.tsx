import React, { createContext, useContext } from 'react';
import { AuthProvider } from './AuthProvider';

type AuthProviderRegistry = {
    registry: Record<string, AuthProvider>;
    defaultKey: string;
};

const AuthProviderContext = createContext<AuthProviderRegistry | null>(null);

export const AuthProviderProvider = ({
    registry,
    defaultKey,
    children,
}: AuthProviderRegistry & { children: React.ReactNode }) => (
    <AuthProviderContext.Provider value={{ registry, defaultKey }}>
        {children}
    </AuthProviderContext.Provider>
);

export const useAuthProvider = (name?: string): AuthProvider => {
    const ctx = useContext(AuthProviderContext);
    if (!ctx) throw new Error('useAuthProvider must be used inside <App authProvider={...} />.');
    const key = name ?? ctx.defaultKey;
    const provider = ctx.registry[key];
    if (!provider) throw new Error(`AuthProvider '${key}' is not registered. Available: ${Object.keys(ctx.registry).join(', ')}`);
    return provider;
};

export default AuthProviderContext;
