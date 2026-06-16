import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        checklist: {
            page: {
                title: 'Checklist',
                description: 'Lista verticale di checkbox per multi-selezione. I valori selezionati vengono salvati come array nel record del form.',
            },
            sections: {
                basic: {
                    title: 'Checklist base',
                    description: 'Renderizza una checkbox per ogni opzione. I valori pre-selezionati arrivano dai defaultValues del Form.',
                },
                permissions: {
                    title: 'Checklist permessi',
                    description: 'Pattern comune per configurazioni di ruoli e permessi.',
                },
                requiredDisabled: {
                    title: 'Required e disabled',
                },
            },
            labels: {
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                read: 'Read',
                write: 'Write',
                delete: 'Delete',
                admin: 'Admin',
                technologies: 'Tecnologie',
                selectTechnologies: 'Seleziona tecnologie',
                permissions: 'Permessi',
                required: 'Obbligatorio',
                disabled: 'Disabilitato',
            },
            propsDocs: {
                title: 'Props Checklist',
                items: {
                    name: { description: 'Nome campo usato come chiave del form e salva i valori selezionati come array.' },
                    label: { description: 'Etichetta gruppo sopra le checkbox.' },
                    title: { description: 'Attributo title nativo su ogni checkbox.' },
                    options: { description: 'Opzioni statiche delle checkbox.' },
                    optionsSource: { description: 'Percorso DataProvider usato per recuperare le opzioni checkbox.', help: 'Questo playground usa un MockDataProvider. Modifica i record sotto per cambiare le opzioni restituite.' },
                    required: { description: 'Segna il campo come obbligatorio.' },
                    disabled: { description: 'Disabilita tutte le checkbox.' },
                    readOnlyAfterSet: { description: 'Il campo diventa in sola lettura dopo che e stato impostato un valore.' },
                    defaultValue: { description: 'Valori iniziali selezionati.' },
                    feedback: { description: 'Feedback di validazione mostrato sotto la lista.' },
                    validator: { description: 'Funzione di validazione custom. Restituisce un errore per bloccare il submit.' },
                    order: { description: 'Ordinamento delle opzioni. Di default label crescente.' },
                    before: { description: 'Contenuto renderizzato prima della checklist dentro un input group.' },
                    after: { description: 'Contenuto renderizzato dopo la checklist dentro un input group.' },
                    onChange: { description: 'Handler custom di change chiamato dal contesto Form.' },
                    itemClassName: { description: 'Classi CSS applicate al wrapper di ogni checkbox.' },
                    className: { description: 'Classi CSS sulla root della checklist.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
                },
            },
            playground: {
                title: 'Checklist',
            },
        },
    },
});
