import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        select: {
            page: {
                title: 'Select',
                description: 'Select dropdown nativo. Le opzioni possono essere statiche o caricate da un DataProvider.',
            },
            sections: {
                basicDropdown: {
                    title: 'Dropdown base',
                    description: 'Array statico di opzioni, il caso d uso piu semplice.',
                },
                requiredSelect: {
                    title: 'Select obbligatorio',
                    description: 'Usa required quando il campo deve essere scelto prima del submit del form.',
                },
                noPlaceholderOption: {
                    title: 'Senza opzione placeholder',
                    description: 'Imposta placeholderOption a null per nascondere la riga vuota. Quando non c e un valore, Select sceglie automaticamente la prima opzione disponibile.',
                },
                readOnlyAfterSet: {
                    title: 'Sola lettura dopo il primo valore',
                    description: 'Usa readOnlyAfterSet quando la scelta deve bloccarsi dopo la prima selezione. Se il campo ha gia un valore, il select viene renderizzato come disabilitato.',
                },
                dataProviderBacked: {
                    title: 'Collegato a DataProvider',
                    description: 'Passa optionsSource invece di options per recuperare le opzioni dal DataProvider registrato.',
                },
            },
            labels: {
                admin: 'Admin',
                editor: 'Editor',
                viewer: 'Viewer',
                italy: 'Italia',
                germany: 'Germania',
                france: 'Francia',
                spain: 'Spagna',
                unitedKingdom: 'Regno Unito',
                unitedStates: 'Stati Uniti',
                category: 'Categoria',
                chooseCategory: 'Scegli una categoria',
                role: 'Ruolo',
                country: 'Paese',
                selectPlaceholder: 'Seleziona...',
                chooseRolePlaceholder: 'Scegli un ruolo',
                sales: 'Vendite',
                operations: 'Operations',
                support: 'Supporto',
                draft: 'bozza',
                review: 'review',
                published: 'pubblicato',
            },
            propsDocs: {
                title: 'Props Select',
                items: {
                    name: { description: 'Nome campo usato come chiave del form.' },
                    label: { description: 'Etichetta mostrata sopra il select.' },
                    title: { description: 'Attributo title nativo sull elemento select.' },
                    options: { description: 'Array statico di opzioni.', help: 'Supporta array di option, stringhe o numeri.' },
                    optionsSource: { description: 'Percorso DataProvider usato per recuperare le opzioni.', help: 'Il playground usa un MockDataProvider. Modifica i record sotto per cambiare le opzioni restituite.' },
                    placeholderOption: { description: 'Opzione placeholder mostrata quando nulla e selezionato. Imposta null per nasconderla.' },
                    required: { description: 'Segna il campo come obbligatorio.' },
                    disabled: { description: 'Disabilita il select.' },
                    readOnlyAfterSet: { description: 'Il campo diventa in sola lettura dopo che e stato impostato un valore.' },
                    defaultValue: { description: 'Valore selezionato iniziale.' },
                    feedback: { description: 'Feedback di validazione mostrato sotto il campo.' },
                    validator: { description: 'Funzione di validazione custom. Restituisce un errore per bloccare il submit.' },
                    order: { description: 'Ordinamento delle opzioni. Di default label crescente.' },
                    before: { description: 'Contenuto renderizzato prima del select dentro un input group.' },
                    after: { description: 'Contenuto renderizzato dopo il select dentro un input group.' },
                    onChange: { description: 'Handler custom di change chiamato dal contesto Form.' },
                    className: { description: 'Classi CSS sull elemento select.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
                },
            },
            playground: {
                title: 'Select',
            },
        },
    },
});
