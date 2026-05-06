import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProviderProvider } from '../../src/providers/data/DataProviderContext';
import { MockDataProvider } from '../../src/providers/data/mock';

interface Options extends Omit<RenderOptions, 'wrapper'> {
    provider?: MockDataProvider;
    route?: string;
}

export function renderWithProviders(
    ui: React.ReactElement,
    { provider = new MockDataProvider(), route = '/', ...renderOptions }: Options = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <MemoryRouter initialEntries={[route]}>
                <DataProviderProvider registry={{ default: provider }} defaultKey="default">
                    {children}
                </DataProviderProvider>
            </MemoryRouter>
        );
    }
    return { provider, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
