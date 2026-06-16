import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        upload: {
            page: {
                title: 'Upload',
                description: '三个针对图片、文档和 CSV 数据的专用上传字段。每种变体都独立管理本地预览、文件绑定以及可选的云存储。',
            },
            sections: {
                variants: {
                    description: '选择与文件类型匹配的变体。三者都扩展了 FormFieldProps，并通过 name 属性把结果绑定到外层 Form 记录。',
                },
                cloudStorage: {
                    title: '云存储',
                    description: '在 App 中注册 StorageProvider，并在 UploadImage 或 UploadDocument 上传入 storagePath，即可把文件流式传到 Firebase Storage 或 Supabase Storage，而不是保留为本地 base64。',
                },
            },
            variants: {
                image: {
                    title: 'UploadImage',
                    description: '内联缩略图网格，悬停时显示预览、裁剪和删除操作。支持单张或多张图片。',
                },
                document: {
                    title: 'UploadDocument',
                    description: '文件列表，显示名称、大小和进度条。可通过 accept 过滤器接受任意文件类型。',
                },
                csv: {
                    title: 'UploadCSV',
                    description: '支持拖放的 CSV 解析器。将类型化行和字段名传给 onDataLoaded。无需 Form 也可独立使用。',
                },
            },
            labels: {
                storageNotice: '该 showcase 以离线方式运行，因此 storagePath 演示需要已配置的 StorageProvider。',
            },
        },
    },
});
