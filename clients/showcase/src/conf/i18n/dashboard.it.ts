import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        dashboard: {
            page: { title: 'Dashboard', description: 'Card metriche e tabella attività recenti basate su MockDataProvider.' },
            sections: {
                metricsOverview: { title: 'Panoramica metriche', description: 'Indicatori chiave renderizzati con Card. I valori sono calcolati dai dati mock.' },
                recentOrders: { title: 'Ordini recenti', description: 'Tabella ordinabile con badge di stato. Basata su GridDB — azioni add/edit/delete disponibili.' },
            },
        },
    },
});
