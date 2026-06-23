import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'Dynamisches Array-Feld, das eine Feldgruppe fuer jedes Element klont und Hinzufuegen/Entfernen mit dem Form-Record synchron haelt.',
            },
            sections: {
                repeatedFields: {
                    title: 'Grundlegende Verwendung — horizontales Layout',
                    description: 'Standardlayout. Jedes Element erhaelt eine nummerierte Kopfzeile, seine eigene Feldgruppe und einen Entfernen-Button. Der Hinzufuegen-Button erscheint unterhalb der Liste oder inline mit dem Label.',
                },
                inlineLayout: {
                    title: 'Inline-Layout',
                    description: 'layout="inline" haelt jede Zeile kompakt: Kinder fuellen den verfuegbaren Platz und der Entfernen-Button sitzt rechts buendig. Ideal fuer Farbpaletten, Tag-Listen oder Schluessel-Wert-Paare.',
                },
                multipleFields: {
                    title: 'Mehrere Felder pro Element',
                    description: 'Beliebig viele Felder im wiederholten Block platzieren — jedes Element erhaelt einen eigenen nummerierten Abschnitt mit Kopfzeile und Entfernen-Aktion.',
                },
                constraints: {
                    title: 'Min / Max-Einschraenkungen',
                    description: 'minItems verhindert das Entfernen unter ein Minimum (erste N Elemente haben keinen Entfernen-Button). maxItems blendet den Hinzufuegen-Button aus, wenn das Limit erreicht ist.',
                },
                readOnlyMode: {
                    title: 'Nur-Lese-Modus',
                    description: 'readOnly setzen, um Hinzufuegen- und Entfernen-Aktionen auszublenden und die Liste in eine reine Anzeigeansicht zu verwandeln.',
                },
                functionChildren: {
                    title: 'Children als Render-Funktion',
                    description: 'Eine Funktion als Children uebergeben, um Index und aktuellen Record zu erhalten — nuetzlich fuer dynamische Labels, bedingte Felder oder index-bewusstes Rendering.',
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
                test: 'Test',
                addColor: 'Farbe hinzufuegen',
                colors: 'Farben',
                colorName: 'Token-Name',
                primary: 'primary',
                secondary: 'secondary',
                accent: 'accent',
                socialLinks: 'Social-Links',
                platform: 'Plattform',
                url: 'URL',
                twitter: 'Twitter',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                languages: 'Sprachen',
                language: 'Sprache',
                english: 'Englisch',
                italian: 'Italienisch',
                german: 'Deutsch',
                skills: 'Faehigkeiten',
                skill: 'Faehigkeit',
                javascript: 'JavaScript',
                typescript: 'TypeScript',
                react: 'React',
                pipelineSteps: 'Pipeline-Schritte',
                stepName: 'Schrittname',
                command: 'Befehl',
            },
            propsDocs: {
                title: 'Props',
                items: {
                    name: { description: 'Name des Array-Felds im Form-Record.' },
                    children: { description: 'Felder, die fuer jede wiederholte Zeile geklont werden. Funktion uebergeben fuer (record, records, index).' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    onAdd: { description: 'Wird nach dem Hinzufuegen eines Elements aufgerufen.' },
                    onRemove: { description: 'Wird nach dem Entfernen eines Elements aufgerufen.' },
                    className: { description: 'CSS-Klassen auf dem Root-Wrapper.' },
                    layout: { description: 'horizontal — nummerierte Karte pro Element; inline — kompakte Zeile pro Element.' },
                    minItems: { description: 'Minimale Anzahl von Elementen — Entfernen-Button fuer erste N Elemente ausgeblendet.' },
                    maxItems: { description: 'Maximale Anzahl von Elementen — Hinzufuegen-Button ausgeblendet bei Limit.' },
                    label: { description: 'Abschnittslabel ueber der Liste; Hinzufuegen-Button wird inline platziert.' },
                    readOnly: { description: 'Blendet Hinzufuegen- und Entfernen-Aktionen aus.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
