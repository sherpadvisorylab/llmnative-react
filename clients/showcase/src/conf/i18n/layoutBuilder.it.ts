import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        layoutBuilder: {
            page: {
                title: 'LayoutBuilder',
                description: 'Builder interattivo a 12 colonne per disporre token di campo trascinati.',
            },
            sections: {
                dragFields: {
                    title: 'Trascina i campi nella riga',
                    description: 'Trascina i token dei campi dalla lista nella riga del builder per comporre un layout salvato nel record Form corrente.',
                },
            },
            labels: {
                dragFieldsIntoRow: 'Trascina i campi nella riga',
                fields: 'Campi',
            },
            propsDocs: {
                title: 'Props LayoutBuilder',
                items: {
                    name: { description: 'Nome del campo Form che memorizza gli item di layout della riga.' },
                    defaultSpan: { description: 'Span di colonna predefinito per i campi rilasciati.', default: '1' },
                    heightPx: { description: 'Altezza della riga builder in pixel.', default: '100' },
                    ref: { description: 'API imperativa: getValue, setValue, clear.' },
                },
            },
            playground: {
                title: 'LayoutBuilder',
            },
        },
    },
});
