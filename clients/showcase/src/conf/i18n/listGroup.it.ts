import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        listGroup: {
            page: {
                title: 'ListGroup',
                description: 'List group compatibile con Bootstrap con stati active, disabled, loading, click e drag.',
            },
            sections: {
                statusList: {
                    title: 'Lista stati',
                    description: 'Usa stati active, disabled e badge per rappresentare fasi di workflow o gruppi di navigazione.',
                },
            },
            labels: {
                workflow: 'Workflow',
                backlog: 'Backlog',
                inProgress: 'In corso',
                review: 'Review',
                done: 'Completato',
            },
            propsDocs: {
                items: {
                    children: { description: 'Contenuto degli elementi della lista.' },
                    label: { description: 'Etichetta opzionale sopra la lista.' },
                    onClick: { description: 'Abilita elementi lista cliccabili.' },
                    draggable: { description: 'Rende gli elementi trascinabili.' },
                    onDrop: { description: 'Trasforma il testo trascinato prima di inserirlo in dataTransfer.' },
                    activeIndices: {
                        description: 'Indici renderizzati come attivi.',
                        shortcuts: {
                            none: { label: 'none', help: 'Nessun elemento attivo.' },
                            first: { label: 'first', help: 'Primo elemento attivo.' },
                            multi: { label: 'multi', help: 'Piu elementi attivi.' },
                        },
                    },
                    disabledIndices: {
                        description: 'Indici renderizzati come disabilitati.',
                        shortcuts: {
                            none: { label: 'none', help: 'Nessun elemento disabilitato.' },
                            last: { label: 'last', help: 'Disabilita l ultimo elemento.' },
                            mixed: { label: 'mixed', help: 'Disabilita primo e ultimo elemento.' },
                        },
                    },
                    loadingIndices: {
                        description: 'Indici renderizzati in stato loading.',
                        shortcuts: {
                            none: { label: 'none', help: 'Nessuno stato loading.' },
                            single: { label: 'single', help: 'Secondo elemento in loading.' },
                            multi: { label: 'multi', help: 'Piu elementi in loading.' },
                        },
                    },
                    before: { description: 'Contenuto prima della lista.' },
                    after: { description: 'Contenuto dopo la lista.' },
                    className: { description: 'Classi CSS sul list-group.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper.' },
                    itemClassName: { description: 'Classi CSS su ogni elemento.' },
                },
            },
            playground: {
                title: 'ListGroup',
            },
        },
    },
});
