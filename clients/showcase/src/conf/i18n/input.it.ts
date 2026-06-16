import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        input: {
            page: {
                title: 'Input',
                description: 'Varianti text, number, email, password, color, date, datetime, week, month e textarea. Tutti gli input sono consapevoli del contesto Form e si integrano automaticamente.',
            },
            sections: {
                textVariants: {
                    title: 'Varianti testuali',
                    description: 'I tipi di input piu comuni. Tutti supportano label, required, placeholder e disabled.',
                },
                numberRange: {
                    title: 'Numero e range',
                },
                dateTime: {
                    title: 'Data e ora',
                },
                colorPicker: {
                    title: 'Selettore colore',
                },
                textarea: {
                    title: 'Textarea',
                    description: 'Testo multilinea con righe configurabili.',
                },
                checkbox: {
                    title: 'Checkbox',
                },
                disabledReadOnlyAfterSet: {
                    title: 'Disabled e readOnlyAfterSet',
                    description: 'readOnlyAfterSet disabilita il campo dopo che e stato impostato un valore.',
                },
            },
            labels: {
                fieldLabel: 'Etichetta campo',
                typeSomething: 'Scrivi qualcosa...',
                firstName: 'Nome',
                email: 'Email',
                password: 'Password',
                website: 'Sito web',
                age: 'Eta',
                score: 'Punteggio (0-100)',
                birthday: 'Compleanno',
                startTime: 'Ora di inizio',
                appointment: 'Appuntamento',
                week: 'Settimana',
                month: 'Mese',
                brandColor: 'Colore brand',
                bio: 'Bio',
                tellUsAboutYourself: 'Parlaci di te...',
                acceptTerms: 'Accetto termini e condizioni',
                recordId: 'ID record',
                slug: 'Slug',
            },
            propsDocs: {
                title: 'Props Input',
                items: {
                    name: { description: 'Nome campo usato come chiave del form e percorso dot-notation.' },
                    label: { description: 'Etichetta mostrata sopra l input.' },
                    type: { description: 'Tipo HTML dell input.' },
                    placeholder: { description: 'Testo segnaposto.' },
                    required: { description: 'Segna il campo come obbligatorio e mostra un asterisco nella label.' },
                    disabled: { description: 'Rende il campo in sola lettura.' },
                    readOnlyAfterSet: { description: 'Il campo diventa in sola lettura dopo che e stato impostato un valore.' },
                    defaultValue: { description: 'Valore iniziale quando non e gestito da un Form.' },
                    min: { description: 'Valore minimo per input number e range.' },
                    max: { description: 'Valore massimo per input number e range.' },
                    step: { description: 'Incremento di step per input number e range.' },
                    feedback: { description: 'Messaggio di feedback validazione mostrato sotto il campo.' },
                    id: { description: 'Id esplicito per l elemento input. Generato automaticamente se omesso.' },
                    labelClassName: { description: 'Classi CSS applicate all elemento label.' },
                    validator: { description: 'Funzione di validazione custom. Restituisce un errore per bloccare il submit.' },
                    className: { description: 'Classi CSS sull elemento input.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper esterno.' },
                },
            },
            playground: {
                title: 'Input',
            },
        },
    },
});
