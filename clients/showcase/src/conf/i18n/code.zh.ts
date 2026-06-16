import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        code: {
            page: { title: 'Code', description: '基于 Prism 的语法高亮代码块，支持可选复制、语言懒加载和主题选择。' },
            sections: {
                tsx: { title: 'TSX 代码块', description: '使用 Code 展示示例、片段和生成源码预览。' },
                languages: { title: '语言', description: '组件会按需懒加载所选语言的 Prism 语法。' },
                themesCopy: { title: '主题与复制', description: '点击主题即可预览。showCopy 控制剪贴板按钮。' },
                slotsWrapper: { title: '插槽与 wrapper', description: 'pre 和 post 会显示在代码块外部，作为左右两侧的装饰内容。wrapperClassName 和 className 让代码块更容易融入更丰富的文档布局。' },
            },
        },
    },
});
