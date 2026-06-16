import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        buttons: {
            page: { title: 'Buttons', description: 'Stati semantici dei pulsanti piu componenti focalizzati per azioni immediate, azioni asincrone, navigazione e riferimenti esterni.' },
            sections: {
                nativeStates: { title: 'Classi di stato native', description: 'Usa le classi di stato `btn` fornite dal framework per pulsanti e link semplici.' },
                outlineLink: { title: 'Outline e link', description: 'Gli stati outline usano gli stessi nomi semantici e token dei pulsanti solid.' },
                components: { title: 'Componenti button', description: 'Usa le pagine dedicate per esempi, props e playground specifici di ciascun componente button.' },
            },
            cards: {
                actionButton: 'Azioni immediate con icone, badge, stato disabilitato e motion alla pressione.',
                loadingButton: 'Azioni asincrone con stato di caricamento, testo di avanzamento e disabilitazione automatica.',
                navigation: 'Helper per tornare indietro e per riferimenti esterni.',
            },
        },
    },
});
