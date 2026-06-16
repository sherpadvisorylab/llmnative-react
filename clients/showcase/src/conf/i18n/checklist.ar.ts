import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        checklist: {
            page: {
                title: 'Checklist',
                description: 'قائمة عمودية من مربعات الاختيار للتحديد المتعدد. يتم حفظ القيم المختارة كمصفوفة داخل سجل النموذج.',
            },
            sections: {
                basic: { title: 'Checklist اساسية', description: 'تعرض مربع اختيار لكل خيار. تأتي القيم المحددة مسبقا من defaultValues الخاصة بالنموذج.' },
                permissions: { title: 'Checklist الصلاحيات', description: 'نمط شائع لاعداد الادوار والصلاحيات.' },
                requiredDisabled: { title: 'Required و disabled' },
            },
            labels: {
                react: 'React',
                typeScript: 'TypeScript',
                firebase: 'Firebase',
                tailwind: 'Tailwind',
                nodeJs: 'Node.js',
                read: 'قراءة',
                write: 'كتابة',
                delete: 'حذف',
                admin: 'مشرف',
                technologies: 'التقنيات',
                selectTechnologies: 'اختر التقنيات',
                permissions: 'الصلاحيات',
                required: 'مطلوب',
                disabled: 'معطل',
            },
            propsDocs: {
                title: 'خصائص Checklist',
                items: {
                    name: { description: 'اسم الحقل المستخدم كمفتاح للنموذج ويحفظ القيم المختارة كمصفوفة.' },
                    label: { description: 'عنوان المجموعة فوق مربعات الاختيار.' },
                    title: { description: 'خاصية title الاصلية على كل مربع اختيار.' },
                    options: { description: 'خيارات checkbox ثابتة.' },
                    optionsSource: { description: 'مسار DataProvider المستخدم لجلب خيارات checkbox.', help: 'يستخدم هذا playground موفرا وهميا. عدل السجلات بالاسفل لتغيير الخيارات المرجعة.' },
                    required: { description: 'يجعل الحقل مطلوبا.' },
                    disabled: { description: 'يعطل جميع مربعات الاختيار.' },
                    readOnlyAfterSet: { description: 'يصبح الحقل للقراءة فقط بعد تعيين قيمة له.' },
                    defaultValue: { description: 'القيم المختارة ابتدائيا.' },
                    feedback: { description: 'رسالة التحقق المعروضة اسفل القائمة.' },
                    validator: { description: 'دالة تحقق مخصصة. اعد نص خطأ لمنع الارسال.' },
                    order: { description: 'ترتيب الخيارات. الافتراضي حسب label تصاعديا.' },
                    before: { description: 'محتوى يعرض قبل checklist داخل مجموعة ادخال.' },
                    after: { description: 'محتوى يعرض بعد checklist داخل مجموعة ادخال.' },
                    onChange: { description: 'معالج change مخصص يستدعيه سياق Form.' },
                    itemClassName: { description: 'فئات CSS المطبقة على غلاف كل checkbox.' },
                    className: { description: 'فئات CSS على جذر checklist.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي.' },
                },
            },
            playground: {
                title: 'Checklist',
            },
        },
    },
});
