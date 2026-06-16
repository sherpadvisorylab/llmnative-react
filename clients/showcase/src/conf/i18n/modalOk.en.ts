import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalOk: {
            page: { title: 'ModalOk', description: 'Informational dialog with a single Ok button. Use it for read-only status messages that only require acknowledgement.' },
            sections: {
                statusAcknowledgement: { title: 'Status acknowledgement', description: 'ModalOk is the lightest modal variant - one button, no branching. Use it after background jobs, imports, or any operation the user should be aware of.' },
            },
            demo: {
                defaultTitle: 'Import complete',
                defaultBody: '42 records were imported successfully.',
                openButton: 'Open ModalOk',
                importCsvButton: 'Import CSV',
                acknowledgementBody: '42 records were imported successfully. 3 rows were skipped due to validation errors.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Informational content shown in the body' },
                    title: { description: 'Dialog title' },
                    onClose: { description: 'Called when the user clicks Ok or the X button' },
                },
            },
        },
    },
});
