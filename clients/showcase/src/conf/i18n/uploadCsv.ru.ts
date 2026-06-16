import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadCsv: {
            page: {
                title: 'UploadCSV',
                description: 'Загрузчик одиночного CSV или TSV файла с drag-and-drop, интеграцией PapaParse и удобным для предпросмотра результатом парсинга через onDataLoaded.',
            },
            sections: {
                basicUpload: {
                    title: 'Базовая загрузка CSV',
                    description: 'Перетащите CSV или TSV файл в зону или нажмите для выбора. После парсинга компонент переходит в состояние loaded и передает строки, заголовки и исходный File через onDataLoaded.',
                },
                normalizedKeys: {
                    title: 'Нормализованные ключи + удаление пустых полей',
                    description: 'normalizeKeys преобразует имена заголовков перед тем, как они попадут в fields и объекты строк. removeEmptyFields удаляет из каждой строки записи со значением пустая строка или null.',
                },
                customFieldTransform: {
                    title: 'Пользовательское преобразование полей',
                    description: 'Используйте onParseField, чтобы перехватывать каждую пару [key, value] при парсинге. Верните измененную пару, чтобы сохранить ее, или undefined, чтобы убрать поле из итогового объекта строки.',
                },
                customDelimiter: {
                    title: 'Пользовательский разделитель',
                    description: 'Передавайте delimiter, если файл ненадежно определяется PapaParse автоматически, например для экспортов с разделителем точка с запятой из табличных инструментов.',
                },
            },
            labels: {
                emptyState: 'Файл еще не загружен.',
                rows: 'строк',
                fields: 'полей',
                andMoreRows: '...и еще {count} строк',
                basicLabel: 'Перетащите или нажмите для загрузки CSV',
                normalizeLabel: 'Загрузите CSV, чтобы увидеть нормализованные ключи',
                transformLabel: 'Загрузите CSV - столбцы, начинающиеся с _, будут отброшены',
                delimiterLabel: 'Загрузите CSV с разделителем точка с запятой',
            },
            propsDocs: {
                title: 'Свойства UploadCSV',
                items: {
                    name: { description: 'Имя поля, используемое для атрибута data-name у wrapper' },
                    onDataLoaded: { description: 'Вызывается с распарсенными строками, полями заголовка и исходным File после успешного парсинга' },
                    onClear: { description: 'Вызывается, когда загруженный файл удаляется из UI компонента' },
                    label: { description: 'Подпись над drop-zone' },
                    icon: { description: 'Имя иконки, отображаемой внутри drop-zone', default: '"upload"' },
                    delimiter: { description: 'Необязательный разделитель для PapaParse. Если не указан, PapaParse определит его автоматически.' },
                    normalizeKeys: { description: 'Нормализует имена заголовков с помощью normalizeKey перед выдачей в fields и объектах строк', default: 'false' },
                    removeEmptyFields: { description: 'Удаляет из строк поля, значение которых равно пустой строке или null', default: 'false' },
                    onParseField: { description: 'Преобразует или отбрасывает каждую пару [key, value] во время парсинга. Верните undefined, чтобы пропустить поле.' },
                    before: { description: 'Контент, отображаемый перед uploader внутри внешнего wrapper' },
                    after: { description: 'Контент, отображаемый после uploader внутри внешнего wrapper' },
                    className: { description: 'CSS-классы внутреннего контейнера uploader' },
                    wrapperClassName: { description: 'CSS-классы внешнего wrapper' },
                },
            },
            playground: {
                title: 'Плейграунд UploadCSV',
                defaultLabel: 'Перетащите или нажмите для загрузки CSV',
            },
        },
    },
});
