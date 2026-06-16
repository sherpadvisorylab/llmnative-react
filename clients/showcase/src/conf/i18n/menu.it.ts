import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        menu: {
            page: {
                title: 'Menu',
                description: "Menu di navigazione route-aware renderizzato da un contesto menu dell'app.",
            },
            sections: {
                componentsMenu: {
                    title: 'Menu componenti',
                    description: "Menu legge l'albero di navigazione configurato nell'app e renderizza voci annidate con badge opzionali e wrapper personalizzati.",
                },
            },
            labels: {
                none: 'nessuno',
                single: 'singolo',
                multi: 'multiplo',
                newBadge: 'new',
                betaBadge: 'beta',
            },
            propsDocs: {
                items: {
                    menuKey: { description: 'Chiave del contesto menu passata a useMenu.' },
                    as: { description: 'Tipo di elemento lista.' },
                    badges: {
                        description: 'Badge indicizzati per titolo voce in minuscolo.',
                        shortcuts: {
                            none: { label: 'nessuno', help: 'Nessun badge nel menu.' },
                            single: { label: 'singolo', help: 'Un badge su alert.' },
                            multi: { label: 'multiplo', help: 'Piu badge su chiavi diverse.' },
                        },
                    },
                    before: { description: 'Contenuto prima del menu.' },
                    after: { description: 'Contenuto dopo il menu.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper.' },
                    className: { description: 'Classi CSS sulla lista del menu.' },
                    headerClassName: { description: 'Classi CSS sugli elementi header.' },
                    itemClassName: { description: 'Classi CSS sugli elementi li.' },
                    linkClassName: { description: 'Classi CSS sui link.' },
                    iconClassName: { description: "Classi CSS sul wrapper dell'icona." },
                    textClassName: { description: 'Classi CSS sul testo della voce.' },
                    badgeClassName: { description: 'Classi CSS sui badge.' },
                    arrowClassName: { description: 'Classi CSS sulla freccia del sottomenu.' },
                    submenuClassName: { description: 'Classi CSS sulle liste nidificate.' },
                },
            },
            playground: {
                title: 'Menu',
            },
        },
    },
});
