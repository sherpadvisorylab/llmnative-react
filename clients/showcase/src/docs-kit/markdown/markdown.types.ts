export type MarkdownDocEntry = {
    filePath: string;
    content: string;
    frontmatter?: Record<string, unknown>;
};

export type MarkdownRouteMeta = {
    title?: string;
    description?: string;
    group?: string;
    order?: number;
    hidden?: boolean;
    path?: string;
    [key: string]: unknown;
};

export type MarkdownRoute = {
    path: string;
    slug: string;
    filePath: string;
    segments: string[];
    content: string;
    meta: MarkdownRouteMeta;
};

export type MarkdownRoutingOptions = {
    baseUrl: string;
    rootDir?: string;
    indexFileName?: string;
    stripExtension?: boolean;
    stripNumericPrefixes?: boolean;
    casing?: 'preserve' | 'kebab';
};

export type MarkdownRouteMatch = {
    route: MarkdownRoute | null;
    isExact: boolean;
};
