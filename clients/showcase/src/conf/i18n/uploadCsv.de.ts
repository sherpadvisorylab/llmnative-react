import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadCsv: {
            page: {
                title: 'UploadCSV',
                description: 'Uploader fur einzelne CSV- oder TSV-Dateien mit Drag-and-drop, PapaParse-Integration und vorschaufreundlicher Parse-Ausgabe uber onDataLoaded.',
            },
            sections: {
                basicUpload: {
                    title: 'Einfacher CSV-Upload',
                    description: 'Ziehe eine CSV- oder TSV-Datei in die Zone oder klicke zum Auswahlen. Nach dem Parsen wechselt die Komponente in einen geladenen Zustand und stellt Zeilen, Header und die ursprungliche Datei uber onDataLoaded bereit.',
                },
                normalizedKeys: {
                    title: 'Normalisierte Schlussel + leere Felder entfernen',
                    description: 'normalizeKeys transformiert Header-Namen, bevor sie in fields und Zeilenobjekten bereitgestellt werden. removeEmptyFields entfernt Eintrage mit leerer Zeichenfolge oder null aus jeder geparsten Zeile.',
                },
                customFieldTransform: {
                    title: 'Benutzerdefinierte Feldtransformation',
                    description: 'Verwende onParseField, um jedes geparste [key, value]-Paar abzufangen. Gib ein angepasstes Paar zuruck, um es zu behalten, oder undefined, um das Feld aus dem finalen Zeilenobjekt zu entfernen.',
                },
                customDelimiter: {
                    title: 'Benutzerdefinierter Trenner',
                    description: 'Ubergib delimiter, wenn die Datei die automatische Erkennung von PapaParse nicht zuverlassig nutzt, zum Beispiel bei semikolon-getrennten Exporten aus Tabellenkalkulationen.',
                },
            },
            labels: {
                emptyState: 'Noch keine Datei geladen.',
                rows: 'Zeilen',
                fields: 'Felder',
                andMoreRows: '...und {count} weitere Zeilen',
                basicLabel: 'CSV ziehen oder klicken zum Hochladen',
                normalizeLabel: 'CSV hochladen, um normalisierte Schlussel zu sehen',
                transformLabel: 'CSV hochladen - Spalten mit _ am Anfang werden verworfen',
                delimiterLabel: 'Semikolon-getrennte CSV hochladen',
            },
            propsDocs: {
                title: 'UploadCSV-Props',
                items: {
                    name: { description: 'Feldname fur das data-name-Attribut des Wrappers' },
                    onDataLoaded: { description: 'Wird nach erfolgreichem Parsen mit geparsten Zeilen, Header-Feldern und der ursprunglichen Datei aufgerufen' },
                    onClear: { description: 'Wird aufgerufen, wenn die geladene Datei aus der Komponenten-UI entfernt wird' },
                    label: { description: 'Label uber der Drop-Zone' },
                    icon: { description: 'Icon-Name innerhalb der Drop-Zone', default: '"upload"' },
                    delimiter: { description: 'Optionaler Trenner fur PapaParse. Wenn weggelassen, erkennt PapaParse ihn automatisch.' },
                    normalizeKeys: { description: 'Normalisiert Header-Namen mit normalizeKey, bevor sie in fields und Zeilenobjekten bereitgestellt werden', default: 'false' },
                    removeEmptyFields: { description: 'Entfernt Zeileneintrage, deren geparster Wert leerer String oder null ist', default: 'false' },
                    onParseField: { description: 'Transformiert oder entfernt jedes [key, value]-Paar wahrend des Parsens. Gib undefined zuruck, um das Feld auszulassen.' },
                    before: { description: 'Inhalt vor dem Uploader innerhalb des ausseren Wrappers' },
                    after: { description: 'Inhalt nach dem Uploader innerhalb des ausseren Wrappers' },
                    className: { description: 'CSS-Klassen fur den inneren Uploader-Container' },
                    wrapperClassName: { description: 'CSS-Klassen fur den ausseren Wrapper' },
                },
            },
            playground: {
                title: 'UploadCSV-Playground',
                defaultLabel: 'CSV ziehen oder klicken zum Hochladen',
            },
        },
    },
});
