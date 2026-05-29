import React, { createContext, useContext, useMemo } from 'react';
import type { StorageProviderAdapter } from './StorageProvider';

type StorageProviderContextValue = {
    registry: Record<string, StorageProviderAdapter>;
    defaultKey: string;
};

const StorageProviderContext = createContext<StorageProviderContextValue | null>(null);

export const StorageProvider = ({
    registry,
    defaultKey,
    children,
}: StorageProviderContextValue & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <StorageProviderContext.Provider value={value}>{children}</StorageProviderContext.Provider>;
};

export const useStorageProvider = (name?: string): StorageProviderAdapter | null => {
    const ctx = useContext(StorageProviderContext);
    if (!ctx) return null;
    const key = name ?? ctx.defaultKey;
    return ctx.registry[key] ?? null;
};

export default StorageProviderContext;
