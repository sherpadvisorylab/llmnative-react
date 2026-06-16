import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadImage: {
            page: {
                title: 'UploadImage',
                description: '图片上传字段，带内联缩略图预览、悬停覆盖操作以及可选的多图支持。文件描述对象会保存在 Form 记录中。',
            },
            sections: {
                singleImage: {
                    title: '单张图片',
                    description: '默认用法：一次上传一张图片，并显示固定尺寸的缩略图。上传后可通过悬停操作进行预览或删除。',
                },
                multipleImages: {
                    title: '多张图片',
                    description: '传入 multiple 以允许选择多张图片。每个文件都会渲染为单独的缩略图。达到 max 上限后上传会停止。',
                },
                editableCrop: {
                    title: '可编辑（裁剪）',
                    description: '添加 editable 后，悬停时会显示铅笔图标。点击后会打开带裁剪和缩放工具的图片编辑器，生成的变体会保存在 Form 记录中的该文件项里。',
                },
                acceptFilter: {
                    title: 'accept 过滤',
                    description: '将文件选择器限制为特定 MIME 类型。浏览器会在原生文件选择器中强制执行该过滤条件。',
                },
            },
            labels: {
                avatar: '头像',
                galleryMax: '图库（最多 6 张）',
                coverPhotoEditable: '封面图（可编辑）',
                pngOnly: '仅 PNG',
            },
            propsDocs: {
                title: 'UploadImage 属性',
                items: {
                    name: { description: '绑定到 Form 记录的字段名' },
                    label: { description: '显示在上传区域上方的标签' },
                    multiple: { description: '允许一次选择多张图片', default: 'false' },
                    editable: { description: '悬停时显示裁剪/编辑按钮；会打开图片编辑器', default: 'false' },
                    previewWidth: { description: '缩略图宽度（像素）', default: '100' },
                    previewHeight: { description: '缩略图高度（像素）', default: '100' },
                    accept: { description: '接受的 MIME 类型（例如 "image/png,image/jpeg"）', default: '"image/*"' },
                    max: { description: '允许的最大文件数量', default: '100' },
                    required: { description: '将字段标记为必填；为空时阻止表单提交', default: 'false' },
                    onChange: { description: '每次文件列表变化时调用，并传入更新后的值和表单上下文' },
                    before: { description: '渲染在图片网格之前、外层 wrapper 内部的内容' },
                    after: { description: '渲染在图片网格之后、外层 wrapper 内部的内容' },
                    className: { description: '内部容器上的 CSS 类' },
                    wrapperClassName: { description: '外层 wrapper 上的 CSS 类' },
                },
            },
            playground: {
                title: 'UploadImage Playground',
                defaultLabel: '图库',
            },
        },
    },
});
