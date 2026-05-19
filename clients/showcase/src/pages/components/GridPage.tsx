import React from 'react';
import {
    Badge,
    DataProvider,
    Email,
    Grid,
    MockDataProvider,
    Modal,
    Select,
    String as TextField,
    useDataProvider,
} from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

type UserSeedRecord = {
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive' | 'review';
    team: string;
    city: string;
};

const USERS_SEED: Record<string, UserSeedRecord> = {
    u1: { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', city: 'Milan' },
    u2: { name: 'Mark Williams', email: 'mark@example.com', role: 'editor', status: 'active', team: 'Marketing', city: 'Berlin' },
    u3: { name: 'Sara Green', email: 'sara@example.com', role: 'viewer', status: 'inactive', team: 'Support', city: 'Madrid' },
    u4: { name: 'Luke Black', email: 'luke@example.com', role: 'editor', status: 'active', team: 'Product', city: 'Remote' },
    u5: { name: 'Julia Brown', email: 'julia@example.com', role: 'admin', status: 'inactive', team: 'Operations', city: 'Rome' },
    u6: { name: 'Noah White', email: 'noah@example.com', role: 'viewer', status: 'active', team: 'Support', city: 'Paris' },
    u7: { name: 'Emma Stone', email: 'emma@example.com', role: 'editor', status: 'review', team: 'Content', city: 'Amsterdam' },
    u8: { name: 'Chris Miller', email: 'chris@example.com', role: 'admin', status: 'active', team: 'Platform', city: 'London' },
};

const GRID_PLAYGROUND_PATH = '/grid-users';

const GRID_PLAYGROUND_SEED = {
    [GRID_PLAYGROUND_PATH]: USERS_SEED,
    'components/grid': USERS_SEED,
};

const statusClass = (status: string) => (
    status === 'active'
        ? 'bg-success'
        : status === 'review'
            ? 'bg-warning'
            : 'bg-secondary'
);

const roleClass = (role: string) => (
    role === 'admin'
        ? 'bg-primary'
        : role === 'editor'
            ? 'bg-info'
            : 'bg-secondary'
);

const toRecords = (seed: Record<string, UserSeedRecord>) => (
    Object.entries(seed).map(([_key, record]) => ({ _key, ...record }))
);

const toGalleryRecords = (records: Array<Record<string, any>>) => (
    records.map((record) => ({
        ...record,
        img: (
            <img
                src={`https://placehold.co/480x280/0f172a/ffffff?text=${encodeURIComponent(record.name)}`}
                alt={record.name}
            />
        ),
    }))
);

function WithMock({ children }: { children: React.ReactNode }) {
    const provider = React.useMemo(() => new MockDataProvider({
        [GRID_PLAYGROUND_PATH]: USERS_SEED,
        'components/grid': USERS_SEED,
    }), []);
    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

function GridUserFields() {
    return (
        <>
            <TextField name="name" label="Name" required />
            <Email name="email" label="Email" required />
            <Select
                name="role"
                label="Role"
                required
                options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'viewer', label: 'Viewer' },
                ]}
            />
            <Select
                name="status"
                label="Status"
                required
                options={[
                    { value: 'active', label: 'Active' },
                    { value: 'review', label: 'Review' },
                    { value: 'inactive', label: 'Inactive' },
                ]}
            />
            <TextField name="team" label="Team" required />
            <TextField name="city" label="City" required />
        </>
    );
}

