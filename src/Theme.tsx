import React, {createContext, useContext, useEffect, useMemo, useState, ReactNode} from 'react';
import _themeDefault, { components as defaultComponents } from '../themes/default';
import _themeFlat from '../themes/flat';
import _themeCyber from '../themes/cyber';
import type { MotionReference, MotionRegistry } from './motion';

type UseTheme = Theme;

interface ThemeProviderProps {
    children: ReactNode;
    config?: AppThemeProviderConfig;
}

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Full set of semantic color design tokens, expressed as HSL channel values ("H S% L%").
 * Maps 1-to-1 with the --rf-* CSS custom properties defined in globals.css.
 * Both `colors` (light mode) and `dark` override sets use this shape.
 */
export interface ColorScale {
    background?: string;
    foreground?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    success?: string;
    successForeground?: string;
    warning?: string;
    warningForeground?: string;
    info?: string;
    infoForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
}

// --- Per-component sub-interfaces -------------------------------------------

export interface MenuTheme {
    wrapperClassName?: string;
    className?: string;
    headerClassName?: string;
    itemClassName?: string;
    linkClassName?: string;
    iconClassName?: string;
    textClassName?: string;
    badgeClassName?: string;
    arrowClassName?: string;
    submenuClassName?: string;
}

export interface CardTheme {
    wrapperClassName?: string;
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    loading?: boolean;
}

export interface TableTheme {
    wrapperClassName?: string;
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    scrollClassName?: string;
    selectedClassName?: string;
}

export interface GalleryTheme {
    wrapperClassName?: string;
    className?: string;
    scrollClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    selectedClassName?: string;
    gap?: 0 | 1 | 2 | 3 | 4 | 5;
    rowCols?: 1 | 2 | 3 | 4 | 6;
}

export interface ModalTheme {
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
    wrapperClassName?: string;
    className?: string;
    headerClassName?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    iconExpand?: string;
    iconCollapse?: string;
    motion?: {
        center?: MotionReference;
        top?: MotionReference;
        left?: MotionReference;
        right?: MotionReference;
        bottom?: MotionReference;
        backdrop?: MotionReference;
    };
}

/**
 * Full typed interface for component theme overrides.
 * Used by app-level themeOverride. All fields are optional so you only declare what you want to change.
 * The `default` theme in themes/default/ provides a full reference implementation of every field.
 */
export interface ThemeConfig {
    Grid?: {
        Card?: CardTheme;
        Table?: TableTheme;
        Gallery?: GalleryTheme;
        Modal?: ModalTheme & { mode?: 'form' | 'empty' };
    };
    Table?: TableTheme;
    Gallery?: GalleryTheme;
    Pagination?: {
        wrapperClassName?: string;
        className?: string;
        stickyClassName?: string;
        scrollToTop?: boolean;
        scrollBehavior?: ScrollBehavior;
        maxItems?: number;
        sticky?: boolean;
        align?: string;
    };
    Carousel?: {
        showIndicators?: boolean;
        showControls?: boolean;
        showCaption?: boolean;
        dark?: boolean;
        autoPlay?: boolean | { interval: number; pause: "hover" | "false" | "true"; wrap: boolean };
    };
    Card?: CardTheme;
    Loader?: {
        wrapperClassName?: string;
        className?: string;
        icon?: string;
        title?: string;
        description?: string;
    };
    ActionButton?: {
        className?: string;
        badgeClassName?: string;
        motion?: {
            press?: MotionReference;
        };
    };
    LoadingButton?: {
        className?: string;
        badgeClassName?: string;
        motion?: {
            press?: MotionReference;
        };
    };
    LinkButton?: {
        className?: string;
    };
    Alert?: {
        className?: string;
    };
    Badge?: {
        className?: string;
    };
    Modal?: ModalTheme;
    Dropdown?: {
        wrapperClassName?: string;
        className?: string;
        triggerClassName?: string;
        badgeClassName?: string;
        menuClassName?: string;
        menuHeaderClass?: string;
        menuItemClass?: string;
        menuDividerClass?: string;
        headerClassName?: string;
        footerClassName?: string;
        Menu?: MenuTheme;
        motion?: {
            open?: MotionReference;
            close?: MotionReference;
            press?: MotionReference;
        };
    };
    Notifications?: {
        wrapperClassName?: string;
        Dropdown?: {
            className?: string;
            triggerClassName?: string;
            menuClassName?: string;
        };
    };
    Select?: {
        wrapperClassName?: string;
        className?: string;
    };
    Autocomplete?: {
        wrapperClassName?: string;
        className?: string;
    };
    Form?: {
        wrapperClassName?: string;
        buttonSaveClass?: string;
        buttonDeleteClass?: string;
        buttonBackClass?: string;
        Card?: {
            headerClassName?: string;
            bodyClassName?: string;
            footerClassName?: string;
        };
    };
    Menu?: MenuTheme;
    Brand?: {
        wrapperClassName?: string;
        className?: string;
        logoClassName?: string;
        labelClassName?: string;
    };
    SignIn?: {
        className?: string;
        avatarClass?: string;
    };
    Image?: {
        wrapperClassName?: string;
        className?: string;
        motion?: {
            enter?: MotionReference;
            hover?: MotionReference;
        };
    };
    ImageAvatar?: {
        wrapperClassName?: string;
        className?: string;
        motion?: { enter?: MotionReference; hover?: MotionReference };
    };
    Percentage?: {
        wrapperClassName?: string;
        className?: string;
    };
    Tab?: {
        wrapperClassName?: string;
        className?: string;
        motion?: {
            enter?: MotionReference;
        };
    };
    Code?: {
        wrapperClassName?: string;
        className?: string;
    };
    CodeEditor?: {
        wrapperClassName?: string;
        className?: string;
    };
    Prompt?: {
        wrapperClassName?: string;
        className?: string;
    };
}

