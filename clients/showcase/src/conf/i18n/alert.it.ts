import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        alert: {
            page: { title: 'Alert', description: 'Messaggi di feedback contestuale per l\'utente. Supporta icone, chiusura automatica e posizionamento fisso.' },
            sections: {
                variants: { description: 'Ogni tipo ha colori predefiniti e un\'icona.' },
                appearance: { title: 'Aspetto', description: 'appearance="text" rende un indicatore inline compatto: senza sfondo, senza bordo, con larghezza adattata al contenuto. Ideale per feedback di stato accanto ai pulsanti.' },
                withoutIcon: { title: 'Senza icona' },
                autoDismiss: { title: 'Chiusura automatica', description: 'L\'alert si chiude automaticamente dopo il timeout specificato (ms).' },
                placement: { title: 'Modalita di posizionamento', description: 'placement controlla dove viene renderizzato l\'alert: inline (predefinito, nel normale flusso del documento) oppure fixed (ancorato alla viewport tramite portal sopra tutto il contenuto).' },
            },
        },
    },
});
