import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalOk: {
            page: { title: 'ModalOk', description: 'Информационный диалог с одной кнопкой Ok. Используй его для статусов только для чтения, где нужно лишь подтверждение.' },
            sections: {
                statusAcknowledgement: { title: 'Подтверждение статуса', description: 'ModalOk - самый лёгкий вариант modal: одна кнопка, без ветвлений. Используй его после фоновых задач, импортов или любой операции, о которой пользователь должен узнать.' },
            },
            demo: {
                defaultTitle: 'Импорт завершен',
                defaultBody: '42 записи были успешно импортированы.',
                openButton: 'Открыть ModalOk',
                importCsvButton: 'Импортировать CSV',
                acknowledgementBody: '42 записи были успешно импортированы. 3 строки были пропущены из-за ошибок валидации.',
            },
            propsDocs: {
                items: {
                    children: { description: 'Информационный контент в body' },
                    title: { description: 'Заголовок диалога' },
                    onClose: { description: 'Вызывается, когда пользователь нажимает Ok или кнопку X' },
                },
            },
        },
    },
});
