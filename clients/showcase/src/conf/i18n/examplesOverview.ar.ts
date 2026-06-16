import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        examplesOverview: {
            page: {
                title: 'Examples',
                description: 'Anmat waqiiya tushir ila kayfiyat tarkib components wa widgets wa providers maaan.',
            },
            labels: {
                arrow: '->',
            },
            items: {
                crudTable: {
                    title: 'CRUD table',
                    description: 'Tadfuq create/read/update/delete kamil ma Grid wa modal Form. Tahdithat real-time abr Firebase.',
                },
                dashboard: {
                    title: 'Dashboard',
                    description: 'Metric cards wa charts wa recent-activity table, kulluha min DataProvider wahid.',
                },
                nestedForm: {
                    title: 'Nested form',
                    description: 'dot notation lil deep objects, wa array index notation, wa Repeat lil qawaim al dinamikiyya.',
                },
                fileManager: {
                    title: 'File manager',
                    description: 'Qum biraf images wa documents ila Firebase Storage wa tasaffahha bi gallery Grid.',
                },
                googleSignIn: {
                    title: 'Google sign-in',
                    description: 'OAuth2 sign-in ma Google, protected routes, wa ard profile al mustakhdim.',
                },
            },
        },
    },
});
