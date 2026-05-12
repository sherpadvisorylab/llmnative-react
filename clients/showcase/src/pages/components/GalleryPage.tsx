import React from 'react';
import { Badge, Gallery } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const galleryBody = ['2563eb', '059669', 'dc2626', '7c3aed'].map((color, index) => ({
    name: `Asset ${index + 1}`,
    img: (
        <img
            src={`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"%3E%3Crect width="240" height="160" fill="%23${color}"/%3E%3Ctext x="24" y="90" font-family="Arial" font-size="24" fill="white"%3EAsset ${index + 1}%3C/text%3E%3C/svg%3E`}
            alt={`Asset ${index + 1}`}
        />
    ),
}));

const GALLERY_PROPS: PropDef[] = [
    { name: 'body', type: 'GalleryRecord[]', description: 'Records containing img or thumbnail data', control: 'json', readOnly: true },
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
    { name: 'groupBy', type: 'string | string[]', description: 'Group images into carousels by alt split rule', control: 'text' },
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
    defaultProps: {
        body: '[sample records]',
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
        <Gallery
            body={galleryBody}
            Header={p.Header || undefined}
            Footer={p.Footer || undefined}
            itemTopLeft={p.itemTopLeft || undefined}
            itemTopRight={p.itemTopRight ? <Badge type="primary">{p.itemTopRight}</Badge> : undefined}
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
                title="Asset gallery"
                preview={<Gallery body={galleryBody} Header="Assets" itemTopRight={<Badge type="primary">new</Badge>} rowCols={3} />}
                code={`import { Badge, Gallery } from 'react-firestrap';

<Gallery
    body={records}
    Header="Assets"
    itemTopRight={<Badge type="primary">new</Badge>}
    rowCols={3}
/>`}
            />

            <PropsTable props={GALLERY_PROPS} />
        </PageLayout>
    );
}
