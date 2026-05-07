export interface MarkdownDocMeta {
    title: string;
    group: string;
    order: number;
    path: string;
    description: string;
}

export interface MarkdownDoc {
    sourcePath: string;
    content: string;
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

function routeFromFile(sourcePath: string): string {
    const relative = sourcePath.split('/docs/')[1]?.replace(/\.md$/, '') ?? '';
    if (relative === 'overview') return '/docs';
    return `/docs/${relative}`;
}

function parseFrontmatter(raw: string, sourcePath: string): MarkdownDoc {
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
                meta[key] = value;
            }
        }
    }

    return {
        sourcePath,
        content,
        meta: {
            title: meta.title ?? titleFromFile(sourcePath),
            group: meta.group ?? DEFAULT_GROUP,
            order: Number.isFinite(meta.order) ? Number(meta.order) : 999,
            path: meta.path ?? (match ? routeFromFile(sourcePath) : ''),
            description: meta.description ?? '',
        },
    };
}

export const markdownDocs = Object.entries(rawDocs)
    .map(([sourcePath, raw]) => parseFrontmatter(raw, sourcePath))
    .filter((doc) => doc.meta.path.startsWith('/docs'))
    .sort((a, b) => {
        const group = (GROUP_ORDER[a.meta.group] ?? 999) - (GROUP_ORDER[b.meta.group] ?? 999);
        if (group !== 0) return group;
        const order = a.meta.order - b.meta.order;
        if (order !== 0) return order;
        return a.meta.title.localeCompare(b.meta.title);
    });

export function getMarkdownDocByPath(path: string): MarkdownDoc | undefined {
    return markdownDocs.find((doc) => doc.meta.path === path);
}

export function resolveMarkdownDocHref(href: string, currentPath: string): string {
    if (href.startsWith('/docs')) return href.replace(/\.md(?=#|$)/, '');
    if (href.startsWith('#')) return href;
    if (/^[a-z]+:/i.test(href)) return href;

    const [withoutHash, hash = ''] = href.split('#');
    const clean = withoutHash.replace(/^\.\//, '').replace(/\.md$/, '');
    const currentSegments = currentPath.split('/').filter(Boolean);
    const baseSegments = currentSegments.length > 1 ? currentSegments.slice(1, -1) : [];
    const segments = [...baseSegments];

    for (const part of clean.split('/')) {
        if (!part || part === '.') continue;
        if (part === '..') segments.pop();
        else segments.push(part);
    }

    const resolved = segments.join('/');
    const route = resolved === 'overview' || resolved === '' ? '/docs' : `/docs/${resolved}`;
    return hash ? `${route}#${hash}` : route;
}
