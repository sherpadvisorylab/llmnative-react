import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        localeSwitcher: {
            page: {
                title: 'LocaleSwitcher',
                description: 'Dropdown that lets the user switch the active locale at runtime. Renders nothing when only one locale is configured, and persists the selection in the llmnative_locale cookie.',
            },
            sections: {
                liveDemo: {
                    title: 'Live demo',
                    description: 'The switcher below controls the locale of this entire showcase. The configured translations are available immediately, so changing language updates sidebar, buttons and component previews.',
                },
                nullWhenSingleLocale: {
                    title: 'Null when a single locale is configured',
                    description: 'LocaleSwitcher returns null automatically when translations contains zero or one locale. No conditional rendering is needed in the consumer.',
                },
                customLabels: {
                    title: 'Custom locale labels',
                    description: 'The labels prop overrides or extends the built-in locale name map. Useful when the audience expects native names, abbreviations or custom badges.',
                },
                cookiePersistence: {
                    title: 'Cookie persistence',
                    description: 'The selected locale is saved to a first-party cookie with 1-year TTL. On next load, the cookie takes priority over the locale prop declared in App.i18n.',
                },
                appConfiguration: {
                    title: 'Configuring translations in App',
                    description: 'Pass translations to App.i18n to make additional locales available. Every locale key in the translations object becomes a selectable option, while missing keys fall back to English.',
                },
            },
            labels: {
                language: 'Language',
                italian: 'Italian',
                localeBadgeEn: 'EN',
                localeBadgeIt: 'IT',
                localeBadgeDe: 'DE',
                localeBadgeRu: 'RU',
                localeBadgeZh: 'ZH',
                localeBadgeAr: 'AR',
            },
            propsDocs: {
                items: {
                    icon: { description: 'Icon name passed to the Icon component. Any icon supported by the configured icon provider.' },
                    label: { description: 'Optional visible label rendered before the select.' },
                    labels: { description: 'Override or extend display names for locale codes. Merged with built-in defaults.' },
                    className: { description: 'Additional CSS classes on the wrapper element.' },
                },
            },
            playground: {
                title: 'LocaleSwitcher',
                props: {
                    icon: { description: 'Icon name passed to the Icon component. Any icon supported by the configured icon provider.' },
                    label: { description: 'Optional visible label rendered before the select.' },
                    className: { description: 'Additional CSS classes on the wrapper element.' },
                },
            },
        },
    },
});
