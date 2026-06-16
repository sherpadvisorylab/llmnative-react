import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        search: {
            page: {
                title: '搜索',
                description: '页头搜索触发块。当前实现会渲染一个切换按钮和一个隐藏输入框。',
            },
            sections: {
                searchTrigger: {
                    title: '搜索触发器',
                    description: '当搜索字段只需要按需展开时，可以把 Search 作为页头中的紧凑入口。',
                },
            },
            propsDocs: {
                items: {
                    onQueryChange: { description: '当隐藏搜索输入框变化时触发。' },
                },
            },
            playground: {
                title: '搜索',
            },
        },
    },
});
