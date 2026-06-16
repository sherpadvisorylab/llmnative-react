import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        examplesOverview: {
            page: {
                title: 'Examples',
                description: 'Real-world patterns showing how to compose components, widgets and providers together.',
            },
            labels: {
                arrow: '->',
            },
            items: {
                crudTable: {
                    title: 'CRUD table',
                    description: 'Full create/read/update/delete flow with Grid + modal Form. Real-time updates via Firebase.',
                },
                dashboard: {
                    title: 'Dashboard',
                    description: 'Metric cards, charts and a recent-activity table, all from a single DataProvider.',
                },
                nestedForm: {
                    title: 'Nested form',
                    description: 'dot notation for deep objects, array index notation, and Repeat for dynamic lists.',
                },
                fileManager: {
                    title: 'File manager',
                    description: 'Upload images and documents to Firebase Storage, browse with a gallery Grid.',
                },
                googleSignIn: {
                    title: 'Google sign-in',
                    description: 'OAuth2 sign-in with Google, protected routes and user profile display.',
                },
            },
        },
    },
});
