import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        examplesOverview: {
            page: {
                title: 'Beispiele',
                description: 'Praxisnahe Muster, die zeigen, wie Komponenten, Widgets und Provider zusammenspielen.',
            },
            labels: {
                arrow: '->',
            },
            items: {
                crudTable: {
                    title: 'CRUD-Tabelle',
                    description: 'Vollstaendiger Create/Read/Update/Delete-Ablauf mit Grid und modalem Form. Realtime-Updates ueber Firebase.',
                },
                dashboard: {
                    title: 'Dashboard',
                    description: 'Metrik-Karten, Charts und eine Tabelle mit letzter Aktivitaet, alles aus einem einzigen DataProvider.',
                },
                nestedForm: {
                    title: 'Verschachteltes Formular',
                    description: 'dot notation fuer tiefe Objekte, Array-Index-Notation und Repeat fuer dynamische Listen.',
                },
                fileManager: {
                    title: 'Dateimanager',
                    description: 'Bilder und Dokumente in Firebase Storage hochladen und ueber ein galerieartiges Grid durchsuchen.',
                },
                googleSignIn: {
                    title: 'Google-Anmeldung',
                    description: 'OAuth2-Anmeldung mit Google, geschuetzte Routen und Anzeige des Benutzerprofils.',
                },
            },
        },
    },
});
