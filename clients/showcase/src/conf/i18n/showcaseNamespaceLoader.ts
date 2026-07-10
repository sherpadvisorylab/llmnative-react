import type { I18nLocale } from '@llmnative/react';
import {
    showcaseLocaleCatalog,
    SHOWCASE_FALLBACK_LOCALE,
    SHOWCASE_VALID_LOCALES,
    type ShowcaseLocaleKey,
} from './showcaseLocaleCatalog';

export type ShowcaseNamespace =
    | 'common'
    | 'alert'
    | 'badge'
    | 'card'
    | 'loader'
    | 'icon'
    | 'brand'
    | 'carousel'
    | 'gallery'
    | 'gridSystem'
    | 'table'
    | 'auth'
    | 'examplesOverview'
    | 'benchmark'
    | 'checkbox'
    | 'buttons'
    | 'actionButton'
    | 'loadingButton'
    | 'navigationButtons'
    | 'code'
    | 'modal'
    | 'modalYesNo'
    | 'modalOk'
    | 'pagination'
    | 'percentage'
    | 'localeSwitcher'
    | 'tab'
    | 'dropdown'
    | 'motion'
    | 'listGroup'
    | 'imageAvatar'
    | 'input'
    | 'switch'
    | 'select'
    | 'textArea'
    | 'autocomplete'
    | 'checklist'
    | 'image'
    | 'notifications'
    | 'search'
    | 'menu'
    | 'breadcrumbs'
    | 'repeat'
    | 'tabDynamic'
    | 'gridPreview'
    | 'home'
    | 'imageEditor'
    | 'layoutBuilder'
    | 'markdownReader'
    | 'grid'
    | 'gridArray'
    | 'gridDb'
    | 'upload'
    | 'uploadImage'
    | 'uploadDocument'
    | 'uploadCsv'
    | 'prompt'
    | 'promptShared'
    | 'promptEditor'
    | 'promptLive'
    | 'promptPlain'
    | 'form'
    | 'formValidation'
    | 'richText'
    | 'imageField'
    | 'codeEditor'
    | 'crud'
    | 'dashboard'
    | 'nestedForm'
    | 'fileManager'
    | 'googleAuth';

function normalizeLocale(locale: string): ShowcaseLocaleKey {
    return (SHOWCASE_VALID_LOCALES as readonly string[]).includes(locale) ? locale as ShowcaseLocaleKey : SHOWCASE_FALLBACK_LOCALE;
}

const namespaceCache = new Map<string, Promise<I18nLocale>>();

export function loadShowcaseNamespace(locale: string, namespace: ShowcaseNamespace): Promise<I18nLocale> {
    const normalizedLocale = normalizeLocale(locale);
    const cacheKey = `${normalizedLocale}:${namespace}`;
    const cached = namespaceCache.get(cacheKey);
    if (cached) return cached;

    const promise = Promise.resolve(
        showcaseLocaleCatalog[normalizedLocale]?.[namespace]
        ?? showcaseLocaleCatalog[SHOWCASE_FALLBACK_LOCALE]?.[namespace]
        ?? { showcase: { [namespace]: {} } } as I18nLocale,
    );

    namespaceCache.set(cacheKey, promise);
    return promise;
}
