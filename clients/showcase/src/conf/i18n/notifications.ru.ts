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
            detail: {
                title: 'Подробности и действия',
                description: 'Строка подробностей под заголовком, кнопки для действий из меню без открытия элемента (с индикатором загрузки, пока они работают) и внешние ссылки в новой вкладке. onItemClick сообщает, какой элемент открыт, чтобы отметить его прочитанным.',
                sourceTitle: 'Источник без Action',
                sourceDetail: 'crm · sources/notes/pricing.md',
                openAction: 'Открыть Action',
                blockedTitle: 'Задача заблокирована',
                blockedDetail: 'crm #12 · передана человеку',
                now: 'сейчас',
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
                    description: { description: 'Строка под заголовком каждого элемента: что и где.' },
                    actions: { description: 'Кнопки под элементом: действуют, не открывая его, с загрузкой во время промиса.' },
                    external: { description: 'Открывает url как адрес в новой вкладке, а не как маршрут.' },
                    onItemClick: { description: 'Вызывается при открытии элемента (например, чтобы отметить прочитанным); меню закрывается.' },
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
