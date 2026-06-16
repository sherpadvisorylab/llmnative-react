import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        upload: {
            page: {
                title: 'Upload',
                description: 'Три специализированных поля загрузки для изображений, документов и CSV-данных. Каждый вариант отдельно управляет локальным предпросмотром, привязкой файла и необязательным облачным хранилищем.',
            },
            sections: {
                variants: {
                    description: 'Выберите вариант, соответствующий типу файла. Все три расширяют FormFieldProps и привязывают результат к записи формы через свойство name.',
                },
                cloudStorage: {
                    title: 'Облачное хранилище',
                    description: 'Зарегистрируйте StorageProvider в App и передайте storagePath в UploadImage или UploadDocument, чтобы отправлять файлы в Firebase Storage или Supabase Storage вместо хранения их как локальный base64.',
                },
            },
            variants: {
                image: {
                    title: 'UploadImage',
                    description: 'Встроенная сетка миниатюр с overlay при наведении для предпросмотра, кадрирования и удаления. Поддерживает одно или несколько изображений.',
                },
                document: {
                    title: 'UploadDocument',
                    description: 'Список файлов с именем, размером и индикатором прогресса. Принимает любые типы файлов через фильтр accept.',
                },
                csv: {
                    title: 'UploadCSV',
                    description: 'CSV-парсер с drag-and-drop. Передает типизированные строки и имена полей в onDataLoaded. Работает отдельно, без Form.',
                },
            },
            labels: {
                storageNotice: 'Шоукейс работает офлайн: демо со storagePath требуют настроенного StorageProvider.',
            },
        },
    },
});
