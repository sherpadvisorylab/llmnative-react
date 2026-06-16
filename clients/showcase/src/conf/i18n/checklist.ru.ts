import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        checklist: {
            page: {
                title: 'Checklist',
                description: 'Вертикальный список checkbox для множественного выбора. Выбранные значения сохраняются как массив в записи формы.',
            },
            sections: {
                basic: { title: 'Базовый checklist', description: 'Отрисовывает checkbox для каждой опции. Предвыбранные значения приходят из defaultValues формы.' },
                permissions: { title: 'Checklist прав', description: 'Типичный шаблон для настройки ролей и прав доступа.' },
                requiredDisabled: { title: 'Required и disabled' },
            },
            labels: {
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                read: 'Чтение',
                write: 'Запись',
                delete: 'Удаление',
                admin: 'Админ',
                technologies: 'Технологии',
                selectTechnologies: 'Выберите технологии',
                permissions: 'Права',
                required: 'Обязательно',
                disabled: 'Отключено',
            },
            propsDocs: {
                title: 'Свойства Checklist',
                items: {
                    name: { description: 'Имя поля как ключ формы. Сохраняет выбранные значения как массив.' },
                    label: { description: 'Групповая метка над checkbox.' },
                    title: { description: 'Нативный атрибут title у каждого checkbox.' },
                    options: { description: 'Статические опции checkbox.' },
                    optionsSource: { description: 'Путь DataProvider для получения опций checkbox.', help: 'Этот playground использует MockDataProvider. Измените записи ниже, чтобы поменять возвращаемые опции.' },
                    required: { description: 'Помечает поле как обязательное.' },
                    disabled: { description: 'Отключает все checkbox.' },
                    readOnlyAfterSet: { description: 'Поле становится только для чтения после установки значения.' },
                    defaultValue: { description: 'Начальные выбранные значения.' },
                    feedback: { description: 'Сообщение валидации под списком.' },
                    validator: { description: 'Пользовательская валидация. Верните ошибку, чтобы заблокировать отправку.' },
                    order: { description: 'Порядок сортировки опций. По умолчанию label по возрастанию.' },
                    before: { description: 'Содержимое перед checklist внутри input group.' },
                    after: { description: 'Содержимое после checklist внутри input group.' },
                    onChange: { description: 'Пользовательский обработчик change из контекста Form.' },
                    itemClassName: { description: 'CSS-классы для обертки каждого checkbox.' },
                    className: { description: 'CSS-классы корневого элемента checklist.' },
                    wrapperClassName: { description: 'CSS-классы внешней обертки.' },
                },
            },
            playground: {
                title: 'Checklist',
            },
        },
    },
});
