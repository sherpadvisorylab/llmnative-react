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