type DeepRequired<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends (...args: unknown[]) => unknown
        ? NonNullable<T[K]>
        : NonNullable<T[K]> extends object
            ? DeepRequired<NonNullable<T[K]>>
            : NonNullable<T[K]>;
};

export type Theme = DeepRequired<ThemeConfig> & {
};

export interface ThemePresetConfig {
    mode?: ThemeMode;
    radius?: number;
    /** CSS font-family string for the sans-serif font, e.g. `"'Inter', sans-serif"`. Maps to `--font-sans`. */
    fontSans?: string;
    /** CSS font-family string for the monospace font, e.g. `"'JetBrains Mono', monospace"`. Maps to `--font-mono`. */
    fontMono?: string;
    /** Full semantic color palette for light mode. Each value is an HSL channel string, e.g. "221.2 83.2% 53.3%". */
    colors?: ColorScale;
    /** Semantic color overrides applied when dark mode is active. Merged on top of `colors`. */
    dark?: ColorScale;
    /** Arbitrary CSS custom properties not covered by ColorScale, e.g. spacing or font tokens. */
    variables?: Record<string, string>;
}

export interface ThemeDefinition {
    preset: ThemePresetConfig;
    motion: MotionRegistry;
    components: Theme;
}

/** IDs of built-in themes. Extend by adding entries to BUILT_IN_THEMES. */
export const BUILT_IN_THEME_IDS = ['default', 'flat', 'cyber'] as const;
export type BuiltInThemeId = (typeof BUILT_IN_THEME_IDS)[number];

export type AppThemeProviderConfig =
    | BuiltInThemeId
    | ThemeDefinition
    | {
        defaultMode?: ThemeMode;
        theme?: string;
        themes?: Record<string, ThemeDefinition>;
        themeOverride?: ThemeConfig;
    };

export interface ThemeController {
    mode: ThemeMode;
    resolvedMode: 'light' | 'dark';
    theme: string;
    primary: string;
    primaryForeground: string;
    radius: number;
    fontSans: string;
    fontMono: string;
    colors: ColorScale | undefined;
    dark: ColorScale | undefined;
    themes: Record<string, ThemeDefinition>;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    applyTheme: (theme: string) => void;
    setPrimary: (primary: string) => void;
    setRadius: (radius: number) => void;
    setFont: (fontSans: string, fontMono?: string) => void;
    setColors: (colors: ColorScale) => void;
    setTokens: (tokens: Partial<ColorScale>) => void;
}

