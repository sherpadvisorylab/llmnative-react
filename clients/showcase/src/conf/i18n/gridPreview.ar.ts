import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridPreview: {
            page: {
                title: 'مساحة معاينة Grid',
                description: 'صفحة مرافقة مخفية تستخدمها الاجراءات المخصصة في Grid. حاليا تعرض معاينة للسجل النشط وتوفر صيغ التصدير، ويمكن لاحقا اعادة استخدامها ايضا لتدفقات معاينة Form.',
            },
            banner: {
                currentView: 'العرض الحالي',
                exportDescription: 'اختر صيغة تصدير للسجل الحالي او لمجموعة البيانات التجريبية بالكامل.',
                previewDescription: 'افحص السجل المحدد واستخدم هذه الصفحة كسطح معاينة عام قابل لاعادة الاستخدام.',
                allRecords: 'كل السجلات',
                recordPrefix: 'السجل',
            },
            sections: {
                datasetPreview: {
                    title: 'معاينة مجموعة البيانات',
                    selectedRecordDescription: 'وصل هذا السجل عبر اجراء Grid مخصص ويمكن اعادة استخدامه للتصدير او لتدفقات معاينة Form مستقبلا.',
                    emptyDescription: 'لم يتم تمرير سجل محدد، لذلك تعرض الصفحة معاينة على مستوى مجموعة البيانات.',
                },
                exportOptions: {
                    title: 'خيارات التصدير',
                    description: 'هذا مقصود به ان يكون مركز اجراءات صغيرا. يمكن لـ Grid و Form وباقي المعاينات التوجيه الى هنا عندما يحتاج المستخدم الى اختيار صيغة التصدير بدلا من التنزيل الفوري.',
                },
            },
            emptyState: {
                singleRecordHint: 'افتح هذه الصفحة من اجراء Grid مرتبط بسجل محدد لملء المعاينة مسبقا بسجل واحد. تظل ادوات التصدير تعمل ايضا على مجموعة البيانات التجريبية الكاملة.',
            },
            actions: {
                exportCsv: 'تصدير CSV',
                exportJson: 'تصدير JSON',
                saveAsPdf: 'حفظ كملف PDF',
                copyJson: 'نسخ JSON',
                jsonCopied: 'تم نسخ JSON',
                copyEmails: 'نسخ رسائل البريد',
                emailsCopied: 'تم نسخ رسائل البريد',
            },
            hints: {
                futureReuse: 'ملاحظة: تركز هذه الصفحة حاليا على التصدير والمعاينة. لاحقا يمكننا اعادة استخدام التخطيط نفسه لمعاينة Form وتخطيطات الطباعة وتدفقات المراجعة على مستوى السجل من دون تغيير عقد اجراء Grid مرة اخرى.',
            },
        },
    },
});
