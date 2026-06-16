import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        examplesOverview: {
            page: {
                title: 'Examples',
                description: 'Real-world patterns, pokazyvayushchie kak sobirat vmeste components, widgets i providers.',
            },
            labels: {
                arrow: '->',
            },
            items: {
                crudTable: {
                    title: 'CRUD table',
                    description: 'Polnyy create/read/update/delete flow s Grid i modal Form. Real-time updates cherez Firebase.',
                },
                dashboard: {
                    title: 'Dashboard',
                    description: 'Metric cards, charts i recent-activity table, vse iz odnogo DataProvider.',
                },
                nestedForm: {
                    title: 'Nested form',
                    description: 'dot notation dlya glubokikh obektov, array index notation i Repeat dlya dinamicheskikh spiskov.',
                },
                fileManager: {
                    title: 'File manager',
                    description: 'Zagruzhayte images i documents v Firebase Storage i prosmatrivayte ikh cherez gallery Grid.',
                },
                googleSignIn: {
                    title: 'Google sign-in',
                    description: 'OAuth2 sign-in s Google, protected routes i otobrazhenie profilya пользователя.',
                },
            },
        },
    },
});
