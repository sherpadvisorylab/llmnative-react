import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        dashboard: {
            page: { title: 'Dashboard', description: 'Metric cards and a recent-activity table powered by MockDataProvider.' },
            sections: {
                metricsOverview: { title: 'Metrics overview', description: 'Key business metrics rendered with Card components. Values computed from the mock data.' },
                recentOrders: { title: 'Recent orders', description: 'Full sortable table with status badges. Powered by GridDB — add/edit/delete actions available.' },
            },
        },
    },
});
