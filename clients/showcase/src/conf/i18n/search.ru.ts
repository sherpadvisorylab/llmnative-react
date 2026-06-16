import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        search: {
            page: {
                title: 'Poisk',
                description: 'Kompaktnyy trigger poiska v zagolovke. Tekushchaya realizatsiya renderit knopku-pereklyuchatel i skrytoe pole vvoda.',
            },
            sections: {
                searchTrigger: {
                    title: 'Trigger poiska',
                    description: 'Ispolzuyte Search kak kompaktnyy element v shapkе, kogda pole poiska dolzhno raskryvatsya tolko po zaprosu.',
                },
            },
            propsDocs: {
                items: {
                    onQueryChange: { description: 'Vyzyvaetsya pri izmenenii skrytogo polya poiska.' },
                },
            },
            playground: {
                title: 'Poisk',
            },
        },
    },
});
