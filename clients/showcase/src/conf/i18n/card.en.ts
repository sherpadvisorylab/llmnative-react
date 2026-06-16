import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        card: {
            page: { title: 'Card', description: 'Versatile container with optional header, body, footer and built-in loader overlay.' },
            sections: {
                basic: { title: 'Basic card' },
                headerFooter: { title: 'With header and footer' },
                grid: { title: 'Card grid' },
                loader: { title: 'Card with loader', description: 'Pass loading to overlay a spinner while data is being fetched.' },
            },
        },
    },
});
