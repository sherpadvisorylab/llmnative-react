import React from 'react';
import { ActionButton, Gallery, Modal, buttonOutlineSecondaryClass, buttonPrimaryClass, useDataProvider } from '@llmnative/react';
import type { GalleryRecord } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseGalleryI18n } from '../../showcase/i18n';

type GalleryAsset = {
    _key: string;
    name: string;
    category: string;
    status: 'ready' | 'draft' | 'review';
    color: string;
    accent: string;
};

const GALLERY_PLAYGROUND_PATH = '/gallery-assets';

const GALLERY_SELECTION_STATE_TYPE = `{
  keys: string[];
  records: GalleryRecord[];
  clear: () => void;
  hasSelection: boolean;
}`;

const ASSET_DEFS = [
    { _key: 'hero', nameKey: 'hero', categoryKey: 'brand', statusKey: 'ready', color: '2563eb', accent: '38bdf8' },
    { _key: 'social', nameKey: 'social', categoryKey: 'brand', statusKey: 'ready', color: '059669', accent: 'a7f3d0' },
    { _key: 'iconset', nameKey: 'iconset', categoryKey: 'brand', statusKey: 'review', color: '4f46e5', accent: 'c4b5fd' },
    { _key: 'launch', nameKey: 'launch', categoryKey: 'campaign', statusKey: 'review', color: 'dc2626', accent: 'fecaca' },
    { _key: 'banner', nameKey: 'banner', categoryKey: 'campaign', statusKey: 'ready', color: 'c2410c', accent: 'fed7aa' },
    { _key: 'guide', nameKey: 'guide', categoryKey: 'docs', statusKey: 'draft', color: '475569', accent: 'cbd5e1' },
] as const;

