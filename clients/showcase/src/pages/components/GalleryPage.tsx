import React from 'react';
import { DataProvider, Gallery, MockDataProvider, useDataProvider } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

type GalleryMockAsset = {
    name: string;
    color: string;
    accent: string;
    category?: string;
    status?: 'ready' | 'draft' | 'review';
    width?: number;
    height?: number;
};

const GALLERY_ASSETS_SEED: Record<string, GalleryMockAsset> = {
    hero: { name: 'Brand - Hero', color: '2563eb', accent: '38bdf8', category: 'Brand', status: 'ready', width: 320, height: 220 },
    social: { name: 'Brand - Social', color: '059669', accent: 'a7f3d0', category: 'Brand', status: 'ready', width: 320, height: 220 },
    iconSet: { name: 'Brand - Icon set', color: '4f46e5', accent: 'c4b5fd', category: 'Brand', status: 'review', width: 320, height: 220 },
    palette: { name: 'Brand - Palette', color: '0f766e', accent: '5eead4', category: 'Brand', status: 'draft', width: 320, height: 220 },
    campaign: { name: 'Campaign - Launch', color: 'dc2626', accent: 'fecaca', category: 'Campaign', status: 'review', width: 320, height: 220 },
    preview: { name: 'Campaign - Preview', color: '7c3aed', accent: 'ddd6fe', category: 'Campaign', status: 'draft', width: 320, height: 220 },
    banner: { name: 'Campaign - Banner', color: 'c2410c', accent: 'fed7aa', category: 'Campaign', status: 'ready', width: 320, height: 220 },
    story: { name: 'Campaign - Story', color: 'be123c', accent: 'fecdd3', category: 'Campaign', status: 'review', width: 320, height: 220 },
    report: { name: 'Docs - Report', color: '0891b2', accent: 'a5f3fc', category: 'Docs', status: 'ready', width: 320, height: 220 },
    archive: { name: 'Docs - Archive', color: 'ea580c', accent: 'ffedd5', category: 'Docs', status: 'draft', width: 320, height: 220 },
    guide: { name: 'Docs - Guide', color: '475569', accent: 'cbd5e1', category: 'Docs', status: 'review', width: 320, height: 220 },
    changelog: { name: 'Docs - Changelog', color: '9333ea', accent: 'e9d5ff', category: 'Docs', status: 'ready', width: 320, height: 220 },
};

const PLAYGROUND_SEED = {
    '/gallery-assets': GALLERY_ASSETS_SEED,
};

