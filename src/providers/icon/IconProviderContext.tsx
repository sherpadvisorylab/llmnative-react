import React from 'react';
import type { IconProviderAdapter } from './IconProvider';
import { LucideIconProvider } from './LucideIconProvider';
import { PhosphorIconProvider } from './PhosphorIconProvider';

const IconProviderContext = React.createContext<IconProviderAdapter | null>(null);
const IconControllerContext = React.createContext<IconController | null>(null);

export type AppIconProviderConfig =
    | string
    | IconProviderAdapter
    | {
        default?: string;
        providers?: Record<string, IconProviderAdapter>;
        aliases?: Record<string, string>;
    };

export interface IconController {
    providerId: string;
    providers: Record<string, IconProviderAdapter>;
    aliases: Record<string, string>;
    setProvider: (id: string) => void;
    registerProvider: (id: string, provider: IconProviderAdapter) => void;
    resolve: IconProviderAdapter['resolve'];
}

const BUILT_IN_ICON_PROVIDERS: Record<string, IconProviderAdapter> = {
    lucide: new LucideIconProvider(),
    phosphor: new PhosphorIconProvider(),
};

const DEFAULT_ICON_PROVIDER_ID = 'lucide';

function isIconProvider(value: unknown): value is IconProviderAdapter {
    return Boolean(value)
        && typeof value === 'object'
        && typeof (value as IconProviderAdapter).id === 'string'
        && typeof (value as IconProviderAdapter).resolve === 'function';
}

function normalizeIconProviderConfig(config?: AppIconProviderConfig): {
    defaultId: string;
    providers: Record<string, IconProviderAdapter>;
    aliases: Record<string, string>;
} {
    if (typeof config === 'string') {
        return {
            defaultId: config,
            providers: { ...BUILT_IN_ICON_PROVIDERS },
            aliases: {},
        };
    }

    if (isIconProvider(config)) {
        return {
            defaultId: config.id,
            providers: { ...BUILT_IN_ICON_PROVIDERS, [config.id]: config },
            aliases: {},
        };
    }

    return {
        defaultId: config?.default ?? DEFAULT_ICON_PROVIDER_ID,
        providers: { ...BUILT_IN_ICON_PROVIDERS, ...(config?.providers ?? {}) },
        aliases: config?.aliases ?? {},
    };
}

function createAliasedProvider(provider: IconProviderAdapter, aliases: Record<string, string>): IconProviderAdapter {
    if (Object.keys(aliases).length === 0) return provider;

    return {
        id: provider.id,
        resolve(name) {
            return provider.resolve(aliases[name] ?? name);
        },
    };
}

export function IconProvider({
    provider,
    config,
    children,
}: {
    provider?: IconProviderAdapter;
    config?: AppIconProviderConfig;
    children: React.ReactNode;
}) {
    const normalized = React.useMemo(
        () => normalizeIconProviderConfig(config ?? provider),
        [config, provider]
    );
    const [providers, setProviders] = React.useState(normalized.providers);
    const [providerId, setProviderId] = React.useState(normalized.defaultId);

    React.useEffect(() => {
        setProviders(normalized.providers);
        setProviderId(normalized.defaultId);
    }, [normalized]);

    const activeProvider = providers[providerId] ?? providers[DEFAULT_ICON_PROVIDER_ID];
    const providerWithAliases = React.useMemo(
        () => activeProvider ? createAliasedProvider(activeProvider, normalized.aliases) : null,
        [activeProvider, normalized.aliases]
    );

    const controller = React.useMemo<IconController>(() => ({
        providerId: activeProvider?.id ?? DEFAULT_ICON_PROVIDER_ID,
        providers,
        aliases: normalized.aliases,
        setProvider(id: string) {
            if (providers[id]) {
                setProviderId(id);
                return;
            }

            if (process.env.NODE_ENV !== 'production') {
                console.warn(`[IconProvider] Unknown provider "${id}", falling back to "${DEFAULT_ICON_PROVIDER_ID}".`);
            }
            setProviderId(DEFAULT_ICON_PROVIDER_ID);
        },
        registerProvider(id: string, registeredProvider: IconProviderAdapter) {
            setProviders((current) => ({ ...current, [id]: registeredProvider }));
        },
        resolve(name: string) {
            return providerWithAliases?.resolve(name) ?? null;
        },
    }), [activeProvider, providers, normalized.aliases, providerWithAliases]);

    return (
        <IconControllerContext.Provider value={controller}>
            <IconProviderContext.Provider value={providerWithAliases}>
                {children}
            </IconProviderContext.Provider>
        </IconControllerContext.Provider>
    );
}

export function useIconProvider(): IconProviderAdapter | null {
    return React.useContext(IconProviderContext);
}

export function useIconController(): IconController {
    const controller = React.useContext(IconControllerContext);
    if (!controller) {
        throw new Error('useIconController must be used inside <App> or <IconProvider>.');
    }
    return controller;
}
