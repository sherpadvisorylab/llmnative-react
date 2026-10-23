import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        identicon: {
            page: {
                title: 'Identicon',
                description: "根据一个值绘制的图标，就像 GitHub 为没有头像的账户绘制的那样：对称的 5×5 网格，单元格和色调来自哈希。相同的值总是得到相同的图标；不加载也不存储任何内容。",
            },
            sections: {
                values: {
                    title: "值",
                    description: "每个值都有自己的图标：用于仓库、租户或没有照片的用户。",
                },
                sizes: {
                    title: "尺寸",
                    description: "size 以像素设置宽度和高度；图形缩放时不会模糊。",
                },
                inRow: {
                    title: "在一行中",
                    description: "before 和 after 在图标旁放置内容；className 改变其形状。",
                },
            },
            labels: {
                repository: "仓库",
            },
            propsDocs: {
                title: "Identicon 属性",
                items: {
                    value: { description: "图标代表的内容：相同的值总是绘制相同的图标。" },
                    size: { description: "宽度和高度，单位像素（默认 40）。" },
                    title: { description: "可访问名称：有它时图标为 role=\"img\"；没有时为装饰性（aria-hidden）。" },
                    before: { description: "图标之前的内容。" },
                    after: { description: "图标之后的内容。" },
                    className: { description: "SVG 的类；默认 rounded-md bg-muted（主题 Identicon.className）。" },
                    wrapperClassName: { description: "容器的类，仅在有 before 或 after 时存在。" },
                },
            },
            playground: {
                title: 'Identicon',
            },
        },
    },
});
