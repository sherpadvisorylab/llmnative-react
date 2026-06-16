import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        autocomplete: {
            page: {
                title: 'Autocomplete',
                description: 'Input multi-valore con suggerimenti type-ahead. Salva i valori selezionati come array nel record del form.',
            },
            sections: {
                basic: {
                    title: 'Autocomplete base',
                    description: 'Digita per filtrare i suggerimenti. Gli elementi selezionati compaiono come tag rimovibili.',
                },
                defaultValues: {
                    title: 'Con valori iniziali e limite massimo',
                    description: 'Precompila con valori esistenti. max=3 impedisce di selezionare piu di 3 elementi.',
                },
                tagInput: {
                    title: 'Input tag',
                    description: 'Funziona bene anche per tag liberi, non solo per persone. Qualsiasi array di opzioni va bene.',
                },
                creatable: {
                    title: 'Creatable - input libero con persistenza',
                    description: 'Abilita creatable per permettere valori non presenti in lista. Premi Invio per confermare. Usa onCreate per persistere la nuova opzione.',
                },
                dataProviderBacked: {
                    title: 'Collegato a DataProvider',
                    description: 'Passa optionsSource invece di options per caricare i suggerimenti dal DataProvider attivo.',
                },
            },
            labels: {
                aliceJohnson: 'Alice Johnson',
                bobMartinez: 'Bob Martinez',
                carlaRossi: 'Carla Rossi',
                davidKim: 'David Kim',
                evaMuller: 'Eva Muller',
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                graphQl: 'GraphQL',
                users: 'Utenti',
                searchUsers: 'Cerca utenti',
                typeName: 'Digita un nome...',
                assignees: 'Assegnatari',
                assigneesMaxThree: 'Assegnatari (max 3)',
                technologies: 'Tecnologie',
                addTag: 'Aggiungi un tag...',
                selectOrTypeTag: 'Seleziona o scrivi un nuovo tag...',
                persistedTags: 'Tag persistiti',
            },
            propsDocs: {
                title: 'Props Autocomplete',
                items: {
                    name: { description: 'Nome campo usato come chiave del form.' },
                    label: { description: 'Etichetta sopra l input.' },
                    title: { description: 'Attributo title nativo sull input testo.' },
                    options: { description: 'Opzioni statiche per i suggerimenti.' },
                    optionsSource: { description: 'Percorso DataProvider usato per recuperare i suggerimenti.', help: 'Questo playground usa un MockDataProvider. Modifica i record sotto per cambiare i suggerimenti restituiti.' },
                    placeholder: { description: 'Testo placeholder dell input.' },
                    minItems: { description: 'Numero minimo di elementi selezionati.' },
                    maxItems: { description: 'Numero massimo di elementi selezionati.' },
                    creatable: { description: 'Permette di digitare valori liberi non presenti in lista. Premi Invio per confermare.' },
                    onCreate: { description: 'Chiamato quando un nuovo valore libero viene confermato. Usalo per persistere la nuova opzione.' },
                    required: { description: 'Segna il campo come obbligatorio.' },
                    disabled: { description: 'Disabilita il campo.' },
                    readOnlyAfterSet: { description: 'Il campo diventa in sola lettura dopo che e stato impostato un valore.' },
                    defaultValue: { description: 'Valori iniziali selezionati.' },
                    feedback: { description: 'Feedback di validazione mostrato sotto il campo.' },
                    validator: { description: 'Funzione di validazione custom. Restituisce un errore per bloccare il submit.' },
                    onChange: { description: 'Handler custom di change chiamato dal contesto Form.' },
                    order: { description: 'Ordinamento delle opzioni. Di default label crescente.' },
                    before: { description: 'Contenuto renderizzato prima dell autocomplete dentro un input group.' },
                    after: { description: 'Contenuto renderizzato dopo l autocomplete dentro un input group.' },
                    className: { description: 'Classi CSS sull elemento input.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
                },
            },
            playground: {
                title: 'Autocomplete',
            },
        },
    },
});
