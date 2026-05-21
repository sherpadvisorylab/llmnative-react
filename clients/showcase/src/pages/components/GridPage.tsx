import React from 'react';
import {
    ActionButton,
    Badge,
    DataProvider,
    Email,
    Grid,
    GridArray,
    GridDB,
    MockDataProvider,
    Select,
    String as TextField,
    Tab,
    TabItem,
} from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PlaygroundConfig, PropDef } from '../../types/playground';

type UserRecord = {
    _key?: string;
    id?: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive' | 'review';
    team: string;
    city: string;
    img?: React.ReactNode;
};

const GRID_SOURCE_PATH = '/showcase/grid/users';

const USERS: Record<string, Omit<UserRecord, '_key' | 'img'>> = {
    u1: { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', city: 'Milan' },
    u2: { name: 'Mark Williams', email: 'mark@example.com', role: 'editor', status: 'active', team: 'Marketing', city: 'Berlin' },
    u3: { name: 'Sara Green', email: 'sara@example.com', role: 'viewer', status: 'inactive', team: 'Support', city: 'Madrid' },
    u4: { name: 'Luke Black', email: 'luke@example.com', role: 'editor', status: 'review', team: 'Product', city: 'Remote' },
    u5: { name: 'Julia Brown', email: 'julia@example.com', role: 'admin', status: 'active', team: 'Operations', city: 'Rome' },
    u6: { name: 'Noah White', email: 'noah@example.com', role: 'viewer', status: 'active', team: 'Support', city: 'Paris' },
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

const toArrayRecords = () => (
    Object.entries(USERS).map(([_key, record]) => ({
        _key,
        id: _key,
        ...record,
    }))
);

const toGalleryRecords = () => (
    toArrayRecords().map((record) => ({
        ...record,
        img: (
            <img
                src={`https://placehold.co/960x640/E2E8F0/0F172A?text=${encodeURIComponent(`${record.team}\n${record.city}\n${record.name}`)}`}
                alt={`${record.team} | ${record.name}`}
            />
        ),
    }))
);

const baseColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: ({ value }: { value: string }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: ({ value }: { value: string }) => <Badge className={statusClass(value)}>{value}</Badge>,
    },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'city', label: 'City', sortable: true },
];

const compactColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: ({ value }: { value: string }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
];

const explicitCompactColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
];

const nonSortableCompactColumns = [
    { key: 'name', label: 'Name', sortable: false },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'role', label: 'Role', sortable: false },
];

const partiallySortableCompactColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'role', label: 'Role', sortable: false },
];

