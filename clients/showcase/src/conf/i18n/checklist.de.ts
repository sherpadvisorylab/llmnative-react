import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        checklist: {
            page: {
                title: 'Checklist',
                description: 'Vertikale Checkbox-Liste fuer Mehrfachauswahl. Ausgewaehlte Werte werden als Array im Form-Datensatz gespeichert.',
            },
            sections: {
                basic: { title: 'Basis-Checklist', description: 'Rendert fuer jede Option eine Checkbox. Vorausgewaehlte Werte kommen aus den Form-defaultValues.' },
                permissions: { title: 'Berechtigungs-Checklist', description: 'Hauefiges Muster fuer Rollen- und Berechtigungskonfigurationen.' },
                requiredDisabled: { title: 'Required und disabled' },
            },
            labels: {
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                read: 'Lesen',
                write: 'Schreiben',
                delete: 'Loeschen',
                admin: 'Admin',
                technologies: 'Technologien',
                selectTechnologies: 'Technologien waehlen',
                permissions: 'Berechtigungen',
                required: 'Erforderlich',
                disabled: 'Deaktiviert',
            },
            propsDocs: {
                title: 'Checklist-Props',
                items: {
                    name: { description: 'Feldname als Form-Key. Speichert ausgewaehlte Werte als Array.' },
                    label: { description: 'Gruppenlabel oberhalb der Checkboxen.' },
                    title: { description: 'Natives title-Attribut auf jeder Checkbox.' },
                    options: { description: 'Statische Checkbox-Optionen.' },
                    optionsSource: { description: 'DataProvider-Pfad zum Laden der Checkbox-Optionen.', help: 'Dieser Playground verwendet einen MockDataProvider. Bearbeite die Datensaetze unten, um die Optionen zu aendern.' },
                    required: { description: 'Markiert das Feld als erforderlich.' },
                    disabled: { description: 'Deaktiviert alle Checkboxen.' },
                    readOnlyAfterSet: { description: 'Das Feld wird schreibgeschuetzt, sobald ein Wert gesetzt wurde.' },
                    defaultValue: { description: 'Anfangs ausgewaehlte Werte.' },
                    feedback: { description: 'Validierungsfeedback unter der Liste.' },
                    validator: { description: 'Benutzerdefinierte Validierung. Gib einen Fehlertext zurueck, um das Senden zu blockieren.' },
                    order: { description: 'Sortierreihenfolge fuer Optionen. Standard ist Label aufsteigend.' },
                    before: { description: 'Inhalt vor der Checklist innerhalb einer Input-Gruppe.' },
                    after: { description: 'Inhalt nach der Checklist innerhalb einer Input-Gruppe.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    itemClassName: { description: 'CSS-Klassen fuer den Wrapper jeder Checkbox.' },
                    className: { description: 'CSS-Klassen an der Checklist-Root.' },
                    wrapperClassName: { description: 'CSS-Klassen am aeusseren Wrapper.' },
                },
            },
            playground: {
                title: 'Checklist',
            },
        },
    },
});
