import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tabDynamic: {
            page: {
                title: 'TabDynamic',
                description: 'Dinamicheskiy redaktor s vkladkami dlya povtoryayushchikhsya razdelov formy.',
            },
            sections: {
                editableTabs: {
                    title: 'Redaktiruemye vkladki',
                    description: 'TabDynamic renderit kazhdyy element massiva kak udalyaemuyu vkladku i svyazyvaet aktivnuyu panel s tekushchim record Form.',
                },
            },
            labels: {
                section: 'Razdel',
                dynamicSections: 'Dinamicheskie razdely',
                intro: 'Intro',
                title: 'Zagolovok',
            },
            propsDocs: {
                items: {
                    name: { description: 'Imya polya-massiva v record Form.' },
                    children: { description: 'Polya, renderimye vnutri aktivnoy vkladki.' },
                    onChange: { description: 'Polzovatelskiy obrabotchik izmeneniya iz konteksta Form.' },
                    onAdd: { description: 'Vyzyvaetsya posle dobavleniya vkladki.' },
                    onRemove: { description: 'Vyzyvaetsya posle udaleniya vkladki.' },
                    label: { description: 'Prefiks metki vkladki ili shablon preobrazovaniya.' },
                    min: { description: 'Minimalnoe kolichestvo vkladok.' },
                    max: { description: 'Maksimalnoe kolichestvo vkladok.' },
                    activeIndex: { description: 'Nachalnaya aktivnaya vkladka.' },
                    title: { description: 'Zagolovok nad vkladkami.' },
                    readOnly: { description: 'Skryvaet deystviya dobavleniya i udaleniya.' },
                    tabPosition: { description: 'Polozhenie raskladki vkladok.' },
                },
            },
            playground: {
                title: 'TabDynamic',
            },
        },
    },
});
