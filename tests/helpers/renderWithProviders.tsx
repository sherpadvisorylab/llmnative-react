import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../../src/providers/data/DataProviderContext';
import { MockDataProvider } from '../../src/providers/data/mock';
import { HeadProvider } from '../../src/Head';
import { I18nProvider } from '../../src/I18n';
import type { I18nConfig } from '../../src/I18n';

interface Options extends Omit<RenderOptions, 'wrapper'> {
    provider?: MockDataProvider;
    route?: string;
    i18n?: I18nConfig;
}

export function renderWithProviders(
    ui: React.ReactElement,
    { provider = new MockDataProvider(), route = '/', i18n, ...renderOptions }: Options = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <MemoryRouter
                initialEntries={[route]}
                future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
            >
                <DataProvider registry={{ default: provider }} defaultKey="default">
                    <HeadProvider>
                        <I18nProvider config={i18n}>
                            {children}
                        </I18nProvider>
                    </HeadProvider>
                </DataProvider>
            </MemoryRouter>
        );
    }
    return { provider, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
