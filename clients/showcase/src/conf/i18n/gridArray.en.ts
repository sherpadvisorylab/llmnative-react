import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridArray: {
            page: {
                title: 'GridArray',
                description: 'In-memory Grid variant that renders a caller-owned record array directly. Ideal for computed data, local state, and small datasets that already live in the frontend.',
            },
            sections: {
                basicUsage: {
                    title: 'Basic usage',
                    description: 'The shortest valid GridArray. Pass a records array and let Grid infer columns from the record shape. sortable and pagination are explicit here to keep the example contained.',
                },
                onLoadTransform: {
                    title: 'onLoad transform',
                    description: 'Use onLoad to normalize or enrich records before display. The transform runs once on each render cycle and can also resolve asynchronously.',
                },
                grouping: {
                    title: 'Grouping',
                    description: 'groupBy separates rows under collapsible section headers. It works for both table and gallery layouts and accepts either a single field or multiple levels.',
                },
                selection: {
                    title: 'Selection',
                    description: 'selection enables radio buttons or checkboxes. Use the shorthand for UI-only state, or the object form when you need callbacks and default keys.',
                },
            },
            labels: {
                teamMembers: 'Team members',
                singleSelection: 'Single selection',
                multipleSelection: 'Multiple selection',
            },
            propsDocs: {
                categories: {
                    gridArray: 'GridArray',
                    shared: 'Shared',
                },
                items: {
                    records: {
                        description: 'Caller-owned record array. GridArray renders from this snapshot and does not subscribe to any provider. In the playground the records come from the Mock database below.',
                    },
                    recordId: {
                        description: 'Identity resolver used for selection, edit state and mutation paths. Pass a field name or an arrow function.',
                    },
                    onLoad: {
                        description: 'Transform records before display. Runs synchronously or asynchronously after the caller passes them in.',
                    },
                },
            },
            playground: {
                groups: {
                    gridArray: 'GridArray',
                    shared: 'Shared',
                },
                props: {
                    records: {
                        description: 'Caller-owned record array. In this playground the records come from the Mock database below. Edit it to see the grid update live.',
                    },
                    recordId: {
                        description: 'Record identity resolver. Pass a field name like "_key" or an arrow function.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Use the provider/native key field.' },
                            explicitId: { label: 'id', help: 'Use the explicit id field.' },
                            functionId: { label: 'fn', help: 'Arrow function returning the id field.' },
                        },
                    },
                    onLoad: {
                        description: 'Transform records before display. Handled internally by the playground.',
                    },
                },
            },
        },
    },
});
