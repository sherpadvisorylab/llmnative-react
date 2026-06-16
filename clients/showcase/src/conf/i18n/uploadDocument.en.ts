import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadDocument: {
            page: {
                title: 'UploadDocument',
                description: 'Document upload field with drag-and-drop, inline progress, removable rows and optional file-name editing. The Form record stores an array of file descriptors.',
            },
            sections: {
                basicUpload: {
                    title: 'Basic document upload',
                    description: 'Single-file upload with drag-and-drop. The field reads the selected file locally, shows progress while converting it, then stores the uploaded entry in the Form record.',
                },
                multipleFiles: {
                    title: 'Multiple files',
                    description: 'Enable multiple to keep several files in the same field. Each uploaded file becomes a table row, and the inline upload action stays available until max is reached.',
                },
                editableFileNames: {
                    title: 'Editable file names',
                    description: 'Set editable to make each row clickable. Clicking a completed row opens the built-in file-name editor modal and saves the new fileName back into the stored file entry.',
                },
                acceptFilter: {
                    title: 'Accept filter',
                    description: 'Restrict the native file chooser to specific extensions. The same accept string is also shown inside the empty drop zone as a visual hint for the allowed formats.',
                },
                requiredField: {
                    title: 'Required field',
                    description: 'Add required to surface form validation when the field is empty. The validation message is rendered below the upload area using the standard form field error slot.',
                },
            },
            labels: {
                report: 'Report',
                attachmentsMax: 'Attachments (max 5)',
                deliverables: 'Deliverables',
                csvExcelOnly: 'CSV / Excel only',
                contractRequired: 'Contract (required)',
            },
            propsDocs: {
                title: 'UploadDocument props',
                items: {
                    name: { description: 'Field name bound to the Form record' },
                    label: { description: 'Label rendered above the drop zone or file table' },
                    multiple: { description: 'Allow selecting and storing more than one file', default: 'false' },
                    editable: { description: 'Open the file-name editor modal when a table row is clicked', default: 'false' },
                    accept: { description: 'Native file input accept filter shown in the picker and drop zone hint', default: '".pdf,.doc,.docx,.txt,.iso"' },
                    max: { description: 'Maximum number of files that can be kept in the field', default: '100' },
                    required: { description: 'Mark the hidden file input as required and show validation feedback when empty', default: 'false' },
                    onChange: { description: 'Called whenever the file array stored in the Form record changes' },
                    before: { description: 'Content rendered before the upload field inside the outer wrapper' },
                    after: { description: 'Content rendered after the upload field inside the outer wrapper' },
                    className: { description: 'CSS classes applied to the inner field container' },
                    wrapperClassName: { description: 'CSS classes applied to the outer Wrapper element' },
                },
            },
            playground: {
                title: 'UploadDocument playground',
                defaultLabel: 'Attachments',
            },
        },
    },
});
