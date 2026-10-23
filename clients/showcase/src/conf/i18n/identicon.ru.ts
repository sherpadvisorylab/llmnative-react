import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        identicon: {
            page: {
                title: 'Identicon',
                description: "Иконка, нарисованная по значению, как GitHub рисует её для аккаунта без изображения: симметричная сетка 5×5, ячейки и оттенок из хеша. Одно и то же значение всегда даёт одну и ту же иконку; ничего не загружается и не сохраняется.",
            },
            sections: {
                values: {
                    title: "Значения",
                    description: "У каждого значения своя иконка: для репозиториев, арендаторов или пользователей без фото.",
                },
                sizes: {
                    title: "Размеры",
                    description: "size задаёт ширину и высоту в пикселях; рисунок масштабируется без размытия.",
                },
                inRow: {
                    title: "В строке",
                    description: "before и after размещают содержимое рядом с иконкой; className меняет её форму.",
                },
            },
            labels: {
                repository: "Репозиторий",
            },
            propsDocs: {
                title: "Props Identicon",
                items: {
                    value: { description: "Что представляет иконка: одно и то же значение всегда рисует одну и ту же иконку." },
                    size: { description: "Ширина и высота в пикселях (по умолчанию 40)." },
                    title: { description: "Доступное имя: с ним иконка role=\"img\"; без него — декоративная (aria-hidden)." },
                    before: { description: "Содержимое перед иконкой." },
                    after: { description: "Содержимое после иконки." },
                    className: { description: "Классы SVG; по умолчанию rounded-md bg-muted (тема Identicon.className)." },
                    wrapperClassName: { description: "Классы обёртки, есть только с before или after." },
                },
            },
            playground: {
                title: 'Identicon',
            },
        },
    },
});
