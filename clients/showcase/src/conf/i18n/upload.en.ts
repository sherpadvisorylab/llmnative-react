import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        upload: {
            page: {
                title: 'Upload',
                description: 'Three specialised upload fields for images, documents and CSV data. Each variant manages local preview, file binding and optional cloud storage independently.',
            },
            sections: {
                variants: {
                    description: 'Choose the variant that matches the file type. All three extend FormFieldProps and bind their result to the enclosing Form record via the name prop.',
                },
                cloudStorage: {
                    title: 'Cloud storage',
                    description: 'Register a StorageProvider in App and pass storagePath on UploadImage or UploadDocument to stream files to Firebase Storage or Supabase Storage instead of keeping them as local base64.',
                },
            },
            variants: {
                image: {
                    title: 'UploadImage',
                    description: 'Inline thumbnail grid with hover overlay for preview, crop and removal. Supports single or multiple images.',
                },
                document: {
                    title: 'UploadDocument',
                    description: 'File list with name, size and progress bar. Accepts any file type via the accept filter.',
                },
                csv: {
                    title: 'UploadCSV',
                    description: 'Drag-and-drop CSV parser. Delivers typed rows and field names to onDataLoaded. Works standalone without a Form.',
                },
            },
            labels: {
                storageNotice: 'The showcase runs offline - storagePath demos require a configured StorageProvider.',
            },
        },
    },
});
