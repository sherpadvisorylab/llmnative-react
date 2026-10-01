import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'Пары «метка → значение» только для чтения с нативной семантикой <dl>/<dt>/<dd>, горизонтальной или стековой раскладкой, адаптивными колонками и стилями из темы.',
            },
            sections: {
                horizontal: { title: 'Горизонтально', description: 'Метка рядом со значением. На мобильных пара стекается и соблюдает labelWidth на больших экранах.' },
                stacked: { title: 'Стековые колонки', description: 'Метка над значением, в адаптивной сетке из 1–6 колонок.' },
                emptyValues: { title: 'Пустые значения', description: 'null, undefined и пустые строки отображают emptyValue (по умолчанию "—").' },
                truncate: { title: 'Обрезка', description: 'Держит длинные значения в одну строку с многоточием и показывает полный текст через нативный title.' },
                theme: { title: 'Тема', description: 'Каждый слот настраивается через ключ темы DescriptionList: обёртка, список, элемент, метка и значение.' },
            },
            labels: {
                email: 'Эл. почта',
                role: 'Роль',
                admin: 'Администратор',
                fullName: 'Полное имя',
                company: 'Компания',
                status: 'Статус',
                phone: 'Телефон',
                address: 'Адрес',
                notes: 'Заметки',
                bio: 'О себе',
                longValue: 'Очень длинное значение, которое не помещается в одну строку и требует обрезки',
                empty: 'Н/Д',
            },
            propsDocs: { items: {
                items: { description: 'Пары метки и значения для отображения.' },
                layout: { description: 'Положение метки: рядом со значением (horizontal) или над ним (stacked).' },
                columns: { description: 'Число адаптивных колонок в раскладке stacked (1–6). Игнорируется в horizontal.' },
                labelWidth: { description: 'Фиксированная ширина метки в раскладке horizontal (любая длина CSS, напр. "12rem").' },
                emptyValue: { description: 'Отображается, когда значение null, undefined или пустое. По умолчанию "—".' },
                truncate: { description: 'Держит значения в одну строку с многоточием и задаёт нативный title для текстовых значений.' },
                className: { description: 'CSS-классы для элемента <dl>.' },
                wrapperClassName: { description: 'CSS-классы для внешней обёртки.' },
            } },
            playground: {
                title: 'DescriptionList',
                props: {
                    items: { description: 'Пары метки и значения для отображения.' },
                    layout: { description: 'Положение метки: рядом со значением (horizontal) или над ним (stacked).' },
                    columns: { description: 'Число адаптивных колонок в раскладке stacked (1–6). Игнорируется в horizontal.' },
                    labelWidth: { description: 'Фиксированная ширина метки в раскладке horizontal (любая длина CSS, напр. "12rem").' },
                    emptyValue: { description: 'Отображается, когда значение null, undefined или пустое. По умолчанию "—".' },
                    truncate: { description: 'Держит значения в одну строку с многоточием и задаёт нативный title для текстовых значений.' },
                    className: { description: 'CSS-классы для элемента <dl>.' },
                    wrapperClassName: { description: 'CSS-классы для внешней обёртки.' },
                },
            },
        },
    },
});
