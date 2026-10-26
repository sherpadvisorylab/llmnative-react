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
            detail: {
                title: 'Detail and actions',
                description: 'A detail line under the title, buttons to act from the menu without opening the item (loading while they work) and external links in a new tab. onItemClick tells which item was opened, to mark it read.',
                sourceTitle: 'Source without its Action',
                sourceDetail: 'crm · sources/notes/pricing.md',
                openAction: 'Open the Action',
                blockedTitle: 'Issue blocked',
                blockedDetail: 'crm #12 · handed to a person',
                now: 'now',
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
                    description: { description: 'Line under the title of each item: what and where.' },
                    actions: { description: 'Buttons under the item: they act without opening it, loading while the promise runs.' },
                    external: { description: 'Opens the url as an address in a new tab instead of a route.' },
                    onItemClick: { description: 'Called when an item is opened (e.g. to mark it read); the menu closes.' },
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
