import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Pomoshchnik dlya dinamicheskikh poley-massivov s dobavleniem i udaleniyem povtoryayushchikhsya razdelov formy.',
            },
            sections: {
                repeatedFields: {
                    title: 'Povtoryaemye polya',
                    description: 'Repeat kloniruet odnu i tu zhe gruppu poley dlya kazhdogo elementa massiva i sinhroniziruet deystviya dobavleniya i udaleniya s tekushchim record Form.',
                },
            },
            labels: {
                items: 'Elementy',
                name: 'Imya',
                firstItem: 'Pervyy element',
                tasks: 'Zadachi',
                taskName: 'Nazvanie zadachi',
                design: 'Design',
                build: 'Build',
            },
            propsDocs: {
                items: {
                    name: { description: 'Imya polya-massiva v record Form.' },
                    children: { description: 'Polya, kloniruemye dlya kazhdoy povtoryaemoy stroki.' },
                    onChange: { description: 'Polzovatelskiy obrabotchik izmeneniya iz konteksta Form.' },
                    onAdd: { description: 'Vyzyvaetsya posle dobavleniya elementa.' },
                    onRemove: { description: 'Vyzyvaetsya posle udaleniya elementa.' },
                    className: { description: 'CSS-klassy kornevoy obertki.' },
                    layout: { description: 'Variant layout dlya Repeat.' },
                    minItems: { description: 'Minimalnoe kolichestvo elementov.' },
                    maxItems: { description: 'Maksimalnoe kolichestvo elementov.' },
                    label: { description: 'Metka razdela s deystviem dobavleniya.' },
                    readOnly: { description: 'Skryvaet deystviya dobavleniya i udaleniya.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
