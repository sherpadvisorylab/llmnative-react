import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        layoutBuilder: {
            page: {
                title: 'LayoutBuilder',
                description: 'منشئ صفوف تفاعلي من 12 عمودا لترتيب رموز الحقول المسحوبة.',
            },
            sections: {
                dragFields: {
                    title: 'اسحب الحقول الى الصف',
                    description: 'اسحب رموز الحقول من القائمة الى صف الـ builder لتكوين تخطيط محفوظ داخل سجل Form الحالي.',
                },
            },
            labels: {
                dragFieldsIntoRow: 'اسحب الحقول الى الصف',
                fields: 'الحقول',
            },
            propsDocs: {
                title: 'خصائص LayoutBuilder',
                items: {
                    name: { description: 'اسم حقل Form الذي يخزن عناصر تخطيط الصف.' },
                    defaultSpan: { description: 'امتداد العمود الافتراضي للحقول التي يتم افلاتها.', default: '1' },
                    heightPx: { description: 'ارتفاع صف الـ builder بالبكسل.', default: '100' },
                    ref: { description: 'واجهة imperative: getValue و setValue و clear.' },
                },
            },
            playground: {
                title: 'LayoutBuilder',
            },
        },
    },
});
