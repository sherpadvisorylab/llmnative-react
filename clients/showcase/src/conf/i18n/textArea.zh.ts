import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        textArea: {
            page: {
                title: 'TextArea',
                description: '与 Form 上下文集成的受控多行文本字段。',
            },
            sections: {
                basicTextarea: { title: '基础 TextArea' },
                autoResize: {
                    title: '使用 maxRows 自动调整高度',
                    description: '设置 maxRows 可让 textarea 随内容增长。达到行数上限后将停止扩展并显示滚动条。',
                },
                feedbackPlaceholder: { title: '带反馈和占位符' },
                addons: { title: '带前后附加内容' },
            },
            labels: {
                notes: '备注',
                writeShortNote: '写一条简短备注...',
                initialNote: '初始备注',
                bio: '简介',
                startTyping: '开始输入 - textarea 会随着你增加行数而增长...',
                description: '描述',
                describeIssue: '请详细描述问题...',
                beSpecific: '请尽可能具体。',
                signedNote: '签名备注',
                note: '备注',
            },
            propsDocs: {
                title: 'TextArea 属性',
                items: {
                    name: { description: '作为表单键的字段名。' },
                    label: { description: '显示在 textarea 上方的标签。' },
                    placeholder: { description: '占位文本。' },
                    required: { description: '将字段标记为必填。' },
                    disabled: { description: '禁用 textarea。' },
                    readOnlyAfterSet: { description: '在值被设置后，textarea 变为只读。' },
                    defaultValue: { description: '在 Form 上下文外部提供的初始 textarea 值。' },
                    rows: { description: '固定可见行数。如果设置了 maxRows 且内容更短，则会被忽略。' },
                    maxRows: { description: '自动调整高度直到此行数，之后显示滚动条。' },
                    feedback: { description: '显示在字段下方的帮助或校验文本。' },
                    before: { description: '渲染在 textarea 前面的输入组内容。' },
                    after: { description: '渲染在 textarea 后面的输入组内容。' },
                    id: { description: 'textarea 元素的显式 id。省略时自动生成。' },
                    onChange: { description: '由 Form 上下文调用的自定义 change 处理器。' },
                    textareaRef: { description: '转发到底层 textarea 元素的 ref。' },
                    validator: { description: '自定义校验函数。返回错误信息可阻止提交。' },
                    className: { description: '应用到 textarea 元素的额外 CSS 类。' },
                    wrapperClassName: { description: '应用到外层包装器的 CSS 类。' },
                    labelClassName: { description: '应用到 label 元素的 CSS 类。' },
                },
            },
            playground: {
                title: 'TextArea',
            },
        },
    },
});
