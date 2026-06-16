import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        modal: {
            page: {
                title: 'Modal',
                description: '居中的对话框和边缘面板。支持 fullscreen 切换、异步 save/delete 操作以及 portal 渲染。',
            },
            sections: {
                positions: {
                    title: '位置',
                    description: '点击按钮以在对应位置打开 modal。',
                },
            },
            demo: {
                dialogTitleCenter: 'Dialog - center',
                panelTitle: 'Panel - {position}',
                dialogBody: '居中对话框。支持 `sm`、`md`、`lg`、`xl`、`2xl` 和 `fullscreen` 尺寸。',
                panelBody: '带有 **{position}** 位置的侧边面板。通过 React portal 渲染到 `document.body`。',
                openButton: '打开 modal',
                defaultTitle: '对话框标题',
                defaultBody: 'Modal 内容显示在这里。',
            },
            propsDocs: {
                items: {
                    children: { description: 'Modal body 内容' },
                    title: { description: '显示在 header 中的 modal 标题' },
                    header: { description: '自定义 header 内容（覆盖 title）' },
                    footer: { description: '自定义 footer 内容，或传 false 完全隐藏 footer', typeDetails: 'ReactNode | false' },
                    size: { description: '对话框宽度' },
                    position: { description: 'Modal 出现的位置。非居中位置会渲染为边缘面板。' },
                    onClose: { description: '当用户关闭 modal 时调用' },
                    onSave: { description: '异步 save handler。返回 true 关闭，false 保持打开。' },
                    onDelete: { description: '异步 delete handler。在 footer 中显示 delete 按钮。' },
                    closeOnBackdrop: { description: '点击 backdrop 时关闭 modal' },
                    allowFullscreen: { description: '在 header 中显示 fullscreen 切换按钮' },
                    showCancel: { description: '当提供 onClose 时在 footer 中显示 Cancel 按钮' },
                    zIndex: { description: 'CSS z-index 覆盖，适合多层 modal 堆叠' },
                    headerClassName: { description: 'header 容器上的 CSS 类' },
                    titleClassName: { description: 'title 元素上的 CSS 类' },
                    subtitleClassName: { description: 'subtitle 元素上的 CSS 类（当 title 和 header 同时存在时渲染）' },
                    bodyClassName: { description: 'body 容器上的 CSS 类' },
                    footerClassName: { description: 'footer 容器上的 CSS 类' },
                    wrapperClassName: { description: '最外层 dialog wrapper 上的 CSS 类' },
                    className: { description: '内部 flex 容器上的 CSS 类' },
                    before: { description: '渲染在内部内容容器之前、位于 dialog wrapper 内的内容' },
                    after: { description: '渲染在内部内容容器之后、位于 dialog wrapper 内的内容' },
                    motion: { description: '命名 motion preset 或用于对话框进出场动画的 inline MotionProps override', typeDetails: 'string | MotionEffect | false' },
                },
            },
        },
    },
});
