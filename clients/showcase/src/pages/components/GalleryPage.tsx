import React from 'react';
import { ActionButton, Gallery, Modal, buttonOutlineSecondaryClass, buttonPrimaryClass, useDataProvider } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

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
}));

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
    { name: 'sortable', type: 'boolean | OrderConfig', description: 'Gallery has no sortable header UI, but you can pass an OrderConfig object to sort the incoming record set before rendering.', control: 'json' },
    { name: 'overlays', type: 'GalleryOverlay[]', description: 'Overlay rules based on position and record filters', control: 'json' },
    { name: 'onClick', type: '(record) => void', description: 'Called with the clicked record' },
    { name: 'onSelectionChange', type: `(selection: ${GALLERY_SELECTION_STATE_TYPE}) => void`, description: 'Called whenever selected items change. When provided, selection checkboxes appear automatically.' },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection state shared with external bulk commands.' },
    { name: 'pagination', type: 'PaginationParams', description: 'Shared pagination config', control: 'json' },
    { name: 'gutterSize', type: '0 | 1 | 2 | 3 | 4 | 5', description: 'Item padding size', control: 'number', min: 0, max: 5 },
    { name: 'rowCols', type: '1 | 2 | 3 | 4 | 6', description: 'Columns per row', control: 'select', options: ['1', '2', '3', '4', '6'] },
    { name: 'groupBy', type: 'string | string[]', description: 'Grouping separator or separators', control: 'text' },
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

    const playgroundBody = React.useMemo(() => sourceAssets.map((asset) => ({
        ...asset,
        img: <img src={svgAsset(asset.name, asset.color, asset.accent)} alt={asset.name} />,
    })), [sourceAssets]);

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
                        records: selection.records.map((record) => record._key || record.name || 'record'),
                        hasSelection: selection.hasSelection,
                    });
                }) : undefined}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                gutterSize={Number(p.gutterSize) as any}
                rowCols={Number(p.rowCols) as any}
                groupBy={p.groupBy || undefined}
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
                description="Grouping still works on top of the sorted record set. Pagination remains delegated to the shared Pagination component."
                preview={
                    <Gallery
                        body={body}
                        Header="Grouped by first space"
                        sortable={{ field: 'category', dir: 'asc' }}
                        groupBy=" "
                        pagination={{ limit: 2, align: 'center', sticky: false }}
                        rowCols={2}
                    />
                }
                code={`<Gallery
  body={records}
  sortable={{ field: 'category', dir: 'asc' }}
  groupBy=" "
  pagination={{ limit: 2, align: 'center', sticky: false }}
  rowCols={2}
/>`}
            />

            <PropsTable props={GALLERY_PROPS} />
        </PageLayout>
    );
}
