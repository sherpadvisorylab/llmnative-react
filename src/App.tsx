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
import { GlobalProvider } from "./Global";
import Alert from "./components/ui/Alert";
import {
    AIConfig,
    ConfigProvider,
    DropboxConfig,
    FirebaseConfig,
    GoogleOAuth2,
    GoogleServiceAccount,
    ScrapeConfig
} from "./Config";
import { DataProvider } from "./providers/data/DataProvider";
import { DataProviderProvider } from "./providers/data/DataProviderContext";
import { StorageProvider } from "./providers/storage/StorageProvider";
import { StorageProviderProvider } from "./providers/storage/StorageProviderContext";
import { FirebaseDataProvider } from "./providers/data/firebase";
import { FirebaseStorageProvider } from "./providers/storage/firebase";
import { AuthProvider } from "./providers/auth/AuthProvider";
import { AuthProviderProvider } from "./providers/auth/AuthProviderContext";
import { GoogleAuthProvider } from "./providers/auth/google/GoogleAuthProvider";
import { EmailProvider } from "./providers/email/EmailProvider";
import { EmailProviderProvider } from "./providers/email/EmailProviderContext";
import { IconProviderProvider, type AppIconProviderConfig } from "./providers/icon/IconProviderContext";



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

type ProviderMap = {
    data?: Record<string, DataProvider>;
    storage?: Record<string, StorageProvider>;
    auth?: Record<string, AuthProvider>;
    email?: Record<string, EmailProvider>;
};

type DefaultProviderKeys = {
    data?: string;
    storage?: string;
    auth?: string;
    email?: string;
};

type AppProps = {
    firebaseConfig?: FirebaseConfig;
    oAuth2?: GoogleOAuth2;
    serviceAccount?: GoogleServiceAccount;
    dropBoxConfig?: DropboxConfig;
    aiConfig?: AIConfig;
    scrapeConfig?: ScrapeConfig;
    tenantsURI?: string;
    proxyURI?: string;
    importPage: (pagesPath: string) => Promise<{ default: React.ComponentType }>;
    importTheme?: () => Promise<{ theme: object }>;
    LayoutDefault?: React.ComponentType;
    menuConfig: MenuConfig;
    // Single-provider shorthand (backward compat)
    dataProvider?: DataProvider;
    storageProvider?: StorageProvider;
    authProvider?: AuthProvider;
    emailProvider?: EmailProvider;
    // Named registry: multiple providers of the same type
    providers?: ProviderMap;
    // Which name to use as default — consumer can drive this from env vars
    defaultProviders?: DefaultProviderKeys;
    /** Icon provider registry config. String shorthand selects the default provider id. */
    iconProvider?: AppIconProviderConfig;
    /** Theme registry config. String shorthand selects the default preset id. */
    themeProvider?: AppThemeProviderConfig;
};

function buildRegistry<T>(
    single: T | undefined,
    map: Record<string, T> | undefined,
    defaultKey: string | undefined,
    fallback: T
): { registry: Record<string, T>; defaultKey: string } {
    if (map && Object.keys(map).length > 0) {
        return { registry: map, defaultKey: defaultKey ?? Object.keys(map)[0] };
    }
    const resolved = single ?? fallback;
    return { registry: { default: resolved }, defaultKey: 'default' };
}

function buildOptionalRegistry<T>(
    single: T | undefined,
    map: Record<string, T> | undefined,
    defaultKey: string | undefined
): { registry: Record<string, T>; defaultKey: string } {
    if (map && Object.keys(map).length > 0) {
        return { registry: map, defaultKey: defaultKey ?? Object.keys(map)[0] };
    }
    if (single) {
        return { registry: { default: single }, defaultKey: 'default' };
    }
    return { registry: {}, defaultKey: 'default' };
}

const MaybeEmailProvider = ({
    registry,
    defaultKey,
    children,
}: {
    registry: Record<string, EmailProvider>;
    defaultKey: string;
    children: React.ReactNode;
}) => Object.keys(registry).length > 0
    ? <EmailProviderProvider registry={registry} defaultKey={defaultKey}>{children}</EmailProviderProvider>
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
                 firebaseConfig,
                 oAuth2,
                 importTheme        = undefined,
                 LayoutDefault      = undefined,
                 serviceAccount     = undefined,
                 dropBoxConfig      = undefined,
                 aiConfig           = undefined,
                 scrapeConfig       = undefined,
                 tenantsURI         = undefined,
                 proxyURI           = undefined,
                 menuConfig         = {},
                 dataProvider,
                 storageProvider,
                 authProvider,
                 emailProvider,
                 providers,
                 defaultProviders,
                 iconProvider,
                 themeProvider,
}: AppProps) {
    const dataRegistry    = buildRegistry(dataProvider, providers?.data, defaultProviders?.data, new FirebaseDataProvider());
    const storageRegistry = buildOptionalRegistry(storageProvider, providers?.storage, defaultProviders?.storage);
    const authRegistry    = buildRegistry(authProvider, providers?.auth, defaultProviders?.auth, new GoogleAuthProvider());
    const emailRegistry   = buildOptionalRegistry(emailProvider, providers?.email, defaultProviders?.email);
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
            <ConfigProvider defaultConfig={{
                title: "Default",
                firebase: firebaseConfig as FirebaseConfig,
                google: { oAuth2: oAuth2 as GoogleOAuth2, serviceAccount },
                dropbox: dropBoxConfig,
                ai: aiConfig,
                scrape: scrapeConfig,
                proxyURI: proxyURI
            }} tenantsURI={tenantsURI}>
                <GlobalProvider>
                    <AuthProviderProvider {...authRegistry}>
                    <DataProviderProvider {...dataRegistry}>
                    <StorageProviderProvider {...storageRegistry}>
                    <MaybeEmailProvider registry={emailRegistry.registry} defaultKey={emailRegistry.defaultKey}>
                    <IconProviderProvider config={iconProvider}>
                    <ThemeProvider importTheme={importTheme} config={themeProvider}>
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
                    </IconProviderProvider>
                    </MaybeEmailProvider>
                    </StorageProviderProvider>
                    </DataProviderProvider>
                    </AuthProviderProvider>
                </GlobalProvider>
            </ConfigProvider>
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
