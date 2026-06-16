import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        upload: {
            page: {
                title: 'Upload',
                description: 'ثلاثة حقول رفع متخصصة للصور والمستندات وبيانات CSV. كل نوع يدير المعاينة المحلية وربط الملف وخيار التخزين السحابي بشكل مستقل.',
            },
            sections: {
                variants: {
                    description: 'اختر النوع المناسب لنوع الملف. جميعها توسع FormFieldProps وتربط النتيجة بسجل النموذج المحيط عبر الخاصية name.',
                },
                cloudStorage: {
                    title: 'التخزين السحابي',
                    description: 'سجل StorageProvider داخل App ومرر storagePath إلى UploadImage أو UploadDocument لبث الملفات إلى Firebase Storage أو Supabase Storage بدلا من الاحتفاظ بها كـ base64 محلي.',
                },
            },
            variants: {
                image: {
                    title: 'UploadImage',
                    description: 'شبكة صور مصغرة مدمجة مع طبقة عند التحويم للمعاينة والاقتصاص والحذف. تدعم صورة واحدة أو عدة صور.',
                },
                document: {
                    title: 'UploadDocument',
                    description: 'قائمة ملفات تعرض الاسم والحجم وشريط التقدم. تقبل أي نوع ملف عبر مرشح accept.',
                },
                csv: {
                    title: 'UploadCSV',
                    description: 'محلل CSV بالسحب والإفلات. يمرر الصفوف المهيكلة وأسماء الحقول إلى onDataLoaded. يعمل بشكل مستقل دون Form.',
                },
            },
            labels: {
                storageNotice: 'يعمل الـ showcase دون اتصال، لذلك تتطلب عروض storagePath وجود StorageProvider مضبوط.',
            },
        },
    },
});
