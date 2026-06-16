import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        menu: {
            page: {
                title: 'Menue',
                description: 'Routenbewusstes Navigationsmenue aus einem App-Menuekontext.',
            },
            sections: {
                componentsMenu: {
                    title: 'Komponentenmenue',
                    description: 'Menu liest den konfigurierten Navigationsbaum der App und rendert verschachtelte Eintraege mit optionalen Badges und anpassbaren Wrappern.',
                },
            },
            labels: {
                none: 'keine',
                single: 'einzeln',
                multi: 'mehrfach',
                newBadge: 'neu',
                betaBadge: 'beta',
            },
            propsDocs: {
                items: {
                    menuKey: { description: 'Menue-Kontextschluessel fuer useMenu.' },
                    as: { description: 'Typ des Listenelements.' },
                    badges: {
                        description: 'Badges nach kleingeschriebenem Elementtitel indiziert.',
                        shortcuts: {
                            none: { label: 'keine', help: 'Keine Menue-Badges.' },
                            single: { label: 'einzeln', help: 'Ein Badge auf alert.' },
                            multi: { label: 'mehrfach', help: 'Mehrere Badges fuer verschiedene Schluessel.' },
                        },
                    },
                    before: { description: 'Inhalt vor dem Menue.' },
                    after: { description: 'Inhalt nach dem Menue.' },
                    wrapperClassName: { description: 'CSS-Klassen auf dem Wrapper.' },
                    className: { description: 'CSS-Klassen auf der Menueeliste.' },
                    headerClassName: { description: 'CSS-Klassen auf Header-Eintraegen.' },
                    itemClassName: { description: 'CSS-Klassen auf li-Eintraegen.' },
                    linkClassName: { description: 'CSS-Klassen auf Links.' },
                    iconClassName: { description: 'CSS-Klassen auf dem Icon-Wrapper.' },
                    textClassName: { description: 'CSS-Klassen auf dem Elementtext.' },
                    badgeClassName: { description: 'CSS-Klassen auf Badges.' },
                    arrowClassName: { description: 'CSS-Klassen auf dem Untermenue-Pfeil.' },
                    submenuClassName: { description: 'CSS-Klassen auf verschachtelten Listen.' },
                },
            },
            playground: {
                title: 'Menue',
            },
        },
    },
});
