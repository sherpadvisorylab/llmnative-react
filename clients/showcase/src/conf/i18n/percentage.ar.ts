import { defineLocaleMessages } from '@llmnative/react';
export default defineLocaleMessages({ showcase: { percentage: {
    page: { title: 'Percentage', description: 'مؤشر تقدّم يُعرض كشريط أفقي أو عداد دائري، مع تطبيع min/max وألوان متوافقة مع الثيم.' },
    sections: {
        bars: { title: 'أشرطة التقدّم', description: 'استخدم الأشرطة في لوحات المعلومات الكثيفة ولوحات التفاصيل داخل الجداول. تتم تسوية value بين min و max.' },
        circles: { title: 'عدادات دائرية', description: 'استخدم الدوائر لمؤشرات الملخص حيث تكون النسبة هي الإشارة البصرية الأساسية.' },
        normalization: { title: 'تطبيع min/max', description: 'تُحسب النسبة المعروضة من (value - min) / (max - min)، ثم تُحصر بين 0 و100.' },
        variants: { title: 'تنويعات الألوان والـ slots', description: 'variant يتحكم في التعبئة. trackVariant يتحكم في المسار. ويمكن لـ before/after إضافة سياق حول العنصر.' },
    },
    labels: {
        completion: 'الاكتمال',
        storage: 'التخزين',
        budgetUsed: 'الميزانية المستخدمة',
        risk: 'المخاطر',
        quality: 'الجودة',
        coverage: 'التغطية',
        noText: 'بلا نص',
        revenueTarget: 'هدف الإيرادات: 75 من 150',
        temperatureRange: 'نطاق الحرارة: 30 ضمن 20-40',
        clampedAboveMax: 'مقيد فوق الحد الأقصى',
    },
    propsDocs: { items: {
        value: { description: 'القيمة الحالية قبل تطبيع min/max.' }, max: { description: 'القيمة القصوى التي تقابل 100%.' }, min: { description: 'القيمة الدنيا التي تقابل 0%.' }, appearance: { description: 'شكل مؤشر التقدّم.' }, variant: { description: 'لون تعبئة التقدّم.' }, trackVariant: { description: 'لون المسار أو الخلفية.' }, thickness: { description: 'ارتفاع الشريط أو سماكة خط الدائرة.' }, showText: { description: 'إظهار نص النسبة بعد التطبيع.' }, size: { description: 'عرض الشريط كنسبة مئوية أو حجم الدائرة بالبكسل.' }, fontSize: { description: 'حجم نص النسبة بالبكسل.' }, label: { description: 'وسم أعلى النسبة.' }, before: { description: 'محتوى قبل العنصر.' }, after: { description: 'محتوى بعد العنصر.' }, className: { description: 'أصناف CSS على المؤشر المعروض.' }, wrapperClassName: { description: 'أصناف CSS على الغلاف.' },
    } },
    playground: { title: 'Percentage', defaultLabel: 'الاكتمال', props: {
        value: { description: 'القيمة الحالية قبل تطبيع min/max.' }, max: { description: 'القيمة القصوى التي تقابل 100%.' }, min: { description: 'القيمة الدنيا التي تقابل 0%.' }, appearance: { description: 'شكل مؤشر التقدّم.' }, variant: { description: 'لون تعبئة التقدّم.' }, trackVariant: { description: 'لون المسار أو الخلفية.' }, thickness: { description: 'ارتفاع الشريط أو سماكة خط الدائرة.' }, showText: { description: 'إظهار نص النسبة بعد التطبيع.' }, size: { description: 'عرض الشريط كنسبة مئوية أو حجم الدائرة بالبكسل.' }, fontSize: { description: 'حجم نص النسبة بالبكسل.' }, label: { description: 'وسم أعلى النسبة.' }, before: { description: 'محتوى قبل العنصر.' }, after: { description: 'محتوى بعد العنصر.' }, className: { description: 'أصناف CSS على المؤشر المعروض.' }, wrapperClassName: { description: 'أصناف CSS على الغلاف.' },
    } },
} } });
