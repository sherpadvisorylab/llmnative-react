import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageUrl: {
            page: {
                title: 'ImageUrl',
                description: 'Составное поле формы для URL изображения, метаданных alt prompt, ширины, высоты и живого превью.',
            },
            sections: {
                imageMetadata: {
                    title: 'Метаданные изображения',
                },
            },
            labels: {
                hero: 'hero',
                heroImage: 'Hero-изображение',
                blueHeroIllustration: 'Синяя hero-иллюстрация',
                squareThumbnail: 'Квадратная миниатюра',
            },
            propsDocs: {
                title: 'Свойства ImageUrl',
                items: {
                    name: { description: 'Имя объектного поля в записи Form.' },
                    label: { description: 'Метка для поля URL.' },
                    required: { description: 'Помечает вложенные поля как обязательные.' },
                    defaultValue: { description: 'Начальный вложенный объект изображения.' },
                    value: { description: 'Управляемое значение текущего вложенного объекта изображения, контролируемого извне.' },
                    inheritWrapperClassName: { description: 'Если true, поле наследует wrapperClassName из родительского контекста Form.' },
                    mode: { description: 'Режим prompt для alt-текста.' },
                    before: { description: 'Содержимое перед группой полей.' },
                    after: { description: 'Содержимое после группы полей.' },
                    onChange: { description: 'Пользовательский обработчик change из контекста Form.' },
                    className: { description: 'CSS-классы URL input.' },
                    wrapperClassName: { description: 'CSS-классы обертки.' },
                },
            },
            playground: {
                title: 'ImageUrl',
            },
        },
    },
});
