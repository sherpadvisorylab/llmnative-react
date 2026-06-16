import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        pagination: {
            page: {
                title: 'Pagination',
                description: 'تنقل بين الصفحات مع عناصر first و previous و next و last، بالإضافة إلى نافذة صفحات قابلة للتهيئة. يستخدمها Grid تلقائياً.',
            },
            sections: {
                interactive: {
                    title: 'ترقيم تفاعلي - 50 سجلاً، 8 لكل صفحة',
                    description: 'انقر على عناصر التحكم للتنقل داخل مجموعة البيانات.',
                },
                sticky: {
                    title: 'شريط ترقيم مثبت',
                    description: 'عند ضبط sticky=true يطفو شريط الترقيم أسفل نافذة العرض مع خلفية ضبابية. هذا هو السلوك الافتراضي في Grid.',
                },
            },
            labels: {
                recordPrefix: 'سجل',
                stickyPreviewLead: 'يعرض شريط التنقل باستخدام',
                stickyPreviewMiddle: 'و',
                stickyPreviewEnd: 'لذلك يطفو فوق المحتوى من دون أن يحجبه بالكامل.',
            },
            propsDocs: {
                items: {
                    records: { description: 'مجموعة البيانات الكاملة المراد تقسيمها إلى صفحات.' },
                    children: { description: 'دالة render تستقبل سجلات الصفحة الحالية والإزاحة.' },
                    page: { description: 'الصفحة النشطة الابتدائية (تبدأ من 1). تُطبَّق مرة واحدة عند mount ثم تتولى الحالة الداخلية إدارة التنقل اللاحق.' },
                    limit: { description: 'عدد العناصر في كل صفحة.' },
                    maxPageButtons: { description: 'الحد الأقصى لعدد أزرار الصفحات الظاهرة.' },
                    sticky: { description: 'يثبت شريط الترقيم أسفل نافذة العرض.' },
                    align: { description: 'المحاذاة الأفقية لعناصر التحكم في الترقيم.' },
                    scrollToTopOnChange: { description: 'ينقل الصفحة إلى الأعلى عند تغيير الصفحة النشطة.' },
                    scrollBehavior: { description: 'سلوك scrollIntoView المستخدم عند تفعيل scrollToTopOnChange.' },
                    appendTo: { description: 'هدف portal لشريط الترقيم.' },
                    before: { description: 'محتوى يُعرض داخل غلاف الترقيم قبل شريط أزرار الصفحات.' },
                    after: { description: 'محتوى يُعرض داخل غلاف الترقيم بعد شريط أزرار الصفحات.' },
                    wrapperClassName: { description: 'أصناف CSS المطبقة على عنصر الغلاف الخارجي.' },
                    className: { description: 'أصناف CSS المطبقة على عنصر nav الذي يحتوي أزرار الصفحات.' },
                },
            },
            playground: {
                title: 'Pagination',
                props: {
                    limit: { description: 'عدد العناصر في كل صفحة.' },
                    maxPageButtons: { description: 'الحد الأقصى لعدد أزرار الصفحات الظاهرة.' },
                    sticky: { description: 'يثبت شريط الترقيم أسفل نافذة العرض.' },
                    align: { description: 'المحاذاة الأفقية لعناصر التحكم في الترقيم.' },
                    scrollToTopOnChange: { description: 'ينقل الصفحة إلى الأعلى عند تغيير الصفحة النشطة.' },
                },
            },
        },
    },
});
