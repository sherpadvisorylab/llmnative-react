import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        switch: {
            page: {
                title: 'Switch',
                description: 'حقل checkbox بنمط switch يستخدم نفس تعاقد القيمة الخاص بـ Checkbox.',
            },
            sections: {
                booleanToggle: {
                    title: 'مبدل منطقي',
                },
            },
            labels: {
                published: 'منشور',
                togglePublishedState: 'تبديل حالة النشر',
            },
            propsDocs: {
                title: 'خصائص Switch',
                items: {
                    name: { description: 'اسم الحقل المستخدم كمفتاح للنموذج.' },
                    label: { description: 'التسمية بجانب المبدل.' },
                    title: { description: 'خاصية title الأصلية.' },
                    ariaLabel: { description: 'تسمية وصولية لحقل switch عند عدم وجود تسمية مرئية.' },
                    inheritWrapperClassName: { description: 'عند false يتم تجاهل wrapperClassName الموروث من Form الاب.' },
                    required: { description: 'يجعل الحقل مطلوبا.' },
                    valueChecked: { description: 'القيمة المحفوظة عند التفعيل.' },
                    defaultValue: { description: 'القيمة الابتدائية عند التفعيل.' },
                    before: { description: 'محتوى قبل المبدل.' },
                    after: { description: 'محتوى بعد المبدل.' },
                    onChange: { description: 'معالج تغيير مخصص يستدعيه سياق Form.' },
                    className: { description: 'فئات CSS على input الخاص بالcheckbox.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف.' },
                },
            },
            playground: {
                title: 'Switch',
            },
        },
    },
});
