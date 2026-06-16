import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modal: {
            page: {
                title: 'Modal',
                description: 'Dialog centrati e pannelli laterali. Toggle fullscreen, azioni async di save/delete e rendering via portal.',
            },
            sections: {
                positions: {
                    title: 'Posizioni',
                    description: 'Clicca un pulsante per aprire il modal nella posizione corrispondente.',
                },
            },
            demo: {
                dialogTitleCenter: 'Dialog - center',
                panelTitle: 'Panel - {position}',
                dialogBody: 'Dialog centrato. Supporta le dimensioni `sm`, `md`, `lg`, `xl`, `2xl` e `fullscreen`.',
                panelBody: 'Pannello laterale con posizione **{position}**. Viene renderizzato in `document.body` tramite React portal.',
                openButton: 'Apri modal',
                defaultTitle: 'Titolo dialog',
                defaultBody: 'Il contenuto del modal va qui.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Contenuto del body del modal' },
                    title: { description: 'Titolo del modal mostrato nell header' },
                    header: { description: 'Contenuto header personalizzato (sovrascrive il titolo)' },
                    footer: { description: 'Contenuto footer personalizzato, oppure false per nascondere del tutto il footer', typeDetails: 'ReactNode | false' },
                    size: { description: 'Larghezza del dialog' },
                    position: { description: 'Dove appare il modal. Le posizioni non centrate vengono renderizzate come pannelli laterali.' },
                    onClose: { description: 'Chiamata quando l utente chiude il modal' },
                    onSave: { description: 'Handler async di salvataggio. Ritorna true per chiudere, false per lasciarlo aperto.' },
                    onDelete: { description: 'Handler async di delete. Mostra un pulsante delete nel footer.' },
                    closeOnBackdrop: { description: 'Chiude il modal quando si clicca il backdrop' },
                    allowFullscreen: { description: 'Mostra il toggle fullscreen nell header' },
                    showCancel: { description: 'Mostra il pulsante Cancel nel footer quando onClose e presente' },
                    zIndex: { description: 'Override del CSS z-index, utile quando si impilano piu modal' },
                    headerClassName: { description: 'Classi CSS sul contenitore header' },
                    titleClassName: { description: 'Classi CSS sull elemento titolo' },
                    subtitleClassName: { description: 'Classi CSS sull elemento subtitle (renderizzato quando title e header sono entrambi presenti)' },
                    bodyClassName: { description: 'Classi CSS sul contenitore body' },
                    footerClassName: { description: 'Classi CSS sul contenitore footer' },
                    wrapperClassName: { description: 'Classi CSS sull elemento wrapper piu esterno del dialog' },
                    className: { description: 'Classi CSS sul contenitore flex interno' },
                    before: { description: 'Contenuto renderizzato prima del contenitore interno, dentro il wrapper del dialog' },
                    after: { description: 'Contenuto renderizzato dopo il contenitore interno, dentro il wrapper del dialog' },
                    motion: { description: 'Preset motion nominato o override inline MotionProps per l animazione di entrata/uscita del dialog', typeDetails: 'string | MotionEffect | false' },
                },
            },
        },
    },
});
