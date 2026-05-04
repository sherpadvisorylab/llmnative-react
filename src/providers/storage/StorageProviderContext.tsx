import React, { createContext, useContext } from 'react';
import { StorageProvider } from './StorageProvider';

type StorageProviderRegistry = {
    registry: Record<string, StorageProvider>;
    defaultKey: string;
};

const StorageProviderContext = createContext<StorageProviderRegistry | null>(null);

export const StorageProviderProvider = ({
    registry,
    defaultKey,
    children,
}: StorageProviderRegistry & { children: React.ReactNode }) => (
    <StorageProviderContext.Provider value={{ registry, defaultKey }}>
        {children}
    </StorageProviderContext.Provider>
);

export const useStorageProvider = (name?: string): StorageProvider | null => {
    const ctx = useContext(StorageProviderContext);
    if (!ctx) return null;
    const key = name ?? ctx.defaultKey;
    return ctx.registry[key] ?? null;
};

export default StorageProviderContext;
