import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        card: {
            page: { title: 'Card', description: 'Универсальный контейнер с необязательными header, body, footer и встроенным overlay-loader.' },
            sections: {
                basic: { title: 'Базовая card' },
                headerFooter: { title: 'С header и footer' },
                grid: { title: 'Сетка card' },
                loader: { title: 'Card с loader', description: 'Передайте loading, чтобы показывать spinner поверх контента во время загрузки данных.' },
            },
        },
    },
});
