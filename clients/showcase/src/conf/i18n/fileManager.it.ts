import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        fileManager: {
            page: { title: 'File manager', description: 'Elenco file con GridDB, badge di stato e MockDataProvider — nessun backend richiesto.' },
            sections: {
                seedData: { title: 'Dati iniziali', description: "L'esempio usa un array statico di file con metadati (nome, tipo, dimensione, stato). In produzione questi dati arrivano da Firebase Storage o Supabase Storage." },
                providerSetup: { title: 'Configurazione provider', description: 'Avvolgi i componenti in un DataProvider context con il mock provider. Lo stesso pattern funziona con Firebase Storage o Supabase Storage.' },
                fileGrid: { title: 'Griglia file', description: 'GridDB ordinabile e filtrabile con badge di stato. Azioni add/edit/delete disponibili tramite form modale.' },
            },
        },
    },
});
