import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        icon: {
            page: { title: 'Icon', description: '基于 provider 的图标渲染器。当前图标库在 App 上全局配置，并且可以在运行时切换。内置 provider：lucide（默认）、phosphor。' },
            sections: {
                basicUsage: { description: '通过名称渲染任意图标。当前 provider 会将名称解析为对应组件。' },
                catalog: { title: '图标目录', description: '所有内置 provider 都支持的常用图标名称。当前 provider：{providerId}。' },
                sizes: { description: 'size prop 用于设置像素宽高。默认值为 16。' },
                colors: { title: '通过 className 设置颜色', description: '图标会继承 CSS 文本颜色。可使用任意 Tailwind `text-*` 工具类。' },
                providers: { title: '内置 provider：lucide 与 phosphor', description: 'lucide 是默认 provider。phosphor 也内置支持。两者解析相同的图标名称。' },
                phosphor: { title: 'Phosphor 粗细变体', description: '直接把 weight 传给 Icon 即可，无需重新实例化 provider。支持的值：thin、light、regular（默认）、bold、fill、duotone。' },
                appConfig: { title: 'App 级配置', description: '图标 provider 在 App 中统一设置，并通过 context 继承。也可以使用 useIconController 在运行时切换。' },
                aliases: { title: '别名', description: '将你自己的语义名称映射到 provider 特定名称。只需在 App 层配置一次，即可与任意 provider 一起使用。' },
                a11y: { title: '无障碍', description: '没有 label 的图标会被标记为 aria-hidden（装饰性）。当图标在没有相邻文本的情况下表达含义时，请提供 label。' },
                customProvider: { title: '自定义 provider', description: '实现 IconProviderAdapter 以接入任意图标库。' },
            },
        },
    },
});
