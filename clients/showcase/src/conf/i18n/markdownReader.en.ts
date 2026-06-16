import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        markdownReader: {
            page: {
                title: 'MarkdownReader',
                description: 'Render Markdown with @llmnative/react styling, GFM support, code copy and internal link handling.',
            },
            sections: {
                renderedMarkdown: {
                    title: 'Rendered markdown',
                    description: 'The same Markdown string can be read in the repo and rendered in the app.',
                },
            },
            labels: {
                internalNavigationIntercepted: 'Internal navigation intercepted:',
            },
            demo: {
                content: `# MarkdownReader

Render repository-friendly Markdown with @llmnative/react styling.

## Features

- GitHub Flavored Markdown
- Heading anchors
- Internal link interception
- Copyable code blocks

| Feature | Status |
| --- | --- |
| Tables | Supported |
| Task lists | Supported |

- [x] Render docs
- [ ] Wire wiki-style pages

> Markdown stays readable for humans and AI, while the app renders it as themed UI.

\`\`\`tsx
<MarkdownReader content={markdown} />
\`\`\`

Continue to [Quick start](/docs/quick-start).`,
                metadataTitle: 'MarkdownReader',
                metadataDescription: 'Render Markdown with GFM support and themed components.',
            },
            propsDocs: {
                title: 'MarkdownReader props',
                items: {
                    content: { description: 'Markdown string to render.' },
                    metadata: { description: 'SEO metadata injected via the Head component.', typeDetails: `{
  title?: string;
  description?: string;
}` },
                    onInternalLinkClick: { description: 'Intercepts clicks on internal links (relative paths). Use it to navigate with React Router.' },
                    components: { description: 'Custom react-markdown component overrides merged on top of the built-in themed renderers such as h1-h4, p, ul, ol, table, a, pre and code.' },
                    className: { description: 'Additional CSS classes on the prose wrapper.' },
                    wrapperClassName: { description: 'Additional CSS classes on the outermost div, applied alongside className.' },
                },
            },
            playground: {
                title: 'Markdown Reader',
            },
        },
    },
});
