import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        nestedForm: {
            page: { title: 'Form annidato', description: 'Dot notation profonda, array dinamici e Repeat per liste — tutto basato su MockDataProvider.' },
            sections: {
                seedData: { title: 'Dati iniziali', description: 'Un record contatto con oggetto indirizzo annidato e array dinamico di numeri telefonici.' },
                liveForm: { title: 'Form live', description: "Modifica il record esistente. La dot notation (address.street) salva in oggetti annidati. Repeat gestisce liste dinamiche di numeri. Prova ad aggiungere o rimuovere un numero, poi controlla la struttura salvata." },
            },
        },
    },
});
