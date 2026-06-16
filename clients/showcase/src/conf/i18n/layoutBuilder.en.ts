import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        layoutBuilder: {
            page: {
                title: 'LayoutBuilder',
                description: 'Interactive 12-column row builder for arranging dragged field tokens.',
            },
            sections: {
                dragFields: {
                    title: 'Drag fields into the row',
                    description: 'Drag field tokens from the list into the builder row to compose a stored layout inside the current Form record.',
                },
            },
            labels: {
                dragFieldsIntoRow: 'Drag fields into the row',
                fields: 'Fields',
            },
            propsDocs: {
                title: 'LayoutBuilder props',
                items: {
                    name: { description: 'Form field name that stores row layout items.' },
                    defaultSpan: { description: 'Default column span for dropped fields.', default: '1' },
                    heightPx: { description: 'Builder row height in pixels.', default: '100' },
                    ref: { description: 'Imperative API: getValue, setValue, clear.' },
                },
            },
            playground: {
                title: 'LayoutBuilder',
            },
        },
    },
});
