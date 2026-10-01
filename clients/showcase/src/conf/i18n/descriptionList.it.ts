import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'Coppie etichetta → valore in sola lettura con semantica nativa <dl>/<dt>/<dd>, layout orizzontale o impilato, colonne responsive e stile basato sul tema.',
            },
            sections: {
                horizontal: { title: 'Orizzontale', description: 'Etichetta accanto al valore. Su mobile la coppia si impila e rispetta labelWidth sugli schermi piu grandi.' },
                stacked: { title: 'Colonne impilate', description: 'Etichetta sopra il valore, disposta in una griglia responsive da 1 a 6 colonne.' },
                emptyValues: { title: 'Valori vuoti', description: 'null, undefined e stringhe vuote rendono emptyValue (default "—").' },
                truncate: { title: 'Troncamento', description: 'Mantiene i valori lunghi su una sola riga con ellissi ed espone il testo completo tramite title nativo.' },
                theme: { title: 'Tema', description: 'Ogni slot e personalizzabile tramite la chiave di tema DescriptionList: wrapper, lista, item, etichetta e valore.' },
            },
            labels: {
                email: 'Email',
                role: 'Ruolo',
                admin: 'Amministratore',
                fullName: 'Nome completo',
                company: 'Azienda',
                status: 'Stato',
                phone: 'Telefono',
                address: 'Indirizzo',
                notes: 'Note',
                bio: 'Biografia',
                longValue: 'Un valore molto lungo che non entra su una sola riga e richiede il troncamento',
                empty: 'N/D',
            },
            propsDocs: { items: {
                items: { description: 'Coppie di etichetta e valore da renderizzare.' },
                layout: { description: 'Posizione dell etichetta: accanto al valore (horizontal) o sopra (stacked).' },
                columns: { description: 'Numero di colonne responsive nel layout stacked (1-6). Ignorato in horizontal.' },
                labelWidth: { description: 'Larghezza fissa dell etichetta nel layout horizontal (qualsiasi lunghezza CSS, es. "12rem").' },
                emptyValue: { description: 'Renderizzato quando un valore e null, undefined o vuoto. Default "—".' },
                truncate: { description: 'Mantiene i valori su una riga con ellissi e imposta un title nativo sui valori testuali.' },
                className: { description: 'Classi CSS sull elemento <dl>.' },
                wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
            } },
            playground: {
                title: 'DescriptionList',
                props: {
                    items: { description: 'Coppie di etichetta e valore da renderizzare.' },
                    layout: { description: 'Posizione dell etichetta: accanto al valore (horizontal) o sopra (stacked).' },
                    columns: { description: 'Numero di colonne responsive nel layout stacked (1-6). Ignorato in horizontal.' },
                    labelWidth: { description: 'Larghezza fissa dell etichetta nel layout horizontal (qualsiasi lunghezza CSS, es. "12rem").' },
                    emptyValue: { description: 'Renderizzato quando un valore e null, undefined o vuoto. Default "—".' },
                    truncate: { description: 'Mantiene i valori su una riga con ellissi e imposta un title nativo sui valori testuali.' },
                    className: { description: 'Classi CSS sull elemento <dl>.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
                },
            },
        },
    },
});
