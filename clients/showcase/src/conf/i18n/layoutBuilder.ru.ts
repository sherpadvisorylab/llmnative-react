import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        layoutBuilder: {
            page: {
                title: 'LayoutBuilder',
                description: 'Интерактивный 12-колоночный builder для размещения перетаскиваемых токенов полей.',
            },
            sections: {
                dragFields: {
                    title: 'Перетащите поля в строку',
                    description: 'Перетаскивайте токены полей из списка в строку builder, чтобы собрать layout, сохраняемый в текущей записи Form.',
                },
            },
            labels: {
                dragFieldsIntoRow: 'Перетащите поля в строку',
                fields: 'Поля',
            },
            propsDocs: {
                title: 'Props LayoutBuilder',
                items: {
                    name: { description: 'Имя поля Form, в котором хранятся элементы layout строки.' },
                    defaultSpan: { description: 'Ширина колонки по умолчанию для добавленных полей.', default: '1' },
                    heightPx: { description: 'Высота строки builder в пикселях.', default: '100' },
                    ref: { description: 'Императивное API: getValue, setValue, clear.' },
                },
            },
            playground: {
                title: 'LayoutBuilder',
            },
        },
    },
});
