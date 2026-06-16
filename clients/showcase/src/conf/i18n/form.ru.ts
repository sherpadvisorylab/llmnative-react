import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        form: {
            page: { title: 'Form widget', description: 'Полноценная CRUD-форма: загружает запись из DataProvider, проверяет, сохраняет и опционально удаляет. Оборачивай поля как children — Form соединяет всё автоматически через React context.' },
            sections: {
                newRecord: { title: 'Новая запись (keyGenerator)', description: 'Укажи path (коллекция) + keyGenerator для создания новой записи. Чтение БД не выполняется. Save вызывает set() по пути path/сгенерированныйКлюч.' },
                editExisting: { title: 'Редактировать существующую запись', description: 'Укажи полный путь к записи, включая ключ, без defaultValues. Form читает запись при монтировании, заполняет поля и сохраняет обратно по тому же пути.' },
                lifecycleHooks: { title: 'Хуки жизненного цикла', description: 'onLoad преобразует данные после чтения. onSave преобразует перед записью. onComplete выполняется после каждого действия.' },
                lifecycleHooksNote: 'Пример кода — хуки визуально не отличаются от стандартной формы.',
                nestedObjects: { title: 'Вложенные объекты и массивы', description: 'Точечная нотация отображается на ключи вложенных объектов. Индексная нотация массива отображается на элементы массива.' },
            },
        },
    },
});
