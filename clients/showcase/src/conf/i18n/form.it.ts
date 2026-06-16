import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        form: {
            page: { title: 'Form widget', description: 'Modulo CRUD completo: carica un record dal DataProvider, valida, salva e opzionalmente elimina. Avvolgi i campi come children — il Form collega tutto automaticamente tramite React context.' },
            sections: {
                newRecord: { title: 'Nuovo record (keyGenerator)', description: 'Passa path (collezione) + keyGenerator per creare un nuovo record. Non viene eseguita alcuna lettura DB. Il salvataggio chiama set() su path/chiaveGenerata.' },
                editExisting: { title: 'Modifica record esistente', description: 'Passa path (percorso completo del record inclusa la chiave) senza defaultValues. Il Form legge il record al montaggio, precompila i campi e salva sullo stesso path.' },
                lifecycleHooks: { title: 'Hook del ciclo di vita', description: 'onLoad trasforma i dati dopo la lettura. onSave trasforma prima della scrittura. onComplete viene eseguito dopo ogni azione.' },
                lifecycleHooksNote: 'Esempio di codice — gli hook non sono visivamente distinti da un form standard.',
                nestedObjects: { title: 'Oggetti e array annidati', description: 'La notazione puntata mappa le chiavi degli oggetti annidati. La notazione con indice array mappa agli elementi dell\'array.' },
            },
        },
    },
});
