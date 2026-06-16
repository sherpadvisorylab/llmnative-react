import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalYesNo: {
            page: { title: 'ModalYesNo', description: 'Bestätigungsdialog mit Yes- und No-Buttons. Beide Handler schließen das Modal automatisch nach ihrer Auflösung.' },
            sections: {
                destructiveConfirmation: { title: 'Destruktive Bestätigung', description: 'Verwende ModalYesNo vor irreversiblen Aktionen wie Delete, Reset oder Publish. Yes führt die Aktion aus, No bricht ab. Beide schließen das Modal nach Auflösung des asynchronen Handlers.' },
            },
            demo: {
                defaultTitle: 'Löschen bestätigen',
                defaultBody: 'Möchtest du diesen Datensatz wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
                openButton: 'ModalYesNo öffnen',
                deleteRecordButton: 'Datensatz löschen',
                yesResult: 'Du hast Yes geklickt.',
                noResult: 'Du hast No geklickt.',
                confirmedResult: 'Bestätigt - Datensatz gelöscht.',
                cancelledResult: 'Abgebrochen - nichts wurde gelöscht.',
                destructiveQuestion: 'Möchtest du user_042 wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Bestätigungstext im Body' },
                    title: { description: 'Dialogtitel' },
                    onYes: { description: 'Wird aufgerufen, wenn der Benutzer Yes klickt. Das Modal schließt automatisch nach Auflösung des Handlers.' },
                    onNo: { description: 'Wird aufgerufen, wenn der Benutzer No klickt. Das Modal schließt automatisch nach Auflösung des Handlers.' },
                    onClose: { description: 'Wird aufgerufen, wenn das Modal per X oder Backdrop geschlossen wird' },
                },
            },
        },
    },
});
