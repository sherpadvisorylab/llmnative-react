import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        switch: {
            page: {
                title: 'Switch',
                description: '使用与 Checkbox 相同值约定的开关样式复选框。',
            },
            sections: {
                booleanToggle: {
                    title: '布尔开关',
                },
            },
            labels: {
                published: '已发布',
                togglePublishedState: '切换发布状态',
            },
            propsDocs: {
                title: 'Switch 属性',
                items: {
                    name: { description: '作为表单键的字段名。' },
                    label: { description: '开关旁边的标签。' },
                    title: { description: '原生 title 属性。' },
                    ariaLabel: { description: '当没有可见标签时，用于 switch 输入的可访问标签。' },
                    inheritWrapperClassName: { description: '为 false 时忽略从父级 Form 继承的 wrapperClassName。' },
                    required: { description: '将字段标记为必填。' },
                    valueChecked: { description: '启用时保存的值。' },
                    defaultValue: { description: '初始启用值。' },
                    before: { description: '开关前的内容。' },
                    after: { description: '开关后的内容。' },
                    onChange: { description: '由 Form 上下文调用的自定义变更处理器。' },
                    className: { description: 'checkbox input 上的 CSS 类。' },
                    wrapperClassName: { description: '包装器上的 CSS 类。' },
                },
            },
            playground: {
                title: 'Switch',
            },
        },
    },
});
