import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        layoutBuilder: {
            page: {
                title: 'LayoutBuilder',
                description: '用于排列拖拽字段令牌的交互式 12 列行构建器。',
            },
            sections: {
                dragFields: {
                    title: '将字段拖入这一行',
                    description: '把字段令牌从列表拖入构建器行中，在当前 Form 记录里组合出可存储的布局。',
                },
            },
            labels: {
                dragFieldsIntoRow: '将字段拖入这一行',
                fields: '字段',
            },
            propsDocs: {
                title: 'LayoutBuilder props',
                items: {
                    name: { description: '用于存储行布局项的 Form 字段名。' },
                    defaultSpan: { description: '拖入字段后的默认列跨度。', default: '1' },
                    heightPx: { description: '构建器行高度，单位像素。', default: '100' },
                    ref: { description: '命令式 API：getValue、setValue、clear。' },
                },
            },
            playground: {
                title: 'LayoutBuilder',
            },
        },
    },
});
