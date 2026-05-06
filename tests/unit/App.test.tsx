import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/providers/firebase-init', () => ({
    default: vi.fn(async () => ({ name: 'test-firebase-app' })),
    getSafeAuth: vi.fn(() => null),
}));

import App from '../../src/App';
import { useTheme, useThemeController } from '../../src/Theme';
import { useDataProvider } from '../../src/providers/data/DataProviderContext';
import type { DataProvider } from '../../src/providers/data/DataProvider';
import type { IconComponentProps, IconProvider } from '../../src/providers/icon/IconProvider';
import {
    useIconController,
    useIconProvider,
} from '../../src/providers/icon/IconProviderContext';

function createDataProvider(id: string): DataProvider {
    return {
        id,
        read: vi.fn(),
        set: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        useListener: vi.fn(),
    } as unknown as DataProvider;
}

function ProbePage() {
    const themeController = useThemeController();
    const alertTheme = useTheme('alert');
    const iconController = useIconController();
    const iconProvider = useIconProvider();
    const dataProvider = useDataProvider();
    const SearchIcon = iconProvider?.resolve('search');

    return (
        <div>
            <span data-testid="theme-preset">{themeController.preset}</span>
            <span data-testid="theme-mode">{themeController.resolvedMode}</span>
            <span data-testid="theme-primary">{themeController.primary}</span>
            <span data-testid="alert-class">{alertTheme.Alert.className}</span>
            <span data-testid="icon-provider">{iconController.providerId}</span>
            <span data-testid="icon-search">{SearchIcon ? 'yes' : 'no'}</span>
            <span data-testid="data-provider">{(dataProvider as DataProvider & { id?: string }).id}</span>
            {SearchIcon && <SearchIcon data-testid="resolved-icon" />}
        </div>
    );
}

function renderApp(props: Partial<React.ComponentProps<typeof App>> = {}) {
    window.history.pushState({}, '', '/probe');

    return render(
        <App
            importPage={() => Promise.reject(new Error('dynamic imports are not used in this test'))}
            menuConfig={{ main: [{ path: '/probe', page: ProbePage }] }}
            dataProvider={createDataProvider('single-data')}
            {...props}
        />
    );
}

describe('App provider orchestration', () => {
    beforeEach(() => {
        document.documentElement.className = '';
        document.documentElement.removeAttribute('style');
        window.history.pushState({}, '', '/');
    });

    it('passes icon and theme string shorthands to internal providers', () => {
        renderApp({
            iconProvider: 'phosphor',
            themeProvider: 'cyber',
        });

        expect(screen.getByTestId('icon-provider')).toHaveTextContent('phosphor');
        expect(screen.getByTestId('icon-search')).toHaveTextContent('yes');
        expect(screen.getByTestId('theme-preset')).toHaveTextContent('cyber');
        expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
        expect(screen.getByTestId('theme-primary')).toHaveTextContent('160 84% 39%');
        expect(screen.getByTestId('data-provider')).toHaveTextContent('single-data');
        expect(document.documentElement).toHaveClass('dark');
    });

    it('passes custom theme presets through App themeProvider config', () => {
        renderApp({
            themeProvider: {
                defaultPreset: 'brand',
                presets: {
                    brand: {
                        mode: 'light',
                        primary: '346.8 77.2% 49.8%',
                        radius: 0.75,
                        theme: {
                            Alert: { className: 'brand-alert' },
                        },
                    },
                },
            },
        });

        expect(screen.getByTestId('theme-preset')).toHaveTextContent('brand');
        expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
        expect(screen.getByTestId('theme-primary')).toHaveTextContent('346.8 77.2% 49.8%');
        expect(screen.getByTestId('alert-class')).toHaveTextContent('brand-alert');
        expect(document.documentElement.style.getPropertyValue('--radius')).toBe('0.75rem');
    });

    it('passes custom icon providers through App iconProvider config', () => {
        const CustomIcon = (props: IconComponentProps) => <span {...props}>custom icon</span>;
        const customProvider: IconProvider = {
            id: 'custom',
            resolve: (name) => name === 'search' ? CustomIcon : null,
        };

        renderApp({
            iconProvider: {
                default: 'custom',
                providers: { custom: customProvider },
            },
        });

        expect(screen.getByTestId('icon-provider')).toHaveTextContent('custom');
        expect(screen.getByTestId('icon-search')).toHaveTextContent('yes');
        expect(screen.getByTestId('resolved-icon')).toHaveTextContent('custom icon');
    });

    it('selects named data providers from the App providers registry', () => {
        renderApp({
            dataProvider: undefined,
            providers: {
                data: {
                    firebase: createDataProvider('firebase-data'),
                    mock: createDataProvider('mock-data'),
                },
            },
            defaultProviders: {
                data: 'mock',
            },
        });

        expect(screen.getByTestId('data-provider')).toHaveTextContent('mock-data');
    });
});
