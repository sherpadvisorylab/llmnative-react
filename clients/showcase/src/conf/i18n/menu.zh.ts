import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        menu: {
            page: {
                title: '菜单',
                description: '从应用菜单上下文渲染的路由感知导航菜单。',
            },
            sections: {
                componentsMenu: {
                    title: '组件菜单',
                    description: 'Menu 会读取应用中配置的导航树，并渲染带可选徽标和自定义包装器的嵌套导航项。',
                },
            },
            labels: {
                none: '无',
                single: '单个',
                multi: '多个',
                newBadge: '新',
                betaBadge: 'beta',
            },
            propsDocs: {
                items: {
                    menuKey: { description: '传给 useMenu 的菜单上下文键。' },
                    as: { description: '列表元素类型。' },
                    badges: {
                        description: '按小写项目标题建立索引的徽标配置。',
                        shortcuts: {
                            none: { label: '无', help: '菜单中不显示徽标。' },
                            single: { label: '单个', help: '在 alert 上显示一个徽标。' },
                            multi: { label: '多个', help: '为不同键显示多个徽标。' },
                        },
                    },
                    before: { description: '菜单前的内容。' },
                    after: { description: '菜单后的内容。' },
                    wrapperClassName: { description: '包装元素上的 CSS 类。' },
                    className: { description: '菜单列表上的 CSS 类。' },
                    headerClassName: { description: '标题项上的 CSS 类。' },
                    itemClassName: { description: 'li 项上的 CSS 类。' },
                    linkClassName: { description: '链接上的 CSS 类。' },
                    iconClassName: { description: '图标包装器上的 CSS 类。' },
                    textClassName: { description: '项目文本上的 CSS 类。' },
                    badgeClassName: { description: '徽标上的 CSS 类。' },
                    arrowClassName: { description: '子菜单箭头上的 CSS 类。' },
                    submenuClassName: { description: '嵌套列表上的 CSS 类。' },
                },
            },
            playground: {
                title: '菜单',
            },
        },
    },
});
