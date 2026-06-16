import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        alert: {
            page: { title: 'Alert', description: 'Kontextbezogene Feedback-Meldungen fuer den Benutzer. Unterstuetzt Icons, automatisches Schliessen und feste Positionierung.' },
            sections: {
                variants: { description: 'Jeder Typ hat vordefinierte Farben und ein Icon.' },
                appearance: { title: 'Darstellung', description: 'appearance="text" rendert einen kompakten Inline-Hinweis: ohne Hintergrund, ohne Rahmen, mit inhaltsgerechter Breite. Ideal fuer Status-Feedback neben Buttons.' },
                withoutIcon: { title: 'Ohne Icon' },
                autoDismiss: { title: 'Automatisch schliessen', description: 'Der Alert schliesst sich nach dem angegebenen Timeout (ms) automatisch.' },
                placement: { title: 'Positionierungsmodi', description: 'placement steuert, wo der Alert gerendert wird: inline (Standard, im normalen Dokumentfluss) oder fixed (per Portal an die Viewport angeheftet, ueber dem gesamten Inhalt).' },
            },
        },
    },
});
