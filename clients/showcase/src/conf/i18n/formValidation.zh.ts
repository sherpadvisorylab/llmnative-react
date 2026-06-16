import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        formValidation: {
            page: { title: 'Form — 验证', description: 'Form 组件在阻止提交前一次性收集所有无效字段。支持必填字段和自定义验证器。错误内联显示在每个字段下方；用户开始输入后立即清除。' },
            sections: {
                createMode: { title: '创建模式 — 必填字段和验证器', description: '不填任何内容点击保存：所有必填字段同时高亮。底部在保存按钮旁边显示警告通知 — 它会持续显示，直到修复错误并重新提交。' },
                editMode: { title: '编辑模式 — 保存和删除', description: '传入包含 _key 字段的 defaultValues 以指示编辑模式。Form 在 defaultValues 中看到 _key 后设置 isNewRecord = false，同时显示保存和删除按钮。' },
                longForm: { title: '长表单 — 滚动到第一个错误', description: '当表单高于视口时，提交失败后表单会自动滚动到第一个无效字段并聚焦。滚动到表单底部点击保存 — 页面会跳回第一个缺失字段。' },
                longFormHowToTry: '如何尝试：滚动所有字段到保存按钮，然后点击它。页面会滚动回第一个无效字段。',
                insideModal: { title: '模态框中的表单', description: '验证表单可以在任何位置的 Modal 中存在。模态框的保存按钮委托给表单的内部 handleSave：运行验证，错误内联显示，只有所有字段都有效时模态框才会关闭。' },
            },
        },
    },
});
