import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        menu: {
            page: {
                title: 'القائمة',
                description: 'قائمة تنقل واعية بالمسار يتم عرضها من سياق قائمة التطبيق.',
            },
            sections: {
                componentsMenu: {
                    title: 'قائمة المكونات',
                    description: 'يقوم Menu بقراءة شجرة التنقل المهيأة في التطبيق وعرض عناصر متداخلة مع شارات اختيارية وأغلفة مخصصة.',
                },
            },
            labels: {
                none: 'بدون',
                single: 'واحد',
                multi: 'متعدد',
                newBadge: 'جديد',
                betaBadge: 'beta',
            },
            propsDocs: {
                items: {
                    menuKey: { description: 'مفتاح سياق القائمة الممرر إلى useMenu.' },
                    as: { description: 'نوع عنصر القائمة.' },
                    badges: {
                        description: 'شارات مفهرسة حسب عنوان العنصر بالأحرف الصغيرة.',
                        shortcuts: {
                            none: { label: 'بدون', help: 'من دون شارات في القائمة.' },
                            single: { label: 'واحد', help: 'شارة واحدة على alert.' },
                            multi: { label: 'متعدد', help: 'عدة شارات لمفاتيح مختلفة.' },
                        },
                    },
                    before: { description: 'محتوى قبل القائمة.' },
                    after: { description: 'محتوى بعد القائمة.' },
                    wrapperClassName: { description: 'فئات CSS على الحاوية.' },
                    className: { description: 'فئات CSS على قائمة العناصر.' },
                    headerClassName: { description: 'فئات CSS على عناصر الرأس.' },
                    itemClassName: { description: 'فئات CSS على عناصر li.' },
                    linkClassName: { description: 'فئات CSS على الروابط.' },
                    iconClassName: { description: 'فئات CSS على غلاف الأيقونة.' },
                    textClassName: { description: 'فئات CSS على نص العنصر.' },
                    badgeClassName: { description: 'فئات CSS على الشارات.' },
                    arrowClassName: { description: 'فئات CSS على سهم القائمة الفرعية.' },
                    submenuClassName: { description: 'فئات CSS على القوائم المتداخلة.' },
                },
            },
            playground: {
                title: 'القائمة',
            },
        },
    },
});
