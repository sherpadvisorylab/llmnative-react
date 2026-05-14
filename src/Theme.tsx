import React, {createContext, useContext, useEffect, useMemo, useState, ReactNode} from 'react';
import _themeDefault, { theme as defaultTheme } from '../themes/default';
import _themeFlat from '../themes/flat';
import _themeCyber from '../themes/cyber';
import type { MotionReference, MotionRegistry } from './motion';

type UseTheme = Theme;

interface ThemeProviderProps {
    children: ReactNode;
    importTheme?: () => Promise<any>;
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

// ─── Per-component sub-interfaces ───────────────────────────────────────────

export interface MenuTheme {
    wrapClass?: string;
    className?: string;
    headerClass?: string;
    itemClass?: string;
    linkClass?: string;
    iconClass?: string;
    textClass?: string;
    badgeClass?: string;
    arrowClass?: string;
    submenuClass?: string;
}

export interface CardTheme {
    wrapClass?: string;
    className?: string;
    headerClass?: string;
    bodyClass?: string;
    footerClass?: string;
    showLoader?: boolean;
    showArrow?: boolean;
}

export interface TableTheme {
    wrapClass?: string;
    className?: string;
    headerClass?: string;
    bodyClass?: string;
    footerClass?: string;
    scrollClass?: string;
    selectedClass?: string;
}

export interface GalleryTheme {
    wrapClass?: string;
    className?: string;
    scrollClass?: string;
    headerClass?: string;
    bodyClass?: string;
    footerClass?: string;
    selectedClass?: string;
    gutterSize?: 0 | 1 | 2 | 3 | 4 | 5;
    rowCols?: 1 | 2 | 3 | 4 | 6;
}

export interface ModalTheme {
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
    wrapClass?: string;
    className?: string;
    headerClass?: string;
    titleClass?: string;
    subTitleClass?: string;
    bodyClass?: string;
    footerClass?: string;
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
        i18n?: {
            headerAdd?: string;
            headerEdit?: string;
            buttonAdd?: string;
        };
    };
    Table?: TableTheme;
    Gallery?: GalleryTheme;
    Pagination?: {
        wrapClass?: string;
        className?: string;
        stickyClass?: string;
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
        layoutDark?: boolean;
        autoPlay?: any;
    };
    Card?: CardTheme;
    Loader?: {
        wrapClass?: string;
        className?: string;
        icon?: string;
        title?: string;
        description?: string;
    };
    ActionButton?: {
        className?: string;
        badgeClass?: string;
        motion?: {
            press?: MotionReference;
        };
    };
    LoadingButton?: {
        className?: string;
        badgeClass?: string;
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
        wrapClass?: string;
        className?: string;
        buttonClass?: string;
        badgeClass?: string;
        menuClass?: string;
        menuHeaderClass?: string;
        menuItemClass?: string;
        menuDividerClass?: string;
        headerClass?: string;
        footerClass?: string;
        Menu?: MenuTheme;
        motion?: {
            open?: MotionReference;
            close?: MotionReference;
            press?: MotionReference;
        };
    };
    Notifications?: {
        wrapClass?: string;
        Dropdown?: {
            className?: string;
            buttonClass?: string;
            menuClass?: string;
        };
    };
    Select?: {
        wrapClass?: string;
        className?: string;
    };
    Autocomplete?: {
        wrapClass?: string;
        className?: string;
    };
    Form?: {
        wrapClass?: string;
        buttonSaveClass?: string;
        buttonDeleteClass?: string;
        buttonBackClass?: string;
        Card?: {
            headerClass?: string;
            bodyClass?: string;
            footerClass?: string;
        };
        i18n?: {
            headerAdd?: string;
            headerEdit?: string;
            headerNewRecord?: string;
            buttonSave?: string;
            buttonDelete?: string;
            buttonBack?: string;
            noticeRequiredFields?: string;
        };
    };
    Menu?: MenuTheme;
    Brand?: {
        wrapClass?: string;
        className?: string;
        logoClass?: string;
        labelClass?: string;
    };
    SignIn?: {
        className?: string;
        avatarClass?: string;
    };
    Image?: {
        wrapClass?: string;
        className?: string;
    };
    ImageAvatar?: {
        wrapClass?: string;
        className?: string;
    };
    Percentage?: {
        wrapClass?: string;
        className?: string;
    };
    Tab?: {
        wrapClass?: string;
        className?: string;
        motion?: {
            enter?: MotionReference;
        };
    };
    Code?: {
        wrapClass?: string;
        className?: string;
    };
    Prompt?: {
        wrapClass?: string;
        className?: string;
    };
}

type DeepRequired<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends (...args: any[]) => any
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
    theme: Theme;
}

/** IDs of built-in themes. Extend by adding entries to BUILT_IN_THEMES. */
export const BUILT_IN_PRESET_IDS = ['default', 'flat', 'cyber'] as const;
export type BuiltInPresetId = (typeof BUILT_IN_PRESET_IDS)[number];

