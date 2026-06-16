import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tab: {
            page: {
                title: 'Tab',
                description: 'Navigazione a tab con cinque posizioni di layout. Renderizza tab classiche con underline oppure pill in base al posizionamento.',
            },
            examples: {
                layouts: {
                    title: 'Posizioni layout',
                    description: 'Confronta i posizionamenti disponibili per scegliere la struttura giusta per sezioni di pagina, schermate impostazioni o viste di supporto.',
                    items: {
                        default: {
                            tab: 'default',
                            title: 'layout="default"',
                            description: 'Tab classiche con underline. Ideali per sezioni di contenuto principali.',
                        },
                        top: {
                            tab: 'top',
                            title: 'layout="top"',
                            description: 'Tab a pill sopra il contenuto. Ottime per filtri o viste secondarie.',
                        },
                        left: {
                            tab: 'left',
                            title: 'layout="left"',
                            description: 'Pill verticali a sinistra. Ideali per pagine impostazioni.',
                        },
                        right: {
                            tab: 'right',
                            title: 'layout="right"',
                            description: 'Pill verticali a destra per layout specchiati o pannelli di supporto.',
                        },
                        bottom: {
                            tab: 'bottom',
                            title: 'layout="bottom"',
                            description: 'Pill sotto il contenuto quando azioni o riepiloghi devono restare sopra.',
                        },
                    },
                },
            },
            labels: {
                general: 'Generale',
                advanced: 'Avanzate',
                permissions: 'Permessi',
                generalSettingsContent: 'Contenuto impostazioni generali.',
                advancedOptionsContent: 'Contenuto opzioni avanzate.',
                permissionManagementContent: 'Gestione permessi.',
                generalTabContent: 'Contenuto della tab Generale.',
                advancedTabContent: 'Contenuto della tab Avanzate.',
                permissionsTabContent: 'Contenuto della tab Permessi.',
            },
            propsDocs: {
                tabTitle: 'Props Tab',
                tabItemTitle: 'Props TabItem',
                tab: {
                    items: {
                        children: { description: 'Figli TabItem.' },
                        defaultIndex: { description: 'Indice della tab attiva iniziale.' },
                        layout: { description: 'Posizione del layout della navigazione tab.' },
                        before: { description: 'Contenuto renderizzato subito prima del contenitore Tab.' },
                        after: { description: 'Contenuto renderizzato subito dopo il contenitore Tab.' },
                        motion: { description: 'Preset motion nominato oppure override inline MotionProps applicato a ogni pannello tab quando viene attivato.' },
                        className: { description: 'Classi CSS aggiuntive sul root di Tab.' },
                        wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
                    },
                },
                tabItem: {
                    items: {
                        label: { description: 'Etichetta del trigger tab.' },
                        children: { description: 'Contenuto del pannello tab.' },
                    },
                },
            },
            playground: {
                title: 'Tab',
            },
        },
    },
});
