import React, { createContext, useContext } from 'react';
import { DataProvider } from './DataProvider';

const DataProviderContext = createContext<DataProvider | null>(null);

export const DataProviderProvider = ({ provider, children }: { provider: DataProvider; children: React.ReactNode }) => (
    <DataProviderContext.Provider value={provider}>
        {children}
    </DataProviderContext.Provider>
);

export const useDataProvider = (): DataProvider => {
    const provider = useContext(DataProviderContext);
    if (!provider) {
        throw new Error('useDataProvider must be used inside <App> with a dataProvider prop.');
    }
    return provider;
};

export default DataProviderContext;
