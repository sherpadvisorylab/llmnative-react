import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalYesNo: {
            page: { title: 'ModalYesNo', description: 'Confirmation dialog with Yes and No buttons. Both handlers close the modal automatically after they resolve.' },
            sections: {
                destructiveConfirmation: { title: 'Destructive confirmation', description: 'Use ModalYesNo before any irreversible action - delete, reset, publish. The Yes handler runs the action; No cancels. Both close the modal when their async handler resolves.' },
            },
            demo: {
                defaultTitle: 'Confirm deletion',
                defaultBody: 'Are you sure you want to delete this record? This action cannot be undone.',
                openButton: 'Open ModalYesNo',
                deleteRecordButton: 'Delete record',
                yesResult: 'You clicked Yes.',
                noResult: 'You clicked No.',
                confirmedResult: 'Confirmed - record deleted.',
                cancelledResult: 'Cancelled - nothing was deleted.',
                destructiveQuestion: 'Are you sure you want to delete user_042? This action cannot be undone.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Confirmation message shown in the body' },
                    title: { description: 'Dialog title' },
                    onYes: { description: 'Called when the user clicks Yes. Modal closes automatically after the handler resolves.' },
                    onNo: { description: 'Called when the user clicks No. Modal closes automatically after the handler resolves.' },
                    onClose: { description: 'Called when the modal is dismissed via the X button or backdrop' },
                },
            },
        },
    },
});
