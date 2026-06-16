import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        select: {
            page: {
                title: 'Select',
                description: 'قائمة اختيار اصلية. يمكن ان تكون الخيارات ثابتة او محملة من DataProvider.',
            },
            sections: {
                basicDropdown: {
                    title: 'قائمة اساسية',
                    description: 'مصفوفة خيارات ثابتة وهي ابسط طريقة للاستخدام.',
                },
                requiredSelect: {
                    title: 'اختيار اجباري',
                    description: 'استخدم required عندما يجب اختيار الحقل قبل ارسال النموذج.',
                },
                noPlaceholderOption: {
                    title: 'بدون خيار placeholder',
                    description: 'اضبط placeholderOption على null لاخفاء الصف الفارغ. عند عدم وجود قيمة يختار Select اول خيار متاح تلقائيا.',
                },
                readOnlyAfterSet: {
                    title: 'قراءة فقط بعد التعيين',
                    description: 'استخدم readOnlyAfterSet عندما يجب قفل الاختيار بعد اول تحديد. اذا كانت للحقل قيمة مسبقا فسيتم عرض select كمعطل.',
                },
                dataProviderBacked: {
                    title: 'مدعوم بـ DataProvider',
                    description: 'مرر optionsSource بدلا من options لجلب الخيارات من DataProvider المسجل.',
                },
            },
            labels: {
                admin: 'مسؤول',
                editor: 'محرر',
                viewer: 'عارض',
                italy: 'ايطاليا',
                germany: 'المانيا',
                france: 'فرنسا',
                spain: 'اسبانيا',
                unitedKingdom: 'المملكة المتحدة',
                unitedStates: 'الولايات المتحدة',
                category: 'الفئة',
                chooseCategory: 'اختر فئة',
                role: 'الدور',
                country: 'البلد',
                selectPlaceholder: 'اختر...',
                chooseRolePlaceholder: 'اختر دورا',
                sales: 'المبيعات',
                operations: 'العمليات',
                support: 'الدعم',
                draft: 'مسودة',
                review: 'مراجعة',
                published: 'منشور',
            },
            propsDocs: {
                title: 'خصائص Select',
                items: {
                    name: { description: 'اسم الحقل المستخدم كمفتاح للنموذج.' },
                    label: { description: 'التسمية المعروضة فوق select.' },
                    title: { description: 'خاصية title الاصلية على عنصر select.' },
                    options: { description: 'مصفوفة خيارات ثابتة.', help: 'تدعم مصفوفات option او السلاسل النصية او الارقام.' },
                    optionsSource: { description: 'مسار DataProvider المستخدم لجلب الخيارات.', help: 'يستخدم playground موفرا وهميا. عدل السجلات بالاسفل لتغيير الخيارات المرجعة.' },
                    placeholderOption: { description: 'خيار placeholder عند عدم تحديد شيء. اضبطه على null لاخفائه.' },
                    required: { description: 'يجعل الحقل مطلوبا.' },
                    disabled: { description: 'يعطل select.' },
                    readOnlyAfterSet: { description: 'يصبح الحقل للقراءة فقط بعد تعيين قيمة له.' },
                    defaultValue: { description: 'القيمة المحددة ابتدائيا.' },
                    feedback: { description: 'رسالة التحقق المعروضة اسفل الحقل.' },
                    validator: { description: 'دالة تحقق مخصصة. اعد رسالة خطا لمنع الارسال.' },
                    order: { description: 'ترتيب الخيارات. الافتراضي حسب label تصاعديا.' },
                    before: { description: 'محتوى يعرض قبل select داخل مجموعة الادخال.' },
                    after: { description: 'محتوى يعرض بعد select داخل مجموعة الادخال.' },
                    onChange: { description: 'معالج change مخصص يستدعيه سياق Form.' },
                    className: { description: 'فئات CSS على عنصر select.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي.' },
                },
            },
            playground: {
                title: 'Select',
            },
        },
    },
});
