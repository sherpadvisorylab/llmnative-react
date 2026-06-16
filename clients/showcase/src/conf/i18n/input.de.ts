import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        input: {
            page: {
                title: 'Input',
                description: 'Varianten fuer Text, Zahl, E-Mail, Passwort, Farbe, Datum, Datum/Uhrzeit, Woche, Monat und Textarea. Alle Inputs sind Form-bewusst und integrieren sich automatisch mit Form.',
            },
            sections: {
                textVariants: {
                    title: 'Textvarianten',
                    description: 'Die haeufigsten Input-Typen. Alle unterstuetzen Label, required, Placeholder und disabled.',
                },
                numberRange: { title: 'Zahl und Bereich' },
                dateTime: { title: 'Datum und Uhrzeit' },
                colorPicker: { title: 'Farbwaehler' },
                textarea: {
                    title: 'Textarea',
                    description: 'Mehrzeiliger Text mit konfigurierbarer Zeilenanzahl.',
                },
                checkbox: { title: 'Checkbox' },
                disabledReadOnlyAfterSet: {
                    title: 'Disabled und readOnlyAfterSet',
                    description: 'readOnlyAfterSet deaktiviert das Feld, sobald ein Wert gesetzt wurde.',
                },
            },
            labels: {
                fieldLabel: 'Feldbezeichnung',
                typeSomething: 'Etwas eingeben...',
                firstName: 'Vorname',
                email: 'E-Mail',
                password: 'Passwort',
                website: 'Webseite',
                age: 'Alter',
                score: 'Punktzahl (0-100)',
                birthday: 'Geburtstag',
                startTime: 'Startzeit',
                appointment: 'Termin',
                week: 'Woche',
                month: 'Monat',
                brandColor: 'Markenfarbe',
                bio: 'Bio',
                tellUsAboutYourself: 'Erzaehle uns etwas ueber dich...',
                acceptTerms: 'Ich akzeptiere die Geschaeftsbedingungen',
                recordId: 'Datensatz-ID',
                slug: 'Slug',
            },
            propsDocs: {
                title: 'Input-Props',
                items: {
                    name: { description: 'Feldname als Form-Key und Dot-Notation-Pfad.' },
                    label: { description: 'Label oberhalb des Inputs.' },
                    type: { description: 'HTML-Input-Typ.' },
                    placeholder: { description: 'Placeholder-Text.' },
                    required: { description: 'Markiert das Feld als erforderlich und zeigt ein Sternchen im Label.' },
                    disabled: { description: 'Macht das Feld schreibgeschuetzt.' },
                    readOnlyAfterSet: { description: 'Das Feld wird schreibgeschuetzt, sobald ein Wert gesetzt wurde.' },
                    defaultValue: { description: 'Initialwert, wenn das Feld nicht von Form verwaltet wird.' },
                    min: { description: 'Mindestwert fuer Number- und Range-Inputs.' },
                    max: { description: 'Hoechstwert fuer Number- und Range-Inputs.' },
                    step: { description: 'Schrittweite fuer Number- und Range-Inputs.' },
                    feedback: { description: 'Validierungsfeedback unter dem Feld.' },
                    id: { description: 'Explizite ID fuer das Input-Element. Wird sonst automatisch erzeugt.' },
                    labelClassName: { description: 'CSS-Klassen fuer das Label-Element.' },
                    validator: { description: 'Benutzerdefinierte Validierungsfunktion. Gibt eine Fehlermeldung zurueck, um das Senden zu blockieren.' },
                    className: { description: 'CSS-Klassen am Input-Element.' },
                    wrapperClassName: { description: 'CSS-Klassen am aeusseren Wrapper.' },
                },
            },
            playground: {
                title: 'Input',
            },
        },
    },
});
