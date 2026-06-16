import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        localeSwitcher: {
            page: {
                title: 'LocaleSwitcher',
                description: '用于在运行时切换当前语言的下拉组件。当只配置了一种语言时不会渲染任何内容，并会把选择保存到 llmnative_locale cookie 中。',
            },
            sections: {
                liveDemo: {
                    title: '实时演示',
                    description: '下面的切换器控制整个 showcase 的语言。配置好的翻译会立即可用，因此切换语言后，侧边栏、按钮和组件预览都会同步更新。',
                },
                nullWhenSingleLocale: {
                    title: '仅配置单一语言时返回 null',
                    description: '当 translations 为空或只包含一种语言时，LocaleSwitcher 会自动返回 null。使用方不需要额外写条件渲染。',
                },
                customLabels: {
                    title: '自定义语言标签',
                    description: 'labels 属性可以覆盖或扩展内置语言名称映射。适合使用本地名称、缩写或自定义徽标文本。',
                },
                cookiePersistence: {
                    title: 'Cookie 持久化',
                    description: '所选语言会保存到 first-party cookie 中，TTL 为 1 年。下次加载时，该 cookie 的优先级高于 App.i18n 中声明的 locale。',
                },
                appConfiguration: {
                    title: '在 App 中配置翻译',
                    description: '把 translations 传给 App.i18n 以提供更多可选语言。translations 对象中的每个 locale key 都会成为一个可选项，缺失的 key 会回退到英文。',
                },
            },
            labels: {
                language: 'Language',
                italian: 'Italian',
                localeBadgeEn: 'EN',
                localeBadgeIt: 'IT',
                localeBadgeDe: 'DE',
                localeBadgeRu: 'RU',
                localeBadgeZh: 'ZH',
                localeBadgeAr: 'AR',
            },
            propsDocs: {
                items: {
                    icon: { description: '传给 Icon 组件的图标名称。任何被当前图标 provider 支持的图标都可以使用。' },
                    label: { description: '显示在下拉框前面的可选文本标签。' },
                    labels: { description: '用于覆盖或扩展 locale code 的显示名称。会与内置默认值合并。' },
                    className: { description: '应用到外层包装元素的额外 CSS 类。' },
                },
            },
            playground: {
                title: 'LocaleSwitcher',
                props: {
                    icon: { description: '传给 Icon 组件的图标名称。任何被当前图标 provider 支持的图标都可以使用。' },
                    label: { description: '显示在下拉框前面的可选文本标签。' },
                    className: { description: '应用到外层包装元素的额外 CSS 类。' },
                },
            },
        },
    },
});
