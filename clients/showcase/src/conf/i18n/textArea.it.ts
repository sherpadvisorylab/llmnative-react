import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        textArea: {
            page: {
                title: 'TextArea',
                description: 'Campo di testo multilinea controllato e integrato con il contesto Form.',
            },
            sections: {
                basicTextarea: { title: 'Textarea base' },
                autoResize: {
                    title: 'Auto-resize con maxRows',
                    description: 'Imposta maxRows per far crescere la textarea con il contenuto. Quando raggiunge il limite smette di espandersi e mostra una scrollbar.',
                },
                feedbackPlaceholder: { title: 'Con feedback e placeholder' },
                addons: { title: 'Con addon pre/post' },
            },
            labels: {
                notes: 'Note',
                writeShortNote: 'Scrivi una nota breve...',
                initialNote: 'Nota iniziale',
                bio: 'Bio',
                startTyping: 'Inizia a scrivere - la textarea crescera aggiungendo righe...',
                description: 'Descrizione',
                describeIssue: 'Descrivi il problema in dettaglio...',
                beSpecific: 'Sii il piu specifico possibile.',
                signedNote: 'Nota firmata',
                note: 'Nota',
            },
            propsDocs: {
                title: 'Props TextArea',
                items: {
                    name: { description: 'Nome campo usato come chiave del form.' },
                    label: { description: 'Etichetta sopra la textarea.' },
                    placeholder: { description: 'Testo segnaposto.' },
                    required: { description: 'Segna il campo come obbligatorio.' },
                    disabled: { description: 'Disabilita la textarea.' },
                    readOnlyAfterSet: { description: 'La textarea diventa in sola lettura dopo che e stato impostato un valore.' },
                    defaultValue: { description: 'Valore iniziale della textarea fornito fuori dal contesto Form.' },
                    rows: { description: 'Numero fisso di righe visibili. Ignorato se maxRows e impostato e il contenuto e piu corto.' },
                    maxRows: { description: 'Auto-resize fino a questo numero di righe, poi mostra una scrollbar.' },
                    feedback: { description: 'Testo di aiuto o validazione mostrato sotto il campo.' },
                    before: { description: 'Contenuto di input-group renderizzato prima della textarea.' },
                    after: { description: 'Contenuto di input-group renderizzato dopo la textarea.' },
                    id: { description: 'Id esplicito per l elemento textarea. Generato automaticamente se omesso.' },
                    onChange: { description: 'Handler custom di change chiamato dal contesto Form.' },
                    textareaRef: { description: 'Ref inoltrato all elemento textarea sottostante.' },
                    validator: { description: 'Funzione di validazione custom. Restituisce un errore per bloccare il submit.' },
                    className: { description: 'Classi CSS extra applicate all elemento textarea.' },
                    wrapperClassName: { description: 'Classi CSS applicate al wrapper esterno.' },
                    labelClassName: { description: 'Classi CSS applicate all elemento label.' },
                },
            },
            playground: {
                title: 'TextArea',
            },
        },
    },
});
