import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridDb: {
            page: {
                title: 'GridDB',
                description: 'Provider-backed Grid variant. Subscribes to a DataProvider path and streams updates automatically, with provider-side filtering, ordering and field remapping.',
            },
            sections: {
                basicUsage: {
                    title: 'Basic usage',
                    description: 'The shortest valid GridDB. Provide a path and let Grid subscribe to the collection and infer columns from the incoming records.',
                },
                providerFilter: {
                    title: 'Provider-side filter',
                    description: 'where filters records at the provider level before they reach the component, so the grid does not over-fetch.',
                },
                providerOrder: {
                    title: 'Provider-side order',
                    description: 'order sorts records at the provider level before the component receives them.',
                },
                fromUrl: {
                    title: 'fromUrl - route-driven path',
                    description: 'fromUrl resolves the collection path from the current route pathname instead of a hardcoded path. This preview reads from the current page URL.',
                },
                grouping: {
                    title: 'Grouping',
                    description: 'groupBy separates rows under section headers. It works for both table and gallery layouts and can be combined with provider-side ordering.',
                },
            },
            labels: {
                teamMembers: 'Team members',
            },
            propsDocs: {
                categories: {
                    gridDb: 'GridDB',
                    shared: 'Shared',
                },
                items: {
                    path: { description: 'DataProvider collection path. Use with fromUrl={false} (default).' },
                    fromUrl: { description: 'When true, derive the collection path from the current route pathname instead of path. fromUrl always wins: path is ignored when fromUrl is set.' },
                    recordId: { description: 'Identity resolver used for selection, edit state and mutation paths. Pass a field name or an arrow function.' },
                    where: { description: 'Provider-side filter applied before records are streamed.' },
                    order: { description: 'Provider-side ordering applied before records are streamed.' },
                    fieldMap: { description: 'Remap provider field names to UI field names before rendering them in the grid.' },
                },
            },
            playground: {
                groups: {
                    gridDb: 'GridDB',
                    shared: 'Shared',
                },
                props: {
                    path: { description: 'DataProvider collection path used when fromUrl is disabled.' },
                    fromUrl: { description: 'Derive the collection path from the current route pathname. In this playground it resolves to a different seeded dataset.' },
                    recordId: {
                        description: 'Record identity resolver.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'Use the provider/native key field.' },
                            explicitId: { label: 'id', help: 'Use the explicit id field.' },
                            functionId: { label: 'fn', help: 'Arrow function returning the id field.' },
                        },
                    },
                    where: {
                        description: 'Provider-side filter applied before records are streamed.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'No filter.' },
                            active: { label: 'active', help: 'Show only active teammates.' },
                            admins: { label: 'admins', help: 'Show only admin teammates.' },
                        },
                    },
                    order: {
                        description: 'Provider-side ordering applied before records are streamed.',
                        shortcuts: {
                            none: { label: 'none', help: 'Keep provider default order.' },
                            nameAsc: { label: 'name asc', help: 'Sort by name ascending.' },
                            emailDesc: { label: 'email desc', help: 'Sort by email descending.' },
                        },
                    },
                    fieldMap: {
                        description: 'Remap provider field names to UI field names.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'No remapping.' },
                            fullName: { label: 'fullName', help: 'Expose provider "name" as "fullName".' },
                        },
                    },
                },
            },
        },
    },
});
