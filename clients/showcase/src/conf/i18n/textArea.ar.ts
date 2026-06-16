import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        textArea: {
            page: {
                title: 'TextArea',
                description: 'حقل نص متعدد الاسطر ومتكامل مع سياق Form.',
            },
            sections: {
                basicTextarea: { title: 'Textarea اساسية' },
                autoResize: {
                    title: 'تغيير حجم تلقائي مع maxRows',
                    description: 'اضبط maxRows لكي تنمو textarea مع المحتوى. عند الوصول الى الحد تتوقف عن التمدد وتظهر شريط تمرير.',
                },
                feedbackPlaceholder: { title: 'مع feedback و placeholder' },
                addons: { title: 'مع اضافات قبل/بعد' },
            },
            labels: {
                notes: 'ملاحظات',
                writeShortNote: 'اكتب ملاحظة قصيرة...',
                initialNote: 'ملاحظة اولية',
                bio: 'نبذة',
                startTyping: 'ابدأ الكتابة - ستكبر textarea كلما اضفت اسطرا...',
                description: 'الوصف',
                describeIssue: 'صف المشكلة بالتفصيل...',
                beSpecific: 'كن محددا قدر الامكان.',
                signedNote: 'ملاحظة موقعة',
                note: 'ملاحظة',
            },
            propsDocs: {
                title: 'خصائص TextArea',
                items: {
                    name: { description: 'اسم الحقل المستخدم كمفتاح للنموذج.' },
                    label: { description: 'التسمية فوق textarea.' },
                    placeholder: { description: 'نص العنصر النائب.' },
                    required: { description: 'يجعل الحقل مطلوبا.' },
                    disabled: { description: 'يعطل textarea.' },
                    readOnlyAfterSet: { description: 'تصبح textarea للقراءة فقط بعد تعيين قيمة لها.' },
                    defaultValue: { description: 'القيمة الابتدائية للـ textarea المقدمة خارج سياق Form.' },
                    rows: { description: 'عدد ثابت من الصفوف المرئية. يتم تجاهله عند تعيين maxRows وكان المحتوى اقصر.' },
                    maxRows: { description: 'تغيير تلقائي للارتفاع حتى هذا العدد من الصفوف ثم يظهر شريط تمرير.' },
                    feedback: { description: 'نص مساعدة او تحقق يظهر اسفل الحقل.' },
                    before: { description: 'محتوى input-group المعروض قبل textarea.' },
                    after: { description: 'محتوى input-group المعروض بعد textarea.' },
                    id: { description: 'معرف صريح لعنصر textarea. يتم توليده تلقائيا عند عدم توفيره.' },
                    onChange: { description: 'معالج change مخصص يستدعيه سياق Form.' },
                    textareaRef: { description: 'مرجع ref يتم تمريره الى عنصر textarea الداخلي.' },
                    validator: { description: 'دالة تحقق مخصصة. اعد رسالة خطا لمنع الارسال.' },
                    className: { description: 'فئات CSS اضافية على عنصر textarea.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي.' },
                    labelClassName: { description: 'فئات CSS على عنصر label.' },
                },
            },
            playground: {
                title: 'TextArea',
            },
        },
    },
});
