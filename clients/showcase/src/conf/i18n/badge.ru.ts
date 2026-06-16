import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        badge: {
            page: { title: 'Badge', description: 'Встроенные метки для статусов, счетчиков и категорий. Когда children является React-элементом, Badge переходит в режим overlay и размещает индикаторы на этом элементе.' },
            sections: {
                colorVariants: { title: 'Цветовые варианты', description: 'Встроенные badge используют текст или встроенный React-контент как children.' },
                overlayAfter: { title: 'Overlay: after сверху справа', description: 'Передайте React-элемент как children вместе с after, чтобы показать badge сверху справа.' },
                overlayBefore: { title: 'Overlay: before сверху слева', description: 'Используйте before, чтобы разместить badge сверху слева.' },
                overlayBoth: { title: 'Overlay: оба угла', description: 'before и after могут сосуществовать: одновременно сверху слева и сверху справа.' },
                overlayDot: { title: 'Overlay: точка', description: 'Если before и after не заданы, сверху справа рендерится маленький индикатор-точка.' },
                inlineMode: { title: 'Inline с before/after', description: 'В inline-режиме before и after рендерятся вне span badge.' },
            },
        },
    },
});
