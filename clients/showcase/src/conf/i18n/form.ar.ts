import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        form: {
            page: { title: 'Form widget', description: 'نموذج CRUD كامل: يحمل سجلاً من DataProvider، يتحقق، يحفظ ويحذف اختيارياً. لف الحقول كـ children — Form يربط كل شيء تلقائياً عبر React context.' },
            sections: {
                newRecord: { title: 'سجل جديد (keyGenerator)', description: 'مرر path (مجموعة) + keyGenerator لإنشاء سجل جديد. لا يتم تنفيذ أي قراءة من قاعدة البيانات. الحفظ يستدعي set() على المسار path/المفتاح_المولد.' },
                editExisting: { title: 'تعديل سجل موجود', description: 'مرر المسار الكامل للسجل شامل المفتاح بدون defaultValues. يقرأ Form السجل عند التحميل، يملأ الحقول مسبقاً، ويحفظ مرة أخرى على نفس المسار.' },
                lifecycleHooks: { title: 'خطافات دورة الحياة', description: 'onLoad يحول البيانات بعد القراءة. onSave يحول قبل الكتابة. onComplete يُنفذ بعد كل إجراء.' },
                lifecycleHooksNote: 'مثال كود — خطافات دورة الحياة غير متميزة بصرياً عن النموذج القياسي.',
                nestedObjects: { title: 'الكائنات والمصفوفات المتداخلة', description: 'تدوين النقطة يربط بمفاتيح الكائنات المتداخلة. تدوين فهرس المصفوفة يربط بعناصر المصفوفة.' },
            },
        },
    },
});
