import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        pagination: {
            page: {
                title: 'Pagination',
                description: 'Navigazione tra pagine con controlli first, previous, next e last, piu una finestra di pagine configurabile. Usata automaticamente da Grid.',
            },
            sections: {
                interactive: {
                    title: 'Paginazione interattiva - 50 record, 8 per pagina',
                    description: 'Clicca i controlli di pagina per navigare nel dataset.',
                },
                sticky: {
                    title: 'Barra di paginazione sticky',
                    description: 'Quando sticky=true la barra di paginazione resta flottante in basso nella viewport con sfondo sfocato. Questo e il comportamento predefinito in Grid.',
                },
            },
            labels: {
                recordPrefix: 'Record',
                stickyPreviewLead: 'renderizza la barra di navigazione con',
                stickyPreviewMiddle: 'e',
                stickyPreviewEnd: 'cosi da restare sopra il contenuto senza coprirlo del tutto.',
            },
            propsDocs: {
                items: {
                    records: { description: 'Dataset completo da paginare.' },
                    children: { description: 'Funzione di render che riceve i record della pagina corrente e l offset.' },
                    page: { description: 'Pagina iniziale attiva (base 1). Viene applicata una sola volta al mount; poi la navigazione e gestita dallo stato interno.' },
                    limit: { description: 'Numero di elementi per pagina.' },
                    maxPageButtons: { description: 'Numero massimo di pulsanti pagina visibili.' },
                    sticky: { description: 'Fissa la barra di paginazione in fondo alla viewport.' },
                    align: { description: 'Allineamento orizzontale dei controlli di paginazione.' },
                    scrollToTopOnChange: { description: 'Riporta in alto la pagina quando cambia la pagina attiva.' },
                    scrollBehavior: { description: 'Comportamento di scrollIntoView usato quando scrollToTopOnChange e attivo.' },
                    appendTo: { description: 'Target portal per la barra di paginazione.' },
                    before: { description: 'Contenuto renderizzato dentro il wrapper della paginazione prima della barra di navigazione.' },
                    after: { description: 'Contenuto renderizzato dentro il wrapper della paginazione dopo la barra di navigazione.' },
                    wrapperClassName: { description: 'Classi CSS applicate all elemento wrapper piu esterno.' },
                    className: { description: 'Classi CSS applicate all elemento nav che contiene i pulsanti pagina.' },
                },
            },
            playground: {
                title: 'Pagination',
                props: {
                    limit: { description: 'Numero di elementi per pagina.' },
                    maxPageButtons: { description: 'Numero massimo di pulsanti pagina visibili.' },
                    sticky: { description: 'Fissa la barra di paginazione in fondo alla viewport.' },
                    align: { description: 'Allineamento orizzontale dei controlli di paginazione.' },
                    scrollToTopOnChange: { description: 'Riporta in alto la pagina quando cambia la pagina attiva.' },
                },
            },
        },
    },
});
