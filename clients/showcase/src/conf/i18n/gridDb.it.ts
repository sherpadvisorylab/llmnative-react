import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridDb: {
            page: {
                title: 'GridDB',
                description: 'Variante di Grid basata su provider. Si sottoscrive a un path del DataProvider e riceve aggiornamenti automatici, con filtro, ordinamento e remapping dei campi lato provider.',
            },
            sections: {
                basicUsage: {
                    title: 'Uso base',
                    description: 'La forma minima valida di GridDB. Fornisci un path e lascia che Grid si sottoscriva alla collezione deducendo le colonne dai record in ingresso.',
                },
                providerFilter: {
                    title: 'Filtro lato provider',
                    description: 'where filtra i record a livello provider prima che raggiungano il componente, cosi la griglia non sovraccarica i dati.',
                },
                providerOrder: {
                    title: 'Ordinamento lato provider',
                    description: 'order ordina i record a livello provider prima che il componente li riceva.',
                },
                fromUrl: {
                    title: 'fromUrl - path guidato dalla route',
                    description: 'fromUrl risolve il path della collezione dal pathname corrente invece di usare un path hardcoded. Questa preview legge dall\'URL della pagina corrente.',
                },
                grouping: {
                    title: 'Raggruppamento',
                    description: 'groupBy separa le righe sotto intestazioni di sezione. Funziona sia per table sia per gallery e puo essere combinato con l\'ordinamento lato provider.',
                },
            },
            labels: {
                teamMembers: 'Membri del team',
            },
            propsDocs: {
                categories: {
                    gridDb: 'GridDB',
                    shared: 'Condivise',
                },
                items: {
                    path: { description: 'Path della collezione nel DataProvider. Usalo con fromUrl={false} (default).' },
                    fromUrl: { description: 'Quando true, ricava il path della collezione dal pathname corrente invece che da path. fromUrl ha sempre priorita: path viene ignorato.' },
                    recordId: { description: 'Risolutore di identita usato per selezione, stato di modifica e percorsi di mutazione. Passa un nome campo o una arrow function.' },
                    where: { description: 'Filtro lato provider applicato prima che i record vengano emessi.' },
                    order: { description: 'Ordinamento lato provider applicato prima che i record vengano emessi.' },
                    fieldMap: { description: 'Rimappa i nomi dei campi del provider verso i nomi usati dalla UI prima del rendering.' },
                },
            },
            playground: {
                groups: {
                    gridDb: 'GridDB',
                    shared: 'Condivise',
                },
                props: {
                    path: { description: 'Path della collezione usato quando fromUrl e disabilitato.' },
                    fromUrl: { description: 'Ricava il path della collezione dal pathname corrente. In questo playground punta a un dataset seed diverso.' },
                    recordId: {
                        description: 'Risolutore dell\'identita del record.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Usa il campo chiave nativo del provider.' },
                            explicitId: { label: 'id', help: 'Usa il campo id esplicito.' },
                            functionId: { label: 'fn', help: 'Arrow function che restituisce il campo id.' },
                        },
                    },
                    where: {
                        description: 'Filtro lato provider applicato prima dello stream dei record.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'Nessun filtro.' },
                            active: { label: 'active', help: 'Mostra solo i membri attivi.' },
                            admins: { label: 'admins', help: 'Mostra solo gli admin.' },
                        },
                    },
                    order: {
                        description: 'Ordinamento lato provider applicato prima dello stream dei record.',
                        shortcuts: {
                            none: { label: 'none', help: 'Mantieni l\'ordine predefinito del provider.' },
                            nameAsc: { label: 'name asc', help: 'Ordina per nome crescente.' },
                            emailDesc: { label: 'email desc', help: 'Ordina per email decrescente.' },
                        },
                    },
                    fieldMap: {
                        description: 'Rimappa i nomi dei campi del provider verso i nomi usati dalla UI.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'Nessun remapping.' },
                            fullName: { label: 'fullName', help: 'Espone il campo provider "name" come "fullName".' },
                        },
                    },
                },
            },
        },
    },
});
