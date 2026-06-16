import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalYesNo: {
            page: { title: 'ModalYesNo', description: 'Dialog di conferma con pulsanti Yes e No. Entrambi gli handler chiudono automaticamente il modal dopo la resolve.' },
            sections: {
                destructiveConfirmation: { title: 'Conferma distruttiva', description: 'Usa ModalYesNo prima di qualsiasi azione irreversibile: delete, reset, publish. Yes esegue l azione, No annulla. Entrambi chiudono il modal quando il relativo handler async termina.' },
            },
            demo: {
                defaultTitle: 'Conferma eliminazione',
                defaultBody: 'Sei sicuro di voler eliminare questo record? Questa azione non puo essere annullata.',
                openButton: 'Apri ModalYesNo',
                deleteRecordButton: 'Elimina record',
                yesResult: 'Hai cliccato Yes.',
                noResult: 'Hai cliccato No.',
                confirmedResult: 'Confermato - record eliminato.',
                cancelledResult: 'Annullato - non e stato eliminato nulla.',
                destructiveQuestion: 'Sei sicuro di voler eliminare user_042? Questa azione non puo essere annullata.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Messaggio di conferma mostrato nel body' },
                    title: { description: 'Titolo del dialog' },
                    onYes: { description: 'Chiamata quando l utente clicca Yes. Il modal si chiude automaticamente dopo la resolve dell handler.' },
                    onNo: { description: 'Chiamata quando l utente clicca No. Il modal si chiude automaticamente dopo la resolve dell handler.' },
                    onClose: { description: 'Chiamata quando il modal viene chiuso tramite X o backdrop' },
                },
            },
        },
    },
});
