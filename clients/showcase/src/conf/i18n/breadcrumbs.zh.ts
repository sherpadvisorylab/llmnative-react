import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        breadcrumbs: {
            page: {
                title: '面包屑',
                description: '面包屑路径既可以从 URL 字符串解析，也可以由显式项目列表构建。带 href 的项目渲染为链接；最后一个没有 href 的项目表示当前页面。',
            },
            sections: {
                urlStringTrail: {
                    title: 'URL 字符串路径',
                    description: '传入 URL 字符串后，各段会变成链接，最后一段会被视为当前页面。',
                },
                explicitItemList: {
                    title: '显式项目列表',
                    description: '当标签不同于 URL slug，或者你需要完全控制链接时，请使用 BreadcrumbItem[]。',
                },
                currentRoute: {
                    title: '当前路由（无 trail）',
                    description: '当省略 trail 时，组件会自动读取当前路由。',
                },
                chevronSeparator: {
                    title: 'Chevron 分隔符',
                },
                jsonLdStructuredData: {
                    title: 'JSON-LD 结构化数据',
                    description: '启用 jsonLd 后会注入 schema.org BreadcrumbList 脚本。baseUrl 只用于 schema，不会影响可见链接。',
                },
                standaloneSchema: {
                    title: 'buildBreadcrumbSchema - 独立用法',
                    description: '使用导出的工具函数为 SSR、站点地图或自定义 head 注入单独生成 schema.org 数据。stringify: true 会返回可直接用于 dangerouslySetInnerHTML 的字符串。',
                },
            },
            labels: {
                home: '首页',
                products: '产品',
                shoes: '鞋类',
                sneakers: '运动鞋',
                runningShoes: '跑鞋',
                docs: '文档',
                components: '组件',
                breadcrumbs: '面包屑',
                jsonLdOutput: 'JSON-LD 输出（schema.org BreadcrumbList）',
                generatedScriptTag: '生成的 <script type="application/ld+json">',
                currentPageOmitted: '无 href -> 当前页面',
            },
            propsDocs: {
                items: {
                    trail: { description: '面包屑路径。传入 URL 字符串可自动解析各段，传入 BreadcrumbItem[] 可获得显式控制。省略时会回退到当前路由。' },
                    rootItem: { description: '渲染在 trail 之前的可选锚点项目。传字符串表示纯标签，传 BreadcrumbItem 可附加链接。' },
                    separator: { description: '项目之间显示的分隔符。使用 "chevron" 可显示 SVG 箭头。' },
                    jsonLd: { description: '为 true 时，组件会渲染 BreadcrumbList <script type="application/ld+json"> 结构化 SEO 数据。' },
                    baseUrl: { description: '只在 JSON-LD 输出中追加到 href 前面的基础 URL。不会影响可见链接，默认使用 window.location.origin。' },
                    className: { description: 'nav 包装元素上的 CSS 类。' },
                },
                schemaTitle: 'buildBreadcrumbSchema',
                schemaItems: {
                    items: { description: '面包屑项目列表。带 href 的项目会在 schema 中获得绝对 URL；当前页面这类无 href 项目不会。' },
                    rootItem: { description: '添加在 items 前的可选锚点项目，结构与 BreadcrumbItem 相同。' },
                    baseUrl: { description: '追加到所有 href 前以生成 schema.org 所需绝对 URL 的基础地址。' },
                    stringify: { description: '为 true 时返回 JSON 字符串而不是普通对象，可直接用于 dangerouslySetInnerHTML，无需再调用 JSON.stringify。' },
                },
            },
            playground: {
                title: '面包屑',
                shortcuts: {
                    urlString: 'URL 字符串',
                    explicitItems: '显式项目',
                    deepPath: '深层路径',
                    clear: '清空',
                    stringValue: '字符串',
                    withLink: '带链接',
                },
            },
        },
    },
});
