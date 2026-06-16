import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gallery: {
            page: {
                title: 'Gallery',
                description: 'Visual record gallery with shared sorting support, overlays, selection and pagination.',
            },
            sections: {
                sortedGallery: {
                    title: 'Sorted gallery',
                    description: 'Gallery accepts the same sortable contract as Grid and Table. It sorts incoming records before rendering, without needing a header UI.',
                },
                recordClick: {
                    title: 'Record click',
                    description: 'onRowClick now receives the clicked record, so consumers can use record._key directly.',
                },
                bulkSelection: {
                    title: 'Bulk selection',
                    description: 'Gallery mirrors Table semantics: selectedKeys controls selection, and onSelectionChange exposes the selected records. External bulk commands stay outside the component.',
                },
                groupedPaged: {
                    title: 'Grouped and paged',
                    description: 'Pass a field name to groupBy to group cards into labelled sections. Pairing it with sortable on the same field clusters records naturally. Pass an array for multi-level grouping.',
                },
            },
            labels: {
                assets: 'Assets',
                selectableAssets: 'Selectable assets',
                assetsByCategory: 'Assets by category',
                selectedKey: 'Selected key',
                none: 'none',
                multiCheckbox: 'Multi checkbox',
                enableSelectionHelp: 'Enable selection to inspect the onSelectionChange payload live in the gallery preview.',
                enableMultiCheckbox: 'Enable multi checkbox',
                disableMultiCheckbox: 'Disable multi checkbox',
                onSelectionPayload: 'onSelectionChange payload',
                payloadEmptyHint: 'Enable multi checkbox above, then select cards to see the callback payload here.',
                export: 'Export',
                clear: 'Clear',
                selectAssetsToEnableBulk: 'Select assets to enable external bulk commands',
                selectedCount: 'selected',
                selectedGalleryItems: 'Selected gallery items',
                record: 'record',
                newBadge: 'new',
                brandBadge: 'brand',
                reviewBadge: 'review',
            },
            values: {
                assetNames: {
                    hero: 'Brand Hero',
                    social: 'Brand Social',
                    iconset: 'Brand Icon Set',
                    launch: 'Campaign Launch',
                    banner: 'Campaign Banner',
                    guide: 'Docs Guide',
                },
                categories: {
                    brand: 'Brand',
                    campaign: 'Campaign',
                    docs: 'Docs',
                },
                statuses: {
                    ready: 'ready',
                    draft: 'draft',
                    review: 'review',
                },
            },
            propsDocs: {
                title: 'Gallery props',
                items: {
                    records: { description: 'Records containing img or thumbnail data.' },
                    header: { description: 'Header content above the gallery.' },
                    footer: { description: 'Footer content below the gallery.' },
                    sortable: { description: 'Gallery has no sortable header UI, but you can pass an OrderConfig object to sort the incoming record set before rendering.', shortcuts: {
                        false: { label: 'false', help: 'Disable client sorting.' },
                        nameAsc: { label: 'name asc', help: 'Sort by name ascending.' },
                        statusDesc: { label: 'status desc', help: 'Sort by status descending.' },
                    } },
                    overlays: { description: 'Overlay rules based on position and record filters.', shortcuts: {
                        none: { label: 'none', help: 'No overlays.' },
                        status: { label: 'status', help: 'Status-oriented overlays.' },
                        brand: { label: 'brand', help: 'Category-based brand badge.' },
                    } },
                    onRowClick: { description: 'Called when the user clicks a record card.' },
                    onSelectionChange: { description: 'Called whenever selected items change. When provided, selection checkboxes appear automatically.' },
                    selectedKeys: { description: 'Controlled selection state shared with external bulk commands.' },
                    pagination: { description: 'Shared pagination config.', shortcuts: {
                        default: { label: 'default', help: 'Centered default pagination.' },
                        compact: { label: 'compact', help: 'Smaller pages and nav.' },
                        sticky: { label: 'sticky', help: 'Sticky bottom controls.' },
                    } },
                    gap: { description: 'Item padding size.' },
                    columns: { description: 'Columns per row.' },
                    groupBy: { description: 'Group cards by a field name. Records with the same field value are rendered inside the same section. Pass an array for multi-level grouping.', placeholder: 'e.g. category or ["category","status"]', shortcuts: {
                        off: { label: 'off', help: 'No grouping.' },
                        category: { label: 'category', help: 'Group by category.' },
                        status: { label: 'status', help: 'Group by status.' },
                        catStatus: { label: 'cat+status', help: 'Multi-level: category then status.' },
                    } },
                    scrollToTopOnChange: { description: 'Scroll the gallery back to the top when the page changes.' },
                    scrollBehavior: { description: 'Scroll behavior used when scrolling to top on page change.' },
                    className: { description: 'Class applied to the inner flex-column wrapper.' },
                    wrapperClassName: { description: 'Class applied to the outermost wrapper element.' },
                    scrollClassName: { description: 'Class applied to the scrollable body container.' },
                    headerClassName: { description: 'Class applied to the header container.' },
                    bodyClassName: { description: 'Class applied to the flex-wrap items container.' },
                    footerClassName: { description: 'Class applied to the footer container.' },
                    selectedClassName: { description: 'Class applied to the selected item.' },
                    before: { description: 'Content rendered to the left of the gallery.' },
                    after: { description: 'Content rendered to the right of the gallery.' },
                },
            },
            playground: {
                title: 'Gallery',
            },
        },
    },
});
