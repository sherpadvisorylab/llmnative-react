import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        buttons: {
            page: { title: 'Buttons', description: 'Семантические состояния кнопок и специализированные компоненты для мгновенных действий, асинхронных действий, навигации и внешних ссылок.' },
            sections: {
                nativeStates: { title: 'Нативные классы состояний', description: 'Используйте встроенные в фреймворк классы состояний `btn` для простых кнопок и ссылок.' },
                outlineLink: { title: 'Outline и link', description: 'Outline-состояния используют те же семантические имена и токены, что и сплошные кнопки.' },
                components: { title: 'Компоненты кнопок', description: 'Используйте специальные страницы с примерами, props и playground для каждого кнопочного компонента.' },
            },
            cards: {
                actionButton: 'Мгновенные действия с иконками, badge, отключенным состоянием и анимацией нажатия.',
                loadingButton: 'Асинхронные действия с состоянием загрузки, текстом прогресса и автоматическим отключением.',
                navigation: 'Помощники для возврата назад и внешних ссылок.',
            },
        },
    },
});
