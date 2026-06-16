import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        checklist: {
            page: {
                title: 'Checklist',
                description: '用于多选的垂直复选框列表。选中的值会作为数组存入表单记录。',
            },
            sections: {
                basic: { title: '基础 checklist', description: '为每个选项渲染一个复选框。预选值来自表单 defaultValues。' },
                permissions: { title: '权限 checklist', description: '角色和权限配置中的常见模式。' },
                requiredDisabled: { title: '必填与禁用' },
            },
            labels: {
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                read: '读取',
                write: '写入',
                delete: '删除',
                admin: '管理员',
                technologies: '技术',
                selectTechnologies: '选择技术',
                permissions: '权限',
                required: '必填',
                disabled: '禁用',
            },
            propsDocs: {
                title: 'Checklist 属性',
                items: {
                    name: { description: '作为表单键的字段名，并将选中值保存为数组。' },
                    label: { description: '复选框组上方的标签。' },
                    title: { description: '每个复选框输入上的原生 title 属性。' },
                    options: { description: '静态复选框选项。' },
                    optionsSource: { description: '用于获取复选框选项的 DataProvider 路径。', help: '此 playground 使用 MockDataProvider。编辑下方记录即可更改返回选项。' },
                    required: { description: '将字段标记为必填。' },
                    disabled: { description: '禁用所有复选框。' },
                    readOnlyAfterSet: { description: '字段在设置值后变为只读。' },
                    defaultValue: { description: '初始选中值。' },
                    feedback: { description: '显示在列表下方的校验反馈。' },
                    validator: { description: '自定义校验函数。返回错误字符串可阻止提交。' },
                    order: { description: '选项排序方式。默认按 label 升序。' },
                    before: { description: '渲染在 checklist 前面的输入组内容。' },
                    after: { description: '渲染在 checklist 后面的输入组内容。' },
                    onChange: { description: '由 Form 上下文调用的自定义 change 处理器。' },
                    itemClassName: { description: '应用到每个复选框包装器的 CSS 类。' },
                    className: { description: 'checklist 根元素上的 CSS 类。' },
                    wrapperClassName: { description: '外层包装器上的 CSS 类。' },
                },
            },
            playground: {
                title: 'Checklist',
            },
        },
    },
});
