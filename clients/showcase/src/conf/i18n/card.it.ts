import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        card: {
            page: { title: 'Card', description: 'Contenitore versatile con header, body, footer opzionali e overlay loader integrato.' },
            sections: {
                basic: { title: 'Card base' },
                headerFooter: { title: 'Con header e footer' },
                grid: { title: 'Griglia di card' },
                loader: { title: 'Card con loader', description: 'Passa loading per sovrapporre uno spinner mentre i dati vengono recuperati.' },
            },
        },
    },
});
