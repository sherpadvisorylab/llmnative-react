import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        card: {
            page: { title: 'Card', description: 'حاوية متعددة الاستخدامات مع header و body و footer اختياريين وطبقة loader مدمجة.' },
            sections: {
                basic: { title: 'Card أساسية' },
                headerFooter: { title: 'مع header و footer' },
                grid: { title: 'شبكة Card' },
                loader: { title: 'Card مع loader', description: 'مرّر loading لعرض spinner فوق المحتوى أثناء جلب البيانات.' },
            },
        },
    },
});
