import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageEditor: {
            page: {
                title: 'ImageEditor',
                description: 'Vollstandiges Bildbearbeitungs-Widget auf Basis von tui-image-editor. Unterstutzt Zuschneiden, Spiegeln, Drehen, Freihandzeichnen, Formen, Text und Zoom. Verfugbar inline oder innerhalb eines Modals.',
            },
            sections: {
                inlineEditor: {
                    title: 'Inline-Editor',
                    description: 'Platziere den Editor direkt auf der Seite. Die Toolbar erscheint oben und die Zeichenflache fullt die verfugbare Breite aus.',
                },
                modalEditor: {
                    title: 'Modal-Editor',
                    description: 'Ubergebe mode="modal", um den Editor in einem Vollbild-Overlay zu offnen. Titel und Toolbar teilen sich dieselbe saubere Kopfzeile und onClose wird ausgelost, wenn der Nutzer schliest.',
                },
            },
            labels: {
                sampleTitle: 'Beispiel',
                sampleSubtitle: 'Beispiel - bearbeite dieses Bild',
                lastSavedOutput: 'Zuletzt gespeichertes Ergebnis:',
                savedResultAlt: 'Gespeichertes Ergebnis',
                openEditorInModal: 'Editor im Modal offnen',
                editPhoto: 'Foto bearbeiten',
                savedResult: 'Gespeichertes Ergebnis:',
                savedAlt: 'Gespeichert',
            },
            propsDocs: {
                title: 'ImageEditor-Props',
                items: {
                    src: { description: 'URL oder Data-URL des zu bearbeitenden Bildes.' },
                    title: { description: 'Titel in der Modal-Kopfzeile, nur bei mode="modal" verwendet.', default: '"Image Editor"' },
                    width: { description: 'Maximale CSS-Breite der Zeichenflache in Pixeln.', default: '700' },
                    height: { description: 'Maximale CSS-Hohe der Zeichenflache in Pixeln.', default: '500' },
                    mode: { description: 'Rendert innerhalb eines Modal-Overlays ("modal") oder inline auf der Seite ("inline").', default: '"inline"' },
                    onImageLoad: { description: 'Callback, das ausgelost wird, sobald das Bild vollstandig in den Editor geladen wurde.' },
                    onClose: { description: 'Callback, das beim Schliesen des Modals ausgelost wird, nur im Modal-Modus verfugbar.' },
                    onSave: { description: 'Callback, das beim Klick auf Save ausgelost wird. Erhalt das bearbeitete Bild als Data-URL.' },
                },
            },
        },
    },
});
