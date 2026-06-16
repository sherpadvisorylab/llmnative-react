import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        tabDynamic: {
            page: {
                title: 'TabDynamic',
                description: 'محرر مصفوفة ديناميكي بعلامات تبويب لأقسام النماذج المتكررة.',
            },
            sections: {
                editableTabs: {
                    title: 'علامات تبويب قابلة للتحرير',
                    description: 'يقوم TabDynamic بعرض كل عنصر في المصفوفة كعلامة تبويب قابلة للإزالة ويحافظ على ارتباط اللوحة النشطة بسجل Form الحالي.',
                },
            },
            labels: {
                section: 'قسم',
                dynamicSections: 'أقسام ديناميكية',
                intro: 'مقدمة',
                title: 'العنوان',
            },
            propsDocs: {
                items: {
                    name: { description: 'اسم حقل المصفوفة داخل سجل Form.' },
                    children: { description: 'الحقول المعروضة داخل علامة التبويب النشطة.' },
                    onChange: { description: 'معالج تغيير مخصص يتم استدعاؤه من سياق Form.' },
                    onAdd: { description: 'يتم استدعاؤه بعد إضافة علامة تبويب.' },
                    onRemove: { description: 'يتم استدعاؤه بعد إزالة علامة تبويب.' },
                    label: { description: 'بادئة تسمية التبويب أو قالب التحويل.' },
                    min: { description: 'الحد الأدنى لعدد علامات التبويب.' },
                    max: { description: 'الحد الأقصى لعدد علامات التبويب.' },
                    activeIndex: { description: 'علامة التبويب النشطة في البداية.' },
                    title: { description: 'العنوان أعلى علامات التبويب.' },
                    readOnly: { description: 'يخفي إجراءات الإضافة والإزالة.' },
                    tabPosition: { description: 'موضع تخطيط علامات التبويب.' },
                },
            },
            playground: {
                title: 'TabDynamic',
            },
        },
    },
});