function svgAsset(name: string, color: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${color}"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="320" height="220" rx="18" fill="url(#g)"/><circle cx="256" cy="54" r="34" fill="#${accent}" opacity=".36"/><rect x="22" y="24" width="170" height="10" rx="5" fill="#fff" opacity=".22"/><rect x="22" y="164" width="220" height="16" rx="8" fill="#fff" opacity=".18"/><rect x="22" y="188" width="148" height="10" rx="5" fill="#fff" opacity=".26"/><text x="22" y="118" font-family="Arial" font-size="24" font-weight="700" fill="white">${name}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

type GalleryI18n = ReturnType<typeof useShowcaseGalleryI18n>;

function buildAssets(t: GalleryI18n): GalleryAsset[] {
    return ASSET_DEFS.map((asset) => ({
        _key: asset._key,
        name: t.values.assetNames[asset.nameKey],
        category: t.values.categories[asset.categoryKey],
        status: asset.statusKey,
        color: asset.color,
        accent: asset.accent,
    }));
}

function toGalleryRecords(assets: GalleryAsset[]) {
    return assets.map((asset) => ({
        ...asset,
        img: <img src={svgAsset(asset.name, asset.color, asset.accent)} alt={asset.name} />,
    })) as unknown as GalleryRecord[];
}

function GalleryPlaygroundPreview({
    p,
    t,
    seedAssets,
}: {
    p: Record<string, any>;
    t: GalleryI18n;
    seedAssets: GalleryAsset[];
}) {
    const provider = useDataProvider();
    const [sourceAssets, setSourceAssets] = React.useState<Array<Record<string, any>>>(seedAssets);
    const [selectionEnabled, setSelectionEnabled] = React.useState(false);
    const [playgroundSelectedKeys, setPlaygroundSelectedKeys] = React.useState<string[]>([]);
    const [selectionPayload, setSelectionPayload] = React.useState<{ keys: string[]; records: string[]; hasSelection: boolean } | null>(null);

    React.useEffect(() => {
        return provider.subscribe(GALLERY_PLAYGROUND_PATH, setSourceAssets);
    }, [provider]);

    const playgroundBody = React.useMemo(() => (sourceAssets.map((asset) => ({
        ...asset,
        img: <img src={svgAsset(asset.name, asset.color, asset.accent)} alt={asset.name} />,
    })) as unknown as GalleryRecord[]), [sourceAssets]);

    const groupBy: string | string[] | undefined = (() => {
        const val = p.groupBy;
        if (!val) return undefined;
        if (Array.isArray(val)) return (val as string[]).length > 0 ? val as string[] : undefined;
        if (typeof val === 'string') {
            const trimmed = val.trim();
            if (!trimmed) return undefined;
            if (trimmed.startsWith('[')) {
                try { return JSON.parse(trimmed) as string[]; } catch { }
            }
            return trimmed;
        }
        return undefined;
    })();

    return (
        <div className="min-w-0 space-y-3">
            <div className="rounded-md border bg-muted/30 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-medium">{t.labels.multiCheckbox}</div>
                        <div className="text-xs text-muted-foreground">{t.labels.enableSelectionHelp}</div>
                    </div>
                    <ActionButton
                        className={`${selectionEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                        label={selectionEnabled ? t.labels.disableMultiCheckbox : t.labels.enableMultiCheckbox}
                        onClick={() => {
                            setSelectionEnabled((current) => {
                                const next = !current;
                                setPlaygroundSelectedKeys([]);
                                setSelectionPayload(null);
                                return next;
                            });
                        }}
                    />
                </div>
            </div>
            <Gallery
                records={playgroundBody}
                header={p.header || undefined}
                footer={p.footer || undefined}
                sortable={p.sortable}
                overlays={Array.isArray(p.overlays) ? p.overlays : undefined}
                selectedKeys={selectionEnabled ? playgroundSelectedKeys : undefined}
                onSelectionChange={selectionEnabled ? ((selection) => {
                    setPlaygroundSelectedKeys(selection.keys);
                    setSelectionPayload({
                        keys: selection.keys,
                        records: selection.records.map((record) => String(record._key || record.name || t.labels.record)),
                        hasSelection: selection.hasSelection,
                    });
                }) : undefined}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                gap={Number(p.gap) as 0 | 1 | 2 | 3 | 4 | 5}
                columns={Number(p.columns) as 1 | 2 | 3 | 4 | 6}
                groupBy={groupBy}
                selectedClassName={p.selectedClassName || undefined}
            />
            <div className="rounded-md border bg-muted/40 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.labels.onSelectionPayload}</div>
                <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                    {selectionEnabled
                        ? JSON.stringify(selectionPayload ?? {
                            keys: playgroundSelectedKeys,
                            records: [],
                            hasSelection: playgroundSelectedKeys.length > 0,
                        }, null, 2)
                        : t.labels.payloadEmptyHint}
                </pre>
            </div>
        </div>
    );
}

export default function GalleryPage() {
    const t = useShowcaseGalleryI18n();

    const assets = React.useMemo(() => buildAssets(t), [t]);
    const body = React.useMemo(() => toGalleryRecords(assets), [assets]);

    const galleryProps = React.useMemo<PropDef[]>(() => [
        { name: 'records', type: 'GalleryRecord[]', description: t.propsDocs.items.records.description, control: 'json', readOnly: true },
        { name: 'header', type: 'ReactNode', description: t.propsDocs.items.header.description, control: 'text' },
        { name: 'footer', type: 'ReactNode', description: t.propsDocs.items.footer.description, control: 'text' },
        { name: 'sortable', type: 'boolean | OrderConfig', description: t.propsDocs.items.sortable.description, control: 'json', rows: 4, shortcuts: [
            { label: t.propsDocs.items.sortable.shortcuts?.false.label || 'false', value: false, help: t.propsDocs.items.sortable.shortcuts?.false.help },
            { label: t.propsDocs.items.sortable.shortcuts?.nameAsc.label || 'name asc', value: { field: 'name', dir: 'asc' }, help: t.propsDocs.items.sortable.shortcuts?.nameAsc.help },
            { label: t.propsDocs.items.sortable.shortcuts?.statusDesc.label || 'status desc', value: { field: 'status', dir: 'desc' }, help: t.propsDocs.items.sortable.shortcuts?.statusDesc.help },
        ], typeDetails: `boolean | {
  field: string;
  dir: "asc" | "desc";
}` },
        { name: 'overlays', type: 'GalleryOverlay[]', description: t.propsDocs.items.overlays.description, control: 'json', rows: 8, shortcuts: [
            { label: t.propsDocs.items.overlays.shortcuts?.none.label || 'none', value: [], help: t.propsDocs.items.overlays.shortcuts?.none.help },
            { label: t.propsDocs.items.overlays.shortcuts?.status.label || 'status', value: [
                { position: 'topRight', badge: { content: t.labels.newBadge, type: 'primary' }, className: 'uppercase' },
                { position: 'bottomRight', badge: { content: t.labels.reviewBadge, type: 'warning' }, when: { status: 'review' } },
            ], help: t.propsDocs.items.overlays.shortcuts?.status.help },
            { label: t.propsDocs.items.overlays.shortcuts?.brand.label || 'brand', value: [
                { position: 'bottomLeft', badge: { content: t.labels.brandBadge, type: 'success' }, when: { category: t.values.categories.brand } },
            ], help: t.propsDocs.items.overlays.shortcuts?.brand.help },
        ], typeDetails: `Array<{
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  badge: ReactNode | { content: ReactNode; type?: string };
  when?: Record<string, unknown>;
  className?: string;
}>` },
        { name: 'onRowClick', type: '(record: GalleryRecord) => void', description: t.propsDocs.items.onRowClick.description },
        {
            name: 'onSelectionChange',
            type: 'GallerySelectionChangeHandler',
            description: t.propsDocs.items.onSelectionChange.description,
            shape: `type GallerySelectionChangeHandler = (
  selection: GallerySelectionState
) => void

type GallerySelectionState = ${GALLERY_SELECTION_STATE_TYPE}`,
        },
        { name: 'selectedKeys', type: 'string[]', description: t.propsDocs.items.selectedKeys.description },
        { name: 'pagination', type: 'PaginationParams', description: t.propsDocs.items.pagination.description, control: 'json', rows: 6, shortcuts: [
            { label: t.propsDocs.items.pagination.shortcuts?.default.label || 'default', value: { page: 1, limit: 4, maxPageButtons: 5, align: 'center', sticky: false, scrollToTopOnChange: false, scrollBehavior: 'smooth' }, help: t.propsDocs.items.pagination.shortcuts?.default.help },
            { label: t.propsDocs.items.pagination.shortcuts?.compact.label || 'compact', value: { page: 1, limit: 2, maxPageButtons: 3, align: 'start', sticky: false, scrollToTopOnChange: false, scrollBehavior: 'smooth' }, help: t.propsDocs.items.pagination.shortcuts?.compact.help },
            { label: t.propsDocs.items.pagination.shortcuts?.sticky.label || 'sticky', value: { page: 1, limit: 4, maxPageButtons: 5, align: 'center', sticky: 'bottom', scrollToTopOnChange: false, scrollBehavior: 'smooth' }, help: t.propsDocs.items.pagination.shortcuts?.sticky.help },
        ] },
        { name: 'gap', type: '0 | 1 | 2 | 3 | 4 | 5', description: t.propsDocs.items.gap.description, control: 'number', min: 0, max: 5 },
        { name: 'columns', type: '1 | 2 | 3 | 4 | 6', description: t.propsDocs.items.columns.description, control: 'select', options: ['1', '2', '3', '4', '6'] },
        {
            name: 'groupBy',
            type: 'string | string[]',
            description: t.propsDocs.items.groupBy.description,
            control: 'textarea',
            textareaMode: 'text',
            rows: 1,
            placeholder: t.propsDocs.items.groupBy.placeholder,
            shortcuts: [
                { label: t.propsDocs.items.groupBy.shortcuts?.off.label || 'off', value: '', help: t.propsDocs.items.groupBy.shortcuts?.off.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.category.label || 'category', value: 'category', help: t.propsDocs.items.groupBy.shortcuts?.category.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.status.label || 'status', value: 'status', help: t.propsDocs.items.groupBy.shortcuts?.status.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.catStatus.label || 'cat+status', value: ['category', 'status'], help: t.propsDocs.items.groupBy.shortcuts?.catStatus.help },
            ],
        },
        { name: 'scrollToTopOnChange', type: 'boolean', description: t.propsDocs.items.scrollToTopOnChange.description, control: 'boolean' },
        { name: 'scrollBehavior', type: '"auto" | "instant" | "smooth"', description: t.propsDocs.items.scrollBehavior.description, control: 'select', options: ['auto', 'instant', 'smooth'] },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'scrollClassName', type: 'string', description: t.propsDocs.items.scrollClassName.description, control: 'text' },
        { name: 'headerClassName', type: 'string', description: t.propsDocs.items.headerClassName.description, control: 'text' },
        { name: 'bodyClassName', type: 'string', description: t.propsDocs.items.bodyClassName.description, control: 'text' },
        { name: 'footerClassName', type: 'string', description: t.propsDocs.items.footerClassName.description, control: 'text' },
        { name: 'selectedClassName', type: 'string', description: t.propsDocs.items.selectedClassName.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: galleryProps,
        size: 'fullscreen',
        layout: 'split',
        mockSeed: {
            [GALLERY_PLAYGROUND_PATH]: Object.fromEntries(assets.map(({ _key, ...record }) => [_key, record])),
        },
        defaultProps: {
            header: t.labels.assets,
            footer: '',
            sortable: { field: 'name', dir: 'asc' },
            overlays: [
                { position: 'topRight', badge: { content: t.labels.newBadge, type: 'primary' }, className: 'uppercase' },
                { position: 'bottomLeft', badge: { content: t.labels.brandBadge, type: 'success' }, when: { category: t.values.categories.brand } },
                { position: 'bottomRight', badge: { content: t.labels.reviewBadge, type: 'warning' }, when: { status: 'review' } },
            ],
            pagination: { page: 1, limit: 4, maxPageButtons: 5, align: 'center', sticky: false, scrollToTopOnChange: false, scrollBehavior: 'smooth' },
            gap: 2,
            columns: '2',
            groupBy: '',
            selectedClassName: '',
        },
        render: (p) => <GalleryPlaygroundPreview p={p} t={t} seedAssets={assets} />,
    }), [assets, galleryProps, t]);

    usePlayground(playground, t.playground.title);

    const [selected, setSelected] = React.useState<string>('');
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<GalleryRecord[]>([]);
    const [exportOpen, setExportOpen] = React.useState(false);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.sortedGallery.title}
                description={t.sections.sortedGallery.description}
                preview={
                    <Gallery
                        records={body}
                        header={t.labels.assets}
                        sortable={{ field: 'name', dir: 'asc' }}
                        overlays={[
                            { position: 'topRight', badge: { content: t.labels.newBadge, type: 'primary' }, className: 'uppercase' },
                            { position: 'bottomLeft', badge: { content: t.labels.brandBadge, type: 'success' }, when: { category: t.values.categories.brand } },
                            { position: 'bottomRight', badge: { content: t.labels.reviewBadge, type: 'warning' }, when: { status: 'review' } },
                        ]}
                        pagination={{ limit: 4, align: 'center', sticky: false }}
                        columns={2}
                    />
                }
                code={`<Gallery
  records={records}
  header="Assets"
  sortable={{ field: 'name', dir: 'asc' }}
  overlays={[
    { position: 'topRight', badge: { content: 'new', type: 'primary' } },
    { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
  ]}
  pagination={{ limit: 4, align: 'center', sticky: false }}
  columns={2}
/>`}
            />

            <Section
                title={t.sections.recordClick.title}
                description={t.sections.recordClick.description}
                preview={
                    <div className="space-y-3">
                        <Gallery
                            records={body.slice(0, 4)}
                            header={t.labels.selectableAssets}
                            onRowClick={(record) => setSelected(record._key || '')}
                            selectedClassName="ring-2 ring-primary rounded-lg"
                            columns={2}
                        />
                        <div className="text-xs text-muted-foreground">
                            {t.labels.selectedKey}: <span className="font-mono">{selected || t.labels.none}</span>
                        </div>
                    </div>
                }
                code={`const [selected, setSelected] = useState('');

<Gallery
  records={records}
  onRowClick={(record) => setSelected(record._key || '')}
  selectedClassName="ring-2 ring-primary rounded-lg"
/>`}
            />

            <Section
                title={t.sections.bulkSelection.title}
                description={t.sections.bulkSelection.description}
                preview={
                    <div className="space-y-3">
                        <Gallery
                            records={body.slice(0, 4)}
                            header={(
                                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                    <span className="text-muted-foreground">
                                        {selectedKeys.length ? `${selectedKeys.length} ${t.labels.selectedCount}` : t.labels.selectAssetsToEnableBulk}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                                            label={t.labels.export}
                                            disabled={!selectedKeys.length}
                                            onClick={() => setExportOpen(true)}
                                        />
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                                            label={t.labels.clear}
                                            disabled={!selectedKeys.length}
                                            onClick={() => {
                                                setSelectedKeys([]);
                                                setSelectedRecords([]);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            selectedKeys={selectedKeys}
                            onSelectionChange={(selection) => {
                                setSelectedKeys(selection.keys);
                                setSelectedRecords(selection.records);
                            }}
                            columns={2}
                        />
                        {exportOpen && (
                            <Modal
                                title={t.labels.selectedGalleryItems}
                                size="lg"
                                onClose={() => setExportOpen(false)}
                            >
                                <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                                    {JSON.stringify(selectedRecords, null, 2)}
                                </pre>
                            </Modal>
                        )}
                    </div>
                }
                code={`const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<GalleryRecord[]>([]);
const [exportOpen, setExportOpen] = useState(false);

<Gallery
  records={records}
  header={(
    <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
      <span>
        {selectedKeys.length ? \`\${selectedKeys.length} selected\` : 'Select assets to enable external bulk commands'}
      </span>
      <div className="flex items-center gap-2">
        <button disabled={!selectedKeys.length} onClick={() => setExportOpen(true)}>Export</button>
        <button disabled={!selectedKeys.length} onClick={() => {
          setSelectedKeys([]);
          setSelectedRecords([]);
        }}>Clear</button>
      </div>
    </div>
  )}
  selectedKeys={selectedKeys}
  onSelectionChange={(selection) => {
    setSelectedKeys(selection.keys);
    setSelectedRecords(selection.records);
  }}
  columns={2}
/>`}
            />

            <Section
                title={t.sections.groupedPaged.title}
                description={t.sections.groupedPaged.description}
                preview={
                    <Gallery
                        records={body}
                        header={t.labels.assetsByCategory}
                        sortable={{ field: 'category', dir: 'asc' }}
                        groupBy="category"
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                        columns={2}
                    />
                }
                code={`<Gallery
  records={records}
  sortable={{ field: 'category', dir: 'asc' }}
  groupBy="category"
  pagination={{ limit: 3, align: 'center', sticky: false }}
  columns={2}
/>

// Multi-level grouping
<Gallery
  records={records}
  sortable={{ field: 'category', dir: 'asc' }}
  groupBy={['category', 'status']}
  columns={2}
/>`}
            />

            <PropDocsTable props={galleryProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
