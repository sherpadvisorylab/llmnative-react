import React, {createContext, useContext, useEffect, useMemo, useState, ReactNode} from 'react';

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

export interface ThemePresetConfig {
    mode?: ThemeMode;
    primary?: string;
    primaryForeground?: string;
    radius?: number;
    variables?: Record<string, string>;
    theme?: Partial<Theme>;
}

export type AppThemeProviderConfig =
    | string
    | {
        defaultMode?: ThemeMode;
        defaultPreset?: string;
        presets?: Record<string, ThemePresetConfig>;
        theme?: Partial<Theme>;
    };

export interface ThemeController {
    mode: ThemeMode;
    resolvedMode: 'light' | 'dark';
    preset: string;
    primary: string;
    primaryForeground: string;
    radius: number;
    presets: Record<string, ThemePresetConfig>;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    applyPreset: (preset: string) => void;
    setPrimary: (primary: string) => void;
    setRadius: (radius: number) => void;
}

export const defaultTheme: Theme = {
    Icons: {
        default: 'bi bi-',
        sidebar: 'bi bi-',
        header: 'bi bi-',
        profile: 'bi bi-',
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
        className: "navbar-nav flex-column mb-auto",
        headerClass: "",
        itemClass: "nav-item",
        linkClass: "nav-link",
        iconClass: "mr-1",
        textClass: "flex-grow-1",
        badgeClass: "ml-1",
        arrowClass: "",
        submenuClass: "nav flex-column ml-4",
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

export const BUILT_IN_THEME_PRESETS: Record<string, ThemePresetConfig> = {
    default: {
        mode: 'light',
        primary: '221.2 83.2% 53.3%',
        primaryForeground: '210 40% 98%',
        radius: 0.5,
    },
    flat: {
        mode: 'light',
        primary: '215 25% 27%',
        primaryForeground: '210 40% 98%',
        radius: 0.125,
    },
    cyber: {
        mode: 'dark',
        primary: '160 84% 39%',
        primaryForeground: '210 40% 98%',
        radius: 0,
    },
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
    if (typeof config === 'string') {
        return {
            defaultPreset: config,
            presets: { ...BUILT_IN_THEME_PRESETS },
        };
    }

    return {
        defaultMode: config?.defaultMode,
        defaultPreset: config?.defaultPreset ?? 'default',
        presets: { ...BUILT_IN_THEME_PRESETS, ...(config?.presets ?? {}) },
        theme: config?.theme,
    };
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
    if (mode !== 'system') return mode;
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeVars({
    mode,
    primary,
    primaryForeground,
    radius,
    variables,
}: {
    mode: ThemeMode;
    primary: string;
    primaryForeground: string;
    radius: number;
    variables?: Record<string, string>;
}) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const resolvedMode = resolveMode(mode);
    root.classList.toggle('dark', resolvedMode === 'dark');
    root.style.setProperty('--rf-primary', primary);
    root.style.setProperty('--rf-primary-foreground', primaryForeground);
    root.style.setProperty('--radius', `${radius}rem`);

    Object.entries(variables ?? {}).forEach(([key, value]) => {
        root.style.setProperty(key.startsWith('--') ? key : `--${key}`, value);
    });
}

export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0ibm9uZSIvPgogIDxjaXJjbGUgY3g9IjcwIiBjeT0iMzAiIHI9IjEwIiBmaWxsPSIjY2NjIiAvPgogIDxwYXRoIGQ9Ik0yMCw4MCBMNDAuNSw1MCBMNjAsODAgTDgwLDU1IEw5MCw3MCBMOTAsODAgSDEwIEwyMCw4MCBaIiBmaWxsPSIjY2NjIiAvPgo8L3N2Zz4=";
export const PLACEHOLDER_USER = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTUwIDI1Yy04LjI4IDAtMTUgNi43Mi0xNSA1cy42OCAxNSAxNSAxNSA1LTYuNzIgNS0xNS02LjcyLTE1LTE1eiIvPjxwYXRoIGQ9Ik01MCA1NEMzMy4yNyA1NCAyMCA2Ny4yNyAyMCA4NGgwYzAgMy4zMSAyLjY5IDYgNiA2aDQ4YzMuMzEgMCA2LTIuNjkgNi02aDBjMC0xNi43My0xMy4yNy0zMC00MC0zMHoiLz48L3N2Zz4=";
export const PLACEHOLDER_BRAND = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTUwIDE1IEw4NSA1MCBMNTAgODUgTDE1IDUwIFoiIGZpbGw9IiNjY2MiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik01MCAzMCBMNzAgNTAgTDUwIDcwIEwzMCA1MCBaIiBmaWxsPSIjY2NjIi8+PC9zdmc+";


export const ThemeProvider = ({
                                                                children,
                                                                importTheme = undefined,
                                                                config = undefined
}: ThemeProviderProps) => {
    const normalized = useMemo(() => normalizeThemeProviderConfig(config), [config]);
    const initialPreset = normalized.presets[normalized.defaultPreset] ?? normalized.presets.default;
    const [preset, setPreset] = useState(normalized.defaultPreset);
    const [mode, setMode] = useState<ThemeMode>(normalized.defaultMode ?? initialPreset.mode ?? 'light');
    const [primary, setPrimary] = useState(initialPreset.primary ?? BUILT_IN_THEME_PRESETS.default.primary!);
    const [primaryForeground, setPrimaryForeground] = useState(initialPreset.primaryForeground ?? BUILT_IN_THEME_PRESETS.default.primaryForeground!);
    const [radius, setRadius] = useState(initialPreset.radius ?? BUILT_IN_THEME_PRESETS.default.radius!);
    const [theme, setTheme] = useState<Theme>(() => cloneTheme(defaultTheme));

    useEffect(() => {
        const selectedPreset = normalized.presets[normalized.defaultPreset] ?? normalized.presets.default;
        setPreset(normalized.defaultPreset);
        setMode(normalized.defaultMode ?? selectedPreset.mode ?? 'light');
        setPrimary(selectedPreset.primary ?? BUILT_IN_THEME_PRESETS.default.primary!);
        setPrimaryForeground(selectedPreset.primaryForeground ?? BUILT_IN_THEME_PRESETS.default.primaryForeground!);
        setRadius(selectedPreset.radius ?? BUILT_IN_THEME_PRESETS.default.radius!);
    }, [normalized]);

    useEffect(() => {
        const currentPreset = normalized.presets[preset] ?? normalized.presets.default;
        const nextTheme = cloneTheme(defaultTheme);
        deepMerge(nextTheme, currentPreset.theme ?? {});
        deepMerge(nextTheme, normalized.theme ?? {});
        setTheme(nextTheme);

        const loadTheme = async () => {
            try {
                const module = importTheme ? await importTheme() : {};
                const optionalTheme = module.theme || {};
                if (Object.keys(optionalTheme).length > 0) {
                    setTheme((current) => deepMerge(cloneTheme(current), optionalTheme));
                }
            } catch (err) {
                console.warn("Optional theme not found or failed to load.", err);
            }
        };
        loadTheme();
    }, [importTheme, normalized, preset]);

    useEffect(() => {
        const currentPreset = normalized.presets[preset] ?? normalized.presets.default;
        applyThemeVars({
            mode,
            primary,
            primaryForeground,
            radius,
            variables: currentPreset.variables,
        });
    }, [mode, normalized.presets, preset, primary, primaryForeground, radius]);

    const controller = useMemo<ThemeController>(() => ({
        mode,
        resolvedMode: resolveMode(mode),
        preset,
        primary,
        primaryForeground,
        radius,
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
            setMode(normalized.defaultMode ?? resolvedPreset.mode ?? 'light');
            setPrimary(resolvedPreset.primary ?? BUILT_IN_THEME_PRESETS.default.primary!);
            setPrimaryForeground(resolvedPreset.primaryForeground ?? BUILT_IN_THEME_PRESETS.default.primaryForeground!);
            setRadius(resolvedPreset.radius ?? BUILT_IN_THEME_PRESETS.default.radius!);
        },
        setPrimary,
        setRadius,
    }), [mode, preset, primary, primaryForeground, radius, normalized]);

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
