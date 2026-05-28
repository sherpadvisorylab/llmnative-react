import React from 'react';
import { Breadcrumbs, buildBreadcrumbSchema } from '@llmnative/react';
import type { BreadcrumbItem } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

// ─── Playground preview ───────────────────────────────────────────────────────

function BreadcrumbsPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const trail = p.trail || undefined;
    const rootItem = p.rootItem || undefined;

    const schema = p.jsonLd
        ? buildBreadcrumbSchema({
            items: Array.isArray(trail) ? trail : [],
            rootItem: typeof rootItem === 'string' ? { label: rootItem } : rootItem,
            baseUrl: p.baseUrl || 'https://example.com',
          })
        : null;

    return (
        <div className="space-y-4">
            <Breadcrumbs
                trail={trail}
                rootItem={rootItem}
                separator={(p.separator as string) || '/'}
                jsonLd={p.jsonLd}
                baseUrl={p.baseUrl || undefined}
                className={p.className || undefined}
            />

            {schema && (
                <div className="rounded-md border bg-muted/40 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        JSON-LD output (schema.org BreadcrumbList)
                    </div>
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {JSON.stringify(schema, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

// ─── Props definition ─────────────────────────────────────────────────────────

const BREADCRUMBS_PROPS: PropDef[] = [
    {
        name: 'trail',
        type: 'string | BreadcrumbItem[]',
        description: 'The breadcrumb trail. Pass a URL string to auto-parse into segments, or a BreadcrumbItem[] for explicit control. Falls back to the current route when omitted.',
        shape: `// URL string — segments become links, last segment is current page
string

// Explicit list — full control over labels and links
{ label: string; href?: string }[]`,
        example: `// URL string
trail="/products/shoes/sneakers"

// Explicit list
trail={[
  { label: 'Products', href: '/products' },
  { label: 'Shoes',    href: '/products/shoes' },
  { label: 'Sneakers' },   // no href → current page
]}`,
        control: 'json',
        textareaMode: 'json',
        rows: 6,
        shortcuts: [
            {
                label: 'URL string',
                value: '/components/forms/checklist',
            },
            {
                label: 'Explicit items',
                value: [
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'Running shoes' },
                ],
            },
            {
                label: 'Deep path',
                value: [
                    { label: 'Home', href: '/' },
                    { label: 'Docs', href: '/docs' },
                    { label: 'Components', href: '/docs/components' },
                    { label: 'Breadcrumbs' },
                ],
            },
            { label: 'Clear', value: null },
        ],
    },
    {
        name: 'rootItem',
        type: 'string | BreadcrumbItem',
        description: 'Optional anchor item rendered before the trail (e.g. the site root). Pass a string for a plain label or a BreadcrumbItem to add a link.',
        shape: `string                          // plain label, no link
{ label: string; href?: string } // same shape as BreadcrumbItem`,
        example: `rootItem="Home"
rootItem={{ label: 'Home', href: '/' }}`,
        control: 'json',
        textareaMode: 'json',
        rows: 2,
        shortcuts: [
            { label: 'String', value: 'Home' },
            { label: 'With link', value: { label: 'Home', href: '/' } },
            { label: 'Clear', value: null },
        ],
    },
    {
        name: 'separator',
        type: '"/" | ">" | "chevron" | string',
        default: '"/"',
        description: 'Separator rendered between items. Use "chevron" for an SVG arrow.',
        control: 'select',
        options: ['/', '>', 'chevron'],
    },
    {
        name: 'jsonLd',
        type: 'boolean',
        default: 'false',
        description: 'When true, renders a <script type="application/ld+json"> BreadcrumbList tag for SEO structured data.',
        control: 'boolean',
    },
    {
        name: 'baseUrl',
        type: 'string',
        description: 'Base URL prepended to item hrefs in the JSON-LD output only (e.g. "https://example.com"). Does not affect visual links. Defaults to window.location.origin.',
        control: 'text',
        placeholder: 'https://example.com',
        hidden: (p) => !p.jsonLd,
    },
    {
        name: 'className',
        type: 'string',
        description: 'CSS classes on the nav wrapper',
        control: 'text',
    },
];

// ─── Playground config ────────────────────────────────────────────────────────

const PLAYGROUND: PlaygroundConfig = {
    props: BREADCRUMBS_PROPS,
    defaultProps: {
        trail: '/components/forms/checklist',
        rootItem: 'Home',
        separator: '/',
        jsonLd: false,
        baseUrl: 'https://example.com',
        className: '',
    },
    size: 'xl',
    layout: 'split',
    render: (p) => <BreadcrumbsPlaygroundPreview p={p} />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BreadcrumbsPage() {
    usePlayground(PLAYGROUND, 'Breadcrumbs');

    return (
        <PageLayout
            title="Breadcrumbs"
            description="Breadcrumb trail parsed from a URL string or built from an explicit item list. Items with href render as links; the last item without href is the current page."
        >
            <Section
                title="URL string trail"
                description="Pass a URL string — segments become links, the last segment is the current page."
                preview={<Breadcrumbs trail="/components/forms/checklist" rootItem={{ label: 'Home', href: '/' }} />}
                code={`import { Breadcrumbs } from '@llmnative/react';

<Breadcrumbs
    trail="/components/forms/checklist"
    rootItem={{ label: 'Home', href: '/' }}
/>`}
            />

            <Section
                title="Explicit item list"
                description="Use a BreadcrumbItem[] when labels differ from URL slugs or when you need full control over links."
                preview={
                    <Breadcrumbs trail={[
                        { label: 'Home', href: '/' },
                        { label: 'Products', href: '/products' },
                        { label: 'Running shoes' },
                    ]} />
                }
                code={`<Breadcrumbs trail={[
    { label: 'Home',          href: '/' },
    { label: 'Products',      href: '/products' },
    { label: 'Running shoes' },   // no href → current page
]} />`}
            />

            <Section
                title="Current route (no trail)"
                description="When trail is omitted, the component reads the current route automatically."
                preview={<Breadcrumbs rootItem="Home" />}
                code={`<Breadcrumbs rootItem="Home" />`}
            />

            <Section
                title="Chevron separator"
                preview={<Breadcrumbs trail="/components/forms/checklist" rootItem={{ label: 'Home', href: '/' }} separator="chevron" />}
                code={`<Breadcrumbs trail="/components/forms/checklist" rootItem={{ label: 'Home', href: '/' }} separator="chevron" />`}
            />

            <Section
                title="JSON-LD structured data"
                description="Enable jsonLd to inject a schema.org BreadcrumbList script tag. baseUrl is used only for the schema — visual links are unaffected."
                preview={
                    <div className="space-y-4">
                        <Breadcrumbs trail="/products/shoes" rootItem={{ label: 'Home', href: '/' }} jsonLd baseUrl="https://example.com" />
                        <div className="rounded-md border bg-muted/40 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                generated &lt;script type="application/ld+json"&gt;
                            </div>
                            <pre className="text-xs text-foreground whitespace-pre-wrap">{JSON.stringify(
                                buildBreadcrumbSchema({
                                    items: [{ label: 'products', href: '/products' }, { label: 'shoes' }],
                                    rootItem: { label: 'Home', href: '/' },
                                    baseUrl: 'https://example.com',
                                }), null, 2
                            )}</pre>
                        </div>
                    </div>
                }
                code={`<Breadcrumbs
    trail="/products/shoes"
    rootItem={{ label: 'Home', href: '/' }}
    jsonLd
    baseUrl="https://example.com"
/>`}
            />

            <Section
                title="buildBreadcrumbSchema — standalone usage"
                description="Use the exported utility to generate schema.org data independently — for SSR, sitemaps, or custom head injection. stringify: true returns a string ready for dangerouslySetInnerHTML."
                code={`import { buildBreadcrumbSchema } from '@llmnative/react';
import type { BreadcrumbItem } from '@llmnative/react';

const items: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { label: 'Shoes',    href: '/products/shoes' },
    { label: 'Sneakers' },
];

// Returns JSON string — inject directly without JSON.stringify
const schemaString = buildBreadcrumbSchema({
    items,
    rootItem:  { label: 'Home', href: '/' },
    baseUrl:   'https://mysite.com',
    stringify: true,
});

<script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: schemaString }}
/>`}
            />

            <PropDocsTable props={BREADCRUMBS_PROPS} />

            <PropDocsTable
                title="buildBreadcrumbSchema"
                props={[
                    {
                        name: 'items',
                        type: 'BreadcrumbItem[]',
                        required: true,
                        description: 'The breadcrumb item list. Items with href get an absolute URL in the schema; items without href (current page) do not.',
                        example: `[
  { label: 'Products', href: '/products' },
  { label: 'Shoes',    href: '/products/shoes' },
  { label: 'Sneakers' }   // no href → omitted from schema "item" field
]`,
                    },
                    {
                        name: 'rootItem',
                        type: 'BreadcrumbItem',
                        description: 'Optional anchor item prepended before items (same shape as BreadcrumbItem).',
                        example: `{ label: 'Home', href: '/' }`,
                    },
                    {
                        name: 'baseUrl',
                        type: 'string',
                        required: true,
                        description: 'Base URL prepended to all hrefs to produce absolute URLs required by schema.org.',
                    },
                    {
                        name: 'stringify',
                        type: 'boolean',
                        default: 'false',
                        description: 'When true, returns a JSON string instead of a plain object — ready for dangerouslySetInnerHTML without calling JSON.stringify.',
                    },
                ]}
            />
        </PageLayout>
    );
}
