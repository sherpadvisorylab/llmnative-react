import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loadingButton: {
            page: { title: 'LoadingButton', description: 'Асинхронная кнопка, которая сама себя отключает, пока выполняется работа. Поддерживает потоковые обновления метки через setMessage.' },
            sections: {
                asyncSave: { title: 'Асинхронное сохранение', description: 'Передайте асинхронный onClick. Кнопка показывает spinner и блокирует повторные нажатия, пока promise не завершится.' },
                customLabel: { title: 'Пользовательская метка загрузки', description: 'loadingLabel заменяет стандартную надпись "Save…" во время работы spinner.' },
                streaming: { title: 'Потоковая метка через setMessage', description: 'Второй аргумент onClick - setMessage. Вызывайте его в любой момент асинхронной операции, чтобы в реальном времени обновлять метку загрузки. Полезно для многошаговых процессов.' },
                disabled: { title: 'Отключенное состояние', description: 'disabled оставляет кнопку неактивной независимо от цикла загрузки.' },
                controlled: { title: 'Управляемая загрузка (loading)', description: 'loading позволяет родительскому компоненту управлять состоянием загрузки извне - полезно, когда кнопка участвует в более крупном процессе отправки формы.' },
                variants: { description: 'LoadingButton поддерживает те же токены вариантов, что и ActionButton.' },
            },
        },
    },
});
