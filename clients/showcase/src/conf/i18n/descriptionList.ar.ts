import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: 'أزواج التسمية → القيمة للقراءة فقط بدلالات <dl>/<dt>/<dd> الأصلية، مع تخطيط أفقي أو مكدس، وأعمدة متجاوبة وتنسيق مستند إلى السمة.',
            },
            sections: {
                horizontal: { title: 'أفقي', description: 'التسمية بجانب القيمة. يتكدس الزوج على الجوال ويلتزم بـ labelWidth على الشاشات الأكبر.' },
                stacked: { title: 'أعمدة مكدسة', description: 'التسمية فوق القيمة، ضمن شبكة متجاوبة من 1 إلى 6 أعمدة.' },
                emptyValues: { title: 'القيم الفارغة', description: 'تعرض null و undefined والسلاسل الفارغة emptyValue (الافتراضي "—").' },
                truncate: { title: 'الاقتطاع', description: 'يبقي القيم الطويلة في سطر واحد مع علامة حذف ويكشف النص الكامل عبر title الأصلي.' },
                theme: { title: 'السمة', description: 'يمكن تنسيق كل خانة عبر مفتاح سمة DescriptionList: الغلاف والقائمة والعنصر والتسمية والقيمة.' },
            },
            labels: {
                email: 'البريد الإلكتروني',
                role: 'الدور',
                admin: 'مسؤول',
                fullName: 'الاسم الكامل',
                company: 'الشركة',
                status: 'الحالة',
                phone: 'الهاتف',
                address: 'العنوان',
                notes: 'ملاحظات',
                bio: 'نبذة',
                longValue: 'قيمة طويلة جدًا لا تتسع في سطر واحد وتحتاج إلى اقتطاع',
                empty: 'غير متاح',
            },
            propsDocs: { items: {
                items: { description: 'أزواج التسمية والقيمة المراد عرضها.' },
                layout: { description: 'موضع التسمية: بجانب القيمة (horizontal) أو فوقها (stacked).' },
                columns: { description: 'عدد الأعمدة المتجاوبة في تخطيط stacked (1–6). يُتجاهل في horizontal.' },
                labelWidth: { description: 'عرض ثابت للتسمية في تخطيط horizontal (أي طول CSS، مثل "12rem").' },
                emptyValue: { description: 'يُعرض عندما تكون القيمة null أو undefined أو فارغة. الافتراضي "—".' },
                truncate: { description: 'يبقي القيم في سطر واحد مع علامة حذف ويضبط title الأصلي لقيم النص.' },
                className: { description: 'فئات CSS على عنصر <dl>.' },
                wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي.' },
            } },
            playground: {
                title: 'DescriptionList',
                props: {
                    items: { description: 'أزواج التسمية والقيمة المراد عرضها.' },
                    layout: { description: 'موضع التسمية: بجانب القيمة (horizontal) أو فوقها (stacked).' },
                    columns: { description: 'عدد الأعمدة المتجاوبة في تخطيط stacked (1–6). يُتجاهل في horizontal.' },
                    labelWidth: { description: 'عرض ثابت للتسمية في تخطيط horizontal (أي طول CSS، مثل "12rem").' },
                    emptyValue: { description: 'يُعرض عندما تكون القيمة null أو undefined أو فارغة. الافتراضي "—".' },
                    truncate: { description: 'يبقي القيم في سطر واحد مع علامة حذف ويضبط title الأصلي لقيم النص.' },
                    className: { description: 'فئات CSS على عنصر <dl>.' },
                    wrapperClassName: { description: 'فئات CSS على الغلاف الخارجي.' },
                },
            },
        },
    },
});
