import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageEditor: {
            page: {
                title: 'ImageEditor',
                description: 'ودجت كامل لتحرير الصور مبني على tui-image-editor. يدعم القص والقلب والدوران والرسم الحر والاشكال والنص والتكبير. متاح بشكل inline او داخل modal.',
            },
            sections: {
                inlineEditor: {
                    title: 'محرر inline',
                    description: 'ضع المحرر مباشرة داخل الصفحة. يظهر شريط الادوات في الاعلى ويملأ الـ canvas كل العرض المتاح.',
                },
                modalEditor: {
                    title: 'محرر modal',
                    description: 'مرر mode="modal" لفتح المحرر داخل overlay بملء الشاشة. يشترك العنوان وشريط الادوات في سطر header نظيف واحد، ويتم استدعاء onClose عندما يغلقه المستخدم.',
                },
            },
            labels: {
                sampleTitle: 'مثال',
                sampleSubtitle: 'مثال - عدل هذه الصورة',
                lastSavedOutput: 'اخر ناتج محفوظ:',
                savedResultAlt: 'النتيجة المحفوظة',
                openEditorInModal: 'افتح المحرر داخل modal',
                editPhoto: 'تعديل الصورة',
                savedResult: 'النتيجة المحفوظة:',
                savedAlt: 'محفوظ',
            },
            propsDocs: {
                title: 'خصائص ImageEditor',
                items: {
                    src: { description: 'رابط URL او data URL للصورة المراد تعديلها.' },
                    title: { description: 'العنوان الظاهر في header الخاص بالـ modal ويستخدم فقط عند mode="modal".', default: '"Image Editor"' },
                    width: { description: 'اقصى عرض CSS للـ canvas بالبكسل.', default: '700' },
                    height: { description: 'اقصى ارتفاع CSS للـ canvas بالبكسل.', default: '500' },
                    mode: { description: 'يعرض داخل modal overlay ("modal") او بشكل inline داخل الصفحة ("inline").', default: '"inline"' },
                    onImageLoad: { description: 'Callback يتم استدعاؤه عند انتهاء تحميل الصورة داخل المحرر.' },
                    onClose: { description: 'Callback يتم استدعاؤه عندما يغلق المستخدم الـ modal، ومتاح فقط في وضع modal.' },
                    onSave: { description: 'Callback يتم استدعاؤه عندما يضغط المستخدم Save. يستقبل الصورة المعدلة كـ data URL.' },
                },
            },
        },
    },
});
