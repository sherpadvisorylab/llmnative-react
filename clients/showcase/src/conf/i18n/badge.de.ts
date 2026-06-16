import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        badge: {
            page: { title: 'Badge', description: 'Inline-Labels fuer Status, Zaehler und Kategorien. Wenn children ein React-Element ist, wechselt Badge in den Overlay-Modus und positioniert Indikatoren auf diesem Element.' },
            sections: {
                colorVariants: { title: 'Farbvarianten', description: 'Inline-Badges verwenden Text oder Inline-React-Inhalt als children.' },
                overlayAfter: { title: 'Overlay: after oben rechts', description: 'Uebergib ein React-Element als children zusammen mit after, um ein Badge oben rechts anzuzeigen.' },
                overlayBefore: { title: 'Overlay: before oben links', description: 'Verwende before, um das Badge oben links zu platzieren.' },
                overlayBoth: { title: 'Overlay: beide Ecken', description: 'before und after koennen gleichzeitig existieren: oben links und oben rechts.' },
                overlayDot: { title: 'Overlay: Punkt', description: 'Ohne before oder after wird oben rechts ein kleiner Punktindikator gerendert.' },
                inlineMode: { title: 'Inline mit before/after', description: 'Im Inline-Modus werden before und after ausserhalb des Badge-Spans gerendert.' },
            },
        },
    },
});
