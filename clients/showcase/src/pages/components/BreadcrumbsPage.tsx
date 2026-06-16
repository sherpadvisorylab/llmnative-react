import React from 'react';
import { Breadcrumbs, buildBreadcrumbSchema } from '@llmnative/react';
import type { BreadcrumbItem } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseBreadcrumbsI18n, useShowcaseCommonI18n } from '../../showcase/i18n';

function BreadcrumbsPlaygroundPreview({
    p,
    jsonLdOutputLabel,
}: {
    p: Record<string, any>;
    jsonLdOutputLabel: string;
}) {
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
                        {jsonLdOutputLabel}
                    </div>
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {JSON.stringify(schema, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default function BreadcrumbsPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseBreadcrumbsI18n();

    const explicitPreviewTrail = React.useMemo<BreadcrumbItem[]>(
        () => [
            { label: t.labels.home, href: '/' },
            { label: t.labels.products, href: '/products' },
            { label: t.labels.runningShoes },
        ],
        [t.labels.home, t.labels.products, t.labels.runningShoes],
    );

    const deepPathPreview = React.useMemo<BreadcrumbItem[]>(
        () => [
            { label: t.labels.home, href: '/' },
            { label: t.labels.docs, href: '/docs' },
            { label: t.labels.components, href: '/docs/components' },
            { label: t.labels.breadcrumbs },
        ],
        [t.labels.home, t.labels.docs, t.labels.components, t.labels.breadcrumbs],
    );

    const breadcrumbsProps = React.useMemo<PropDef[]>(() => [
        {
            name: 'trail',
            type: 'string | BreadcrumbItem[]',
            description: t.propsDocs.items.trail.description,
            shape: `// URL string - segments become links, last segment is current page
string

// Explicit list - full control over labels and links
{ label: string; href?: string }[]`,
            example: `// URL string
trail="/products/shoes/sneakers"

// Explicit list
trail={[
  { label: 'Products', href: '/products' },
  { label: 'Shoes', href: '/products/shoes' },
  { label: 'Sneakers' },   // no href -> current page
]}`,
            control: 'json',
            textareaMode: 'json',
            rows: 6,
            shortcuts: [
                {
                    label: t.playground.shortcuts.urlString,
                    value: '/components/forms/checklist',
                },
                {
                    label: t.playground.shortcuts.explicitItems,
                    value: explicitPreviewTrail,
                },
                {
                    label: t.playground.shortcuts.deepPath,
                    value: deepPathPreview,
                },
                {
                    label: t.playground.shortcuts.clear,
                    value: null,
                },
            ],
        },
        {
            name: 'rootItem',
            type: 'string | BreadcrumbItem',
            description: t.propsDocs.items.rootItem.description,
            shape: `string                          // plain label, no link
{ label: string; href?: string } // same shape as BreadcrumbItem`,
            example: `rootItem="Home"
rootItem={{ label: 'Home', href: '/' }}`,
            control: 'json',
            textareaMode: 'json',
            rows: 2,
            shortcuts: [
                { label: t.playground.shortcuts.stringValue, value: t.labels.home },
                { label: t.playground.shortcuts.withLink, value: { label: t.labels.home, href: '/' } },
                { label: t.playground.shortcuts.clear, value: null },
            ],
        },
        {
            name: 'separator',
            type: '"/" | ">" | "chevron" | string',
            default: '"/"',
            description: t.propsDocs.items.separator.description,
            control: 'select',
            options: ['/', '>', 'chevron'],
        },
        {
            name: 'jsonLd',
            type: 'boolean',
            default: 'false',
            description: t.propsDocs.items.jsonLd.description,
            control: 'boolean',
        },
        {
            name: 'baseUrl',
            type: 'string',
            description: t.propsDocs.items.baseUrl.description,
            control: 'text',
            placeholder: 'https://example.com',
            hidden: (p) => !p.jsonLd,
        },
        {
            name: 'className',
            type: 'string',
            description: t.propsDocs.items.className.description,
            control: 'text',
        },
    ], [deepPathPreview, explicitPreviewTrail, t]);

    const schemaProps = React.useMemo<PropDef[]>(() => [
        {
            name: 'items',
            type: 'BreadcrumbItem[]',
            required: true,
            description: t.propsDocs.schemaItems.items.description,
            example: `[
  { label: 'Products', href: '/products' },
  { label: 'Shoes', href: '/products/shoes' },
  { label: 'Sneakers' }   // no href -> omitted from schema "item" field
]`,
        },
        {
            name: 'rootItem',
            type: 'BreadcrumbItem',
            description: t.propsDocs.schemaItems.rootItem.description,
            example: `{ label: 'Home', href: '/' }`,
        },
        {
            name: 'baseUrl',
            type: 'string',
            required: true,
            description: t.propsDocs.schemaItems.baseUrl.description,
        },
        {
            name: 'stringify',
            type: 'boolean',
            default: 'false',
            description: t.propsDocs.schemaItems.stringify.description,
        },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: breadcrumbsProps,
        defaultProps: {
            trail: '/components/forms/checklist',
            rootItem: t.labels.home,
            separator: '/',
            jsonLd: false,
            baseUrl: 'https://example.com',
            className: '',
        },
        size: 'xl',
        layout: 'split',
        render: (p) => <BreadcrumbsPlaygroundPreview p={p} jsonLdOutputLabel={t.labels.jsonLdOutput} />,
    }), [breadcrumbsProps, t.labels.home, t.labels.jsonLdOutput]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.urlStringTrail.title}
                description={t.sections.urlStringTrail.description}
                preview={<Breadcrumbs trail="/components/forms/checklist" rootItem={{ label: t.labels.home, href: '/' }} />}
                code={`import { Breadcrumbs } from '@llmnative/react';

<Breadcrumbs
    trail="/components/forms/checklist"
    rootItem={{ label: 'Home', href: '/' }}
/>`}
            />

            <Section
                title={t.sections.explicitItemList.title}
                description={t.sections.explicitItemList.description}
                preview={<Breadcrumbs trail={explicitPreviewTrail} />}
                code={`<Breadcrumbs trail={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Running shoes' },   // no href -> current page
]} />`}
            />

            <Section
                title={t.sections.currentRoute.title}
                description={t.sections.currentRoute.description}
                preview={<Breadcrumbs rootItem={t.labels.home} />}
                code={`<Breadcrumbs rootItem="Home" />`}
            />

            <Section
                title={t.sections.chevronSeparator.title}
                preview={<Breadcrumbs trail="/components/forms/checklist" rootItem={{ label: t.labels.home, href: '/' }} separator="chevron" />}
                code={`<Breadcrumbs trail="/components/forms/checklist" rootItem={{ label: 'Home', href: '/' }} separator="chevron" />`}
            />

            <Section
                title={t.sections.jsonLdStructuredData.title}
                description={t.sections.jsonLdStructuredData.description}
                preview={
                    <div className="space-y-4">
                        <Breadcrumbs trail="/products/shoes" rootItem={{ label: t.labels.home, href: '/' }} jsonLd baseUrl="https://example.com" />
                        <div className="rounded-md border bg-muted/40 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {t.labels.generatedScriptTag}
                            </div>
                            <pre className="whitespace-pre-wrap text-xs text-foreground">{JSON.stringify(
                                buildBreadcrumbSchema({
                                    items: [
                                        { label: t.labels.products, href: '/products' },
                                        { label: t.labels.shoes },
                                    ],
                                    rootItem: { label: t.labels.home, href: '/' },
                                    baseUrl: 'https://example.com',
                                }),
                                null,
                                2,
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
                title={t.sections.standaloneSchema.title}
                description={t.sections.standaloneSchema.description}
                code={`import { buildBreadcrumbSchema } from '@llmnative/react';
import type { BreadcrumbItem } from '@llmnative/react';

const items: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    { label: 'Shoes', href: '/products/shoes' },
    { label: 'Sneakers' },
];

// Returns JSON string - inject directly without JSON.stringify
const schemaString = buildBreadcrumbSchema({
    items,
    rootItem: { label: 'Home', href: '/' },
    baseUrl: 'https://mysite.com',
    stringify: true,
});

<script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: schemaString }}
/>`}
            />

            <PropDocsTable props={breadcrumbsProps} title={common.sections.props} />
            <PropDocsTable title={t.propsDocs.schemaTitle} props={schemaProps} />
        </PageLayout>
    );
}
