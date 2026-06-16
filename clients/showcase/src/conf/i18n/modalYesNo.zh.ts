import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalYesNo: {
            page: { title: 'ModalYesNo', description: '带 Yes 和 No 按钮的确认对话框。两个 handler 在完成后都会自动关闭 modal。' },
            sections: {
                destructiveConfirmation: { title: '危险确认', description: '在任何不可逆操作前使用 ModalYesNo，例如 delete、reset、publish。Yes 执行动作，No 取消。两者在异步 handler 完成后都会关闭 modal。' },
            },
            demo: {
                defaultTitle: '确认删除',
                defaultBody: '你确定要删除这条记录吗？此操作无法撤销。',
                openButton: '打开 ModalYesNo',
                deleteRecordButton: '删除记录',
                yesResult: '你点击了 Yes。',
                noResult: '你点击了 No。',
                confirmedResult: '已确认 - 记录已删除。',
                cancelledResult: '已取消 - 没有删除任何内容。',
                destructiveQuestion: '你确定要删除 user_042 吗？此操作无法撤销。',
            },
            propsDocs: {
                items: {
                    children: { description: '显示在 body 中的确认消息' },
                    title: { description: '对话框标题' },
                    onYes: { description: '当用户点击 Yes 时调用。Handler 完成后 modal 会自动关闭。' },
                    onNo: { description: '当用户点击 No 时调用。Handler 完成后 modal 会自动关闭。' },
                    onClose: { description: '当通过 X 按钮或 backdrop 关闭 modal 时调用' },
                },
            },
        },
    },
});
