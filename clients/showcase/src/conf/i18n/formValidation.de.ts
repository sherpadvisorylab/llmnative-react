import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        formValidation: {
            page: { title: 'Form — Validierung', description: 'Das Form-Widget sammelt alle ungueltigen Felder in einem einzigen Durchlauf, bevor der Submit blockiert wird. Pflichtfelder und benutzerdefinierte Validatoren werden unterstuetzt. Fehler erscheinen inline unter jedem Feld; sie verschwinden, sobald der Benutzer zu tippen beginnt.' },
            sections: {
                createMode: { title: 'Erstellmodus — Pflichtfelder und Validatoren', description: 'Klicke auf Speichern ohne etwas auszufuellen: Alle Pflichtfelder werden gleichzeitig hervorgehoben. Der Footer zeigt eine Warnmeldung neben dem Speichern-Button — sie bleibt, bis die Fehler behoben und erneut gesendet wurden.' },
                editMode: { title: 'Bearbeitungsmodus — Speichern und Loeschen', description: 'Gib defaultValues mit einem _key-Feld an, um den Bearbeitungsmodus zu signalisieren. Das Formular erkennt _key in defaultValues und setzt isNewRecord = false, wodurch sowohl Speichern- als auch Loeschen-Button angezeigt werden.' },
                longForm: { title: 'Langes Formular — Scrollen zum ersten Fehler', description: 'Wenn ein Formular hoeher als der Viewport ist, scrollt es automatisch zum ersten ungueltigen Feld und fokussiert es nach einem fehlgeschlagenen Submit. Scrolle ans Ende und klicke Speichern — die Seite springt zrueck zum ersten fehlenden Feld.' },
                longFormHowToTry: 'So testest du es: Scrolle ueber alle Felder zum Speichern-Button und klicke ihn. Die Seite springt zrueck zum ersten ungueltigen Feld.',
                insideModal: { title: 'Formular im Modal', description: 'Ein validiertes Formular kann in einem Modal an jeder Position leben. Der Speichern-Button des Modals kann einen gemeinsamen FormController aufrufen: Die Validierung laeuft, Fehler erscheinen inline, und das Modal schliesst nur, wenn alle Felder gueltig sind.' },
            },
        },
    },
});
