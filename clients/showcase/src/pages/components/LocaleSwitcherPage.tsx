import React from 'react';
import { LocaleSwitcher } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseLocaleSwitcherI18n } from '../../showcase/i18n';

export default function LocaleSwitcherPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseLocaleSwitcherI18n();

    const propsConfig = React.useMemo<PropDef[]>(() => [
        { name: 'icon', type: 'string', default: "'Globe'", description: t.propsDocs.items.icon.description, control: 'icon' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'labels', type: 'Record<string, string>', description: t.propsDocs.items.labels.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: propsConfig,
        defaultProps: { icon: 'Globe', label: '', className: '' },
        render: (p) => (
            <LocaleSwitcher
                icon={p.icon || 'Globe'}
                label={p.label || undefined}
                className={p.className || undefined}
            />
        ),
    }), [propsConfig]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.liveDemo.title}
                description={t.sections.liveDemo.description}
                preview={
                    <div className="flex flex-wrap items-center gap-6">
                        <LocaleSwitcher />
                        <LocaleSwitcher label={t.labels.language} />
                        <LocaleSwitcher icon="Languages" label={t.labels.italian} />
                    </div>
                }
                code={`import { LocaleSwitcher } from '@llmnative/react';

// Minimal - renders null if only one locale is configured
<LocaleSwitcher />

// With label
<LocaleSwitcher label="Language" />

// Custom icon
<LocaleSwitcher icon="Languages" label="Italian" />`}
            />

            <Section
                title={t.sections.nullWhenSingleLocale.title}
                description={t.sections.nullWhenSingleLocale.description}
                preview={null}
                code={`// Safe - renders nothing when no translations prop is set
<App i18n={{ locale: 'en' }}>
    <LocaleSwitcher />
</App>

// Safe - renders nothing with only one locale
<App i18n={{ locale: 'en', translations: { en: { ... } } }}>
    <LocaleSwitcher />
</App>

// Renders - two or more locales available
<App i18n={{ locale: 'en', translations: { it: { ... }, de: { ... } } }}>
    <LocaleSwitcher />
</App>`}
            />

            <Section
                title={t.sections.customLabels.title}
                description={t.sections.customLabels.description}
                preview={
                    <LocaleSwitcher
                        labels={{
                            en: t.labels.localeBadgeEn,
                            it: t.labels.localeBadgeIt,
                            de: t.labels.localeBadgeDe,
                            ru: t.labels.localeBadgeRu,
                            zh: t.labels.localeBadgeZh,
                            ar: t.labels.localeBadgeAr,
                        }}
                    />
                }
                code={`<LocaleSwitcher
    labels={{
        en: 'EN',
        it: 'IT',
        de: 'DE',
        ru: 'RU',
        zh: 'ZH',
        ar: 'AR',
    }}
/>`}
            />

            <Section
                title={t.sections.cookiePersistence.title}
                description={t.sections.cookiePersistence.description}
                preview={null}
                code={`// Cookie written automatically by LocaleSwitcher on every change:
// llmnative_locale=it; max-age=31536000; path=/; SameSite=Lax

import { useI18n } from '@llmnative/react';

const { locale, availableLocales, setLocale } = useI18n();`}
            />

            <Section
                title={t.sections.appConfiguration.title}
                description={t.sections.appConfiguration.description}
                preview={null}
                code={`import { App } from '@llmnative/react';
import type { I18nTranslations } from '@llmnative/react';

const translations: I18nTranslations = {
    it: {
        common: { save: 'Salva', cancel: 'Annulla', back: 'Indietro' },
        form: { buttonSave: 'Salva', buttonDelete: 'Elimina' },
    },
    de: {
        common: { save: 'Speichern', cancel: 'Abbrechen' },
    },
};

<App i18n={{ locale: 'en', translations }}>
    <LocaleSwitcher label="Language" />
</App>`}
            />

            <PropDocsTable props={propsConfig} title={common.sections.props} />
        </PageLayout>
    );
}
