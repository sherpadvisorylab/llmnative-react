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
            },
            labels: {
                avatar: 'Аватар',
                galleryMax: 'Галерея (макс. 6)',
                coverPhotoEditable: 'Фото обложки (редактируемое)',
                pngOnly: 'Только PNG',
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
                },
            },
            playground: {
                title: 'Плейграунд UploadImage',
                defaultLabel: 'Галерея',
            },
        },
    },
});
