import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalOk: {
            page: { title: 'ModalOk', description: '只有一个 Ok 按钮的信息对话框。适用于只需要确认查看的只读状态消息。' },
            sections: {
                statusAcknowledgement: { title: '状态确认', description: 'ModalOk 是最轻量的 modal 变体：一个按钮，没有分支。适用于后台任务、导入完成或任何需要让用户知晓的操作之后。' },
            },
            demo: {
                defaultTitle: '导入完成',
                defaultBody: '42 条记录已成功导入。',
                openButton: '打开 ModalOk',
                importCsvButton: '导入 CSV',
                acknowledgementBody: '42 条记录已成功导入。3 行因校验错误被跳过。',
            },
            propsDocs: {
                items: {
                    children: { description: '显示在 body 中的信息内容' },
                    title: { description: '对话框标题' },
                    onClose: { description: '当用户点击 Ok 或 X 按钮时调用' },
                },
            },
        },
    },
});
