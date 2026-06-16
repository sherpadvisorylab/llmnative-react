import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadCsv: {
            page: {
                title: 'UploadCSV',
                description: 'رافع CSV أو TSV لملف واحد مع السحب والإفلات وتكامل PapaParse ومخرجات محللة مناسبة للمعاينة يتم تمريرها عبر onDataLoaded.',
            },
            sections: {
                basicUpload: {
                    title: 'رفع CSV أساسي',
                    description: 'اسحب ملف CSV أو TSV إلى المنطقة أو انقر للتصفح. بعد التحليل ينتقل المكون إلى حالة محملة ويكشف الصفوف والرؤوس والملف الأصلي عبر onDataLoaded.',
                },
                normalizedKeys: {
                    title: 'مفاتيح مطبعة + إزالة الحقول الفارغة',
                    description: 'يقوم normalizeKeys بتحويل أسماء الرؤوس قبل كشفها في fields وكائنات الصفوف. ويزيل removeEmptyFields الإدخالات التي تكون قيمتها سلسلة فارغة أو null من كل صف محلل.',
                },
                customFieldTransform: {
                    title: 'تحويل مخصص للحقول',
                    description: 'استخدم onParseField لاعتراض كل زوج [key, value] محلل. أعد زوجا معدلا للاحتفاظ به، أو undefined لحذف ذلك الحقل من كائن الصف النهائي.',
                },
                customDelimiter: {
                    title: 'فاصل مخصص',
                    description: 'مرر delimiter عندما لا يعتمد الملف على الاكتشاف التلقائي لـ PapaParse بشكل موثوق، مثل الملفات المصدرة بفاصل الفاصلة المنقوطة من أدوات الجداول.',
                },
            },
            labels: {
                emptyState: 'لم يتم تحميل أي ملف بعد.',
                rows: 'صفوف',
                fields: 'حقول',
                andMoreRows: '...و {count} صفوف أخرى',
                basicLabel: 'اسحب أو انقر لرفع CSV',
                normalizeLabel: 'ارفع CSV لرؤية المفاتيح المطبعة',
                transformLabel: 'ارفع CSV - سيتم حذف الأعمدة التي تبدأ بـ _',
                delimiterLabel: 'ارفع CSV مفصولا بفاصلة منقوطة',
            },
            propsDocs: {
                title: 'خصائص UploadCSV',
                items: {
                    name: { description: 'اسم الحقل المستخدم في خاصية data-name الخاصة بـ wrapper' },
                    onDataLoaded: { description: 'يستدعى مع الصفوف المحللة وحقول الرؤوس والملف الأصلي بعد نجاح التحليل' },
                    onClear: { description: 'يستدعى عند إزالة الملف المحمل من واجهة المكون' },
                    label: { description: 'التسمية المعروضة فوق منطقة الإسقاط' },
                    icon: { description: 'اسم الأيقونة المعروضة داخل منطقة الإسقاط', default: '"upload"' },
                    delimiter: { description: 'فاصل اختياري يمرر إلى PapaParse. عند عدم تمريره سيكتشفه PapaParse تلقائيا.' },
                    normalizeKeys: { description: 'يطبع أسماء الرؤوس باستخدام normalizeKey قبل كشفها في fields وكائنات الصفوف', default: 'false' },
                    removeEmptyFields: { description: 'يحذف إدخالات الصف التي تكون قيمتها المحللة سلسلة فارغة أو null', default: 'false' },
                    onParseField: { description: 'يحول أو يحذف كل زوج [key, value] أثناء التحليل. أعد undefined لإهمال الحقل.' },
                    before: { description: 'محتوى يعرض قبل uploader داخل الغلاف الخارجي' },
                    after: { description: 'محتوى يعرض بعد uploader داخل الغلاف الخارجي' },
                    className: { description: 'فئات CSS المطبقة على الحاوية الداخلية لـ uploader' },
                    wrapperClassName: { description: 'فئات CSS المطبقة على الغلاف الخارجي' },
                },
            },
            playground: {
                title: 'ساحة UploadCSV',
                defaultLabel: 'اسحب أو انقر لرفع CSV',
            },
        },
    },
});
