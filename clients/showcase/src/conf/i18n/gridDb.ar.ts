import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridDb: {
            page: {
                title: 'GridDB',
                description: 'نسخة Grid المعتمدة على provider. تشترك في مسار من DataProvider وتستقبل التحديثات تلقائيا، مع دعم التصفية والترتيب وربط الحقول على مستوى provider.',
            },
            sections: {
                basicUsage: {
                    title: 'الاستخدام الأساسي',
                    description: 'أبسط شكل صالح لـ GridDB. وفر مسارا ودع Grid يشترك في المجموعة ويستنتج الأعمدة من السجلات الواردة.',
                },
                providerFilter: {
                    title: 'تصفية على مستوى provider',
                    description: 'يقوم where بتصفية السجلات على مستوى provider قبل وصولها إلى المكون، لذلك لا تقوم الشبكة بجلب بيانات زائدة.',
                },
                providerOrder: {
                    title: 'ترتيب على مستوى provider',
                    description: 'يقوم order بترتيب السجلات على مستوى provider قبل أن يستلمها المكون.',
                },
                fromUrl: {
                    title: 'fromUrl - مسار مدفوع بالمسار',
                    description: 'يقوم fromUrl بحل مسار المجموعة من pathname الحالي بدلا من مسار ثابت. هذا العرض يقرأ من عنوان URL الخاص بالصفحة الحالية.',
                },
                grouping: {
                    title: 'التجميع',
                    description: 'يقوم groupBy بفصل الصفوف تحت عناوين الأقسام. وهو يعمل مع الجدول والمعرض ويمكن دمجه مع الترتيب على مستوى provider.',
                },
            },
            labels: {
                teamMembers: 'أعضاء الفريق',
            },
            propsDocs: {
                categories: {
                    gridDb: 'GridDB',
                    shared: 'مشتركة',
                },
                items: {
                    path: { description: 'مسار مجموعة DataProvider. استخدمه مع fromUrl={false} بشكل افتراضي.' },
                    fromUrl: { description: 'عند ضبطه على true يتم اشتقاق مسار المجموعة من pathname الحالي بدلا من path. يملك fromUrl الاولوية دائما.' },
                    recordId: { description: 'محلل الهوية المستخدم للتحديد وحالة التحرير ومسارات التغيير. مرر اسم حقل أو دالة سهمية.' },
                    where: { description: 'تصفية على مستوى provider يتم تطبيقها قبل بث السجلات.' },
                    order: { description: 'ترتيب على مستوى provider يتم تطبيقه قبل بث السجلات.' },
                    fieldMap: { description: 'يعيد تعيين أسماء حقول provider إلى الأسماء المستخدمة في الواجهة قبل العرض.' },
                },
            },
            playground: {
                groups: {
                    gridDb: 'GridDB',
                    shared: 'مشتركة',
                },
                props: {
                    path: { description: 'مسار المجموعة المستخدم عندما يكون fromUrl معطلا.' },
                    fromUrl: { description: 'يشتق مسار المجموعة من pathname الحالي. في هذا playground ينتقل إلى بيانات seed مختلفة.' },
                    recordId: {
                        description: 'محلل هوية السجل.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'استخدم حقل المفتاح الاصلي الخاص بالـ provider.' },
                            explicitId: { label: 'id', help: 'استخدم حقل id الصريح.' },
                            functionId: { label: 'fn', help: 'دالة سهمية تعيد حقل id.' },
                        },
                    },
                    where: {
                        description: 'تصفية على مستوى provider قبل بث السجلات.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'بدون تصفية.' },
                            active: { label: 'active', help: 'اعرض الأعضاء النشطين فقط.' },
                            admins: { label: 'admins', help: 'اعرض المشرفين فقط.' },
                        },
                    },
                    order: {
                        description: 'ترتيب على مستوى provider قبل بث السجلات.',
                        shortcuts: {
                            none: { label: 'none', help: 'احتفظ بترتيب provider الافتراضي.' },
                            nameAsc: { label: 'name asc', help: 'رتب حسب الاسم تصاعديا.' },
                            emailDesc: { label: 'email desc', help: 'رتب حسب البريد تنازليا.' },
                        },
                    },
                    fieldMap: {
                        description: 'يعيد تعيين أسماء حقول provider إلى أسماء الواجهة.',
                        shortcuts: {
                            empty: { label: 'empty', help: 'بدون تعيين.' },
                            fullName: { label: 'fullName', help: 'اعرض حقل provider "name" باسم "fullName".' },
                        },
                    },
                },
            },
        },
    },
});
