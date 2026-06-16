import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadDocument: {
            page: {
                title: 'UploadDocument',
                description: 'Dokumenten-Upload-Feld mit Drag-and-drop, Inline-Fortschritt, entfernbaren Zeilen und optionaler Bearbeitung des Dateinamens. Der Form-Datensatz speichert ein Array von Dateideskriptoren.',
            },
            sections: {
                basicUpload: {
                    title: 'Einfacher Dokument-Upload',
                    description: 'Einzeldatei-Upload mit Drag-and-drop. Das Feld liest die gewahlte Datei lokal ein, zeigt den Fortschritt wahrend der Umwandlung und speichert danach den hochgeladenen Eintrag im Form-Datensatz.',
                },
                multipleFiles: {
                    title: 'Mehrere Dateien',
                    description: 'Aktiviere multiple, um mehrere Dateien im selben Feld zu halten. Jede hochgeladene Datei wird zu einer Tabellenzeile, und die Inline-Upload-Aktion bleibt verfugbar, bis max erreicht ist.',
                },
                editableFileNames: {
                    title: 'Bearbeitbare Dateinamen',
                    description: 'Setze editable, um jede Zeile anklickbar zu machen. Ein Klick auf eine abgeschlossene Zeile offnet den integrierten Dateinamen-Editor und speichert den neuen fileName im hinterlegten Dateieintrag.',
                },
                acceptFilter: {
                    title: 'Accept-Filter',
                    description: 'Beschranke den nativen Dateidialog auf bestimmte Erweiterungen. Dieselbe accept-Zeichenfolge wird auch in der leeren Drop-Zone als visueller Hinweis auf erlaubte Formate angezeigt.',
                },
                requiredField: {
                    title: 'Pflichtfeld',
                    description: 'Fuge required hinzu, um Formularvalidierung anzuzeigen, wenn das Feld leer ist. Die Validierungsmeldung wird unter dem Upload-Bereich uber den Standard-Fehlerslot des Formularfelds gerendert.',
                },
            },
            labels: {
                report: 'Bericht',
                attachmentsMax: 'Anhange (max. 5)',
                deliverables: 'Lieferobjekte',
                csvExcelOnly: 'Nur CSV / Excel',
                contractRequired: 'Vertrag (erforderlich)',
            },
            propsDocs: {
                title: 'UploadDocument-Props',
                items: {
                    name: { description: 'Feldname, der an den Form-Datensatz gebunden ist' },
                    label: { description: 'Label uber der Drop-Zone oder Dateitabelle' },
                    multiple: { description: 'Erlaubt Auswahl und Speicherung von mehr als einer Datei', default: 'false' },
                    editable: { description: 'Offnet den Dateinamen-Editor, wenn auf eine Tabellenzeile geklickt wird', default: 'false' },
                    accept: { description: 'Nativer accept-Filter des Datei-Inputs, sichtbar im Picker und als Hinweis in der Drop-Zone', default: '".pdf,.doc,.docx,.txt,.iso"' },
                    max: { description: 'Maximale Anzahl an Dateien, die im Feld behalten werden konnen', default: '100' },
                    required: { description: 'Markiert den versteckten Datei-Input als erforderlich und zeigt Validierungsfeedback, wenn leer', default: 'false' },
                    onChange: { description: 'Wird aufgerufen, wenn sich das im Form-Datensatz gespeicherte Datearray andert' },
                    before: { description: 'Inhalt vor dem Upload-Feld innerhalb des ausseren Wrappers' },
                    after: { description: 'Inhalt nach dem Upload-Feld innerhalb des ausseren Wrappers' },
                    className: { description: 'CSS-Klassen fur den inneren Feld-Container' },
                    wrapperClassName: { description: 'CSS-Klassen fur das aussere Wrapper-Element' },
                },
            },
            playground: {
                title: 'UploadDocument-Playground',
                defaultLabel: 'Anhange',
            },
        },
    },
});
