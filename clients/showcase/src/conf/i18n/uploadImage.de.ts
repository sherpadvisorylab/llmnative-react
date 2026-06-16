import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadImage: {
            page: {
                title: 'UploadImage',
                description: 'Bild-Upload-Feld mit Inline-Miniaturvorschau, Hover-Overlay-Aktionen und optionaler Mehrfachbild-Unterstutzung. Speichert Dateideskriptoren im Form-Datensatz.',
            },
            sections: {
                singleImage: {
                    title: 'Einzelbild',
                    description: 'Standardnutzung: ein Bild gleichzeitig mit Miniatur in fester Groesse. Nach dem Upload kannst du die Hover-Aktionen fur Vorschau oder Entfernen nutzen.',
                },
                multipleImages: {
                    title: 'Mehrere Bilder',
                    description: 'Ubergebe multiple, um mehrere Bilder auswahlen zu konnen. Jede Datei wird als eigene Miniatur gerendert. Der Upload stoppt, sobald das max-Limit erreicht ist.',
                },
                editableCrop: {
                    title: 'Bearbeitbar (Zuschneiden)',
                    description: 'Fuge editable hinzu, um beim Hover ein Stiftsymbol anzuzeigen. Ein Klick offnet den Bildeditor mit Zuschneiden- und Skalierungswerkzeugen, und die erzeugten Varianten werden in diesem Dateieintrag des Form-Datensatzes gespeichert.',
                },
                acceptFilter: {
                    title: 'Accept-Filter',
                    description: 'Beschranke den Dateiauswahler auf bestimmte MIME-Typen. Der Browser erzwingt den Filter im nativen Dateidialog.',
                },
            },
            labels: {
                avatar: 'Avatar',
                galleryMax: 'Galerie (max. 6)',
                coverPhotoEditable: 'Titelbild (bearbeitbar)',
                pngOnly: 'Nur PNG',
            },
            propsDocs: {
                title: 'UploadImage-Props',
                items: {
                    name: { description: 'Feldname, der an den Form-Datensatz gebunden ist' },
                    label: { description: 'Label uber dem Upload-Bereich' },
                    multiple: { description: 'Erlaubt die Auswahl von mehr als einem Bild gleichzeitig', default: 'false' },
                    editable: { description: 'Zeigt beim Hover einen Zuschneiden-/Bearbeiten-Button; offnet den Bildeditor', default: 'false' },
                    previewWidth: { description: 'Breite der Miniatur in Pixeln', default: '100' },
                    previewHeight: { description: 'Hohe der Miniatur in Pixeln', default: '100' },
                    accept: { description: 'Akzeptierte MIME-Typen (z. B. "image/png,image/jpeg")', default: '"image/*"' },
                    max: { description: 'Maximale Anzahl erlaubter Dateien', default: '100' },
                    required: { description: 'Markiert das Feld als erforderlich; blockiert das Absenden, wenn es leer ist', default: 'false' },
                    onChange: { description: 'Wird bei jeder Anderung der Dateiliste mit aktualisiertem Wert und Form-Kontext aufgerufen' },
                    before: { description: 'Inhalt vor dem Bildgitter innerhalb des ausseren Wrappers' },
                    after: { description: 'Inhalt nach dem Bildgitter innerhalb des ausseren Wrappers' },
                    className: { description: 'CSS-Klassen fur den inneren Container' },
                    wrapperClassName: { description: 'CSS-Klassen fur den ausseren Wrapper' },
                },
            },
            playground: {
                title: 'UploadImage-Playground',
                defaultLabel: 'Galerie',
            },
        },
    },
});
