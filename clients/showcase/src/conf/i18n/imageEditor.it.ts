import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageEditor: {
            page: {
                title: 'ImageEditor',
                description: 'Widget completo per l editing immagini basato su tui-image-editor. Supporta crop, flip, rotate, disegno libero, forme, testo e zoom. Disponibile inline oppure dentro una modal.',
            },
            sections: {
                inlineEditor: {
                    title: 'Editor inline',
                    description: 'Inserisci l editor direttamente nella pagina. La toolbar appare in alto e il canvas riempie tutta la larghezza disponibile.',
                },
                modalEditor: {
                    title: 'Editor in modal',
                    description: 'Passa mode="modal" per aprire l editor in una overlay full-screen. Titolo e toolbar condividono la stessa riga header pulita e onClose viene chiamato quando l utente lo chiude.',
                },
            },
            labels: {
                sampleTitle: 'Esempio',
                sampleSubtitle: 'Esempio - modifica questa immagine',
                lastSavedOutput: 'Ultimo output salvato:',
                savedResultAlt: 'Risultato salvato',
                openEditorInModal: 'Apri editor in modal',
                editPhoto: 'Modifica foto',
                savedResult: 'Risultato salvato:',
                savedAlt: 'Salvato',
            },
            propsDocs: {
                title: 'Props ImageEditor',
                items: {
                    src: { description: 'URL o data URL dell immagine da modificare.' },
                    title: { description: 'Titolo mostrato nell header della modal, usato solo quando mode="modal".', default: '"Image Editor"' },
                    width: { description: 'Larghezza CSS massima del canvas in pixel.', default: '700' },
                    height: { description: 'Altezza CSS massima del canvas in pixel.', default: '500' },
                    mode: { description: 'Renderizza dentro una modal overlay ("modal") oppure inline nella pagina ("inline").', default: '"inline"' },
                    onImageLoad: { description: 'Callback chiamata quando l immagine termina il caricamento dentro l editor.' },
                    onClose: { description: 'Callback chiamata quando l utente chiude la modal, disponibile solo in modal mode.' },
                    onSave: { description: 'Callback chiamata quando l utente clicca Save. Riceve l immagine modificata come data URL.' },
                },
            },
        },
    },
});
