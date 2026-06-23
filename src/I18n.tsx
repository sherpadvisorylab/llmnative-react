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
        noChangesToSave?:     string;
        draftRestoreTitle?:   string;
        draftRestoreMessage?: string;
        draftRestoreAction?:  string;
        draftDiscardAction?:  string;
        draftRestoredTitle?:  string;
        draftRestoredMessage?: string;
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
        noProviders:            string;
        aiNotConfiguredEdit:    string;
        aiNotConfiguredRun:     string;
        aiNotConfiguredShort:  string;
        toggleOnTitle:          string;
        toggleOffTitle:         string;
        closeEditor:            string;
        editSettings:           string;
        attachFiles:            string;
        attachmentsNotSupported: string;
        run:                    string;
        runFailed:              string;
        noMatchingCommands:     string;
        tokenUsage:             string;
        tokenInput:             string;
        tokenOutput:            string;
        tokenContext:           string;
        tokenCost:              string;
        tokenTime:              string;
        tokenUsageEmpty:        string;
        hidePreview:            string;
        showPreview:            string;
        noProvider:             string;
        noResponse:             string;
        promptLabel:            string;
        defaultOption:          string;
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

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type I18nLocale = DeepPartial<I18nDict>;

type DotNestedKeyOf<T> = T extends object
    ? {
        [K in Extract<keyof T, string>]:
            T[K] extends object
                ? `${K}` | `${K}.${DotNestedKeyOf<T[K]>}`
                : `${K}`;
    }[Extract<keyof T, string>]
    : never;

type PathValue<T, P extends string> =
    P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
            ? PathValue<T[K], Rest>
            : never
        : P extends keyof T
            ? T[P]
            : never;

export type I18nTranslations = Partial<Record<string, I18nLocale>>;

export interface I18nConfig {
    locale?:       string;
    translations?: I18nTranslations;
}

export interface I18nController {
    dict:             I18nDict;
    locale:           string;
    availableLocales: string[];
    setLocale:        (locale: string) => void;
    registerTranslations: (locale: string, translations: I18nLocale) => void;
}

export function defineLocaleMessages<T extends I18nLocale>(locale: T): T {
    return locale;
}

export function createTranslations<T extends I18nTranslations>(translations: T): T {
    return translations;
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
    const isObject = (value: unknown): value is Record<string, unknown> =>
        typeof value === 'object' && value !== null && !Array.isArray(value);

    const mergeObjects = (baseValue: unknown, patchValue: unknown): unknown => {
        if (!isObject(baseValue) || !isObject(patchValue)) return patchValue ?? baseValue;

        const merged: Record<string, unknown> = { ...baseValue };
        for (const key of Object.keys(patchValue)) {
            merged[key] = key in merged
                ? mergeObjects(merged[key], patchValue[key])
                : patchValue[key];
        }
        return merged;
    };

    return mergeObjects(base, patch) as I18nDict;
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
    const [runtimeTranslations, setRuntimeTranslations] = useState<I18nTranslations>({});

    const availableLocales = useMemo<string[]>(() => {
        const keys = [
            ...Object.keys(config?.translations ?? {}),
            ...Object.keys(runtimeTranslations),
        ];
        return Array.from(new Set(['en', ...keys.filter((k) => k !== 'en')]));
    }, [config?.translations, runtimeTranslations]);

    const [locale, setLocaleState] = useState<string>(() => {
        const cookie = readLocaleCookie();
        if (cookie && availableLocales.includes(cookie)) return cookie;
        return config?.locale ?? 'en';
    });

    const dict = useMemo<I18nDict>(() => {
        const configPatch = config?.translations?.[locale];
        const runtimePatch = runtimeTranslations[locale];

        let merged = en;
        if (configPatch) merged = deepMerge(merged, configPatch);
        if (runtimePatch) merged = deepMerge(merged, runtimePatch);

        return merged;
    }, [locale, config?.translations, runtimeTranslations]);

    const setLocale = useCallback((next: string) => {
        writeLocaleCookie(next);
        setLocaleState(next);
    }, []);

    const registerTranslations = useCallback((targetLocale: string, translations: I18nLocale) => {
        setRuntimeTranslations((current) => {
            const previous = current[targetLocale];
            const nextLocaleTranslations = previous
                ? deepMerge(previous as I18nDict, translations)
                : translations;

            return {
                ...current,
                [targetLocale]: nextLocaleTranslations,
            };
        });
    }, []);

    const controller = useMemo<I18nController>(
        () => ({ dict, locale, availableLocales, setLocale, registerTranslations }),
        [dict, locale, availableLocales, setLocale, registerTranslations],
    );

    return <I18nContext.Provider value={controller}>{children}</I18nContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook — two overloads:
//   useI18n()           → full controller { dict, locale, setLocale }
//   useI18n('grid')     → dict.grid slice, typed as I18nDict['grid']
// ---------------------------------------------------------------------------

export function useI18n(): I18nController;
export function useI18n<P extends DotNestedKeyOf<I18nDict>>(namespace: P): PathValue<I18nDict, P>;
export function useI18n<P extends DotNestedKeyOf<I18nDict>>(namespace?: P): I18nController | PathValue<I18nDict, P> {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used inside <App> or <I18nProvider>.');
    if (namespace === undefined) return ctx;

    return namespace
        .split('.')
        .reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], ctx.dict) as PathValue<I18nDict, P>;
}
