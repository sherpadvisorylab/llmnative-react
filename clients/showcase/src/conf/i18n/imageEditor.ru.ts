import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageEditor: {
            page: {
                title: 'ImageEditor',
                description: 'Полнофункциональный виджет редактирования изображений на базе tui-image-editor. Поддерживает обрезку, отражение, поворот, свободное рисование, фигуры, текст и масштабирование. Доступен inline и внутри modal.',
            },
            sections: {
                inlineEditor: {
                    title: 'Inline-редактор',
                    description: 'Разместите редактор прямо на странице. Панель инструментов отображается сверху, а холст заполняет всю доступную ширину.',
                },
                modalEditor: {
                    title: 'Редактор в modal',
                    description: 'Передайте mode="modal", чтобы открыть редактор в полноэкранном overlay. Заголовок и панель инструментов объединены в одну аккуратную строку header, а onClose вызывается при закрытии.',
                },
            },
            labels: {
                sampleTitle: 'Пример',
                sampleSubtitle: 'Пример - отредактируйте это изображение',
                lastSavedOutput: 'Последний сохраненный результат:',
                savedResultAlt: 'Сохраненный результат',
                openEditorInModal: 'Открыть редактор в modal',
                editPhoto: 'Редактировать фото',
                savedResult: 'Сохраненный результат:',
                savedAlt: 'Сохранено',
            },
            propsDocs: {
                title: 'Props ImageEditor',
                items: {
                    src: { description: 'URL или data URL изображения для редактирования.' },
                    title: { description: 'Заголовок, показываемый в header modal, используется только при mode="modal".', default: '"Image Editor"' },
                    width: { description: 'Максимальная CSS-ширина холста в пикселях.', default: '700' },
                    height: { description: 'Максимальная CSS-высота холста в пикселях.', default: '500' },
                    mode: { description: 'Рендерить внутри modal overlay ("modal") или прямо на странице ("inline").', default: '"inline"' },
                    onImageLoad: { description: 'Callback, вызываемый после полной загрузки изображения в редактор.' },
                    onClose: { description: 'Callback, вызываемый при закрытии modal, доступен только в modal-режиме.' },
                    onSave: { description: 'Callback, вызываемый при нажатии Save. Получает отредактированное изображение как data URL.' },
                },
            },
        },
    },
});
