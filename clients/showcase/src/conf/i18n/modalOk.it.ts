import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalOk: {
            page: { title: 'ModalOk', description: 'Dialog informativo con un solo pulsante Ok. Usalo per messaggi di stato in sola lettura che richiedono solo presa visione.' },
            sections: {
                statusAcknowledgement: { title: 'Presa visione dello stato', description: 'ModalOk e la variante di modal piu leggera: un pulsante, nessun branching. Usalo dopo job in background, import o qualsiasi operazione di cui l utente deve essere informato.' },
            },
            demo: {
                defaultTitle: 'Import completato',
                defaultBody: '42 record sono stati importati correttamente.',
                openButton: 'Apri ModalOk',
                importCsvButton: 'Importa CSV',
                acknowledgementBody: '42 record sono stati importati correttamente. 3 righe sono state saltate per errori di validazione.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Contenuto informativo mostrato nel body' },
                    title: { description: 'Titolo del dialog' },
                    onClose: { description: 'Chiamata quando l utente clicca Ok o il pulsante X' },
                },
            },
        },
    },
});
