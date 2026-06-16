import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        card: {
            page: { title: 'Card', description: '通用容器，支持可选的 header、body、footer 以及内置 loader 遮罩层。' },
            sections: {
                basic: { title: '基础 Card' },
                headerFooter: { title: '带 header 和 footer' },
                grid: { title: 'Card 网格' },
                loader: { title: '带 loader 的 Card', description: '传入 loading 可在数据获取期间叠加显示 spinner。' },
            },
        },
    },
});
