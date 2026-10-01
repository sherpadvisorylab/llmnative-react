import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'Coppie etichetta → valore in sola lettura, rese come <dl> semantico: dati del profilo, dati di un record, riepiloghi.',
            },
            sections: {
                horizontal: { title: 'Orizzontale', description: 'Colonna delle etichette a sinistra, valori a destra; sugli schermi piccoli ogni coppia va in colonna.' },
                stacked: { title: 'In colonne', description: 'Etichetta sopra il valore, disposti in colonne responsive: adatto ai dati in testa a una scheda.' },
            },
            labels: {
                email: 'Email di accesso',
                role: 'Ruolo',
                dealer: 'Dealer',
                phone: 'Telefono',
                status: 'Stato',
                buyer: 'Acquirente',
                shipped: 'Spedito il',
                price: 'Prezzo unitario',
                admin: 'Amministratore',
                delivered: 'Consegnato',
            },
            propsDocs: { items: {
                items: { description: 'Coppie da mostrare: { key?, label, value?, title? }.' },
                layout: { description: 'horizontal: etichette in colonna a sinistra; stacked: etichetta sopra il valore.' },
                columns: { description: 'Solo layout stacked: colonne dal breakpoint lg (1–6).' },
                labelWidth: { description: 'Solo layout horizontal: larghezza della colonna delle etichette (lunghezza CSS).' },
                emptyValue: { description: 'Mostrato per valori null, undefined o stringa vuota.' },
                truncate: { description: 'Valori su una riga con ellissi; un valore testuale diventa il suo tooltip.' },
                className: { description: 'Classi sul <dl>.' },
                wrapperClassName: { description: 'Classi su un <div> contenitore facoltativo.' },
            } },
            playground: { title: 'Playground DescriptionList' },
        },
    },
});
