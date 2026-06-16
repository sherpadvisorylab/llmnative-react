import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'Notifiche',
                description: 'Menu notifiche costruito sopra Dropdown e DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'Menu notifiche',
                    description: 'Usa Notifications per mostrare aggiornamenti recenti dietro un trigger a campanella con badge, titolo, orario e icona.',
                },
            },
            labels: {
                newDeploymentCompleted: 'Nuovo deploy completato',
                storageUsageReached80: "L'utilizzo dello storage ha raggiunto l'80%",
                twoMinutesAgo: '2 minuti fa',
                oneHourAgo: '1 ora fa',
            },
            propsDocs: {
                items: {
                    items: { description: 'Record di notifica renderizzati nel menu.' },
                    badge: { description: 'Badge mostrato sul toggle della campanella.' },
                    wrapperClassName: { description: 'Classi CSS sul wrapper.' },
                },
            },
            playground: {
                title: 'Notifiche',
                defaultBadge: '2',
            },
        },
    },
});
