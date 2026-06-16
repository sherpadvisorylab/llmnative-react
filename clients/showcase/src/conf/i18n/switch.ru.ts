import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        switch: {
            page: {
                title: 'Switch',
                description: 'Checkbox в стиле переключателя, использующий тот же контракт значений, что и Checkbox.',
            },
            sections: {
                booleanToggle: {
                    title: 'Булев переключатель',
                },
            },
            labels: {
                published: 'Опубликовано',
                togglePublishedState: 'Переключить статус публикации',
            },
            propsDocs: {
                title: 'Свойства Switch',
                items: {
                    name: { description: 'Имя поля как ключ формы.' },
                    label: { description: 'Подпись рядом с переключателем.' },
                    title: { description: 'Нативный атрибут title.' },
                    ariaLabel: { description: 'Доступная подпись для switch, если нет видимой метки.' },
                    inheritWrapperClassName: { description: 'Если false, игнорирует wrapperClassName, унаследованный из Form.' },
                    required: { description: 'Помечает поле как обязательное.' },
                    valueChecked: { description: 'Значение, сохраняемое при включении.' },
                    defaultValue: { description: 'Начальное включенное значение.' },
                    before: { description: 'Содержимое перед переключателем.' },
                    after: { description: 'Содержимое после переключателя.' },
                    onChange: { description: 'Пользовательский обработчик изменения, вызываемый контекстом Form.' },
                    className: { description: 'CSS-классы input checkbox.' },
                    wrapperClassName: { description: 'CSS-классы обертки.' },
                },
            },
            playground: {
                title: 'Switch',
            },
        },
    },
});
