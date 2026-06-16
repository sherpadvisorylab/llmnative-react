import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        form: {
            page: { title: 'Form widget', description: 'Vollstaendiges CRUD-Formular: Laedt einen Datensatz vom DataProvider, validiert, speichert und loescht optional. Gib Felder als Children — das Formular verbindet alles automatisch ueber den React Context.' },
            sections: {
                newRecord: { title: 'Neuer Datensatz (keyGenerator)', description: 'Gib path (Collection) + keyGenerator an, um einen neuen Datensatz zu erstellen. Es wird kein DB-Read durchgefuehrt. Save ruft set() unter path/generiertemKey auf.' },
                editExisting: { title: 'Vorhandenen Datensatz bearbeiten', description: 'Gib den vollstaendigen Record-Pfad inkl. Schluessel ohne defaultValues an. Das Formular liest den Datensatz beim Mounten, fuellt die Felder vor und speichert zurueck auf denselben Pfad.' },
                lifecycleHooks: { title: 'Lifecycle-Hooks', description: 'onLoad transformiert Daten nach dem Lesen. onSave transformiert vor dem Schreiben. onComplete wird nach jeder Aktion ausgefuehrt.' },
                lifecycleHooksNote: 'Code-Beispiel — Hooks sind visuell nicht von einem Standard-Formular zu unterscheiden.',
                nestedObjects: { title: 'Verschachtelte Objekte und Arrays', description: 'Punktnotation bildet auf verschachtelte Objektschluessel ab. Array-Index-Notation bildet auf Array-Elemente ab.' },
            },
        },
    },
});
