import type { MarkdownDocEntry, MarkdownRoute, MarkdownRouteMatch, MarkdownRouteMeta, MarkdownRoutingOptions } from './markdown.types';

function trimSlashes(value: string): string {
    return value.replace(/^\/+|\/+$/g, '');
}

function normalizeSegment(segment: string, options: MarkdownRoutingOptions): string {
    let next = segment.trim();
    if (options.stripNumericPrefixes) {
        next = next.replace(/^\d+[-_.]/, '');
    }
    if (options.casing === 'kebab') {
        next = next
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/[_\s]+/g, '-')
            .toLowerCase();
    }
    return next;
}

export function normalizeMarkdownFilePath(
    filePath: string,
    options?: Pick<MarkdownRoutingOptions, 'rootDir'>
): string {
    const unixPath = filePath.replace(/\\/g, '/');
    const rootDir = options?.rootDir ? trimSlashes(options.rootDir) : '';

    if (!rootDir) return unixPath;
    const marker = `/${rootDir}/`;
    const index = unixPath.lastIndexOf(marker);
    if (index !== -1) {
        return unixPath.slice(index + 1);
    }
    if (unixPath.startsWith(`${rootDir}/`)) {
        return unixPath;
    }
    return unixPath;
}

export function markdownFilePathToUrlPath(
    filePath: string,
    options: MarkdownRoutingOptions
): string {
    const normalized = normalizeMarkdownFilePath(filePath, options);
    const rootDir = options.rootDir ? trimSlashes(options.rootDir) : '';
    const baseUrl = `/${trimSlashes(options.baseUrl)}`;
    const indexFileName = options.indexFileName ?? 'index';

    let relative = normalized;
    if (rootDir && relative.startsWith(`${rootDir}/`)) {
        relative = relative.slice(rootDir.length + 1);
    }
    if (options.stripExtension !== false) {
        relative = relative.replace(/\.md$/i, '');
    }

    const rawSegments = relative.split('/').filter(Boolean);
    const normalizedSegments = rawSegments.map((segment) => normalizeSegment(segment, options));
    const last = normalizedSegments[normalizedSegments.length - 1];
    if (last === indexFileName) {
        normalizedSegments.pop();
    }

    const joined = normalizedSegments.join('/');
    return joined ? `${baseUrl}/${joined}` : baseUrl;
}

export function buildMarkdownRoutes(
    entries: MarkdownDocEntry[],
    options: MarkdownRoutingOptions
): MarkdownRoute[] {
    return entries.map((entry) => {
        const meta = (entry.frontmatter ?? {}) as MarkdownRouteMeta;
        const path = typeof meta.path === 'string' && meta.path.trim()
            ? meta.path
            : markdownFilePathToUrlPath(entry.filePath, options);
        const slug = trimSlashes(path.replace(new RegExp(`^/${trimSlashes(options.baseUrl)}`), ''));
        return {
            path,
            slug,
            filePath: entry.filePath,
            segments: slug ? slug.split('/').filter(Boolean) : [],
            content: entry.content,
            meta,
        };
    });
}

export function sortMarkdownRoutes(routes: MarkdownRoute[]): MarkdownRoute[] {
    return [...routes].sort((a, b) => {
        const orderA = typeof a.meta.order === 'number' ? a.meta.order : 999;
        const orderB = typeof b.meta.order === 'number' ? b.meta.order : 999;
        if (orderA !== orderB) return orderA - orderB;
        const titleA = typeof a.meta.title === 'string' ? a.meta.title : a.slug;
        const titleB = typeof b.meta.title === 'string' ? b.meta.title : b.slug;
        return titleA.localeCompare(titleB);
    });
}

export function matchMarkdownRoute(
    routes: MarkdownRoute[],
    pathname: string
): MarkdownRouteMatch {
    const route = routes.find((entry) => entry.path === pathname) ?? null;
    return {
        route,
        isExact: route !== null,
    };
}

export function getMarkdownRouteSiblings(routes: MarkdownRoute[], current: MarkdownRoute): MarkdownRoute[] {
    const parent = current.segments.slice(0, -1).join('/');
    return routes.filter((route) => route !== current && route.segments.slice(0, -1).join('/') === parent);
}

export function resolveMarkdownRouteHref(href: string, currentPath: string, baseUrl = '/docs'): string {
    if (href.startsWith('/')) return href.replace(/\.md(?=#|$)/, '');
    if (href.startsWith('#')) return href;
    if (/^[a-z]+:/i.test(href)) return href;

    const [withoutHash, hash = ''] = href.split('#');
    const clean = withoutHash.replace(/^\.\//, '').replace(/\.md$/, '');
    const basePrefix = trimSlashes(baseUrl);
    const currentSegments = trimSlashes(currentPath).split('/').filter(Boolean);
    const baseSegments = currentSegments[0] === basePrefix
        ? currentSegments.slice(1, -1)
        : currentSegments.slice(0, -1);
    const segments = [...baseSegments];

    for (const part of clean.split('/')) {
        if (!part || part === '.') continue;
        if (part === '..') {
            segments.pop();
        } else {
            segments.push(part);
        }
    }

    const resolved = segments.join('/');
    const route = resolved === 'overview' || resolved === '' ? `/${basePrefix}` : `/${basePrefix}/${resolved}`;
    return hash ? `${route}#${hash}` : route;
}

export function buildMarkdownRoutesFromModules(
    modules: Record<string, string>,
    options: MarkdownRoutingOptions,
    parseMeta?: (content: string, filePath: string) => MarkdownRouteMeta
): MarkdownRoute[] {
    const entries: MarkdownDocEntry[] = Object.entries(modules).map(([filePath, content]) => ({
        filePath,
        content,
        frontmatter: parseMeta?.(content, filePath),
    }));
    return buildMarkdownRoutes(entries, options);
}
