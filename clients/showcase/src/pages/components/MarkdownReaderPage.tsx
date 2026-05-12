import React, { useState } from 'react';
import { MarkdownReader } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const SAMPLE_MARKDOWN = `# MarkdownReader

Render repository-friendly Markdown with react-firestrap styling.

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

Continue to [Quick start](/docs/quick-start).`;

const PROPS_CONFIG: PropDef[] = [
    { name: 'content', type: 'string', required: true, description: 'Markdown string to render' },
    { name: 'head', type: '{ title?: string; description?: string }', description: 'SEO metadata injected via Head component' },
    { name: 'onNavigateInternal', type: '(href: string) => void', description: 'Intercepts clicks on internal links (relative paths). Use to navigate with React Router.' },
    { name: 'className', type: 'string', description: 'Additional CSS classes on the prose wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: {
        content: SAMPLE_MARKDOWN,
        className: '',
    },
    render: (p) => (
        <MarkdownReader
            content={p.content}
            className={p.className || undefined}
        />
    ),
};

export default function MarkdownReaderPage() {
    usePlayground(PLAYGROUND, 'Markdown Reader');
    const [lastNavigation, setLastNavigation] = useState<string | null>(null);

    return (
        <PageLayout
            title="MarkdownReader"
            description="Render Markdown with react-firestrap styling, GFM support, code copy and internal link handling."
        >
            <Section
                title="Rendered markdown"
                description="The same Markdown string can be read in the repo and rendered in the app."
                preview={
                    <div className="w-full">
                        <MarkdownReader
                            content={SAMPLE_MARKDOWN}
                            head={{
                                title: 'MarkdownReader',
                                description: 'Render Markdown with GFM support and themed components.',
                            }}
                            onNavigateInternal={(href) => setLastNavigation(href)}
                        />
                        {lastNavigation && (
                            <div className="alert alert-info mt-4 text-sm">
                                Internal navigation intercepted: {lastNavigation}
                            </div>
                        )}
                    </div>
                }
                code={`import { MarkdownReader } from 'react-firestrap';

<MarkdownReader
  content={markdown}
  head={{
    title: 'MarkdownReader',
    description: 'Render Markdown with GFM support and themed components.',
  }}
  onNavigateInternal={(href) => navigate(href)}
/>`}
            />

            <PropsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
