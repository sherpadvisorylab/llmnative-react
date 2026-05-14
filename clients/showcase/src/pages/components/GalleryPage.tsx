import React from 'react';
import { Badge, DataProvider, Gallery, MockDataProvider, useDataProvider } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

type GalleryMockAsset = {
    name: string;
    color: string;
    category?: string;
    width?: number;
    height?: number;
};

const GALLERY_ASSETS_SEED: Record<string, GalleryMockAsset> = {
    hero: { name: 'Brand - Hero', color: '2563eb', category: 'Brand', width: 240, height: 160 },
    social: { name: 'Brand - Social', color: '059669', category: 'Brand', width: 240, height: 160 },
    iconSet: { name: 'Brand - Icon set', color: '4f46e5', category: 'Brand', width: 240, height: 160 },
    palette: { name: 'Brand - Palette', color: '0f766e', category: 'Brand', width: 240, height: 160 },
    campaign: { name: 'Campaign - Launch', color: 'dc2626', category: 'Campaign', width: 240, height: 160 },
    preview: { name: 'Campaign - Preview', color: '7c3aed', category: 'Campaign', width: 240, height: 160 },
    banner: { name: 'Campaign - Banner', color: 'c2410c', category: 'Campaign', width: 240, height: 160 },
    story: { name: 'Campaign - Story', color: 'be123c', category: 'Campaign', width: 240, height: 160 },
    report: { name: 'Docs - Report', color: '0891b2', category: 'Docs', width: 240, height: 160 },
    archive: { name: 'Docs - Archive', color: 'ea580c', category: 'Docs', width: 240, height: 160 },
    guide: { name: 'Docs - Guide', color: '475569', category: 'Docs', width: 240, height: 160 },
    changelog: { name: 'Docs - Changelog', color: '9333ea', category: 'Docs', width: 240, height: 160 },
};

const PLAYGROUND_SEED = {
    '/gallery-assets': GALLERY_ASSETS_SEED,
};

function svgAsset(name: string, color: string, width = 240, height = 160) {
    const safeColor = color.replace('#', '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" rx="8" fill="#${safeColor}"/><text x="24" y="${Math.round(height / 2) + 8}" font-family="Arial" font-size="22" font-weight="600" fill="white">${name}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function recordsToGalleryBody(records: Array<GalleryMockAsset & { _key?: string }>) {
    return records.map((record) => ({
        _key: record._key,
        name: record.name,
        category: record.category,
        img: (
            <img
                src={svgAsset(record.name, record.color, record.width, record.height)}
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
    { name: 'itemTopLeft', type: 'ReactNode', description: 'Overlay content top-left', control: 'text' },
    { name: 'itemTopRight', type: 'ReactNode', description: 'Overlay content top-right', control: 'text' },
    { name: 'itemBottomLeft', type: 'ReactNode', description: 'Overlay content bottom-left', control: 'text' },
    { name: 'itemBottomRight', type: 'ReactNode', description: 'Overlay content bottom-right', control: 'text' },
    { name: 'itemMiddleLeft', type: 'ReactNode', description: 'Overlay content middle-left', control: 'text' },
    { name: 'itemMiddleRight', type: 'ReactNode', description: 'Overlay content middle-right', control: 'text' },
    { name: 'onClick', type: '(index: number) => void', description: 'Called when an item is clicked' },
    { name: 'pagination', type: 'PaginationParams', description: 'Pagination config', control: 'json' },
    { name: 'gutterSize', type: '0 | 1 | 2 | 3 | 4 | 5', description: 'Item padding size', control: 'number', min: 0, max: 5 },
    { name: 'rowCols', type: '1 | 2 | 3 | 4 | 6', description: 'Columns per row', control: 'select', options: ['1', '2', '3', '4', '6'] },
    { name: 'groupBy', type: 'string | string[]', description: 'Split images into titled groups by alt/name separator', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Content before gallery', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after gallery', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on gallery container', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'headerClass', type: 'string', description: 'CSS classes on header', control: 'text' },
    { name: 'bodyClass', type: 'string', description: 'CSS classes on body', control: 'text' },
    { name: 'footerClass', type: 'string', description: 'CSS classes on footer', control: 'text' },
    { name: 'selectedClass', type: 'string', description: 'Class applied to selected item', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: GALLERY_PROPS,
    size: 'lg',
    mockSeed: PLAYGROUND_SEED,
    defaultProps: {
        body: '[mock records]',
        recordsPath: '/gallery-assets',
        Header: 'Assets',
        Footer: '',
        itemTopLeft: '',
        itemTopRight: 'new',
        itemBottomLeft: '',
        itemBottomRight: '',
        itemMiddleLeft: '',
        itemMiddleRight: '',
        pagination: null,
        gutterSize: 2,
        rowCols: '3',
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
            itemTopLeft={p.itemTopLeft || undefined}
            itemTopRight={p.itemTopRight ? <Badge type="primary" className="badge-overlay">{p.itemTopRight}</Badge> : undefined}
            itemBottomLeft={p.itemBottomLeft || undefined}
            itemBottomRight={p.itemBottomRight || undefined}
            itemMiddleLeft={p.itemMiddleLeft || undefined}
            itemMiddleRight={p.itemMiddleRight || undefined}
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
                            itemTopRight={<Badge type="primary" className="badge-overlay">new</Badge>}
                            rowCols={3}
                            pagination={{ limit: 6, align: 'center' }}
                        />
                    </WithGalleryMock>
                }
                code={`import { Badge, Gallery, useDataProvider } from 'react-firestrap';

function GalleryFromMock({ path }) {
    const provider = useDataProvider();
    const [records, setRecords] = React.useState([]);

    provider.useListener(path, setRecords);

    return (
        <Gallery
            body={records.map((record) => ({
                name: record.name,
                img: <img src={record.src} alt={record.name} />,
            }))}
            Header="Assets"
            itemTopRight={<Badge type="primary" className="badge-overlay">new</Badge>}
            pagination={{ limit: 6, align: 'center' }}
            rowCols={3}
        />
    );
}`}
            />

            <Section
                title="Overlays and selection"
                description="Use the item overlay slots for badges, labels and quick indicators. Click handling can mark the selected item through selectedClass."
                preview={
                    <Gallery
                        body={galleryBody.slice(0, 4)}
                        Header="Selectable assets"
                        itemTopRight={<Badge type="success" className="badge-overlay">ready</Badge>}
                        itemBottomLeft={<Badge type="light" className="badge-overlay">approved</Badge>}
                        selectedClass="ring-2 ring-primary rounded-lg"
                        rowCols={2}
                        onClick={() => undefined}
                    />
                }
                code={`import { Badge, Gallery } from 'react-firestrap';

<Gallery
    body={records}
    Header="Selectable assets"
    itemTopRight={<Badge type="success" className="badge-overlay">ready</Badge>}
    itemBottomLeft={<Badge type="light" className="badge-overlay">approved</Badge>}
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
