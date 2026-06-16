import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        pagination: {
            page: {
                title: 'Pagination',
                description: '分页导航，提供 first、previous、next、last 控件以及可配置的页码窗口。Grid 会自动使用它。',
            },
            sections: {
                interactive: {
                    title: '交互式分页 - 50 条记录，每页 8 条',
                    description: '点击分页控件浏览这组数据。',
                },
                sticky: {
                    title: '吸底分页栏',
                    description: '当 sticky=true 时，分页栏会带着模糊背景悬浮在视口底部。这是 Grid 中的默认行为。',
                },
            },
            labels: {
                recordPrefix: '记录',
                stickyPreviewLead: '会使用',
                stickyPreviewMiddle: '和',
                stickyPreviewEnd: '来渲染导航栏，因此它会悬浮在内容之上而不会完全遮挡内容。',
            },
            propsDocs: {
                items: {
                    records: { description: '需要分页的完整数据集。' },
                    children: { description: '渲染函数，接收当前页记录和偏移量。' },
                    page: { description: '初始激活页（从 1 开始）。只在挂载时应用一次，之后由内部状态管理后续翻页。' },
                    limit: { description: '每页项目数。' },
                    maxPageButtons: { description: '可见页码按钮的最大数量。' },
                    sticky: { description: '将分页栏固定在视口底部。' },
                    align: { description: '分页控件的水平对齐方式。' },
                    scrollToTopOnChange: { description: '切换页面时滚动到页面顶部。' },
                    scrollBehavior: { description: '启用 scrollToTopOnChange 时使用的 scrollIntoView 行为。' },
                    appendTo: { description: '分页栏的 portal 目标。' },
                    before: { description: '渲染在分页包装器内部、页码导航栏之前的内容。' },
                    after: { description: '渲染在分页包装器内部、页码导航栏之后的内容。' },
                    wrapperClassName: { description: '应用到最外层包装元素的 CSS 类。' },
                    className: { description: '应用到包含页码按钮的 nav 元素的 CSS 类。' },
                },
            },
            playground: {
                title: 'Pagination',
                props: {
                    limit: { description: '每页项目数。' },
                    maxPageButtons: { description: '可见页码按钮的最大数量。' },
                    sticky: { description: '将分页栏固定在视口底部。' },
                    align: { description: '分页控件的水平对齐方式。' },
                    scrollToTopOnChange: { description: '切换页面时滚动到页面顶部。' },
                },
            },
        },
    },
});
