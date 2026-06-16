import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        actionButton: {
            page: { title: 'ActionButton', description: 'Кнопка для немедленного синхронного действия с иконкой, badge, анимацией нажатия и системой вариантов. Для асинхронных операций используйте LoadingButton.' },
            sections: {
                variants: { description: 'Используйте prop variant, чтобы применять семантические цвета без ручного написания CSS-классов.' },
                iconLabel: { title: 'Комбинации иконки и метки', description: 'icon рендерит иконку из активного провайдера. Для кнопки только с иконкой не передавайте label и добавьте title для доступности.' },
                onClick: { title: 'Обработчик onClick', description: 'onClick автоматически останавливает всплытие. Кнопка не управляет состоянием загрузки - для асинхронной работы используйте LoadingButton.' },
                disabled: { title: 'Отключенное состояние', description: 'disabled блокирует нажатие и показывает курсор "не разрешено" на wrapper. Визуальная форма кнопки сохраняется.' },
                badge: { title: 'Badge-уведомление', description: 'badge рендерит справа сверху счетчик или текстовый индикатор. Полезно для ожидающих элементов.' },
            },
        },
    },
});
