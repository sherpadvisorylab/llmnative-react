import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modalYesNo: {
            page: { title: 'ModalYesNo', description: 'حوار تأكيد بأزرار Yes و No. كلا المعالجين يغلقان الـ modal تلقائيًا بعد اكتمالهما.' },
            sections: {
                destructiveConfirmation: { title: 'تأكيد إجرائي خطير', description: 'استخدم ModalYesNo قبل أي إجراء غير قابل للتراجع مثل delete أو reset أو publish. Yes ينفذ الإجراء و No يلغي. كلاهما يغلق الـ modal بعد انتهاء المعالج غير المتزامن.' },
            },
            demo: {
                defaultTitle: 'تأكيد الحذف',
                defaultBody: 'هل أنت متأكد أنك تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
                openButton: 'افتح ModalYesNo',
                deleteRecordButton: 'احذف السجل',
                yesResult: 'لقد ضغطت Yes.',
                noResult: 'لقد ضغطت No.',
                confirmedResult: 'تم التأكيد - تم حذف السجل.',
                cancelledResult: 'تم الإلغاء - لم يتم حذف أي شيء.',
                destructiveQuestion: 'هل أنت متأكد أنك تريد حذف user_042؟ لا يمكن التراجع عن هذا الإجراء.',
            },
            propsDocs: {
                items: {
                    children: { description: 'رسالة التأكيد المعروضة في body' },
                    title: { description: 'عنوان الحوار' },
                    onYes: { description: 'يُستدعى عندما يضغط المستخدم Yes. يُغلق الـ modal تلقائيًا بعد اكتمال المعالج.' },
                    onNo: { description: 'يُستدعى عندما يضغط المستخدم No. يُغلق الـ modal تلقائيًا بعد اكتمال المعالج.' },
                    onClose: { description: 'يُستدعى عند إغلاق الـ modal عبر زر X أو الخلفية' },
                },
            },
        },
    },
});
