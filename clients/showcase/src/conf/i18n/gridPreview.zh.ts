import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridPreview: {
            page: {
                title: 'Grid 预览工作区',
                description: '这是一个供 Grid 自定义操作使用的隐藏配套页面。当前它用于预览当前记录并提供导出格式，后续也可以复用于 Form 预览流程。',
            },
            banner: {
                currentView: '当前视图',
                exportDescription: '为当前记录或整个模拟数据集选择一种导出格式。',
                previewDescription: '查看所选记录，并将此页面复用为通用预览界面。',
                allRecords: '全部记录',
                recordPrefix: '记录',
            },
            sections: {
                datasetPreview: {
                    title: '数据集预览',
                    selectedRecordDescription: '这条记录来自 Grid 自定义操作，后续可以继续用于导出或 Form 预览流程。',
                    emptyDescription: '由于没有传入特定记录，因此此页面显示的是数据集级别的预览。',
                },
                exportOptions: {
                    title: '导出选项',
                    description: '这里刻意保持为一个小型操作中心。当用户需要先选择导出格式而不是立即下载时，Grid、Form 和其他预览都可以指向这里。',
                },
            },
            emptyState: {
                singleRecordHint: '请从带有记录上下文的 Grid 操作打开此页面，以便用单条记录预填预览。导出工具仍然可以作用于整个模拟数据集。',
            },
            actions: {
                exportCsv: '导出 CSV',
                exportJson: '导出 JSON',
                saveAsPdf: '另存为 PDF',
                copyJson: '复制 JSON',
                jsonCopied: 'JSON 已复制',
                copyEmails: '复制邮箱',
                emailsCopied: '邮箱已复制',
            },
            hints: {
                futureReuse: '提示：目前此页面主要聚焦于导出和预览。后续我们可以在不再次修改 Grid 操作契约的情况下，将同一布局复用于 Form 预览、打印布局和记录级审核流程。',
            },
        },
    },
});
