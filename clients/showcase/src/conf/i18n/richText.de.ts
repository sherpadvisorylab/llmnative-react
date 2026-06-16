import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        richText: {
            page: {
                title: 'RichText',
                description: 'WYSIWYG-Rich-Text-Editor, der mit dem Form-Kontext integriert ist. Lädt TipTap lazy nur bei Montage. Unterstützt feste und schwebende Symbolleisten, Tabellen, Bild-/Dokumenten-Upload, Quellcode-Modus und eine Statusleiste.',
            },
            sections: {
                basicUsage: { title: 'Grundlegende Verwendung', description: 'RichText in einem Form wie jedes andere Feld verwenden. Der Wert wird standardmäßig als HTML gespeichert.' },
                toolbarModes: { title: 'Symbolleisten-Modi', description: '"fixed" zeigt eine feste Symbolleiste über dem Editor. "floating" zeigt eine Bubble-Symbolleiste bei Textauswahl. false versteckt die Symbolleiste.' },
                customCommands: { title: 'Benutzerdefinierte Symbolleistenbefehle', description: 'toolbarCommands übergeben, um Schaltflächen auszuwählen. "|" als visuellen Trenner verwenden.' },
                tableSupport: { title: 'Tabellenunterstützung', description: '"table" zu toolbarCommands hinzufügen, um den Tabelleninsertierungsknopf zu aktivieren.' },
                sourceCode: { title: 'Quellcode-Modus', description: '"sourceCode" zu toolbarCommands hinzufügen, um zwischen WYSIWYG und rohem HTML zu wechseln.' },
                statusBar: { title: 'Statusleiste', description: 'statusBar={true} um die Standard-Statusleiste zu zeigen. Ein StatusBarConfig-Objekt für detaillierte Kontrolle übergeben.' },
                outputFormats: { title: 'Ausgabeformate', description: '"html" speichert HTML. "json" speichert das TipTap-JSON-Dokument. "text" speichert nur Klartext.' },
                disabledState: { title: 'Deaktivierter Zustand', description: 'Die disabled-Prop macht den gesamten Editor schreibgeschützt.' },
            },
            labels: {
                articleBody: 'Artikelinhalt',
                description: 'Beschreibung',
                comment: 'Kommentar',
                notes: 'Notizen',
                content: 'Inhalt',
                startTyping: 'Tippen Sie hier...',
            },
            propsDocs: {
                title: 'RichText-Eigenschaften',
                items: {
                    name: { description: 'Feldname als Formularschlüssel.' },
                    label: { description: 'Beschriftung über dem Editor.' },
                    required: { description: 'Markiert das Feld als erforderlich.' },
                    placeholder: { description: 'Platzhaltertext im leeren Editor.' },
                    disabled: { description: 'Macht den Editor schreibgeschützt.' },
                    toolbar: { description: 'Symbolleisten-Position: "fixed", "floating" oder false.' },
                    toolbarCommands: { description: 'Geordnete Liste der Symbolleistenbefehle.' },
                    outputFormat: { description: 'Speicherformat: "html", "json" oder "text".' },
                    statusBar: { description: 'Statusleiste aktivieren.' },
                    minHeight: { description: 'Mindesthöhe des Editors in Pixeln.' },
                    maxHeight: { description: 'Maximale Höhe in Pixeln.' },
                    uploadPath: { description: 'StorageProvider-Pfad für Upload-Befehle.' },
                    feedback: { description: 'Hilfstext unter dem Editor.' },
                    defaultValue: { description: 'Anfangswert außerhalb des Form-Kontexts.' },
                    validator: { description: 'Benutzerdefinierte Validierungsfunktion.' },
                    id: { description: 'Explizite ID für das Editor-Element.' },
                    labelClassName: { description: 'CSS-Klassen für das Label-Element.' },
                    className: { description: 'CSS-Klassen für den Editor-Container.' },
                    wrapperClassName: { description: 'CSS-Klassen für den äußeren Wrapper.' },
                    before: { description: 'Inhalt vor dem Editor-Wrapper.' },
                    after: { description: 'Inhalt nach dem Editor-Wrapper.' },
                    onChange: { description: 'Benutzerdefinierter Änderungs-Handler.' },
                },
            },
            playground: { title: 'RichText' },
        },
    },
});
