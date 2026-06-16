import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        markdownReader: {
            page: {
                title: 'MarkdownReader',
                description: '使用 @llmnative/react 风格渲染 Markdown，支持 GFM、代码复制和内部链接处理。',
            },
            sections: {
                renderedMarkdown: {
                    title: '渲染后的 Markdown',
                    description: '同一段 Markdown 字符串既可以在仓库中阅读，也可以在应用中渲染。',
                },
            },
            labels: {
                internalNavigationIntercepted: '已拦截内部导航：',
            },
            demo: {
                content: `# MarkdownReader

用 @llmnative/react 的样式渲染适合仓库维护的 Markdown。

## 功能

- GitHub Flavored Markdown
- 标题锚点
- 内部链接拦截
- 可复制的代码块

| 功能 | 状态 |
| --- | --- |
| 表格 | 已支持 |
| 任务列表 | 已支持 |

- [x] 渲染文档
- [ ] 连接 wiki 风格页面

> Markdown 对人类和 AI 都保持可读，而应用会把它渲染成带主题的 UI。

\`\`\`tsx
<MarkdownReader content={markdown} />
\`\`\`

继续前往 [Quick start](/docs/quick-start)。`,
                metadataTitle: 'MarkdownReader',
                metadataDescription: '使用 GFM 支持和主题化组件渲染 Markdown。',
            },
            propsDocs: {
                title: 'MarkdownReader props',
                items: {
                    content: { description: '要渲染的 Markdown 字符串。' },
                    metadata: { description: '通过 Head 组件注入的 SEO 元数据。', typeDetails: `{
  title?: string;
  description?: string;
}` },
                    onInternalLinkClick: { description: '拦截内部链接（相对路径）的点击。可用于通过 React Router 导航。' },
                    components: { description: '自定义 react-markdown 组件覆盖项，会合并到内置主题渲染器之上，例如 h1-h4、p、ul、ol、table、a、pre 和 code。' },
                    className: { description: '应用在 prose 包装层上的附加 CSS 类。' },
                    wrapperClassName: { description: '应用在最外层 div 上的附加 CSS 类，会与 className 一起生效。' },
                },
            },
            playground: {
                title: 'Markdown Reader',
            },
        },
    },
});
