import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        form: {
            page: { title: 'Form widget', description: '完整的 CRUD 表单：从 DataProvider 加载记录，验证，保存并可选删除。将字段作为 children 包裹 — Form 通过 React context 自动连接一切。' },
            sections: {
                newRecord: { title: '新记录 (keyGenerator)', description: '传入 path（集合）+ keyGenerator 创建新记录。不执行数据库读取。Save 调用 set() 到 path/生成的Key。' },
                editExisting: { title: '编辑已有记录', description: '传入完整记录路径（含 key）且不带 defaultValues。Form 在挂载时读取记录，预填字段，并保存回同一路径。' },
                lifecycleHooks: { title: '生命周期钩子', description: 'onLoad 在读取后转换数据。onSave 在写入前转换。onComplete 在每次操作后执行。' },
                lifecycleHooksNote: '代码示例 — 钩子在视觉上与标准表单没有区别。',
                nestedObjects: { title: '嵌套对象和数组', description: '点符号映射到嵌套对象键。数组索引符号映射到数组元素。' },
            },
        },
    },
});
