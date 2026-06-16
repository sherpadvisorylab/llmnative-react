import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadDocument: {
            page: {
                title: 'UploadDocument',
                description: 'Поле загрузки документов с drag-and-drop, встроенным прогрессом, удаляемыми строками и необязательным редактированием имени файла. Запись Form хранит массив дескрипторов файлов.',
            },
            sections: {
                basicUpload: {
                    title: 'Базовая загрузка документов',
                    description: 'Загрузка одного файла с drag-and-drop. Поле локально считывает выбранный файл, показывает прогресс во время преобразования, а затем сохраняет загруженную запись в Form.',
                },
                multipleFiles: {
                    title: 'Несколько файлов',
                    description: 'Включите multiple, чтобы хранить несколько файлов в одном поле. Каждый загруженный файл становится строкой таблицы, а встроенное действие загрузки остается доступным, пока не будет достигнут max.',
                },
                editableFileNames: {
                    title: 'Редактируемые имена файлов',
                    description: 'Установите editable, чтобы каждая строка стала кликабельной. Нажатие на завершенную строку откроет встроенное модальное окно редактирования имени файла и сохранит новый fileName обратно в запись файла.',
                },
                acceptFilter: {
                    title: 'Фильтр accept',
                    description: 'Ограничивает системный выборщик файлов определенными расширениями. Та же строка accept также показывается в пустой drop-zone как визуальная подсказка о разрешенных форматах.',
                },
                requiredField: {
                    title: 'Обязательное поле',
                    description: 'Добавьте required, чтобы показать валидацию формы, когда поле пустое. Сообщение валидации выводится под областью загрузки через стандартный слот ошибки поля формы.',
                },
            },
            labels: {
                report: 'Отчет',
                attachmentsMax: 'Вложения (макс. 5)',
                deliverables: 'Результаты',
                csvExcelOnly: 'Только CSV / Excel',
                contractRequired: 'Договор (обязательно)',
            },
            propsDocs: {
                title: 'Свойства UploadDocument',
                items: {
                    name: { description: 'Имя поля, привязанного к записи Form' },
                    label: { description: 'Подпись над drop-zone или таблицей файлов' },
                    multiple: { description: 'Разрешает выбирать и хранить больше одного файла', default: 'false' },
                    editable: { description: 'Открывает модальное окно редактирования имени файла при клике по строке таблицы', default: 'false' },
                    accept: { description: 'Системный фильтр accept для input файла, показывается в picker и подсказке drop-zone', default: '".pdf,.doc,.docx,.txt,.iso"' },
                    max: { description: 'Максимальное число файлов, которое может храниться в поле', default: '100' },
                    required: { description: 'Помечает скрытый file input как обязательный и показывает сообщение валидации при пустом значении', default: 'false' },
                    onChange: { description: 'Вызывается при любом изменении массива файлов, сохраненного в записи Form' },
                    before: { description: 'Контент, отображаемый перед полем загрузки внутри внешнего wrapper' },
                    after: { description: 'Контент, отображаемый после поля загрузки внутри внешнего wrapper' },
                    className: { description: 'CSS-классы внутреннего контейнера поля' },
                    wrapperClassName: { description: 'CSS-классы внешнего элемента Wrapper' },
                },
            },
            playground: {
                title: 'Плейграунд UploadDocument',
                defaultLabel: 'Вложения',
            },
        },
    },
});
