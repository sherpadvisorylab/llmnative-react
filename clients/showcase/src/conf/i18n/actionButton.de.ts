import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        actionButton: {
            page: { title: 'ActionButton', description: 'Direkter synchroner Aktionsbutton mit Icon, Badge, Press-Motion und Variantensystem. Verwende LoadingButton fuer asynchrone Vorgaenge.' },
            sections: {
                variants: { description: 'Verwende die Prop variant, um semantische Farben anzuwenden, ohne CSS-Klassennamen zu schreiben.' },
                iconLabel: { title: 'Kombinationen aus Icon und Label', description: 'icon rendert ein Icon aus dem aktiven Provider. Lasse label bei einem Icon-only-Button weg und kombiniere ihn fuer die Barrierefreiheit mit title.' },
                onClick: { title: 'onClick-Handler', description: 'onClick stoppt die Ereignisweitergabe automatisch. Der Button verwaltet keinen Ladezustand. Verwende LoadingButton fuer asynchrone Arbeit.' },
                disabled: { title: 'Deaktivierter Zustand', description: 'disabled verhindert Klicks und zeigt einen nicht erlaubten Cursor auf dem Wrapper. Die visuelle Form des Buttons bleibt erhalten.' },
                badge: { title: 'Badge-Benachrichtigung', description: 'badge rendert oben rechts einen Zaehler oder Textindikator. Nuetzlich fuer ausstehende Elemente.' },
            },
        },
    },
});
