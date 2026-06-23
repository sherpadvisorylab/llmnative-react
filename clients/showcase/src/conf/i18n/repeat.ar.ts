import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        repeat: {
            page: {
                title: 'Repeat',
                description: 'حقل مصفوفة ديناميكي يستنسخ مجموعة حقول لكل عنصر ويحافظ على مزامنة إجراءات الإضافة والإزالة مع سجل Form.',
            },
            sections: {
                repeatedFields: {
                    title: 'الاستخدام الأساسي — التخطيط الأفقي',
                    description: 'التخطيط الافتراضي. كل عنصر يحصل على رأس مرقم ومجموعة حقوله الخاصة وزر إزالة. يظهر زر الإضافة أسفل القائمة أو بجانب التسمية إذا كانت محددة.',
                },
                inlineLayout: {
                    title: 'التخطيط المضمن',
                    description: 'استخدم layout="inline" للحفاظ على كل صف مضغوطاً: تملأ العناصر الفرعية المساحة المتاحة ويقع زر الإزالة في النهاية. مثالي لألوان اللوحة وقوائم العلامات والأزواج مفتاح-قيمة.',
                },
                multipleFields: {
                    title: 'حقول متعددة لكل عنصر',
                    description: 'ضع أي عدد من الحقول داخل الكتلة المتكررة — كل عنصر يحصل على قسم مرقم خاص به مع رأس وإجراء إزالة.',
                },
                constraints: {
                    title: 'قيود الحد الأدنى / الأقصى',
                    description: 'minItems يمنع الإزالة دون حد أدنى (أول N عناصر لا تظهر زر الإزالة). maxItems يخفي زر الإضافة عند بلوغ الحد الأقصى.',
                },
                readOnlyMode: {
                    title: 'وضع القراءة فقط',
                    description: 'اضبط readOnly لإخفاء إجراءات الإضافة والإزالة، وتحويل القائمة إلى عرض للقراءة فقط.',
                },
                functionChildren: {
                    title: 'العناصر الفرعية كدالة عرض',
                    description: 'مرر دالة كعناصر فرعية للحصول على الفهرس والسجل الحالي — مفيد للتسميات الديناميكية والحقول الشرطية.',
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
                test: 'الاختبار',
                addColor: 'إضافة لون',
                colors: 'الألوان',
                colorName: 'اسم الرمز',
                primary: 'primary',
                secondary: 'secondary',
                accent: 'accent',
                socialLinks: 'روابط التواصل',
                platform: 'المنصة',
                url: 'الرابط',
                twitter: 'تويتر',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                languages: 'اللغات',
                language: 'اللغة',
                english: 'الإنجليزية',
                italian: 'الإيطالية',
                german: 'الألمانية',
                skills: 'المهارات',
                skill: 'المهارة',
                javascript: 'JavaScript',
                typescript: 'TypeScript',
                react: 'React',
                pipelineSteps: 'خطوات المسار',
                stepName: 'اسم الخطوة',
                command: 'الأمر',
            },
            propsDocs: {
                title: 'الخصائص',
                items: {
                    name: { description: 'اسم حقل المصفوفة داخل سجل Form.' },
                    children: { description: 'الحقول التي يتم استنساخها لكل صف مكرر. مرر دالة للحصول على (record, records, index).' },
                    onChange: { description: 'معالج تغيير مخصص يتم استدعاؤه من سياق Form.' },
                    onAdd: { description: 'يتم استدعاؤه بعد إضافة عنصر.' },
                    onRemove: { description: 'يتم استدعاؤه بعد إزالة عنصر.' },
                    className: { description: 'فئات CSS على الغلاف الجذري.' },
                    layout: { description: 'horizontal — بطاقة مرقمة لكل عنصر؛ inline — صف مضغوط لكل عنصر.' },
                    minItems: { description: 'الحد الأدنى للعناصر — زر الإزالة مخفي لأول N عناصر.' },
                    maxItems: { description: 'الحد الأقصى للعناصر — زر الإضافة مخفي عند بلوغ الحد.' },
                    label: { description: 'تسمية القسم فوق القائمة؛ زر الإضافة يوضع بجانبها.' },
                    readOnly: { description: 'يخفي إجراءات الإضافة والإزالة.' },
                },
            },
            playground: {
                title: 'Repeat',
            },
        },
    },
});