function WithMock({ children }: { children: React.ReactNode }) {
    const provider = React.useMemo(() => new MockDataProvider({
        [GRID_SOURCE_PATH]: USERS,
        '/components/grid/users': USERS,
    }), []);

    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

function GridUserForm() {
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

type ExampleTab = {
    label: string;
    title?: string;
    description?: string;
    preview: React.ReactNode;
    code: string;
};

function TabbedSection({
    title,
    description,
    tabs,
}: {
    title: string;
    description?: string;
    tabs: ExampleTab[];
}) {
    return (
        <div className="border rounded-lg bg-card">
            <div className="px-5 pt-4">
                <div>
                    <h2 className="font-semibold text-foreground">{title}</h2>
                    {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
                </div>
                <div className="mt-4">
                    <Tab tabPosition="default">
                    {tabs.map((tab) => (
                        <TabItem key={tab.label} label={tab.label}>
                            <TabbedSectionBody tab={tab} />
                        </TabItem>
                    ))}
                    </Tab>
                </div>
            </div>
        </div>
    );
}

function TabbedSectionBody({ tab }: { tab: ExampleTab }) {
    const [copied, setCopied] = React.useState(false);

    const copy = () => {
        navigator.clipboard.writeText(tab.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-5">
            {(tab.title || tab.description) ? (
                <div className="space-y-1">
                    {tab.title ? <h3 className="text-base font-semibold text-foreground">{tab.title}</h3> : null}
                    {tab.description ? <p className="text-sm text-muted-foreground">{tab.description}</p> : null}
                </div>
            ) : null}
            <div className="flex flex-wrap gap-3 items-start min-h-[80px]">
                {tab.preview}
            </div>
            <div className="relative border-t bg-muted/50 -mx-6 -mb-6 px-0 pb-0 overflow-hidden">
                <button
                    onClick={copy}
                    className="absolute right-3 top-3 text-xs px-2 py-1 rounded border bg-background hover:bg-accent transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <pre className="p-5 text-xs text-foreground overflow-x-auto leading-relaxed">
                    <code>{tab.code.trim()}</code>
                </pre>
            </div>
        </div>
    );
}

function MinimalGridPreview() {
    return (
        <WithMock>
            <Grid path={GRID_SOURCE_PATH} pagination={{ limit: 4, align: 'end', sticky: false }} />
        </WithMock>
    );
}

function SingleSelectionPreview() {
    const [clickedKey, setClickedKey] = React.useState('');

    return (
        <div className="space-y-3">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                columns={compactColumns}
                title="Choose one option"
                selection="single"
                selectedKeys={clickedKey ? [clickedKey] : []}
                onSelectionChange={(selection) => setClickedKey(selection.keys[0] || '')}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
            <div className="text-xs text-muted-foreground">
                Active key: <span className="font-mono">{clickedKey || 'none'}</span>
            </div>
        </div>
    );
}

function MultipleSelectionPreview() {
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);

    return (
        <div className="space-y-3">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                columns={compactColumns}
                title="Bulk selection"
                selection="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={(selection) => {
                    setSelectedKeys(selection.keys);
                    setSelectedRecords(selection.records as UserRecord[]);
                }}
                actions={{
                    exportSelected: {
                        kind: 'modal',
                        label: 'Export selected',
                        disabled: () => !selectedKeys.length,
                        title: `Export ${selectedKeys.length} selected`,
                        render: () => (
                            <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                                {JSON.stringify(selectedRecords, null, 2)}
                            </pre>
                        ),
                    },
                }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </div>
    );
}

function CrudPresetPreview() {
    return (
        <WithMock>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={compactColumns}
                title="Preset CRUD"
                form={<GridUserForm />}
                actions={['add', 'edit', 'delete']}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function RouteActionPreview() {
    return (
        <WithMock>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={compactColumns}
                title="Route action"
                actions={{
                    add: {
                        kind: 'route',
                        label: 'Go to create page',
                        to: '/components/grid/create',
                    },
                }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function ActionsPreview() {
    const [copied, setCopied] = React.useState(false);

    return (
        <WithMock>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={baseColumns}
                title="Team directory"
                form={<GridUserForm />}
                actions={{
                    add: {
                        kind: 'modal',
                        title: 'Add teammate',
                        size: 'lg',
                        position: 'center',
                    },
                    edit: {
                        kind: 'modal',
                        size: 'xl',
                        position: 'right',
                        title: ({ record }) => `Review ${record?.name}`,
                        render: ({ record, open }) => (
                            <div className="space-y-4">
                                <div>
                                    <div className="text-lg font-semibold">{record?.name}</div>
                                    <div className="text-sm text-muted-foreground">{record?.email}</div>
                                </div>
                                <div className="grid gap-2 text-sm">
                                    <div><span className="font-medium">Role:</span> {record?.role}</div>
                                    <div><span className="font-medium">Status:</span> {record?.status}</div>
                                    <div><span className="font-medium">Team:</span> {record?.team}</div>
                                    <div><span className="font-medium">City:</span> {record?.city}</div>
                                </div>
                                <div className="flex flex-wrap justify-end gap-2">
                                    <ActionButton label="Delete teammate" className="btn-danger btn-sm" onClick={() => open('delete', record)} />
                                </div>
                            </div>
                        ),
                    },
                    delete: {
                        kind: 'delete',
                        size: 'sm',
                        position: 'center',
                        confirmTitle: ({ record }) => `Delete ${record?.name}?`,
                        confirmBody: ({ record }) => (
                            <div className="text-sm">
                                This teammate will be removed from the mock provider: <span className="font-medium">{record?.email}</span>
                            </div>
                        ),
                    },
                    preview: {
                        kind: 'route',
                        label: 'Preview',
                        to: ({ record }) => `/components/grid/preview?record=${record?._key || ''}`,
                    },
                    copy: {
                        kind: 'inline',
                        label: copied ? 'Copied' : 'Copy email',
                        run: async ({ record }) => {
                            if (!record?.email) return;
                            await navigator.clipboard.writeText(record.email);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1000);
                        },
                    },
                }}
                header={({ title, open, selection }) => (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div>{title}</div>
                            <div className="text-xs text-muted-foreground">
                                Add opens a centered form, edit docks to the right, and delete stays compact.
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ActionButton label="Add teammate" onClick={() => open('add')} />
                            {selection.hasSelection ? (
                                <span className="text-xs text-muted-foreground">{selection.keys.length} selected</span>
                            ) : null}
                        </div>
                    </div>
                )}
            />
        </WithMock>
    );
}

const GRID_PROPS: PropDef[] = [
    { name: 'records', type: 'RecordArray', description: 'Use with GridArray when the caller already owns the full record set.', group: 'Data' },
    { name: 'recordId', type: 'keyof TRecord | ((record) => string)', description: 'Stable record key strategy for selection, reorder and edit state.', group: 'Data' },
    { name: 'path', type: 'string', description: 'Use with GridDB when records come from a DataProvider collection path.', group: 'Data' },
    { name: 'where', type: 'WhereClause', description: 'Optional provider-side filtering for GridDB.', control: 'json', group: 'Data' },
    { name: 'order', type: 'OrderClause', description: 'Optional provider-side ordering for GridDB.', control: 'json', group: 'Data' },
    { name: 'fieldMap', type: 'Record<string,string>', description: 'Optional provider-side field remapping for GridDB.', control: 'json', group: 'Data' },
    { name: 'onLoad', type: '(data) => data', description: 'Optional provider-side normalization hook for GridDB responses.', group: 'Data' },
    { name: 'columns', type: 'GridColumn<TRecord>[]', description: 'Column definitions with sortable, format and render hooks.', group: 'Display' },
    { name: 'layout', type: '"table" | "gallery"', default: '"table"', description: 'Visual surface used by GridCore.', control: 'select', options: ['table', 'gallery'], group: 'Display' },
    { name: 'sortable', type: 'boolean | OrderConfig', default: 'true', description: 'Enables sorting or sets the initial sort order.', control: 'json', group: 'Display' },
    { name: 'pagination', type: 'PaginationParams', description: 'Shared pagination configuration forwarded to Table or Gallery.', control: 'json', group: 'Display' },
    { name: 'groupBy', type: 'string | string[]', description: 'Gallery grouping separators or field names.', control: 'text', group: 'Display' },
    { name: 'title', type: 'ReactNode', description: 'Title used by the default card header.', control: 'text', group: 'Layout' },
    { name: 'header', type: 'ReactNode | ((ctx) => ReactNode)', description: 'Optional custom header. Receives title, records, selection and open().', group: 'Layout' },
    { name: 'footer', type: 'ReactNode | ((ctx) => ReactNode)', description: 'Optional custom footer. Receives records, selection and open().', group: 'Layout' },
    { name: 'form', type: 'ReactElement | ((ctx) => ReactNode)', description: 'Default add/edit form surface for modal workflows.', group: 'Actions' },
    { name: 'actions', type: '("add" | "edit" | "delete")[] | Record<string, GridAction<TRecord>>', description: 'Action catalog with explicit kinds: modal, route, external, inline, delete. Modal and delete actions can also set size and position.', group: 'Actions' },
    { name: 'selection', type: 'false | "single" | "multiple"', default: 'false', description: 'Explicit selection mode for table and gallery.', control: 'select', options: ['false', 'single', 'multiple'], group: 'Behavior' },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection keys.', group: 'Behavior' },
    { name: 'defaultSelectedKeys', type: 'string[]', description: 'Uncontrolled initial selection state.', group: 'Behavior' },
    { name: 'onSelectionChange', type: '(selection) => void', description: 'Selection callback with keys, records, clear() and hasSelection.', group: 'Behavior' },
    { name: 'onClickRow', type: '(record) => void', description: 'Called with the original record after row or card click.', group: 'Behavior' },
    { name: 'reorderable', type: 'boolean', default: 'false', description: 'Turns on row drag in table mode when used together with onReorder.', control: 'boolean', group: 'Behavior' },
    { name: 'onReorder', type: '(records, meta) => void', description: 'Receives the reordered source records and drag metadata.', group: 'Behavior' },
    { name: 'routeSync', type: '{ edit?: boolean }', description: 'Opt-in edit hash sync for modal editing workflows.', control: 'json', group: 'Behavior' },
    { name: 'transformRecords', type: '(records) => records | Promise<records>', description: 'Normalize or enrich records before display.', group: 'Data lifecycle' },
    { name: 'createRecordKey', type: '(record) => string', description: 'Provider-backed create key override used when saving new records.', group: 'Data lifecycle' },
    { name: 'onSave', type: '(args) => Promise<string | undefined>', description: 'Override the save target path or implement custom persistence.', group: 'Data lifecycle' },
    { name: 'onDelete', type: '(args) => Promise<string | undefined>', description: 'Override the delete target path before provider removal.', group: 'Data lifecycle' },
    { name: 'onAfterAction', type: '(args) => Promise<boolean>', description: 'Post-action hook used to keep or close the current workflow.', group: 'Data lifecycle' },
    { name: 'audit', type: 'boolean', default: 'false', description: 'Enables form-level audit logging during modal saves.', control: 'boolean', group: 'Data lifecycle' },
];

function GridPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const [selectionKeys, setSelectionKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);
    const [records, setRecords] = React.useState<UserRecord[]>(toArrayRecords());
    const layout = p.layout as 'table' | 'gallery';
    const useProvider = p.useProvider === true;
    const useGallery = layout === 'gallery';
    const previewRecords = useGallery ? toGalleryRecords() : records;

    return (
        <WithMock>
            <div className="space-y-4">
                {useProvider ? (
                    <GridDB
                        path={GRID_SOURCE_PATH}
                        order={{ name: 'asc' }}
                        columns={baseColumns}
                        title={p.title || 'Playground grid'}
                        layout={layout}
                        form={<GridUserForm />}
                        actions={['add', 'edit', 'delete']}
                        selection={p.selection === 'false' ? false : p.selection}
                        selectedKeys={p.selection === 'false' ? undefined : selectionKeys}
                        onSelectionChange={p.selection === 'false' ? undefined : (selection) => {
                            setSelectionKeys(selection.keys);
                            setSelectedRecords(selection.records as UserRecord[]);
                        }}
                        routeSync={{ edit: p.routeSync }}
                        sortable={p.sortable ? { field: 'name', dir: 'asc' } : false}
                        pagination={{ limit: Number(p.limit || 4), align: 'end', sticky: false }}
                        groupBy={useGallery ? ' | ' : undefined}
                    />
                ) : (
                    <GridArray
                        records={previewRecords}
                        recordId="_key"
                        columns={baseColumns}
                        title={p.title || 'Playground grid'}
                        layout={layout}
                        form={<GridUserForm />}
                        actions={['add', 'edit', 'delete']}
                        selection={p.selection === 'false' ? false : p.selection}
                        selectedKeys={p.selection === 'false' ? undefined : selectionKeys}
                        onSelectionChange={p.selection === 'false' ? undefined : (selection) => {
                            setSelectionKeys(selection.keys);
                            setSelectedRecords(selection.records as UserRecord[]);
                        }}
                        sortable={p.sortable ? { field: 'name', dir: 'asc' } : false}
                        pagination={{ limit: Number(p.limit || 4), align: 'end', sticky: false }}
                        reorderable={!useGallery && p.reorderable}
                        onReorder={!useGallery && p.reorderable ? (nextRecords) => setRecords(nextRecords) : undefined}
                        groupBy={useGallery ? ' | ' : undefined}
                    />
                )}

                <div className="grid gap-3 xl:grid-cols-2">
                    <div className="rounded-md border bg-muted/40 p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selection payload</div>
                        <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                            {JSON.stringify({
                                keys: selectionKeys,
                                records: selectedRecords.map((record) => record._key || record.email),
                                hasSelection: selectionKeys.length > 0,
                            }, null, 2)}
                        </pre>
                    </div>
                    <div className="rounded-md border bg-muted/40 p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current array order</div>
                        <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                            {JSON.stringify(records.map((record) => record._key), null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </WithMock>
    );
}

const PLAYGROUND: PlaygroundConfig = {
    size: 'fullscreen',
    layout: 'split',
    mockSeed: {
        [GRID_SOURCE_PATH]: USERS,
    },
    props: [
        { name: 'useProvider', type: 'boolean', default: 'true', description: 'Switch between GridDB and GridArray.', control: 'boolean' },
        { name: 'layout', type: '"table" | "gallery"', default: '"table"', description: 'Layout rendered by GridCore.', control: 'select', options: ['table', 'gallery'] },
        { name: 'selection', type: 'false | "single" | "multiple"', default: '"multiple"', description: 'Selection mode used in the preview.', control: 'select', options: ['false', 'single', 'multiple'] },
        { name: 'sortable', type: 'boolean', default: 'true', description: 'Turns on initial client-side sorting.', control: 'boolean' },
        { name: 'reorderable', type: 'boolean', default: 'false', description: 'Turns on drag reorder in table mode.', control: 'boolean', hidden: (props) => props.layout === 'gallery' },
        { name: 'routeSync', type: 'boolean', default: 'false', description: 'Sync edit modal state to location hash.', control: 'boolean', hidden: (props) => props.layout === 'gallery' },
        { name: 'limit', type: 'number', default: '4', description: 'Pagination limit.', control: 'number', min: 2, max: 8, step: 1 },
        { name: 'title', type: 'string', default: '"Playground grid"', description: 'Header title used by the default chrome.', control: 'text' },
    ],
    defaultProps: {
        useProvider: true,
        layout: 'table',
        selection: 'multiple',
        sortable: true,
        reorderable: false,
        routeSync: false,
        limit: 4,
        title: 'Playground grid',
    },
    render: (p) => <GridPlaygroundPreview p={p} />,
};

export default function GridPage() {
    usePlayground(PLAYGROUND, 'Grid');
    const [arrayRecords, setArrayRecords] = React.useState(toArrayRecords());

    return (
        <PageLayout
            title="Grid"
            description="AI-first orchestration layer built on top of Table and Gallery. The page now moves from the smallest valid grid to progressively more explicit data, selection, action and layout patterns."
        >
            <TabbedSection
                title="How records enter Grid"
                description="This is the first decision to make. Start from the shortest working shape, then add query constraints or switch to caller-owned records when you need more control."
                tabs={[
                    {
                        label: 'Minimal',
                        title: 'Load data from an explicit path',
                        description: 'The shortest valid grid. The gateway component subscribes to a provider path and infers columns from the incoming records.',
                        preview: <MinimalGridPreview />,
                        code: `<Grid
  path="/showcase/grid/users"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Path + query',
                        title: 'GridDB with filtering and ordering',
                        description: 'The same provider-backed load, now with one filter and one order. Grid still infers the columns from the incoming records.',
                        preview: (
                            <WithMock>
                                <GridDB
                                    path={GRID_SOURCE_PATH}
                                    where={{ status: 'active' }}
                                    order={{ name: 'asc' }}
                                    pagination={{ limit: 4, align: 'end', sticky: false }}
                                />
                            </WithMock>
                        ),
                        code: `<GridDB
  path="/showcase/grid/users"
  where={{ status: "active" }}
  order={{ name: "asc" }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Array',
                        title: 'GridArray with caller-owned records',
                        description: 'Use GridArray when the caller already owns the dataset and Grid only needs to render it.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={[
    {
      _key: "u1",
      id: "u1",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "admin",
      status: "active",
      team: "Platform",
      city: "Milan",
    },
    {
      _key: "u2",
      id: "u2",
      name: "Mark Williams",
      email: "mark@example.com",
      role: "editor",
      status: "active",
      team: "Marketing",
      city: "Berlin",
    },
  ]}
  recordId="_key"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                ]}
            />

            <TabbedSection
                title="Columns"
                description="Columns are the second decision. You can let Grid infer them, declare them explicitly, or add custom renderers when one field needs a visual treatment."
                tabs={[
                    {
                        label: 'Infer',
                        title: 'No columns prop',
                        description: 'Useful for the shortest CRUD paths: Grid infers columns from the records or the form.',
                        preview: <MinimalGridPreview />,
                        code: `<Grid
  path="/showcase/grid/users"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Explicit',
                        title: 'Explicit labels and sortable fields',
                        description: 'Use this when you want the schema to be visible and predictable.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={explicitCompactColumns}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
  ]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Render',
                        title: 'Custom cell renderer',
                        description: 'When one column needs visual emphasis, keep the rest declarative and customize only that field.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={compactColumns}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: ({ value }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
  ]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                ]}
            />

            <TabbedSection
                title="Sorting"
                description="Sorting can stay fully enabled, be disabled entirely, or be limited to just the fields that benefit from it."
                tabs={[
                    {
                        label: 'Off',
                        title: 'No sorting',
                        description: 'Disable sorting when the order is fixed or when the grid is only meant to present records.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={nonSortableCompactColumns}
                                sortable={false}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: false },
    { key: "email", label: "Email", sortable: false },
    { key: "role", label: "Role", sortable: false },
  ]}
  sortable={false}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Some fields',
                        title: 'Sorting only where it helps',
                        description: 'Keep sorting on the fields users actually compare, and leave the others static.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={partiallySortableCompactColumns}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: false },
    { key: "role", label: "Role", sortable: false },
  ]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Default',
                        title: 'Classic sortable grid',
                        description: 'This is the default behavior: sortable columns stay active and Grid lets the table manage the sort interaction.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={explicitCompactColumns}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
  ]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                ]}
            />

            <TabbedSection
                title="Selection modes"
                description="Selection should teach one idea at a time. Single selection behaves like an active row, while multiple selection unlocks bulk commands."
                tabs={[
                    {
                        label: 'Single',
                        title: 'Single selection with radio buttons',
                        description: 'Single selection shows one radio per row. Choose the record from the control at the left, and click the same radio again to clear it.',
                        preview: <SingleSelectionPreview />,
                        code: `const [clickedKey, setClickedKey] = useState("");

<GridArray
  records={records}
  recordId="_key"
  columns={columns}
  title="Choose one option"
  selection="single"
  selectedKeys={clickedKey ? [clickedKey] : []}
  onSelectionChange={(selection) => setClickedKey(selection.keys[0] || "")}
/>`,
                    },
                    {
                        label: 'Multiple',
                        title: 'Multiple selection for bulk actions',
                        description: 'Multiple selection is the right mode for bulk actions. Here the export command is a real Grid action, not a custom header button.',
                        preview: <MultipleSelectionPreview />,
                        code: `const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<GridArray
  records={records}
  recordId="_key"
  columns={columns}
  title="Bulk selection"
  selection="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={(selection) => {
    setSelectedKeys(selection.keys);
    setSelectedRecords(selection.records);
  }}
  actions={{
    exportSelected: {
      kind: "modal",
      label: "Export selected",
      disabled: () => !selectedKeys.length,
      title: \`Export \${selectedKeys.length} selected\`,
      render: () => (
        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(selectedRecords, null, 2)}
        </pre>
      ),
    },
  }}
/>`,
                    },
                ]}
            />

            <TabbedSection
                title="Actions and editing"
                description="Start from the preset when all you need is CRUD. Switch to explicit action kinds when you want to demonstrate intent, modal posture and custom workflows."
                tabs={[
                    {
                        label: 'CRUD preset',
                        title: 'Preset add/edit/delete',
                        description: 'This is the shortest path to add, edit and delete with the shared form.',
                        preview: <CrudPresetPreview />,
                        code: `<GridDB
  path="/showcase/grid/users"
  order={{ name: "asc" }}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: ({ value }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
  ]}
  title="Preset CRUD"
  form={<GridUserForm />}
  actions={["add", "edit", "delete"]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Custom kinds',
                        title: 'Explicit modal kinds',
                        description: 'The same CRUD surface with explicit action kinds and different modal positions for add, edit and delete.',
                        preview: <ActionsPreview />,
                        code: `<GridDB
  path="/showcase/grid/users"
  order={{ name: "asc" }}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: ({ value }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
  ]}
  form={<GridUserForm />}
  actions={{
    add: {
      kind: "modal",
      title: "Add teammate",
      size: "lg",
      position: "center",
    },
    edit: {
      kind: "modal",
      size: "xl",
      position: "right",
      title: ({ record }) => \`Review \${record?.name}\`,
    },
    delete: {
      kind: "delete",
      size: "sm",
      position: "center",
      confirmTitle: ({ record }) => \`Delete \${record?.name}?\`,
    },
  }}
/>`,
                    },
                    {
                        label: 'Route',
                        title: 'Routing action',
                        description: 'Use a route action when the next step belongs to navigation, not to a modal workflow.',
                        preview: <RouteActionPreview />,
                        code: `<GridDB
  path="/showcase/grid/users"
  order={{ name: "asc" }}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: ({ value }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
  ]}
  actions={{
    add: {
      kind: "route",
      label: "Go to create page",
      to: "/components/grid/create",
    },
  }}
/>`,
                    },
                ]}
            />

            <Section
                title="Drag reorder"
                description="reorderable makes the drag intent explicit. Pair it with onReorder to receive the full source record set in its new order."
                preview={(
                    <GridArray
                        records={arrayRecords}
                        recordId="_key"
                        columns={baseColumns}
                        title="Manual ordering"
                        sortable={false}
                        reorderable
                        onReorder={(records) => setArrayRecords(records)}
                        footer={() => (
                            <div className="text-xs text-muted-foreground">
                                Current order: {arrayRecords.map((record) => record._key).join(', ')}
                            </div>
                        )}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`const [records, setRecords] = useState(seedRecords);

<GridArray
  records={records}
  recordId="_key"
  columns={columns}
  title="Manual ordering"
  sortable={false}
  reorderable
  onReorder={(nextRecords) => setRecords(nextRecords)}
/>`}
            />

            <TabbedSection
                title="Layout surface"
                description="Table and gallery keep the same Grid contract. The examples below isolate the visual switch so the layout change is the only thing to focus on."
                tabs={[
                    {
                        label: 'Table',
                        title: 'Table layout',
                        description: 'The default surface for lists, sorting, row click and reorder.',
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={compactColumns}
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: ({ value }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
  ]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Gallery',
                        title: 'Gallery layout',
                        description: 'The same data contract rendered as cards, still supporting selection and grouping.',
                        preview: (
                            <GridArray
                                records={toGalleryRecords()}
                                recordId="_key"
                                columns={baseColumns}
                                layout="gallery"
                                selection="multiple"
                                groupBy=" | "
                                pagination={{ limit: 6, align: 'center', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={galleryRecords}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: ({ value }) => <Badge className={roleClass(value)}>{value}</Badge>,
    },
  ]}
  layout="gallery"
  selection="multiple"
  groupBy=" | "
  pagination={{ limit: 6, align: "center", sticky: false }}
/>`,
                    },
                ]}
            />

            <PropsTable props={GRID_PROPS} />
        </PageLayout>
    );
}
