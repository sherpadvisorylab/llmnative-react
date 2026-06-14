import type { DeepPartial } from '@llmnative/react';
import type { I18nDict } from '@llmnative/react';

const ru: DeepPartial<I18nDict> = {
    common: {
        save: 'Сохранить', cancel: 'Отменить', delete: 'Удалить', close: 'Закрыть',
        back: 'Назад', search: 'Поиск', loading: 'Загрузка...',
        noDataFound: 'Данные не найдены', pageNavigation: 'Навигация по страницам',
        previous: 'Назад', next: 'Вперёд',
        notFoundMessage: 'Упс! Страница не найдена.', goHome: 'На главную',
    },
    auth: {
        signIn: 'Войти', signOut: 'Выйти', connect: 'Подключить',
        connected: 'Подключено', authenticated: 'Авторизован',
        notConfigured: 'Провайдер "{provider}" не настроен. Проверьте API-ключи.',
        notImplemented: 'Провайдер не реализует signIn().',
    },
    form: {
        headerAdd: 'Добавить', headerEdit: 'Редактировать', buttonSave: 'Сохранить',
        buttonDelete: 'Удалить', buttonBack: 'Назад',
        requiredField: 'Поле "{field}" обязательно для заполнения',
        requiredFieldGeneric: 'Обязательные поля не заполнены',
        saveSuccess: 'Успешно сохранено', deleteSuccess: 'Успешно удалено',
        noticeRequiredFields: 'Заполните обязательные поля перед сохранением.',
    },
    grid: {
        buttonAdd: 'Добавить',
        deleteConfirm: 'Вы уверены, что хотите удалить этот элемент?',
        emptyState: 'Нет элементов для отображения',
    },
    select: { placeholder: 'Выбрать...' },
    modal: { save: 'Сохранить', delete: 'Удалить', cancel: 'Отменить', close: 'Закрыть' },
    upload: {
        clickOrDrag: 'Нажмите или перетащите для загрузки...', dropToUpload: 'Отпустите для загрузки',
        uploadMore: 'Добавить ещё файлы', editFileName: 'Изменить имя файла',
        editorImage: 'Редактор изображений', loaded: 'Загружено', removeFile: 'Удалить',
        uploadAnother: 'Загрузить ещё один файл', dropToParse: 'Отпустите для анализа',
    },
    notifications: { title: 'Уведомления', seeAll: 'Смотреть все' },
    code: { copyCode: 'Копировать код', copy: 'Копировать', copied: 'Скопировано!', codeLanguageDefault: 'Текст' },
    table: {
        noDataFound: 'Данные не найдены', selectAllRows: 'Выбрать все строки',
        sortBy: 'Сортировать по {label}', sortByCurrent: 'Сортировать по {label} ({direction})',
        selectRow: 'Выбрать строку {key}', reorderRow: 'Переместить строку {key}',
    },
    gallery: { selectItem: 'Выбрать элемент {key}' },
    crop: {
        enableCrop: 'Включить обрезку в масштабе {scale}', variants: 'Варианты',
        outputFile: 'Выходной файл', active: 'Активно',
        removeVariant: 'Удалить вариант {scale}', fileName: 'Имя файла',
    },
    imageEditor: {
        title: 'Редактор изображений', save: 'Сохранить', undo: 'Отменить', redo: 'Повторить',
        zoomOut: 'Уменьшить', zoomIn: 'Увеличить', crop: 'Обрезать',
        flipHorizontal: 'Отразить горизонтально', flipVertical: 'Отразить вертикально',
        rotate: 'Повернуть на 90°', freeDrawing: 'Свободное рисование', arrow: 'Стрелка', text: 'Текст',
        rectangle: 'Прямоугольник', circle: 'Круг', triangle: 'Треугольник',
    },
    prompt: {
        noProviders: 'Нет зарегистрированных AI-провайдеров.',
        aiNotConfiguredEdit: 'AI не настроен. Вы можете редактировать и сохранять этот промпт.',
        aiNotConfiguredRun: 'AI не настроен. Запуск этого промпта невозможен.',
        toggleOnTitle: 'Отключить AI', toggleOffTitle: 'Включить AI',
        closeEditor: 'Закрыть редактор', editSettings: 'Изменить настройки',
        attachFiles: 'Прикрепить файлы', run: 'Запустить', noMatchingCommands: 'Нет подходящих команд',
        tokenUsage: 'Использование токенов', tokenInput: 'Вход: {count} токенов',
        tokenOutput: 'Выход: {count} токенов', tokenContext: 'Контекст: {count} токенов',
        tokenCost: 'Стоимость: {cost} USD', tokenTime: 'Время: {ms}мс', tokenUsageEmpty: '-',
        hidePreview: 'Скрыть предпросмотр', showPreview: 'Показать предпросмотр',
        noProvider: 'Нет провайдера', noResponse: 'Нет ответа',
    },
    layout: {
        maxElements: 'В строке уже 12 элементов: сначала удалите один.',
        noSpace: 'Нет места: невозможно сжать элементы для добавления.',
        dragToMove: 'Перетащить для перемещения', remove: 'Удалить',
        dragToResize: 'Перетащить для изменения размера', dragHere: 'Перетащите элемент сюда',
    },
};

export default ru;
