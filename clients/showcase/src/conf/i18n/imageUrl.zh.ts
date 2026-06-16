import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageUrl: {
            page: {
                title: 'ImageUrl',
                description: '用于图片 URL、alt prompt 元数据、宽度、高度和实时预览的复合表单字段。',
            },
            sections: {
                imageMetadata: {
                    title: '图片元数据',
                },
            },
            labels: {
                hero: 'hero',
                heroImage: 'Hero 图片',
                blueHeroIllustration: '蓝色 hero 插图',
                squareThumbnail: '方形缩略图',
            },
            propsDocs: {
                title: 'ImageUrl 属性',
                items: {
                    name: { description: 'Form 记录中的对象字段名。' },
                    label: { description: 'URL 字段的标签。' },
                    required: { description: '将嵌套字段标记为必填。' },
                    defaultValue: { description: '初始嵌套图片对象。' },
                    value: { description: '由外部管理的当前嵌套图片对象的受控值。' },
                    inheritWrapperClassName: { description: '为 true 时从父级 Form 上下文继承 wrapperClassName。' },
                    mode: { description: '用于 alt 文本的 prompt 模式。' },
                    before: { description: '字段组前面的内容。' },
                    after: { description: '字段组后面的内容。' },
                    onChange: { description: '由 Form 上下文调用的自定义 change 处理器。' },
                    className: { description: 'URL 输入框上的 CSS 类。' },
                    wrapperClassName: { description: '包装器上的 CSS 类。' },
                },
            },
            playground: {
                title: 'ImageUrl',
            },
        },
    },
});
