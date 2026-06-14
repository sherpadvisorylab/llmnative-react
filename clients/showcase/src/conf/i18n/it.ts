import type { DeepPartial } from '@llmnative/react';
import type { I18nDict } from '@llmnative/react';

const it: DeepPartial<I18nDict> = {
    common: {
        save: 'Salva', cancel: 'Annulla', delete: 'Elimina', close: 'Chiudi',
        back: 'Indietro', search: 'Cerca', loading: 'Caricamento...',
        noDataFound: 'Nessun dato trovato', pageNavigation: 'Navigazione pagine',
        previous: 'Precedente', next: 'Successivo',
        notFoundMessage: 'Ops! Pagina non trovata.', goHome: 'Vai alla Home',
    },
    auth: {
        signIn: 'Accedi', signOut: 'Esci', connect: 'Connetti',
        connected: 'Connesso', authenticated: 'Autenticato',
        notConfigured: 'Il provider auth "{provider}" non è configurato. Controlla le chiavi API.',
        notImplemented: 'Il provider non implementa signIn().',
    },
    form: {
        headerAdd: 'Aggiungi', headerEdit: 'Modifica', buttonSave: 'Salva',
        buttonDelete: 'Elimina', buttonBack: 'Indietro',
        requiredField: 'Il campo "{field}" è obbligatorio',
        requiredFieldGeneric: 'I campi obbligatori non sono compilati',
        saveSuccess: 'Salvato con successo', deleteSuccess: 'Eliminato con successo',
        noticeRequiredFields: 'Completa i campi obbligatori prima di salvare.',
    },
    grid: {
        buttonAdd: 'Aggiungi',
        deleteConfirm: 'Sei sicuro di voler eliminare questo elemento?',
        emptyState: 'Nessun elemento da mostrare',
    },
    select: { placeholder: 'Seleziona...' },
    modal: { save: 'Salva', delete: 'Elimina', cancel: 'Annulla', close: 'Chiudi' },
    upload: {
        clickOrDrag: 'Clicca o trascina per caricare...', dropToUpload: 'Rilascia per caricare',
        uploadMore: 'Aggiungi altri file', editFileName: 'Modifica nome file',
        editorImage: 'Editor immagine', loaded: 'Caricato', removeFile: 'Rimuovi',
        uploadAnother: 'Carica un altro file', dropToParse: 'Rilascia per analizzare',
    },
    notifications: { title: 'Notifiche', seeAll: 'Vedi tutte' },
    code: { copyCode: 'Copia codice', copy: 'Copia', copied: 'Copiato!', codeLanguageDefault: 'Testo' },
    table: {
        noDataFound: 'Nessun dato trovato', selectAllRows: 'Seleziona tutte le righe',
        sortBy: 'Ordina per {label}', sortByCurrent: 'Ordina per {label} ({direction})',
        selectRow: 'Seleziona riga {key}', reorderRow: 'Riordina riga {key}',
    },
    gallery: { selectItem: 'Seleziona elemento {key}' },
    crop: {
        enableCrop: 'Abilita ritaglio a scala {scale}', variants: 'Varianti',
        outputFile: 'File di output', active: 'Attivo',
        removeVariant: 'Rimuovi variante {scale}', fileName: 'Nome file',
    },
    imageEditor: {
        title: 'Editor immagine', save: 'Salva', undo: 'Annulla', redo: 'Ripristina',
        zoomOut: 'Riduci zoom', zoomIn: 'Aumenta zoom', crop: 'Ritaglia',
        flipHorizontal: 'Capovolgi orizzontalmente', flipVertical: 'Capovolgi verticalmente',
        rotate: 'Ruota 90°', freeDrawing: 'Disegno libero', arrow: 'Freccia', text: 'Testo',
        rectangle: 'Rettangolo', circle: 'Cerchio', triangle: 'Triangolo',
    },
    prompt: {
        noProviders: 'Nessun provider AI registrato.',
        aiNotConfiguredEdit: "L'AI non è configurata. Puoi comunque modificare e salvare questo prompt.",
        aiNotConfiguredRun: "L'AI non è configurata. Impossibile eseguire questo prompt.",
        toggleOnTitle: 'Disabilita AI', toggleOffTitle: 'Abilita AI',
        closeEditor: 'Chiudi editor', editSettings: 'Modifica impostazioni',
        attachFiles: 'Allega file', run: 'Esegui', noMatchingCommands: 'Nessun comando corrispondente',
        tokenUsage: 'Utilizzo token', tokenInput: 'In: {count} token',
        tokenOutput: 'Out: {count} token', tokenContext: 'Contesto: {count} token',
        tokenCost: 'Costo: {cost} USD', tokenTime: 'Tempo: {ms}ms', tokenUsageEmpty: '-',
        hidePreview: 'Nascondi anteprima', showPreview: 'Mostra anteprima risolta',
        noProvider: 'Nessun provider', noResponse: 'Nessuna risposta',
    },
    layout: {
        maxElements: 'Hai già 12 elementi nella riga: rimuovine uno prima.',
        noSpace: 'Nessuno spazio: impossibile ridurre gli elementi per inserire questo campo.',
        dragToMove: 'Trascina per spostare', remove: 'Rimuovi',
        dragToResize: 'Trascina per ridimensionare', dragHere: 'Trascina un elemento qui dentro',
    },
};

export default it;
