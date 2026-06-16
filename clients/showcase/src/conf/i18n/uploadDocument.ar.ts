import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadDocument: {
            page: {
                title: 'UploadDocument',
                description: 'حقل رفع مستندات مع السحب والإفلات وتقدم مدمج وصفوف قابلة للإزالة وخيار تعديل اسم الملف. يخزن سجل Form مصفوفة من واصفات الملفات.',
            },
            sections: {
                basicUpload: {
                    title: 'رفع مستند أساسي',
                    description: 'رفع ملف واحد مع السحب والإفلات. يقرأ الحقل الملف المحدد محليا ويعرض التقدم أثناء التحويل ثم يخزن الإدخال المرفوع داخل سجل Form.',
                },
                multipleFiles: {
                    title: 'ملفات متعددة',
                    description: 'فعّل multiple للاحتفاظ بعدة ملفات داخل الحقل نفسه. يتحول كل ملف مرفوع إلى صف في الجدول، وتبقى عملية الرفع المضمنة متاحة حتى الوصول إلى max.',
                },
                editableFileNames: {
                    title: 'أسماء ملفات قابلة للتحرير',
                    description: 'اضبط editable لجعل كل صف قابلا للنقر. يؤدي النقر على صف مكتمل إلى فتح نافذة تعديل اسم الملف المدمجة وحفظ fileName الجديد داخل إدخال الملف المخزن.',
                },
                acceptFilter: {
                    title: 'مرشح accept',
                    description: 'يقيد منتقي الملفات الأصلي بامتدادات محددة. كما تعرض قيمة accept نفسها داخل منطقة الإسقاط الفارغة كتلميح بصري للصيغ المسموحة.',
                },
                requiredField: {
                    title: 'حقل مطلوب',
                    description: 'أضف required لإظهار تحقق النموذج عندما يكون الحقل فارغا. تعرض رسالة التحقق أسفل منطقة الرفع باستخدام موضع خطأ الحقل القياسي.',
                },
            },
            labels: {
                report: 'تقرير',
                attachmentsMax: 'مرفقات (حد اقصى 5)',
                deliverables: 'المخرجات',
                csvExcelOnly: 'CSV / Excel فقط',
                contractRequired: 'العقد (مطلوب)',
            },
            propsDocs: {
                title: 'خصائص UploadDocument',
                items: {
                    name: { description: 'اسم الحقل المرتبط بسجل Form' },
                    label: { description: 'التسمية المعروضة فوق منطقة الإسقاط أو جدول الملفات' },
                    multiple: { description: 'يسمح باختيار وتخزين اكثر من ملف واحد', default: 'false' },
                    editable: { description: 'يفتح نافذة تعديل اسم الملف عند النقر على صف من الجدول', default: 'false' },
                    accept: { description: 'مرشح accept الخاص بحقل الملفات الأصلي ويعرض في المنتقي وتلميح منطقة الإسقاط', default: '".pdf,.doc,.docx,.txt,.iso"' },
                    max: { description: 'الحد الأقصى لعدد الملفات التي يمكن الاحتفاظ بها في الحقل', default: '100' },
                    required: { description: 'يحدد حقل الملف المخفي كمطلوب ويعرض ملاحظات التحقق عند الفراغ', default: 'false' },
                    onChange: { description: 'يستدعى كلما تغيرت مصفوفة الملفات المخزنة في سجل Form' },
                    before: { description: 'محتوى يعرض قبل حقل الرفع داخل الغلاف الخارجي' },
                    after: { description: 'محتوى يعرض بعد حقل الرفع داخل الغلاف الخارجي' },
                    className: { description: 'فئات CSS المطبقة على حاوية الحقل الداخلية' },
                    wrapperClassName: { description: 'فئات CSS المطبقة على عنصر Wrapper الخارجي' },
                },
            },
            playground: {
                title: 'ساحة UploadDocument',
                defaultLabel: 'المرفقات',
            },
        },
    },
});
