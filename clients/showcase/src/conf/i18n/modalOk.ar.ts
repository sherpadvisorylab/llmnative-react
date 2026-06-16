import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalOk: {
            page: { title: 'ModalOk', description: 'حوار معلوماتي بزر Ok واحد. استخدمه لرسائل الحالة للقراءة فقط التي تحتاج مجرد إقرار.' },
            sections: {
                statusAcknowledgement: { title: 'إقرار الحالة', description: 'ModalOk هو أخف نسخة من الـ modal: زر واحد بلا تفرعات. استخدمه بعد المهام الخلفية أو عمليات الاستيراد أو أي عملية يجب إبلاغ المستخدم بها.' },
            },
            demo: {
                defaultTitle: 'اكتمل الاستيراد',
                defaultBody: 'تم استيراد 42 سجلًا بنجاح.',
                openButton: 'افتح ModalOk',
                importCsvButton: 'استيراد CSV',
                acknowledgementBody: 'تم استيراد 42 سجلًا بنجاح. تم تخطي 3 صفوف بسبب أخطاء تحقق.',
            },
            propsDocs: {
                items: {
                    children: { description: 'محتوى معلوماتي يظهر في body' },
                    title: { description: 'عنوان الحوار' },
                    onClose: { description: 'يُستدعى عندما يضغط المستخدم Ok أو زر X' },
                },
            },
        },
    },
});
