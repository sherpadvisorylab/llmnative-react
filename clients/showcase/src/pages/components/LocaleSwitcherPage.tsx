import React from 'react';
import { LocaleSwitcher } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const PROPS_CONFIG: PropDef[] = [
    { name: 'icon', type: 'string', default: "'Globe'", description: "Icon name passed to the Icon component. Any icon supported by the configured icon provider.", control: 'icon' },
    { name: 'label', type: 'string', description: 'Optional visible label rendered before the select.', control: 'text' },
    { name: 'labels', type: "Record<string, string>", description: "Override or extend display names for locale codes. Merged with built-in defaults (en, it, fr, de, es, pt, nl, pl, ru, zh, ja, ko, ar)." },
    { name: 'className', type: 'string', description: 'Additional CSS classes on the wrapper element.', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: PROPS_CONFIG,
    defaultProps: { icon: 'Globe', label: '', className: '' },
    render: (p) => (
        <LocaleSwitcher
            icon={p.icon || 'Globe'}
            label={p.label || undefined}
            className={p.className || undefined}
        />
    ),
};

export default function LocaleSwitcherPage() {
    usePlayground(PLAYGROUND, 'LocaleSwitcher');

    return (
        <PageLayout
            title="LocaleSwitcher"
            description="Dropdown that lets the user switch the active locale at runtime. Renders nothing when only one locale is configured — safe to place in any layout without conditional guards. Persists the selection in a cookie (llmnative_locale) so the preference survives page refreshes and works across vertical app contexts."
        >
            {/* ── Live demo ── */}
            <Section
                title="Live demo"
                description="The switcher below controls the locale of this entire showcase. The 5 translations configured in index.tsx (en, it, de, ru, zh, ar) are immediately available. Change the language and watch framework strings update across the sidebar, buttons, and component previews."
                preview={
                    <div className="flex flex-wrap items-center gap-6">
                        <LocaleSwitcher />
                        <LocaleSwitcher label="Language" />
                        <LocaleSwitcher icon="Languages" label="Lingua" />
                    </div>
                }
                code={`import { LocaleSwitcher } from '@llmnative/react';

// Minimal — renders null if only one locale is configured
<LocaleSwitcher />

// With label
<LocaleSwitcher label="Language" />

// Custom icon
<LocaleSwitcher icon="Languages" label="Lingua" />`}
            />

            {/* ── Null when single locale ── */}
            <Section
                title="Null when a single locale is configured"
                description="LocaleSwitcher returns null automatically when translations contains zero or one locale. No conditional rendering needed in the consumer."
                preview={null}
                code={`// ✅ Safe — renders nothing when no translations prop is set
<App i18n={{ locale: 'en' }}>
    <LocaleSwitcher />   {/* renders null */}
</App>

// ✅ Safe — renders nothing with only one locale
<App i18n={{ locale: 'en', translations: { en: { ... } } }}>
    <LocaleSwitcher />   {/* renders null */}
</App>

// ✅ Renders — two or more locales available
<App i18n={{ locale: 'en', translations: { it: { ... }, de: { ... } } }}>
    <LocaleSwitcher />   {/* renders dropdown with en / it / de */}
</App>`}
            />

            {/* ── Custom locale labels ── */}
            <Section
                title="Custom locale labels"
                description="The labels prop overrides or extends the built-in locale name map. Useful when the target audience expects native names, abbreviations, or flags."
                preview={
                    <LocaleSwitcher
                        labels={{ en: '🇬🇧 EN', it: '🇮🇹 IT', de: '🇩🇪 DE', ru: '🇷🇺 RU', zh: '🇨🇳 ZH', ar: '🇸🇦 AR' }}
                    />
                }
                code={`<LocaleSwitcher
    labels={{
        en: '🇬🇧 EN',
        it: '🇮🇹 IT',
        de: '🇩🇪 DE',
        ru: '🇷🇺 RU',
        zh: '🇨🇳 ZH',
        ar: '🇸🇦 AR',
    }}
/>`}
            />

            {/* ── Cookie persistence ── */}
            <Section
                title="Cookie persistence"
                description="The selected locale is saved to a first-party cookie (llmnative_locale, 1-year TTL, SameSite=Lax). On next load, the cookie takes priority over the locale prop declared in <App i18n={...}>. This makes it suitable for vertical SaaS apps where users choose their language once and expect it to be remembered."
                preview={null}
                code={`// Cookie written automatically by LocaleSwitcher on every change:
// llmnative_locale=it; max-age=31536000; path=/; SameSite=Lax

// To read the current locale programmatically:
import { useI18n } from '@llmnative/react';

const { locale, availableLocales, setLocale } = useI18n();
// locale          → 'it'
// availableLocales → ['en', 'it', 'de', 'ru', 'zh', 'ar']
// setLocale('de') → switches instantly + writes cookie`}
            />

            {/* ── Configuration in App ── */}
            <Section
                title="Configuring translations in App"
                description="Pass translations to App.i18n to make additional locales available. Every locale key in the translations object becomes a selectable option. Missing keys fall back to English."
                preview={null}
                code={`import { App } from '@llmnative/react';
import type { I18nTranslations } from '@llmnative/react';

const translations: I18nTranslations = {
    it: {
        common: { save: 'Salva', cancel: 'Annulla', back: 'Indietro' },
        form:   { buttonSave: 'Salva', buttonDelete: 'Elimina' },
        // Missing keys fall back to English automatically
    },
    de: {
        common: { save: 'Speichern', cancel: 'Abbrechen' },
    },
};

<App
    i18n={{ locale: 'en', translations }}
    // ...rest of props
>
    {/* LocaleSwitcher anywhere in the tree will show en / it / de */}
    <LocaleSwitcher label="Language" />
</App>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />
        </PageLayout>
    );
}
