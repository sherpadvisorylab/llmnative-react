import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridArray: {
            page: {
                title: 'GridArray',
                description: 'Grid 的内存版变体，直接渲染由调用方持有的记录数组。适合计算结果、本地状态，以及已经存在于前端的小型数据集。',
            },
            sections: {
                basicUsage: {
                    title: '基础用法',
                    description: '最小可用的 GridArray 形式。传入记录数组，让 Grid 根据数据结构自动推断列。这里显式写出 sortable 和 pagination 以便示例自包含。',
                },
                onLoadTransform: {
                    title: 'onLoad 转换',
                    description: '使用 onLoad 在显示前对记录做规范化或增强。该转换会在每次渲染周期运行，也可以异步完成。',
                },
                grouping: {
                    title: '分组',
                    description: 'groupBy 会在可折叠的分组标题下拆分行。它同时适用于表格和画廊布局，并支持单字段或多级分组。',
                },
                selection: {
                    title: '选择',
                    description: 'selection 可启用单选按钮或复选框。只需要界面状态时可用简写，需要回调和默认键时可用对象形式。',
                },
            },
            labels: {
                teamMembers: '团队成员',
                singleSelection: '单选',
                multipleSelection: '多选',
            },
            propsDocs: {
                categories: {
                    gridArray: 'GridArray',
                    shared: '共享',
                },
                items: {
                    records: {
                        description: '由调用方持有的记录数组。GridArray 直接从这个快照渲染，不会订阅任何 provider。playground 中的记录来自下方的 Mock 数据库。',
                    },
                    recordId: {
                        description: '用于选择、编辑状态和变更路径的身份解析器。可传入字段名或箭头函数。',
                    },
                    onLoad: {
                        description: '在显示前转换记录。调用方传入数据后，可同步或异步执行。',
                    },
                },
            },
            playground: {
                groups: {
                    gridArray: 'GridArray',
                    shared: '共享',
                },
                props: {
                    records: {
                        description: '由调用方持有的记录数组。在这个 playground 中，记录来自下方的 Mock 数据库。修改它即可实时看到网格更新。',
                    },
                    recordId: {
                        description: '记录身份解析器。传入类似 "_key" 的字段名，或传入箭头函数。',
                        shortcuts: {
                            nativeKey: { label: '_key', help: '使用 provider 的原生键字段。' },
                            explicitId: { label: 'id', help: '使用显式 id 字段。' },
                            functionId: { label: 'fn', help: '返回 id 字段的箭头函数。' },
                        },
                    },
                    onLoad: {
                        description: '在显示前转换记录。在 playground 中由内部处理。',
                    },
                },
            },
        },
    },
});
