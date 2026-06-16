import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        badge: {
            page: { title: 'Badge', description: 'تسميات مدمجة للحالات والعدادات والفئات. عندما يكون children عنصراً من React، يدخل Badge في وضع overlay ويضع المؤشرات فوق ذلك العنصر.' },
            sections: {
                colorVariants: { title: 'تنويعات الألوان', description: 'تستخدم الشارات المدمجة نصاً أو محتوى React مدمجاً كقيمة children.' },
                overlayAfter: { title: 'Overlay: after أعلى اليمين', description: 'مرّر عنصر React كقيمة children مع after لإظهار شارة في أعلى اليمين.' },
                overlayBefore: { title: 'Overlay: before أعلى اليسار', description: 'استخدم before لوضع الشارة في أعلى اليسار.' },
                overlayBoth: { title: 'Overlay: كلا الزاويتين', description: 'يمكن أن يتواجد before و after معاً: أعلى اليسار وأعلى اليمين في الوقت نفسه.' },
                overlayDot: { title: 'Overlay: نقطة', description: 'عند عدم تمرير before أو after يتم عرض مؤشر نقطة صغيرة في أعلى اليمين.' },
                inlineMode: { title: 'مدمج مع before/after', description: 'في الوضع المدمج، يتم عرض before و after خارج عنصر span الخاص بالشارة.' },
            },
        },
    },
});
