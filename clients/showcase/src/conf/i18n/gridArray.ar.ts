import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridArray: {
            page: {
                title: 'GridArray',
                description: 'نسخة Grid داخل الذاكرة تعرض مباشرة مصفوفة سجلات يملكها المستدعي. مناسبة للبيانات المحسوبة والحالة المحلية ومجموعات البيانات الصغيرة الموجودة بالفعل في الواجهة.',
            },
            sections: {
                basicUsage: {
                    title: 'الاستخدام الأساسي',
                    description: 'أبسط شكل صالح لـ GridArray. مرر مصفوفة سجلات ودع Grid يستنتج الأعمدة من بنية البيانات. تم إبقاء sortable و pagination صريحين هنا ليبقى المثال واضحا ومكتفيا ذاتيا.',
                },
                onLoadTransform: {
                    title: 'تحويل onLoad',
                    description: 'استخدم onLoad لتطبيع السجلات أو إثرائها قبل العرض. يعمل التحويل في كل دورة عرض ويمكن أيضا أن يكتمل بشكل غير متزامن.',
                },
                grouping: {
                    title: 'التجميع',
                    description: 'يقوم groupBy بفصل الصفوف تحت عناوين أقسام قابلة للطي. ويعمل مع تخطيط الجدول والمعرض، ويقبل حقلا واحدا أو عدة مستويات.',
                },
                selection: {
                    title: 'التحديد',
                    description: 'يتيح selection أزرار الاختيار أو مربعات الاختيار. استخدم الصيغة المختصرة لحالة واجهة فقط، أو صيغة الكائن عندما تحتاج إلى callbacks ومفاتيح افتراضية.',
                },
            },
            labels: {
                teamMembers: 'أعضاء الفريق',
                singleSelection: 'تحديد مفرد',
                multipleSelection: 'تحديد متعدد',
            },
            propsDocs: {
                categories: {
                    gridArray: 'GridArray',
                    shared: 'مشتركة',
                },
                items: {
                    records: {
                        description: 'مصفوفة سجلات يملكها المستدعي. يقوم GridArray بعرض هذه اللقطة مباشرة ولا يشترك مع أي provider. في playground تأتي السجلات من قاعدة Mock بالاسفل.',
                    },
                    recordId: {
                        description: 'محلل الهوية المستخدم للتحديد وحالة التحرير ومسارات التغيير. مرر اسم حقل أو دالة سهمية.',
                    },
                    onLoad: {
                        description: 'يحوّل السجلات قبل العرض. يمكن تنفيذه بشكل متزامن أو غير متزامن بعد تمرير البيانات.',
                    },
                },
            },
            playground: {
                groups: {
                    gridArray: 'GridArray',
                    shared: 'مشتركة',
                },
                props: {
                    records: {
                        description: 'مصفوفة سجلات يملكها المستدعي. في هذا playground تأتي السجلات من قاعدة Mock بالاسفل. عدلها لترى تحديث الشبكة مباشرة.',
                    },
                    recordId: {
                        description: 'محلل هوية السجل. مرر اسم حقل مثل "_key" أو دالة سهمية.',
                        shortcuts: {
                            nativeKey: { label: '_key', help: 'استخدم حقل المفتاح الاصلي الخاص بالـ provider.' },
                            explicitId: { label: 'id', help: 'استخدم حقل id الصريح.' },
                            functionId: { label: 'fn', help: 'دالة سهمية تعيد حقل id.' },
                        },
                    },
                    onLoad: {
                        description: 'يحوّل السجلات قبل العرض. تتم ادارته داخليا داخل playground.',
                    },
                },
            },
        },
    },
});
