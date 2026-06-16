import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridPreview: {
            page: {
                title: 'Grid-Vorschauarbeitsbereich',
                description: 'Versteckte Begleitseite fur benutzerdefinierte Grid-Aktionen. Aktuell zeigt sie den aktiven Datensatz in der Vorschau und bietet Exportformate an, spater kann sie auch fur Form-Vorschauflusse wiederverwendet werden.',
            },
            banner: {
                currentView: 'Aktuelle Ansicht',
                exportDescription: 'Wahle ein Exportformat fur den aktuellen Datensatz oder fur den gesamten Mock-Datensatz.',
                previewDescription: 'Prufe den ausgewahlten Datensatz und nutze diese Seite als allgemeine Vorschauflache wieder.',
                allRecords: 'Alle Datensatze',
                recordPrefix: 'Datensatz',
            },
            sections: {
                datasetPreview: {
                    title: 'Datensatzvorschau',
                    selectedRecordDescription: 'Dieser Datensatz kam uber eine benutzerdefinierte Grid-Aktion herein und kann fur Export oder zukunftige Form-Vorschauflusse wiederverwendet werden.',
                    emptyDescription: 'Es wurde kein bestimmter Datensatz ubergeben, daher zeigt die Seite die Vorschau auf Datensatzebene.',
                },
                exportOptions: {
                    title: 'Exportoptionen',
                    description: 'Dies ist bewusst ein kleiner Aktions-Hub. Grid, Form und andere Vorschauen konnen hierher verweisen, wenn Benutzer zuerst ein Exportformat auswahlen sollen, statt sofort herunterzuladen.',
                },
            },
            emptyState: {
                singleRecordHint: 'Offne diese Seite uber eine datensatzbezogene Grid-Aktion, um die Vorschau mit genau einem Datensatz vorzufullen. Die Exportwerkzeuge funktionieren weiterhin fur den gesamten Mock-Datensatz.',
            },
            actions: {
                exportCsv: 'CSV exportieren',
                exportJson: 'JSON exportieren',
                saveAsPdf: 'Als PDF speichern',
                copyJson: 'JSON kopieren',
                jsonCopied: 'JSON kopiert',
                copyEmails: 'E-Mails kopieren',
                emailsCopied: 'E-Mails kopiert',
            },
            hints: {
                futureReuse: 'Hinweis: Der Fokus dieser Seite liegt derzeit auf Export und Vorschau. Spater konnen wir dasselbe Layout fur Form-Vorschauen, Drucklayouts und datensatzbezogene Review-Flows wiederverwenden, ohne den Vertrag der Grid-Aktion erneut zu andern.',
            },
        },
    },
});
