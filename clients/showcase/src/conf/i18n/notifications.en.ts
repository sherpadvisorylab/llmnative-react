import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'Notifications',
                description: 'Notification dropdown built on top of Dropdown and DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'Notification menu',
                    description: 'Use Notifications to expose recent updates behind a bell trigger with badge, title, time and icon metadata.',
                },
            },
            labels: {
                newDeploymentCompleted: 'New deployment completed',
                storageUsageReached80: 'Storage usage reached 80%',
                twoMinutesAgo: '2 minutes ago',
                oneHourAgo: '1 hour ago',
            },
            propsDocs: {
                items: {
                    items: { description: 'Notification records rendered in the dropdown.' },
                    badge: { description: 'Badge displayed on the bell toggle.' },
                    wrapperClassName: { description: 'CSS classes on wrapper.' },
                },
            },
            playground: {
                title: 'Notifications',
                defaultBadge: '2',
            },
        },
    },
});
