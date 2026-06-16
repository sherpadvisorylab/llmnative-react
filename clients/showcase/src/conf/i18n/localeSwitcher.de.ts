import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        localeSwitcher: {
            page: {
                title: 'LocaleSwitcher',
                description: 'Dropdown zum Wechseln der aktiven Sprache zur Laufzeit. Rendert nichts, wenn nur eine Sprache konfiguriert ist, und speichert die Auswahl im Cookie llmnative_locale.',
            },
            sections: {
                liveDemo: {
                    title: 'Live-Demo',
                    description: 'Der Switcher unten steuert die Sprache des gesamten Showcase. Die konfigurierten Uebersetzungen stehen sofort zur Verfuegung, sodass Sidebar, Buttons und Komponenten-Vorschauen direkt aktualisiert werden.',
                },
                nullWhenSingleLocale: {
                    title: 'Null bei nur einer konfigurierten Sprache',
                    description: 'LocaleSwitcher gibt automatisch null zurueck, wenn translations null oder nur eine Sprache enthaelt. Im Consumer ist kein bedingtes Rendering noetig.',
                },
                customLabels: {
                    title: 'Benutzerdefinierte Sprachlabels',
                    description: 'Die labels-Prop ueberschreibt oder erweitert die eingebaute Sprachzuordnung. Nuetzlich fuer native Namen, Abkuerzungen oder eigene Badges.',
                },
                cookiePersistence: {
                    title: 'Cookie-Persistenz',
                    description: 'Die gewaehlte Sprache wird in einem First-Party-Cookie mit 1 Jahr Laufzeit gespeichert. Beim naechsten Laden hat das Cookie Vorrang vor der in App.i18n gesetzten Sprache.',
                },
                appConfiguration: {
                    title: 'Uebersetzungen in App konfigurieren',
                    description: 'Uebergib translations an App.i18n, um weitere Sprachen verfuegbar zu machen. Jeder Locale-Key wird zu einer auswaehlbaren Option, fehlende Keys fallen auf Englisch zurueck.',
                },
            },
            labels: {
                language: 'Sprache',
                italian: 'Italienisch',
                localeBadgeEn: 'EN',
                localeBadgeIt: 'IT',
                localeBadgeDe: 'DE',
                localeBadgeRu: 'RU',
                localeBadgeZh: 'ZH',
                localeBadgeAr: 'AR',
            },
            propsDocs: {
                items: {
                    icon: { description: 'Icon-Name, der an die Icon-Komponente uebergeben wird. Jede vom konfigurierten Provider unterstuetzte Icon ist gueltig.' },
                    label: { description: 'Optionale sichtbare Beschriftung vor der Select-Komponente.' },
                    labels: { description: 'Ueberschreibt oder erweitert die angezeigten Namen fuer Locale-Codes. Wird mit den eingebauten Defaults zusammengefuehrt.' },
                    className: { description: 'Zusaetzliche CSS-Klassen auf dem Wrapper-Element.' },
                },
            },
            playground: {
                title: 'LocaleSwitcher',
                props: {
                    icon: { description: 'Icon-Name, der an die Icon-Komponente uebergeben wird. Jede vom konfigurierten Provider unterstuetzte Icon ist gueltig.' },
                    label: { description: 'Optionale sichtbare Beschriftung vor der Select-Komponente.' },
                    className: { description: 'Zusaetzliche CSS-Klassen auf dem Wrapper-Element.' },
                },
            },
        },
    },
});
