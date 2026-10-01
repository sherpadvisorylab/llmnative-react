import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        descriptionList: {
            page: {
                title: 'DescriptionList',
                description: '只读的标签 → 值对，采用原生 <dl>/<dt>/<dd> 语义，支持水平或堆叠布局、响应式列和主题样式。',
            },
            sections: {
                horizontal: { title: '水平', description: '标签位于值旁边。在移动端会堆叠，并在较大屏幕上遵循 labelWidth。' },
                stacked: { title: '堆叠列', description: '标签位于值上方，以 1–6 列的响应式网格排列。' },
                emptyValues: { title: '空值', description: 'null、undefined 和空字符串渲染 emptyValue（默认 "—"）。' },
                truncate: { title: '截断', description: '让长值保持在一行并显示省略号，同时通过原生 title 暴露完整文本。' },
                theme: { title: '主题', description: '每个插槽都可通过 DescriptionList 主题键设置样式：wrapper、list、item、label 和 value。' },
            },
            labels: {
                email: '电子邮箱',
                role: '角色',
                admin: '管理员',
                fullName: '全名',
                company: '公司',
                status: '状态',
                phone: '电话',
                address: '地址',
                notes: '备注',
                bio: '简介',
                longValue: '一个非常长的值，无法在一行内显示，需要进行截断',
                empty: '不适用',
            },
            propsDocs: { items: {
                items: { description: '要渲染的标签和值对。' },
                layout: { description: '标签位置：值旁边（horizontal）或值上方（stacked）。' },
                columns: { description: 'stacked 布局下的响应式列数（1–6）。在 horizontal 下忽略。' },
                labelWidth: { description: 'horizontal 布局下固定的标签宽度（任意 CSS 长度，例如 "12rem"）。' },
                emptyValue: { description: '当值为 null、undefined 或空时渲染。默认 "—"。' },
                truncate: { description: '让值保持一行并显示省略号，并为文本值设置原生 title。' },
                className: { description: '<dl> 元素上的 CSS 类。' },
                wrapperClassName: { description: '外层包装器上的 CSS 类。' },
            } },
            playground: {
                title: 'DescriptionList',
                props: {
                    items: { description: '要渲染的标签和值对。' },
                    layout: { description: '标签位置：值旁边（horizontal）或值上方（stacked）。' },
                    columns: { description: 'stacked 布局下的响应式列数（1–6）。在 horizontal 下忽略。' },
                    labelWidth: { description: 'horizontal 布局下固定的标签宽度（任意 CSS 长度，例如 "12rem"）。' },
                    emptyValue: { description: '当值为 null、undefined 或空时渲染。默认 "—"。' },
                    truncate: { description: '让值保持一行并显示省略号，并为文本值设置原生 title。' },
                    className: { description: '<dl> 元素上的 CSS 类。' },
                    wrapperClassName: { description: '外层包装器上的 CSS 类。' },
                },
            },
        },
    },
});
