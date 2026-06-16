import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({
    showcase: {
        code: {
            page: { title: 'Code', description: 'Blocco di codice con evidenziazione sintattica basato su Prism, con azione di copia opzionale, caricamento del linguaggio e selezione del tema.' },
            sections: {
                tsx: { title: 'Blocco TSX', description: 'Usa Code per esempi, snippet e anteprime di sorgente generato.' },
                languages: { title: 'Linguaggi', description: 'Il componente carica in lazy la grammatica Prism del linguaggio selezionato.' },
                themesCopy: { title: 'Temi e copia', description: 'Clicca un tema per visualizzarne l\'anteprima. showCopy controlla il pulsante clipboard.' },
                slotsWrapper: { title: 'Slot e wrapper', description: 'pre e post vengono renderizzati fuori dal blocco di codice come adornment laterali. wrapperClassName e className permettono di integrare il blocco in layout documentali piu ricchi.' },
            },
        },
    },
});
