import React from 'react';
import { MarkdownReader } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

const markdown = `# MarkdownReader

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

export default function MarkdownReaderPage() {
    const [lastNavigation, setLastNavigation] = React.useState<string | null>(null);

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
                            content={markdown}
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
  onNavigateInternal={(href) => navigate(href)}
/>`}
            />
        </PageLayout>
    );
}
