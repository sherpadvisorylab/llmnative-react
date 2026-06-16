import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'مساعد لحقول المصفوفات الديناميكية لإضافة وإزالة أقسام النماذج المتكررة.',
            },
            sections: {
                repeatedFields: {
                    title: 'حقول متكررة',
                    description: 'يقوم Repeat باستنساخ مجموعة الحقول نفسها لكل عنصر في المصفوفة ويحافظ على توافق أزرار الإضافة والإزالة مع سجل Form الحالي.',
                },
            },
            labels: {
                items: 'العناصر',
                name: 'الاسم',
                firstItem: 'العنصر الأول',
                tasks: 'المهام',
                taskName: 'اسم المهمة',
                design: 'التصميم',
                build: 'البناء',
            },
            propsDocs: {
                items: {
                    name: { description: 'اسم حقل المصفوفة داخل سجل Form.' },
                    children: { description: 'الحقول التي يتم استنساخها لكل صف مكرر.' },
                    onChange: { description: 'معالج تغيير مخصص يتم استدعاؤه من سياق Form.' },
                    onAdd: { description: 'يتم استدعاؤه بعد إضافة عنصر.' },
                    onRemove: { description: 'يتم استدعاؤه بعد إزالة عنصر.' },
                    className: { description: 'فئات CSS على الغلاف الجذري.' },
                    layout: { description: 'نمط تخطيط Repeat.' },
                    minItems: { description: 'الحد الأدنى لعدد العناصر.' },
                    maxItems: { description: 'الحد الأقصى لعدد العناصر.' },
                    label: { description: 'عنوان القسم مع إجراء الإضافة.' },
                    readOnly: { description: 'يخفي إجراءات الإضافة والإزالة.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
