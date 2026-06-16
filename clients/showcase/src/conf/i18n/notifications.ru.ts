import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'Uvedomleniya',
                description: 'Vypadayushchee menu uvedomleniy na osnove Dropdown i DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'Menyu uvedomleniy',
                    description: 'Notifications pokazyvaet poslednie sobytiya cherez knopku-kolokolchik s badge, zagolovkom, vremenem i ikonkoj.',
                },
            },
            labels: {
                newDeploymentCompleted: 'Novyy deploy zavershen',
                storageUsageReached80: 'Ispolzovanie khranilishcha dostiglo 80%',
                twoMinutesAgo: '2 minuty nazad',
                oneHourAgo: '1 chas nazad',
            },
            propsDocs: {
                items: {
                    items: { description: 'Zapisi uvedomleniy v vypadayushchem menu.' },
                    badge: { description: 'Badge na pereklyuchatele kolokolchika.' },
                    wrapperClassName: { description: 'CSS-klassy obertki.' },
                },
            },
            playground: {
                title: 'Uvedomleniya',
                defaultBadge: '2',
            },
        },
    },
});
