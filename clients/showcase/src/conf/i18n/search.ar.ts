import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        search: {
            page: {
                title: 'البحث',
                description: 'عنصر تشغيل البحث في الترويسة. التنفيذ الحالي يعرض زر تبديل وحقل إدخال مخفياً.',
            },
            sections: {
                searchTrigger: {
                    title: 'مشغل البحث',
                    description: 'استخدم Search كمدخل مدمج في الترويسة عندما يجب أن يتمدد حقل البحث فقط عند الطلب.',
                },
            },
            propsDocs: {
                items: {
                    onQueryChange: { description: 'يتم استدعاؤها عند تغير حقل البحث المخفي.' },
                },
            },
            playground: {
                title: 'البحث',
            },
        },
    },
});
