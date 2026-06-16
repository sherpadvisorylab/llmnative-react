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
