import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MarkdownReader } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import type { MarkdownDoc } from '../../docs/markdownDocs';
import { resolveMarkdownDocHref } from '../../docs/markdownDocs';

interface MarkdownDocPageProps {
    doc: MarkdownDoc;
}

export default function MarkdownDocPage({ doc }: MarkdownDocPageProps) {
    const navigate = useNavigate();

    return (
        <PageLayout title={doc.meta.title} description={doc.meta.description}>
            <MarkdownReader
                content={doc.content}
                onNavigateInternal={(href, event) => {
                    const nextPath = resolveMarkdownDocHref(href, doc.meta.path);
                    if (nextPath.startsWith('/docs')) {
                        event.preventDefault();
                        navigate(nextPath);
                    }
                }}
            />
        </PageLayout>
    );
}
