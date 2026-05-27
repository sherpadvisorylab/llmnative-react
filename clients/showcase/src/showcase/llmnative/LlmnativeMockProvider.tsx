import React from 'react';
import { DataProvider, MockDataProvider } from '@llmnative/react';
import type { PlaygroundMockProviderProps } from '../../docs-kit/playground';

export default function LlmnativeMockProvider({ seed, children }: PlaygroundMockProviderProps) {
    const provider = React.useMemo(() => new MockDataProvider(seed), [seed]);

    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}
