import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/providers/firebase-init', () => ({
    default: vi.fn(async () => ({ name: 'test-firebase-app' })),
    getSafeAuth: vi.fn(() => null),
}));

import App from '../../src/App';
import {
    Head,
    useAssetsHead,
    useDocumentHead,
    useLanguageHead,
    usePaginationHead,
    usePwaHead,
    useSchemaOrgHead,
    useSocialHead,
} from '../../src/Head';
import { useTheme, useThemeController } from '../../src/Theme';
import { useDataProvider } from '../../src/providers/data/DataProviderContext';
import type { DataProviderAdapter } from '../../src/providers/data/DataProvider';
import type { IconComponentProps, IconProviderAdapter } from '../../src/providers/icon/IconProvider';
import {
    useIconController,
    useIconProvider,
} from '../../src/providers/icon/IconProviderContext';

function createDataProvider(id: string): DataProviderAdapter {
    return {
        id,
        read: vi.fn(),
        set: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        useListener: vi.fn(),
    } as unknown as DataProviderAdapter;
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
            <span data-testid="data-provider">{(dataProvider as DataProviderAdapter & { id?: string }).id}</span>
            {SearchIcon && <SearchIcon data-testid="resolved-icon" />}
        </div>
    );
}

function HeadProbePage() {
    return <Head title="Probe" description="Probe page" />;
}

function AdvancedHeadProbePage() {
    useSocialHead({
        openGraph: {
            title: 'Open Graph Probe',
            description: 'Social description',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Twitter Probe',
        },
    });
    useDocumentHead({
        canonical: 'https://example.test/probe',
    });
    useSchemaOrgHead({
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Probe',
        },
    });

    return null;
}

function TechnicalDocumentHeadProbePage() {
    useDocumentHead({
        robots: 'index,follow,max-snippet:-1',
        googlebot: 'index,follow',
        canonical: 'https://example.test/docs/page-2',
        ampHtml: 'https://example.test/amp/docs/page-2',
        sitemap: 'https://example.test/sitemap.xml',
        keywords: ['react', 'firestrap'],
        referrer: 'strict-origin-when-cross-origin',
    });
    usePaginationHead({
        prev: 'https://example.test/docs/page-1',
        next: 'https://example.test/docs/page-3',
    });

    return null;
}

function LanguageHeadProbePage() {
    useLanguageHead({
        lang: 'it',
        dir: 'ltr',
        alternates: [
            { hrefLang: 'en', href: 'https://example.test/en/docs/page-2' },
            { hrefLang: 'it', href: 'https://example.test/it/docs/page-2' },
            { hrefLang: 'x-default', href: 'https://example.test/docs/page-2' },
        ],
    });

    return null;
}

function DocumentAssetsPwaHeadProbePage() {
    useDocumentHead({
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        base: {
            href: 'https://example.test/docs/',
            target: '_self',
        },
        httpEquiv: {
            'x-ua-compatible': 'IE=edge',
        },
    });
    useAssetsHead({
        styles: [
            {
                href: 'data:text/css,body{}',
                inline: ':root { color-scheme: light dark; }',
            },
        ],
        scripts: [
            {
                src: '/widget.js',
                type: 'application/json',
                async: true,
                inline: 'window.__widgetReady = true;',
            },
        ],
        fonts: [
            {
                href: 'data:text/css,@font-face{}',
                preconnect: ['https://fonts.gstatic.com'],
                dnsPrefetch: ['https://fonts.googleapis.com'],
                preload: true,
                type: 'font/woff2',
                crossOrigin: 'anonymous',
            },
        ],
    });
    usePwaHead({
        manifest: '/site.webmanifest',
        themeColor: '#ffffff',
        colorScheme: 'light dark',
        applicationName: 'Probe App',
        favicon: '/favicon.ico',
        appleTouchIcon: '/apple-touch-icon.png',
        mobileWebAppCapable: true,
        appleMobileWebAppCapable: true,
    });

    return null;
}

