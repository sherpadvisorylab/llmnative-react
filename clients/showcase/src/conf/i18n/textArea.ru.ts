import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        textArea: {
            page: {
                title: 'TextArea',
                description: 'Управляемое многострочное текстовое поле, интегрированное с контекстом Form.',
            },
            sections: {
                basicTextarea: { title: 'Базовая textarea' },
                autoResize: {
                    title: 'Автоизменение размера с maxRows',
                    description: 'Установите maxRows, чтобы textarea росла вместе с содержимым. После достижения лимита рост прекращается и появляется прокрутка.',
                },
                feedbackPlaceholder: { title: 'С feedback и placeholder' },
                addons: { title: 'С addon до и после' },
            },
            labels: {
                notes: 'Заметки',
                writeShortNote: 'Напишите короткую заметку...',
                initialNote: 'Начальная заметка',
                bio: 'О себе',
                startTyping: 'Начните вводить текст - textarea будет расти по мере добавления строк...',
                description: 'Описание',
                describeIssue: 'Опишите проблему подробно...',
                beSpecific: 'Будьте как можно конкретнее.',
                signedNote: 'Подписанная заметка',
                note: 'Заметка',
            },
            propsDocs: {
                title: 'Свойства TextArea',
                items: {
                    name: { description: 'Имя поля как ключ формы.' },
                    label: { description: 'Метка над textarea.' },
                    placeholder: { description: 'Текст-подсказка.' },
                    required: { description: 'Помечает поле как обязательное.' },
                    disabled: { description: 'Отключает textarea.' },
                    readOnlyAfterSet: { description: 'Textarea становится только для чтения после установки значения.' },
                    defaultValue: { description: 'Начальное значение textarea вне контекста Form.' },
                    rows: { description: 'Фиксированное число видимых строк. Игнорируется, если maxRows задан и содержимое короче.' },
                    maxRows: { description: 'Автоизменение высоты до указанного числа строк, затем появляется прокрутка.' },
                    feedback: { description: 'Текст подсказки или валидации под полем.' },
                    before: { description: 'Содержимое input-group перед textarea.' },
                    after: { description: 'Содержимое input-group после textarea.' },
                    id: { description: 'Явный id для элемента textarea. Если не указан, генерируется автоматически.' },
                    onChange: { description: 'Пользовательский обработчик change из Form.' },
                    textareaRef: { description: 'Ref, передаваемый во внутренний элемент textarea.' },
                    validator: { description: 'Пользовательская валидация. Верните текст ошибки, чтобы заблокировать отправку.' },
                    className: { description: 'Дополнительные CSS-классы элемента textarea.' },
                    wrapperClassName: { description: 'CSS-классы внешней обертки.' },
                    labelClassName: { description: 'CSS-классы элемента label.' },
                },
            },
            playground: {
                title: 'TextArea',
            },
        },
    },
});
