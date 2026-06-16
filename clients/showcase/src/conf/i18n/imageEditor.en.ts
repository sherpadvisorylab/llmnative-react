import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageEditor: {
            page: {
                title: 'ImageEditor',
                description: 'Full-featured image editing widget powered by tui-image-editor. Supports crop, flip, rotate, free drawing, shapes, text and zoom. Available inline or inside a modal.',
            },
            sections: {
                inlineEditor: {
                    title: 'Inline editor',
                    description: 'Drop the editor directly on the page. The toolbar appears at the top and the canvas fills the available width.',
                },
                modalEditor: {
                    title: 'Modal editor',
                    description: 'Pass mode="modal" to open the editor in a full-screen overlay. The title and toolbar share the same clean header row, and onClose fires when the user dismisses it.',
                },
            },
            labels: {
                sampleTitle: 'Sample',
                sampleSubtitle: 'Sample - edit this image',
                lastSavedOutput: 'Last saved output:',
                savedResultAlt: 'Saved result',
                openEditorInModal: 'Open editor in modal',
                editPhoto: 'Edit photo',
                savedResult: 'Saved result:',
                savedAlt: 'Saved',
            },
            propsDocs: {
                title: 'ImageEditor props',
                items: {
                    src: { description: 'URL or data URL of the image to edit.' },
                    title: { description: 'Title shown in the modal header, used only when mode="modal".', default: '"Image Editor"' },
                    width: { description: 'Maximum CSS width of the canvas in pixels.', default: '700' },
                    height: { description: 'Maximum CSS height of the canvas in pixels.', default: '500' },
                    mode: { description: 'Render inside a modal overlay ("modal") or inline on the page ("inline").', default: '"inline"' },
                    onImageLoad: { description: 'Callback fired when the image finishes loading into the editor.' },
                    onClose: { description: 'Callback fired when the user closes the modal, available only in modal mode.' },
                    onSave: { description: 'Callback fired when the user clicks Save. Receives the edited image as a data URL.' },
                },
            },
        },
    },
});
