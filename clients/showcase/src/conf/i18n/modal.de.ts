import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modal: {
            page: {
                title: 'Modal',
                description: 'Zentrierte Dialoge und Rand-Panels. Fullscreen-Umschalter, asynchrone Save/Delete-Aktionen und Portal-Rendering.',
            },
            sections: {
                positions: {
                    title: 'Positionen',
                    description: 'Klicke auf einen Button, um das Modal an der entsprechenden Position zu öffnen.',
                },
                stacked: {
                    title: 'Gestapelte Panels (stackedBehind)',
                    description: 'Öffne ein Seitenpanel und dann ein zweites darüber. Das Panel dahinter behält seine volle Höhe, verschiebt sich ein paar px nach innen (ein Streifen lugt hinter einem Schleier hervor) und sein Backdrop bleibt montiert, damit die Seite nicht blinkt.',
                },
            },
            demo: {
                dialogTitleCenter: 'Dialog - center',
                panelTitle: 'Panel - {position}',
                dialogBody: 'Zentrierter Dialog. Unterstützt die Größen `sm`, `md`, `lg`, `xl`, `2xl` und `fullscreen`.',
                panelBody: 'Seitenpanel mit Position **{position}**. Wird per React-Portal in `document.body` gerendert.',
                openButton: 'Modal öffnen',
                defaultTitle: 'Dialogtitel',
                defaultBody: 'Der Modal-Inhalt steht hier.',
                stackedOpenButton: 'Gestapeltes Panel öffnen',
                stackedBehindTitle: 'Panel dahinter',
                stackedTopTitle: 'Panel oben',
                stackedBody: 'Dieses Panel ist gestapelt. Öffne das obere Panel, um das dahinterliegende Panel verschoben und gedimmt zu sehen.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Inhalt des Modal-Bodys' },
                    title: { description: 'Modaltitel im Header' },
                    header: { description: 'Benutzerdefinierter Header-Inhalt (überschreibt den Titel)' },
                    footer: { description: 'Benutzerdefinierter Footer-Inhalt oder false, um den Footer vollständig auszublenden', typeDetails: 'ReactNode | false' },
                    size: { description: 'Dialogbreite' },
                    position: { description: 'Wo das Modal erscheint. Nicht-zentrierte Positionen werden als Rand-Panels gerendert.' },
                    onClose: { description: 'Wird aufgerufen, wenn der Benutzer das Modal schließt' },
                    onSave: { description: 'Asynchroner Save-Handler. true schließt, false hält offen.' },
                    onDelete: { description: 'Asynchroner Delete-Handler. Zeigt einen Delete-Button im Footer an.' },
                    closeOnBackdrop: { description: 'Schließt das Modal bei Klick auf den Backdrop' },
                    closeOnEscape: { description: 'Schließt das Modal mit der Escape-Taste (nur das oberste offene Modal reagiert)' },
                    allowFullscreen: { description: 'Zeigt den Fullscreen-Umschalter im Header' },
                    showCancel: { description: 'Zeigt den Cancel-Button im Footer, wenn onClose vorhanden ist' },
                    zIndex: { description: 'CSS-z-index-Override, nützlich beim Stapeln mehrerer Modals' },
                    stackedBehind: { description: 'Platziert dieses Modal visuell hinter einem anderen darüber: volle Höhe, verschiebt sich nach innen (left/right) hinter einem Opazitäts-Schleier, bleibt nicht interaktiv und sein Backdrop bleibt montiert und blendet aus' },
                    headerClassName: { description: 'CSS-Klassen am Header-Container' },
                    titleClassName: { description: 'CSS-Klassen am Titelelement' },
                    subtitleClassName: { description: 'CSS-Klassen am Subtitle-Element (wenn title und header beide gesetzt sind)' },
                    bodyClassName: { description: 'CSS-Klassen am Body-Container' },
                    footerClassName: { description: 'CSS-Klassen am Footer-Container' },
                    wrapperClassName: { description: 'CSS-Klassen am äußersten Dialog-Wrapper' },
                    className: { description: 'CSS-Klassen am inneren Flex-Container' },
                    before: { description: 'Inhalt vor dem inneren Container innerhalb des Dialog-Wrappers' },
                    after: { description: 'Inhalt nach dem inneren Container innerhalb des Dialog-Wrappers' },
                    motion: { description: 'Benanntes Motion-Preset oder inline MotionProps-Override für die Ein-/Ausblendanimation des Dialogs', typeDetails: 'string | MotionEffect | false' },
                },
            },
        },
    },
});
