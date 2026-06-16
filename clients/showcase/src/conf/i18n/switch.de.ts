import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        switch: {
            page: {
                title: 'Switch',
                description: 'Checkbox im Switch-Stil mit demselben Wertevertrag wie Checkbox.',
            },
            sections: {
                booleanToggle: {
                    title: 'Boolescher Schalter',
                },
            },
            labels: {
                published: 'Veroeffentlicht',
                togglePublishedState: 'Veroeffentlichungsstatus umschalten',
            },
            propsDocs: {
                title: 'Switch-Props',
                items: {
                    name: { description: 'Feldname als Form-Key.' },
                    label: { description: 'Label neben dem Switch.' },
                    title: { description: 'Natives title-Attribut.' },
                    ariaLabel: { description: 'Barrierefreies Label fuer den Switch, wenn kein sichtbares Label vorhanden ist.' },
                    inheritWrapperClassName: { description: 'Wenn false, wird wrapperClassName aus dem uebergeordneten Form-Kontext ignoriert.' },
                    required: { description: 'Markiert das Feld als erforderlich.' },
                    valueChecked: { description: 'Gespeicherter Wert im aktivierten Zustand.' },
                    defaultValue: { description: 'Initialer aktiver Wert.' },
                    before: { description: 'Inhalt vor dem Switch.' },
                    after: { description: 'Inhalt nach dem Switch.' },
                    onChange: { description: 'Benutzerdefinierter Change-Handler aus dem Form-Kontext.' },
                    className: { description: 'CSS-Klassen am Checkbox-Input.' },
                    wrapperClassName: { description: 'CSS-Klassen am Wrapper.' },
                },
            },
            playground: {
                title: 'Switch',
            },
        },
    },
});
