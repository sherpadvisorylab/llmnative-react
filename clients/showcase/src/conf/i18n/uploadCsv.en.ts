import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadCsv: {
            page: {
                title: 'UploadCSV',
                description: 'Single-file CSV or TSV uploader with drag-and-drop, PapaParse integration and preview-friendly parsed output delivered through onDataLoaded.',
            },
            sections: {
                basicUpload: {
                    title: 'Basic CSV upload',
                    description: 'Drop a CSV or TSV file onto the zone or click to browse. After parsing, the component switches into a loaded state and exposes rows, headers and the original File through onDataLoaded.',
                },
                normalizedKeys: {
                    title: 'Normalized keys + empty field removal',
                    description: 'normalizeKeys transforms header names before they are exposed in fields and row objects. removeEmptyFields strips entries whose value is empty string or null from each parsed row.',
                },
                customFieldTransform: {
                    title: 'Custom field transform',
                    description: 'Use onParseField to intercept each parsed [key, value] pair. Return a modified pair to keep it, or undefined to drop that field from the final row object.',
                },
                customDelimiter: {
                    title: 'Custom delimiter',
                    description: 'Pass delimiter when the file does not use PapaParse auto-detection reliably, for example semicolon-separated exports from spreadsheet tools.',
                },
            },
            labels: {
                emptyState: 'No file loaded yet.',
                rows: 'rows',
                fields: 'fields',
                andMoreRows: '...and {count} more rows',
                basicLabel: 'Drag or click to upload CSV',
                normalizeLabel: 'Upload CSV to see normalized keys',
                transformLabel: 'Upload CSV - columns starting with _ will be dropped',
                delimiterLabel: 'Upload semicolon-separated CSV',
            },
            propsDocs: {
                title: 'UploadCSV props',
                items: {
                    name: { description: 'Field name used for the wrapper data-name attribute' },
                    onDataLoaded: { description: 'Called with parsed rows, header fields and the original File after a successful parse' },
                    onClear: { description: 'Called when the loaded file is removed from the component UI' },
                    label: { description: 'Label rendered above the drop zone' },
                    icon: { description: 'Icon name shown inside the drop zone', default: '"upload"' },
                    delimiter: { description: 'Optional delimiter passed to PapaParse. When omitted, PapaParse auto-detects it.' },
                    normalizeKeys: { description: 'Normalize header names with normalizeKey before exposing them in fields and row objects', default: 'false' },
                    removeEmptyFields: { description: 'Drop row entries whose parsed value is empty string or null', default: 'false' },
                    onParseField: { description: 'Transform or drop each [key, value] pair during parsing. Return undefined to omit the field.' },
                    before: { description: 'Content rendered before the uploader inside the outer wrapper' },
                    after: { description: 'Content rendered after the uploader inside the outer wrapper' },
                    className: { description: 'CSS classes applied to the inner uploader container' },
                    wrapperClassName: { description: 'CSS classes applied to the outer wrapper' },
                },
            },
            playground: {
                title: 'UploadCSV playground',
                defaultLabel: 'Drag or click to upload CSV',
            },
        },
    },
});
