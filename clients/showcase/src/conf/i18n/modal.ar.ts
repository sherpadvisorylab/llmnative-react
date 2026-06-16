import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modal: {
            page: {
                title: 'Modal',
                description: 'حوارات متمركزة ولوحات جانبية. تبديل fullscreen ودوال save/delete غير متزامنة ورندر عبر portal.',
            },
            sections: {
                positions: {
                    title: 'المواضع',
                    description: 'اضغط زرًا لفتح الـ modal في الموضع المقابل.',
                },
            },
            demo: {
                dialogTitleCenter: 'Dialog - center',
                panelTitle: 'Panel - {position}',
                dialogBody: 'حوار متمركز. يدعم الأحجام `sm` و `md` و `lg` و `xl` و `2xl` و `fullscreen`.',
                panelBody: 'لوحة جانبية بموضع **{position}**. يتم رندرها داخل `document.body` عبر React portal.',
                openButton: 'افتح modal',
                defaultTitle: 'عنوان الحوار',
                defaultBody: 'يظهر محتوى الـ modal هنا.',
            },
            propsDocs: {
                items: {
                    children: { description: 'محتوى body الخاص بالـ modal' },
                    title: { description: 'عنوان الـ modal المعروض في header' },
                    header: { description: 'محتوى header مخصص (يستبدل العنوان)' },
                    footer: { description: 'محتوى footer مخصص، أو false لإخفاء الـ footer بالكامل', typeDetails: 'ReactNode | false' },
                    size: { description: 'عرض الحوار' },
                    position: { description: 'مكان ظهور الـ modal. المواضع غير المركزية تُعرض كلوحات طرفية.' },
                    onClose: { description: 'يُستدعى عندما يغلق المستخدم الـ modal' },
                    onSave: { description: 'معالج save غير متزامن. أرجع true للإغلاق و false للإبقاء عليه مفتوحًا.' },
                    onDelete: { description: 'معالج delete غير متزامن. يُظهر زر delete في الـ footer.' },
                    closeOnBackdrop: { description: 'إغلاق الـ modal عند الضغط على الخلفية' },
                    allowFullscreen: { description: 'إظهار زر fullscreen في الـ header' },
                    showCancel: { description: 'إظهار زر Cancel في الـ footer عندما يكون onClose موجودًا' },
                    zIndex: { description: 'تجاوز CSS z-index، مفيد عند تكديس عدة modals' },
                    headerClassName: { description: 'فئات CSS على حاوية header' },
                    titleClassName: { description: 'فئات CSS على عنصر العنوان' },
                    subtitleClassName: { description: 'فئات CSS على عنصر subtitle (عند وجود title و header معًا)' },
                    bodyClassName: { description: 'فئات CSS على حاوية body' },
                    footerClassName: { description: 'فئات CSS على حاوية footer' },
                    wrapperClassName: { description: 'فئات CSS على عنصر wrapper الخارجي للحوار' },
                    className: { description: 'فئات CSS على الحاوية flex الداخلية' },
                    before: { description: 'محتوى يُعرض قبل الحاوية الداخلية داخل wrapper الحوار' },
                    after: { description: 'محتوى يُعرض بعد الحاوية الداخلية داخل wrapper الحوار' },
                    motion: { description: 'preset motion مسمى أو override inline لـ MotionProps لرسوم دخول/خروج الحوار', typeDetails: 'string | MotionEffect | false' },
                },
            },
        },
    },
});
