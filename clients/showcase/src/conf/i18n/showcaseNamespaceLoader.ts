import type { I18nLocale } from '@llmnative/react';

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
    | 'imageUrl'
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
    | 'richText';

type LocaleKey = 'en' | 'it' | 'de' | 'ru' | 'zh' | 'ar';
type LocaleModule = { default: I18nLocale };

const localeFallback: LocaleKey = 'en';

const VALID_LOCALES: LocaleKey[] = ['en', 'it', 'de', 'ru', 'zh', 'ar'];

const dedicatedNamespaceLoaders: Partial<Record<ShowcaseNamespace, Record<LocaleKey, () => Promise<LocaleModule>>>> = {
    common: {
        en: () => import('./common.en'),
        it: () => import('./common.it'),
        de: () => import('./common.de'),
        ru: () => import('./common.ru'),
        zh: () => import('./common.zh'),
        ar: () => import('./common.ar'),
    },
    grid: {
        en: () => import('./grid.en'),
        it: () => import('./grid.it'),
        de: () => import('./grid.de'),
        ru: () => import('./grid.ru'),
        zh: () => import('./grid.zh'),
        ar: () => import('./grid.ar'),
    },
    gridArray: {
        en: () => import('./gridArray.en'),
        it: () => import('./gridArray.it'),
        de: () => import('./gridArray.de'),
        ru: () => import('./gridArray.ru'),
        zh: () => import('./gridArray.zh'),
        ar: () => import('./gridArray.ar'),
    },
    gridDb: {
        en: () => import('./gridDb.en'),
        it: () => import('./gridDb.it'),
        de: () => import('./gridDb.de'),
        ru: () => import('./gridDb.ru'),
        zh: () => import('./gridDb.zh'),
        ar: () => import('./gridDb.ar'),
    },
    alert: {
        en: () => import('./alert.en'),
        it: () => import('./alert.it'),
        de: () => import('./alert.de'),
        ru: () => import('./alert.ru'),
        zh: () => import('./alert.zh'),
        ar: () => import('./alert.ar'),
    },
    badge: {
        en: () => import('./badge.en'),
        it: () => import('./badge.it'),
        de: () => import('./badge.de'),
        ru: () => import('./badge.ru'),
        zh: () => import('./badge.zh'),
        ar: () => import('./badge.ar'),
    },
    card: {
        en: () => import('./card.en'),
        it: () => import('./card.it'),
        de: () => import('./card.de'),
        ru: () => import('./card.ru'),
        zh: () => import('./card.zh'),
        ar: () => import('./card.ar'),
    },
    loader: {
        en: () => import('./loader.en'),
        it: () => import('./loader.it'),
        de: () => import('./loader.de'),
        ru: () => import('./loader.ru'),
        zh: () => import('./loader.zh'),
        ar: () => import('./loader.ar'),
    },
    icon: {
        en: () => import('./icon.en'),
        it: () => import('./icon.it'),
        de: () => import('./icon.de'),
        ru: () => import('./icon.ru'),
        zh: () => import('./icon.zh'),
        ar: () => import('./icon.ar'),
    },
    brand: {
        en: () => import('./brand.en'),
        it: () => import('./brand.it'),
        de: () => import('./brand.de'),
        ru: () => import('./brand.ru'),
        zh: () => import('./brand.zh'),
        ar: () => import('./brand.ar'),
    },
    carousel: {
        en: () => import('./carousel.en'),
        it: () => import('./carousel.it'),
        de: () => import('./carousel.de'),
        ru: () => import('./carousel.ru'),
        zh: () => import('./carousel.zh'),
        ar: () => import('./carousel.ar'),
    },
    gallery: {
        en: () => import('./gallery.en'),
        it: () => import('./gallery.it'),
        de: () => import('./gallery.de'),
        ru: () => import('./gallery.ru'),
        zh: () => import('./gallery.zh'),
        ar: () => import('./gallery.ar'),
    },
    gridSystem: {
        en: () => import('./gridSystem.en'),
        it: () => import('./gridSystem.it'),
        de: () => import('./gridSystem.de'),
        ru: () => import('./gridSystem.ru'),
        zh: () => import('./gridSystem.zh'),
        ar: () => import('./gridSystem.ar'),
    },
    table: {
        en: () => import('./table.en'),
        it: () => import('./table.it'),
        de: () => import('./table.de'),
        ru: () => import('./table.ru'),
        zh: () => import('./table.zh'),
        ar: () => import('./table.ar'),
    },
    auth: {
        en: () => import('./auth.en'),
        it: () => import('./auth.it'),
        de: () => import('./auth.de'),
        ru: () => import('./auth.ru'),
        zh: () => import('./auth.zh'),
        ar: () => import('./auth.ar'),
    },
    examplesOverview: {
        en: () => import('./examplesOverview.en'),
        it: () => import('./examplesOverview.it'),
        de: () => import('./examplesOverview.de'),
        ru: () => import('./examplesOverview.ru'),
        zh: () => import('./examplesOverview.zh'),
        ar: () => import('./examplesOverview.ar'),
    },
    benchmark: {
        en: () => import('./benchmark.en'),
        it: () => import('./benchmark.it'),
        de: () => import('./benchmark.de'),
        ru: () => import('./benchmark.ru'),
        zh: () => import('./benchmark.zh'),
        ar: () => import('./benchmark.ar'),
    },
    checkbox: {
        en: () => import('./checkbox.en'),
        it: () => import('./checkbox.it'),
        de: () => import('./checkbox.de'),
        ru: () => import('./checkbox.ru'),
        zh: () => import('./checkbox.zh'),
        ar: () => import('./checkbox.ar'),
    },
    buttons: {
        en: () => import('./buttons.en'),
        it: () => import('./buttons.it'),
        de: () => import('./buttons.de'),
        ru: () => import('./buttons.ru'),
        zh: () => import('./buttons.zh'),
        ar: () => import('./buttons.ar'),
    },
    actionButton: {
        en: () => import('./actionButton.en'),
        it: () => import('./actionButton.it'),
        de: () => import('./actionButton.de'),
        ru: () => import('./actionButton.ru'),
        zh: () => import('./actionButton.zh'),
        ar: () => import('./actionButton.ar'),
    },
    loadingButton: {
        en: () => import('./loadingButton.en'),
        it: () => import('./loadingButton.it'),
        de: () => import('./loadingButton.de'),
        ru: () => import('./loadingButton.ru'),
        zh: () => import('./loadingButton.zh'),
        ar: () => import('./loadingButton.ar'),
    },
    navigationButtons: {
        en: () => import('./navigationButtons.en'),
        it: () => import('./navigationButtons.it'),
        de: () => import('./navigationButtons.de'),
        ru: () => import('./navigationButtons.ru'),
        zh: () => import('./navigationButtons.zh'),
        ar: () => import('./navigationButtons.ar'),
    },
    code: {
        en: () => import('./code.en'),
        it: () => import('./code.it'),
        de: () => import('./code.de'),
        ru: () => import('./code.ru'),
        zh: () => import('./code.zh'),
        ar: () => import('./code.ar'),
    },
    modal: {
        en: () => import('./modal.en'),
        it: () => import('./modal.it'),
        de: () => import('./modal.de'),
        ru: () => import('./modal.ru'),
        zh: () => import('./modal.zh'),
        ar: () => import('./modal.ar'),
    },
    modalYesNo: {
        en: () => import('./modalYesNo.en'),
        it: () => import('./modalYesNo.it'),
        de: () => import('./modalYesNo.de'),
        ru: () => import('./modalYesNo.ru'),
        zh: () => import('./modalYesNo.zh'),
        ar: () => import('./modalYesNo.ar'),
    },
    modalOk: {
        en: () => import('./modalOk.en'),
        it: () => import('./modalOk.it'),
        de: () => import('./modalOk.de'),
        ru: () => import('./modalOk.ru'),
        zh: () => import('./modalOk.zh'),
        ar: () => import('./modalOk.ar'),
    },
    pagination: {
        en: () => import('./pagination.en'),
        it: () => import('./pagination.it'),
        de: () => import('./pagination.de'),
        ru: () => import('./pagination.ru'),
        zh: () => import('./pagination.zh'),
        ar: () => import('./pagination.ar'),
    },
    percentage: {
        en: () => import('./percentage.en'),
        it: () => import('./percentage.it'),
        de: () => import('./percentage.de'),
        ru: () => import('./percentage.ru'),
        zh: () => import('./percentage.zh'),
        ar: () => import('./percentage.ar'),
    },
    localeSwitcher: {
        en: () => import('./localeSwitcher.en'),
        it: () => import('./localeSwitcher.it'),
        de: () => import('./localeSwitcher.de'),
        ru: () => import('./localeSwitcher.ru'),
        zh: () => import('./localeSwitcher.zh'),
        ar: () => import('./localeSwitcher.ar'),
    },
    tab: {
        en: () => import('./tab.en'),
        it: () => import('./tab.it'),
        de: () => import('./tab.de'),
        ru: () => import('./tab.ru'),
        zh: () => import('./tab.zh'),
        ar: () => import('./tab.ar'),
    },
    dropdown: {
        en: () => import('./dropdown.en'),
        it: () => import('./dropdown.it'),
        de: () => import('./dropdown.de'),
        ru: () => import('./dropdown.ru'),
        zh: () => import('./dropdown.zh'),
        ar: () => import('./dropdown.ar'),
    },
    motion: {
        en: () => import('./motion.en'),
        it: () => import('./motion.it'),
        de: () => import('./motion.de'),
        ru: () => import('./motion.ru'),
        zh: () => import('./motion.zh'),
        ar: () => import('./motion.ar'),
    },
    listGroup: {
        en: () => import('./listGroup.en'),
        it: () => import('./listGroup.it'),
        de: () => import('./listGroup.de'),
        ru: () => import('./listGroup.ru'),
        zh: () => import('./listGroup.zh'),
        ar: () => import('./listGroup.ar'),
    },
    imageAvatar: {
        en: () => import('./imageAvatar.en'),
        it: () => import('./imageAvatar.it'),
        de: () => import('./imageAvatar.de'),
        ru: () => import('./imageAvatar.ru'),
        zh: () => import('./imageAvatar.zh'),
        ar: () => import('./imageAvatar.ar'),
    },
    input: {
        en: () => import('./input.en'),
        it: () => import('./input.it'),
        de: () => import('./input.de'),
        ru: () => import('./input.ru'),
        zh: () => import('./input.zh'),
        ar: () => import('./input.ar'),
    },
    switch: {
        en: () => import('./switch.en'),
        it: () => import('./switch.it'),
        de: () => import('./switch.de'),
        ru: () => import('./switch.ru'),
        zh: () => import('./switch.zh'),
        ar: () => import('./switch.ar'),
    },
    select: {
        en: () => import('./select.en'),
        it: () => import('./select.it'),
        de: () => import('./select.de'),
        ru: () => import('./select.ru'),
        zh: () => import('./select.zh'),
        ar: () => import('./select.ar'),
    },
    textArea: {
        en: () => import('./textArea.en'),
        it: () => import('./textArea.it'),
        de: () => import('./textArea.de'),
        ru: () => import('./textArea.ru'),
        zh: () => import('./textArea.zh'),
        ar: () => import('./textArea.ar'),
    },
    imageUrl: {
        en: () => import('./imageUrl.en'),
        it: () => import('./imageUrl.it'),
        de: () => import('./imageUrl.de'),
        ru: () => import('./imageUrl.ru'),
        zh: () => import('./imageUrl.zh'),
        ar: () => import('./imageUrl.ar'),
    },
    autocomplete: {
        en: () => import('./autocomplete.en'),
        it: () => import('./autocomplete.it'),
        de: () => import('./autocomplete.de'),
        ru: () => import('./autocomplete.ru'),
        zh: () => import('./autocomplete.zh'),
        ar: () => import('./autocomplete.ar'),
    },
    checklist: {
        en: () => import('./checklist.en'),
        it: () => import('./checklist.it'),
        de: () => import('./checklist.de'),
        ru: () => import('./checklist.ru'),
        zh: () => import('./checklist.zh'),
        ar: () => import('./checklist.ar'),
    },
    image: {
        en: () => import('./image.en'),
        it: () => import('./image.it'),
        de: () => import('./image.de'),
        ru: () => import('./image.ru'),
        zh: () => import('./image.zh'),
        ar: () => import('./image.ar'),
    },
    notifications: {
        en: () => import('./notifications.en'),
        it: () => import('./notifications.it'),
        de: () => import('./notifications.de'),
        ru: () => import('./notifications.ru'),
        zh: () => import('./notifications.zh'),
        ar: () => import('./notifications.ar'),
    },
    search: {
        en: () => import('./search.en'),
        it: () => import('./search.it'),
        de: () => import('./search.de'),
        ru: () => import('./search.ru'),
        zh: () => import('./search.zh'),
        ar: () => import('./search.ar'),
    },
    menu: {
        en: () => import('./menu.en'),
        it: () => import('./menu.it'),
        de: () => import('./menu.de'),
        ru: () => import('./menu.ru'),
        zh: () => import('./menu.zh'),
        ar: () => import('./menu.ar'),
    },
    breadcrumbs: {
        en: () => import('./breadcrumbs.en'),
        it: () => import('./breadcrumbs.it'),
        de: () => import('./breadcrumbs.de'),
        ru: () => import('./breadcrumbs.ru'),
        zh: () => import('./breadcrumbs.zh'),
        ar: () => import('./breadcrumbs.ar'),
    },
    repeat: {
        en: () => import('./repeat.en'),
        it: () => import('./repeat.it'),
        de: () => import('./repeat.de'),
        ru: () => import('./repeat.ru'),
        zh: () => import('./repeat.zh'),
        ar: () => import('./repeat.ar'),
    },
    tabDynamic: {
        en: () => import('./tabDynamic.en'),
        it: () => import('./tabDynamic.it'),
        de: () => import('./tabDynamic.de'),
        ru: () => import('./tabDynamic.ru'),
        zh: () => import('./tabDynamic.zh'),
        ar: () => import('./tabDynamic.ar'),
    },
    gridPreview: {
        en: () => import('./gridPreview.en'),
        it: () => import('./gridPreview.it'),
        de: () => import('./gridPreview.de'),
        ru: () => import('./gridPreview.ru'),
        zh: () => import('./gridPreview.zh'),
        ar: () => import('./gridPreview.ar'),
    },
    home: {
        en: () => import('./home.en'),
        it: () => import('./home.it'),
        de: () => import('./home.de'),
        ru: () => import('./home.ru'),
        zh: () => import('./home.zh'),
        ar: () => import('./home.ar'),
    },
    imageEditor: {
        en: () => import('./imageEditor.en'),
        it: () => import('./imageEditor.it'),
        de: () => import('./imageEditor.de'),
        ru: () => import('./imageEditor.ru'),
        zh: () => import('./imageEditor.zh'),
        ar: () => import('./imageEditor.ar'),
    },
    layoutBuilder: {
        en: () => import('./layoutBuilder.en'),
        it: () => import('./layoutBuilder.it'),
        de: () => import('./layoutBuilder.de'),
        ru: () => import('./layoutBuilder.ru'),
        zh: () => import('./layoutBuilder.zh'),
        ar: () => import('./layoutBuilder.ar'),
    },
    markdownReader: {
        en: () => import('./markdownReader.en'),
        it: () => import('./markdownReader.it'),
        de: () => import('./markdownReader.de'),
        ru: () => import('./markdownReader.ru'),
        zh: () => import('./markdownReader.zh'),
        ar: () => import('./markdownReader.ar'),
    },
    upload: {
        en: () => import('./upload.en'),
        it: () => import('./upload.it'),
        de: () => import('./upload.de'),
        ru: () => import('./upload.ru'),
        zh: () => import('./upload.zh'),
        ar: () => import('./upload.ar'),
    },
    uploadImage: {
        en: () => import('./uploadImage.en'),
        it: () => import('./uploadImage.it'),
        de: () => import('./uploadImage.de'),
        ru: () => import('./uploadImage.ru'),
        zh: () => import('./uploadImage.zh'),
        ar: () => import('./uploadImage.ar'),
    },
    uploadDocument: {
        en: () => import('./uploadDocument.en'),
        it: () => import('./uploadDocument.it'),
        de: () => import('./uploadDocument.de'),
        ru: () => import('./uploadDocument.ru'),
        zh: () => import('./uploadDocument.zh'),
        ar: () => import('./uploadDocument.ar'),
    },
    uploadCsv: {
        en: () => import('./uploadCsv.en'),
        it: () => import('./uploadCsv.it'),
        de: () => import('./uploadCsv.de'),
        ru: () => import('./uploadCsv.ru'),
        zh: () => import('./uploadCsv.zh'),
        ar: () => import('./uploadCsv.ar'),
    },
    prompt: {
        en: () => import('./prompt.en'),
        it: () => import('./prompt.it'),
        de: () => import('./prompt.de'),
        ru: () => import('./prompt.ru'),
        zh: () => import('./prompt.zh'),
        ar: () => import('./prompt.ar'),
    },
    promptShared: {
        en: () => import('./promptShared.en'),
        it: () => import('./promptShared.it'),
        de: () => import('./promptShared.de'),
        ru: () => import('./promptShared.ru'),
        zh: () => import('./promptShared.zh'),
        ar: () => import('./promptShared.ar'),
    },
    promptEditor: {
        en: () => import('./promptEditor.en'),
        it: () => import('./promptEditor.it'),
        de: () => import('./promptEditor.de'),
        ru: () => import('./promptEditor.ru'),
        zh: () => import('./promptEditor.zh'),
        ar: () => import('./promptEditor.ar'),
    },
    promptLive: {
        en: () => import('./promptLive.en'),
        it: () => import('./promptLive.it'),
        de: () => import('./promptLive.de'),
        ru: () => import('./promptLive.ru'),
        zh: () => import('./promptLive.zh'),
        ar: () => import('./promptLive.ar'),
    },
    promptPlain: {
        en: () => import('./promptPlain.en'),
        it: () => import('./promptPlain.it'),
        de: () => import('./promptPlain.de'),
        ru: () => import('./promptPlain.ru'),
        zh: () => import('./promptPlain.zh'),
        ar: () => import('./promptPlain.ar'),
    },
    form: {
        en: () => import('./form.en'),
        it: () => import('./form.it'),
        de: () => import('./form.de'),
        ru: () => import('./form.ru'),
        zh: () => import('./form.zh'),
        ar: () => import('./form.ar'),
    },
    formValidation: {
        en: () => import('./formValidation.en'),
        it: () => import('./formValidation.it'),
        de: () => import('./formValidation.de'),
        ru: () => import('./formValidation.ru'),
        zh: () => import('./formValidation.zh'),
        ar: () => import('./formValidation.ar'),
    },
    richText: {
        en: () => import('./richText.en'),
        it: () => import('./richText.it'),
        de: () => import('./richText.de'),
        ru: () => import('./richText.ru'),
        zh: () => import('./richText.zh'),
        ar: () => import('./richText.ar'),
    },
};

const namespaceCache = new Map<string, Promise<I18nLocale>>();

function normalizeLocale(locale: string): LocaleKey {
    return (VALID_LOCALES as readonly string[]).includes(locale) ? locale as LocaleKey : localeFallback;
}

export function loadShowcaseNamespace(locale: string, namespace: ShowcaseNamespace): Promise<I18nLocale> {
    const normalizedLocale = normalizeLocale(locale);
    const cacheKey = `${normalizedLocale}:${namespace}`;
    const cached = namespaceCache.get(cacheKey);
    if (cached) return cached;

    const promise = (async () => {
        const dedicatedLoader = dedicatedNamespaceLoaders[namespace]?.[normalizedLocale];
        return dedicatedLoader().then((module) => module.default);
    })();

    namespaceCache.set(cacheKey, promise);
    return promise;
}
