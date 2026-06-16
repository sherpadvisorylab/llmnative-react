import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loader: {
            page: { title: 'Loader', description: '包裹任意内容的遮罩 spinner。show=true 时，会在 children 上方渲染带模糊背景的主题 spinner；内容仍保留在 DOM 中，并会在 loader 消失后立即显示。' },
            sections: {
                showHide: { title: '显示 / 隐藏', description: '切换 show 以覆盖或显示被包裹的内容。内容始终保持挂载，因此 loader 消失时不会产生布局跳动。' },
                custom: { title: '自定义图标和消息', description: '通过 icon、title 和 description 覆盖单个实例的主题默认值。icon 的值是图标名称，任何已配置图标提供方支持的图标都可以使用。' },
                card: { title: '与 Card 集成', description: 'Card 暴露了一个便捷的 showLoader prop：它会自动用 Loader 包裹 card body。' },
                other: { title: '框架中的其他加载指示器', description: '@llmnative/react 还提供了适用于不同场景的其他加载模式。' },
            },
        },
    },
});
