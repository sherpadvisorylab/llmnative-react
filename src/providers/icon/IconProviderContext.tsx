import React from 'react';
import type { IconProviderAdapter } from './IconProvider';
import { LucideIconProvider } from './LucideIconProvider';
import { PhosphorIconProvider } from './PhosphorIconProvider';

const IconProviderContext = React.createContext<IconProviderAdapter | null>(null);
const IconControllerContext = React.createContext<IconController | null>(null);

/** Built-in icon provider identifiers. */
export type BuiltInIconProviderId = 'lucide' | 'phosphor';

/**
 * Configuration for the icon provider.
 *
 * - `BuiltInIconProviderId` string: selects a built-in provider (`'lucide'` | `'phosphor'`)
 * - `IconProviderAdapter` instance: use a custom provider directly
 * - object `{ provider, aliases? }`: custom provider with optional icon name aliases
 *
 * @example
 * iconProvider="phosphor"
 *
 * @example
 * iconProvider={new HeroIconProvider()}
 *
 * @example
 * iconProvider={{ provider: new HeroIconProvider(), aliases: { delete: 'trash', edit: 'pencil' } }}
 */
export type AppIconProviderConfig =
    | BuiltInIconProviderId
    | IconProviderAdapter
    | {
        /** The icon provider instance to use. */
        provider: IconProviderAdapter;
        /** Map icon name aliases to actual icon names in this provider (`{ delete: 'trash' }`). */
        aliases?: Record<string, string>;
    }
    | {
        /** ID of the default provider to activate. Must be a key in `providers` or a built-in id. */
        default: string;
        /** Additional providers to register alongside the built-in ones. */
        providers: Record<string, IconProviderAdapter>;
        /** Map icon name aliases to actual icon names (`{ delete: 'trash' }`). */
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

// ── CR-154: providers whose package loads on demand ───────────────────────────

const loads = new WeakMap<IconProviderAdapter, Promise<void>>();

/** The load of a provider, once; a package that is not there leaves its icons empty, the app keeps working. */
export function loadIconProvider(provider: IconProviderAdapter | null | undefined): Promise<void> {
    if (!provider?.load || provider.isReady?.() !== false) return Promise.resolve();
    let pending = loads.get(provider);
    if (!pending) {
        pending = provider.load().catch((error: unknown) => {
            loads.delete(provider);
            console.warn(`[IconProvider] "${provider.id}" could not load:`, error instanceof Error ? error.message : error);
        });
        loads.set(provider, pending);
    }
    return pending;
}

/** True when the provider can resolve its icons now; otherwise it loads it and renders again once it can. */
export function useIconProviderReady(provider: IconProviderAdapter | null | undefined): boolean {
    const ready = !provider || provider.isReady?.() !== false;
    const [, rerender] = React.useReducer((n: number) => n + 1, 0);
    React.useEffect(() => {
        if (ready) return;
        let live = true;
        void loadIconProvider(provider).then(() => { if (live) rerender(); });
        return () => { live = false; };
    }, [ready, provider]);
    return ready;
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
    if (!config) {
        return { defaultId: DEFAULT_ICON_PROVIDER_ID, providers: { ...BUILT_IN_ICON_PROVIDERS }, aliases: {} };
    }

    if (typeof config === 'string') {
        return { defaultId: config, providers: { ...BUILT_IN_ICON_PROVIDERS }, aliases: {} };
    }

    if (isIconProvider(config)) {
        return {
            defaultId: config.id,
            providers: { ...BUILT_IN_ICON_PROVIDERS, [config.id]: config },
            aliases: {},
        };
    }

    // multi-provider form: { default, providers, aliases? }
    if ('default' in config && 'providers' in config) {
        const c = config as { default: string; providers: Record<string, IconProviderAdapter>; aliases?: Record<string, string> };
        return {
            defaultId: c.default,
            providers: { ...BUILT_IN_ICON_PROVIDERS, ...c.providers },
            aliases: c.aliases ?? {},
        };
    }

    // single-provider form: { provider, aliases? }
    return {
        defaultId: config.provider.id,
        providers: { ...BUILT_IN_ICON_PROVIDERS, [config.provider.id]: config.provider },
        aliases: config.aliases ?? {},
    };
}

function createAliasedProvider(provider: IconProviderAdapter, aliases: Record<string, string>): IconProviderAdapter {
    if (Object.keys(aliases).length === 0) return provider;

    return {
        id: provider.id,
        resolve(name) {
            return provider.resolve(aliases[name] ?? name);
        },
        ...(provider.list ? { list: () => provider.list!() } : {}),
        ...(provider.isReady ? { isReady: () => provider.isReady!() } : {}),
        ...(provider.load ? { load: () => provider.load!() } : {}),
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

    // CR-154 — the first render waits for the package of the active provider (the app appears with its icons, no
    // flash); a later switch loads the new provider before showing it (`setProvider`), so nothing suspends then.
    const firstRender = React.useRef(true);
    React.useEffect(() => { firstRender.current = false; }, []);
    if (firstRender.current && activeProvider?.isReady?.() === false) React.use(loadIconProvider(activeProvider));
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
                // CR-154 — a provider still to load is shown once loaded: nothing suspends on a switch.
                if (providers[id].isReady?.() === false) void loadIconProvider(providers[id]).then(() => setProviderId(id));
                else setProviderId(id);
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
