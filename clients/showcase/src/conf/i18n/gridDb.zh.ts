import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        gridDb: {
            page: {
                title: 'GridDB',
                description: '基于 provider 的 Grid 变体。它订阅 DataProvider 路径并自动流式接收更新，同时支持 provider 侧过滤、排序和字段映射。',
            },
            sections: {
                basicUsage: {
                    title: '基础用法',
                    description: '最小可用的 GridDB 形式。提供一个路径，让 Grid 订阅该集合，并根据传入记录自动推断列。',
                },
                providerFilter: {
                    title: 'Provider 侧过滤',
                    description: 'where 会在记录到达组件之前就在 provider 层完成过滤，因此网格不会过度拉取数据。',
                },
                providerOrder: {
                    title: 'Provider 侧排序',
                    description: 'order 会在组件收到记录之前先在 provider 层完成排序。',
                },
                fromUrl: {
                    title: 'fromUrl - 路由驱动路径',
                    description: 'fromUrl 会根据当前路由 pathname 解析集合路径，而不是使用硬编码路径。此示例从当前页面 URL 读取数据。',
                },
                grouping: {
                    title: '分组',
                    description: 'groupBy 会在分组标题下拆分行。它适用于表格和画廊布局，也可以与 provider 侧排序组合使用。',
                },
            },
            labels: {
                teamMembers: '团队成员',
            },
            propsDocs: {
                categories: {
                    gridDb: 'GridDB',
                    shared: '共享',
                },
                items: {
                    path: { description: 'DataProvider 集合路径。默认与 fromUrl={false} 一起使用。' },
                    fromUrl: { description: '为 true 时，从当前 pathname 推导集合路径，而不是使用 path。fromUrl 总是优先生效。' },
                    recordId: { description: '用于选择、编辑状态和变更路径的身份解析器。可传入字段名或箭头函数。' },
                    where: { description: '在记录流入组件之前于 provider 侧应用的过滤条件。' },
                    order: { description: '在记录流入组件之前于 provider 侧应用的排序条件。' },
                    fieldMap: { description: '在渲染前将 provider 字段名映射为 UI 使用的字段名。' },
                },
            },
            playground: {
                groups: {
                    gridDb: 'GridDB',
                    shared: '共享',
                },
                props: {
                    path: { description: '当 fromUrl 关闭时使用的集合路径。' },
                    fromUrl: { description: '从当前 pathname 推导集合路径。在这个 playground 中会切换到另一组 seed 数据。' },
                    recordId: {
                        description: '记录身份解析器。',
                        shortcuts: {
                            nativeKey: { label: '_key', help: '使用 provider 的原生键字段。' },
                            explicitId: { label: 'id', help: '使用显式 id 字段。' },
                            functionId: { label: 'fn', help: '返回 id 字段的箭头函数。' },
                        },
                    },
                    where: {
                        description: 'provider 侧过滤，在记录流出之前执行。',
                        shortcuts: {
                            empty: { label: 'empty', help: '不应用过滤。' },
                            active: { label: 'active', help: '仅显示激活成员。' },
                            admins: { label: 'admins', help: '仅显示管理员。' },
                        },
                    },
                    order: {
                        description: 'provider 侧排序，在记录流出之前执行。',
                        shortcuts: {
                            none: { label: 'none', help: '保持 provider 默认顺序。' },
                            nameAsc: { label: 'name asc', help: '按姓名升序排序。' },
                            emailDesc: { label: 'email desc', help: '按邮箱降序排序。' },
                        },
                    },
                    fieldMap: {
                        description: '将 provider 字段名映射为 UI 字段名。',
                        shortcuts: {
                            empty: { label: 'empty', help: '不映射。' },
                            fullName: { label: 'fullName', help: '把 provider 的 "name" 暴露为 "fullName"。' },
                        },
                    },
                },
            },
        },
    },
});
