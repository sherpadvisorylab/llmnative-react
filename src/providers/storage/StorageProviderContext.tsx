import React, { createContext, useContext } from 'react';
import { StorageProvider } from './StorageProvider';

const StorageProviderContext = createContext<StorageProvider | null>(null);

export const StorageProviderProvider = ({ provider, children }: { provider: StorageProvider; children: React.ReactNode }) => (
    <StorageProviderContext.Provider value={provider}>
        {children}
    </StorageProviderContext.Provider>
);

export const useStorageProvider = (): StorageProvider | null => {
    return useContext(StorageProviderContext);
};

export default StorageProviderContext;
