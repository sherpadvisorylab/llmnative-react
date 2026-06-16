import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tab: {
            page: {
                title: 'Tab',
                description: 'Navegaciya po vkladkam s pyatyu variantami raspolozheniya. V zavisimosti ot pozicii komponent renderit klassicheskie vkladki s podcherkivaniem ili pill-variant.',
            },
            examples: {
                layouts: {
                    title: 'Polozheniya layout',
                    description: 'Sravnite dostupnye varianty raspolozheniya, chtoby podobrat podkhodyashchuyu strukturu dlya razdelov stranicy, ekranov nastroek ili vspomogatelnykh predstavleniy.',
                    items: {
                        default: {
                            tab: 'default',
                            title: 'layout="default"',
                            description: 'Klassicheskie vkladki s podcherkivaniem. Luchshe vsego podkhodyat dlya osnovnykh razdelov kontenta.',
                        },
                        top: {
                            tab: 'top',
                            title: 'layout="top"',
                            description: 'Pill-vkladki nad kontentom. Khorosho podkhodyat dlya filtrov ili vtorichnykh predstavleniy.',
                        },
                        left: {
                            tab: 'left',
                            title: 'layout="left"',
                            description: 'Vertikalnye pill-vkladki sleva. Idealny dlya stranic s nastroikami.',
                        },
                        right: {
                            tab: 'right',
                            title: 'layout="right"',
                            description: 'Vertikalnye pill-vkladki sprava dlya zerkalnykh ili vspomogatelnykh maketov.',
                        },
                        bottom: {
                            tab: 'bottom',
                            title: 'layout="bottom"',
                            description: 'Pill-vkladki pod kontentom, kogda deistviya ili svodka dolzhny ostavatsya vyshe.',
                        },
                    },
                },
            },
            labels: {
                general: 'Obshchie',
                advanced: 'Rasshirennye',
                permissions: 'Prava dostupa',
                generalSettingsContent: 'Soderzhimoe obshchikh nastroek.',
                advancedOptionsContent: 'Soderzhimoe rasshirennykh parametrov.',
                permissionManagementContent: 'Upravlenie pravami dostupa.',
                generalTabContent: 'Soderzhimoe vkladki Obshchie.',
                advancedTabContent: 'Soderzhimoe vkladki Rasshirennye.',
                permissionsTabContent: 'Soderzhimoe vkladki Prava dostupa.',
            },
            propsDocs: {
                tabTitle: 'Props Tab',
                tabItemTitle: 'Props TabItem',
                tab: {
                    items: {
                        children: { description: 'Dochernie elementy TabItem.' },
                        defaultIndex: { description: 'Indeks vkladki, aktivnoi pri pervom renderinge.' },
                        layout: { description: 'Polozhenie navigacii po vkladkam.' },
                        before: { description: 'Kontent, kotoryi renderitsya srazu pered konteinером Tab.' },
                        after: { description: 'Kontent, kotoryi renderitsya srazu posle konteinера Tab.' },
                        motion: { description: 'Imenovannyi motion preset ili inline override MotionProps, kotoryi primenyaetsya k kazhdoi paneli pri aktivacii.' },
                        className: { description: 'Dopolnitelnye CSS-klassy na kornevom elemente Tab.' },
                        wrapperClassName: { description: 'CSS-klassy na vneshnem wrapper.' },
                    },
                },
                tabItem: {
                    items: {
                        label: { description: 'Podpis triggera vkladki.' },
                        children: { description: 'Soderzhimoe paneli vkladki.' },
                    },
                },
            },
            playground: {
                title: 'Tab',
            },
        },
    },
});
