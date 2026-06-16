import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        upload: {
            page: {
                title: 'Upload',
                description: 'Drei spezialisierte Upload-Felder fur Bilder, Dokumente und CSV-Daten. Jede Variante verwaltet lokale Vorschau, Dateibindung und optionalen Cloud-Speicher eigenstandig.',
            },
            sections: {
                variants: {
                    description: 'Wahle die Variante, die zum Dateityp passt. Alle drei erweitern FormFieldProps und binden ihr Ergebnis uber die name-Prop an den umschliessenden Form-Datensatz.',
                },
                cloudStorage: {
                    title: 'Cloud-Speicher',
                    description: 'Registriere einen StorageProvider in App und ubergebe storagePath an UploadImage oder UploadDocument, um Dateien nach Firebase Storage oder Supabase Storage zu streamen, statt sie als lokale Base64-Daten zu behalten.',
                },
            },
            variants: {
                image: {
                    title: 'UploadImage',
                    description: 'Inline-Miniaturgitter mit Hover-Overlay fur Vorschau, Zuschneiden und Entfernen. Unterstutzt ein oder mehrere Bilder.',
                },
                document: {
                    title: 'UploadDocument',
                    description: 'Dateiliste mit Name, Groesse und Fortschrittsbalken. Akzeptiert jeden Dateityp uber den accept-Filter.',
                },
                csv: {
                    title: 'UploadCSV',
                    description: 'CSV-Parser mit Drag-and-drop. Liefert typisierte Zeilen und Feldnamen an onDataLoaded. Funktioniert auch eigenstandig ohne Form.',
                },
            },
            labels: {
                storageNotice: 'Das Showcase lauft offline - storagePath-Demos erfordern einen konfigurierten StorageProvider.',
            },
        },
    },
});
