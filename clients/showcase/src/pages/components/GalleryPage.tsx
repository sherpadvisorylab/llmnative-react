import React from 'react';
import { ActionButton, Gallery, Modal, buttonOutlineSecondaryClass, buttonPrimaryClass, useDataProvider } from '@llmnative/react';
import type { GalleryRecord } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

type GalleryAsset = {
    _key: string;
    name: string;
    category: string;
    status: 'ready' | 'draft' | 'review';
    color: string;
    accent: string;
};

const ASSETS: GalleryAsset[] = [
    { _key: 'hero', name: 'Brand Hero', category: 'Brand', status: 'ready', color: '2563eb', accent: '38bdf8' },
    { _key: 'social', name: 'Brand Social', category: 'Brand', status: 'ready', color: '059669', accent: 'a7f3d0' },
    { _key: 'iconset', name: 'Brand Icon Set', category: 'Brand', status: 'review', color: '4f46e5', accent: 'c4b5fd' },
    { _key: 'launch', name: 'Campaign Launch', category: 'Campaign', status: 'review', color: 'dc2626', accent: 'fecaca' },
    { _key: 'banner', name: 'Campaign Banner', category: 'Campaign', status: 'ready', color: 'c2410c', accent: 'fed7aa' },
    { _key: 'guide', name: 'Docs Guide', category: 'Docs', status: 'draft', color: '475569', accent: 'cbd5e1' },
];

function svgAsset(name: string, color: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#${color}"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><rect width="320" height="220" rx="18" fill="url(#g)"/><circle cx="256" cy="54" r="34" fill="#${accent}" opacity=".36"/><rect x="22" y="24" width="170" height="10" rx="5" fill="#fff" opacity=".22"/><rect x="22" y="164" width="220" height="16" rx="8" fill="#fff" opacity=".18"/><rect x="22" y="188" width="148" height="10" rx="5" fill="#fff" opacity=".26"/><text x="22" y="118" font-family="Arial" font-size="24" font-weight="700" fill="white">${name}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const body = ASSETS.map((asset) => ({
    ...asset,
    img: <img src={svgAsset(asset.name, asset.color, asset.accent)} alt={asset.name} />,
})) as unknown as GalleryRecord[];

const GALLERY_PLAYGROUND_PATH = '/gallery-assets';

const GALLERY_PLAYGROUND_SEED = {
    [GALLERY_PLAYGROUND_PATH]: Object.fromEntries(
        ASSETS.map(({ _key, ...record }) => [_key, record])
    ),
};

const GALLERY_SELECTION_STATE_TYPE = `{
  keys: string[];
  records: GalleryRecord[];
  clear: () => void;
  hasSelection: boolean;
}`;

