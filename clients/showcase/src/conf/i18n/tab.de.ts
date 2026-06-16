import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tab: {
            page: {
                title: 'Tab',
                description: 'Tab-Navigation mit funf Layout-Positionen. Je nach Platzierung werden klassische Unterstreichungs-Tabs oder Pill-Layouts gerendert.',
            },
            examples: {
                layouts: {
                    title: 'Layout-Positionen',
                    description: 'Vergleiche die verfugbaren Platzierungen, um die passende Struktur fur Seitenbereiche, Einstellungsansichten oder unterstutzende Views zu finden.',
                    items: {
                        default: {
                            tab: 'default',
                            title: 'layout="default"',
                            description: 'Klassische Tabs mit Unterstreichung. Am besten fur primare Inhaltsbereiche.',
                        },
                        top: {
                            tab: 'top',
                            title: 'layout="top"',
                            description: 'Pill-Tabs uber dem Inhalt. Gut fur Filter oder sekundare Ansichten.',
                        },
                        left: {
                            tab: 'left',
                            title: 'layout="left"',
                            description: 'Vertikale Pills links. Ideal fur Einstellungsseiten.',
                        },
                        right: {
                            tab: 'right',
                            title: 'layout="right"',
                            description: 'Vertikale Pills rechts fur gespiegelte oder unterstutzende Seitenlayouts.',
                        },
                        bottom: {
                            tab: 'bottom',
                            title: 'layout="bottom"',
                            description: 'Pills unter dem Inhalt, wenn Aktionen oder Zusammenfassungen oben bleiben sollen.',
                        },
                    },
                },
            },
            labels: {
                general: 'Allgemein',
                advanced: 'Erweitert',
                permissions: 'Berechtigungen',
                generalSettingsContent: 'Inhalt der allgemeinen Einstellungen.',
                advancedOptionsContent: 'Inhalt der erweiterten Optionen.',
                permissionManagementContent: 'Verwaltung der Berechtigungen.',
                generalTabContent: 'Inhalt des Tabs Allgemein.',
                advancedTabContent: 'Inhalt des Tabs Erweitert.',
                permissionsTabContent: 'Inhalt des Tabs Berechtigungen.',
            },
            propsDocs: {
                tabTitle: 'Tab-Props',
                tabItemTitle: 'TabItem-Props',
                tab: {
                    items: {
                        children: { description: 'TabItem-Kinder.' },
                        defaultIndex: { description: 'Index des anfanglich aktiven Tabs.' },
                        layout: { description: 'Layout-Position der Tab-Navigation.' },
                        before: { description: 'Inhalt, der direkt vor dem Tab-Container gerendert wird.' },
                        after: { description: 'Inhalt, der direkt nach dem Tab-Container gerendert wird.' },
                        motion: { description: 'Benanntes Motion-Preset oder inline MotionProps-Override, das beim Aktivieren auf jedes Tab-Panel angewendet wird.' },
                        className: { description: 'Zusatzliche CSS-Klassen auf dem Tab-Root.' },
                        wrapperClassName: { description: 'CSS-Klassen auf dem auBeren Wrapper.' },
                    },
                },
                tabItem: {
                    items: {
                        label: { description: 'Beschriftung des Tab-Triggers.' },
                        children: { description: 'Inhalt des Tab-Panels.' },
                    },
                },
            },
            playground: {
                title: 'Tab',
            },
        },
    },
});
