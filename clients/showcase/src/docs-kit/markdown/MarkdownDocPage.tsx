import React from 'react';
import type { MarkdownRoute } from './markdown.types';
import MarkdownContent from './MarkdownContent';

type MarkdownDocPageProps = {
    route: MarkdownRoute;
    renderMarkdown: (content: string, route: MarkdownRoute) => React.ReactNode;
    layout?: (args: {
        title?: string;
        description?: string;
        children: React.ReactNode;
    }) => React.ReactNode;
};

export default function MarkdownDocPage({
    route,
    renderMarkdown,
    layout,
}: MarkdownDocPageProps) {
    const title = typeof route.meta.title === 'string' ? route.meta.title : undefined;
    const description = typeof route.meta.description === 'string' ? route.meta.description : undefined;
    const body = (
        <MarkdownContent title={title} description={description}>
            {renderMarkdown(route.content, route)}
        </MarkdownContent>
    );

    if (layout) {
        return <>{layout({ title, description, children: body })}</>;
    }

    return body;
}
