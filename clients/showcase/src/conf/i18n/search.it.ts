import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        search: {
            page: {
                title: 'Ricerca',
                description: 'Blocco trigger di ricerca per header. L’implementazione corrente renderizza un pulsante toggle e un input nascosto.',
            },
            sections: {
                searchTrigger: {
                    title: 'Trigger ricerca',
                    description: 'Usa Search come affordance compatta nell’header quando il campo di ricerca deve espandersi solo su richiesta.',
                },
            },
            propsDocs: {
                items: {
                    onQueryChange: { description: "Chiamata quando cambia l'input di ricerca nascosto." },
                },
            },
            playground: {
                title: 'Ricerca',
            },
        },
    },
});
