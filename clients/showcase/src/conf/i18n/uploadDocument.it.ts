import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadDocument: {
            page: {
                title: 'UploadDocument',
                description: 'Campo upload documenti con drag-and-drop, avanzamento inline, righe removibili e modifica opzionale del nome file. Il record del Form memorizza un array di descrittori file.',
            },
            sections: {
                basicUpload: {
                    title: 'Upload documenti base',
                    description: 'Upload di un singolo file con drag-and-drop. Il campo legge localmente il file selezionato, mostra il progresso durante la conversione e poi salva l\'entry caricata nel record del Form.',
                },
                multipleFiles: {
                    title: 'File multipli',
                    description: 'Abilita multiple per mantenere piu file nello stesso campo. Ogni file caricato diventa una riga della tabella e l\'azione di upload inline resta disponibile finche non viene raggiunto max.',
                },
                editableFileNames: {
                    title: 'Nomi file modificabili',
                    description: 'Imposta editable per rendere cliccabile ogni riga. Il click su una riga completata apre la modale integrata per modificare il nome file e salva il nuovo fileName nell\'entry memorizzata.',
                },
                acceptFilter: {
                    title: 'Filtro accept',
                    description: 'Limita il selettore file nativo a estensioni specifiche. La stessa stringa accept viene mostrata anche nella drop zone vuota come aiuto visivo sui formati consentiti.',
                },
                requiredField: {
                    title: 'Campo obbligatorio',
                    description: 'Aggiungi required per mostrare la validazione del form quando il campo e vuoto. Il messaggio di validazione viene renderizzato sotto l\'area upload usando lo slot standard degli errori del campo.',
                },
            },
            labels: {
                report: 'Report',
                attachmentsMax: 'Allegati (max 5)',
                deliverables: 'Consegne',
                csvExcelOnly: 'Solo CSV / Excel',
                contractRequired: 'Contratto (obbligatorio)',
            },
            propsDocs: {
                title: 'Props di UploadDocument',
                items: {
                    name: { description: 'Nome del campo collegato al record del Form' },
                    label: { description: 'Etichetta renderizzata sopra la drop zone o la tabella file' },
                    multiple: { description: 'Consente di selezionare e memorizzare piu di un file', default: 'false' },
                    editable: { description: 'Apre la modale di modifica del nome file quando si clicca una riga della tabella', default: 'false' },
                    accept: { description: 'Filtro accept del file input nativo mostrato nel picker e nel suggerimento della drop zone', default: '".pdf,.doc,.docx,.txt,.iso"' },
                    max: { description: 'Numero massimo di file che il campo puo mantenere', default: '100' },
                    required: { description: 'Marca il file input nascosto come obbligatorio e mostra feedback di validazione se vuoto', default: 'false' },
                    onChange: { description: 'Chiamata ogni volta che cambia l\'array di file memorizzato nel record del Form' },
                    before: { description: 'Contenuto renderizzato prima del campo upload dentro il wrapper esterno' },
                    after: { description: 'Contenuto renderizzato dopo il campo upload dentro il wrapper esterno' },
                    className: { description: 'Classi CSS applicate al contenitore interno del campo' },
                    wrapperClassName: { description: 'Classi CSS applicate all\'elemento Wrapper esterno' },
                },
            },
            playground: {
                title: 'Playground UploadDocument',
                defaultLabel: 'Allegati',
            },
        },
    },
});
