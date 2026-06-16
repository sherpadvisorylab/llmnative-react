import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        textArea: {
            page: {
                title: 'TextArea',
                description: 'Kontrolliertes mehrzeiliges Textfeld mit Integration in den Form-Kontext.',
            },
            sections: {
                basicTextarea: { title: 'Basis-Textarea' },
                autoResize: {
                    title: 'Auto-Resize mit maxRows',
                    description: 'Setze maxRows, damit die Textarea mit ihrem Inhalt waechst. Nach Erreichen des Limits stoppt das Wachstum und eine Scrollbar erscheint.',
                },
                feedbackPlaceholder: { title: 'Mit Feedback und Placeholder' },
                addons: { title: 'Mit Addons davor/danach' },
            },
            labels: {
                notes: 'Notizen',
                writeShortNote: 'Schreibe eine kurze Notiz...',
                initialNote: 'Anfangsnotiz',
                bio: 'Bio',
                startTyping: 'Beginne zu tippen - die Textarea waechst mit jeder neuen Zeile...',
                description: 'Beschreibung',
                describeIssue: 'Beschreibe das Problem im Detail...',
                beSpecific: 'Sei so konkret wie moeglich.',
                signedNote: 'Signierte Notiz',
                note: 'Notiz',
            },
            propsDocs: {
                title: 'TextArea-Props',
                items: {
                    name: { description: 'Feldname als Form-Key.' },
                    label: { description: 'Label oberhalb der Textarea.' },
                    placeholder: { description: 'Placeholder-Text.' },
                    required: { description: 'Markiert das Feld als erforderlich.' },
                    disabled: { description: 'Deaktiviert die Textarea.' },
                    readOnlyAfterSet: { description: 'Die Textarea wird schreibgeschuetzt, sobald ein Wert gesetzt wurde.' },
                    defaultValue: { description: 'Initialer Textarea-Wert ausserhalb des Form-Kontexts.' },
                    rows: { description: 'Feste Anzahl sichtbarer Zeilen. Wird ignoriert, wenn maxRows gesetzt ist und der Inhalt kuerzer ist.' },
                    maxRows: { description: 'Automatische Hoehenanpassung bis zu dieser Zeilenzahl, danach erscheint eine Scrollbar.' },
                    feedback: { description: 'Hilfe- oder Validierungstext unter dem Feld.' },
                    before: { description: 'Input-Group-Inhalt vor der Textarea.' },
                    after: { description: 'Input-Group-Inhalt nach der Textarea.' },
                    id: { description: 'Explizite ID fuer das Textarea-Element. Wird sonst automatisch erzeugt.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    textareaRef: { description: 'Ref zum zugrunde liegenden Textarea-Element.' },
                    validator: { description: 'Benutzerdefinierte Validierung. Gib einen Fehlertext zurueck, um das Senden zu blockieren.' },
                    className: { description: 'Zusaetzliche CSS-Klassen fuer das Textarea-Element.' },
                    wrapperClassName: { description: 'CSS-Klassen fuer den aeusseren Wrapper.' },
                    labelClassName: { description: 'CSS-Klassen fuer das Label-Element.' },
                },
            },
            playground: {
                title: 'TextArea',
            },
        },
    },
});
