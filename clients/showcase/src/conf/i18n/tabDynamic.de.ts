import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tabDynamic: {
            page: {
                title: 'TabDynamic',
                description: 'Dynamischer Tab-Editor fuer wiederholte Formularabschnitte in Arrays.',
            },
            sections: {
                editableTabs: {
                    title: 'Bearbeitbare Tabs',
                    description: 'TabDynamic rendert jedes Array-Element als entfernbaren Tab und haelt das aktive Panel mit dem aktuellen Form-Record verbunden.',
                },
            },
            labels: {
                section: 'Abschnitt',
                dynamicSections: 'Dynamische Abschnitte',
                intro: 'Intro',
                title: 'Titel',
            },
            propsDocs: {
                items: {
                    name: { description: 'Name des Array-Felds im Form-Record.' },
                    children: { description: 'Felder, die innerhalb des aktiven Tabs gerendert werden.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    onAdd: { description: 'Wird nach dem Hinzufuegen eines Tabs aufgerufen.' },
                    onRemove: { description: 'Wird nach dem Entfernen eines Tabs aufgerufen.' },
                    label: { description: 'Tab-Label-Praefix oder Konverter-Template.' },
                    min: { description: 'Minimale Anzahl an Tabs.' },
                    max: { description: 'Maximale Anzahl an Tabs.' },
                    activeIndex: { description: 'Anfangs aktiver Tab.' },
                    title: { description: 'Ueberschrift oberhalb der Tabs.' },
                    readOnly: { description: 'Blendet Hinzufuegen/Entfernen aus.' },
                    tabPosition: { description: 'Position des Tab-Layouts.' },
                },
            },
            playground: {
                title: 'TabDynamic',
            },
        },
    },
});
