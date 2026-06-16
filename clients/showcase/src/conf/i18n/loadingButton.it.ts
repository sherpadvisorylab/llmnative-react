import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        loadingButton: {
            page: { title: 'LoadingButton', description: 'Pulsante asincrono che si disabilita mentre il lavoro e in corso. Supporta aggiornamenti live dell\'etichetta tramite setMessage.' },
            sections: {
                asyncSave: { title: 'Salvataggio asincrono', description: 'Passa un onClick asincrono. Il pulsante mostra lo spinner e blocca i riclick finche la promise non si risolve.' },
                customLabel: { title: 'Etichetta di caricamento personalizzata', description: 'loadingLabel sostituisce l\'etichetta predefinita "Save…" mentre lo spinner e attivo.' },
                streaming: { title: 'Etichetta live via setMessage', description: 'Il secondo argomento di onClick e setMessage: chiamalo in qualsiasi momento durante il lavoro asincrono per aggiornare in tempo reale l\'etichetta di caricamento. Utile per operazioni a piu step.' },
                disabled: { title: 'Stato disabilitato', description: 'disabled mantiene il pulsante permanentemente inattivo, indipendentemente dal ciclo di caricamento.' },
                controlled: { title: 'Caricamento controllato (loading)', description: 'loading consente a un componente padre di controllare dall\'esterno lo stato di caricamento, utile quando il pulsante fa parte di un flusso di submit piu ampio.' },
                variants: { description: 'LoadingButton supporta gli stessi token di variante di ActionButton.' },
            },
        },
    },
});
