import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Helfer fuer dynamische Array-Felder zum Hinzufuegen und Entfernen wiederholter Formularabschnitte.',
            },
            sections: {
                repeatedFields: {
                    title: 'Wiederholte Felder',
                    description: 'Repeat dupliziert dieselbe Feldgruppe fuer jedes Array-Element und haelt Hinzufuegen/Entfernen mit dem aktuellen Form-Record synchron.',
                },
            },
            labels: {
                items: 'Elemente',
                name: 'Name',
                firstItem: 'Erstes Element',
                tasks: 'Aufgaben',
                taskName: 'Aufgabenname',
                design: 'Design',
                build: 'Build',
            },
            propsDocs: {
                items: {
                    name: { description: 'Name des Array-Felds im Form-Record.' },
                    children: { description: 'Felder, die fuer jede wiederholte Zeile geklont werden.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    onAdd: { description: 'Wird nach dem Hinzufuegen eines Elements aufgerufen.' },
                    onRemove: { description: 'Wird nach dem Entfernen eines Elements aufgerufen.' },
                    className: { description: 'CSS-Klassen auf dem Root-Wrapper.' },
                    layout: { description: 'Layout-Variante von Repeat.' },
                    minItems: { description: 'Minimale Anzahl von Elementen.' },
                    maxItems: { description: 'Maximale Anzahl von Elementen.' },
                    label: { description: 'Abschnittslabel mit Hinzufuegen-Aktion.' },
                    readOnly: { description: 'Blendet Hinzufuegen/Entfernen aus.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
