import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Dinamicheskoe pole-massiv, kloniruyushchee gruppu poley dlya kazhdogo elementa s sinkhronizatsiey dobavleniya i udaleniya s record Form.',
            },
            sections: {
                repeatedFields: {
                    title: 'Bazovoe ispolzovanie — gorizontalnyy layout',
                    description: 'Layout po umolchaniyu. Kazhdyy element poluchaet pronumerovannuyu shapku, sobstvennuyu gruppu poley i knopku udaleniya. Knopka dobavleniya poyavlyaetsya pod spiskom ili inline s metkov, esli ona zadana.',
                },
                inlineLayout: {
                    title: 'Inline layout',
                    description: 'layout="inline" delaet kazhdyy ryad kompaktnym: dochternie elementy zanimayut dostupnoe mesto, knopka udaleniya — v konce. Idealno dlya palet tsvetov, spiskov tegov ili par klyuch-znachenie.',
                },
                multipleFields: {
                    title: 'Neskolko poley na element',
                    description: 'Razmeshchayte lyuboe kolichestvo poley vnutri povtoryaemogo bloka — kazhdyy element poluchaet sobstvennyy pronumerovannyy razdel s shapkoy i deystviem udaleniya.',
                },
                constraints: {
                    title: 'Ogranicheniya min / max',
                    description: 'minItems zapreshchaet udalenie nizhe minimuma (pervye N elementov ne imeyut knopki udaleniya). maxItems skryvaet knopku dobavleniya pri dostizhenii limita.',
                },
                readOnlyMode: {
                    title: 'Rezhim tolko dlya chteniya',
                    description: 'Ustanavlivayte readOnly, chtoby skryt deystviya dobavleniya i udaleniya, prevrashchaya spisok v prosmotr bez redaktirovaniya.',
                },
                functionChildren: {
                    title: 'Children kak funktsiya renderinga',
                    description: 'Peredavayte funktsiyu kak children, chtoby poluchit tekushchiy indeks i record — polezno dlya dinamicheskikh metok, uslovnykh poley i renderinga s uchetom indeksa.',
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
                test: 'Test',
                addColor: 'Dobavit tsvet',
                colors: 'Tsveta',
                colorName: 'Imya tokena',
                primary: 'primary',
                secondary: 'secondary',
                accent: 'accent',
                socialLinks: 'Sotsialnye seti',
                platform: 'Platforma',
                url: 'URL',
                twitter: 'Twitter',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                languages: 'Yazyki',
                language: 'Yazyk',
                english: 'Angliyskiy',
                italian: 'Italyanskiy',
                german: 'Nemetskiy',
                skills: 'Navyki',
                skill: 'Navyk',
                javascript: 'JavaScript',
                typescript: 'TypeScript',
                react: 'React',
                pipelineSteps: 'Shagi pipeline',
                stepName: 'Nazvanie shaga',
                command: 'Komanda',
            },
            propsDocs: {
                title: 'Props',
                items: {
                    name: { description: 'Imya polya-massiva v record Form.' },
                    children: { description: 'Polya, kloniruemye dlya kazhdoy povtoryaemoy stroki. Peredavayte funktsiyu dlya (record, records, index).' },
                    onChange: { description: 'Polzovatelskiy obrabotchik izmeneniya iz konteksta Form.' },
                    onAdd: { description: 'Vyzyvaetsya posle dobavleniya elementa.' },
                    onRemove: { description: 'Vyzyvaetsya posle udaleniya elementa.' },
                    className: { description: 'CSS-klassy kornevoy obertki.' },
                    layout: { description: 'horizontal — pronumerovannaya karta na element; inline — kompaktnaya stroka na element.' },
                    minItems: { description: 'Minimalnoe kolichestvo elementov — knopka udaleniya skryta dlya pervykh N elementov.' },
                    maxItems: { description: 'Maksimalnoe kolichestvo elementov — knopka dobavleniya skryta pri dostizhenii limita.' },
                    label: { description: 'Metka razdela nad spiskom; knopka dobavleniya razmeshchaetsya inline.' },
                    readOnly: { description: 'Skryvaet deystviya dobavleniya i udaleniya.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
