import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridPreview: {
            page: {
                title: 'Workspace anteprima Grid',
                description: 'Pagina compagna nascosta usata dalle custom action di Grid. Al momento mostra l anteprima del record attivo e offre i formati di export, ma in seguito potra essere riutilizzata anche per i flussi di anteprima Form.',
            },
            banner: {
                currentView: 'Vista corrente',
                exportDescription: 'Scegli un formato di export per il record corrente oppure per l intero dataset mock.',
                previewDescription: 'Ispeziona il record selezionato e riusa questa pagina come superficie di anteprima generica.',
                allRecords: 'Tutti i record',
                recordPrefix: 'Record',
            },
            sections: {
                datasetPreview: {
                    title: 'Anteprima dataset',
                    selectedRecordDescription: 'Questo record e arrivato tramite una Grid custom action e puo essere riutilizzato per l export o per futuri flussi di anteprima Form.',
                    emptyDescription: 'Non e stato passato un record specifico, quindi la pagina mostra l anteprima a livello dataset.',
                },
                exportOptions: {
                    title: 'Opzioni export',
                    description: 'Questo e volutamente un piccolo hub di azioni. Grid, Form e altre anteprime possono puntare qui quando gli utenti devono scegliere un formato di esportazione invece di scaricare subito.',
                },
            },
            emptyState: {
                singleRecordHint: 'Apri questa pagina da una Grid action consapevole del record per precompilare l anteprima con un singolo record. Gli strumenti di export continuano comunque a funzionare sull intero dataset mock.',
            },
            actions: {
                exportCsv: 'Esporta CSV',
                exportJson: 'Esporta JSON',
                saveAsPdf: 'Salva come PDF',
                copyJson: 'Copia JSON',
                jsonCopied: 'JSON copiato',
                copyEmails: 'Copia email',
                emailsCopied: 'Email copiate',
            },
            hints: {
                futureReuse: 'Suggerimento: per ora questa pagina si concentra su export e anteprima. In seguito potremo riusare lo stesso layout per anteprima Form, layout di stampa e flussi di review a livello record senza cambiare di nuovo il contratto delle Grid action.',
            },
        },
    },
});
