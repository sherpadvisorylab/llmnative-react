import React, { useState, Suspense, useMemo } from 'react';
import {
    BrowserRouter,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';

import Authorize, {AUTH_REDIRECT_URI} from "./auth";
import {converter as convert} from "./libs/converter";
import { AppThemeProviderConfig, ThemeProvider } from "./Theme";
import Users from "./pages/Users";
import NotFound from './pages/NotFound';
import Alert from "./components/ui/Alert";
import {
    AIConfig,
    DropboxConfig,
    FirebaseConfig,
    GoogleOAuth2,
    GoogleServiceAccount,
    RuntimeProvider,
    ScrapeConfig
} from "./Config";
import type { DataProviderAdapter } from "./providers/data/DataProvider";
import { DataProvider } from "./providers/data/DataProviderContext";
import type { StorageProviderAdapter } from "./providers/storage/StorageProvider";
import { StorageProvider } from "./providers/storage/StorageProviderContext";
import { FirebaseDataProvider } from "./providers/data/firebase";
import { SupabaseDataProvider } from "./providers/data/supabase";
import { MockDataProvider } from "./providers/data/mock";
import { FirebaseStorageProvider } from "./providers/storage/firebase";
import { SupabaseStorageProvider } from "./providers/storage/supabase";
import type { AuthProviderAdapter } from "./providers/auth/AuthProvider";
import { AuthProvider } from "./providers/auth/AuthProviderContext";
import { GoogleAuthProvider } from "./providers/auth/google/GoogleAuthProvider";
import type { EmailProviderAdapter } from "./providers/email/EmailProvider";
import { EmailProvider } from "./providers/email/EmailProviderContext";
import { GmailEmailProvider } from "./providers/email/google/GmailEmailProvider";
import { IconProvider, type AppIconProviderConfig } from "./providers/icon/IconProviderContext";
import { HeadProvider } from "./Head";



interface MenuItem {
    path: string;
    title?: string;
    icon?: string;
    children?: MenuItem[];
    [key: string]: any;
}

interface UseMenuItem extends MenuItem {
    active: boolean;
    onClick?: () => void;
}

type MenuConfig = {
    [key: string]: (MenuItem & {
        page?: React.ComponentType;
        layout?: React.ComponentType;
    })[];
};

export type SupabaseProviderConfig = {
    url: string;
    anonKey: string;
    bucket?: string;
};

export type AppProvidersConfig = {
    default?: string;
    firebase?: FirebaseConfig;
    supabase?: SupabaseProviderConfig;
    google?: GoogleOAuth2 & {
        serviceAccount?: GoogleServiceAccount;
        developerToken?: string;
    };
    dropbox?: DropboxConfig;
    gmail?: {
        enabled?: boolean;
    };
    mock?: {
        data?: ConstructorParameters<typeof MockDataProvider>[0];
    };
    custom?: {
        data?: Record<string, DataProviderAdapter> | DataProviderAdapter;
        storage?: Record<string, StorageProviderAdapter> | StorageProviderAdapter;
        auth?: Record<string, AuthProviderAdapter> | AuthProviderAdapter;
        email?: Record<string, EmailProviderAdapter> | EmailProviderAdapter;
    };
    services?: {
        data?: string;
        storage?: string;
        auth?: string;
        email?: string;
    };
};
export type AppProps = {
    appName?: string;
    aiConfig?: AIConfig;
    scrapeConfig?: ScrapeConfig;
    tenantsURI?: string;
    proxyURI?: string;
    importPage: (pagesPath: string) => Promise<{ default: React.ComponentType }>;
    importTheme?: () => Promise<{ theme: object }>;
    LayoutDefault?: React.ComponentType;
    menuConfig: MenuConfig;
    providers?: AppProvidersConfig;
    /** Icon provider registry config. String shorthand selects the default provider id. */
    iconProvider?: AppIconProviderConfig;
    /** Theme registry config. String shorthand selects the default preset id. */
    themeProvider?: AppThemeProviderConfig;
    children?: React.ReactNode;
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

function selectDefaultKey<T>(registry: Record<string, T>, preferred?: string, fallback?: string): string {
    if (preferred && registry[preferred]) return preferred;
    if (fallback && registry[fallback]) return fallback;
    return Object.keys(registry)[0] ?? 'default';
}

function resolveProviderRegistries(providers: AppProvidersConfig = {}) {
    const data: Record<string, DataProviderAdapter> = {};
    const storage: Record<string, StorageProviderAdapter> = {};
    const auth: Record<string, AuthProviderAdapter> = {};
    const email: Record<string, EmailProviderAdapter> = {};

    if (providers.firebase) {
        data.firebase = new FirebaseDataProvider();
        storage.firebase = new FirebaseStorageProvider();
        auth.firebase = new GoogleAuthProvider();
    }

    if (providers.supabase) {
        data.supabase = new SupabaseDataProvider(providers.supabase);
        storage.supabase = new SupabaseStorageProvider(providers.supabase);
    }

    if (providers.google) {
        auth.google = new GoogleAuthProvider();
    }

    if (providers.gmail?.enabled) {
        email.gmail = new GmailEmailProvider();
    }

    if (providers.mock) {
        data.mock = new MockDataProvider(providers.mock.data);
    }

    addCustomProviders(data, providers.custom?.data);
    addCustomProviders(storage, providers.custom?.storage);
    addCustomProviders(auth, providers.custom?.auth);
    addCustomProviders(email, providers.custom?.email);

    if (Object.keys(data).length === 0) data.mock = new MockDataProvider();
    if (Object.keys(auth).length === 0) auth.google = new GoogleAuthProvider();

    const defaultProvider = providers.default;

    return {
        data: {
            registry: data,
            defaultKey: selectDefaultKey(data, providers.services?.data, defaultProvider),
        },
        storage: {
            registry: storage,
            defaultKey: selectDefaultKey(storage, providers.services?.storage, defaultProvider),
        },
        auth: {
            registry: auth,
            defaultKey: selectDefaultKey(auth, providers.services?.auth, providers.google ? 'google' : defaultProvider),
        },
        email: {
            registry: email,
            defaultKey: selectDefaultKey(email, providers.services?.email, providers.gmail ? 'gmail' : defaultProvider),
        },
    };
}
const MaybeEmailProvider = ({
    registry,
    defaultKey,
    children,
}: {
    registry: Record<string, EmailProviderAdapter>;
    defaultKey: string;
    children: React.ReactNode;
}) => Object.keys(registry).length > 0
    ? <EmailProvider registry={registry} defaultKey={defaultKey}>{children}</EmailProvider>
    : <>{children}</>;

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

function App({
                 importPage,
                 importTheme        = undefined,
                 LayoutDefault      = undefined,
                 aiConfig           = undefined,
                 scrapeConfig       = undefined,
                 tenantsURI         = undefined,
                 proxyURI           = undefined,
                 appName            = "react-firestrap",
                 menuConfig         = {},
                 providers          = {},
                 iconProvider,
                 themeProvider,
                 children,
}: AppProps) {
    const providerRegistries = resolveProviderRegistries(providers);
    const dataRegistry = providerRegistries.data;
    const storageRegistry = providerRegistries.storage;
    const authRegistry = providerRegistries.auth;
    const emailRegistry = providerRegistries.email;
    setStaticMenu(menuConfig);

    const LayoutEmpty = ({ children }: { children: React.ReactNode }) => <>{children}</>;
    const FallbackPage: React.FC<{ pageSource: string, message?: string }> = ({ pageSource, message }) => (
        <Alert type="warning">Missing Page: {pageSource}
            {message && <code className={"ms-2"}>{message}</code>}
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
                        <Suspense fallback={<div>Loading...</div>}>
                            <PageComponent />
                        </Suspense>
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
                ai: aiConfig,
                scrape: scrapeConfig,
                proxyURI: proxyURI
            }} tenantsURI={tenantsURI}>
                    <AuthProvider {...authRegistry}>
                    <DataProvider {...dataRegistry}>
                    <StorageProvider {...storageRegistry}>
                    <MaybeEmailProvider registry={emailRegistry.registry} defaultKey={emailRegistry.defaultKey}>
                    <IconProvider config={iconProvider}>
                    <HeadProvider appName={appName}>
                    <ThemeProvider importTheme={importTheme} config={themeProvider}>
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
                    </ThemeProvider>
                    </HeadProvider>
                    </IconProvider>
                    </MaybeEmailProvider>
                    </StorageProvider>
                    </DataProvider>
                    </AuthProvider>
            </RuntimeProvider>
        </BrowserRouter>
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
