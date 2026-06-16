import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageEditor: {
            page: {
                title: 'ImageEditor',
                description: '基于 tui-image-editor 的全功能图片编辑组件。支持裁剪、翻转、旋转、自由绘制、形状、文本和缩放。既可内联使用，也可放在 modal 中。',
            },
            sections: {
                inlineEditor: {
                    title: '内联编辑器',
                    description: '将编辑器直接放在页面中。工具栏显示在顶部，画布会填满可用宽度。',
                },
                modalEditor: {
                    title: 'Modal 编辑器',
                    description: '传入 mode="modal" 可在全屏 overlay 中打开编辑器。标题和工具栏会合并在同一条简洁的 header 中，用户关闭时会触发 onClose。',
                },
            },
            labels: {
                sampleTitle: '示例',
                sampleSubtitle: '示例 - 编辑这张图片',
                lastSavedOutput: '最近保存的输出：',
                savedResultAlt: '保存结果',
                openEditorInModal: '在 modal 中打开编辑器',
                editPhoto: '编辑照片',
                savedResult: '保存结果：',
                savedAlt: '已保存',
            },
            propsDocs: {
                title: 'ImageEditor props',
                items: {
                    src: { description: '要编辑图片的 URL 或 data URL。' },
                    title: { description: '显示在 modal header 中的标题，仅在 mode="modal" 时使用。', default: '"Image Editor"' },
                    width: { description: '画布的最大 CSS 宽度，单位像素。', default: '700' },
                    height: { description: '画布的最大 CSS 高度，单位像素。', default: '500' },
                    mode: { description: '在 modal overlay 中渲染（"modal"）或直接内联到页面中（"inline"）。', default: '"inline"' },
                    onImageLoad: { description: '当图片完成加载到编辑器中时触发的回调。' },
                    onClose: { description: '当用户关闭 modal 时触发的回调，仅在 modal 模式可用。' },
                    onSave: { description: '当用户点击 Save 时触发的回调。接收编辑后的图片 data URL。' },
                },
            },
        },
    },
});
