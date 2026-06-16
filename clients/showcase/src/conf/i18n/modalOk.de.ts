import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalOk: {
            page: { title: 'ModalOk', description: 'Informationsdialog mit nur einem Ok-Button. Verwende ihn für schreibgeschützte Statusmeldungen, die nur bestätigt werden müssen.' },
            sections: {
                statusAcknowledgement: { title: 'Statusbestätigung', description: 'ModalOk ist die leichteste Modal-Variante: ein Button, kein Branching. Verwende ihn nach Hintergrundjobs, Imports oder jeder Operation, über die der Benutzer informiert werden soll.' },
            },
            demo: {
                defaultTitle: 'Import abgeschlossen',
                defaultBody: '42 Datensätze wurden erfolgreich importiert.',
                openButton: 'ModalOk öffnen',
                importCsvButton: 'CSV importieren',
                acknowledgementBody: '42 Datensätze wurden erfolgreich importiert. 3 Zeilen wurden wegen Validierungsfehlern übersprungen.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Informationsinhalt im Body' },
                    title: { description: 'Dialogtitel' },
                    onClose: { description: 'Wird aufgerufen, wenn der Benutzer Ok oder den X-Button klickt' },
                },
            },
        },
    },
});
