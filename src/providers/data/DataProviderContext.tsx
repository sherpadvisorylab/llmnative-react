import React, { createContext, useContext } from 'react';
import { DataProvider } from './DataProvider';

type DataProviderRegistry = {
    registry: Record<string, DataProvider>;
    defaultKey: string;
};

const DataProviderContext = createContext<DataProviderRegistry | null>(null);

export const DataProviderProvider = ({
    registry,
    defaultKey,
    children,
}: DataProviderRegistry & { children: React.ReactNode }) => (
    <DataProviderContext.Provider value={{ registry, defaultKey }}>
        {children}
    </DataProviderContext.Provider>
);

export const useDataProvider = (name?: string): DataProvider => {
    const ctx = useContext(DataProviderContext);
    if (!ctx) throw new Error('useDataProvider must be used inside <App>.');
    const key = name ?? ctx.defaultKey;
    const provider = ctx.registry[key];
    if (!provider) throw new Error(`DataProvider '${key}' is not registered. Available: ${Object.keys(ctx.registry).join(', ')}`);
    return provider;
};

export default DataProviderContext;
