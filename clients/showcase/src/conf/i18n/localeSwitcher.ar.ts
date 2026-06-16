import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        localeSwitcher: {
            page: {
                title: 'LocaleSwitcher',
                description: 'قائمة منسدلة تسمح للمستخدم بتبديل اللغة النشطة أثناء التشغيل. لا تعرض شيئاً عند تهيئة لغة واحدة فقط، وتحفظ الاختيار داخل cookie باسم llmnative_locale.',
            },
            sections: {
                liveDemo: {
                    title: 'عرض مباشر',
                    description: 'المبدّل أدناه يتحكم في لغة الـ showcase بالكامل. الترجمات المهيأة متاحة فوراً، لذلك يؤدي تغيير اللغة إلى تحديث الشريط الجانبي والأزرار ومعاينات المكونات مباشرة.',
                },
                nullWhenSingleLocale: {
                    title: 'يعيد null عند وجود لغة واحدة فقط',
                    description: 'يعيد LocaleSwitcher القيمة null تلقائياً عندما يحتوي translations على صفر أو لغة واحدة فقط. لا يحتاج المستهلك إلى أي rendering شرطي.',
                },
                customLabels: {
                    title: 'تسميات لغات مخصصة',
                    description: 'الخاصية labels تستبدل أو توسع خريطة أسماء اللغات المدمجة. وهي مفيدة عندما يتوقع الجمهور أسماء محلية أو اختصارات أو شارات مخصصة.',
                },
                cookiePersistence: {
                    title: 'الاستمرارية عبر cookie',
                    description: 'تُحفظ اللغة المختارة في first-party cookie بمدة سنة واحدة. عند التحميل التالي تكون أولوية هذا الـ cookie أعلى من locale المعلنة داخل App.i18n.',
                },
                appConfiguration: {
                    title: 'تهيئة الترجمات داخل App',
                    description: 'مرّر translations إلى App.i18n لإتاحة لغات إضافية. كل مفتاح locale داخل كائن translations يصبح خياراً قابلاً للاختيار، بينما تعود المفاتيح الناقصة إلى الإنجليزية.',
                },
            },
            labels: {
                language: 'اللغة',
                italian: 'الإيطالية',
                localeBadgeEn: 'EN',
                localeBadgeIt: 'IT',
                localeBadgeDe: 'DE',
                localeBadgeRu: 'RU',
                localeBadgeZh: 'ZH',
                localeBadgeAr: 'AR',
            },
            propsDocs: {
                items: {
                    icon: { description: 'اسم الأيقونة الممرر إلى مكوّن Icon. يمكن استخدام أي أيقونة يدعمها مزود الأيقونات المهيأ.' },
                    label: { description: 'تسمية مرئية اختيارية تُعرض قبل عنصر select.' },
                    labels: { description: 'تسمح باستبدال أو توسيع الأسماء المعروضة لرموز اللغات. يتم دمجها مع القيم الافتراضية المدمجة.' },
                    className: { description: 'أصناف CSS إضافية على عنصر الغلاف.' },
                },
            },
            playground: {
                title: 'LocaleSwitcher',
                props: {
                    icon: { description: 'اسم الأيقونة الممرر إلى مكوّن Icon. يمكن استخدام أي أيقونة يدعمها مزود الأيقونات المهيأ.' },
                    label: { description: 'تسمية مرئية اختيارية تُعرض قبل عنصر select.' },
                    className: { description: 'أصناف CSS إضافية على عنصر الغلاف.' },
                },
            },
        },
    },
});
