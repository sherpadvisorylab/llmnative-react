import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        layoutBuilder: {
            page: {
                title: 'LayoutBuilder',
                description: 'Interaktiver 12-Spalten-Builder zum Anordnen gezogener Feld-Tokens.',
            },
            sections: {
                dragFields: {
                    title: 'Felder in die Zeile ziehen',
                    description: 'Ziehe Feld-Tokens aus der Liste in die Builder-Zeile, um ein gespeichertes Layout im aktuellen Form-Datensatz zusammenzustellen.',
                },
            },
            labels: {
                dragFieldsIntoRow: 'Felder in die Zeile ziehen',
                fields: 'Felder',
            },
            propsDocs: {
                title: 'LayoutBuilder-Props',
                items: {
                    name: { description: 'Name des Form-Felds, das die Layout-Elemente der Zeile speichert.' },
                    defaultSpan: { description: 'Standard-Spaltenbreite fur abgelegte Felder.', default: '1' },
                    heightPx: { description: 'Hohe der Builder-Zeile in Pixeln.', default: '100' },
                    ref: { description: 'Imperative API: getValue, setValue, clear.' },
                },
            },
            playground: {
                title: 'LayoutBuilder',
            },
        },
    },
});
