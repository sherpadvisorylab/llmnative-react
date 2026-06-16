import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        examplesOverview: {
            page: {
                title: 'Examples',
                description: 'Zhanshi ruhe ba components, widgets he providers zuhe zai yiqi de zhenshi changjing moshi.',
            },
            labels: {
                arrow: '->',
            },
            items: {
                crudTable: {
                    title: 'CRUD table',
                    description: 'Wanzheng de create/read/update/delete liucheng, shiyong Grid jia modal Form. Tongguo Firebase shixian realtime gengxin.',
                },
                dashboard: {
                    title: 'Dashboard',
                    description: 'Metric cards, charts he recent-activity table, quanbu laizi dan yi DataProvider.',
                },
                nestedForm: {
                    title: 'Nested form',
                    description: 'Shiyong dot notation biaoshi shenceng duixiang, array index notation, yi ji yong Repeat chuli dongtai liebiao.',
                },
                fileManager: {
                    title: 'File manager',
                    description: 'Ba images he documents shangchuan dao Firebase Storage, bing tongguo gallery Grid liulan.',
                },
                googleSignIn: {
                    title: 'Google sign-in',
                    description: 'Shiyong Google jinxing OAuth2 sign-in, baohu routes, bing zhanshi yonghu profile.',
                },
            },
        },
    },
});
