import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadImage: {
            page: {
                title: 'UploadImage',
                description: 'Поле загрузки изображений со встроенным предпросмотром миниатюр, действиями в overlay при наведении и необязательной поддержкой нескольких изображений. Сохраняет дескрипторы файлов в записи Form.',
            },
            sections: {
                singleImage: {
                    title: 'Одно изображение',
                    description: 'Базовое использование: по одному изображению с миниатюрой фиксированного размера. После загрузки используйте действия overlay для предпросмотра или удаления.',
                },
                multipleImages: {
                    title: 'Несколько изображений',
                    description: 'Передайте multiple, чтобы разрешить выбор нескольких изображений. Каждый файл отображается отдельной миниатюрой. Загрузка останавливается при достижении лимита max.',
                },
                editableCrop: {
                    title: 'Редактируемо (обрезка)',
                    description: 'Добавьте editable, чтобы при наведении показывать иконку карандаша. По клику откроется редактор изображений с инструментами обрезки и масштаба, а созданные варианты сохранятся в этой записи файла внутри Form.',
                },
                acceptFilter: {
                    title: 'Фильтр accept',
                    description: 'Ограничивает выбор файлов определенными MIME-типами. Браузер применяет этот фильтр в стандартном окне выбора файлов.',
                },
                responsiveSrcset: {
                    title: 'Адаптивные изображения (srcset)',
                    description: 'Передайте generateSrcset вместе с uploadPath, чтобы компонент автоматически создавал canvas-масштабированные варианты 400w и 800w. Каждый вариант сохраняется в хранилище с суффиксом _400w / _800w в имени файла. Итоговые значения srcset и sizes сохраняются в записи Form рядом с исходным URL. Демо использует in-memory mock хранилище.',
                },
            },
            labels: {
                avatar: 'Аватар',
                galleryMax: 'Галерея (макс. 6)',
                coverPhotoEditable: 'Фото обложки (редактируемое)',
                pngOnly: 'Только PNG',
                heroImage: 'Главное изображение',
            },
            propsDocs: {
                title: 'Свойства UploadImage',
                items: {
                    name: { description: 'Имя поля, привязанного к записи Form' },
                    label: { description: 'Подпись над областью загрузки' },
                    multiple: { description: 'Разрешает выбирать больше одного изображения за раз', default: 'false' },
                    editable: { description: 'Показывает кнопку обрезки/редактирования при наведении; открывает редактор изображений', default: 'false' },
                    previewWidth: { description: 'Ширина миниатюры в пикселях', default: '100' },
                    previewHeight: { description: 'Высота миниатюры в пикселях', default: '100' },
                    accept: { description: 'Принимаемые MIME-типы (например, "image/png,image/jpeg")', default: '"image/*"' },
                    max: { description: 'Максимально допустимое количество файлов', default: '100' },
                    required: { description: 'Помечает поле как обязательное; блокирует отправку формы, если оно пустое', default: 'false' },
                    onChange: { description: 'Вызывается при каждом изменении списка файлов с обновленным значением и контекстом формы' },
                    before: { description: 'Контент, отображаемый перед сеткой изображений внутри внешнего wrapper' },
                    after: { description: 'Контент, отображаемый после сетки изображений внутри внешнего wrapper' },
                    className: { description: 'CSS-классы внутреннего контейнера' },
                    wrapperClassName: { description: 'CSS-классы внешнего wrapper' },
                    uploadPath: { description: 'Префикс пути хранилища для загружаемых файлов. Требует StorageProvider-предка. При generateSrcset каждый вариант ширины сохраняется как <uploadPath>/<name>_400w.<ext>.' },
                    srcsetWidths: { description: 'Массив пиксельных ширин для адаптивных вариантов (например, [400, 800]). Каждый вариант сохраняется как <имя>_<ширина>w.<расш> и заполняет srcset/sizes в записи Form. Требует uploadPath и StorageProvider.' },
                },
            },
            playground: {
                title: 'Плейграунд UploadImage',
                defaultLabel: 'Галерея',
            },
        },
    },
});
