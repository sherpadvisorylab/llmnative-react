import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        code: {
            page: { title: 'Code', description: 'كتلة كود مع تمييز نحوي تعتمد على Prism، مع إجراء نسخ اختياري وتحميل اللغة واختيار السمة.' },
            sections: {
                tsx: { title: 'كتلة TSX', description: 'استخدم Code للأمثلة والمقتطفات ومعاينات الشيفرة المولدة.' },
                languages: { title: 'اللغات', description: 'يقوم المكوّن بتحميل قواعد Prism الخاصة باللغة المحددة بشكل كسول.' },
                themesCopy: { title: 'السمات والنسخ', description: 'انقر على سمة لمعاينتها. تتحكم showCopy في زر الحافظة.' },
                slotsWrapper: { title: 'الفتحات و wrapper', description: 'يوضع pre و post خارج كتلة الكود كعناصر جانبية يمنى ويسرى. وتسمح wrapperClassName و className بدمج الكتلة داخل تخطيطات توثيقية أغنى.' },
            },
        },
    },
});
