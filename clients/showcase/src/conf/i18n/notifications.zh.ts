import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        notifications: {
            page: {
                title: '通知',
                description: '基于 Dropdown 和 DropdownItem 构建的通知下拉菜单。',
            },
            sections: {
                notificationMenu: {
                    title: '通知菜单',
                    description: 'Notifications 通过带徽标的铃铛触发器展示最近更新，并显示标题、时间和图标信息。',
                },
            },
            detail: {
                title: '详情与操作',
                description: '标题下的一行详情、无需打开条目即可在菜单中操作的按钮（运行时显示加载状态），以及在新标签页中打开的外部链接。onItemClick 会告知打开了哪个条目，以便将其标为已读。',
                sourceTitle: '缺少 Action 的来源',
                sourceDetail: 'crm · sources/notes/pricing.md',
                openAction: '打开 Action',
                blockedTitle: '问题已阻塞',
                blockedDetail: 'crm #12 · 已转交给人',
                now: '刚刚',
            },
            labels: {
                newDeploymentCompleted: '新部署已完成',
                storageUsageReached80: '存储使用量已达到 80%',
                twoMinutesAgo: '2 分钟前',
                oneHourAgo: '1 小时前',
            },
            propsDocs: {
                items: {
                    items: { description: '在下拉菜单中渲染的通知记录。' },
                    badge: { description: '显示在铃铛切换按钮上的徽标。' },
                    description: { description: '每个条目标题下的一行：是什么、在哪里。' },
                    actions: { description: '条目下的按钮：不打开条目即可操作，Promise 运行期间显示加载。' },
                    external: { description: '将 url 作为地址在新标签页中打开，而不是作为路由。' },
                    onItemClick: { description: '打开条目时调用（例如标为已读）；菜单随之关闭。' },
                    wrapperClassName: { description: '包装元素上的 CSS 类。' },
                },
            },
            playground: {
                title: '通知',
                defaultBadge: '2',
            },
        },
    },
});
