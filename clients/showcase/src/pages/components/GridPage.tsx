import React from 'react';
import {
    ActionButton,
    Badge,
    DataProvider,
    Email,
    Grid,
    MockDataProvider,
    Modal,
    ModalYesNo,
    Select,
    String as TextField,
    buttonOutlineSecondaryClass,
    buttonPrimaryClass,
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
const GRID_PLAYGROUND_SOURCE = {
    path: GRID_PLAYGROUND_PATH,
    order: { name: 'asc' as const },
};

const GRID_PLAYGROUND_SEED = {
    [GRID_PLAYGROUND_PATH]: USERS_SEED,
    'components/grid': USERS_SEED,
};

const isSourceConfig = (value: unknown): value is { path?: string; where?: object; order?: object; fieldMap?: object; onLoad?: unknown } => (
    !!value && typeof value === 'object' && !Array.isArray(value)
);

const getPlaygroundSourcePath = (source: unknown) => {
    if (typeof source === 'string') return source;
    if (isSourceConfig(source)) return source.path || GRID_PLAYGROUND_PATH;
    return GRID_PLAYGROUND_PATH;
};

const getPlaygroundSourceOptions = (source: unknown) => {
    if (!isSourceConfig(source)) return undefined;

    return {
        where: source.where,
        order: source.order,
        fieldMap: source.fieldMap,
        onLoad: source.onLoad as ((data: Record<string, any>) => Record<string, any>) | undefined,
    };
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

const galleryPaletteByTeam: Record<string, { background: string; foreground: string }> = {
    Platform: { background: 'E0F2FE', foreground: '0F172A' },
    Marketing: { background: 'FEF3C7', foreground: '111827' },
    Support: { background: 'DCFCE7', foreground: '14532D' },
    Product: { background: 'EDE9FE', foreground: '312E81' },
    Operations: { background: 'FFE4E6', foreground: '881337' },
    Content: { background: 'FCE7F3', foreground: '831843' },
};

const toRecords = (seed: Record<string, UserSeedRecord>) => (
    Object.entries(seed).map(([_key, record]) => ({ _key, ...record }))
);

const toGalleryRecords = (records: Array<Record<string, any>>) => (
    records.map((record) => ({
        ...record,
        img: (
            <img
                src={`https://placehold.co/960x640/${(galleryPaletteByTeam[record.team]?.background || 'E2E8F0')}/${(galleryPaletteByTeam[record.team]?.foreground || '0F172A')}?text=${encodeURIComponent(`${record.team}\n${record.city}\n${record.name}`)}`}
                alt={`${record.team} | ${record.name}`}
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

function GridEditSidebar({
    record,
    onDelete,
    Actions,
}: {
    record?: Record<string, any>;
    onDelete: () => void;
    Actions: Record<string, React.ComponentType<any>>;
}) {
    return (
        <div className="space-y-4">
            <div>
                <div className="text-sm font-medium">Custom edit view</div>
                <div className="text-xs text-muted-foreground">This edit action renders its own layout inside a right-side modal.</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-4">
                <div className="text-lg font-semibold">{record?.name}</div>
                <div className="text-sm text-muted-foreground">{record?.email}</div>
                <div className="mt-3 grid gap-2 text-sm">
                    <div><span className="font-medium">Role:</span> {record?.role}</div>
                    <div><span className="font-medium">Status:</span> {record?.status}</div>
                    <div><span className="font-medium">Team:</span> {record?.team}</div>
                    <div><span className="font-medium">City:</span> {record?.city}</div>
                </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
                {Actions.preview ? <Actions.preview className={`${buttonOutlineSecondaryClass} btn-sm`} record={record} /> : null}
                <ActionButton className="btn-danger btn-sm" label="Delete teammate" onClick={onDelete} />
            </div>
        </div>
    );
}

function GridActionWorkflowsPreview() {
    const provider = useDataProvider();

    const handleDeleteTeammate = React.useCallback(async (record?: Record<string, any>) => {
        if (!record?._key) return false;
        await provider.remove(`${GRID_PLAYGROUND_PATH}/${record._key}`);
        return true;
    }, [provider]);

    return (
        <Grid
            source={{ path: GRID_PLAYGROUND_PATH, order: { name: 'asc' } }}
            columns={baseColumns}
            title="Team members"
            view="table"
            sortable
            form={<GridUserFields />}
            actions={{
                add: { label: 'Add teammate', mode: { position: 'center', size: 'xl' } },
                edit: {
                    mode: { position: 'right', size: 'lg' },
                    render: ({ record, action, Actions }) => (
                        <GridEditSidebar record={record} onDelete={() => action('delete', record)} Actions={Actions} />
                    ),
                },
                delete: {
                    mode: null,
                    render: ({ record, close }) => (
                        <ModalYesNo
                            title="Delete teammate"
                            onClose={close}
                            onYes={async () => {
                                const success = await handleDeleteTeammate(record);
                                if (success) close();
                                return success;
                            }}
                            onNo={async () => true}
                        >
                            <div className="text-sm">
                                Are you sure you want to delete <span className="font-medium">{record?.name}</span>?
                            </div>
                        </ModalYesNo>
                    ),
                },
                preview: {
                    label: 'Preview record',
                    mode: (record) => `/components/grid/preview?view=preview&record=${record?._key || ''}`,
                },
                export: {
                    label: 'Export',
                    mode: '/components/grid/preview?view=export',
                },
                copy: {
                    label: 'Copy',
                    mode: null,
                    render: ({ close }) => (
                        <Modal title="Copy dataset helpers" size="md" onClose={close}>
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    This non-standard action is still declared in the same <code>actions</code> catalog. Here it opens a small utility modal instead of navigating away.
                                </div>
                                <div className="grid gap-2">
                                    <ActionButton
                                        className={buttonOutlineSecondaryClass}
                                        label="Copy dataset JSON"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(JSON.stringify(toRecords(USERS_SEED), null, 2));
                                            close();
                                        }}
                                    />
                                    <ActionButton
                                        className={buttonOutlineSecondaryClass}
                                        label="Copy emails"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(toRecords(USERS_SEED).map((record) => record.email).join(', '));
                                            close();
                                        }}
                                    />
                                </div>
                            </div>
                        </Modal>
                    ),
                },
            }}
            header={({ title, Actions }) => (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div>{title}</div>
                        <div className="text-xs text-muted-foreground">
                            Add, edit and delete can now choose different render strategies without a separate editor prop.
                        </div>
                    </div>
                    {Actions.add ? <Actions.add /> : null}
                </div>
            )}
            footer={({ Actions }) => (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                        Add uses the default form. Edit and delete override it selectively. Preview, export and copy live in the same action catalog and can be reused anywhere in the Grid chrome.
                    </span>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {Actions.export ? <Actions.export className={`${buttonOutlineSecondaryClass} btn-sm`} /> : null}
                        {Actions.copy ? <Actions.copy className={`${buttonOutlineSecondaryClass} btn-sm`} /> : null}
                    </div>
                </div>
            )}
            createRecordKey={(record) => String(record.email).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
        />
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
  add?: false | ActionConfig;
  edit?: false | ActionConfig;
  delete?: false | ActionConfig;
  [customAction: string]?: false | ActionConfig;
}`;

const GRID_FORM_TYPE = `ReactNode | ((ctx) => ReactNode)`;

const GRID_SELECTION_STATE_TYPE = `{
  keys: string[];
  records: RecordArray;
  clear: () => void;
  hasSelection: boolean;
}`;

const GRID_PROPS: PropDef[] = [
    {
        name: 'source',
        type: 'RecordArray | string | { path?: string; where?: object; order?: object; fieldMap?: object }',
        description: 'Single data entry point for Grid. Use an array for local rows, a string for a provider path, or a db-style object for provider queries.',
        control: 'json',
        group: 'Data',
        readOnly: true,
        help: 'This playground uses a MockDataProvider. See Mock database below to inspect or edit the records returned by this source path.',
    },
    { name: 'columns', type: GRID_COLUMN_TYPE, required: true, description: 'Column definitions. transform accepts either a converter key string or a custom callback.', group: 'Display' },
    { name: 'view', type: '"table" | "gallery"', default: '"table"', description: 'Visual mode used by Grid.', control: 'select', options: ['table', 'gallery'], group: 'Display' },
    { name: 'sortable', type: 'boolean | OrderConfig', default: 'true', description: 'Enables sortable headers in table mode. Pass an OrderConfig object to set the initial client-side sort without reintroducing a separate order prop.', control: 'json', group: 'Display' },
    { name: 'pagination', type: 'PaginationParams', description: 'Pagination config shared with the underlying visual component.', control: 'json', group: 'Display' },
    { name: 'groupBy', type: 'string | string[]', description: 'Grouping separator or separators in gallery mode.', control: 'text', group: 'Display', hidden: (props) => props.view !== 'gallery' },
    { name: 'title', type: 'ReactNode', description: 'Title used by the default Grid header layout.', control: 'text', group: 'Layout' },
    { name: 'header', type: 'ReactNode | ((ctx) => ReactNode)', description: 'Optional header override. Leave it undefined to use the default title + add action layout.', group: 'Layout' },
    { name: 'footer', type: 'ReactNode | ((ctx) => ReactNode)', description: 'Optional footer override. Leave it undefined to keep the default footer empty.', group: 'Layout' },
    { name: 'wrapClass', type: 'string', description: 'Class applied to the outer Grid card wrapper.', control: 'text', group: 'Layout' },
    { name: 'sticky', type: '"top" | "bottom"', description: 'Sticky card modifier when the theme supports it.', control: 'select', options: ['top', 'bottom'], group: 'Layout' },
    { name: 'form', type: GRID_FORM_TYPE, description: 'Shared default form used by add/edit actions when they do not provide their own render function.', group: 'Actions' },
    { name: 'actions', type: GRID_ACTIONS_TYPE, description: 'Action catalog used by Grid defaults and by header/footer composition. Each action can choose its own mode, modal placement and render strategy, including custom named actions.', group: 'Actions' },
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
    const providerSourcePath = React.useMemo(() => getPlaygroundSourcePath(p.source), [p.source]);
    const providerSourceOptions = React.useMemo(() => getPlaygroundSourceOptions(p.source), [p.source]);
    const [sourceRows, setSourceRows] = React.useState<Array<Record<string, any>>>(GRID_EDITOR_SEED);
    const [playgroundRows, setPlaygroundRows] = React.useState<Array<Record<string, any>>>(toGalleryRecords(GRID_EDITOR_SEED));
    const [selectionEnabled, setSelectionEnabled] = React.useState(false);
    const [dragEnabled, setDragEnabled] = React.useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<Array<Record<string, any>>>([]);
    const [selectionPayload, setSelectionPayload] = React.useState<{ keys: string[]; records: string[]; hasSelection: boolean } | null>(null);
    const [reorderPayload, setReorderPayload] = React.useState<{ keys: string[]; fromIndex: number | null; toIndex: number | null } | null>(null);
    const [exportOpen, setExportOpen] = React.useState(false);

    provider.useListener(providerSourcePath, setSourceRows, providerSourceOptions);

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
                <ActionButton
                    className={`${buttonOutlineSecondaryClass} btn-sm`}
                    label="Export"
                    disabled={!selectionEnabled || !selectedKeys.length}
                    onClick={() => setExportOpen(true)}
                />
                <ActionButton
                    className={`${buttonOutlineSecondaryClass} btn-sm`}
                    label="Clear"
                    disabled={!selectionEnabled || !selectedKeys.length}
                    onClick={() => {
                        setSelectedKeys([]);
                        setSelectedRecords([]);
                        setSelectionPayload(null);
                    }}
                />
            </div>
        </div>
    );

    const actionFooter = (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{playgroundRows.length} mock records</span>
            <span>Default modal workflow active</span>
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
                        <ActionButton
                            className={`${selectionEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} btn-sm`}
                            label={selectionEnabled ? 'Disable multi checkbox' : 'Enable multi checkbox'}
                            onClick={() => {
                                setSelectionEnabled((current) => {
                                    const next = !current;
                                    setSelectedKeys([]);
                                    setSelectedRecords([]);
                                    setSelectionPayload(null);
                                    return next;
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">Drag reorder</div>
                            <div className="text-xs text-muted-foreground">Reorder is table-only. While it is active, sorting is suspended so manual order stays visible.</div>
                        </div>
                        <ActionButton
                            disabled={p.view !== 'table'}
                            className={`${dragEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} btn-sm`}
                            label={dragEnabled ? 'Disable drag' : 'Enable drag'}
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
                        />
                    </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Action chrome</div>
                        <div className="text-xs text-muted-foreground">Grid keeps a default header with title plus Add. You can still override header and footer as JSX or as functions receiving the built-in action components.</div>
                    </div>
                </div>
            </div>

            <Grid
                source={dragEnabled ? playgroundRows : (p.source || GRID_PLAYGROUND_SOURCE)}
                columns={baseColumns}
                title={p.title || 'Team directory'}
                view={p.view}
                sortable={dragEnabled ? false : p.sortable}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                groupBy={p.view === 'gallery' ? (p.groupBy || undefined) : undefined}
                wrapClass={p.wrapClass || undefined}
                sticky={p.sticky || undefined}
                loading={!!p.loading}
                audit={!!p.audit}
                form={<GridUserFields />}
                actions={{
                    add: { mode: { position: 'center' } },
                    edit: {},
                    delete: {
                        mode: null,
                        render: ({ record, close }) => (
                            <ModalYesNo
                                title="Delete teammate"
                                onClose={close}
                                onYes={async () => true}
                                onNo={async () => true}
                            >
                                <div className="text-sm">
                                    Delete <span className="font-medium">{record?.name}</span> from this mock dataset?
                                </div>
                            </ModalYesNo>
                        ),
                    },
                }}
                header={({ title, Actions }) => (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div>{title}</div>
                            <div className="mt-2">{actionHeader}</div>
                        </div>
                        {Actions.add ? <Actions.add /> : null}
                    </div>
                )}
                footer={() => actionFooter}
                transformRecords={dragEnabled ? undefined : ((records) => toGalleryRecords(records))}
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
        source: GRID_PLAYGROUND_SOURCE,
        view: 'table',
        sortable: { field: 'name', dir: 'asc' },
        pagination: { limit: 4, align: 'end', sticky: false },
        groupBy: ' ',
        title: 'Team directory',
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
                title="Implicit provider source"
                description="With no props, Grid reads from the current route path and derives columns from the first record. This is the smallest provider-backed usage."
                preview={(
                    <WithMock>
                        <Grid />
                    </WithMock>
                )}
                code={`<Grid />`}
            />

            <Section
                title="Explicit provider source"
                description="Use a string source when the Grid must subscribe to a provider collection that is not the current route."
                preview={(
                    <WithMock>
                        <Grid
                            source={GRID_PLAYGROUND_PATH}
                        />
                    </WithMock>
                )}
                code={`<Grid
  source="/grid-users"
/>`}
            />

            <Section
                title="Static source array"
                description="Use an array source when the caller already owns the data and Grid should only render, paginate, select or reorder it."
                preview={(
                    <Grid
                        source={toRecords(USERS_SEED)}
                    />
                )}
                code={`<Grid
  source={records}
/>`}
            />

            <Section
                title="Column transforms"
                description="Use columns when you want explicit labels, sortable fields and display transforms for specific cells. sortable can also carry the initial client-side sort config."
                preview={(
                    <Grid
                        source={toRecords(USERS_SEED)}
                        columns={baseColumns}
                        title="Team directory"
                        footer="Explicit columns with badge transforms"
                        view="table"
                        sortable={{ field: 'name', dir: 'asc' }}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<Grid
  source={records}
  columns={[
    { key: 'name', label: 'Name', sort: true },
    { key: 'email', label: 'Email', sort: true },
    { key: 'role', label: 'Role', transform: ({ value }) => <Badge>{value}</Badge> },
    { key: 'status', label: 'Status', transform: ({ value }) => <Badge>{value}</Badge> },
  ]}
  title="Team directory"
  footer="Explicit columns with badge transforms"
  view="table"
  sortable={{ field: 'name', dir: 'asc' }}
  pagination={{ limit: 4, align: 'end', sticky: false }}
/>`}
            />

            <Section
                title="transformRecords before display"
                description="Use transformRecords when you need to normalize, filter or enrich the source record set before Grid hands it to Table or Gallery."
                preview={(
                    <Grid
                        source={toGalleryRecords(toRecords(USERS_SEED))}
                        columns={baseColumns}
                        title="Only active and review users"
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
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<Grid
  source={records}
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
                title="Actions with distinct workflows"
                description="actions is now the single action catalog. Alongside add, edit and delete you can declare custom actions like preview, export and copy, then reuse them in edit renders, header and footer."
                preview={(
                    <WithMock>
                        <GridActionWorkflowsPreview />
                    </WithMock>
                )}
                code={`const handleDeleteTeammate = async (record?: RecordProps) => {
  if (!record?._key) return false;
  await db.remove(\`/grid-users/\${record._key}\`);
  return true;
};

<Grid
  source={{ path: "/grid-users", order: { name: "asc" } }}
  form={<GridUserFields />}
  actions={{
    add: { label: 'Add teammate', mode: { position: 'center' } },
    edit: {
      mode: { position: 'right' },
      render: ({ record, action, Actions }) => (
        <GridEditSidebar record={record} onDelete={() => action('delete', record)} Actions={Actions} />
      ),
    },
    delete: {
      mode: null,
      render: ({ record, close }) => (
        <ModalYesNo
          title="Delete teammate"
          onClose={close}
          onYes={async () => {
            const success = await handleDeleteTeammate(record);
            if (success) close();
            return success;
          }}
        >
          Are you sure you want to delete {record?.name}?
        </ModalYesNo>
      ),
    },
    preview: {
      label: 'Preview record',
      mode: (record) => \`/components/grid/preview?view=preview&record=\${record?._key || ''}\`,
    },
    export: { label: 'Export', mode: '/components/grid/preview?view=export' },
    copy: {
      label: 'Copy',
      mode: null,
      render: ({ close }) => (
        <Modal title="Copy dataset helpers" size="md" onClose={close}>
          <div>Copy JSON or emails from the same custom action catalog.</div>
        </Modal>
      ),
    },
  }}
  header={({ title, Actions }) => (
    <div className="flex items-center justify-between gap-3">
      <div>{title}</div>
      {Actions.add ? <Actions.add /> : null}
    </div>
  )}
  footer={({ Actions }) => (
    <div className="flex items-center justify-between gap-3">
      <span>Add uses the default form. Edit and delete override it selectively.</span>
      <div className="flex items-center gap-2">
        {Actions.export ? <Actions.export /> : null}
        {Actions.copy ? <Actions.copy /> : null}
      </div>
    </div>
  )}
  createRecordKey={(record) => String(record.email).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
/>`}
            />

            <Section
                title="Custom header and external bulk commands"
                description="Selection still follows the shared selectedKeys and onSelectionChange semantics. The default header can be replaced with a function that receives title and built-in action components."
                preview={(
                    <WithMock>
                        <div className="space-y-3">
                            <Grid
                                source={{ path: GRID_PLAYGROUND_PATH, order: { name: 'asc' } }}
                                columns={baseColumns}
                                title="Bulk selection"
                                view="table"
                                selectedKeys={inlineKeys}
                                onSelectionChange={(selection) => {
                                    setInlineKeys(selection.keys);
                                    setInlineRecords(selection.records);
                                }}
                                form={<GridUserFields />}
                                actions={{
                                    edit: false,
                                    delete: false,
                                }}
                                header={({ title, Actions }) => (
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div>{title}</div>
                                            <div className="mt-2 flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    {inlineKeys.length ? `${inlineKeys.length} selected` : 'Select rows to enable external commands'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <ActionButton
                                                        className={`${buttonOutlineSecondaryClass} btn-sm`}
                                                        label="Export"
                                                        disabled={!inlineKeys.length}
                                                        onClick={() => setInlineExportOpen(true)}
                                                    />
                                                    <ActionButton
                                                        className={`${buttonOutlineSecondaryClass} btn-sm`}
                                                        label="Clear"
                                                        disabled={!inlineKeys.length}
                                                        onClick={() => {
                                                            setInlineKeys([]);
                                                            setInlineRecords([]);
                                                        }}
                                                    />
                                                    {Actions.add ? <Actions.add className={`${buttonPrimaryClass} btn-sm`} /> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
  source={{ path: "/grid-users", order: { name: "asc" } }}
  title="Bulk selection"
  form={<GridUserFields />}
  selectedKeys={selectedKeys}
  onSelectionChange={(selection) => {
    setSelectedKeys(selection.keys);
    setSelectedRecords(selection.records);
  }}
  actions={{
    edit: false,
    delete: false,
  }}
  header={({ title, Actions }) => (
    <div className="flex items-center justify-between gap-3">
      <div>{title}</div>
      <div className="flex items-center gap-2">
        <ExternalBulkToolbar />
        {Actions.add ? <Actions.add /> : null}
      </div>
    </div>
  )}
/>`}
            />

            <Section
                title="Table reorder"
                description="When you provide onReorder, Grid forwards drag and drop to the underlying Table and gives you the reordered source records back."
                preview={(
                    <div className="w-full space-y-3">
                        <Grid
                            source={reorderedRecords}
                            columns={baseColumns}
                            title="Manual ordering"
                            footer="Drag rows to update the source order"
                            view="table"
                            sortable={false}
                            onReorder={(nextRecords) => setReorderedRecords(nextRecords)}
                            pagination={{ limit: 4, align: 'end', sticky: false }}
                        />
                        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            <div className="font-medium">Note</div>
                            <div className="mt-1 text-xs leading-relaxed">
                                <code>onReorder</code> controls the visible order in table mode.
                                Do not rely on <code>sortable</code> or <code>source.order</code> in the same view.
                                If they are combined, manual reorder takes precedence, sorting is ignored, and the component logs a warning.
                            </div>
                        </div>
                    </div>
                )}
                code={`const [records, setRecords] = useState(seedRecords);

<Grid
  source={records}
  view="table"
  onReorder={(reorderedRecords) => setRecords(reorderedRecords)}
/>`}
            />

            <Section
                title="Gallery mode with grouping"
                description="The same Grid contract can flip to gallery mode. A db-style source can seed the initial order, selection still works, and groupBy organizes the visual result set."
                preview={(
                    <Grid
                        source={toGalleryRecords(toRecords(USERS_SEED))}
                        columns={galleryColumns}
                        title="Team assets"
                        footer="Grouped by team with the same selection semantics"
                        view="gallery"
                        groupBy=" | "
                        pagination={{ limit: 6, align: 'center', sticky: false }}
                    />
                )}
                code={`<Grid
  source={galleryRecords}
  view="gallery"
  groupBy=" | "
  pagination={{ limit: 6, align: 'center', sticky: false }}
/>`}
            />

            <Section
                title="Record click"
                description="onClick still stays simple: it receives the source record, so callers can rely directly on _key and original values."
                preview={(
                    <Grid
                        source={toGalleryRecords(toRecords(USERS_SEED))}
                        columns={baseColumns}
                        view="table"
                        onClick={(record) => setClickedKey(record._key || '')}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`const [selectedKey, setSelectedKey] = useState('');

<Grid
  source={records}
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
