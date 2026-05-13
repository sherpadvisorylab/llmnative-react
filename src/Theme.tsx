import React, {createContext, useContext, useEffect, useMemo, useState, ReactNode} from 'react';
import _presetDefault from '../themes/default';
import _presetFlat from '../themes/flat';
import _presetCyber from '../themes/cyber';
import type { MotionConfig } from './motion';

export interface Theme {
    Icons: {
        [key: string]: string;
    };
    [key: string]: any;
}

interface UseTheme extends Theme {
    getIcon: (iconName: string) => string;
}

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
    gutterSize?: string;
    rowCols?: string;
}

export interface ModalTheme {
    size?: string;
    position?: string;
    wrapClass?: string;
    className?: string;
    headerClass?: string;
    titleClass?: string;
    subTitleClass?: string;
    bodyClass?: string;
    footerClass?: string;
    iconExpand?: string;
    iconCollapse?: string;
}

/**
 * Full typed interface for component theme overrides.
 * Export this from conf/theme.ts — all fields are optional so you only declare what you want to change.
 * The `default` theme in themes/default/ provides a full reference implementation of every field.
 */
export interface ThemeConfig {
    Motion?: MotionConfig;
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
        scrollBehavior?: string;
        maxItems?: number;
        sticky?: boolean;
        align?: string;
    };
    Carousel?: {
        showIndicators?: boolean;
        showControls?: boolean;
        showCaption?: boolean;
        layoutDark?: boolean;
        autoPlay?: boolean;
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
    };
    LoadingButton?: {
        className?: string;
        badgeClass?: string;
        spinnerClass?: string;
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
    /** Component class overrides scoped to this preset — merged on top of the base theme when active. */
    theme?: ThemeConfig;
    /** Motion tokens for interaction and disclosure animations. */
    motion?: MotionConfig;
}

/** IDs of built-in presets. Extend by adding entries to BUILT_IN_THEME_PRESETS. */
export const BUILT_IN_PRESET_IDS = ['default', 'flat', 'cyber'] as const;
export type BuiltInPresetId = (typeof BUILT_IN_PRESET_IDS)[number];

/** Module shape returned by a theme import callback. */
export type ThemeModule = { preset?: ThemePresetConfig; theme?: ThemeConfig };

export type AppThemeProviderConfig =
    | BuiltInPresetId
    | (() => Promise<ThemeModule>)
    | {
        defaultMode?: ThemeMode;
        defaultPreset?: string;
        /** Inline preset — CSS variables applied synchronously on mount. */
        preset?: ThemePresetConfig;
        presets?: Record<string, ThemePresetConfig>;
        theme?: ThemeConfig;
        motion?: MotionConfig;
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
    presets: Record<string, ThemePresetConfig>;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    applyPreset: (preset: string) => void;
    setPrimary: (primary: string) => void;
    setRadius: (radius: number) => void;
    setFont: (fontSans: string, fontMono?: string) => void;
    setColors: (colors: ColorScale) => void;
    setTokens: (tokens: Partial<ColorScale>) => void;
}

