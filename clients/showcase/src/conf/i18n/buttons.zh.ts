import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        buttons: {
            page: { title: 'Buttons', description: '语义化按钮状态，以及面向即时操作、异步操作、导航和外部引用的专用组件。' },
            sections: {
                nativeStates: { title: '原生状态类', description: '对简单按钮和链接使用框架自带的 `btn` 状态类。' },
                outlineLink: { title: 'Outline 与 link', description: 'Outline 状态使用与实心按钮相同的语义名称和 token。' },
                components: { title: '按钮组件', description: '使用专门页面查看各个按钮组件的示例、props 和 playground。' },
            },
            cards: {
                actionButton: '带图标、badge、禁用状态和按压动效的即时操作。',
                loadingButton: '带加载状态、进度文本和自动禁用的异步操作。',
                navigation: '返回导航和外部引用辅助组件。',
            },
        },
    },
});
