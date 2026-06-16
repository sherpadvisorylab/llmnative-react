import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        select: {
            page: {
                title: 'Select',
                description: 'Nativer Dropdown-Select. Optionen koennen statisch sein oder aus einem DataProvider geladen werden.',
            },
            sections: {
                basicDropdown: {
                    title: 'Einfaches Dropdown',
                    description: 'Statisches Options-Array, der einfachste Anwendungsfall.',
                },
                requiredSelect: {
                    title: 'Pflichtauswahl',
                    description: 'Verwende required, wenn das Feld vor dem Absenden ausgewaehlt werden muss.',
                },
                noPlaceholderOption: {
                    title: 'Ohne Placeholder-Option',
                    description: 'Setze placeholderOption auf null, um die leere Zeile auszublenden. Wenn kein Wert gesetzt ist, waehlt Select automatisch die erste verfuegbare Option.',
                },
                readOnlyAfterSet: {
                    title: 'Schreibgeschuetzt nach Setzen',
                    description: 'Verwende readOnlyAfterSet, wenn die Auswahl nach der ersten Selektion gesperrt werden soll. Hat das Feld bereits einen Wert, wird der Select deaktiviert gerendert.',
                },
                dataProviderBacked: {
                    title: 'Mit DataProvider',
                    description: 'Uebergib optionsSource statt options, um Optionen aus dem registrierten DataProvider zu laden.',
                },
            },
            labels: {
                admin: 'Admin',
                editor: 'Editor',
                viewer: 'Viewer',
                italy: 'Italien',
                germany: 'Deutschland',
                france: 'Frankreich',
                spain: 'Spanien',
                unitedKingdom: 'Vereinigtes Koenigreich',
                unitedStates: 'Vereinigte Staaten',
                category: 'Kategorie',
                chooseCategory: 'Kategorie waehlen',
                role: 'Rolle',
                country: 'Land',
                selectPlaceholder: 'Auswaehlen...',
                chooseRolePlaceholder: 'Rolle waehlen',
                sales: 'Vertrieb',
                operations: 'Betrieb',
                support: 'Support',
                draft: 'entwurf',
                review: 'pruefung',
                published: 'veroeffentlicht',
            },
            propsDocs: {
                title: 'Select-Props',
                items: {
                    name: { description: 'Feldname als Form-Key.' },
                    label: { description: 'Label oberhalb des Selects.' },
                    title: { description: 'Natives title-Attribut auf dem Select-Element.' },
                    options: { description: 'Statisches Options-Array.', help: 'Unterstuetzt Arrays aus Optionen, Strings oder Zahlen.' },
                    optionsSource: { description: 'DataProvider-Pfad zum Laden der Optionen.', help: 'Der Playground verwendet einen MockDataProvider. Bearbeite die Datensaetze unten, um die Optionen zu aendern.' },
                    placeholderOption: { description: 'Placeholder-Option, wenn nichts ausgewaehlt ist. Mit null ausblenden.' },
                    required: { description: 'Markiert das Feld als erforderlich.' },
                    disabled: { description: 'Deaktiviert den Select.' },
                    readOnlyAfterSet: { description: 'Das Feld wird schreibgeschuetzt, sobald ein Wert gesetzt wurde.' },
                    defaultValue: { description: 'Initial ausgewaehlter Wert.' },
                    feedback: { description: 'Validierungsfeedback unter dem Feld.' },
                    validator: { description: 'Benutzerdefinierte Validierung. Gib einen Fehlertext zurueck, um das Senden zu blockieren.' },
                    order: { description: 'Sortierreihenfolge der Optionen. Standard ist Label aufsteigend.' },
                    before: { description: 'Inhalt vor dem Select innerhalb einer Input-Gruppe.' },
                    after: { description: 'Inhalt nach dem Select innerhalb einer Input-Gruppe.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    className: { description: 'CSS-Klassen am Select-Element.' },
                    wrapperClassName: { description: 'CSS-Klassen am aeusseren Wrapper.' },
                },
            },
            playground: {
                title: 'Select',
            },
        },
    },
});
