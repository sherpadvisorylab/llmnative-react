import React from 'react';
import { useI18n } from '@llmnative/react';
import type { I18nDict } from '@llmnative/react';
import { loadShowcaseNamespace, type ShowcaseNamespace } from '../conf/i18n/showcaseNamespaceLoader';
import { showcaseFallbacks } from '../conf/i18n/showcaseFallbacks';

function useShowcaseSlice<TKey extends ShowcaseNamespace>(namespace: TKey): I18nDict['showcase'][TKey] {
    const { dict, locale, registerTranslations } = useI18n();

    React.useEffect(() => {
        if (dict.showcase?.[namespace]) return;

        let cancelled = false;

        void loadShowcaseNamespace(locale, namespace).then((patch) => {
            if (cancelled) return;
            registerTranslations(locale, patch);
        });

        return () => {
            cancelled = true;
        };
    }, [dict, locale, namespace, registerTranslations]);

    return (dict.showcase?.[namespace] ?? showcaseFallbacks[namespace]) as I18nDict['showcase'][TKey];
}

export const useShowcaseCommonI18n = () => useShowcaseSlice('common');
export const useShowcaseAlertI18n = () => useShowcaseSlice('alert');
export const useShowcaseBadgeI18n = () => useShowcaseSlice('badge');
export const useShowcaseCardI18n = () => useShowcaseSlice('card');
export const useShowcaseLoaderI18n = () => useShowcaseSlice('loader');
export const useShowcaseIconI18n = () => useShowcaseSlice('icon');
export const useShowcaseBrandI18n = () => useShowcaseSlice('brand');
export const useShowcaseCarouselI18n = () => useShowcaseSlice('carousel');
export const useShowcaseGalleryI18n = () => useShowcaseSlice('gallery');
export const useShowcaseGridSystemI18n = () => useShowcaseSlice('gridSystem');
export const useShowcaseTableI18n = () => useShowcaseSlice('table');
export const useShowcaseAuthI18n = () => useShowcaseSlice('auth');
export const useShowcaseExamplesOverviewI18n = () => useShowcaseSlice('examplesOverview');
export const useShowcaseBenchmarkI18n = () => useShowcaseSlice('benchmark');
export const useShowcaseCheckboxI18n = () => useShowcaseSlice('checkbox');
export const useShowcaseButtonsI18n = () => useShowcaseSlice('buttons');
export const useShowcaseActionButtonI18n = () => useShowcaseSlice('actionButton');
export const useShowcaseLoadingButtonI18n = () => useShowcaseSlice('loadingButton');
export const useShowcaseNavigationButtonsI18n = () => useShowcaseSlice('navigationButtons');
export const useShowcaseCodeI18n = () => useShowcaseSlice('code');
export const useShowcaseModalI18n = () => useShowcaseSlice('modal');
export const useShowcaseModalYesNoI18n = () => useShowcaseSlice('modalYesNo');
export const useShowcaseModalOkI18n = () => useShowcaseSlice('modalOk');
export const useShowcasePaginationI18n = () => useShowcaseSlice('pagination');
export const useShowcasePercentageI18n = () => useShowcaseSlice('percentage');
export const useShowcaseLocaleSwitcherI18n = () => useShowcaseSlice('localeSwitcher');
export const useShowcaseTabI18n = () => useShowcaseSlice('tab');
export const useShowcaseDropdownI18n = () => useShowcaseSlice('dropdown');
export const useShowcaseMotionI18n = () => useShowcaseSlice('motion');
export const useShowcaseListGroupI18n = () => useShowcaseSlice('listGroup');
export const useShowcaseImageAvatarI18n = () => useShowcaseSlice('imageAvatar');
export const useShowcaseInputI18n = () => useShowcaseSlice('input');
export const useShowcaseSwitchI18n = () => useShowcaseSlice('switch');
export const useShowcaseSelectI18n = () => useShowcaseSlice('select');
export const useShowcaseTextAreaI18n = () => useShowcaseSlice('textArea');
export const useShowcaseAutocompleteI18n = () => useShowcaseSlice('autocomplete');
export const useShowcaseChecklistI18n = () => useShowcaseSlice('checklist');
export const useShowcaseImageI18n = () => useShowcaseSlice('image');
export const useShowcaseNotificationsI18n = () => useShowcaseSlice('notifications');
export const useShowcaseSearchI18n = () => useShowcaseSlice('search');
export const useShowcaseMenuI18n = () => useShowcaseSlice('menu');
export const useShowcaseBreadcrumbsI18n = () => useShowcaseSlice('breadcrumbs');
export const useShowcaseRepeatI18n = () => useShowcaseSlice('repeat');
export const useShowcaseTabDynamicI18n = () => useShowcaseSlice('tabDynamic');
export const useShowcaseGridPreviewI18n = () => useShowcaseSlice('gridPreview');
export const useShowcaseHomeI18n = () => useShowcaseSlice('home');
export const useShowcaseImageEditorI18n = () => useShowcaseSlice('imageEditor');
export const useShowcaseLayoutBuilderI18n = () => useShowcaseSlice('layoutBuilder');
export const useShowcaseMarkdownReaderI18n = () => useShowcaseSlice('markdownReader');
export const useShowcaseGridI18n = () => useShowcaseSlice('grid');
export const useShowcaseGridArrayI18n = () => useShowcaseSlice('gridArray');
export const useShowcaseGridDbI18n = () => useShowcaseSlice('gridDb');
export const useShowcaseUploadI18n = () => useShowcaseSlice('upload');
export const useShowcaseUploadImageI18n = () => useShowcaseSlice('uploadImage');
export const useShowcaseUploadDocumentI18n = () => useShowcaseSlice('uploadDocument');
export const useShowcaseUploadCsvI18n = () => useShowcaseSlice('uploadCsv');
export const useShowcasePromptI18n = () => useShowcaseSlice('prompt');
export const useShowcasePromptSharedI18n = () => useShowcaseSlice('promptShared');
export const useShowcasePromptEditorI18n = () => useShowcaseSlice('promptEditor');
export const useShowcasePromptLiveI18n = () => useShowcaseSlice('promptLive');
export const useShowcasePromptPlainI18n = () => useShowcaseSlice('promptPlain');
export const useShowcaseFormI18n = () => useShowcaseSlice('form');
export const useShowcaseFormValidationI18n = () => useShowcaseSlice('formValidation');
export const useShowcaseRichTextI18n = () => useShowcaseSlice('richText');
export const useShowcaseImageFieldI18n = () => useShowcaseSlice('imageField');
