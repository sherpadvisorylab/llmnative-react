import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        upload: {
            page: {
                title: 'Upload',
                description: 'Tre campi di upload specializzati per immagini, documenti e dati CSV. Ogni variante gestisce in autonomia anteprima locale, binding del file e storage cloud opzionale.',
            },
            sections: {
                variants: {
                    description: 'Scegli la variante che corrisponde al tipo di file. Tutte e tre estendono FormFieldProps e collegano il risultato al record del Form contenitore tramite la prop name.',
                },
                cloudStorage: {
                    title: 'Storage cloud',
                    description: 'Registra uno StorageProvider in App e passa storagePath a UploadImage o UploadDocument per inviare i file a Firebase Storage o Supabase Storage invece di mantenerli come base64 locali.',
                },
            },
            variants: {
                image: {
                    title: 'UploadImage',
                    description: 'Griglia di miniature inline con overlay al passaggio del mouse per anteprima, ritaglio e rimozione. Supporta una o piu immagini.',
                },
                document: {
                    title: 'UploadDocument',
                    description: 'Lista file con nome, dimensione e barra di avanzamento. Accetta qualsiasi tipo di file tramite il filtro accept.',
                },
                csv: {
                    title: 'UploadCSV',
                    description: 'Parser CSV drag-and-drop. Consegna righe tipizzate e nomi dei campi a onDataLoaded. Funziona anche standalone senza Form.',
                },
            },
            labels: {
                storageNotice: 'Lo showcase gira offline: le demo con storagePath richiedono uno StorageProvider configurato.',
            },
        },
    },
});
