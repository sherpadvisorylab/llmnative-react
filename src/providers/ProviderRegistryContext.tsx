import React, { createContext, useContext } from 'react';
import type { DataProviderAdapter } from './data/DataProvider';
import type { StorageProviderAdapter } from './storage/StorageProvider';
import type { AuthProviderAdapter } from './auth/AuthProvider';
import type { EmailProviderAdapter } from './email/EmailProvider';
import type { AIProviderAdapter } from './ai/AIProvider';
import type { CredentialsAdapter } from './credentials/CredentialsProvider';

export type ProviderAdapterMap = {
    data: DataProviderAdapter;
    storage: StorageProviderAdapter;
    auth: AuthProviderAdapter;
    email: EmailProviderAdapter;
    ai: AIProviderAdapter;
    credentials: CredentialsAdapter;
};

export type ProviderService = keyof ProviderAdapterMap;

/**
 * Replaces a single named adapter in a provider registry at runtime.
 * Calls the previous adapter's dispose() (if defined) before swapping it in,
 * then propagates the new registry to every useXProvider() consumer.
 */
export type SetProviderFn = <S extends ProviderService>(
    service: S,
    key: string,
    adapter: ProviderAdapterMap[S],
) => Promise<void>;

const ProviderRegistryContext = createContext<SetProviderFn | null>(null);

export const ProviderRegistryProvider = ({
    setProvider,
    children,
}: {
    setProvider: SetProviderFn;
    children: React.ReactNode;
}) => (
    <ProviderRegistryContext.Provider value={setProvider}>
        {children}
    </ProviderRegistryContext.Provider>
);

/** Imperatively swap a provider adapter at runtime (e.g. reconnect data/storage to a different backend). */
export const useSetProvider = (): SetProviderFn => {
    const ctx = useContext(ProviderRegistryContext);
    if (!ctx) throw new Error('useSetProvider must be used inside <App>.');
    return ctx;
};

export default ProviderRegistryContext;
