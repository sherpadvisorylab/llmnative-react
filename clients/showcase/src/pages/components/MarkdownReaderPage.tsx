import React, { useState } from 'react';
import { MarkdownReader } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseMarkdownReaderI18n } from '../../showcase/i18n';

export default function MarkdownReaderPage() {
    const t = useShowcaseMarkdownReaderI18n();
    const [lastNavigation, setLastNavigation] = useState<string | null>(null);

    const propsConfig = React.useMemo<PropDef[]>(() => ([
        { name: 'content', type: 'string', required: true, description: t.propsDocs.items.content.description },
        { name: 'metadata', type: 'PageMetadataState', description: t.propsDocs.items.metadata.description, typeDetails: t.propsDocs.items.metadata.typeDetails },
        { name: 'onInternalLinkClick', type: '(href: string, event: React.MouseEvent<HTMLAnchorElement>) => void', description: t.propsDocs.items.onInternalLinkClick.description },
        { name: 'components', type: 'Components', description: t.propsDocs.items.components.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ]), [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        props: propsConfig,
        defaultProps: {
            content: t.demo.content,
            className: '',
        },
        render: (p) => (
            <MarkdownReader
                content={p.content}
                className={p.className || undefined}
            />
        ),
    }), [propsConfig, t.demo.content]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.renderedMarkdown.title}
                description={t.sections.renderedMarkdown.description}
                preview={(
                    <div className="w-full">
                        <MarkdownReader
                            content={t.demo.content}
                            metadata={{
                                title: t.demo.metadataTitle,
                                description: t.demo.metadataDescription,
                            }}
                            onInternalLinkClick={(href) => setLastNavigation(href)}
                        />
                        {lastNavigation && (
                            <div className="alert alert-info mt-4 text-sm">
                                {t.labels.internalNavigationIntercepted} {lastNavigation}
                            </div>
                        )}
                    </div>
                )}
                code={`import { MarkdownReader } from '@llmnative/react';

<MarkdownReader
  content={markdown}
  metadata={{
    title: 'MarkdownReader',
    description: 'Render Markdown with GFM support and themed components.',
  }}
  onInternalLinkClick={(href) => navigate(href)}
/>`}
            />

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
