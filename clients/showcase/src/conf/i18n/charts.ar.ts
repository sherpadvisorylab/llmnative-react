import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        charts: {
            page: {
                title: "المخططات",
                description: "مخططات SVG بلا اعتماديات: ألوان السمة والوضع الداكن، حركة تحترم تقليل الحركة، تلميح يتبع المؤشر ولوحة المفاتيح، وجدول بيانات لقارئات الشاشة.",
            },
            sections: {
                columns: { title: "أعمدة", description: "سلسلة واحدة من المجموعات مع القيم في الأعلى وعلامات (الوسيط، المئين)." },
                stacked: { title: "أعمدة متراكمة", description: "مجموعات مقسمة حسب السلاسل مع الإجمالي في التلميح؛ علامة مقارنة اختيارية." },
                lines: { title: "خطوط", description: "سلاسل عبر الزمن: القيمة null تقطع الخط، والسلسلة المتقطعة للمقارنة، والعتبة تحدد حدًا." },
                areas: { title: "مساحات متراكمة", description: "التدفق التراكمي للعمل عبر مراحله، أو تكوين إجمالي." },
                scatter: { title: "مخطط التبعثر", description: "كميتان لكل نقطة وثالثة كمساحتها، ملونة حسب السلسلة: التكلفة مقابل إعادة العمل لكل وكيل." },
                diverging: { title: "أشرطة متباعدة", description: "كميتان حول خط الصفر بمقياس واحد: القيمة في الأعلى والتكلفة في الأسفل." },
                lists: { title: "قوائم وأرقام", description: "ترتيبات مع التغير، رقم يعد تصاعديًا، خط مصغر." },
                heatmaps: { title: "خرائط حرارية", description: "شبكة صفوف × أعمدة، وتقويم أيام يبدأ من الاثنين: الأغمق يعني أكثر." },
            },
            labels: {
                otherWeek: "أسبوع آخر",
                closedPerDay: "طلبات التغيير المغلقة يوميًا",
                median: "الوسيط",
                hoursByAgent: "الساعات لكل وكيل",
                leadTime: "زمن التسليم",
                target: "الهدف",
                thisPeriod: "هذه الفترة",
                lastPeriod: "الفترة السابقة",
                cumulativeFlow: "التدفق التراكمي",
                closed: "مغلقة",
                backlog: "قائمة الانتظار",
                costAgainstRework: "التكلفة مقابل إعادة العمل",
                costPerCr: "التكلفة لكل طلب",
                rework: "إعادة العمل",
                turns: "الأدوار",
                valueAndCost: "القيمة والتكلفة",
                value: "القيمة",
                cost: "التكلفة",
                costByAgent: "التكلفة لكل وكيل",
                costTrend: "اتجاه التكلفة",
                turnsByHour: "الأدوار لكل ساعة",
                turnsByDay: "الأدوار لكل يوم",
            },
        },
    },
});