export const defaultTheme: Theme = {
    Icons: {
        default: 'bi bi-',
        sidebar: 'bi bi-',
        header: 'bi bi-',
        profile: 'bi bi-',
    },
    Motion: {
        preset: 'standard',
        reducedMotion: 'respect-user',
        duration: 160,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        pressScale: 0.98,
        enterDistance: 8,
    },
    Grid: {
        Card: {
            wrapClass: "",
            className: "",
            headerClass: "flex justify-between",
            bodyClass: "p-0",
            footerClass: "",
            showArrow: false
        },
        Table: {
            wrapClass: "",
            className: "table-striped",
            headerClass: "",
            bodyClass: "",
            footerClass: "",
            scrollClass: "fixed-table-container",
            selectedClass: "table-info"
        },
        Gallery: {
            wrapClass: "",
            className: "",
            scrollClass: "",
            headerClass: "",
            bodyClass: "",
            footerClass: "",
            selectedClass: "bg-primary/20",
            gutterSize: "1",
            rowCols: "4"
        },
        Modal: {
            mode: "form",
            size: "lg",
            position: "center",
            wrapClass: "",
            className: "",
            headerClass: "",
            titleClass: "",
            subTitleClass: "pr-1 text-muted-foreground",
            bodyClass: "",
            footerClass: "",
            iconExpand: "fullscreen",
            iconCollapse: "fullscreen-exit"
        },
        i18n: {
            headerAdd: "Aggiungi",
            headerEdit: "Modifica",
            buttonAdd: "Aggiungi",
        }
    },
    Table: {
        wrapClass: "bootstrap-table",
        className: "table-striped",
        headerClass: "",
        bodyClass: "",
        footerClass: "",
        scrollClass: "fixed-table-container",
        selectedClass: "table-info"
    },
    Gallery: {
        wrapClass: "",
        className: "",
        scrollClass: "",
        headerClass: "",
        bodyClass: "",
        footerClass: "",
        selectedClass: "bg-primary/20",
        gutterSize: "4",
        rowCols: "2"
    },
    Pagination: {
        wrapClass: "",
        className: "",
        stickyClass: "fixed-bottom mx-5",
        scrollToTop: false,
        scrollBehavior: "auto",
        maxItems: 5,
        sticky: true,
        align: "end",
    },
    Carousel: {
        showIndicators: true,
        showControls: true,
        showCaption: true,
        layoutDark: false,
        autoPlay: true,
    },
    Card: {
        wrapClass: "",
        className: "",
        headerClass: "flex justify-between bg-white/[.15] font-normal",
        bodyClass: "flex flex-col",
        footerClass: "",
        showLoader: false,
        showArrow: false
    },
    Loader: {
        wrapClass: "",
        className: "",
        icon: "custom-loader",
        title: "Loading..",
        description: ""
    },
    ActionButton: {
        className: "",
        badgeClass: "rounded-full bg-destructive text-destructive-foreground",
    },
    LoadingButton: {
        className: "",
        badgeClass: "rounded-full bg-destructive text-destructive-foreground",
        spinnerClass: "spinner-border spinner-border-sm"
    },
    LinkButton: {
        className: "",
    },
    Alert: {
        className: ""
    },
    Badge: {
        className: ""
    },
    Modal: {
        size: "lg",
        position: "center",
        wrapClass: "",
        className: "",
        headerClass: "",
        titleClass: "",
        subTitleClass: "pr-1 text-muted-foreground",
        bodyClass: "",
        footerClass: "",
        iconExpand: "fullscreen",
        iconCollapse: "fullscreen-exit"
    },
    Dropdown: {
        wrapClass: "",
        className: "",
        buttonClass: "",
        badgeClass: "absolute mr-1 top-0 right-0",
        menuClass: "",
        menuHeaderClass: "",
        menuItemClass: "",
        menuDividerClass: "",
        headerClass: "",
        footerClass: "",
        Menu: {
            wrapClass: "",
            className: "list-none p-0 m-0",
            headerClass: "",
            itemClass: "",
            linkClass: "dropdown-item",
            iconClass: "mr-1",
            textClass: "",
            badgeClass: "",
            arrowClass: "",
            submenuClass: "",
        }
    },
    Notifications: {
        wrapClass: "menu-item",
        Dropdown: {
            className: "",
            buttonClass: "menu-link btn border-0",
            menuClass: "mt-1 fs-11px w-300px pt-1"
        }
    },
    Select: {
        wrapClass: "",
        className: ""
    },
    Autocomplete: {
        wrapClass: "",
        className: ""
    },
    Form: {
        wrapClass: "",
        buttonSaveClass: "btn-outline-primary border-0",
        buttonDeleteClass: "btn-outline-danger border-0",
        buttonBackClass: "btn-link",
        Card: {
            headerClass: "",
            bodyClass: "",
            footerClass: "text-right",
        },
        i18n: {
            headerNewRecord: "Nuovo Record",
            buttonSave: "Salva",
            buttonDelete: "Elimina",
            buttonBack: "Indietro",
            noticeRequiredFields: "Per favore, compila tutti i campi obbligatori"
        }
    },
    Menu: {
        wrapClass: "offcanvas-body",
        className: "navbar-nav flex-col mb-auto",
        headerClass: "",
        itemClass: "nav-item",
        linkClass: "nav-link",
        iconClass: "mr-1",
        textClass: "flex-grow-1",
        badgeClass: "ml-1",
        arrowClass: "",
        submenuClass: "nav flex-col ml-4",
    },
    Brand: {
        wrapClass: "",
        className: "brand",
        logoClass: "navbar-brand",
        labelClass: "navbar-text",
    },
    SignIn: {
        className: "flex items-center",
        avatarClass: "avatar rounded-full mx-2",
    },
    Image: {
        wrapClass: "",
        className: "",
    },
    ImageAvatar: {
        wrapClass: "",
        className: "",
    },
    Percentage: {
        wrapClass: "",
        className: "",
    },
    Tab: {
        wrapClass: "",
        className: "",
    },
    Code: {
        wrapClass: "",
        className: "",
    },
    Prompt: {
        wrapClass: "",
        className: "",
    }
}

