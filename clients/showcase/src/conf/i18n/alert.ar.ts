import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        alert: {
            page: { title: 'Alert', description: 'رسائل ملاحظات سياقية للمستخدم. تدعم الأيقونات والإغلاق التلقائي والتموضع الثابت.' },
            sections: {
                variants: { description: 'لكل نوع ألوان وأيقونة جاهزة مسبقاً.' },
                appearance: { title: 'المظهر', description: 'القيمة appearance="text" تعرض مؤشراً مدمجاً صغيراً: بلا خلفية، بلا حدود، والعرض يطابق المحتوى. مثالي لرسائل الحالة بجانب الأزرار.' },
                withoutIcon: { title: 'بدون أيقونة' },
                autoDismiss: { title: 'إغلاق تلقائي', description: 'يُغلق التنبيه تلقائياً بعد المهلة المحددة (مللي ثانية).' },
                placement: { title: 'أنماط التموضع', description: 'تتحكم placement في مكان عرض التنبيه: inline (الافتراضي داخل تدفق المستند العادي) أو fixed (مثبّت على نافذة العرض عبر portal فوق كل المحتوى).' },
            },
        },
    },
});