const baseColumns = [
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email', sort: true },
    {
        key: 'role',
        label: 'Role',
        sort: true,
        transform: ({ value }: { value: string }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
    {
        key: 'status',
        label: 'Status',
        sort: true,
        transform: ({ value }: { value: string }) => <Badge className={statusClass(value)}>{value}</Badge>,
    },
    { key: 'team', label: 'Team', sort: true },
    { key: 'city', label: 'City', sort: false },
];

const galleryColumns = [
    { key: 'name', label: 'Name', sort: true },
    {
        key: 'status',
        label: 'Status',
        sort: true,
        transform: ({ value }: { value: string }) => <Badge className={statusClass(value)}>{value}</Badge>,
    },
];

const GRID_COLUMN_TYPE = `{
  key: string;
  label: string;
  sort?: boolean;
  className?: string;
  transform?: string | ((args) => ReactNode);
}[]`;

const GRID_ACTIONS_TYPE = `{
  default?: {
    add?: boolean | ActionConfig;
    edit?: boolean | ActionConfig;
    delete?: boolean | ActionConfig;
  };
  header?: ReactNode | ((ctx) => ReactNode);
  footer?: ReactNode | ((ctx) => ReactNode);
}`;

const GRID_EDITOR_TYPE = `{
  mode?: "modal" | "inline" | "custom";
  form?: ReactNode | ((ctx) => ReactNode);
  renderHeader?: (record?) => ReactNode;
  renderContent?: (ctx) => ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  position?: "center" | "top" | "left" | "right" | "bottom";
}`;

const GRID_SELECTION_STATE_TYPE = `{
  keys: string[];
  records: RecordArray;
  clear: () => void;
  hasSelection: boolean;
}`;

const GRID_PROPS: PropDef[] = [
    { name: 'providerPath', type: 'string', description: 'Provider path used when Grid subscribes to a DataProvider source.', control: 'text', group: 'Data' },
    { name: 'records', type: 'RecordArray', description: 'In-memory records used instead of providerPath.', group: 'Data' },
    { name: 'columns', type: GRID_COLUMN_TYPE, required: true, description: 'Column definitions. transform accepts either a converter key string or a custom callback.', group: 'Display' },
    { name: 'view', type: '"table" | "gallery"', default: '"table"', description: 'Visual mode used by Grid.', control: 'select', options: ['table', 'gallery'], group: 'Display' },
    { name: 'sortable', type: 'boolean', default: 'true', description: 'Enables sortable headers in table mode. Gallery still honors order without header UI.', control: 'boolean', group: 'Display' },
    { name: 'order', type: '{ field: string; dir?: "asc" | "desc" }', description: 'Initial sort configuration forwarded to Table or Gallery.', control: 'json', group: 'Display' },
    { name: 'pagination', type: 'PaginationParams', description: 'Pagination config shared with the underlying visual component.', control: 'json', group: 'Display' },
    { name: 'groupBy', type: 'string | string[]', description: 'Grouping separator or separators in gallery mode.', control: 'text', group: 'Display', hidden: (props) => props.view !== 'gallery' },
    { name: 'header', type: 'ReactNode', description: 'Optional card header content.', control: 'text', group: 'Layout' },
    { name: 'footer', type: 'ReactNode', description: 'Optional card footer content.', control: 'text', group: 'Layout' },
    { name: 'wrapClass', type: 'string', description: 'Class applied to the outer Grid card wrapper.', control: 'text', group: 'Layout' },
    { name: 'sticky', type: '"top" | "bottom"', description: 'Sticky card modifier when the theme supports it.', control: 'select', options: ['top', 'bottom'], group: 'Layout' },
    { name: 'actions', type: GRID_ACTIONS_TYPE, description: 'Built-in default actions plus custom header/footer action slots.', group: 'Actions' },
    { name: 'editor', type: GRID_EDITOR_TYPE, description: 'Editor configuration for modal or inline editing.', group: 'Editor' },
    { name: 'createRecordKey', type: '(record) => string', description: 'Generates the record key used for new provider-backed saves.', group: 'Data lifecycle' },
    { name: 'transformRecords', type: '(records) => RecordArray | Promise<RecordArray>', description: 'Transforms, filters or enriches the source record set before display.', group: 'Data lifecycle' },
    { name: 'onClick', type: '(record) => void', description: 'Called with the clicked source record.', group: 'Events' },
    { name: 'onSelectionChange', type: `(selection: ${GRID_SELECTION_STATE_TYPE}) => void`, description: 'Controlled selection callback shared with Table and Gallery.', group: 'Events' },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection keys.', group: 'Events' },
    { name: 'onReorder', type: '(reorderedRecords, meta) => void', description: 'Table-mode drag callback with the full reordered source record set.', group: 'Events' },
    { name: 'audit', type: 'boolean', default: 'false', description: 'Enables audit-style logging through the integrated Form flow.', control: 'boolean', group: 'Behavior' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Forces the Grid loader state.', control: 'boolean', group: 'Behavior' },
];

const GRID_EDITOR_SEED = toRecords(USERS_SEED).slice(0, 6);

function GridPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const provider = useDataProvider();
    const [sourceRows, setSourceRows] = React.useState<Array<Record<string, any>>>(GRID_EDITOR_SEED);
    const [playgroundRows, setPlaygroundRows] = React.useState<Array<Record<string, any>>>(toGalleryRecords(GRID_EDITOR_SEED));
    const [selectionEnabled, setSelectionEnabled] = React.useState(false);
    const [dragEnabled, setDragEnabled] = React.useState(false);
    const [inlineEditor, setInlineEditor] = React.useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<Array<Record<string, any>>>([]);
    const [selectionPayload, setSelectionPayload] = React.useState<{ keys: string[]; records: string[]; hasSelection: boolean } | null>(null);
    const [reorderPayload, setReorderPayload] = React.useState<{ keys: string[]; fromIndex: number | null; toIndex: number | null } | null>(null);
    const [exportOpen, setExportOpen] = React.useState(false);

    provider.useListener(GRID_PLAYGROUND_PATH, setSourceRows);

    React.useEffect(() => {
        const nextRows = toGalleryRecords(sourceRows);
        setPlaygroundRows(nextRows);
        setSelectedKeys([]);
        setSelectedRecords([]);
        setSelectionPayload(null);
        setReorderPayload({
            keys: nextRows.map((record) => record._key || ''),
            fromIndex: null,
            toIndex: null,
        });
    }, [sourceRows]);

    const actionHeader = (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
            <span className="text-muted-foreground">
                {selectionEnabled
                    ? (selectedKeys.length ? `${selectedKeys.length} selected` : 'Select records to inspect Grid selection payloads')
                    : 'Enable multi checkbox above to activate Grid selection'}
            </span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={!selectionEnabled || !selectedKeys.length}
                    onClick={() => setExportOpen(true)}
                >
                    Export
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={!selectionEnabled || !selectedKeys.length}
                    onClick={() => {
                        setSelectedKeys([]);
                        setSelectedRecords([]);
                        setSelectionPayload(null);
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
    );

    const actionFooter = (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{playgroundRows.length} mock records</span>
            <span>{inlineEditor ? 'Inline editor' : 'Modal editor'} active</span>
        </div>
    );

    return (
        <div className="min-w-0 space-y-4">
            <div className="grid gap-3 xl:grid-cols-3">
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">Multi checkbox</div>
                            <div className="text-xs text-muted-foreground">Selection uses the same selectedKeys and onSelectionChange semantics as Table and Gallery.</div>
                        </div>
                        <button
                            type="button"
                            className={`btn btn-sm ${selectionEnabled ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => {
                                setSelectionEnabled((current) => {
                                    const next = !current;
                                    setSelectedKeys([]);
                                    setSelectedRecords([]);
                                    setSelectionPayload(null);
                                    return next;
                                });
                            }}
                        >
                            {selectionEnabled ? 'Disable multi checkbox' : 'Enable multi checkbox'}
                        </button>
                    </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">Drag reorder</div>
                            <div className="text-xs text-muted-foreground">Reorder is table-only. While it is active, sorting is suspended so manual order stays visible.</div>
                        </div>
                        <button
                            type="button"
                            disabled={p.view !== 'table'}
                            className={`btn btn-sm ${dragEnabled ? 'btn-primary' : 'btn-outline-secondary'} ${p.view !== 'table' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => {
                                if (p.view !== 'table') return;
                                setDragEnabled((current) => {
                                    const next = !current;
                                    setReorderPayload({
                                        keys: playgroundRows.map((record) => record._key || ''),
                                        fromIndex: null,
                                        toIndex: null,
                                    });
                                    return next;
                                });
                            }}
                        >
                            {dragEnabled ? 'Disable drag' : 'Enable drag'}
                        </button>
                    </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">Editor mode</div>
                            <div className="text-xs text-muted-foreground">Switch between modal and inline editing without changing the Grid contract.</div>
                        </div>
                        <button
                            type="button"
                            className={`btn btn-sm ${inlineEditor ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setInlineEditor((current) => !current)}
                        >
                            {inlineEditor ? 'Use modal editor' : 'Use inline editor'}
                        </button>
                    </div>
                </div>
            </div>

            <Grid
                records={playgroundRows}
                columns={baseColumns}
                header={p.header || 'Team directory'}
                footer={p.footer || 'Provider-backed Grid preview'}
                view={p.view}
                sortable={dragEnabled ? false : p.sortable}
                order={dragEnabled ? undefined : (p.order && typeof p.order === 'object' ? p.order : undefined)}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                groupBy={p.view === 'gallery' ? (p.groupBy || undefined) : undefined}
                wrapClass={p.wrapClass || undefined}
                sticky={p.sticky || undefined}
                loading={!!p.loading}
                audit={!!p.audit}
                actions={{
                    default: {
                        add: true,
                        edit: true,
                        delete: true,
                    },
                    header: actionHeader,
                    footer: actionFooter,
                }}
                editor={{
                    mode: inlineEditor ? 'inline' : 'modal',
                    size: 'xl',
                    form: <GridUserFields />,
                    renderHeader: (record) => record?._key ? 'Edit team member' : 'Add team member',
                }}
                createRecordKey={(record) => String(record.email || record.name || Date.now()).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
                selectedKeys={selectionEnabled ? selectedKeys : undefined}
                onSelectionChange={selectionEnabled ? ((selection) => {
                    setSelectedKeys(selection.keys);
                    setSelectedRecords(selection.records);
                    setSelectionPayload({
                        keys: selection.keys,
                        records: selection.records.map((record) => record._key || record.name || 'record'),
                        hasSelection: selection.hasSelection,
                    });
                }) : undefined}
                onReorder={dragEnabled && p.view === 'table' ? ((reorderedRecords, meta) => {
                    setPlaygroundRows(reorderedRecords);
                    setReorderPayload({
                        keys: reorderedRecords.map((record) => record._key || ''),
                        fromIndex: meta.fromIndex,
                        toIndex: meta.toIndex,
                    });
                }) : undefined}
                onClick={() => undefined}
            />

            <div className="grid gap-3 xl:grid-cols-2">
                <div className="rounded-md border bg-muted/40 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onSelectionChange payload</div>
                    <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {selectionEnabled
                            ? JSON.stringify(selectionPayload ?? {
                                keys: selectedKeys,
                                records: [],
                                hasSelection: selectedKeys.length > 0,
                            }, null, 2)
                            : 'Enable multi checkbox above, then select records to inspect the Grid selection payload.'}
                    </pre>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onReorder payload</div>
                    <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {dragEnabled && p.view === 'table'
                            ? JSON.stringify(reorderPayload, null, 2)
                            : 'Enable drag in table view, then move rows to inspect the reordered source record set.'}
                    </pre>
                </div>
            </div>

            {exportOpen && (
                <Modal title="Selected Grid records" size="xl" onClose={() => setExportOpen(false)}>
                    <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                        {JSON.stringify(selectedRecords, null, 2)}
                    </pre>
                </Modal>
            )}
        </div>
    );
}

const PLAYGROUND: PlaygroundConfig = {
    size: 'fullscreen',
    layout: 'split',
    props: GRID_PROPS,
    mockSeed: GRID_PLAYGROUND_SEED,
    defaultProps: {
        view: 'table',
        sortable: true,
        order: { field: 'name', dir: 'asc' },
        pagination: { limit: 4, align: 'end', sticky: false },
        groupBy: ' ',
        header: 'Team directory',
        footer: 'Provider-backed Grid preview',
        wrapClass: '',
        sticky: '',
        loading: false,
        audit: false,
    },
    render: (p) => <GridPlaygroundPreview p={p} />,
};

export default function GridPage() {
    usePlayground(PLAYGROUND, 'Grid');

    const [clickedKey, setClickedKey] = React.useState('');
    const [inlineKeys, setInlineKeys] = React.useState<string[]>([]);
    const [inlineRecords, setInlineRecords] = React.useState<Array<Record<string, any>>>([]);
    const [inlineExportOpen, setInlineExportOpen] = React.useState(false);
    const [reorderedRecords, setReorderedRecords] = React.useState(toGalleryRecords(toRecords(USERS_SEED)));

    return (
        <PageLayout
            title="Grid widget"
            description="Grid is now an orchestration layer on top of Table and Gallery: provider reads, record transforms, actions, editor flows, selection and reorder all share one cleaner contract."
        >
            <Section
                title="Implicit provider path"
                description="With no props, Grid reads from the current route path and derives columns from the first record. This is the smallest provider-backed usage."
                preview={(
                    <WithMock>
                        <Grid />
                    </WithMock>
                )}
                code={`<Grid />`}
            />

            <Section
                title="Explicit provider path"
                description="Use providerPath when the Grid must subscribe to a provider collection that is not the current route."
                preview={(
                    <WithMock>
                        <Grid
                            providerPath={GRID_PLAYGROUND_PATH}
                        />
                    </WithMock>
                )}
                code={`<Grid
  providerPath="/grid-users"
/>`}
            />

            <Section
                title="Static records"
                description="Use records when the caller already owns the data and Grid should only render, sort, paginate, select or reorder it."
                preview={(
                    <Grid
                        records={toRecords(USERS_SEED)}
                    />
                )}
                code={`<Grid
  records={records}
/>`}
            />

            <Section
                title="Column transforms"
                description="Use columns when you want explicit labels, sortable fields and display transforms for specific cells."
                preview={(
                    <Grid
                        records={toRecords(USERS_SEED)}
                        columns={baseColumns}
                        header="Team directory"
                        footer="Explicit columns with badge transforms"
                        view="table"
                        sortable
                        order={{ field: 'name', dir: 'asc' }}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<Grid
  records={records}
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email', sort: true },
    { key: 'role', label: 'Role', transform: ({ value }) => <Badge>{value}</Badge> },
    { key: 'status', label: 'Status', transform: ({ value }) => <Badge>{value}</Badge> },
  ]}
  header="Team directory"
  footer="Explicit columns with badge transforms"
  view="table"
  sortable
  order={{ field: 'name', dir: 'asc' }}
  pagination={{ limit: 4, align: 'end', sticky: false }}
/>`}
            />

            <Section
                title="transformRecords before display"
                description="Use transformRecords when you need to normalize, filter or enrich the source record set before Grid hands it to Table or Gallery."
                preview={(
                    <Grid
                        records={toGalleryRecords(toRecords(USERS_SEED))}
                        columns={baseColumns}
                        header="Only active and review users"
                        footer="Inactive users are filtered out before display"
                        view="table"
                        transformRecords={(records) => (
                            records
                                .filter((record) => record.status !== 'inactive')
                                .map((record) => ({
                                    ...record,
                                    team: `${record.team} / ${record.city}`,
                                }))
                        )}
                        sortable
                        order={{ field: 'team', dir: 'asc' }}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<Grid
  records={records}
  transformRecords={(records) => (
    records
      .filter((record) => record.status !== 'inactive')
      .map((record) => ({
        ...record,
        team: record.team + ' / ' + record.city,
      }))
  )}
/>`}
            />

            <Section
                title="actions.default with modal editor"
                description="Grid now keeps built-in actions under actions.default. You can extend the card chrome with actions.header and actions.footer while the editor stays clearly configured under editor."
                preview={(
                    <WithMock>
                        <Grid
                            providerPath={GRID_PLAYGROUND_PATH}
                            columns={baseColumns}
                            header="Team members"
                            view="table"
                            sortable
                            order={{ field: 'name', dir: 'asc' }}
                            actions={{
                                default: {
                                    add: { label: 'Add teammate' },
                                    edit: true,
                                    delete: true,
                                },
                                header: (
                                    <span className="text-xs text-muted-foreground">
                                        Click a row to open the editor modal
                                    </span>
                                ),
                                footer: (
                                    <span className="text-xs text-muted-foreground">
                                        Built-in add/edit/delete stay in the Grid contract
                                    </span>
                                ),
                            }}
                            editor={{
                                mode: 'modal',
                                size: 'xl',
                                form: <GridUserFields />,
                                renderHeader: (record) => record?._key ? 'Edit teammate' : 'Add teammate',
                            }}
                            createRecordKey={(record) => String(record.email).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
                        />
                    </WithMock>
                )}
                code={`<Grid
  providerPath="/grid-users"
  actions={{
    default: {
      add: { label: 'Add teammate' },
      edit: true,
      delete: true,
    },
    header: <span>Click a row to edit</span>,
    footer: <span>Built-in actions stay inside Grid</span>,
  }}
  editor={{
    mode: 'modal',
    size: 'xl',
    form: <GridUserFields />,
    renderHeader: (record) => record?._key ? 'Edit teammate' : 'Add teammate',
  }}
  createRecordKey={(record) => String(record.email).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
/>`}
            />

            <Section
                title="Inline editor and external bulk commands"
                description="Selection now follows the same selectedKeys and onSelectionChange semantics as Table and Gallery. Bulk commands stay outside the component, while the editor can switch to inline mode."
                preview={(
                    <WithMock>
                        <div className="space-y-3">
                            <Grid
                                providerPath={GRID_PLAYGROUND_PATH}
                                columns={baseColumns}
                                header="Inline editing"
                                view="table"
                                selectedKeys={inlineKeys}
                                onSelectionChange={(selection) => {
                                    setInlineKeys(selection.keys);
                                    setInlineRecords(selection.records);
                                }}
                                actions={{
                                    default: {
                                        add: true,
                                        edit: true,
                                        delete: false,
                                    },
                                    header: (
                                        <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                            <span className="text-muted-foreground">
                                                {inlineKeys.length ? `${inlineKeys.length} selected` : 'Select rows to enable external commands'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    disabled={!inlineKeys.length}
                                                    onClick={() => setInlineExportOpen(true)}
                                                >
                                                    Export
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    disabled={!inlineKeys.length}
                                                    onClick={() => {
                                                        setInlineKeys([]);
                                                        setInlineRecords([]);
                                                    }}
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    ),
                                }}
                                editor={{
                                    mode: 'inline',
                                    form: <GridUserFields />,
                                    renderHeader: (record) => record?._key ? 'Inline edit teammate' : 'Add teammate',
                                }}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                            {inlineExportOpen && (
                                <Modal title="Selected Grid records" size="xl" onClose={() => setInlineExportOpen(false)}>
                                    <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                                        {JSON.stringify(inlineRecords, null, 2)}
                                    </pre>
                                </Modal>
                            )}
                        </div>
                    </WithMock>
                )}
                code={`const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<Grid
  providerPath="/grid-users"
  selectedKeys={selectedKeys}
  onSelectionChange={(selection) => {
    setSelectedKeys(selection.keys);
    setSelectedRecords(selection.records);
  }}
  actions={{
    default: { add: true, edit: true, delete: false },
    header: <ExternalBulkToolbar />,
  }}
  editor={{
    mode: 'inline',
    form: <GridUserFields />,
  }}
/>`}
            />

            <Section
                title="Table reorder"
                description="When you provide onReorder, Grid forwards drag and drop to the underlying Table and gives you the reordered source records back."
                preview={(
                    <Grid
                        records={reorderedRecords}
                        columns={baseColumns}
                        header="Manual ordering"
                        footer="Drag rows to update the source order"
                        view="table"
                        onReorder={(nextRecords) => setReorderedRecords(nextRecords)}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`const [records, setRecords] = useState(seedRecords);

<Grid
  records={records}
  view="table"
  onReorder={(reorderedRecords) => setRecords(reorderedRecords)}
/>`}
            />

            <Section
                title="Gallery mode with grouping"
                description="The same Grid contract can flip to gallery mode. order still applies, selection still works, and groupBy organizes the visual result set."
                preview={(
                    <Grid
                        records={toGalleryRecords(toRecords(USERS_SEED))}
                        columns={galleryColumns}
                        header="Team assets"
                        footer="Gallery mode still shares selection and order semantics"
                        view="gallery"
                        order={{ field: 'name', dir: 'asc' }}
                        groupBy=" "
                        pagination={{ limit: 4, align: 'center', sticky: false }}
                    />
                )}
                code={`<Grid
  records={galleryRecords}
  view="gallery"
  order={{ field: 'name', dir: 'asc' }}
  groupBy=" "
  pagination={{ limit: 4, align: 'center', sticky: false }}
/>`}
            />

            <Section
                title="Record click"
                description="onClick still stays simple: it receives the source record, so callers can rely directly on _key and original values."
                preview={(
                    <Grid
                        records={toGalleryRecords(toRecords(USERS_SEED))}
                        columns={baseColumns}
                        view="table"
                        onClick={(record) => setClickedKey(record._key || '')}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`const [selectedKey, setSelectedKey] = useState('');

<Grid
  records={records}
  onClick={(record) => setSelectedKey(record._key || '')}
/>`}
            />

            <div className="mt-3 text-xs text-muted-foreground">
                Last clicked key: <span className="font-mono">{clickedKey || 'none'}</span>
            </div>

            <PropsTable props={GRID_PROPS} />
        </PageLayout>
    );
}
