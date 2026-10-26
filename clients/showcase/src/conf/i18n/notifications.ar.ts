import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: 'الإشعارات',
                description: 'قائمة إشعارات منسدلة مبنية فوق Dropdown و DropdownItem.',
            },
            sections: {
                notificationMenu: {
                    title: 'قائمة الإشعارات',
                    description: 'يستخدم Notifications زر الجرس مع شارة لعرض آخر التحديثات مع العنوان والوقت والأيقونة.',
                },
            },
            detail: {
                title: 'التفاصيل والإجراءات',
                description: 'سطر تفاصيل تحت العنوان، وأزرار للتصرف من القائمة دون فتح العنصر (مع مؤشر تحميل أثناء العمل)، وروابط خارجية في علامة تبويب جديدة. يخبر onItemClick بالعنصر الذي فُتح لتعليمه كمقروء.',
                sourceTitle: 'مصدر بلا Action',
                sourceDetail: 'crm · sources/notes/pricing.md',
                openAction: 'افتح الـ Action',
                blockedTitle: 'مشكلة معلّقة',
                blockedDetail: 'crm #12 · أُحيلت إلى شخص',
                now: 'الآن',
            },
            labels: {
                newDeploymentCompleted: 'اكتمل النشر الجديد',
                storageUsageReached80: 'وصل استخدام التخزين إلى 80%',
                twoMinutesAgo: 'منذ دقيقتين',
                oneHourAgo: 'منذ ساعة',
            },
            propsDocs: {
                items: {
                    items: { description: 'سجلات الإشعارات المعروضة داخل القائمة المنسدلة.' },
                    badge: { description: 'الشارة المعروضة على زر الجرس.' },
                    description: { description: 'سطر تحت عنوان كل عنصر: ماذا وأين.' },
                    actions: { description: 'أزرار تحت العنصر: تتصرف دون فتحه، مع مؤشر تحميل أثناء الوعد.' },
                    external: { description: 'يفتح الرابط كعنوان في علامة تبويب جديدة بدلًا من مسار.' },
                    onItemClick: { description: 'يُستدعى عند فتح عنصر (مثلًا لتعليمه كمقروء)؛ تُغلق القائمة.' },
                    wrapperClassName: { description: 'فئات CSS على الحاوية.' },
                },
            },
            playground: {
                title: 'الإشعارات',
                defaultBadge: '2',
            },
        },
    },
});
