import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadCsv: {
            page: {
                title: 'UploadCSV',
                description: '单文件 CSV 或 TSV 上传组件，支持拖放、PapaParse 集成，并通过 onDataLoaded 提供适合预览的解析结果。',
            },
            sections: {
                basicUpload: {
                    title: '基础 CSV 上传',
                    description: '将 CSV 或 TSV 文件拖入区域，或点击浏览。解析完成后，组件会切换到已加载状态，并通过 onDataLoaded 暴露行数据、表头和原始 File。',
                },
                normalizedKeys: {
                    title: '键名标准化 + 移除空字段',
                    description: 'normalizeKeys 会在字段名暴露到 fields 和行对象之前先转换表头名称。removeEmptyFields 会从每条解析后的记录中移除值为空字符串或 null 的项。',
                },
                customFieldTransform: {
                    title: '自定义字段转换',
                    description: '使用 onParseField 拦截每个解析后的 [key, value] 对。返回修改后的键值对以保留它，或返回 undefined 以从最终行对象中移除该字段。',
                },
                customDelimiter: {
                    title: '自定义分隔符',
                    description: '当文件无法被 PapaParse 可靠自动识别时可传入 delimiter，例如电子表格工具导出的分号分隔文件。',
                },
            },
            labels: {
                emptyState: '尚未加载文件。',
                rows: '行',
                fields: '字段',
                andMoreRows: '...以及另外 {count} 行',
                basicLabel: '拖动或点击以上传 CSV',
                normalizeLabel: '上传 CSV 以查看标准化后的键名',
                transformLabel: '上传 CSV - 以下划线开头的列将被丢弃',
                delimiterLabel: '上传分号分隔的 CSV',
            },
            propsDocs: {
                title: 'UploadCSV 属性',
                items: {
                    name: { description: '用于 wrapper data-name 属性的字段名' },
                    onDataLoaded: { description: '解析成功后调用，并传入解析后的行、表头字段和原始 File' },
                    onClear: { description: '当已加载文件从组件 UI 中移除时调用' },
                    label: { description: '显示在拖放区域上方的标签' },
                    icon: { description: '显示在拖放区域内的图标名称', default: '"upload"' },
                    delimiter: { description: '传给 PapaParse 的可选分隔符。省略时 PapaParse 会自动检测。' },
                    normalizeKeys: { description: '在暴露到 fields 和行对象前，使用 normalizeKey 标准化表头名称', default: 'false' },
                    removeEmptyFields: { description: '移除解析值为空字符串或 null 的行字段', default: 'false' },
                    onParseField: { description: '在解析期间转换或丢弃每个 [key, value] 对。返回 undefined 可省略该字段。' },
                    before: { description: '渲染在 uploader 之前、外层 wrapper 内部的内容' },
                    after: { description: '渲染在 uploader 之后、外层 wrapper 内部的内容' },
                    className: { description: '应用到内部 uploader 容器的 CSS 类' },
                    wrapperClassName: { description: '应用到外层 wrapper 的 CSS 类' },
                },
            },
            playground: {
                title: 'UploadCSV Playground',
                defaultLabel: '拖动或点击以上传 CSV',
            },
        },
    },
});
