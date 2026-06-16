import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        icon: {
            page: { title: 'Icon', description: 'عارض أيقونات يعتمد على الموفر. يتم ضبط مكتبة الأيقونات النشطة عالمياً على App ويمكن تبديلها أثناء التشغيل. الموفرات المدمجة: lucide (الافتراضي) و phosphor.' },
            sections: {
                basicUsage: { description: 'اعرض أي أيقونة بالاسم. الموفر النشط يحل الاسم إلى مكوّنه المناسب.' },
                catalog: { title: 'فهرس الأيقونات', description: 'أسماء أيقونات شائعة تدعمها كل الموفرات المدمجة. الموفر النشط: {providerId}.' },
                sizes: { description: 'تقوم الخاصية size بتحديد العرض والارتفاع بالبكسل. القيمة الافتراضية هي 16.' },
                colors: { title: 'الألوان عبر className', description: 'ترث الأيقونات لون النص من CSS. استخدم أي أداة Tailwind من نوع text-*. ' },
                providers: { title: 'الموفرات المدمجة: lucide مقابل phosphor', description: 'lucide هو الافتراضي. phosphor مدمج أيضاً. كلاهما يحل نفس أسماء الأيقونات.' },
                phosphor: { title: 'تنويعات الوزن في Phosphor', description: 'مرّر weight مباشرة إلى Icon بدون الحاجة إلى إعادة إنشاء الموفر. القيم المدعومة: thin و light و regular (الافتراضي) و bold و fill و duotone.' },
                appConfig: { title: 'تهيئة على مستوى App', description: 'يتم تعيين موفر الأيقونات مرة واحدة على App ويورّث عبر context. ويمكن تغييره أثناء التشغيل باستخدام useIconController.' },
                aliases: { title: 'الأسماء البديلة', description: 'اربط أسماءك الدلالية الخاصة بأسماء الموفر. يتم ضبطها مرة واحدة على مستوى App وتعمل مع أي موفر.' },
                a11y: { title: 'إمكانية الوصول', description: 'الأيقونات التي لا تحتوي على label تكون aria-hidden (زخرفية). قدّم label عندما تنقل الأيقونة معنى من دون نص مجاور.' },
                customProvider: { title: 'موفر مخصص', description: 'نفّذ IconProviderAdapter لدمج أي مكتبة أيقونات.' },
            },
        },
    },
});
