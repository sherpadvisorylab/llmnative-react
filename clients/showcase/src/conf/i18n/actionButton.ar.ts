import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        actionButton: {
            page: { title: 'ActionButton', description: 'زر إجراء متزامن فوري مع أيقونة وشارة وحركة ضغط ونظام تنويعات. استخدم LoadingButton للعمليات غير المتزامنة.' },
            sections: {
                variants: { description: 'استخدم الخاصية variant لتطبيق ألوان دلالية بدون كتابة أسماء فئات CSS يدوياً.' },
                iconLabel: { title: 'تركيبات الأيقونة والتسمية', description: 'تعرض icon أيقونة من الموفر النشط. احذف label عند استخدام زر بأيقونة فقط، واربطه مع title لتحسين إمكانية الوصول.' },
                onClick: { title: 'المعالج onClick', description: 'يقوم onClick بإيقاف الانتشار تلقائياً. الزر لا يدير حالة التحميل، لذا استخدم LoadingButton للأعمال غير المتزامنة.' },
                disabled: { title: 'حالة التعطيل', description: 'تمنع disabled النقر وتعرض مؤشراً غير مسموح به على wrapper. يحتفظ الزر بشكله المرئي.' },
                badge: { title: 'شارة إشعار', description: 'تعرض badge عداداً أو مؤشراً نصياً في أعلى اليمين. مفيدة للعناصر المعلّقة.' },
            },
        },
    },
});
