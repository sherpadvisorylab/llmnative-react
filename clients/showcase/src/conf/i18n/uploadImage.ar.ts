import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadImage: {
            page: {
                title: 'UploadImage',
                description: 'حقل رفع صور مع معاينة مصغرة مدمجة وإجراءات فوقية عند التحويم ودعم اختياري لعدة صور. يخزن واصفات الملفات داخل سجل Form.',
            },
            sections: {
                singleImage: {
                    title: 'صورة واحدة',
                    description: 'الاستخدام الافتراضي: صورة واحدة في كل مرة مع صورة مصغرة ذات حجم ثابت. بعد الرفع يمكنك استخدام إجراءات التحويم للمعاينة أو الحذف.',
                },
                multipleImages: {
                    title: 'صور متعددة',
                    description: 'مرر multiple للسماح باختيار عدة صور. يعرض كل ملف كصورة مصغرة مستقلة. يتوقف الرفع عند الوصول إلى حد max.',
                },
                editableCrop: {
                    title: 'قابل للتحرير (قص)',
                    description: 'أضف editable لإظهار أيقونة القلم عند التحويم. يؤدي النقر عليها إلى فتح محرر الصور مع أدوات القص والتكبير، ويتم حفظ النسخ الناتجة داخل إدخال الملف في سجل Form.',
                },
                acceptFilter: {
                    title: 'مرشح accept',
                    description: 'يقيد منتقي الملفات بأنواع MIME محددة. يفرض المتصفح هذا المرشح داخل منتقي الملفات الأصلي.',
                },
                responsiveSrcset: {
                    title: 'صور متجاوبة (srcset)',
                    description: 'مرر generateSrcset مع uploadPath لتوليد نسخ مقاس 400w و 800w تلقائيا عبر canvas. يُرفع كل نسخة بلاحقة _400w / _800w في اسم الملف. تُحفظ قيم srcset و sizes الناتجة في سجل Form مع الرابط الأصلي جاهزة لوسم <img>. تستخدم العرض التوضيحي تخزينا وهميا في الذاكرة.',
                },
            },
            labels: {
                avatar: 'الصورة الرمزية',
                galleryMax: 'المعرض (حد اقصى 6)',
                coverPhotoEditable: 'صورة الغلاف (قابلة للتحرير)',
                pngOnly: 'PNG فقط',
                heroImage: 'الصورة الرئيسية',
            },
            propsDocs: {
                title: 'خصائص UploadImage',
                items: {
                    name: { description: 'اسم الحقل المرتبط بسجل Form' },
                    label: { description: 'التسمية المعروضة فوق منطقة الرفع' },
                    multiple: { description: 'يسمح باختيار اكثر من صورة في المرة الواحدة', default: 'false' },
                    editable: { description: 'يعرض زر القص/التحرير عند التحويم؛ ويفتح محرر الصور', default: 'false' },
                    previewWidth: { description: 'عرض الصورة المصغرة بالبكسل', default: '100' },
                    previewHeight: { description: 'ارتفاع الصورة المصغرة بالبكسل', default: '100' },
                    accept: { description: 'أنواع MIME المقبولة (مثل "image/png,image/jpeg")', default: '"image/*"' },
                    max: { description: 'الحد الأقصى المسموح به لعدد الملفات', default: '100' },
                    required: { description: 'يحدد الحقل كمطلوب؛ ويمنع إرسال النموذج عند الفراغ', default: 'false' },
                    onChange: { description: 'يستدعى عند كل تغيير في قائمة الملفات مع القيمة المحدثة وسياق النموذج' },
                    before: { description: 'محتوى يعرض قبل شبكة الصور داخل الغلاف الخارجي' },
                    after: { description: 'محتوى يعرض بعد شبكة الصور داخل الغلاف الخارجي' },
                    className: { description: 'فئات CSS على الحاوية الداخلية' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي' },
                    uploadPath: { description: 'بادئة مسار التخزين للملفات المرفوعة. يتطلب عنصر StorageProvider سلف. مع generateSrcset تُحفظ كل نسخة عرض كـ <uploadPath>/<name>_400w.<ext>.' },
                    srcsetWidths: { description: 'مصفوفة من عرض البكسل للنسخ المتجاوبة (مثل [400, 800]). تُحفظ كل نسخة كـ <name>_<width>w.<ext> وتملأ srcset و sizes في سجل Form. يتطلب uploadPath و StorageProvider.' },
                },
            },
            playground: {
                title: 'ساحة UploadImage',
                defaultLabel: 'المعرض',
            },
        },
    },
});
