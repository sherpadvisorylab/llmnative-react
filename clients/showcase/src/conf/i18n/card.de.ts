import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        card: {
            page: { title: 'Card', description: 'Vielseitiger Container mit optionalem Header, Body, Footer und integriertem Loader-Overlay.' },
            sections: {
                basic: { title: 'Einfache Card' },
                headerFooter: { title: 'Mit Header und Footer' },
                grid: { title: 'Card-Raster' },
                loader: { title: 'Card mit Loader', description: 'Uebergib loading, um waehrend des Ladens einen Spinner ueberzublenden.' },
            },
        },
    },
});
