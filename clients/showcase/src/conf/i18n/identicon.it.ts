import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        identicon: {
            page: {
                title: 'Identicon',
                description: "Un'icona disegnata da un valore, come quella che GitHub dà a un account senza immagine: griglia 5×5 simmetrica, celle e tinta da un hash. Lo stesso valore dà sempre la stessa icona; niente rete né storage.",
            },
            sections: {
                values: {
                    title: "Valori",
                    description: "Ogni valore ha la sua icona: usala per repository, tenant o utenti senza foto.",
                },
                sizes: {
                    title: "Dimensioni",
                    description: "size imposta larghezza e altezza in pixel; il disegno si scala senza sfocature.",
                },
                inRow: {
                    title: "In una riga",
                    description: "before e after mettono contenuti accanto all'icona; className ne cambia la forma.",
                },
            },
            labels: {
                repository: "Repository",
            },
            propsDocs: {
                title: "Props di Identicon",
                items: {
                    value: { description: "Ciò che l'icona rappresenta: lo stesso valore disegna sempre la stessa icona." },
                    size: { description: "Larghezza e altezza in pixel (default 40)." },
                    title: { description: "Nome accessibile: con questo l'icona è role=\"img\"; senza, è decorativa (aria-hidden)." },
                    before: { description: "Contenuto prima dell'icona." },
                    after: { description: "Contenuto dopo l'icona." },
                    className: { description: "Classi dell'SVG; di default rounded-md bg-muted (tema Identicon.className)." },
                    wrapperClassName: { description: "Classi del contenitore, presente solo con before o after." },
                },
            },
            playground: {
                title: 'Identicon',
            },
        },
    },
});
