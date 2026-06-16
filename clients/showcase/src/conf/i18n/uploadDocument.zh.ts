import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        uploadDocument: {
            page: {
                title: 'UploadDocument',
                description: '文档上传字段，支持拖放、内联进度、可删除行以及可选的文件名编辑。Form 记录中保存的是文件描述对象数组。',
            },
            sections: {
                basicUpload: {
                    title: '基础文档上传',
                    description: '单文件拖放上传。该字段会在本地读取所选文件，在转换过程中显示进度，然后把上传后的条目存入 Form 记录。',
                },
                multipleFiles: {
                    title: '多个文件',
                    description: '启用 multiple 后，可在同一字段中保存多个文件。每个上传文件都会成为表格中的一行，并且在达到 max 之前，内联上传操作会一直可用。',
                },
                editableFileNames: {
                    title: '可编辑文件名',
                    description: '设置 editable 让每一行都可点击。点击已完成的行会打开内置文件名编辑弹窗，并把新的 fileName 保存回已存储的文件条目。',
                },
                acceptFilter: {
                    title: 'accept 过滤',
                    description: '将原生文件选择器限制为特定扩展名。同样的 accept 字符串也会在空的拖放区域中显示，作为允许格式的视觉提示。',
                },
                requiredField: {
                    title: '必填字段',
                    description: '添加 required 后，当字段为空时会显示表单校验。校验消息会通过标准表单字段错误槽位渲染在上传区域下方。',
                },
            },
            labels: {
                report: '报告',
                attachmentsMax: '附件（最多 5 个）',
                deliverables: '交付物',
                csvExcelOnly: '仅 CSV / Excel',
                contractRequired: '合同（必填）',
            },
            propsDocs: {
                title: 'UploadDocument 属性',
                items: {
                    name: { description: '绑定到 Form 记录的字段名' },
                    label: { description: '显示在拖放区域或文件表格上方的标签' },
                    multiple: { description: '允许选择并保存多个文件', default: 'false' },
                    editable: { description: '点击表格行时打开文件名编辑弹窗', default: 'false' },
                    accept: { description: '原生文件输入的 accept 过滤条件，会显示在选择器和拖放提示中', default: '".pdf,.doc,.docx,.txt,.iso"' },
                    max: { description: '字段中可保留的最大文件数', default: '100' },
                    required: { description: '将隐藏的文件输入标记为必填，并在为空时显示校验反馈', default: 'false' },
                    onChange: { description: '当 Form 记录中存储的文件数组发生变化时调用' },
                    before: { description: '渲染在上传字段之前、外层 wrapper 内部的内容' },
                    after: { description: '渲染在上传字段之后、外层 wrapper 内部的内容' },
                    className: { description: '应用到内部字段容器的 CSS 类' },
                    wrapperClassName: { description: '应用到外层 Wrapper 元素的 CSS 类' },
                },
            },
            playground: {
                title: 'UploadDocument Playground',
                defaultLabel: '附件',
            },
        },
    },
});
