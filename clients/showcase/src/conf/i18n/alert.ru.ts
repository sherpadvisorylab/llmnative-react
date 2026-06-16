import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        alert: {
            page: { title: 'Alert', description: 'Контекстные сообщения обратной связи для пользователя. Поддерживает иконки, авто-закрытие и фиксированное позиционирование.' },
            sections: {
                variants: { description: 'У каждого типа есть предустановленные цвета и иконка.' },
                appearance: { title: 'Внешний вид', description: 'appearance="text" отображает компактный встроенный индикатор: без фона, без рамки, ширина подстраивается под содержимое. Идеально для статусных сообщений рядом с кнопками.' },
                withoutIcon: { title: 'Без иконки' },
                autoDismiss: { title: 'Авто-закрытие', description: 'Alert автоматически закрывается после указанного таймаута (мс).' },
                placement: { title: 'Режимы размещения', description: 'placement управляет тем, где рендерится alert: inline (по умолчанию, в обычном потоке документа) или fixed (закреплен во viewport через portal поверх всего содержимого).' },
            },
        },
    },
});
