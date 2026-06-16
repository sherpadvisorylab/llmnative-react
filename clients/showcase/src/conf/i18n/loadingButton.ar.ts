import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loadingButton: {
            page: { title: 'LoadingButton', description: 'زر غير متزامن يعطّل نفسه أثناء تنفيذ العمل. يدعم تحديثات مباشرة للتسمية أثناء التنفيذ عبر setMessage.' },
            sections: {
                asyncSave: { title: 'حفظ غير متزامن', description: 'مرّر onClick غير متزامن. يعرض الزر spinner ويمنع إعادة النقر حتى تنتهي الـ promise.' },
                customLabel: { title: 'تسمية تحميل مخصّصة', description: 'تستبدل loadingLabel التسمية الافتراضية "Save…" أثناء نشاط spinner.' },
                streaming: { title: 'تسمية مباشرة عبر setMessage', description: 'المعامل الثاني لـ onClick هو setMessage. استدعِه في أي وقت أثناء العمل غير المتزامن لتحديث تسمية التحميل مباشرة، وهو مفيد للعمليات متعددة الخطوات.' },
                disabled: { title: 'حالة التعطيل', description: 'تُبقي disabled الزر غير نشط دائماً بغض النظر عن دورة التحميل.' },
                controlled: { title: 'تحميل متحكَّم به (loading)', description: 'تسمح loading لمكوّن أب بالتحكم خارجياً في حالة التحميل، وهو أمر مفيد عندما يكون الزر جزءاً من تدفق إرسال نموذج أكبر.' },
                variants: { description: 'يدعم LoadingButton نفس رموز التنويعات الموجودة في ActionButton.' },
            },
        },
    },
});
