import React from 'react';
import type { IconProvider } from './IconProvider';

const IconProviderContext = React.createContext<IconProvider | null>(null);

export function IconProviderProvider({
    provider,
    children,
}: {
    provider: IconProvider;
    children: React.ReactNode;
}) {
    return (
        <IconProviderContext.Provider value={provider}>
            {children}
        </IconProviderContext.Provider>
    );
}

export function useIconProvider(): IconProvider | null {
    return React.useContext(IconProviderContext);
}
