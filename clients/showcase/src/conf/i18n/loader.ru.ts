import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loader: {
            page: { title: 'Loader', description: 'Overlay-spinner, который оборачивает любой контент. Когда show=true, поверх children отображается размытый фон с тематическим spinner. Контент остается в DOM и мгновенно показывается после скрытия loader.' },
            sections: {
                showHide: { title: 'Показать / скрыть', description: 'Переключайте show, чтобы накрыть или показать обернутый контент. Контент всегда остается смонтированным: никакого layout shift при исчезновении loader.' },
                custom: { title: 'Пользовательская иконка и сообщение', description: 'Переопределяет значения темы для конкретного экземпляра через icon, title и description. Значение icon - это имя иконки: подойдет любая иконка, поддерживаемая настроенным провайдером.' },
                card: { title: 'Интеграция с Card', description: 'Card предоставляет prop showLoader как удобное сокращение: она автоматически оборачивает body card в Loader.' },
                other: { title: 'Другие индикаторы загрузки во фреймворке', description: '@llmnative/react включает дополнительные паттерны загрузки для разных сценариев.' },
            },
        },
    },
});
