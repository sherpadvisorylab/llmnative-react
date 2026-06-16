import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loadingButton: {
            page: { title: 'LoadingButton', description: '异步按钮，在任务执行期间会自动禁用自己。支持通过 setMessage 在执行过程中流式更新标签。' },
            sections: {
                asyncSave: { title: '异步保存', description: '传入异步 onClick。按钮会显示 spinner，并在 promise 完成前阻止重复点击。' },
                customLabel: { title: '自定义加载标签', description: 'loadingLabel 会在 spinner 激活时替换默认的 "Save…" 文案。' },
                streaming: { title: '通过 setMessage 流式更新标签', description: 'onClick 的第二个参数是 setMessage。可在异步过程中的任意时刻调用它，以实时更新加载标签，适合多步骤操作。' },
                disabled: { title: '禁用状态', description: 'disabled 会让按钮始终保持不可用，不受加载周期影响。' },
                controlled: { title: '受控加载（loading）', description: 'loading 允许父组件从外部控制加载状态，适用于按钮属于更大表单提交流程的场景。' },
                variants: { description: 'LoadingButton 支持与 ActionButton 相同的变体 token。' },
            },
        },
    },
});
