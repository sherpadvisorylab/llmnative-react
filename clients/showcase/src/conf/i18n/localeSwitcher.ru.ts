import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        localeSwitcher: {
            page: {
                title: 'LocaleSwitcher',
                description: 'Выпадающий список для переключения активной локали во время работы приложения. Ничего не рендерит, если настроена только одна локаль, и сохраняет выбор в cookie llmnative_locale.',
            },
            sections: {
                liveDemo: {
                    title: 'Живая демонстрация',
                    description: 'Переключатель ниже управляет языком всего showcase. Настроенные переводы доступны сразу, поэтому при смене языка обновляются sidebar, кнопки и превью компонентов.',
                },
                nullWhenSingleLocale: {
                    title: 'Null при одной настроенной локали',
                    description: 'LocaleSwitcher автоматически возвращает null, когда translations содержит ноль или одну локаль. Потребителю не нужен условный рендеринг.',
                },
                customLabels: {
                    title: 'Пользовательские подписи локалей',
                    description: 'Свойство labels переопределяет или расширяет встроенную карту названий локалей. Это удобно для родных названий, сокращений или собственных бейджей.',
                },
                cookiePersistence: {
                    title: 'Сохранение через cookie',
                    description: 'Выбранная локаль сохраняется в first-party cookie с TTL в 1 год. При следующей загрузке cookie имеет приоритет над locale, заданной в App.i18n.',
                },
                appConfiguration: {
                    title: 'Настройка переводов в App',
                    description: 'Передайте translations в App.i18n, чтобы сделать доступными дополнительные локали. Каждый ключ локали становится доступным вариантом выбора, а отсутствующие ключи откатываются к английскому.',
                },
            },
            labels: {
                language: 'Язык',
                italian: 'Итальянский',
                localeBadgeEn: 'EN',
                localeBadgeIt: 'IT',
                localeBadgeDe: 'DE',
                localeBadgeRu: 'RU',
                localeBadgeZh: 'ZH',
                localeBadgeAr: 'AR',
            },
            propsDocs: {
                items: {
                    icon: { description: 'Имя иконки, передаваемое в компонент Icon. Подходит любая иконка, которую поддерживает настроенный provider.' },
                    label: { description: 'Необязательная видимая подпись перед select.' },
                    labels: { description: 'Позволяет переопределять или расширять отображаемые имена кодов локалей. Объединяется со встроенными значениями по умолчанию.' },
                    className: { description: 'Дополнительные CSS-классы для элемента-обертки.' },
                },
            },
            playground: {
                title: 'LocaleSwitcher',
                props: {
                    icon: { description: 'Имя иконки, передаваемое в компонент Icon. Подходит любая иконка, которую поддерживает настроенный provider.' },
                    label: { description: 'Необязательная видимая подпись перед select.' },
                    className: { description: 'Дополнительные CSS-классы для элемента-обертки.' },
                },
            },
        },
    },
});
