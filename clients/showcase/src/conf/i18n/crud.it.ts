import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        crud: {
            page: { title: 'Tabella CRUD', description: 'Create/Read/Update/Delete completo con Grid + Form modale. Basato su MockDataProvider — nessun backend richiesto.' },
            sections: {
                data: { title: 'Dati', description: "L'esempio usa un array statico di prodotti in un MockDataProvider. In produzione basta cambiare il provider con Firebase o Supabase — nessuna modifica all'interfaccia." },
                providerSetup: { title: 'Configurazione provider', description: 'Avvolgi i componenti in un DataProvider context con il mock provider. Lo stesso pattern funziona con Firebase o Supabase.' },
                fullCrud: { title: 'CRUD completo', description: 'Colonne ordinabili, paginazione, ricerca inline e azioni add/edit/delete tramite form modale. Prova ad aggiungere o modificare un prodotto.' },
            },
        },
    },
});
