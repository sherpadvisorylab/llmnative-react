import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        search: {
            page: {
                title: 'Suche',
                description: 'Kompakter Such-Trigger fuer den Header. Die aktuelle Implementierung rendert einen Toggle-Button und ein verborgenes Eingabefeld.',
            },
            sections: {
                searchTrigger: {
                    title: 'Such-Trigger',
                    description: 'Verwende Search als kompakte Header-Aktion, wenn sich das Suchfeld nur bei Bedarf oeffnen soll.',
                },
            },
            propsDocs: {
                items: {
                    onQueryChange: { description: 'Wird aufgerufen, wenn sich das verborgene Sucheingabefeld aendert.' },
                },
            },
            playground: {
                title: 'Suche',
            },
        },
    },
});
