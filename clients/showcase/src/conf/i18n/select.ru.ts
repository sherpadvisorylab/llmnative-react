import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        select: {
            page: {
                title: 'Select',
                description: 'Нативный выпадающий select. Опции могут быть статическими или загружаться из DataProvider.',
            },
            sections: {
                basicDropdown: {
                    title: 'Базовый выпадающий список',
                    description: 'Статический массив опций, самый простой сценарий использования.',
                },
                requiredSelect: {
                    title: 'Обязательный select',
                    description: 'Используйте required, когда поле должно быть выбрано до отправки формы.',
                },
                noPlaceholderOption: {
                    title: 'Без placeholder-опции',
                    description: 'Установите placeholderOption в null, чтобы скрыть пустую строку. Если значение не задано, Select автоматически выберет первую доступную опцию.',
                },
                readOnlyAfterSet: {
                    title: 'Только чтение после выбора',
                    description: 'Используйте readOnlyAfterSet, когда выбор должен блокироваться после первой установки. Если значение уже есть, select рендерится отключенным.',
                },
                dataProviderBacked: {
                    title: 'С DataProvider',
                    description: 'Передайте optionsSource вместо options, чтобы загружать опции из зарегистрированного DataProvider.',
                },
            },
            labels: {
                admin: 'Admin',
                editor: 'Editor',
                viewer: 'Viewer',
                italy: 'Италия',
                germany: 'Германия',
                france: 'Франция',
                spain: 'Испания',
                unitedKingdom: 'Великобритания',
                unitedStates: 'США',
                category: 'Категория',
                chooseCategory: 'Выберите категорию',
                role: 'Роль',
                country: 'Страна',
                selectPlaceholder: 'Выбрать...',
                chooseRolePlaceholder: 'Выберите роль',
                sales: 'Продажи',
                operations: 'Операции',
                support: 'Поддержка',
                draft: 'черновик',
                review: 'проверка',
                published: 'опубликовано',
            },
            propsDocs: {
                title: 'Свойства Select',
                items: {
                    name: { description: 'Имя поля как ключ формы.' },
                    label: { description: 'Метка над select.' },
                    title: { description: 'Нативный атрибут title элемента select.' },
                    options: { description: 'Статический массив опций.', help: 'Поддерживает массивы option, строк или чисел.' },
                    optionsSource: { description: 'Путь DataProvider для загрузки опций.', help: 'Playground использует MockDataProvider. Измените записи ниже, чтобы поменять возвращаемые опции.' },
                    placeholderOption: { description: 'Placeholder-опция, когда ничего не выбрано. Установите null, чтобы скрыть.' },
                    required: { description: 'Помечает поле как обязательное.' },
                    disabled: { description: 'Отключает select.' },
                    readOnlyAfterSet: { description: 'Поле становится только для чтения после установки значения.' },
                    defaultValue: { description: 'Начальное выбранное значение.' },
                    feedback: { description: 'Сообщение валидации под полем.' },
                    validator: { description: 'Пользовательская валидация. Верните текст ошибки, чтобы заблокировать отправку.' },
                    order: { description: 'Порядок сортировки опций. По умолчанию label по возрастанию.' },
                    before: { description: 'Содержимое перед select внутри input group.' },
                    after: { description: 'Содержимое после select внутри input group.' },
                    onChange: { description: 'Пользовательский обработчик change из контекста Form.' },
                    className: { description: 'CSS-классы элемента select.' },
                    wrapperClassName: { description: 'CSS-классы внешней обертки.' },
                },
            },
            playground: {
                title: 'Select',
            },
        },
    },
});
