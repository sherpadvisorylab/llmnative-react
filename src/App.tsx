import React, { useState, Suspense, useMemo, useRef } from 'react';
import {
    BrowserRouter,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';

import Authorize, { AUTH_REDIRECT_URI } from "./auth";
import { converter as convert } from "./libs/converter";
import { AppThemeProviderConfig, ThemeProvider } from "./Theme";
import Users from "./pages/Users";
import NotFound from './pages/NotFound';
import Alert from "./components/ui/Alert";
import ErrorBoundary from "./components/ErrorBoundary";

const PageLoader = () => (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
);
import {
    AIConfig,
    DropboxConfig,
    ProxyConfig,
    FirebaseConfig,
    RuntimeProvider,
    ScrapeConfig
} from "./Config";
import type { AIProviderAdapter } from "./providers/ai";
import { AIProvider } from "./providers/ai/AIProviderContext";
import type { DataProviderAdapter } from "./providers/data/DataProvider";
import { DataProvider } from "./providers/data/DataProviderContext";
import type { StorageProviderAdapter } from "./providers/storage/StorageProvider";
import { StorageProvider } from "./providers/storage/StorageProviderContext";
import { MockDataProvider } from "./providers/data/mock";
import type { AuthProviderAdapter } from "./providers/auth/AuthProvider";
import { AuthProvider } from "./providers/auth/AuthProviderContext";
import { GoogleAuthProvider } from "./providers/auth/google/GoogleAuthProvider";
import type { EmailProviderAdapter } from "./providers/email/EmailProvider";
import { EmailProvider } from "./providers/email/EmailProviderContext";
import type { CredentialsAdapter } from "./providers/credentials/CredentialsProvider";
import { CredentialsProvider } from "./providers/credentials/CredentialsProviderContext";
import { IconProvider, type AppIconProviderConfig } from "./providers/icon/IconProviderContext";
import { HeadProvider } from "./Head";
import { I18nProvider, type I18nConfig } from "./I18n";
import {
    PROVIDER_MANIFESTS,
    type ServicesConfig,
    type GoogleProviderConfig,
    type SupabaseProviderConfig,
    type MockProviderConfig,
} from "./providers/manifest";
import { ProviderRegistryProvider, type SetProviderFn } from "./providers/ProviderRegistryContext";



interface MenuItem {
    path: string;
    title?: string;
    icon?: string;
    children?: MenuItem[];
    page?: React.ComponentType;
    layout?: React.ComponentType;
    component?: string;
    [key: string]: unknown;
}

export interface UseMenuItem extends MenuItem {
    active: boolean;
    onClick?: () => void;
}

export type MenuConfig = {
    [key: string]: (MenuItem & {
        page?: React.ComponentType;
        layout?: React.ComponentType;
    })[];
};

export type AppProvidersConfig = {
    firebase?: FirebaseConfig;
    supabase?: SupabaseProviderConfig;
    google?: GoogleProviderConfig;
    dropbox?: DropboxConfig;
    mock?: MockProviderConfig;
    ai?: AIConfig;
    proxy?: ProxyConfig;
    /**
     * Pre-built adapter instances, registered directly rather than resolved from a
     * vendor config above. The 6 named categories are typed for convenience, but any
     * other key works too — an entirely new category the framework has no built-in
     * knowledge of (e.g. `{ payments: { stripe: new StripeAdapter() } }`). Consume a
     * custom category with useProvider('payments', 'stripe') — see ProviderRegistryContext.
     */
    custom?: {
        data?:        Record<string, DataProviderAdapter>    | DataProviderAdapter;
        storage?:     Record<string, StorageProviderAdapter> | StorageProviderAdapter;
        auth?:        Record<string, AuthProviderAdapter>    | AuthProviderAdapter;
        email?:       Record<string, EmailProviderAdapter>   | EmailProviderAdapter;
        ai?:          Record<string, AIProviderAdapter>      | AIProviderAdapter;
        credentials?: Record<string, CredentialsAdapter>     | CredentialsAdapter;
        [category: string]: unknown;
    };
    services?: ServicesConfig;
};

/**
 * Props for AppProvider — the full framework provider stack.
 * Vertical apps can inject their own context layer via `contextProviders`.
 */
export type AppProviderProps = {
    /**
     * A React component that wraps the entire app tree (bridge components + Routes)
     * from inside the framework's DataProvider. Use this to inject vertical-specific
     * context providers (auth, tenant, site selection, …) that need access to
     * framework providers (useDataProvider, useI18n, etc.) without a singleton bridge.
     *
     * @example
     * function CmsProviders({ children }) {
     *   return <AuthProvider><TenantProvider><SiteProvider>{children}</SiteProvider></TenantProvider></AuthProvider>;
     * }
     * <App contextProviders={CmsProviders} ... />
     */
    contextProviders?: React.ComponentType<{ children: React.ReactNode }>;
    appName?: string;
    scrapeConfig?: ScrapeConfig;
    providers?: AppProvidersConfig;
    /** Icon provider registry config. String shorthand selects the default provider id. */
    iconProvider?: AppIconProviderConfig;
    /** Theme registry config. String shorthand selects the active theme id. */
    themeProvider?: AppThemeProviderConfig;
    /** Internationalization config: locale and per-locale translation overrides. */
    i18n?: I18nConfig;
    children?: React.ReactNode;
    /** POST endpoint for error reports. When set, a "Send report" button appears in the error boundary. */
    errorReportUrl?: string;
    /** Force debug mode in error boundaries (shows stack trace, component tree, browser context). Auto-enabled in DEV builds. */
    debug?: boolean;
};

/** Full App props: AppProviderProps + routing-specific config. */
export type AppProps = AppProviderProps & {
    importPage: (pagesPath: string) => Promise<{ default: React.ComponentType }>;
    LayoutDefault?: React.ComponentType;
    menuConfig: MenuConfig;
};

function addCustomProviders<T>(registry: Record<string, T>, custom?: Record<string, T> | T): void {
    if (!custom) return;
    const candidate = custom as Record<string, T>;
    const entries = typeof custom === 'object' && !Array.isArray(custom) ? Object.entries(candidate) : [];
    const isNamedMap = entries.length > 0 && entries.every(([, value]) => typeof value === 'object' && value !== null);

    if (isNamedMap) {
        Object.assign(registry, candidate);
        return;
    }

    registry.custom = custom as T;
}

function selectDefaultKey<T>(registry: Record<string, T>, preferred?: string, emptyFallback = 'default'): string {
    if (preferred && registry[preferred]) return preferred;
    return Object.keys(registry)[0] ?? emptyFallback;
}

/**
 * category → registry of adapters. Open-ended: the 6 built-in categories
 * (data/storage/auth/email/ai/credentials) are always present, but a vertical
 * can add entirely new categories via providers.custom.<anyName>, or later at
 * runtime via setProvider() — this map has no fixed shape.
 */
type ProviderRegistries = Record<string, Record<string, unknown>>; // CR-042: heterogeneous adapter map, each category registry has a different value type

function resolveProviderRegistries(providers: AppProvidersConfig = {}) {
    const registries: ProviderRegistries = { data: {}, storage: {}, auth: {}, email: {}, ai: {}, credentials: {} };
    const ensure = (category: string) => (registries[category] ??= {});

    // Manifest-driven: one loop for all providers - adding a new provider
    // only requires a new entry in PROVIDER_MANIFESTS, not a change here.
    for (const [providerKey, manifest] of Object.entries(PROVIDER_MANIFESTS)) {
        const cfg = (providers as Record<string, unknown>)[providerKey];
        if (cfg === undefined) continue;
        for (const [driverName, descriptor] of Object.entries(manifest)) {
            if (descriptor.when && !descriptor.when(cfg)) continue;
            ensure(descriptor.service)[driverName] = descriptor.create(cfg);
        }
    }

    // One loop for every key in `custom`, known category or brand new one alike —
    // providers.custom.data and providers.custom.payments are handled identically.
    for (const [category, value] of Object.entries(providers.custom ?? {})) {
        addCustomProviders(ensure(category), value);
    }

    if (Object.keys(registries.data).length === 0) registries.data.mock = new MockDataProvider();
    if (Object.keys(registries.auth).length === 0) registries.auth.googleAuth = new GoogleAuthProvider();

    const svc = (providers.services ?? {}) as Record<string, string | undefined>;

    const resolved: Record<string, { registry: Record<string, unknown>; defaultKey: string }> = {};
    for (const [category, registry] of Object.entries(registries)) {
        resolved[category] = { registry, defaultKey: selectDefaultKey(registry, svc[category]) };
    }
    return resolved as {
        data:        { registry: Record<string, DataProviderAdapter>;    defaultKey: string };
        storage:     { registry: Record<string, StorageProviderAdapter>; defaultKey: string };
        auth:        { registry: Record<string, AuthProviderAdapter>;    defaultKey: string };
        email:       { registry: Record<string, EmailProviderAdapter>;   defaultKey: string };
        ai:          { registry: Record<string, AIProviderAdapter>;      defaultKey: string };
        credentials: { registry: Record<string, CredentialsAdapter>;     defaultKey: string };
        [category: string]: { registry: Record<string, unknown>; defaultKey: string };
    };
}

let menu: MenuConfig = {};
export const setStaticMenu = (config: MenuConfig) => {
    menu = config;
};
export const getStaticMenu = (type: string): MenuItem[] => {
    return menu[type] || [];
};
export const getContextMenu = (): string[] => {
    return Object.keys(menu);
};

/**
 * The full framework provider stack as a standalone component.
 *
 * Wraps children with: ErrorBoundary → BrowserRouter → RuntimeProvider →
 * AuthProvider → CredentialsProvider → DataProvider → StorageProvider →
 * EmailProvider → AIProvider → IconProvider → HeadProvider → I18nProvider →
 * ThemeProvider → [contextProviders] → children.
 *
 * `contextProviders` runs inside DataProvider, so vertical-specific providers
 * mounted there can call `useDataProvider()`, `useI18n()`, etc. directly.
 *
 * `App` uses `AppProvider` internally. Use `AppProvider` directly only when
 * you need the provider stack without the routing layer (e.g. tests, Storybook).
 */
export function AppProvider({
    contextProviders,
    providers = {},
    appName = 'LLM Native',
    scrapeConfig,
    iconProvider,
    themeProvider,
    i18n,
    children,
    errorReportUrl,
    debug,
}: AppProviderProps) {
    const [registries, setRegistries] = useState(() => resolveProviderRegistries(providers));

    // Mirror so setProvider always reads the latest registries synchronously,
    // even across multiple calls before a re-render commits.
    const registriesRef = useRef(registries);
    registriesRef.current = registries;

    const setProviderRef = useRef<SetProviderFn>();
    if (!setProviderRef.current) {
        // Untyped internally (heterogeneous adapter map, same pattern as resolveProviderRegistries
        // below) — SetProviderFn's generic signature is the public, type-safe surface callers see.
        // `category` may not exist yet (a vertical registering a brand new category at runtime,
        // not just at bootstrap) — every access below falls back gracefully instead of assuming it does.
        setProviderRef.current = (async (category: string, key: string, adapter: { dispose?(): Promise<void> | void }) => {
            const prevRegistry = registriesRef.current[category]?.registry as Record<string, { dispose?(): Promise<void> | void }> | undefined;
            await prevRegistry?.[key]?.dispose?.();
            setRegistries(current => ({
                ...current,
                [category]: {
                    defaultKey: current[category]?.defaultKey ?? key,
                    registry: { ...current[category]?.registry, [key]: adapter },
                },
            }));
        }) as SetProviderFn;
    }
    const setProvider = setProviderRef.current;

    const ContextProviders = contextProviders ?? React.Fragment;

    return (
        <ErrorBoundary fullPage reportUrl={errorReportUrl} debug={debug}>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <RuntimeProvider defaultConfig={{
                title: appName,
                firebase: providers.firebase,
                google: providers.google
                    ? {
                        oAuth2: { clientId: providers.google.clientId, scope: providers.google.scope },
                        serviceAccount: providers.google.serviceAccount,
                        developerToken: providers.google.developerToken,
                    }
                    : undefined,
                dropbox: providers.dropbox,
                ai: providers.ai,
                scrape: scrapeConfig,
                proxy: providers.proxy,
            }}>
                <ProviderRegistryProvider registries={registries} setProvider={setProvider}>
                <AuthProvider {...registries.auth}>
                    <CredentialsProvider {...registries.credentials}>
                    <DataProvider {...registries.data}>
                        <StorageProvider {...registries.storage}>
                            <EmailProvider {...registries.email}>
                                <AIProvider {...registries.ai}>
                                    <IconProvider config={iconProvider}>
                                        <HeadProvider appName={appName}>
                                            <I18nProvider config={i18n}>
                                            <ThemeProvider config={themeProvider}>
                                                <ContextProviders>
                                                    {children}
                                                </ContextProviders>
                                            </ThemeProvider>
                                            </I18nProvider>
                                        </HeadProvider>
                                    </IconProvider>
                                </AIProvider>
                            </EmailProvider>
                        </StorageProvider>
                    </DataProvider>
                    </CredentialsProvider>
                </AuthProvider>
                </ProviderRegistryProvider>
            </RuntimeProvider>
        </BrowserRouter>
        </ErrorBoundary>
    );
}

function App({
    importPage,
    LayoutDefault = undefined,
    menuConfig = {},
    children,
    ...providerProps
}: AppProps) {
    setStaticMenu(menuConfig);

    const LayoutEmpty = ({ children }: { children: React.ReactNode }) => <>{children}</>;
    const FallbackPage: React.FC<{ pageSource: string, message?: string }> = ({ pageSource, message }) => (
        <Alert variant="warning">Missing Page: {pageSource}
            {message && <code className={"ml-2"}>{message}</code>}
        </Alert>
    );

    function getRoute(key: string, item: MenuItem, index: number): React.ReactElement {
        const component = item.component ? "/" + item.component :
            (item.path === "/"
                ? "/Home"
                : convert.toCamel(item.path.split("*")[0])
            );
        const pageSource = `./pages${component}.js`;

        const PageComponent = item.page || React.lazy(() =>
            importPage(pageSource)
                .then((mod): { default: React.ComponentType<any> } => {
                    if (typeof mod.default !== 'function') {
                        console.warn(`⚠️ Invalid default export in ${pageSource}`);
                        return { default: () => <FallbackPage pageSource={pageSource} /> };
                    }

                    return { default: mod.default };
                })
                .catch((err: Error): { default: React.ComponentType<any> } => {
                    console.error(`❌ Failed to load ${pageSource}:`, err);
                    return { default: () => <FallbackPage pageSource={pageSource} message={err.message} /> };
                })
        );

        const LayoutComponent = item.layout || LayoutDefault || LayoutEmpty;
        return (
            <Route
                key={`${key}-${index}`}
                path={item.path}
                element={
                    <LayoutComponent>
                        <ErrorBoundary key={item.path} reportUrl={providerProps.errorReportUrl} debug={providerProps.debug}>
                            <Suspense fallback={<PageLoader />}>
                                <PageComponent />
                            </Suspense>
                        </ErrorBoundary>
                    </LayoutComponent>
                }
            />
        );
    }

    const renderRoutes = (menuObject: MenuConfig): React.ReactNode[] =>
        Object.keys(menuObject).flatMap(key =>
            menuObject[key].flatMap((item, index) => [
                item.path && getRoute(key, item, index),
                item.children && renderRoutes({ children: item.children })
            ].filter(Boolean))
        );

    return (
        <AppProvider {...providerProps}>
            {children}
            <Routes>
                <Route path={AUTH_REDIRECT_URI} element={<Authorize />}></Route>
                <>
                    {renderRoutes({
                        default: [{ path: "/" }], ...{
                            ...menu,
                            _auth: [{
                                path: "/users",
                                page: Users,
                                layout: LayoutDefault
                            }]
                        }
                    })}
                </>
                <Route path='*' element={<NotFound />}></Route>
            </Routes>
        </AppProvider>
    );
}


export const useMenu = (type: string): UseMenuItem[] => {
    const menuItems: MenuItem[] = getStaticMenu(type);
    const location = useLocation();

    // Funzione ricorsiva per determinare se l'item o uno dei suoi figli è attivo
    const markActive = (items: MenuItem[]): UseMenuItem[] => {
        return items.map((item) => {
            // Determina se l'item è attivo in base alla path
            const isActive = location.pathname === item.path;

            // Se ha dei figli, applica markActive ricorsivamente
            const children = item.children ? markActive(item.children) : [];

            // Se uno dei figli è attivo, il genitore diventa attivo
            const active = isActive || children.some(child => child.active);

            return {
                ...item,
                active,
                children
            };
        });
    };

    // Ottieni il menu processato e memorizza i risultati
    return useMemo(() => markActive(menuItems), [location.pathname]);
};

export default App;
