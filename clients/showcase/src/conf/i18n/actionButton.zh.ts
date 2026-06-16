import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        actionButton: {
            page: { title: 'ActionButton', description: '用于即时同步操作的按钮，支持图标、badge、按压动效和变体系统。异步操作请使用 LoadingButton。' },
            sections: {
                variants: { description: '使用 variant prop 应用语义颜色，无需手写 CSS 类名。' },
                iconLabel: { title: '图标 + 标签组合', description: 'icon 会从当前 provider 渲染图标。纯图标按钮可省略 label，但应搭配 title 以提升可访问性。' },
                onClick: { title: 'onClick 处理器', description: 'onClick 会自动阻止事件冒泡。该按钮不管理加载状态，异步工作请使用 LoadingButton。' },
                disabled: { title: '禁用状态', description: 'disabled 会阻止点击，并在 wrapper 上显示不可用光标。按钮的视觉形态保持不变。' },
                badge: { title: 'Badge 通知', description: 'badge 会在右上角渲染计数或文本指示器，适合表示待处理项。' },
            },
        },
    },
});
