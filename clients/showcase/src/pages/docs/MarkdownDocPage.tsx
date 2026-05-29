import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarkdownReader } from '@llmnative/react';
import { MarkdownDocPage as DocsKitMarkdownDocPage } from '../../docs-kit/markdown';
import { PageLayout } from '../../docs-kit/page';
import type { MarkdownDoc } from '../../docs/markdownDocs';
import { resolveMarkdownDocHref } from '../../docs/markdownDocs';

interface MarkdownDocPageProps {
    doc: MarkdownDoc;
}

export default function MarkdownDocPage({ doc }: MarkdownDocPageProps) {
    const navigate = useNavigate();
    const [content, setContent] = useState(doc.content || '');

    useEffect(() => {
        let cancelled = false;

        if (content || !doc.loadContent) return;

        void doc.loadContent().then((nextContent) => {
            if (!cancelled) {
                setContent(nextContent);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [content, doc]);

    return (
        <DocsKitMarkdownDocPage
            route={{ ...doc, content }}
            layout={({ children }) => (
                <PageLayout title={doc.meta.title} description={doc.meta.description} showHeader={false}>
                    {children}
                </PageLayout>
            )}
            renderMarkdown={(content, route) => (
                <MarkdownReader
                    content={content}
                    head={{
                        title: typeof route.meta.title === 'string' ? route.meta.title : doc.meta.title,
                        description: typeof route.meta.description === 'string' ? route.meta.description : doc.meta.description,
                    }}
                    onNavigateInternal={(href, event) => {
                        const nextPath = resolveMarkdownDocHref(href, doc.meta.path);
                        if (nextPath.startsWith('/')) {
                            event.preventDefault();
                            navigate(nextPath);
                        }
                    }}
                />
            )}
        />
    );
}