/** Module shape returned by a theme import callback. */
export type ThemeModule = ThemeDefinition;

export type AppThemeProviderConfig =
    | BuiltInPresetId
    | (() => Promise<ThemeModule>)
    | {
        defaultMode?: ThemeMode;
        defaultPreset?: string;
        themes?: Record<string, ThemeDefinition>;
        themeOverride?: ThemeConfig;
    };

export interface ThemeController {
    mode: ThemeMode;
    resolvedMode: 'light' | 'dark';
    preset: string;
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
    applyPreset: (preset: string) => void;
    setPrimary: (primary: string) => void;
    setRadius: (radius: number) => void;
    setFont: (fontSans: string, fontMono?: string) => void;
    setColors: (colors: ColorScale) => void;
    setTokens: (tokens: Partial<ColorScale>) => void;
}

const ThemeContext = createContext<Theme>(defaultTheme);
const MotionRegistryContext = createContext<MotionRegistry>(_themeDefault.motion);
const ThemeControllerContext = createContext<ThemeController | null>(null);

export const BUILT_IN_THEMES: Record<BuiltInPresetId, ThemeDefinition> = {
    default: _themeDefault,
    flat:    _themeFlat,
    cyber:   _themeCyber,
};

// Funzione per unire profondamente due oggetti
const deepMerge = (target: any, source: any) => {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && source[key] !== null) {
                if (!target[key]) {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else if(source[key] !== null) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

const cloneTheme = (theme: Theme): Theme => deepMerge({}, theme);

function normalizeThemeProviderConfig(config?: AppThemeProviderConfig): {
    defaultMode?: ThemeMode;
    defaultPreset: string;
    themes: Record<string, ThemeDefinition>;
    themeOverride?: ThemeConfig;
} {
    if (typeof config === 'string' || typeof config === 'undefined') {
        return {
            defaultPreset: config ?? 'default',
            themes: { ...BUILT_IN_THEMES },
        };
    }

    if (typeof config === 'function') {
        return { defaultPreset: 'default', themes: { ...BUILT_IN_THEMES } };
    }

    return {
        defaultMode: config.defaultMode,
        defaultPreset: config.defaultPreset ?? 'default',
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

    // Inject/update a single <style> tag — appended to <head> so it wins over the CSS file
    let el = document.getElementById('rf-preset-vars') as HTMLStyleElement | null;
    if (!el) {
        el = document.createElement('style');
        el.id = 'rf-preset-vars';
        document.head.appendChild(el);
    }
    const toDecls = (map: Record<string, string>) =>
        Object.entries(map).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    el.textContent = [
        Object.keys(lightVars).length ? `:root {\n${toDecls(lightVars)}\n}` : '',
        Object.keys(darkVars).length ? `.dark {\n${toDecls(darkVars)}\n}` : '',
    ].filter(Boolean).join('\n');
}

export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjEwIiBmaWxsPSIjY2NjIiAvPgogIDxwYXRoIGQ9Ik0yMCw4MCBMNDAuNSw1MCBMNjAsODAgTDgwLDU1IEw5MCw3MCBMOTAsODAgSDEwIEwyMCw4MCBaIiBmaWxsPSIjY2NjIiAvPgo8L3N2Zz4=";
export const PLACEHOLDER_USER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23eef2f7'/%3E%3Ccircle cx='50' cy='38' r='16' fill='%2364758b'/%3E%3Cpath d='M22 84c3.8-20 19-31 28-31s24.2 11 28 31c.5 2.8-1.7 5-4.5 5h-47c-2.8 0-5-2.2-4.5-5z' fill='%2364758b'/%3E%3C/svg%3E";
export const PLACEHOLDER_BRAND = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTUwIDE1IEw4NSA1MCBMNTAgODUgTDE1IDUwIFoiIGZpbGw9IiNjY2MiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik01MCAzMCBMNzAgNTAgTDUwIDcwIEwzMCA1MCBaIiBmaWxsPSIjY2NjIi8+PC9zdmc+";


export const ThemeProvider = ({
                                                                children,
                                                                importTheme = undefined,
                                                                config = undefined
}: ThemeProviderProps) => {
    const importFn: (() => Promise<ThemeModule>) | undefined =
        typeof config === 'function' ? config : importTheme;

    const normalized = useMemo(() => normalizeThemeProviderConfig(config), [config]);
    const initialDefinition = normalized.themes[normalized.defaultPreset] ?? normalized.themes.default;
    const initialPreset = initialDefinition.preset;
    const [themeRegistry, setThemeRegistry] = useState<Record<string, ThemeDefinition>>(normalized.themes);
    const [preset, setPreset] = useState(normalized.defaultPreset);
    const [mode, setMode] = useState<ThemeMode>(normalized.defaultMode ?? initialPreset.mode ?? 'light');
    const [radius, setRadius] = useState(initialPreset.radius ?? BUILT_IN_THEMES.default.preset.radius!);
    const [fontSans, setFontSans] = useState(initialPreset.fontSans ?? '');
    const [fontMono, setFontMono] = useState(initialPreset.fontMono ?? '');
    const [presetColors, setPresetColors] = useState<ColorScale | undefined>(initialPreset.colors);
    const [presetDark, setPresetDark] = useState<ColorScale | undefined>(initialPreset.dark);
    const [theme, setTheme] = useState<Theme>(() => cloneTheme(initialDefinition.theme));
    const [motionRegistry, setMotionRegistry] = useState<MotionRegistry>(initialDefinition.motion);

    useEffect(() => {
        const selectedDefinition = normalized.themes[normalized.defaultPreset] ?? normalized.themes.default;
        const selectedPreset = selectedDefinition.preset;
        setThemeRegistry(normalized.themes);
        setPreset(normalized.defaultPreset);
        setMode(normalized.defaultMode ?? selectedPreset.mode ?? 'light');
        setRadius(selectedPreset.radius ?? BUILT_IN_THEMES.default.preset.radius!);
        setFontSans(selectedPreset.fontSans ?? '');
        setFontMono(selectedPreset.fontMono ?? '');
        setPresetColors(selectedPreset.colors);
        setPresetDark(selectedPreset.dark);
        setMotionRegistry(selectedDefinition.motion);
    }, [normalized]);

    useEffect(() => {
        if (!importFn) return;
        importFn().then((module) => {
            const importedPreset = '__imported__';
            const p = module.preset;
            setThemeRegistry((current) => ({ ...current, [importedPreset]: module }));
            setPreset(importedPreset);
            setMode(normalized.defaultMode ?? p.mode ?? 'light');
            setRadius(p.radius ?? BUILT_IN_THEMES.default.preset.radius!);
            setFontSans(p.fontSans ?? '');
            setFontMono(p.fontMono ?? '');
            setPresetColors(p.colors);
            setPresetDark(p.dark);
            setMotionRegistry(module.motion);
        }).catch((err) => console.warn('Optional theme not found or failed to load.', err));
    }, [importFn, normalized.defaultMode]);

    useEffect(() => {
        const currentDefinition = themeRegistry[preset] ?? themeRegistry.default;
        const nextTheme = cloneTheme(currentDefinition.theme);
        deepMerge(nextTheme, normalized.themeOverride ?? {});
        setTheme(nextTheme);
        setMotionRegistry(currentDefinition.motion);
    }, [normalized.themeOverride, preset, themeRegistry]);

    useEffect(() => {
        const currentPreset = (themeRegistry[preset] ?? themeRegistry.default).preset;
        applyThemeVars({
            mode, radius, fontSans, fontMono,
            colors: presetColors,
            dark: presetDark,
            variables: currentPreset.variables,
        });
    }, [mode, themeRegistry, preset, radius, fontSans, fontMono, presetColors, presetDark]);

    const controller = useMemo<ThemeController>(() => ({
        mode,
        resolvedMode: resolveMode(mode),
        preset,
        primary: presetColors?.primary ?? BUILT_IN_THEMES.default.preset.colors!.primary!,
        primaryForeground: presetColors?.primaryForeground ?? BUILT_IN_THEMES.default.preset.colors!.primaryForeground!,
        radius,
        fontSans,
        fontMono,
        colors: presetColors,
        dark: presetDark,
        themes: themeRegistry,
        setMode,
        toggleMode() {
            setMode((current) => resolveMode(current) === 'dark' ? 'light' : 'dark');
        },
        applyPreset(nextPreset: string) {
            const selectedDefinition = themeRegistry[nextPreset];
            if (!selectedDefinition) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`[ThemeProvider] Unknown preset "${nextPreset}", falling back to "default".`);
                }
                nextPreset = 'default';
            }
            const resolvedPreset = (themeRegistry[nextPreset] ?? themeRegistry.default).preset;
            setPreset(nextPreset);
            setMode(resolvedPreset.mode ?? 'light');
            setRadius(resolvedPreset.radius ?? BUILT_IN_THEMES.default.preset.radius!);
            setFontSans(resolvedPreset.fontSans ?? '');
            setFontMono(resolvedPreset.fontMono ?? '');
            setPresetColors(resolvedPreset.colors);
            setPresetDark(resolvedPreset.dark);
        },
        setPrimary(primary: string) {
            const h = primary.split(' ')[0];
            setPresetColors((current) => ({
                ...current,
                primary,
                ring: primary,
                secondary:            `${h} 40% 96%`,
                secondaryForeground:  `${h} 47% 11%`,
                accent:               `${h} 40% 94%`,
                accentForeground:     `${h} 47% 11%`,
            }));
            setPresetDark((current) => ({
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
            setPresetColors(colors);
        },
        setTokens(tokens: Partial<ColorScale>) {
            setPresetColors((c) => ({ ...c, ...tokens }));
            setPresetDark((c) => ({ ...c, ...tokens }));
        },
    }), [mode, preset, radius, fontSans, fontMono, presetColors, presetDark, themeRegistry]);

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
