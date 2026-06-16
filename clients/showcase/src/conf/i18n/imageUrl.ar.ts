import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageUrl: {
            page: {
                title: 'ImageUrl',
                description: 'حقل نموذج مركب لعنوان الصورة URL وبيانات alt prompt والعرض والارتفاع والمعاينة الحية.',
            },
            sections: {
                imageMetadata: {
                    title: 'بيانات الصورة',
                },
            },
            labels: {
                hero: 'hero',
                heroImage: 'صورة hero',
                blueHeroIllustration: 'رسم hero ازرق',
                squareThumbnail: 'صورة مصغرة مربعة',
            },
            propsDocs: {
                title: 'خصائص ImageUrl',
                items: {
                    name: { description: 'اسم حقل الكائن داخل سجل Form.' },
                    label: { description: 'تسمية حقل URL.' },
                    required: { description: 'يجعل الحقول المتداخلة مطلوبة.' },
                    defaultValue: { description: 'كائن الصورة المتداخل الابتدائي.' },
                    value: { description: 'قيمة متحكم بها لكائن الصورة المتداخل المدار خارجيا.' },
                    inheritWrapperClassName: { description: 'عند true يرث الحقل wrapperClassName من سياق Form الاب.' },
                    mode: { description: 'وضع prompt المستخدم لنص alt.' },
                    before: { description: 'محتوى قبل مجموعة الحقول.' },
                    after: { description: 'محتوى بعد مجموعة الحقول.' },
                    onChange: { description: 'معالج change مخصص يستدعيه سياق Form.' },
                    className: { description: 'فئات CSS على حقل URL.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف.' },
                },
            },
            playground: {
                title: 'ImageUrl',
            },
        },
    },
});
