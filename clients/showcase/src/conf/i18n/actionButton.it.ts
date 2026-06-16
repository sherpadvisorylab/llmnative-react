import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        actionButton: {
            page: { title: 'ActionButton', description: 'Pulsante per azioni sincrone immediate con icona, badge, motion alla pressione e sistema di varianti. Usa LoadingButton per operazioni asincrone.' },
            sections: {
                variants: { description: 'Usa la prop variant per applicare colori semantici senza scrivere classi CSS.' },
                iconLabel: { title: 'Combinazioni icona + etichetta', description: 'icon renderizza un\'icona dal provider attivo. Ometti label per un pulsante solo icona e abbinalo a title per l\'accessibilita.' },
                onClick: { title: 'Handler onClick', description: 'onClick ferma automaticamente la propagazione. Il pulsante non gestisce lo stato di caricamento: per lavoro asincrono usa LoadingButton.' },
                disabled: { title: 'Stato disabilitato', description: 'disabled impedisce il click e mostra un cursore non consentito sul wrapper. Il pulsante mantiene la sua forma visiva.' },
                badge: { title: 'Badge di notifica', description: 'badge renderizza un indicatore con conteggio o testo in alto a destra. Utile per elementi in sospeso.' },
            },
        },
    },
});
