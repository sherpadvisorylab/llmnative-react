import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        breadcrumbs: {
            page: {
                title: 'مسار التنقل',
                description: 'يمكن بناء مسار Breadcrumbs من سلسلة URL أو من قائمة عناصر صريحة. العناصر التي تحتوي على href تظهر كروابط، أما العنصر الأخير من دون href فهو الصفحة الحالية.',
            },
            sections: {
                urlStringTrail: {
                    title: 'مسار من سلسلة URL',
                    description: 'مرر سلسلة URL ليتم تحويل المقاطع إلى روابط، ويُعتبر المقطع الأخير هو الصفحة الحالية.',
                },
                explicitItemList: {
                    title: 'قائمة عناصر صريحة',
                    description: 'استخدم BreadcrumbItem[] عندما تختلف العناوين عن URL slug أو عندما تحتاج إلى تحكم كامل في الروابط.',
                },
                currentRoute: {
                    title: 'المسار الحالي (من دون trail)',
                    description: 'عند حذف trail يقرأ المكوّن المسار الحالي تلقائياً.',
                },
                chevronSeparator: {
                    title: 'فاصل Chevron',
                },
                jsonLdStructuredData: {
                    title: 'بيانات JSON-LD المنظمة',
                    description: 'فعّل jsonLd لإدراج سكربت schema.org BreadcrumbList. يتم استخدام baseUrl فقط للمخطط ولا يغيّر الروابط المرئية.',
                },
                standaloneSchema: {
                    title: 'buildBreadcrumbSchema - استخدام مستقل',
                    description: 'استخدم الأداة المصدّرة لتوليد بيانات schema.org بشكل مستقل من أجل SSR أو ملفات sitemap أو حقن مخصص داخل head. تعيد stringify: true سلسلة جاهزة لـ dangerouslySetInnerHTML.',
                },
            },
            labels: {
                home: 'الرئيسية',
                products: 'المنتجات',
                shoes: 'الأحذية',
                sneakers: 'الأحذية الرياضية',
                runningShoes: 'أحذية الجري',
                docs: 'Docs',
                components: 'المكونات',
                breadcrumbs: 'مسار التنقل',
                jsonLdOutput: 'مخرجات JSON-LD ‏(schema.org BreadcrumbList)',
                generatedScriptTag: 'الوسم <script type="application/ld+json"> المولّد',
                currentPageOmitted: 'بدون href -> الصفحة الحالية',
            },
            propsDocs: {
                items: {
                    trail: { description: 'مسار Breadcrumbs. مرر سلسلة URL لتحليل المقاطع تلقائياً، أو مرر BreadcrumbItem[] للتحكم الصريح. وعند الحذف يتم الرجوع إلى المسار الحالي.' },
                    rootItem: { description: 'عنصر ارتكاز اختياري يظهر قبل trail. يمكن تمرير سلسلة لعرض تسمية فقط أو BreadcrumbItem لإضافة رابط.' },
                    separator: { description: 'الفاصل المعروض بين العناصر. استخدم "chevron" لعرض سهم SVG.' },
                    jsonLd: { description: 'عند تفعيلها يقوم المكوّن بعرض BreadcrumbList <script type="application/ld+json"> لبيانات SEO المنظمة.' },
                    baseUrl: { description: 'عنوان أساسي يسبق href فقط في مخرجات JSON-LD. لا يؤثر على الروابط المرئية، والقيمة الافتراضية هي window.location.origin.' },
                    className: { description: 'فئات CSS على غلاف nav.' },
                },
                schemaTitle: 'buildBreadcrumbSchema',
                schemaItems: {
                    items: { description: 'قائمة عناصر Breadcrumbs. العناصر التي تحتوي على href تحصل على URL مطلق داخل المخطط، أما عناصر الصفحة الحالية من دون href فلا تحصل عليه.' },
                    rootItem: { description: 'عنصر ارتكاز اختياري يسبق items ويستخدم نفس بنية BreadcrumbItem.' },
                    baseUrl: { description: 'العنوان الأساسي الذي يسبق جميع href لإنتاج روابط مطلقة مطلوبة من schema.org.' },
                    stringify: { description: 'عند تفعيلها تعيد سلسلة JSON بدلاً من كائن عادي، جاهزة لـ dangerouslySetInnerHTML من دون الحاجة إلى JSON.stringify.' },
                },
            },
            playground: {
                title: 'مسار التنقل',
                shortcuts: {
                    urlString: 'سلسلة URL',
                    explicitItems: 'عناصر صريحة',
                    deepPath: 'مسار عميق',
                    clear: 'مسح',
                    stringValue: 'سلسلة',
                    withLink: 'مع رابط',
                },
            },
        },
    },
});
