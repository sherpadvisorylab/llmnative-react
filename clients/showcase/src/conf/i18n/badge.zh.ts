import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        badge: {
            page: { title: 'Badge', description: '用于状态、计数和分类的行内标签。当 children 是 React 元素时，Badge 会进入 overlay 模式，并把指示器定位到该元素上。' },
            sections: {
                colorVariants: { title: '颜色变体', description: '行内 badge 使用文本或行内 React 内容作为 children。' },
                overlayAfter: { title: 'Overlay：after 右上角', description: '将 React 元素作为 children 并传入 after，即可在右上角显示 badge。' },
                overlayBefore: { title: 'Overlay：before 左上角', description: '使用 before 可将 badge 放在左上角。' },
                overlayBoth: { title: 'Overlay：两个角', description: 'before 和 after 可以同时存在：左上角和右上角同时显示。' },
                overlayDot: { title: 'Overlay：圆点', description: '如果没有 before 或 after，会在右上角渲染一个小圆点指示器。' },
                inlineMode: { title: '带 before/after 的行内模式', description: '在行内模式下，before 和 after 会渲染在 badge span 之外。' },
            },
        },
    },
});
