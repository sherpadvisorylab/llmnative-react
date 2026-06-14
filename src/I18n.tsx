import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { en } from './conf/i18n/en';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface I18nDict {
    common: {
        save:            string;
        cancel:          string;
        delete:          string;
        close:           string;
        back:            string;
        search:          string;
        loading:         string;
        noDataFound:     string;
        pageNavigation:  string;
        previous:        string;
        next:            string;
        notFoundMessage: string;
        goHome:          string;
    };
    auth: {
        signIn:         string;
        signOut:        string;
        connect:        string;
        connected:      string;
        authenticated:  string;
        notConfigured:  string;
        notImplemented: string;
    };
    form: {
        headerAdd:            string;
        headerEdit:           string;
        buttonSave:           string;
        buttonDelete:         string;
        buttonBack:           string;
        requiredField:        string;
        requiredFieldGeneric: string;
        saveSuccess:          string;
        deleteSuccess:        string;
        noticeRequiredFields: string;
    };
    grid: {
        buttonAdd:     string;
        deleteConfirm: string;
        emptyState:    string;
    };
    select: {
        placeholder: string;
    };
    modal: {
        save:   string;
        delete: string;
        cancel: string;
        close:  string;
    };
    upload: {
        clickOrDrag:   string;
        dropToUpload:  string;
        uploadMore:    string;
        editFileName:  string;
        editorImage:   string;
        loaded:        string;
        removeFile:    string;
        uploadAnother: string;
        dropToParse:   string;
    };
    notifications: {
        title:  string;
        seeAll: string;
    };
    code: {
        copyCode:             string;
        copy:                 string;
        copied:               string;
        codeLanguageDefault:  string;
    };
    table: {
        noDataFound:   string;
        selectAllRows: string;
        sortBy:        string;
        sortByCurrent: string;
        selectRow:     string;
        reorderRow:    string;
    };
    gallery: {
        selectItem: string;
    };
    crop: {
        enableCrop:    string;
        variants:      string;
        outputFile:    string;
        active:        string;
        removeVariant: string;
        fileName:      string;
    };
    imageEditor: {
        title:          string;
        save:           string;
        undo:           string;
        redo:           string;
        zoomOut:        string;
        zoomIn:         string;
        crop:           string;
        flipHorizontal: string;
        flipVertical:   string;
        rotate:         string;
        freeDrawing:    string;
        arrow:          string;
        text:           string;
        rectangle:      string;
        circle:         string;
        triangle:       string;
    };
    prompt: {
        noProviders:         string;
        aiNotConfiguredEdit: string;
        aiNotConfiguredRun:  string;
        toggleOnTitle:       string;
        toggleOffTitle:      string;
        closeEditor:         string;
        editSettings:        string;
        attachFiles:         string;
        run:                 string;
        noMatchingCommands:  string;
        tokenUsage:          string;
        tokenInput:          string;
        tokenOutput:         string;
        tokenContext:        string;
        tokenCost:           string;
        tokenTime:           string;
        tokenUsageEmpty:     string;
        hidePreview:         string;
        showPreview:         string;
        noProvider:          string;
        noResponse:          string;
    };
    layout: {
        maxElements:  string;
        noSpace:      string;
        dragToMove:   string;
        remove:       string;
        dragToResize: string;
        dragHere:     string;
    };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export type I18nTranslations = Partial<Record<string, DeepPartial<I18nDict>>>;

export interface I18nConfig {
    locale?:       string;
    translations?: I18nTranslations;
}

export interface I18nController {
    dict:             I18nDict;
    locale:           string;
    availableLocales: string[];
    setLocale:        (locale: string) => void;
}

// ---------------------------------------------------------------------------
// interpolate — pure helper, use it anywhere without the context
// ---------------------------------------------------------------------------

export function interpolate(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

// ---------------------------------------------------------------------------
// Deep merge (two levels — enough for I18nDict)
// ---------------------------------------------------------------------------

function deepMerge(base: I18nDict, patch: DeepPartial<I18nDict>): I18nDict {
    const result = { ...base } as unknown as Record<string, Record<string, string>>;
    for (const ns of Object.keys(patch) as (keyof I18nDict)[]) {
        const patchNs = patch[ns];
        if (patchNs && typeof patchNs === 'object') {
            result[ns] = { ...(base[ns] as Record<string, string>), ...patchNs };
        }
    }
    return result as unknown as I18nDict;
}

// ---------------------------------------------------------------------------
// Cookie helpers — SSR-safe, no external dependency
// ---------------------------------------------------------------------------

const LOCALE_COOKIE = 'llmnative_locale';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readLocaleCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const m = document.cookie.match(/(?:^|;\s*)llmnative_locale=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
}

function writeLocaleCookie(locale: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

// ---------------------------------------------------------------------------
// Context + Provider
// ---------------------------------------------------------------------------

const I18nContext = createContext<I18nController | null>(null);

interface I18nProviderProps {
    children: React.ReactNode;
    config?:  I18nConfig;
}

export const I18nProvider = ({ children, config }: I18nProviderProps) => {
    const availableLocales = useMemo<string[]>(() => {
        const keys = Object.keys(config?.translations ?? {});
        return ['en', ...keys.filter((k) => k !== 'en')];
    }, [config?.translations]);

    const [locale, setLocaleState] = useState<string>(() => {
        const cookie = readLocaleCookie();
        if (cookie && availableLocales.includes(cookie)) return cookie;
        return config?.locale ?? 'en';
    });

    const dict = useMemo<I18nDict>(() => {
        const patch = config?.translations?.[locale];
        return patch ? deepMerge(en, patch) : en;
    }, [locale, config?.translations]);

    const setLocale = useCallback((next: string) => {
        writeLocaleCookie(next);
        setLocaleState(next);
    }, []);

    const controller = useMemo<I18nController>(
        () => ({ dict, locale, availableLocales, setLocale }),
        [dict, locale, availableLocales, setLocale],
    );

    return <I18nContext.Provider value={controller}>{children}</I18nContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook — two overloads:
//   useI18n()           → full controller { dict, locale, setLocale }
//   useI18n('grid')     → dict.grid slice, typed as I18nDict['grid']
// ---------------------------------------------------------------------------

export function useI18n(): I18nController;
export function useI18n<K extends keyof I18nDict>(namespace: K): I18nDict[K];
export function useI18n<K extends keyof I18nDict>(namespace?: K): I18nController | I18nDict[K] {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used inside <App> or <I18nProvider>.');
    return namespace !== undefined ? ctx.dict[namespace] : ctx;
}
