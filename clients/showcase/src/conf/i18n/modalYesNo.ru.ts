import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalYesNo: {
            page: { title: 'ModalYesNo', description: 'Диалог подтверждения с кнопками Yes и No. Оба handler автоматически закрывают modal после завершения.' },
            sections: {
                destructiveConfirmation: { title: 'Деструктивное подтверждение', description: 'Используй ModalYesNo перед необратимыми действиями: delete, reset, publish. Yes выполняет действие, No отменяет. Оба закрывают modal после завершения асинхронного handler.' },
            },
            demo: {
                defaultTitle: 'Подтвердить удаление',
                defaultBody: 'Ты уверен, что хочешь удалить эту запись? Это действие нельзя отменить.',
                openButton: 'Открыть ModalYesNo',
                deleteRecordButton: 'Удалить запись',
                yesResult: 'Ты нажал Yes.',
                noResult: 'Ты нажал No.',
                confirmedResult: 'Подтверждено - запись удалена.',
                cancelledResult: 'Отменено - ничего не было удалено.',
                destructiveQuestion: 'Ты уверен, что хочешь удалить user_042? Это действие нельзя отменить.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Текст подтверждения в body' },
                    title: { description: 'Заголовок диалога' },
                    onYes: { description: 'Вызывается при клике Yes. Modal автоматически закрывается после завершения handler.' },
                    onNo: { description: 'Вызывается при клике No. Modal автоматически закрывается после завершения handler.' },
                    onClose: { description: 'Вызывается при закрытии modal через X или backdrop' },
                },
            },
        },
    },
});
