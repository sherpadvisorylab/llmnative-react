import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        examplesOverview: {
            page: {
                title: 'Esempi',
                description: 'Pattern reali che mostrano come comporre insieme componenti, widget e provider.',
            },
            labels: {
                arrow: '->',
            },
            items: {
                crudTable: {
                    title: 'Tabella CRUD',
                    description: 'Flusso completo create/read/update/delete con Grid + Form in modal. Aggiornamenti realtime tramite Firebase.',
                },
                dashboard: {
                    title: 'Dashboard',
                    description: 'Card metriche, grafici e una tabella attivita recenti, tutto da un unico DataProvider.',
                },
                nestedForm: {
                    title: 'Form annidata',
                    description: 'dot notation per oggetti profondi, notazione indice per array e Repeat per liste dinamiche.',
                },
                fileManager: {
                    title: 'File manager',
                    description: 'Carica immagini e documenti su Firebase Storage e navigali con una Grid in stile gallery.',
                },
                googleSignIn: {
                    title: 'Accesso Google',
                    description: 'Login OAuth2 con Google, route protette e visualizzazione del profilo utente.',
                },
            },
        },
    },
});
