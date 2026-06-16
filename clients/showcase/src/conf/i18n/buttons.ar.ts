import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        buttons: {
            page: { title: 'Buttons', description: 'حالات أزرار دلالية إلى جانب مكوّنات مخصّصة للإجراءات الفورية وغير المتزامنة والتنقل والمراجع الخارجية.' },
            sections: {
                nativeStates: { title: 'فئات الحالة الأصلية', description: 'استخدم فئات الحالة `btn` المملوكة للإطار للأزرار والروابط البسيطة.' },
                outlineLink: { title: 'Outline و link', description: 'تستخدم حالات outline نفس الأسماء الدلالية والرموز نفسها المستخدمة في الأزرار الممتلئة.' },
                components: { title: 'مكوّنات الأزرار', description: 'استخدم الصفحات المتخصصة للاطلاع على الأمثلة و props و playground الخاصة بكل مكوّن زر.' },
            },
            cards: {
                actionButton: 'إجراءات فورية مع أيقونات وشارات وحالة تعطيل وحركة ضغط.',
                loadingButton: 'إجراءات غير متزامنة مع حالة تحميل ونص تقدّم وتعطيل تلقائي.',
                navigation: 'أدوات مساعدة للرجوع والتنقل والمراجع الخارجية.',
            },
        },
    },
});