function svgAsset(name: string, color: string, accent: string, width = 320, height = 220) {
    const safeColor = color.replace('#', '');
    const safeAccent = accent.replace('#', '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${safeColor}"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="${width}" height="${height}" rx="12" fill="url(#g)"/><circle cx="${width - 58}" cy="54" r="36" fill="#${safeAccent}" opacity=".36"/><rect x="24" y="28" width="${width - 112}" height="12" rx="6" fill="#fff" opacity=".28"/><rect x="24" y="${height - 70}" width="${width - 48}" height="18" rx="9" fill="#fff" opacity=".18"/><rect x="24" y="${height - 42}" width="${Math.round(width * 0.48)}" height="12" rx="6" fill="#fff" opacity=".28"/><text x="24" y="${Math.round(height / 2) + 10}" font-family="Arial" font-size="24" font-weight="700" fill="white">${name}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function recordsToGalleryBody(records: Array<GalleryMockAsset & { _key?: string }>) {
    return records.map((record) => ({
        _key: record._key,
        name: record.name,
        category: record.category,
        status: record.status,
        img: (
            <img
                src={svgAsset(record.name, record.color, record.accent, record.width, record.height)}
                alt={record.name}
            />
        ),
    }));
}

function WithGalleryMock({ children }: { children: React.ReactNode }) {
    const provider = React.useMemo(() => new MockDataProvider(PLAYGROUND_SEED), []);

    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

function GalleryFromMock({
    path,
    ...props
}: Omit<React.ComponentProps<typeof Gallery>, 'body'> & { path: string }) {
    const provider = useDataProvider();
    const [records, setRecords] = React.useState<Array<GalleryMockAsset & { _key?: string }>>([]);

    provider.useListener(path, setRecords);

    return <Gallery body={recordsToGalleryBody(records)} {...props} />;
}

const galleryBody = recordsToGalleryBody(
    Object.entries(GALLERY_ASSETS_SEED).map(([key, value]) => ({ _key: key, ...value }))
);

const GALLERY_PROPS: PropDef[] = [
    { name: 'body', type: 'GalleryRecord[]', description: 'Records containing img or thumbnail data', control: 'json', readOnly: true },
    { name: 'recordsPath', type: 'string', default: '/gallery-assets', description: 'Mock database collection used to render gallery assets in the playground', control: 'text' },
    { name: 'Header', type: 'ReactNode', description: 'Header content above gallery', control: 'text' },
    { name: 'Footer', type: 'ReactNode', description: 'Footer content below gallery', control: 'text' },
    { name: 'overlays', type: 'GalleryOverlay[]', description: 'Overlay rules. position chooses the slot, badge renders BadgeOverlay, when filters by record fields, className styles the overlay lane, render is available in code for custom React nodes.', control: 'json' },
    { name: 'onClick', type: '(index: number) => void', description: 'Called when an item is clicked' },
    { name: 'pagination', type: 'PaginationParams', description: 'Pagination config: page, limit, navLimit, align, sticky, scrollToTopOnChange and scrollBehavior', control: 'json' },
    { name: 'gutterSize', type: '0 | 1 | 2 | 3 | 4 | 5', description: 'Item padding size', control: 'number', min: 0, max: 5 },
    { name: 'rowCols', type: '1 | 2 | 3 | 4 | 6', description: 'Columns per row', control: 'select', options: ['1', '2', '3', '4', '6'] },
    { name: 'groupBy', type: 'string | string[]', description: 'Split images into titled groups by alt/name separator', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Left side content, vertically centered beside the gallery body', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Right side content, vertically centered beside the gallery body', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on gallery container', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'headerClass', type: 'string', description: 'CSS classes on header', control: 'text' },
    { name: 'bodyClass', type: 'string', description: 'CSS classes on body', control: 'text' },
    { name: 'footerClass', type: 'string', description: 'CSS classes on footer', control: 'text' },
    { name: 'selectedClass', type: 'string', description: 'Class applied to selected item', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: GALLERY_PROPS,
    size: 'xl',
    layout: 'split',
    mockSeed: PLAYGROUND_SEED,
    defaultProps: {
        body: '[mock records]',
        recordsPath: '/gallery-assets',
        Header: 'Assets',
        Footer: '',
        overlays: [
            { position: 'topRight', badge: { content: 'new', type: 'primary' }, className: 'uppercase' },
            { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
            { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
            { position: 'middleLeft', badge: { content: 'hero only', type: 'dark' }, when: { _key: 'hero' } },
        ],
        pagination: {
            page: 1,
            limit: 6,
            navLimit: 5,
            align: 'center',
            sticky: false,
            scrollToTopOnChange: false,
            scrollBehavior: 'smooth',
        },
        gutterSize: 2,
        rowCols: '2',
        groupBy: '',
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
        headerClass: '',
        bodyClass: '',
        footerClass: '',
        selectedClass: '',
    },
    render: (p) => (
        <GalleryFromMock
            path={p.recordsPath || '/gallery-assets'}
            Header={p.Header || undefined}
            Footer={p.Footer || undefined}
            overlays={Array.isArray(p.overlays) ? p.overlays : undefined}
            pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
            gutterSize={Number(p.gutterSize) as any}
            rowCols={Number(p.rowCols) as any}
            groupBy={p.groupBy || undefined}
            pre={p.pre || undefined}
            post={p.post || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
            headerClass={p.headerClass || undefined}
            bodyClass={p.bodyClass || undefined}
            footerClass={p.footerClass || undefined}
            selectedClass={p.selectedClass || undefined}
        />
    ),
};

export default function GalleryPage() {
    usePlayground(PLAYGROUND, 'Gallery');

    return (
        <PageLayout title="Gallery" description="Responsive image gallery with overlays, selection and optional pagination.">
            <Section
                title="Data-driven gallery"
                description="Render the gallery from records. The playground uses the same shape through the mock database, so labels and visual placeholders can be edited as data."
                preview={
                    <WithGalleryMock>
                        <GalleryFromMock
                            path="/gallery-assets"
                            Header="Assets"
                            overlays={[
                                { position: 'topRight', badge: { content: 'new', type: 'primary' }, className: 'uppercase' },
                                { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
                                { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
                            ]}
                            rowCols={3}
                            pagination={{
                                page: 1,
                                limit: 6,
                                navLimit: 5,
                                align: 'center',
                                sticky: false,
                                scrollToTopOnChange: false,
                                scrollBehavior: 'smooth',
                            }}
                        />
                    </WithGalleryMock>
                }
                code={`import { Gallery, useDataProvider } from 'react-firestrap';

function GalleryFromMock({ path }) {
    const provider = useDataProvider();
    const [records, setRecords] = React.useState([]);

    provider.useListener(path, setRecords);

    return (
        <Gallery
            body={records.map((record) => ({
                _key: record._key,
                name: record.name,
                category: record.category,
                status: record.status,
                img: <img src={record.src} alt={record.name} />,
            }))}
            Header="Assets"
            overlays={[
                { position: 'topRight', badge: { content: 'new', type: 'primary' }, className: 'uppercase' },
                { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
                { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
                {
                    position: 'middleRight',
                    badge: (item) => item.name?.includes('Launch')
                        ? { content: 'focus', type: 'warning' }
                        : null,
                },
            ]}
            pagination={{
                page: 1,
                limit: 6,
                navLimit: 5,
                align: 'center',
                sticky: false,
                scrollToTopOnChange: false,
                scrollBehavior: 'smooth',
            }}
            rowCols={3}
        />
    );
}`}
            />

            <Section
                title="Overlay rules"
                description="Declare all visual indicators in overlays. Each rule states where it appears, what it renders, and which records receive it."
                preview={
                    <Gallery
                        body={galleryBody.slice(0, 6)}
                        Header="Overlay rule mapping"
                        overlays={[
                            { position: 'topRight', badge: { content: 'all', type: 'primary' }, className: 'uppercase' },
                            { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
                            { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
                            {
                                position: 'middleRight',
                                badge: (item) => item.status === 'draft' ? { content: 'draft', type: 'secondary' } : null,
                            },
                            {
                                position: 'middleLeft',
                                render: (item) => item._key === 'hero'
                                    ? <span className="rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">custom</span>
                                    : null,
                            },
                        ]}
                        pagination={{ limit: 6, align: 'center' }}
                        rowCols={3}
                    />
                }
                code={`import { Gallery } from 'react-firestrap';

<Gallery
    body={records}
    Header="Overlay rule mapping"
    overlays={[
        // position: where the overlay is anchored inside the thumb.
        // badge: string, number or { content, type } rendered through BadgeOverlay.
        // className: optional classes on the overlay lane.
        { position: 'topRight', badge: { content: 'all', type: 'primary' }, className: 'uppercase' },

        // when: object filters by record fields. This appears only on Brand assets.
        { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },

        // Another field filter. This appears only when record.status === 'review'.
        { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },

        // badge can be a function for dynamic content and type.
        {
            position: 'middleRight',
            badge: (item) => item.status === 'draft'
                ? { content: 'draft', type: 'secondary' }
                : null,
        },

        // render is for custom React nodes instead of BadgeOverlay.
        {
            position: 'middleLeft',
            render: (item) => item._key === 'hero'
                ? <span className="rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">custom</span>
                : null,
        },
    ]}
    rowCols={3}
/>`}
            />

            <Section
                title="Overlays and selection"
                description="Use overlays together with selectedClass when the gallery is interactive. The visual indicators stay data-driven while click handling marks the active thumb."
                preview={
                    <Gallery
                        body={galleryBody.slice(0, 4)}
                        Header="Selectable assets"
                        overlays={[
                            { position: 'topRight', badge: { content: 'ready', type: 'success' } },
                            { position: 'bottomLeft', badge: { content: 'approved', type: 'light' } },
                        ]}
                        selectedClass="ring-2 ring-primary rounded-lg"
                        rowCols={2}
                        onClick={() => undefined}
                    />
                }
                code={`import { Gallery } from 'react-firestrap';

<Gallery
    body={records}
    Header="Selectable assets"
    overlays={[
        { position: 'topRight', badge: { content: 'ready', type: 'success' } },
        { position: 'bottomLeft', badge: { content: 'approved', type: 'light' } },
    ]}
    selectedClass="ring-2 ring-primary rounded-lg"
    rowCols={2}
    onClick={(index) => setSelected(index)}
/>`}
            />

            <Section
                title="Pagination"
                description="Pass PaginationParams when the record set is large. Gallery delegates paging to the shared Pagination component."
                preview={<Gallery body={galleryBody} Header="Paged assets" pagination={{ limit: 4, align: 'center' }} rowCols={2} />}
                code={`import { Gallery } from 'react-firestrap';

<Gallery
    body={records}
    Header="Paged assets"
    pagination={{ limit: 4, align: 'center' }}
    rowCols={2}
/>`}
            />

            <Section
                title="Grouped and paged"
                description="Use groupBy to split records into titled groups. Pagination stays below the gallery, so navigation never competes with the asset grid."
                preview={<Gallery body={galleryBody} Header="Grouped by category" groupBy="-" pagination={{ limit: 2, align: 'center' }} rowCols={2} />}
                code={`import { Gallery } from 'react-firestrap';

<Gallery
    body={records}
    Header="Grouped by category"
    groupBy="-"
    pagination={{ limit: 2, align: 'center' }}
    rowCols={2}
/>`}
            />

            <PropsTable props={GALLERY_PROPS} />
        </PageLayout>
    );
}
