import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tabDynamic: {
            page: {
                title: 'TabDynamic',
                description: '用于重复表单区块的动态标签数组编辑器。',
            },
            sections: {
                editableTabs: {
                    title: '可编辑标签',
                    description: 'TabDynamic 会把数组中的每个元素渲染成可删除标签，并让活动面板始终连接到当前 Form 记录。',
                },
            },
            labels: {
                section: '区块',
                dynamicSections: '动态区块',
                intro: '简介',
                title: '标题',
            },
            propsDocs: {
                items: {
                    name: { description: 'Form 记录中的数组字段名。' },
                    children: { description: '渲染在活动标签内的字段。' },
                    onChange: { description: '由 Form 上下文调用的自定义 change 处理器。' },
                    onAdd: { description: '添加标签后调用。' },
                    onRemove: { description: '删除标签后调用。' },
                    label: { description: '标签名前缀或转换模板。' },
                    min: { description: '最少标签数量。' },
                    max: { description: '最多标签数量。' },
                    activeIndex: { description: '初始活动标签。' },
                    title: { description: '标签上方的标题。' },
                    readOnly: { description: '隐藏添加和删除操作。' },
                    tabPosition: { description: '标签布局位置。' },
                },
            },
            playground: {
                title: 'TabDynamic',
            },
        },
    },
});
