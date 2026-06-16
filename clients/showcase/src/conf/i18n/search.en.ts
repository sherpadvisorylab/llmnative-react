import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        search: {
            page: {
                title: 'Search',
                description: 'Header search trigger block. Current implementation renders a toggle button and hidden input.',
            },
            sections: {
                searchTrigger: {
                    title: 'Search trigger',
                    description: 'Use Search as a compact header affordance when the search field should expand only on demand.',
                },
            },
            propsDocs: {
                items: {
                    onQueryChange: { description: 'Called when the hidden search input changes.' },
                },
            },
            playground: {
                title: 'Search',
            },
        },
    },
});
