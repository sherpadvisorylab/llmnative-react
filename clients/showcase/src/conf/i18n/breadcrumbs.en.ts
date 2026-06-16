import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        breadcrumbs: {
            page: {
                title: 'Breadcrumbs',
                description: 'Breadcrumb trail parsed from a URL string or built from an explicit item list. Items with href render as links; the last item without href is the current page.',
            },
            sections: {
                urlStringTrail: {
                    title: 'URL string trail',
                    description: 'Pass a URL string: segments become links and the last segment is treated as the current page.',
                },
                explicitItemList: {
                    title: 'Explicit item list',
                    description: 'Use a BreadcrumbItem[] when labels differ from URL slugs or when you need full control over links.',
                },
                currentRoute: {
                    title: 'Current route (no trail)',
                    description: 'When trail is omitted, the component reads the current route automatically.',
                },
                chevronSeparator: {
                    title: 'Chevron separator',
                },
                jsonLdStructuredData: {
                    title: 'JSON-LD structured data',
                    description: 'Enable jsonLd to inject a schema.org BreadcrumbList script tag. baseUrl is used only for the schema and does not change visual links.',
                },
                standaloneSchema: {
                    title: 'buildBreadcrumbSchema - standalone usage',
                    description: 'Use the exported utility to generate schema.org data independently for SSR, sitemaps or custom head injection. stringify: true returns a string ready for dangerouslySetInnerHTML.',
                },
            },
            labels: {
                home: 'Home',
                products: 'Products',
                shoes: 'Shoes',
                sneakers: 'Sneakers',
                runningShoes: 'Running shoes',
                docs: 'Docs',
                components: 'Components',
                breadcrumbs: 'Breadcrumbs',
                jsonLdOutput: 'JSON-LD output (schema.org BreadcrumbList)',
                generatedScriptTag: 'generated <script type="application/ld+json">',
                currentPageOmitted: 'no href -> current page',
            },
            propsDocs: {
                items: {
                    trail: {
                        description: 'The breadcrumb trail. Pass a URL string to auto-parse segments, or a BreadcrumbItem[] for explicit control. Falls back to the current route when omitted.',
                    },
                    rootItem: {
                        description: 'Optional anchor item rendered before the trail. Pass a string for a plain label or a BreadcrumbItem to add a link.',
                    },
                    separator: {
                        description: 'Separator rendered between items. Use "chevron" for an SVG arrow.',
                    },
                    jsonLd: {
                        description: 'When true, renders a BreadcrumbList <script type="application/ld+json"> tag for structured SEO data.',
                    },
                    baseUrl: {
                        description: 'Base URL prepended to item hrefs in the JSON-LD output only. It does not affect visual links and defaults to window.location.origin.',
                    },
                    className: {
                        description: 'CSS classes on the nav wrapper.',
                    },
                },
                schemaTitle: 'buildBreadcrumbSchema',
                schemaItems: {
                    items: {
                        description: 'The breadcrumb item list. Items with href get an absolute URL in the schema; items without href for the current page do not.',
                    },
                    rootItem: {
                        description: 'Optional anchor item prepended before items, using the same shape as BreadcrumbItem.',
                    },
                    baseUrl: {
                        description: 'Base URL prepended to all hrefs to produce absolute URLs required by schema.org.',
                    },
                    stringify: {
                        description: 'When true, returns a JSON string instead of a plain object, ready for dangerouslySetInnerHTML without JSON.stringify.',
                    },
                },
            },
            playground: {
                title: 'Breadcrumbs',
                shortcuts: {
                    urlString: 'URL string',
                    explicitItems: 'Explicit items',
                    deepPath: 'Deep path',
                    clear: 'Clear',
                    stringValue: 'String',
                    withLink: 'With link',
                },
            },
        },
    },
});