function renderApp(props: Partial<React.ComponentProps<typeof App>> = {}) {
    window.history.pushState({}, '', '/probe');

    return render(
        <App
            importPage={() => Promise.reject(new Error('dynamic imports are not used in this test'))}
            menuConfig={{ main: [{ path: '/probe', page: ProbePage }] }}
            providers={{
                custom: {
                    data: createDataProvider('single-data'),
                },
                services: {
                    data: 'custom',
                },
            }}
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
                        colors: { primary: '346.8 77.2% 49.8%' },
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
        expect(document.getElementById('rf-preset-vars')?.textContent).toContain('--radius: 0.75rem');
    });

    it('passes custom icon providers through App iconProvider config', () => {
        const CustomIcon = (props: IconComponentProps) => <span {...props}>custom icon</span>;
        const customProvider: IconProviderAdapter = {
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
            providers: {
                custom: {
                    data: {
                        firebase: createDataProvider('firebase-data'),
                        mock: createDataProvider('mock-data'),
                    },
                },
                services: {
                    data: 'mock',
                },
            },
        });

        expect(screen.getByTestId('data-provider')).toHaveTextContent('mock-data');
    });

    it('applies page head metadata through HeadProvider', () => {
        renderApp({
            menuConfig: { main: [{ path: '/probe', page: HeadProbePage }] },
        });

        expect(document.title).toBe('Probe');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Probe page');
    });

    it('aggregates social, canonical and schema.org head segments', async () => {
        renderApp({
            menuConfig: { main: [{ path: '/probe', page: AdvancedHeadProbePage }] },
        });

        await waitFor(() => {
            expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Open Graph Probe');
        });
        expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', 'Social description');
        expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
        expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', 'Twitter Probe');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://example.test/probe');
        expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain('"@type":"WebPage"');
    });

    it('aggregates technical document metadata and pagination links', async () => {
        renderApp({
            menuConfig: { main: [{ path: '/probe', page: TechnicalDocumentHeadProbePage }] },
        });

        await waitFor(() => {
            expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index,follow,max-snippet:-1');
        });
        expect(document.querySelector('meta[name="googlebot"]')).toHaveAttribute('content', 'index,follow');
        expect(document.querySelector('meta[name="keywords"]')).toHaveAttribute('content', 'react, firestrap');
        expect(document.querySelector('meta[name="referrer"]')).toHaveAttribute('content', 'strict-origin-when-cross-origin');
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://example.test/docs/page-2');
        expect(document.querySelector('link[rel="prev"]')).toHaveAttribute('href', 'https://example.test/docs/page-1');
        expect(document.querySelector('link[rel="next"]')).toHaveAttribute('href', 'https://example.test/docs/page-3');
        expect(document.querySelector('link[rel="amphtml"]')).toHaveAttribute('href', 'https://example.test/amp/docs/page-2');
        expect(document.querySelector('link[rel="sitemap"]')).toHaveAttribute('href', 'https://example.test/sitemap.xml');
    });

    it('sets html language attributes and alternate language links', async () => {
        renderApp({
            menuConfig: { main: [{ path: '/probe', page: LanguageHeadProbePage }] },
        });

        await waitFor(() => {
            expect(document.documentElement.lang).toBe('it');
        });
        expect(document.documentElement.dir).toBe('ltr');
        expect(document.querySelector('link[rel="alternate"][hreflang="it"]')).toHaveAttribute('href', 'https://example.test/it/docs/page-2');
        expect(document.querySelector('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://example.test/docs/page-2');
    });

    it('aggregates document, asset and PWA head segments', async () => {
        renderApp({
            menuConfig: { main: [{ path: '/probe', page: DocumentAssetsPwaHeadProbePage }] },
        });

        await waitFor(() => {
            expect(document.querySelector('meta[charset="utf-8"]')).toBeInTheDocument();
        });
        expect(document.querySelector('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width, initial-scale=1');
        expect(document.querySelector('base')).toHaveAttribute('href', 'https://example.test/docs/');
        expect(document.querySelector('base')).toHaveAttribute('target', '_self');
        expect(document.querySelector('meta[http-equiv="x-ua-compatible"]')).toHaveAttribute('content', 'IE=edge');
        expect(document.querySelector('link[rel="stylesheet"][href="data:text/css,body{}"]')).toBeInTheDocument();
        expect(document.querySelector('style[data-rfs-head="asset-style"]')?.textContent).toContain('color-scheme');
        expect(document.querySelector('script[src="/widget.js"]')).toHaveAttribute('async');
        expect(Array.from(document.querySelectorAll('script[data-rfs-head="asset-script"]')).some((tag) => (
            tag.textContent?.includes('__widgetReady')
        ))).toBe(true);
        expect(document.querySelector('link[rel="preconnect"]')).toHaveAttribute('href', 'https://fonts.gstatic.com');
        expect(document.querySelector('link[rel="dns-prefetch"]')).toHaveAttribute('href', 'https://fonts.googleapis.com');
        expect(document.querySelector('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
        expect(document.querySelector('link[rel="icon"]')).toHaveAttribute('href', '/favicon.ico');
        expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#ffffff');
        expect(document.querySelector('meta[name="color-scheme"]')).toHaveAttribute('content', 'light dark');
        expect(document.querySelector('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
    });
});
