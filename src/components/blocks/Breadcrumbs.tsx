import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { trimSlash } from "../../libs/utils";

/**
 * A single breadcrumb item.
 * - Provide `href` to render as a clickable link.
 * - Omit `href` on the last item to mark it as the current page (not a link).
 */
export type BreadcrumbItem = {
    label: string;
    href?: string;
};

export type BreadcrumbsProps = {
    /**
     * The breadcrumb trail to render.
     * - Pass a URL string to auto-parse into segments (e.g. "/products/shoes") — falls back to the current route when omitted.
     * - Pass a BreadcrumbItem[] for explicit control over labels and links.
     */
    trail?: string | BreadcrumbItem[];
    /**
     * Optional anchor item rendered before the trail (e.g. the site root).
     * Pass a string for a plain label (e.g. "Home") or a BreadcrumbItem to also add a link (e.g. { label: "Home", href: "/" }).
     */
    rootItem?: string | BreadcrumbItem;
    /** Character or icon rendered between items. Use "chevron" for an SVG arrow. Default: "/" */
    separator?: '/' | '>' | 'chevron' | string;
    /** When true, renders a <script type="application/ld+json"> BreadcrumbList schema.org tag. Default: false */
    jsonLd?: boolean;
    /** Base URL prepended to item hrefs in the JSON-LD output only (e.g. "https://example.com"). Does not affect the visual links. Defaults to window.location.origin. */
    baseUrl?: string;
    className?: string;
};

/** Options for buildBreadcrumbSchema. */
export type BreadcrumbSchemaOptions = {
    /** The breadcrumb item list. Items with `href` get an absolute URL in the schema; items without `href` (current page) do not. */
    items: BreadcrumbItem[];
    /** Optional anchor item prepended before the list (same shape as BreadcrumbItem — e.g. { label: "Home", href: "/" }). */
    rootItem?: BreadcrumbItem;
    /** Base URL prepended to all hrefs to produce the absolute URLs required by schema.org (e.g. "https://example.com"). */
    baseUrl: string;
    /** When true, returns a JSON string ready for `dangerouslySetInnerHTML` — no manual JSON.stringify needed. Default: false */
    stringify?: boolean;
};

/**
 * Builds a schema.org BreadcrumbList.
 * Returns a plain object by default, or a ready-to-inject JSON string when `stringify: true`.
 */
export function buildBreadcrumbSchema(options: BreadcrumbSchemaOptions & { stringify: true }): string;
export function buildBreadcrumbSchema(options: BreadcrumbSchemaOptions & { stringify?: false }): object;
export function buildBreadcrumbSchema(options: BreadcrumbSchemaOptions): object | string {
    const { items, rootItem, baseUrl, stringify = false } = options;

    const all: BreadcrumbItem[] = [
        ...(rootItem ? [rootItem] : []),
        ...items,
    ];

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
        })),
    };

    return stringify ? JSON.stringify(schema) : schema;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function resolveTrail(trail: string | BreadcrumbItem[] | undefined, pathname: string): BreadcrumbItem[] {
    if (Array.isArray(trail)) return trail;

    const segments = trimSlash(trail || pathname).split('/').filter(Boolean);
    let tokenPath = '';
    const built: BreadcrumbItem[] = segments.map((token) => {
        tokenPath += `/${token}`;
        return { label: token, href: tokenPath };
    });

    if (built.length === 0) return built;
    return [...built.slice(0, -1), { label: built[built.length - 1].label }];
}

function normalizeItem(item: string | BreadcrumbItem | undefined): BreadcrumbItem | undefined {
    if (!item) return undefined;
    return typeof item === 'string' ? { label: item } : item;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChevronSep = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const Separator = ({ value }: { value: string }) => (
    <span className="text-muted-foreground/60 select-none flex items-center" aria-hidden>
        {value === 'chevron' ? <ChevronSep /> : value}
    </span>
);

const ItemLink = ({ href, label }: { href: string; label: string }) => (
    <Link to={href} className="text-muted-foreground hover:text-foreground transition-colors">
        {label}
    </Link>
);

const ItemCurrent = ({ label }: { label: string }) => (
    <span className="text-foreground font-medium" aria-current="page">
        {label}
    </span>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Breadcrumbs = ({
    trail     = undefined,
    rootItem  = undefined,
    separator = '/',
    jsonLd    = false,
    baseUrl   = undefined,
    className = undefined,
}: BreadcrumbsProps) => {
    const location = useLocation();
    const resolved = resolveTrail(trail, location.pathname);
    const root = normalizeItem(rootItem);

    const allItems: Array<{ key: string; node: React.ReactNode }> = [];

    if (root) {
        const node = root.href
            ? <ItemLink href={root.href} label={root.label} />
            : <span className="text-muted-foreground">{root.label}</span>;
        allItems.push({ key: '__root', node });
    }

    resolved.forEach((item, i) => {
        const key = item.href ?? `__item-${i}`;
        const node = item.href
            ? <ItemLink href={item.href} label={item.label} />
            : <ItemCurrent label={item.label} />;
        allItems.push({ key, node });
    });

    if (!allItems.length) return null;

    const schemaString = jsonLd
        ? buildBreadcrumbSchema({
            items: resolved,
            rootItem: root,
            baseUrl: baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : ''),
            stringify: true,
          })
        : null;

    return (
        <>
            <nav aria-label="Breadcrumb" className={className}>
                <ol className="flex flex-wrap items-center gap-1.5 text-sm">
                    {allItems.map((item, i) => (
                        <React.Fragment key={item.key}>
                            {i > 0 && <li><Separator value={separator} /></li>}
                            <li>{item.node}</li>
                        </React.Fragment>
                    ))}
                </ol>
            </nav>
            {schemaString && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemaString }}
                />
            )}
        </>
    );
};

export default Breadcrumbs;
