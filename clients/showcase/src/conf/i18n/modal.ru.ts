import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modal: {
            page: {
                title: 'Modal',
                description: 'Центрированные диалоги и боковые панели. Переключатель fullscreen, асинхронные save/delete действия и рендер через portal.',
            },
            sections: {
                positions: {
                    title: 'Позиции',
                    description: 'Нажми кнопку, чтобы открыть modal в соответствующей позиции.',
                },
            },
            demo: {
                dialogTitleCenter: 'Dialog - center',
                panelTitle: 'Panel - {position}',
                dialogBody: 'Центрированный диалог. Поддерживает размеры `sm`, `md`, `lg`, `xl`, `2xl` и `fullscreen`.',
                panelBody: 'Боковая панель с позицией **{position}**. Рендерится в `document.body` через React portal.',
                openButton: 'Открыть modal',
                defaultTitle: 'Заголовок диалога',
                defaultBody: 'Содержимое modal находится здесь.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Содержимое body modal' },
                    title: { description: 'Заголовок modal в header' },
                    header: { description: 'Пользовательский header (заменяет title)' },
                    footer: { description: 'Пользовательский footer или false, чтобы полностью скрыть footer', typeDetails: 'ReactNode | false' },
                    size: { description: 'Ширина диалога' },
                    position: { description: 'Где появляется modal. Не-центральные позиции рендерятся как боковые панели.' },
                    onClose: { description: 'Вызывается, когда пользователь закрывает modal' },
                    onSave: { description: 'Асинхронный save-handler. true закрывает, false оставляет открытым.' },
                    onDelete: { description: 'Асинхронный delete-handler. Показывает кнопку delete в footer.' },
                    closeOnBackdrop: { description: 'Закрывать modal при клике по backdrop' },
                    allowFullscreen: { description: 'Показывать переключатель fullscreen в header' },
                    showCancel: { description: 'Показывать кнопку Cancel в footer, когда передан onClose' },
                    zIndex: { description: 'Переопределение CSS z-index, полезно при стеке нескольких modal' },
                    headerClassName: { description: 'CSS-классы на контейнере header' },
                    titleClassName: { description: 'CSS-классы на элементе title' },
                    subtitleClassName: { description: 'CSS-классы на элементе subtitle (когда заданы и title, и header)' },
                    bodyClassName: { description: 'CSS-классы на контейнере body' },
                    footerClassName: { description: 'CSS-классы на контейнере footer' },
                    wrapperClassName: { description: 'CSS-классы на внешнем wrapper диалога' },
                    className: { description: 'CSS-классы на внутреннем flex-контейнере' },
                    before: { description: 'Контент до внутреннего контейнера внутри wrapper диалога' },
                    after: { description: 'Контент после внутреннего контейнера внутри wrapper диалога' },
                    motion: { description: 'Именованный motion preset или inline MotionProps override для анимации входа/выхода диалога', typeDetails: 'string | MotionEffect | false' },
                },
            },
        },
    },
});
