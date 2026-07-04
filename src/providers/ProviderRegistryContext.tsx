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

/** The 6 categories the framework ships out of the box. Any other string is a valid category too — see customCategories on <App>. */
export type ProviderService = keyof ProviderAdapterMap;

export type ProviderRegistrySnapshot = Record<string, { registry: Record<string, unknown>; defaultKey: string }>;

/**
 * Replaces a single named adapter in a provider registry at runtime, in ANY
 * category — one of the 6 built-in ones (typed) or an arbitrary custom one a
 * vertical registered (string). Calls the previous adapter's dispose() (if
 * defined) before swapping it in, then propagates the new registry to every
 * useXProvider()/useProvider() consumer. If `category` didn't exist yet, it's
 * created — categories can be registered after bootstrap, not only via <App providers>.
 */
export type SetProviderFn = {
    <S extends ProviderService>(category: S, key: string, adapter: ProviderAdapterMap[S]): Promise<void>;
    (category: string, key: string, adapter: unknown): Promise<void>;
};

type ProviderRegistryContextValue = {
    registries: ProviderRegistrySnapshot;
    setProvider: SetProviderFn;
};

const ProviderRegistryContext = createContext<ProviderRegistryContextValue | null>(null);

export const ProviderRegistryProvider = ({
    registries,
    setProvider,
    children,
}: ProviderRegistryContextValue & { children: React.ReactNode }) => (
    <ProviderRegistryContext.Provider value={{ registries, setProvider }}>
        {children}
    </ProviderRegistryContext.Provider>
);

const useRegistryContext = (): ProviderRegistryContextValue => {
    const ctx = useContext(ProviderRegistryContext);
    if (!ctx) throw new Error('useSetProvider/useProvider must be used inside <App>.');
    return ctx;
};

/** Imperatively swap a provider adapter at runtime (e.g. reconnect data/storage to a different backend). */
export const useSetProvider = (): SetProviderFn => useRegistryContext().setProvider;

/**
 * Generic read access to any provider category — built-in or custom. Prefer the
 * typed useDataProvider()/useStorageProvider()/... for the 6 built-ins; reach for
 * this when consuming a category the framework doesn't know about (registered via
 * providers.customCategories or a runtime setProvider() call).
 */
export const useProvider = <T = unknown>(category: string, key?: string): T => {
    const { registries } = useRegistryContext();
    const entry = registries[category];
    const resolvedKey = key ?? entry?.defaultKey;
    const provider = resolvedKey ? entry?.registry[resolvedKey] : undefined;
    if (!provider) throw new Error(`Provider '${resolvedKey ?? category}' is not registered in category '${category}'. Available: ${Object.keys(entry?.registry ?? {}).join(', ')}`);
    return provider as T;
};

export default ProviderRegistryContext;
