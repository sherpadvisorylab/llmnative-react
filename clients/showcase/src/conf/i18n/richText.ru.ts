import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        richText: {
            page: {
                title: 'RichText',
                description: 'WYSIWYG редактор форматированного текста, интегрированный с контекстом формы. Загружает TipTap лениво только при монтировании.',
            },
            sections: {
                basicUsage: { title: 'Базовое использование', description: 'Поместите RichText внутрь Form как любое другое поле. Значение хранится как HTML по умолчанию.' },
                toolbarModes: { title: 'Режимы панели инструментов', description: '"fixed" показывает фиксированную панель. "floating" показывает всплывающую панель при выделении. false скрывает панель.' },
                customCommands: { title: 'Пользовательские команды панели', description: 'Передайте toolbarCommands для выбора кнопок. Используйте "|" как разделитель.' },
                tableSupport: { title: 'Поддержка таблиц', description: 'Добавьте "table" в toolbarCommands для кнопки вставки таблицы.' },
                sourceCode: { title: 'Режим исходного кода', description: 'Добавьте "sourceCode" для переключения между WYSIWYG и сырым HTML.' },
                statusBar: { title: 'Строка состояния', description: 'Установите statusBar={true} для отображения строки состояния по умолчанию.' },
                outputFormats: { title: 'Форматы вывода', description: '"html" хранит HTML. "json" хранит JSON-документ TipTap. "text" хранит только простой текст.' },
                disabledState: { title: 'Отключённое состояние', description: 'Свойство disabled делает весь редактор доступным только для чтения.' },
            },
            labels: {
                articleBody: 'Тело статьи',
                description: 'Описание',
                comment: 'Комментарий',
                notes: 'Заметки',
                content: 'Содержимое',
                startTyping: 'Начните вводить...',
            },
            propsDocs: {
                title: 'Свойства RichText',
                items: {
                    name: { description: 'Имя поля как ключ формы.' },
                    label: { description: 'Метка над редактором.' },
                    required: { description: 'Отмечает поле как обязательное.' },
                    placeholder: { description: 'Текст заполнителя в пустом редакторе.' },
                    disabled: { description: 'Делает редактор только для чтения.' },
                    toolbar: { description: 'Позиция панели инструментов: "fixed", "floating" или false.' },
                    toolbarCommands: { description: 'Упорядоченный список команд панели инструментов.' },
                    outputFormat: { description: 'Формат хранения: "html", "json" или "text".' },
                    statusBar: { description: 'Включить строку состояния.' },
                    minHeight: { description: 'Минимальная высота редактора в пикселях.' },
                    maxHeight: { description: 'Максимальная высота в пикселях.' },
                    uploadPath: { description: 'Путь StorageProvider для команд загрузки.' },
                    feedback: { description: 'Вспомогательный текст под редактором.' },
                    defaultValue: { description: 'Начальное значение вне контекста формы.' },
                    validator: { description: 'Пользовательская функция проверки.' },
                    id: { description: 'Явный идентификатор элемента редактора.' },
                    labelClassName: { description: 'CSS-классы для элемента метки.' },
                    className: { description: 'CSS-классы для контейнера редактора.' },
                    wrapperClassName: { description: 'CSS-классы для внешней обёртки.' },
                    before: { description: 'Содержимое перед обёрткой редактора.' },
                    after: { description: 'Содержимое после обёртки редактора.' },
                    onChange: { description: 'Пользовательский обработчик изменений.' },
                },
            },
            playground: { title: 'RichText' },
        },
    },
});
