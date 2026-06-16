import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadCsv: {
            page: {
                title: 'UploadCSV',
                description: 'Uploader CSV o TSV a file singolo con drag-and-drop, integrazione PapaParse e output parsato adatto all\'anteprima esposto tramite onDataLoaded.',
            },
            sections: {
                basicUpload: {
                    title: 'Upload CSV base',
                    description: 'Trascina un file CSV o TSV nella zona oppure clicca per sfogliare. Dopo il parsing, il componente passa allo stato caricato ed espone righe, header e File originale tramite onDataLoaded.',
                },
                normalizedKeys: {
                    title: 'Chiavi normalizzate + rimozione campi vuoti',
                    description: 'normalizeKeys trasforma i nomi degli header prima che vengano esposti in fields e negli oggetti riga. removeEmptyFields elimina le entry con valore stringa vuota o null da ogni riga parsata.',
                },
                customFieldTransform: {
                    title: 'Trasformazione custom dei campi',
                    description: 'Usa onParseField per intercettare ogni coppia [key, value] parsata. Restituisci una coppia modificata per mantenerla, oppure undefined per rimuovere quel campo dall\'oggetto riga finale.',
                },
                customDelimiter: {
                    title: 'Delimitatore custom',
                    description: 'Passa delimiter quando il file non usa in modo affidabile l\'auto-rilevamento di PapaParse, ad esempio per export separati da punto e virgola da strumenti spreadsheet.',
                },
            },
            labels: {
                emptyState: 'Nessun file ancora caricato.',
                rows: 'righe',
                fields: 'campi',
                andMoreRows: '...e altre {count} righe',
                basicLabel: 'Trascina o clicca per caricare CSV',
                normalizeLabel: 'Carica un CSV per vedere le chiavi normalizzate',
                transformLabel: 'Carica un CSV - le colonne che iniziano con _ verranno scartate',
                delimiterLabel: 'Carica CSV separato da punto e virgola',
            },
            propsDocs: {
                title: 'Props di UploadCSV',
                items: {
                    name: { description: 'Nome campo usato per l\'attributo data-name del wrapper' },
                    onDataLoaded: { description: 'Chiamata con righe parsate, campi header e File originale dopo un parsing riuscito' },
                    onClear: { description: 'Chiamata quando il file caricato viene rimosso dalla UI del componente' },
                    label: { description: 'Etichetta renderizzata sopra la drop zone' },
                    icon: { description: 'Nome icona mostrato dentro la drop zone', default: '"upload"' },
                    delimiter: { description: 'Delimitatore opzionale passato a PapaParse. Se omesso, PapaParse lo rileva automaticamente.' },
                    normalizeKeys: { description: 'Normalizza i nomi header con normalizeKey prima di esporli in fields e negli oggetti riga', default: 'false' },
                    removeEmptyFields: { description: 'Rimuove le entry di riga il cui valore parsato e stringa vuota o null', default: 'false' },
                    onParseField: { description: 'Trasforma o scarta ogni coppia [key, value] durante il parsing. Restituisci undefined per omettere il campo.' },
                    before: { description: 'Contenuto renderizzato prima dell\'uploader dentro il wrapper esterno' },
                    after: { description: 'Contenuto renderizzato dopo l\'uploader dentro il wrapper esterno' },
                    className: { description: 'Classi CSS applicate al contenitore interno dell\'uploader' },
                    wrapperClassName: { description: 'Classi CSS applicate al wrapper esterno' },
                },
            },
            playground: {
                title: 'Playground UploadCSV',
                defaultLabel: 'Trascina o clicca per caricare CSV',
            },
        },
    },
});
