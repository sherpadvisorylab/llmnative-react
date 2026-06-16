import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loader: {
            page: { title: 'Loader', description: 'Spinner متراكب يلتف حول أي محتوى. عندما تكون show=true يتم عرض خلفية ضبابية مع spinner بنمط الثيم فوق children، بينما يبقى المحتوى في DOM ويظهر فوراً عند إخفاء loader.' },
            sections: {
                showHide: { title: 'إظهار / إخفاء', description: 'بدّل show لتغطية المحتوى المغلّف أو كشفه. يبقى المحتوى مركّباً دائماً، لذلك لا يحدث تبدل في التخطيط عند اختفاء loader.' },
                custom: { title: 'أيقونة ورسالة مخصصتان', description: 'يمكنك تجاوز قيم الثيم لكل حالة عبر icon و title و description. قيمة icon هي اسم أيقونة، وأي أيقونة يدعمها الموفر المهيأ ستعمل.' },
                card: { title: 'تكامل Card', description: 'توفّر Card خاصية showLoader كاختصار عملي: فهي تلتف تلقائياً حول body الخاص بالبطاقة باستخدام Loader.' },
                other: { title: 'مؤشرات تحميل أخرى في الإطار', description: 'يوفّر @llmnative/react أنماط تحميل إضافية لسيناريوهات مختلفة.' },
            },
        },
    },
});
