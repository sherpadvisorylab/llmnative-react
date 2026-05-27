import React from 'react';
import MarkdownDocPage from './MarkdownDocPage';
import { matchMarkdownRoute } from './markdownRouter';
import type { MarkdownRoute } from './markdown.types';

type MarkdownFileRouterProps = {
    routes: MarkdownRoute[];
    pathname: string;
    renderMarkdown: (content: string, route: MarkdownRoute) => React.ReactNode;
    notFound?: React.ReactNode;
    layout?: (args: {
        title?: string;
        description?: string;
        children: React.ReactNode;
    }) => React.ReactNode;
};

export default function MarkdownFileRouter({
    routes,
    pathname,
    renderMarkdown,
    notFound = null,
    layout,
}: MarkdownFileRouterProps) {
    const match = matchMarkdownRoute(routes, pathname);

    if (!match.route) return <>{notFound}</>;

    return (
        <MarkdownDocPage
            route={match.route}
            renderMarkdown={renderMarkdown}
            layout={layout}
        />
    );
}
