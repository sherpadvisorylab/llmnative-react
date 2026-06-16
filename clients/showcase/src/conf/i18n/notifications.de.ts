import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'Benachrichtigungen',
                description: 'Benachrichtigungsmenue auf Basis von Dropdown und DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'Benachrichtigungsmenue',
                    description: 'Mit Notifications lassen sich aktuelle Updates hinter einem Glocken-Trigger mit Badge, Titel, Zeit und Icon anzeigen.',
                },
            },
            labels: {
                newDeploymentCompleted: 'Neue Bereitstellung abgeschlossen',
                storageUsageReached80: 'Speichernutzung hat 80 % erreicht',
                twoMinutesAgo: 'vor 2 Minuten',
                oneHourAgo: 'vor 1 Stunde',
            },
            propsDocs: {
                items: {
                    items: { description: 'Benachrichtigungseintraege im Dropdown.' },
                    badge: { description: 'Badge auf dem Glocken-Trigger.' },
                    wrapperClassName: { description: 'CSS-Klassen fuer den Wrapper.' },
                },
            },
            playground: {
                title: 'Benachrichtigungen',
                defaultBadge: '2',
            },
        },
    },
});
