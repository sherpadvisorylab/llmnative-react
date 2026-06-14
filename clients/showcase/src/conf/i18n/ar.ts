import type { DeepPartial } from '@llmnative/react';
import type { I18nDict } from '@llmnative/react';

const ar: DeepPartial<I18nDict> = {
    common: {
        save: 'حفظ', cancel: 'إلغاء', delete: 'حذف', close: 'إغلاق',
        back: 'رجوع', search: 'بحث', loading: 'جاري التحميل...',
        noDataFound: 'لم يتم العثور على بيانات', pageNavigation: 'تنقل الصفحات',
        previous: 'السابق', next: 'التالي',
        notFoundMessage: 'عفوًا! الصفحة غير موجودة.', goHome: 'الذهاب إلى الرئيسية',
    },
    auth: {
        signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج', connect: 'ربط',
        connected: 'مرتبط', authenticated: 'موثق',
        notConfigured: 'مزود المصادقة "{provider}" غير مكوّن. يرجى التحقق من مفاتيح API.',
        notImplemented: 'المزود لا ينفّذ signIn().',
    },
    form: {
        headerAdd: 'إضافة', headerEdit: 'تعديل', buttonSave: 'حفظ',
        buttonDelete: 'حذف', buttonBack: 'رجوع',
        requiredField: 'الحقل "{field}" إلزامي',
        requiredFieldGeneric: 'الحقول الإلزامية غير مكتملة',
        saveSuccess: 'تم الحفظ بنجاح', deleteSuccess: 'تم الحذف بنجاح',
        noticeRequiredFields: 'يرجى ملء الحقول الإلزامية قبل الحفظ.',
    },
    grid: {
        buttonAdd: 'إضافة',
        deleteConfirm: 'هل أنت متأكد من حذف هذا العنصر؟',
        emptyState: 'لا توجد عناصر للعرض',
    },
    select: { placeholder: 'اختر...' },
    modal: { save: 'حفظ', delete: 'حذف', cancel: 'إلغاء', close: 'إغلاق' },
    upload: {
        clickOrDrag: 'انقر أو اسحب للتحميل...', dropToUpload: 'أفلت للتحميل',
        uploadMore: 'إضافة المزيد من الملفات', editFileName: 'تعديل اسم الملف',
        editorImage: 'محرر الصور', loaded: 'محمّل', removeFile: 'إزالة',
        uploadAnother: 'تحميل ملف آخر', dropToParse: 'أفلت للتحليل',
    },
    notifications: { title: 'الإشعارات', seeAll: 'عرض الكل' },
    code: { copyCode: 'نسخ الكود', copy: 'نسخ', copied: 'تم النسخ!', codeLanguageDefault: 'نص' },
    table: {
        noDataFound: 'لم يتم العثور على بيانات', selectAllRows: 'تحديد جميع الصفوف',
        sortBy: 'ترتيب حسب {label}', sortByCurrent: 'ترتيب حسب {label} ({direction})',
        selectRow: 'تحديد الصف {key}', reorderRow: 'إعادة ترتيب الصف {key}',
    },
    gallery: { selectItem: 'تحديد العنصر {key}' },
    crop: {
        enableCrop: 'تفعيل الاقتصاص بمقياس {scale}', variants: 'المتغيرات',
        outputFile: 'ملف الإخراج', active: 'نشط',
        removeVariant: 'إزالة المتغير {scale}', fileName: 'اسم الملف',
    },
    imageEditor: {
        title: 'محرر الصور', save: 'حفظ', undo: 'تراجع', redo: 'إعادة',
        zoomOut: 'تصغير', zoomIn: 'تكبير', crop: 'اقتصاص',
        flipHorizontal: 'قلب أفقي', flipVertical: 'قلب رأسي',
        rotate: 'تدوير 90°', freeDrawing: 'رسم حر', arrow: 'سهم', text: 'نص',
        rectangle: 'مستطيل', circle: 'دائرة', triangle: 'مثلث',
    },
    prompt: {
        noProviders: 'لا توجد مزودات AI مسجّلة.',
        aiNotConfiguredEdit: 'AI غير مكوّن. يمكنك تعديل وحفظ هذا الأمر.',
        aiNotConfiguredRun: 'AI غير مكوّن. لا يمكن تشغيل هذا الأمر.',
        toggleOnTitle: 'تعطيل AI', toggleOffTitle: 'تفعيل AI',
        closeEditor: 'إغلاق المحرر', editSettings: 'تعديل الإعدادات',
        attachFiles: 'إرفاق الملفات', run: 'تشغيل', noMatchingCommands: 'لا توجد أوامر مطابقة',
        tokenUsage: 'استخدام الرموز', tokenInput: 'دخل: {count} رمز',
        tokenOutput: 'خرج: {count} رمز', tokenContext: 'السياق: {count} رمز',
        tokenCost: 'التكلفة: {cost} USD', tokenTime: 'الوقت: {ms}مللي ثانية', tokenUsageEmpty: '-',
        hidePreview: 'إخفاء المعاينة', showPreview: 'عرض المعاينة المحلولة',
        noProvider: 'لا يوجد مزود', noResponse: 'لا يوجد رد',
    },
    layout: {
        maxElements: 'الصف يحتوي بالفعل على 12 عنصرًا: احذف عنصرًا أولاً.',
        noSpace: 'لا مساحة: لا يمكن تصغير العناصر لإضافة هذا الحقل.',
        dragToMove: 'اسحب للتحريك', remove: 'إزالة',
        dragToResize: 'اسحب لتغيير الحجم', dragHere: 'اسحب عنصرًا إلى هنا',
    },
};

export default ar;
