import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        input: {
            page: {
                title: 'Input',
                description: 'يدعم صيغ text و number و email و password و color و date و datetime و week و month و textarea. جميع الحقول تدرك سياق Form وتتكامل معه تلقائيا.',
            },
            sections: {
                textVariants: {
                    title: 'صيغ نصية',
                    description: 'اكثر انواع الحقول شيوعا. كلها تدعم label و required و placeholder و disabled.',
                },
                numberRange: { title: 'رقم ونطاق' },
                dateTime: { title: 'التاريخ والوقت' },
                colorPicker: { title: 'منتقي الالوان' },
                textarea: {
                    title: 'Textarea',
                    description: 'نص متعدد الاسطر بعدد صفوف قابل للضبط.',
                },
                checkbox: { title: 'Checkbox' },
                disabledReadOnlyAfterSet: {
                    title: 'Disabled و readOnlyAfterSet',
                    description: 'يقوم readOnlyAfterSet بتعطيل الحقل بعد تعيين قيمة له.',
                },
            },
            labels: {
                fieldLabel: 'عنوان الحقل',
                typeSomething: 'اكتب شيئا...',
                firstName: 'الاسم الاول',
                email: 'البريد الالكتروني',
                password: 'كلمة المرور',
                website: 'الموقع',
                age: 'العمر',
                score: 'النتيجة (0-100)',
                birthday: 'تاريخ الميلاد',
                startTime: 'وقت البدء',
                appointment: 'الموعد',
                week: 'الاسبوع',
                month: 'الشهر',
                brandColor: 'لون العلامة',
                bio: 'نبذة',
                tellUsAboutYourself: 'اخبرنا عنك...',
                acceptTerms: 'اوافق على الشروط والاحكام',
                recordId: 'معرف السجل',
                slug: 'Slug',
            },
            propsDocs: {
                title: 'خصائص Input',
                items: {
                    name: { description: 'اسم الحقل المستخدم كمفتاح للنموذج ومسار dot-notation.' },
                    label: { description: 'العنوان المعروض فوق الحقل.' },
                    type: { description: 'نوع HTML للحقل.' },
                    placeholder: { description: 'نص العنصر النائب.' },
                    required: { description: 'يجعل الحقل مطلوبا ويعرض نجمة في العنوان.' },
                    disabled: { description: 'يجعل الحقل للقراءة فقط.' },
                    readOnlyAfterSet: { description: 'يصبح الحقل للقراءة فقط بعد تعيين قيمة له.' },
                    defaultValue: { description: 'القيمة الابتدائية عندما لا يكون الحقل مُدارا بواسطة Form.' },
                    min: { description: 'الحد الادنى لحقول number و range.' },
                    max: { description: 'الحد الاقصى لحقول number و range.' },
                    step: { description: 'قيمة التدرج لحقول number و range.' },
                    feedback: { description: 'رسالة التحقق المعروضة اسفل الحقل.' },
                    id: { description: 'معرف صريح لعنصر input. يتم توليده تلقائيا عند عدم توفيره.' },
                    labelClassName: { description: 'فئات CSS المطبقة على عنصر label.' },
                    validator: { description: 'دالة تحقق مخصصة. اعد رسالة خطا لمنع الارسال.' },
                    className: { description: 'فئات CSS على عنصر input.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي.' },
                },
            },
            playground: {
                title: 'Input',
            },
        },
    },
});
