import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridPreview: {
            page: {
                title: 'Grid preview workspace',
                description: 'Hidden companion page used by Grid custom actions. It currently previews the active record and offers export formats, and it can later be reused for Form preview flows.',
            },
            banner: {
                currentView: 'Current view',
                exportDescription: 'Choose an export format for the current record or the full mock dataset.',
                previewDescription: 'Inspect the selected record and reuse this page as a generic preview surface.',
                allRecords: 'All records',
                recordPrefix: 'Record',
            },
            sections: {
                datasetPreview: {
                    title: 'Dataset preview',
                    selectedRecordDescription: 'This record arrived through a Grid custom action and can be reused for export or future Form preview flows.',
                    emptyDescription: 'No specific record was passed, so the page is showing the dataset-level preview.',
                },
                exportOptions: {
                    title: 'Export options',
                    description: 'This is intentionally a small action hub. Grid, Form and other previews can point here whenever users should choose an export format instead of downloading immediately.',
                },
            },
            emptyState: {
                singleRecordHint: 'Open this page from a record-aware Grid action to prefill the preview with a single record. The export tools still work on the full mock dataset.',
            },
            actions: {
                exportCsv: 'Export CSV',
                exportJson: 'Export JSON',
                saveAsPdf: 'Save as PDF',
                copyJson: 'Copy JSON',
                jsonCopied: 'JSON copied',
                copyEmails: 'Copy emails',
                emailsCopied: 'Emails copied',
            },
            hints: {
                futureReuse: 'Tip: for now this page focuses on export and preview. Later we can reuse the same layout for Form preview, print layouts and record-level review flows without changing the Grid action contract again.',
            },
        },
    },
});
