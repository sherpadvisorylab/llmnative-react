import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        identicon: {
            page: {
                title: 'Identicon',
                description: "أيقونة مرسومة من قيمة، كما يرسم GitHub أيقونة لحساب بلا صورة: شبكة 5×5 متماثلة، الخلايا والتدرج اللوني من تجزئة. القيمة نفسها تعطي دائمًا الأيقونة نفسها؛ لا يتم تحميل أو تخزين أي شيء.",
            },
            sections: {
                values: {
                    title: "القيم",
                    description: "لكل قيمة أيقونتها: استخدمها للمستودعات أو المستأجرين أو المستخدمين بلا صورة.",
                },
                sizes: {
                    title: "الأحجام",
                    description: "size يحدد العرض والارتفاع بالبكسل؛ يتغير حجم الرسم دون ضبابية.",
                },
                inRow: {
                    title: "في صف",
                    description: "before و after يضعان محتوى بجانب الأيقونة؛ className يغيّر شكلها.",
                },
            },
            labels: {
                repository: "مستودع",
            },
            propsDocs: {
                title: "خصائص Identicon",
                items: {
                    value: { description: "ما تمثله الأيقونة: القيمة نفسها ترسم دائمًا الأيقونة نفسها." },
                    size: { description: "العرض والارتفاع بالبكسل (الافتراضي 40)." },
                    title: { description: "اسم قابل للوصول: معه تكون الأيقونة role=\"img\"؛ بدونه تكون زخرفية (aria-hidden)." },
                    before: { description: "محتوى قبل الأيقونة." },
                    after: { description: "محتوى بعد الأيقونة." },
                    className: { description: "فئات SVG؛ افتراضيًا rounded-md bg-muted (السمة Identicon.className)." },
                    wrapperClassName: { description: "فئات الحاوية، موجودة فقط مع before أو after." },
                },
            },
            playground: {
                title: 'Identicon',
            },
        },
    },
});
