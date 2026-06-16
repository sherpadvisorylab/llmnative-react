import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridArray: {
            page: {
                title: 'GridArray',
                description: 'Variante in memoria di Grid che renderizza direttamente un array di record gestito dal chiamante. Ideale per dati calcolati, stato locale e dataset piccoli gia presenti nel frontend.',
            },
            sections: {
                basicUsage: {
                    title: 'Uso base',
                    description: 'La forma minima valida di GridArray. Passa un array di record e lascia che Grid deduca le colonne dalla struttura dei dati. sortable e pagination sono espliciti qui per mantenere l\'esempio autosufficiente.',
                },
                onLoadTransform: {
                    title: 'Trasformazione onLoad',
                    description: 'Usa onLoad per normalizzare o arricchire i record prima del rendering. La trasformazione viene eseguita a ogni ciclo di render e puo anche risolversi in modo asincrono.',
                },
                grouping: {
                    title: 'Raggruppamento',
                    description: 'groupBy separa le righe sotto intestazioni di sezione comprimibili. Funziona sia per il layout tabellare sia per la gallery e accetta un singolo campo o piu livelli.',
                },
                selection: {
                    title: 'Selezione',
                    description: 'selection abilita radio button o checkbox. Usa la scorciatoia per uno stato solo UI, oppure la forma oggetto quando ti servono callback e chiavi predefinite.',
                },
            },
            labels: {
                teamMembers: 'Membri del team',
                singleSelection: 'Selezione singola',
                multipleSelection: 'Selezione multipla',
            },
            propsDocs: {
                categories: {
                    gridArray: 'GridArray',
                    shared: 'Condivise',
                },
                items: {
                    records: {
                        description: 'Array di record gestito dal chiamante. GridArray renderizza questo snapshot senza sottoscriversi a un provider. Nel playground i record arrivano dal database Mock qui sotto.',
                    },
                    recordId: {
                        description: 'Risolutore di identita usato per selezione, stato di modifica e percorsi di mutazione. Passa un nome campo o una arrow function.',
                    },
                    onLoad: {
                        description: 'Trasforma i record prima del rendering. Puo essere eseguito in modo sincrono o asincrono dopo il passaggio dei dati.',
                    },
                },
            },
            playground: {
                groups: {
                    gridArray: 'GridArray',
                    shared: 'Condivise',
                },
                props: {
                    records: {
                        description: 'Array di record gestito dal chiamante. In questo playground i record arrivano dal database Mock qui sotto. Modificalo per vedere la griglia aggiornarsi in tempo reale.',
                    },
                    recordId: {
                        description: 'Risolutore dell\'identita del record. Passa un nome campo come "_key" oppure una arrow function.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Usa il campo chiave nativo del provider.' },
                            explicitId: { label: 'id', help: 'Usa il campo id esplicito.' },
                            functionId: { label: 'fn', help: 'Arrow function che restituisce il campo id.' },
                        },
                    },
                    onLoad: {
                        description: 'Trasforma i record prima del rendering. Nel playground viene gestito internamente.',
                    },
                },
            },
        },
    },
});
