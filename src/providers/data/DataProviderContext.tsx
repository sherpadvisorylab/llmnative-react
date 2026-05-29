import React, { createContext, useContext, useMemo } from 'react';
import type { DataProviderAdapter } from './DataProvider';

type DataProviderContextValue = {
    registry: Record<string, DataProviderAdapter>;
    defaultKey: string;
};

const DataProviderContext = createContext<DataProviderContextValue | null>(null);

export const DataProvider = ({
    registry,
    defaultKey,
    children,
}: DataProviderContextValue & { children: React.ReactNode }) => {
    const value = useMemo(() => ({ registry, defaultKey }), [registry, defaultKey]);
    return <DataProviderContext.Provider value={value}>{children}</DataProviderContext.Provider>;
};

export const useDataProvider = (name?: string): DataProviderAdapter => {
    const ctx = useContext(DataProviderContext);
    if (!ctx) throw new Error('useDataProvider must be used inside <App>.');
    const key = name ?? ctx.defaultKey;
    const provider = ctx.registry[key];
    if (!provider) throw new Error(`DataProvider '${key}' is not registered. Available: ${Object.keys(ctx.registry).join(', ')}`);
    return provider;
};

export default DataProviderContext;
