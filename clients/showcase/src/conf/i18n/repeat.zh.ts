import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: '用于添加和删除重复表单区块的动态数组字段助手。',
            },
            sections: {
                repeatedFields: {
                    title: '重复字段',
                    description: 'Repeat 会为数组中的每个元素克隆同一组字段，并让增删操作与当前 Form 记录保持同步。',
                },
                verticalLayout: {
                    title: '垂直布局',
                    description: '使用 layout="vertical" 将每个元素的字段堆叠在带浮动删除按钮的卡片中。子字段使用相对名称：Repeat 为每行组合 name.index。',
                },
            },
            labels: {
                items: '项目',
                name: '名称',
                firstItem: '第一个项目',
                contacts: '联系人',
                email: '邮箱',
                tasks: '任务',
                taskName: '任务名称',
                design: '设计',
                build: '构建',
            },
            propsDocs: {
                items: {
                    name: { description: 'Form 记录中的数组字段名。' },
                    children: { description: '为每一行重复项克隆的字段。传入函数可接收 ({ index, record, records, remove })。' },
                    onChange: { description: '由 Form 上下文调用的自定义 change 处理器。' },
                    onAdd: { description: '添加项目后调用。' },
                    onRemove: { description: '删除项目后调用。' },
                    className: { description: '根包装元素上的 CSS 类。' },
                    layout: { description: 'horizontal — 每个元素一张编号卡片；vertical — 每个元素字段堆叠；inline — 每个元素紧凑一行。' },
                    minItems: { description: '最少项目数量。' },
                    maxItems: { description: '最多项目数量。' },
                    label: { description: '带添加动作的区块标签。' },
                    readOnly: { description: '隐藏添加和删除操作。' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
