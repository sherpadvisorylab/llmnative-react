import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        buttons: {
            page: { title: 'Buttons', description: 'Semantische Button-Zustaende plus fokussierte Komponenten fuer direkte Aktionen, asynchrone Aktionen, Navigation und externe Verweise.' },
            sections: {
                nativeStates: { title: 'Native Zustandsklassen', description: 'Verwende die frameworkeigenen `btn`-Zustandsklassen fuer einfache Buttons und Links.' },
                outlineLink: { title: 'Outline und Link', description: 'Outline-Zustaende verwenden dieselben semantischen Namen und Tokens wie gefuellte Buttons.' },
                components: { title: 'Button-Komponenten', description: 'Verwende die fokussierten Seiten fuer Beispiele, Props und Playgrounds, die auf jede Button-Komponente zugeschnitten sind.' },
            },
            cards: {
                actionButton: 'Direkte Aktionen mit Icons, Badges, deaktiviertem Zustand und Press-Motion.',
                loadingButton: 'Asynchrone Aktionen mit Ladezustand, Fortschrittstext und automatischer Deaktivierung.',
                navigation: 'Hilfen fuer Ruecknavigation und externe Verweise.',
            },
        },
    },
});
