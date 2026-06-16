import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loadingButton: {
            page: { title: 'LoadingButton', description: 'Asynchroner Button, der sich selbst deaktiviert, waehrend Arbeit aussteht. Unterstuetzt Live-Label-Updates waehrend der Ausfuehrung ueber setMessage.' },
            sections: {
                asyncSave: { title: 'Asynchrones Speichern', description: 'Uebergib ein asynchrones onClick. Der Button zeigt einen Spinner und blockiert erneute Klicks, bis das Promise aufgeloest ist.' },
                customLabel: { title: 'Benutzerdefiniertes Lade-Label', description: 'loadingLabel ersetzt das Standard-Label "Save…", waehrend der Spinner aktiv ist.' },
                streaming: { title: 'Live-Label ueber setMessage', description: 'Das zweite Argument von onClick ist setMessage. Rufe es waehrend der asynchronen Arbeit beliebig auf, um das Lade-Label live zu aktualisieren. Nuetzlich fuer mehrstufige Operationen.' },
                disabled: { title: 'Deaktivierter Zustand', description: 'disabled haelt den Button dauerhaft inaktiv, unabhaengig vom Ladezyklus.' },
                controlled: { title: 'Kontrolliertes Laden (loading)', description: 'loading erlaubt es einer uebergeordneten Komponente, den Ladezustand extern zu steuern, was nuetzlich ist, wenn der Button Teil eines groesseren Formular-Submit-Flows ist.' },
                variants: { description: 'LoadingButton unterstuetzt dieselben Variant-Tokens wie ActionButton.' },
            },
        },
    },
});