const GALLERY_PROPS: PropDef[] = [
    { name: 'body', type: 'GalleryRecord[]', description: 'Records containing img or thumbnail data', control: 'json', readOnly: true },
    { name: 'Header', type: 'ReactNode', description: 'Header content above gallery', control: 'text' },
    { name: 'Footer', type: 'ReactNode', description: 'Footer content below gallery', control: 'text' },
    { name: 'sortable', type: 'boolean | OrderConfig', description: 'Gallery has no sortable header UI, but you can pass an OrderConfig object to sort the incoming record set before rendering.', control: 'json', rows: 4, shortcuts: [
        { label: 'false', value: false, help: 'Disable client sorting.' },
        { label: 'name asc', value: { field: 'name', dir: 'asc' }, help: 'Sort by name ascending.' },
        { label: 'status desc', value: { field: 'status', dir: 'desc' }, help: 'Sort by status descending.' },
    ], typeDetails: `boolean | {
  field: string;
  dir: "asc" | "desc";
}` },
    { name: 'overlays', type: 'GalleryOverlay[]', description: 'Overlay rules based on position and record filters', control: 'json', rows: 8, shortcuts: [
        { label: 'none', value: [], help: 'No overlays.' },
        { label: 'status', value: [
            { position: 'topRight', badge: { content: 'new', type: 'primary' }, className: 'uppercase' },
            { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
        ], help: 'Status-oriented overlays.' },
        { label: 'brand', value: [
            { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
        ], help: 'Category-based brand badge.' },
    ], typeDetails: `Array<{
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  badge: ReactNode | { content: ReactNode; type?: string };
  when?: Record<string, unknown>;
  className?: string;
}>` },
    { name: 'onClick', type: '(record) => void', description: 'Called with the clicked record' },
    {
        name: 'onSelectionChange',
        type: 'GallerySelectionChangeHandler',
        description: 'Called whenever selected items change. When provided, selection checkboxes appear automatically.',
        shape: `type GallerySelectionChangeHandler = (
  selection: GallerySelectionState
) => void

type GallerySelectionState = ${GALLERY_SELECTION_STATE_TYPE}`,
    },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection state shared with external bulk commands.' },
    { name: 'pagination', type: 'PaginationParams', description: 'Shared pagination config', control: 'json', rows: 6, shortcuts: [
        { label: 'default', value: { page: 1, limit: 4, navLimit: 5, align: 'center', sticky: false, scrollToTopOnChange: false, scrollBehavior: 'smooth' }, help: 'Centered default pagination.' },
        { label: 'compact', value: { page: 1, limit: 2, navLimit: 3, align: 'start', sticky: false, scrollToTopOnChange: false, scrollBehavior: 'smooth' }, help: 'Smaller pages and nav.' },
        { label: 'sticky', value: { page: 1, limit: 4, navLimit: 5, align: 'center', sticky: 'bottom', scrollToTopOnChange: false, scrollBehavior: 'smooth' }, help: 'Sticky bottom controls.' },
    ] },
    { name: 'gutterSize', type: '0 | 1 | 2 | 3 | 4 | 5', description: 'Item padding size', control: 'number', min: 0, max: 5 },
    { name: 'rowCols', type: '1 | 2 | 3 | 4 | 6', description: 'Columns per row', control: 'select', options: ['1', '2', '3', '4', '6'] },
    {
        name: 'groupBy',
        type: 'string | string[]',
        description: 'Group cards by a field name. Records with the same field value are rendered inside the same section. Pass an array for multi-level grouping.',
        control: 'textarea',
        textareaMode: 'text',
        rows: 1,
        placeholder: 'e.g. category or ["category","status"]',
        shortcuts: [
            { label: 'off', value: '', help: 'No grouping.' },
            { label: 'category', value: 'category', help: 'Group by category.' },
            { label: 'status', value: 'status', help: 'Group by status.' },
            { label: 'cat+status', value: ['category', 'status'], help: 'Multi-level: category then status.' },
        ],
    },
    { name: 'selectedClass', type: 'string', description: 'Class applied to the active item', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: GALLERY_PROPS,
    size: 'fullscreen',
    layout: 'split',
    mockSeed: GALLERY_PLAYGROUND_SEED,
    defaultProps: {
        Header: 'Assets',
        Footer: '',
        sortable: { field: 'name', dir: 'asc' },
        overlays: [
            { position: 'topRight', badge: { content: 'new', type: 'primary' }, className: 'uppercase' },
            { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
            { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
        ],
        pagination: { page: 1, limit: 4, navLimit: 5, align: 'center', sticky: false, scrollToTopOnChange: false, scrollBehavior: 'smooth' },
        gutterSize: 2,
        rowCols: '2',
        groupBy: '',
        selectedClass: '',
    },
    render: (p) => <GalleryPlaygroundPreview p={p} />,
};

function GalleryPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const provider = useDataProvider();
    const [sourceAssets, setSourceAssets] = React.useState<Array<Record<string, any>>>(ASSETS);
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
                try { return JSON.parse(trimmed) as string[]; } catch { /* fall through */ }
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
                        <div className="text-sm font-medium">Multi checkbox</div>
                        <div className="text-xs text-muted-foreground">Enable selection to inspect the onSelectionChange payload live in the gallery preview.</div>
                    </div>
                    <ActionButton
                        className={`${selectionEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} btn-sm`}
                        label={selectionEnabled ? 'Disable multi checkbox' : 'Enable multi checkbox'}
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
                body={playgroundBody}
                Header={p.Header || undefined}
                Footer={p.Footer || undefined}
                sortable={p.sortable}
                overlays={Array.isArray(p.overlays) ? p.overlays : undefined}
                selectedKeys={selectionEnabled ? playgroundSelectedKeys : undefined}
                onSelectionChange={selectionEnabled ? ((selection) => {
                    setPlaygroundSelectedKeys(selection.keys);
                    setSelectionPayload({
                        keys: selection.keys,
                        records: selection.records.map((record) => String(record._key || record.name || 'record')),
                        hasSelection: selection.hasSelection,
                    });
                }) : undefined}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                gutterSize={Number(p.gutterSize) as any}
                rowCols={Number(p.rowCols) as any}
                groupBy={groupBy}
                selectedClass={p.selectedClass || undefined}
            />
            <div className="rounded-md border bg-muted/40 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onSelectionChange payload</div>
                <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                    {selectionEnabled
                        ? JSON.stringify(selectionPayload ?? {
                            keys: playgroundSelectedKeys,
                            records: [],
                            hasSelection: playgroundSelectedKeys.length > 0,
                        }, null, 2)
                        : 'Enable multi checkbox above, then select cards to see the callback payload here.'}
                </pre>
            </div>
        </div>
    );
}

export default function GalleryPage() {
    usePlayground(PLAYGROUND, 'Gallery');
    const [selected, setSelected] = React.useState<string>('');
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState(body.slice(0, 0));
    const [exportOpen, setExportOpen] = React.useState(false);

    return (
        <PageLayout title="Gallery" description="Visual record gallery with shared sorting support, overlays, selection and pagination.">
            <Section
                title="Sorted gallery"
                description="Gallery accepts the same sortable contract as Grid and Table. It sorts incoming records before rendering, without needing a header UI."
                preview={
                    <Gallery
                        body={body}
                        Header="Assets"
                        sortable={{ field: 'name', dir: 'asc' }}
                        overlays={[
                            { position: 'topRight', badge: { content: 'new', type: 'primary' }, className: 'uppercase' },
                            { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
                            { position: 'bottomRight', badge: { content: 'review', type: 'warning' }, when: { status: 'review' } },
                        ]}
                        pagination={{ limit: 4, align: 'center', sticky: false }}
                        rowCols={2}
                    />
                }
                code={`<Gallery
  body={records}
  Header="Assets"
  sortable={{ field: 'name', dir: 'asc' }}
  overlays={[
    { position: 'topRight', badge: { content: 'new', type: 'primary' } },
    { position: 'bottomLeft', badge: { content: 'brand', type: 'success' }, when: { category: 'Brand' } },
  ]}
  pagination={{ limit: 4, align: 'center', sticky: false }}
  rowCols={2}
/>`}
            />

            <Section
                title="Record click"
                description="onClick now receives the clicked record, so consumers can use record._key directly."
                preview={
                    <div className="space-y-3">
                        <Gallery
                            body={body.slice(0, 4)}
                            Header="Selectable assets"
                            onClick={(record) => setSelected(record._key || '')}
                            selectedClass="ring-2 ring-primary rounded-lg"
                            rowCols={2}
                        />
                        <div className="text-xs text-muted-foreground">
                            Selected key: <span className="font-mono">{selected || 'none'}</span>
                        </div>
                    </div>
                }
                code={`const [selected, setSelected] = useState('');

<Gallery
  body={records}
  onClick={(record) => setSelected(record._key || '')}
  selectedClass="ring-2 ring-primary rounded-lg"
/>`}
            />

            <Section
                title="Bulk selection"
                description="Gallery now mirrors Table semantics: selectedKeys controls selection, and onSelectionChange exposes the selected records. External bulk commands stay outside the component."
                preview={
                    <div className="space-y-3">
                        <Gallery
                            body={body.slice(0, 4)}
                            Header={(
                                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                    <span className="text-muted-foreground">
                                        {selectedKeys.length ? `${selectedKeys.length} selected` : 'Select assets to enable external bulk commands'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} btn-sm`}
                                            label="Export"
                                            disabled={!selectedKeys.length}
                                            onClick={() => setExportOpen(true)}
                                        />
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} btn-sm`}
                                            label="Clear"
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
                            rowCols={2}
                        />
                        {exportOpen && (
                            <Modal
                                title="Selected gallery items"
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
  body={records}
  Header={(
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
  rowCols={2}
/>`}
            />

            <Section
                title="Grouped and paged"
                description="Pass a field name to groupBy to group cards into labelled sections. Pairing it with sortable on the same field clusters records naturally. Pass an array for multi-level grouping."
                preview={
                    <Gallery
                        body={body}
                        Header="Assets by category"
                        sortable={{ field: 'category', dir: 'asc' }}
                        groupBy="category"
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                        rowCols={2}
                    />
                }
                code={`<Gallery
  body={records}
  sortable={{ field: 'category', dir: 'asc' }}
  groupBy="category"
  pagination={{ limit: 3, align: 'center', sticky: false }}
  rowCols={2}
/>

// Multi-level grouping
<Gallery
  body={records}
  sortable={{ field: 'category', dir: 'asc' }}
  groupBy={['category', 'status']}
  rowCols={2}
/>`}
            />

            <PropDocsTable props={GALLERY_PROPS} />
        </PageLayout>
    );
}