const ThemeContext = createContext<Theme>(defaultTheme);
const ThemeControllerContext = createContext<ThemeController | null>(null);

export const BUILT_IN_THEME_PRESETS: Record<BuiltInPresetId, ThemePresetConfig> = {
    default: _presetDefault,
    flat:    _presetFlat,
    cyber:   _presetCyber,
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
    presets: Record<string, ThemePresetConfig>;
    theme?: Partial<Theme>;
} {
    if (typeof config === 'string' || typeof config === 'undefined') {
        return {
            defaultPreset: config ?? 'default',
            presets: { ...BUILT_IN_THEME_PRESETS },
        };
    }

    if (typeof config === 'function') {
        // Async import — start with defaults; preset+theme applied in useEffect after load
        return { defaultPreset: 'default', presets: { ...BUILT_IN_THEME_PRESETS } };
    }

    const extraPresets: Record<string, ThemePresetConfig> = config.preset ? { __local__: config.preset } : {};
    const theme = deepMerge(
        config.motion ? { Motion: config.motion } : {},
        config.theme ?? {}
    );
    return {
        defaultMode: config.defaultMode,
        defaultPreset: config.preset ? '__local__' : (config.defaultPreset ?? 'default'),
        presets: { ...BUILT_IN_THEME_PRESETS, ...extraPresets, ...(config.presets ?? {}) },
        theme,
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
    // If config is a callback, it acts as the import fn (preset + theme overrides)
    const importFn: (() => Promise<ThemeModule>) | undefined =
        typeof config === 'function' ? config : importTheme;

    const normalized = useMemo(() => normalizeThemeProviderConfig(config), [config]);
    const initialPreset = normalized.presets[normalized.defaultPreset] ?? normalized.presets.default;
    const [preset, setPreset] = useState(normalized.defaultPreset);
    const [mode, setMode] = useState<ThemeMode>(normalized.defaultMode ?? initialPreset.mode ?? 'light');
    const [radius, setRadius] = useState(initialPreset.radius ?? BUILT_IN_THEME_PRESETS.default.radius!);
    const [fontSans, setFontSans] = useState(initialPreset.fontSans ?? '');
    const [fontMono, setFontMono] = useState(initialPreset.fontMono ?? '');
    const [presetColors, setPresetColors] = useState<ColorScale | undefined>(initialPreset.colors);
    const [presetDark, setPresetDark] = useState<ColorScale | undefined>(initialPreset.dark);
    const [theme, setTheme] = useState<Theme>(() => cloneTheme(defaultTheme));

    useEffect(() => {
        const selectedPreset = normalized.presets[normalized.defaultPreset] ?? normalized.presets.default;
        setPreset(normalized.defaultPreset);
        setMode(normalized.defaultMode ?? selectedPreset.mode ?? 'light');
        setRadius(selectedPreset.radius ?? BUILT_IN_THEME_PRESETS.default.radius!);
        setFontSans(selectedPreset.fontSans ?? '');
        setFontMono(selectedPreset.fontMono ?? '');
        setPresetColors(selectedPreset.colors);
        setPresetDark(selectedPreset.dark);
    }, [normalized]);

    // Load initial preset values from importFn — runs only on mount or when importFn changes,
    // NOT when the user calls applyPreset() (which would reset user-chosen CSS vars).
    useEffect(() => {
        if (!importFn) return;
        importFn().then((module) => {
            const p = module.preset;
            if (!p) return;
            if (p.mode) setMode(p.mode);
            if (p.radius !== undefined) setRadius(p.radius);
            if (p.colors !== undefined) setPresetColors(p.colors);
            if (p.dark !== undefined) setPresetDark(p.dark);
        }).catch((err) => console.warn("Optional theme not found or failed to load.", err));
    }, [importFn]);

    // Reload component class overrides whenever the active preset changes.
    useEffect(() => {
        const currentPreset = normalized.presets[preset] ?? normalized.presets.default;
        const nextTheme = cloneTheme(defaultTheme);
        if (currentPreset.motion) {
            deepMerge(nextTheme, { Motion: currentPreset.motion });
        }
        deepMerge(nextTheme, currentPreset.theme ?? {});
        deepMerge(nextTheme, normalized.theme ?? {});
        setTheme(nextTheme);

        if (!importFn) return;
        importFn().then((module) => {
            const optionalTheme = module.theme || {};
            if (Object.keys(optionalTheme).length > 0) {
                setTheme((current) => deepMerge(cloneTheme(current), optionalTheme));
            }
        }).catch((err) => console.warn("Optional theme not found or failed to load.", err));
    }, [importFn, normalized, preset]);

    useEffect(() => {
        const currentPreset = normalized.presets[preset] ?? normalized.presets.default;
        applyThemeVars({
            mode, radius, fontSans, fontMono,
            colors: presetColors,
            dark: presetDark,
            variables: currentPreset.variables,
        });
    }, [mode, normalized.presets, preset, radius, fontSans, fontMono, presetColors, presetDark]);

    const controller = useMemo<ThemeController>(() => ({
        mode,
        resolvedMode: resolveMode(mode),
        preset,
        primary: presetColors?.primary ?? BUILT_IN_THEME_PRESETS.default.colors!.primary!,
        primaryForeground: presetColors?.primaryForeground ?? BUILT_IN_THEME_PRESETS.default.colors!.primaryForeground!,
        radius,
        fontSans,
        fontMono,
        colors: presetColors,
        dark: presetDark,
        presets: normalized.presets,
        setMode,
        toggleMode() {
            setMode((current) => resolveMode(current) === 'dark' ? 'light' : 'dark');
        },
        applyPreset(nextPreset: string) {
            const selectedPreset = normalized.presets[nextPreset];
            if (!selectedPreset) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn(`[ThemeProvider] Unknown preset "${nextPreset}", falling back to "default".`);
                }
                nextPreset = 'default';
            }
            const resolvedPreset = normalized.presets[nextPreset] ?? normalized.presets.default;
            setPreset(nextPreset);
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
    }), [mode, preset, radius, fontSans, fontMono, presetColors, presetDark, normalized]);

    if (!theme) {
        //todo: aggiungere un loader
        return null;  // Fallback durante il caricamento del tema
    }

    return (
        <ThemeControllerContext.Provider value={controller}>
            <ThemeContext.Provider value={theme}>
                {children}
            </ThemeContext.Provider>
        </ThemeControllerContext.Provider>
    );
};


export const useTheme = (iconType: string): UseTheme => {
    const theme = useContext(ThemeContext) as Theme;

    return {
        ...theme,
        getIcon(iconName : string) : string {
            return (theme.Icons[iconType] || theme.Icons.default) + iconName;
        },
    };
};

export const useThemeController = (): ThemeController => {
    const controller = useContext(ThemeControllerContext);
    if (!controller) {
        throw new Error('useThemeController must be used inside <App> or <ThemeProvider>.');
    }
    return controller;
};
