import {
    buildMarkdownRoutes,
    resolveMarkdownRouteHref,
    sortMarkdownRoutes,
    type MarkdownDocEntry,
    type MarkdownRoute,
    type MarkdownRouteMeta,
} from '../docs-kit/markdown';

export interface MarkdownDocMeta extends MarkdownRouteMeta {
    title: string;
    group: string;
    order: number;
    path: string;
    description: string;
}

export interface MarkdownDoc extends MarkdownRoute {
    sourcePath: string;
    meta: MarkdownDocMeta;
}

const rawDocs = import.meta.glob('../../../../docs/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>;

const DEFAULT_GROUP = 'Reference';
const GROUP_ORDER: Record<string, number> = {
    'Getting started': 10,
    Architecture: 20,
    'Core patterns': 30,
    Reference: 90,
};

function titleFromFile(sourcePath: string): string {
    const filename = sourcePath.split('/').pop()?.replace(/\.md$/, '') ?? 'Document';
    return filename
        .split(/[-_]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function parseFrontmatter(raw: string, sourcePath: string): MarkdownDocEntry {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    const meta: Partial<MarkdownDocMeta> = {};
    let content = raw;

    if (match) {
        content = raw.slice(match[0].length);
        for (const line of match[1].split(/\r?\n/)) {
            const separator = line.indexOf(':');
            if (separator === -1) continue;

            const key = line.slice(0, separator).trim() as keyof MarkdownDocMeta;
            const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');

            if (key === 'order') {
                meta.order = Number(value);
            } else if (key === 'title' || key === 'group' || key === 'path' || key === 'description') {
                meta[key] = value as never;
            }
        }
    }

    return {
        filePath: sourcePath,
        content,
        frontmatter: {
            title: meta.title ?? titleFromFile(sourcePath),
            group: meta.group ?? DEFAULT_GROUP,
            order: Number.isFinite(meta.order) ? Number(meta.order) : 999,
            path: meta.path,
            description: meta.description ?? '',
        },
    };
}

const routeOptions = {
    baseUrl: '/docs',
    rootDir: 'docs',
    indexFileName: 'index',
    stripExtension: true,
    stripNumericPrefixes: false,
    casing: 'preserve' as const,
};

export const allMarkdownDocs: MarkdownDoc[] = sortMarkdownRoutes(
    buildMarkdownRoutes(
        Object.entries(rawDocs).map(([sourcePath, raw]) => parseFrontmatter(raw, sourcePath)),
        routeOptions
    )
).map((route) => {
    const group = typeof route.meta.group === 'string' ? route.meta.group : DEFAULT_GROUP;
    return {
        ...route,
        sourcePath: route.filePath,
        meta: {
            title: typeof route.meta.title === 'string' ? route.meta.title : titleFromFile(route.filePath),
            group,
            order: typeof route.meta.order === 'number' ? route.meta.order : 999,
            path: route.path,
            description: typeof route.meta.description === 'string' ? route.meta.description : '',
        },
    };
}).sort((a, b) => {
    const group = (GROUP_ORDER[a.meta.group] ?? 999) - (GROUP_ORDER[b.meta.group] ?? 999);
    if (group !== 0) return group;
    const order = a.meta.order - b.meta.order;
    if (order !== 0) return order;
    return a.meta.title.localeCompare(b.meta.title);
});

export const markdownDocs = allMarkdownDocs
    .filter((doc) => doc.meta.path.startsWith('/docs'));

export const providerMarkdownDocs = allMarkdownDocs
    .filter((doc) => doc.meta.path === '/providers' || doc.meta.path.startsWith('/providers/'));

export function getMarkdownDocByPath(path: string): MarkdownDoc | undefined {
    return allMarkdownDocs.find((doc) => doc.meta.path === path);
}

export function resolveMarkdownDocHref(href: string, currentPath: string): string {
    return resolveMarkdownRouteHref(href, currentPath, '/docs');
}
