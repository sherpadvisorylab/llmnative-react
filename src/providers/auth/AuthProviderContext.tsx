import React, { createContext, useContext } from 'react';
import { AuthProvider } from './AuthProvider';

const AuthProviderContext = createContext<AuthProvider | null>(null);

export const AuthProviderProvider = ({
    provider,
    children,
}: {
    provider: AuthProvider;
    children: React.ReactNode;
}) => (
    <AuthProviderContext.Provider value={provider}>
        {children}
    </AuthProviderContext.Provider>
);

export const useAuthProvider = (): AuthProvider => {
    const ctx = useContext(AuthProviderContext);
    if (!ctx) throw new Error('useAuthProvider must be used inside <App authProvider={...} />');
    return ctx;
};
