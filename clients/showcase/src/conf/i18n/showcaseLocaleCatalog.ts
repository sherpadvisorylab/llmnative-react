import type { I18nLocale } from '@llmnative/react';
import type { ShowcaseNamespace } from './showcaseNamespaceLoader';

export type ShowcaseLocaleKey = 'en' | 'it' | 'de' | 'ru' | 'zh' | 'ar';

type LocaleModule = { default: I18nLocale };

const localeModules = import.meta.glob<LocaleModule>('./*.en.ts', { eager: true });
const localeModulesIt = import.meta.glob<LocaleModule>('./*.it.ts', { eager: true });
const localeModulesDe = import.meta.glob<LocaleModule>('./*.de.ts', { eager: true });
const localeModulesRu = import.meta.glob<LocaleModule>('./*.ru.ts', { eager: true });
const localeModulesZh = import.meta.glob<LocaleModule>('./*.zh.ts', { eager: true });
const localeModulesAr = import.meta.glob<LocaleModule>('./*.ar.ts', { eager: true });

const allLocaleModules: Record<string, LocaleModule> = {
    ...localeModules,
    ...localeModulesIt,
    ...localeModulesDe,
    ...localeModulesRu,
    ...localeModulesZh,
    ...localeModulesAr,
};

const LOCALE_FILE_PATTERN = /^\.\/([^.]+)\.(en|it|de|ru|zh|ar)\.ts$/;

export const SHOWCASE_VALID_LOCALES: ShowcaseLocaleKey[] = ['en', 'it', 'de', 'ru', 'zh', 'ar'];
export const SHOWCASE_FALLBACK_LOCALE: ShowcaseLocaleKey = 'en';

export const showcaseLocaleCatalog = Object.entries(allLocaleModules).reduce(
    (acc, [path, module]) => {
        const match = path.match(LOCALE_FILE_PATTERN);
        if (!match) return acc;

        const [, namespace, locale] = match;
        const localeKey = locale as ShowcaseLocaleKey;
        const namespaceKey = namespace as ShowcaseNamespace;
        acc[localeKey] ??= {} as Record<ShowcaseNamespace, I18nLocale>;
        acc[localeKey][namespaceKey] = module.default;
        return acc;
    },
    {} as Record<ShowcaseLocaleKey, Partial<Record<ShowcaseNamespace, I18nLocale>>>,
);

export const showcaseFallbacks = Object.entries(showcaseLocaleCatalog[SHOWCASE_FALLBACK_LOCALE] ?? {}).reduce(
    (acc, [namespace, locale]) => {
        const namespaceKey = namespace as ShowcaseNamespace;
        acc[namespaceKey] = locale.showcase?.[namespaceKey];
        return acc;
    },
    {} as Record<ShowcaseNamespace, unknown>,
);