const ThemeContext = createContext<Theme>(defaultComponents);
const MotionRegistryContext = createContext<MotionRegistry>(_themeDefault.motion);
const ThemeControllerContext = createContext<ThemeController | null>(null);

export const BUILT_IN_THEMES: Record<BuiltInThemeId, ThemeDefinition> = {
    default: _themeDefault,
    flat:    _themeFlat,
    cyber:   _themeCyber,
};

// Funzione per unire profondamente due oggetti
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
    const t = target as Record<string, unknown>;
    const s = source as Record<string, unknown>;
    for (const key in s) {
        if (Object.prototype.hasOwnProperty.call(s, key)) {
            if (typeof s[key] === 'object' && s[key] !== null) {
                if (!t[key]) {
                    t[key] = {};
                }
                deepMerge(t[key] as object, s[key] as object);
            } else if (s[key] !== null) {
                t[key] = s[key];
            }
        }
    }
    return target;
};

const cloneTheme = (theme: Theme): Theme => deepMerge({} as Theme, theme);

function isThemeDefinition(config: unknown): config is ThemeDefinition {
    return typeof config === 'object'
        && config !== null
        && 'preset' in config
        && 'motion' in config
        && 'components' in config;
}

function normalizeThemeProviderConfig(config?: AppThemeProviderConfig): {
    defaultMode?: ThemeMode;
    theme: string;
    themes: Record<string, ThemeDefinition>;
    themeOverride?: ThemeConfig;
} {
    if (typeof config === 'string' || typeof config === 'undefined') {
        return {
            theme: config ?? 'default',
            themes: { ...BUILT_IN_THEMES },
        };
    }

    if (isThemeDefinition(config)) {
        return {
            theme: 'custom',
            themes: { ...BUILT_IN_THEMES, custom: config },
        };
    }

    return {
        defaultMode: config.defaultMode,
        theme: config.theme ?? 'default',
        themes: { ...BUILT_IN_THEMES, ...(config.themes ?? {}) },
        themeOverride: config.themeOverride,
    };
}
function resolveMode(mode: ThemeMode): 'light' | 'dark' {
    if (mode !== 'system') return mode;
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function colorKeyToCssVar(key: string): string {
    return '--rf-' + key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

function applyThemeVars({
    mode,
    radius,
    fontSans,
    fontMono,
    colors,
    dark,
    variables,
}: {
    mode: ThemeMode;
    radius: number;
    fontSans?: string;
    fontMono?: string;
    colors?: ColorScale;
    dark?: ColorScale;
    variables?: Record<string, string>;
}) {
    if (typeof document === 'undefined') return;

    document.documentElement.classList.toggle('dark', resolveMode(mode) === 'dark');

    const lightVars: Record<string, string> = {};
    const darkVars: Record<string, string> = {};

    for (const [key, value] of Object.entries(colors ?? {})) {
        if (value !== undefined) lightVars[colorKeyToCssVar(key)] = value as string;
    }
    for (const [key, value] of Object.entries(dark ?? {})) {
        if (value !== undefined) darkVars[colorKeyToCssVar(key)] = value as string;
    }

    lightVars['--radius']     = `${radius}rem`;
    lightVars['--radius-sm']  = `${(radius * 0.5).toFixed(4).replace(/\.?0+$/, '')}rem`;
    lightVars['--radius-md']  = `${(radius * 0.75).toFixed(4).replace(/\.?0+$/, '')}rem`;
    lightVars['--radius-lg']  = `${radius}rem`;
    lightVars['--radius-xl']  = `${(radius * 1.5).toFixed(4).replace(/\.?0+$/, '')}rem`;
    lightVars['--radius-2xl'] = `${(radius * 2).toFixed(4).replace(/\.?0+$/, '')}rem`;
    lightVars['--radius-3xl'] = `${(radius * 3).toFixed(4).replace(/\.?0+$/, '')}rem`;

    if (fontSans) lightVars['--font-sans'] = fontSans;
    if (fontMono) lightVars['--font-mono'] = fontMono;

    for (const [key, value] of Object.entries(variables ?? {})) {
        lightVars[key.startsWith('--') ? key : `--${key}`] = value;
    }

    // Inject/update a single <style> tag - appended to <head> so it wins over the CSS file
    let el = document.getElementById('rf-theme-vars') as HTMLStyleElement | null;
    if (!el) {
        el = document.createElement('style');
        el.id = 'rf-theme-vars';
        document.head.appendChild(el);
    }
    const toDecls = (map: Record<string, string>) =>
        Object.entries(map).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    el.textContent = [
        Object.keys(lightVars).length ? `:root {\n${toDecls(lightVars)}\n}` : '',
        Object.keys(darkVars).length ? `.dark {\n${toDecls(darkVars)}\n}` : '',
    ].filter(Boolean).join('\n');
}

export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGNpcmNsZSBjeD0iNjUiIGN5PSIzNSIgcj0iMTAiIGZpbGw9IiM5Y2EzYWYiLz48cGF0aCBkPSJNMTAsNzUgTDMyLDUwIEw1Miw3MCBMNjgsNTIgTDkwLDcyIEw5MCw4MCBIMTAgWiIgZmlsbD0iIzljYTNhZiIvPjwvc3ZnPg==";
export const PLACEHOLDER_USER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23eef2f7'/%3E%3Ccircle cx='50' cy='38' r='16' fill='%2364758b'/%3E%3Cpath d='M22 84c3.8-20 19-31 28-31s24.2 11 28 31c.5 2.8-1.7 5-4.5 5h-47c-2.8 0-5-2.2-4.5-5z' fill='%2364758b'/%3E%3C/svg%3E";
export const PLACEHOLDER_BRAND = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTUwIDE1IEw4NSA1MCBMNTAgODUgTDE1IDUwIFoiIGZpbGw9IiNjY2MiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik01MCAzMCBMNzAgNTAgTDUwIDcwIEwzMCA1MCBaIiBmaWxsPSIjY2NjIi8+PC9zdmc+";


export const ThemeProvider = ({
                                                                children,
                                                                config = undefined
}: ThemeProviderProps) => {
    const normalized = useMemo(() => normalizeThemeProviderConfig(config), [config]);
    const initialDefinition = normalized.themes[normalized.theme] ?? normalized.themes.default;
    const initialThemePreset = initialDefinition.preset;
    const [themeRegistry, setThemeRegistry] = useState<Record<string, ThemeDefinition>>(normalized.themes);
    const [activeTheme, setActiveTheme] = useState(normalized.theme);
    const [mode, setMode] = useState<ThemeMode>(normalized.defaultMode ?? initialThemePreset.mode ?? 'light');
    const [radius, setRadius] = useState(initialThemePreset.radius ?? BUILT_IN_THEMES.default.preset.radius!);
    const [fontSans, setFontSans] = useState(initialThemePreset.fontSans ?? '');
    const [fontMono, setFontMono] = useState(initialThemePreset.fontMono ?? '');
    const [themeColors, setThemeColors] = useState<ColorScale | undefined>(initialThemePreset.colors);
    const [themeDark, setThemeDark] = useState<ColorScale | undefined>(initialThemePreset.dark);
    const [theme, setTheme] = useState<Theme>(() => cloneTheme(initialDefinition.components));
    const [motionRegistry, setMotionRegistry] = useState<MotionRegistry>(initialDefinition.motion);

    useEffect(() => {
        const selectedDefinition = normalized.themes[normalized.theme] ?? normalized.themes.default;
        const selectedPreset = selectedDefinition.preset;
        setThemeRegistry(normalized.themes);
        setActiveTheme(normalized.theme);
        setMode(normalized.defaultMode ?? selectedPreset.mode ?? 'light');
        setRadius(selectedPreset.radius ?? BUILT_IN_THEMES.default.preset.radius!);
        setFontSans(selectedPreset.fontSans ?? '');
        setFontMono(selectedPreset.fontMono ?? '');
        setThemeColors(selectedPreset.colors);
        setThemeDark(selectedPreset.dark);
        setMotionRegistry(selectedDefinition.motion);
    }, [normalized]);

    useEffect(() => {
        const currentDefinition = themeRegistry[activeTheme] ?? themeRegistry.default;
        const nextTheme = cloneTheme(currentDefinition.components);
        deepMerge(nextTheme, (normalized.themeOverride ?? {}) as Partial<Theme>);
        setTheme(nextTheme);
        setMotionRegistry(currentDefinition.motion);
    }, [activeTheme, normalized.themeOverride, themeRegistry]);

    useEffect(() => {
        const currentPreset = (themeRegistry[activeTheme] ?? themeRegistry.default).preset;
        applyThemeVars({
            mode, radius, fontSans, fontMono,
            colors: themeColors,
            dark: themeDark,
            variables: currentPreset.variables,
        });
    }, [mode, themeRegistry, activeTheme, radius, fontSans, fontMono, themeColors, themeDark]);

    const controller = useMemo<ThemeController>(() => ({
        mode,
        resolvedMode: resolveMode(mode),
        theme: activeTheme,
        primary: themeColors?.primary ?? BUILT_IN_THEMES.default.preset.colors!.primary!,
        primaryForeground: themeColors?.primaryForeground ?? BUILT_IN_THEMES.default.preset.colors!.primaryForeground!,
        radius,
        fontSans,
        fontMono,
        colors: themeColors,
        dark: themeDark,
        themes: themeRegistry,
        setMode,
        toggleMode() {
            setMode((current) => resolveMode(current) === 'dark' ? 'light' : 'dark');
        },
        applyTheme(nextTheme: string) {
            const selectedDefinition = themeRegistry[nextTheme];
            if (!selectedDefinition) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`[ThemeProvider] Unknown theme "${nextTheme}", falling back to "default".`);
                }
                nextTheme = 'default';
            }
            const resolvedPreset = (themeRegistry[nextTheme] ?? themeRegistry.default).preset;
            setActiveTheme(nextTheme);
            setMode(resolvedPreset.mode ?? 'light');
            setRadius(resolvedPreset.radius ?? BUILT_IN_THEMES.default.preset.radius!);
            setFontSans(resolvedPreset.fontSans ?? '');
            setFontMono(resolvedPreset.fontMono ?? '');
            setThemeColors(resolvedPreset.colors);
            setThemeDark(resolvedPreset.dark);
        },
        setPrimary(primary: string) {
            const h = primary.split(' ')[0];
            setThemeColors((current) => ({
                ...current,
                primary,
                ring: primary,
                secondary:            `${h} 40% 96%`,
                secondaryForeground:  `${h} 47% 11%`,
                accent:               `${h} 40% 94%`,
                accentForeground:     `${h} 47% 11%`,
            }));
            setThemeDark((current) => ({
                ...current,
                primary,
                ring: primary,
                secondary:            `${h} 30% 18%`,
                secondaryForeground:  `${h} 10% 96%`,
                accent:               `${h} 30% 18%`,
                accentForeground:     `${h} 10% 96%`,
            }));
        },
        setRadius,
        setFont(sans: string, mono?: string) {
            setFontSans(sans);
            if (mono !== undefined) setFontMono(mono);
        },
        setColors(colors: ColorScale) {
            setThemeColors(colors);
        },
        setTokens(tokens: Partial<ColorScale>) {
            setThemeColors((c) => ({ ...c, ...tokens }));
            setThemeDark((c) => ({ ...c, ...tokens }));
        },
    }), [mode, activeTheme, radius, fontSans, fontMono, themeColors, themeDark, themeRegistry]);

    return (
        <ThemeControllerContext.Provider value={controller}>
            <MotionRegistryContext.Provider value={motionRegistry}>
                <ThemeContext.Provider value={theme}>
                    {children}
                </ThemeContext.Provider>
            </MotionRegistryContext.Provider>
        </ThemeControllerContext.Provider>
    );
};

export const useTheme = (_scope?: string): UseTheme => {
    return useContext(ThemeContext) as Theme;
};

export const useMotionRegistry = (): MotionRegistry => {
    return useContext(MotionRegistryContext);
};

export const useThemeController = (): ThemeController => {
    const controller = useContext(ThemeControllerContext);
    if (!controller) {
        throw new Error('useThemeController must be used inside <App> or <ThemeProvider>.');
    }
    return controller;
};

