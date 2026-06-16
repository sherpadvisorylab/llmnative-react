import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        loader: {
            page: { title: 'Loader', description: 'Spinner overlay che avvolge qualsiasi contenuto. Quando show=true, sopra i children viene renderizzato uno sfondo sfocato con uno spinner tematizzato: il contenuto resta nel DOM e riappare subito quando il loader viene chiuso.' },
            sections: {
                showHide: { title: 'Mostra / nascondi', description: 'Alterna show per sovrapporre o rivelare il contenuto wrappato. Il contenuto resta sempre montato: nessun layout shift quando il loader scompare.' },
                custom: { title: 'Icona e messaggio personalizzati', description: 'Sovrascrive i valori di tema per singola istanza con icon, title e description. Il valore di icon e un nome icona: qualsiasi icona supportata dal provider configurato funziona.' },
                card: { title: 'Integrazione con Card', description: 'Card espone una prop showLoader come scorciatoia di comodo: wrappa automaticamente il body della card in un Loader.' },
                other: { title: 'Altri indicatori di caricamento nel framework', description: '@llmnative/react include altri pattern di caricamento per contesti diversi.' },
            },
        },
    },
});
