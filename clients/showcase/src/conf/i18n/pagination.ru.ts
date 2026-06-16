import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        pagination: {
            page: {
                title: 'Pagination',
                description: 'Постраничная навигация с кнопками first, previous, next и last, а также с настраиваемым окном страниц. Используется Grid автоматически.',
            },
            sections: {
                interactive: {
                    title: 'Интерактивная пагинация - 50 записей, 8 на страницу',
                    description: 'Нажимайте элементы управления страницами, чтобы перемещаться по набору данных.',
                },
                sticky: {
                    title: 'Липкая панель пагинации',
                    description: 'Когда sticky=true, панель пагинации плавает внизу окна просмотра с размытым фоном. Это поведение по умолчанию в Grid.',
                },
            },
            labels: {
                recordPrefix: 'Запись',
                stickyPreviewLead: 'рендерит панель навигации с',
                stickyPreviewMiddle: 'и',
                stickyPreviewEnd: 'поэтому она плавает над контентом, не перекрывая его полностью.',
            },
            propsDocs: {
                items: {
                    records: { description: 'Полный набор данных для пагинации.' },
                    children: { description: 'Функция рендера, получающая записи текущей страницы и смещение.' },
                    page: { description: 'Начальная активная страница (нумерация с 1). Применяется только при монтировании; дальше навигацией управляет внутреннее состояние.' },
                    limit: { description: 'Количество элементов на странице.' },
                    maxPageButtons: { description: 'Максимальное количество видимых кнопок страниц.' },
                    sticky: { description: 'Фиксирует панель пагинации у нижнего края окна просмотра.' },
                    align: { description: 'Горизонтальное выравнивание элементов управления пагинацией.' },
                    scrollToTopOnChange: { description: 'Прокручивает страницу наверх при смене активной страницы.' },
                    scrollBehavior: { description: 'Поведение scrollIntoView, используемое при включенном scrollToTopOnChange.' },
                    appendTo: { description: 'Цель portal для панели пагинации.' },
                    before: { description: 'Контент внутри обертки пагинации перед панелью навигации.' },
                    after: { description: 'Контент внутри обертки пагинации после панели навигации.' },
                    wrapperClassName: { description: 'CSS-классы для самого внешнего элемента-обертки.' },
                    className: { description: 'CSS-классы для элемента nav с кнопками страниц.' },
                },
            },
            playground: {
                title: 'Pagination',
                props: {
                    limit: { description: 'Количество элементов на странице.' },
                    maxPageButtons: { description: 'Максимальное количество видимых кнопок страниц.' },
                    sticky: { description: 'Фиксирует панель пагинации у нижнего края окна просмотра.' },
                    align: { description: 'Горизонтальное выравнивание элементов управления пагинацией.' },
                    scrollToTopOnChange: { description: 'Прокручивает страницу наверх при смене активной страницы.' },
                },
            },
        },
    },
});
