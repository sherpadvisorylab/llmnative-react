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
} from '@ash/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import { definePropDocs } from '../../types/propDocs';
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

type GridDocSurface = {
    records: unknown;
    recordId: unknown;
    path: unknown;
    where: unknown;
    order: unknown;
    fieldMap: unknown;
    onLoad: unknown;
    columns: unknown;
    layout: unknown;
    sortable: unknown;
    pagination: unknown;
    groupBy: unknown;
    title: unknown;
    header: unknown;
    footer: unknown;
    form: unknown;
    actions: unknown;
    selection: unknown;
    selectedKeys: unknown;
    defaultSelectedKeys: unknown;
    onSelectionChange: unknown;
    onClickRow: unknown;
    reorderable: unknown;
    onReorder: unknown;
    routeSync: unknown;
    transformRecords: unknown;
    createRecordKey: unknown;
    onSave: unknown;
    onDelete: unknown;
    onAfterAction: unknown;
    audit: unknown;
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

const createMockSeed = () => ({
    [GRID_SOURCE_PATH]: Object.fromEntries(
        Object.entries(USERS).map(([key, record]) => [key, { ...record }]),
    ),
    '/components/grid/users': Object.fromEntries(
        Object.entries(USERS).map(([key, record]) => [key, { ...record }]),
    ),
    '/components/grid': Object.fromEntries(
        Object.entries(USERS).map(([key, record]) => [key, { ...record }]),
    ),
});

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

const galleryAccent = (role: UserRecord['role']) => (
    role === 'admin'
        ? { start: '#DBEAFE', end: '#BFDBFE', ink: '#1E3A8A' }
        : role === 'editor'
            ? { start: '#DCFCE7', end: '#BBF7D0', ink: '#166534' }
            : { start: '#F3E8FF', end: '#E9D5FF', ink: '#6B21A8' }
);

const buildGalleryThumb = (record: UserRecord) => {
    const palette = galleryAccent(record.role);
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.start}"/>
      <stop offset="100%" stop-color="${palette.end}"/>
    </linearGradient>
  </defs>
  <rect width="720" height="540" rx="36" fill="url(#g)"/>
  <rect x="34" y="34" width="188" height="42" rx="21" fill="rgba(255,255,255,0.72)"/>
  <text x="128" y="61" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${palette.ink}">
    ${record.role.toUpperCase()}
  </text>
  <text x="48" y="340" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#0F172A">
    ${record.name}
  </text>
  <text x="48" y="396" font-family="Arial, sans-serif" font-size="26" font-weight="600" fill="#334155">
    ${record.team}
  </text>
  <text x="48" y="432" font-family="Arial, sans-serif" font-size="22" fill="#475569">
    ${record.city}
  </text>
  <circle cx="624" cy="104" r="52" fill="rgba(255,255,255,0.6)"/>
  <circle cx="590" cy="446" r="88" fill="rgba(255,255,255,0.35)"/>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const toArrayRecords = () => (
    Object.entries(USERS).map(([_key, record]) => ({
        _key,
        id: _key,
        ...record,
    }))
);

const withGalleryThumbs = (records: UserRecord[]) => (
    records.map((record) => ({
        ...record,
        img: (
            <img
                src={buildGalleryThumb(record)}
                alt={`${record.role} | ${record.team} | ${record.name}`}
                style={{ aspectRatio: '4 / 3' }}
            />
        ),
    }))
);

const toGalleryRecords = () => withGalleryThumbs(toArrayRecords());

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

const layoutColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'city', label: 'City', sortable: true },
];

function WithMock({
    children,
    provider,
}: {
    children: React.ReactNode;
    provider?: MockDataProvider;
}) {
    const scopedProvider = React.useMemo(() => provider ?? new MockDataProvider(createMockSeed()), [provider]);

    return (
        <DataProvider registry={{ default: scopedProvider }} defaultKey="default">
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
        <div className="overflow-hidden rounded-lg border bg-card">
            <div className="px-5 pt-4">
                <div>
                    <h2 className="font-semibold text-foreground">{title}</h2>
                    {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
            <div className="mt-4">
                <Tab tabPosition="default" className="min-w-0">
                {tabs.map((tab) => (
                    <TabItem key={tab.label} label={tab.label}>
                        <TabbedSectionBody tab={tab} />
                    </TabItem>
                ))}
                </Tab>
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
        <div>
            <div className="space-y-5 px-5 py-5">
                {(tab.title || tab.description) ? (
                    <div className="space-y-1">
                        {tab.title ? <h3 className="text-base font-semibold text-foreground">{tab.title}</h3> : null}
                        {tab.description ? <p className="text-sm text-muted-foreground">{tab.description}</p> : null}
                    </div>
                ) : null}
                <div className="min-h-[80px] w-full min-w-0 rounded-lg bg-background p-6">
                    <div className="w-full min-w-0 max-w-5xl">
                        {tab.preview}
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden border-t bg-muted/50">
                <div className="absolute right-3 top-3">
                    <ActionButton variant="secondary" className="btn-sm" label={copied ? 'Copied!' : 'Copy'} onClick={copy} />
                </div>
                <pre className="overflow-x-auto p-5 pr-20 text-xs leading-relaxed text-foreground">
                    <code>{tab.code.trim()}</code>
                </pre>
            </div>
        </div>
    );
}

function MinimalGridPreview() {
    return (
        <WithMock>
            <Grid path={GRID_SOURCE_PATH} wrapClass="w-full" pagination={{ limit: 4, align: 'end', sticky: false }} />
        </WithMock>
    );
}

function FromUrlGridPreview() {
    return (
        <WithMock>
            <Grid path="fromUrl" wrapClass="w-full" pagination={{ limit: 4, align: 'end', sticky: false }} />
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
                title="Choose one option"
                wrapClass="w-full"
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
                title="Bulk selection"
                wrapClass="w-full"
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
                        body: () => (
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

function CrudPresetPreview({ provider }: { provider: MockDataProvider }) {
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={explicitCompactColumns}
                title="Preset CRUD"
                wrapClass="w-full"
                form={<GridUserForm />}
                actions={['add', 'edit', 'delete']}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function RouteActionPreview({ provider }: { provider: MockDataProvider }) {
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={explicitCompactColumns}
                title="Route action"
                wrapClass="w-full"
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

function ActionsPreview({ provider }: { provider: MockDataProvider }) {
    const actionColumns = React.useMemo(() => ([
        ...explicitCompactColumns,
        {
            key: 'actions',
            label: '',
            sortable: false,
            className: 'text-end',
            render: ({ record, runAction }: { record: UserRecord; runAction: (actionKey: string) => void }) => (
                <div className="flex justify-end">
                    <ActionButton
                        icon="eye"
                        title={`Preview ${record.name}`}
                        variant="link"
                        onClick={() => runAction('preview')}
                    />
                </div>
            ),
        },
    ]), []);

    return (
        <WithMock provider={provider}>
            <>
                <GridDB
                    path={GRID_SOURCE_PATH}
                    order={{ name: 'asc' }}
                    columns={actionColumns}
                    title="Team directory"
                    wrapClass="w-full"
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
                            size: 'lg',
                            position: 'left',
                            title: ({ record }) => `Edit ${record?.name}`,
                            body: () => <GridUserForm />,
                            footer: ({ runAction }) => (
                                <>
                                    <ActionButton label="Save" onClick={() => runAction('save')} />
                                    <ActionButton variant="danger" label="Delete" onClick={() => runAction('remove')} />
                                </>
                            ),
                        },
                        delete: {
                            kind: 'delete',
                            size: 'sm',
                            position: 'center',
                            title: ({ record }) => `Delete ${record?.name}?`,
                            body: ({ record }) => (
                                <div className="text-sm">
                                    This teammate will be removed from the mock provider: <span className="font-medium">{record?.email}</span>
                                </div>
                            ),
                        },
                        preview: {
                            kind: 'modal',
                            label: 'Preview',
                            size: 'xl',
                            position: 'right',
                            title: ({ record }) => record?.name,
                            header: ({ record }) => (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                    <span>{record?.email}</span>
                                    <span>{record?.role}</span>
                                    <span>{record?.status}</span>
                                    <span>{record?.team}</span>
                                    <span>{record?.city}</span>
                                </div>
                            ),
                            body: ({ record }) => (
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
                                </div>
                            ),
                            footer: false,
                        },
                    }}
                    header={({ title, runAction, selection }) => (
                        <div className="flex w-full items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div>{title}</div>
                                <div className="text-xs text-muted-foreground">
                                    Add opens a centered form, the custom edit footer keeps only save and delete, the base edit workflow still includes save, delete and cancel automatically, and the extra preview action docks to the right.
                                </div>
                            </div>
                            <div className="ml-auto flex shrink-0 items-center gap-2">
                                <ActionButton label="Add teammate" onClick={() => runAction('add')} />
                                {selection.hasSelection ? (
                                    <span className="text-xs text-muted-foreground">{selection.keys.length} selected</span>
                                ) : null}
                            </div>
                        </div>
                    )}
                    pagination={{ limit: 4, align: 'end', sticky: false }}
                />
            </>
        </WithMock>
    );
}

const GRID_PROP_DOCS = definePropDocs<GridDocSurface>()([
    { name: 'records', type: 'RecordArray', description: 'Use with GridArray when the caller already owns the full record set.', category: 'Data' },
    { name: 'recordId', type: 'keyof TRecord | ((record) => string)', description: 'Stable record key strategy for selection, reorder and edit state.', category: 'Data' },
    { name: 'path', type: 'string | "fromUrl"', description: 'Use with GridDB when records come from a DataProvider collection path. "fromUrl" forwards the current pathname as-is.', category: 'Data' },
    {
        name: 'where',
        type: 'WhereClause',
        shape: `{
  [field: string]:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[]
    | {
        eq?: string | number | boolean | null
        gt?: string | number | boolean
        gte?: string | number | boolean
        lt?: string | number | boolean
        lte?: string | number | boolean
        in?: string[] | number[]
        nin?: string[] | number[]
      }
}`,
        description: 'Optional provider-side filtering for GridDB.',
        category: 'Data',
    },
    {
        name: 'order',
        type: 'OrderClause',
        shape: `{
  [field: string]: "asc" | "desc"
}`,
        description: 'Optional provider-side ordering for GridDB.',
        category: 'Data',
    },
    {
        name: 'fieldMap',
        type: 'Record<string, string>',
        shape: `{
  [targetField: string]: string
}`,
        description: 'Optional provider-side field remapping for GridDB. Useful when the provider record shape does not match the UI field names.',
        category: 'Data',
    },
    {
        name: 'onLoad',
        type: '(data) => data',
        shape: `(
  data: Record<string, Record<string, any>>
) => Record<string, Record<string, any>>`,
        description: 'Optional provider-side normalization hook for GridDB responses before Grid converts them into records.',
        category: 'Data',
    },
    {
        name: 'columns',
        type: 'GridColumn<TRecord>[]',
        shape: `Array<{
  key: keyof TRecord | string
  label: string
  sortable?: boolean
  className?: string
  render?:
    | "text"
    | "email"
    | "date"
    | "datetime"
    | "badge"
    | "image"
    | "boolean"
    | "json"
    | ((ctx: {
        record: TRecord
        value: unknown
        key: string
        rowIndex: number
        runAction: (actionKey: string) => void
      }) => React.ReactNode)
}>`,
        example: `columns={[
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "role",
    label: "Role",
    render: "badge",
  },
  {
    key: "actions",
    label: "",
    sortable: false,
    render: ({ runAction }) => (
      <ActionButton icon="eye" variant="link" onClick={() => runAction("preview")} />
    ),
  },
]}`,
        description: 'Column definitions with sortable, className and render support. The render function receives a record-bound runAction().',
        category: 'Display',
    },
    { name: 'layout', type: '"table" | "gallery"', default: '"table"', description: 'Visual surface used by GridCore.', category: 'Display' },
    {
        name: 'sortable',
        type: 'boolean | OrderConfig',
        shape: `{
  [field: string]: "asc" | "desc"
}`,
        default: 'true',
        description: 'Enables sorting or sets the initial sort order.',
        category: 'Display',
    },
    {
        name: 'pagination',
        type: 'PaginationParams',
        shape: `{
  limit?: number
  align?: "start" | "center" | "end"
  sticky?: false | "top" | "bottom"
}`,
        description: 'Shared pagination configuration forwarded to Table or Gallery.',
        category: 'Display',
    },
    { name: 'groupBy', type: 'string | string[]', description: 'Gallery grouping separators or field names.', category: 'Display' },
    { name: 'title', type: 'ReactNode', description: 'Title used by the default card header.', category: 'Layout' },
    {
        name: 'header',
        type: 'ReactNode | ((ctx) => ReactNode)',
        shape: `ReactNode | ((ctx: {
  title?: ReactNode
  records: TRecord[]
  selection: GridSelectionState<TRecord>
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
        description: 'Optional custom header. Use this to replace the default title row with your own layout and actions.',
        category: 'Layout',
    },
    {
        name: 'footer',
        type: 'ReactNode | ((ctx) => ReactNode)',
        shape: `ReactNode | ((ctx: {
  records: TRecord[]
  selection: GridSelectionState<TRecord>
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
        description: 'Optional custom footer. Useful for bulk summaries, custom pagination wrappers or extra actions.',
        category: 'Layout',
    },
    {
        name: 'form',
        type: 'ReactElement | ((ctx) => ReactNode)',
        shape: `ReactElement | ((ctx: {
  actionKey: string
  record?: TRecord
  recordKey?: string
  rowIndex?: number
  isNewRecord: boolean
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
        description: 'Default add/edit form surface for CRUD workflows. Grid wraps it in Form automatically when the active action is add or edit.',
        category: 'Actions',
    },
    {
        name: 'actions',
        type: '("add" | "edit" | "delete")[] | Record<string, GridAction<TRecord>>',
        shape: `Shortcut
("add" | "edit" | "delete")[]

Explicit map
Record<string, false | GridAction<TRecord>>

Modal / delete
{
  kind: "modal" | "delete"
  label?: string
  icon?: string
  visible?: boolean | ((record?: TRecord) => boolean)
  disabled?: boolean | ((record?: TRecord) => boolean)
  title?: ReactNode | ((ctx) => ReactNode)
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen"
  position?: "center" | "top" | "left" | "right" | "bottom"
  buttonFullscreen?: boolean
  header?: ReactNode | ((ctx) => ReactNode)
  body?: ReactNode | ((ctx) => ReactNode)
  footer?: ReactNode | false | ((ctx) => ReactNode)
}

Route
{
  kind: "route"
  label?: string
  icon?: string
  to: string | ((ctx) => string)
}

External
{
  kind: "external"
  label?: string
  icon?: string
  href: string | ((ctx) => string)
}

Inline
{
  kind: "inline"
  label?: string
  icon?: string
  run: (ctx) => void | Promise<void>
}`,
        example: `actions={["add", "edit", "delete"]}

actions={{
  add: {
    kind: "modal",
    title: "Add teammate",
    size: "lg",
    position: "center",
  },
  preview: {
    kind: "modal",
    label: "Preview",
    position: "right",
    title: ({ record }) => record?.name,
    body: ({ record }) => <PreviewCard record={record} />,
    footer: false,
  },
  docs: {
    kind: "route",
    label: "Open docs",
    to: "/docs/grid",
  },
}}`,
        description: 'Action catalog. Use the array shortcut for standard CRUD, or the record form for explicit modal, route, external, inline and delete actions.',
        category: 'Actions',
    },
    { name: 'selection', type: 'false | "single" | "multiple"', default: 'false', description: 'Explicit selection mode for table and gallery.', category: 'Behavior' },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection keys.', category: 'Behavior' },
    { name: 'defaultSelectedKeys', type: 'string[]', description: 'Uncontrolled initial selection state.', category: 'Behavior' },
    { name: 'onSelectionChange', type: 'GridSelectionChangeHandler<TRecord>', description: 'Selection callback with keys, records, clear() and hasSelection.', shape: `type GridSelectionChangeHandler<TRecord> = (
  selection: GridSelectionState<TRecord>
) => void

type GridSelectionState<TRecord> = {
  keys: string[];
  records: TRecord[];
  clear: () => void;
  hasSelection: boolean;
}`, category: 'Behavior' },
    { name: 'onClickRow', type: '(record) => void', description: 'Called with the original record after row or card click.', category: 'Behavior' },
    { name: 'reorderable', type: 'boolean', default: 'false', description: 'Turns on row drag in table mode when used together with onReorder.', category: 'Behavior' },
    { name: 'onReorder', type: 'GridReorderHandler<TRecord>', description: 'Receives the reordered source records and drag metadata.', shape: `type GridReorderHandler<TRecord> = (
  records: TRecord[],
  meta: GridReorderMeta<TRecord>
) => void

type GridReorderMeta<TRecord> = {
  fromIndex: number;
  toIndex: number;
  record: TRecord;
}`, category: 'Behavior' },
    {
        name: 'routeSync',
        type: 'RouteSyncConfig',
        shape: `{
  edit?: boolean
}`,
        description: 'Opt-in edit hash sync for modal editing workflows.',
        category: 'Behavior',
    },
    { name: 'transformRecords', type: '(records) => records | Promise<records>', description: 'Normalize or enrich records before display.', category: 'Data lifecycle' },
    { name: 'createRecordKey', type: '(record) => string', description: 'Provider-backed create key override used when saving new records.', category: 'Data lifecycle' },
    {
        name: 'onSave',
        type: 'GridMutationSaveHandler<TRecord>',
        description: 'Override the save target path or implement custom persistence.',
        shape: `type GridMutationSaveHandler<TRecord> = (
  args: GridMutationSaveArgs<TRecord>
) => Promise<string | undefined>

type GridMutationSaveArgs<TRecord> = {
  record?: TRecord;
  action: "create" | "update";
  storagePath?: string;
}`,
        category: 'Data lifecycle',
    },
    {
        name: 'onDelete',
        type: 'GridMutationDeleteHandler<TRecord>',
        description: 'Override the delete target path before provider removal.',
        shape: `type GridMutationDeleteHandler<TRecord> = (
  args: GridMutationDeleteArgs<TRecord>
) => Promise<string | undefined>

type GridMutationDeleteArgs<TRecord> = {
  record?: TRecord;
}`,
        category: 'Data lifecycle',
    },
    {
        name: 'onAfterAction',
        type: 'GridAfterActionHandler<TRecord>',
        description: 'Post-action hook used to keep or close the current workflow.',
        shape: `type GridAfterActionHandler<TRecord> = (
  args: GridAfterActionArgs<TRecord>
) => Promise<boolean>

type GridAfterActionArgs<TRecord> = {
  record?: TRecord;
  action: "create" | "update" | "delete";
}`,
        category: 'Data lifecycle',
    },
    { name: 'audit', type: 'boolean', default: 'false', description: 'Enables form-level audit logging during modal saves.', category: 'Data lifecycle' },
]);

function GridPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const [selectionKeys, setSelectionKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);
    const [records, setRecords] = React.useState<UserRecord[]>(toArrayRecords());
    const [clickedRecordKey, setClickedRecordKey] = React.useState<string>('');
    const playgroundProvider = React.useMemo(() => new MockDataProvider(createMockSeed()), []);
    const layout = p.layout as 'table' | 'gallery';
    const useProvider = p.useProvider === true;
    const useGallery = layout === 'gallery';
    const selectionMode = p.selection === 'false' ? false : p.selection;
    const columnsMode = p.columnsMode || 'render';
    const actionsMode = p.actionsMode || 'crud';
    const groupBy = useGallery && p.groupBy !== 'none' ? p.groupBy : undefined;
    const sticky = p.sticky === 'false' ? false : p.sticky;
    const where = useProvider && p.filterStatus !== 'all' ? { status: p.filterStatus } : undefined;
    const providerPath = useProvider && p.pathMode === 'fromUrl' ? 'fromUrl' : GRID_SOURCE_PATH;
    const previewRecords = React.useMemo(() => (
        useGallery ? withGalleryThumbs(records) : records
    ), [records, useGallery]);
    const columns = columnsMode === 'infer'
        ? undefined
        : columnsMode === 'explicit'
            ? explicitCompactColumns
            : baseColumns;
    const actions = actionsMode === 'none'
        ? undefined
        : actionsMode === 'custom'
            ? {
                add: {
                    kind: 'modal',
                    title: 'Add teammate',
                    size: 'lg',
                    position: 'center',
                },
                edit: {
                    kind: 'modal',
                    title: ({ record }: { record?: UserRecord }) => `Edit ${record?.name}`,
                    size: 'lg',
                    position: 'left',
                    body: () => <GridUserForm />,
                    footer: ({ runAction }: { runAction: (actionKey: string) => void }) => (
                        <>
                            <ActionButton label="Save" onClick={() => runAction('save')} />
                            <ActionButton variant="danger" label="Delete" onClick={() => runAction('remove')} />
                        </>
                    ),
                },
                delete: {
                    kind: 'delete',
                    position: 'center',
                    size: 'sm',
                },
                preview: {
                    kind: 'modal',
                    label: 'Preview',
                    size: 'xl',
                    position: 'right',
                    title: ({ record }: { record?: UserRecord }) => record?.name,
                    header: ({ record }: { record?: UserRecord }) => (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <span>{record?.email}</span>
                            <span>{record?.role}</span>
                            <span>{record?.status}</span>
                            <span>{record?.team}</span>
                            <span>{record?.city}</span>
                        </div>
                    ),
                    body: ({ record }: { record?: UserRecord }) => (
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
                        </div>
                    ),
                    footer: false,
                },
            }
            : ['add', 'edit', 'delete'];

    const customHeader = p.headerMode === 'custom'
        ? ({ title, runAction, selection }: Record<string, any>) => (
            <div className="flex w-full items-start justify-between gap-3">
                <div className="min-w-0">
                    <div>{title}</div>
                    <div className="text-xs text-muted-foreground">
                        Playground header with selection summary and primary add action.
                    </div>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {actionsMode !== 'none' ? <ActionButton label="Add teammate" onClick={() => runAction('add')} /> : null}
                    {selection.hasSelection ? (
                        <span className="text-xs text-muted-foreground">{selection.keys.length} selected</span>
                    ) : null}
                </div>
            </div>
        )
        : undefined;

    const customFooter = p.footerMode === 'summary'
        ? ({ selection }: Record<string, any>) => (
            <div className="text-xs text-muted-foreground">
                {selection.hasSelection ? `${selection.keys.length} selected` : 'No active selection'}
            </div>
        )
        : undefined;

    const handleSelectionChange = selectionMode === false
        ? undefined
        : (selection: any) => {
            setSelectionKeys(selection.keys);
            setSelectedRecords(selection.records as UserRecord[]);
        };
    const handleArraySave = async ({ record, action }: { record?: UserRecord; action: 'create' | 'update' }) => {
        if (!record) return '';

        setRecords((prev) => {
            const recordKey = record._key || record.id || `u${Date.now()}`;
            const nextRecord = { ...record, _key: recordKey, id: record.id || recordKey } as UserRecord;

            if (action === 'create') {
                return [nextRecord, ...prev];
            }

            return prev.map((entry) => (
                (entry._key || entry.id) === recordKey ? nextRecord : entry
            ));
        });

        return '';
    };
    const handleArrayDelete = async ({ record }: { record?: UserRecord }) => {
        if (!record) return '';
        const recordKey = record._key || record.id;
        setRecords((prev) => prev.filter((entry) => (entry._key || entry.id) !== recordKey));
        setSelectionKeys((prev) => prev.filter((key) => key !== recordKey));
        setSelectedRecords((prev) => prev.filter((entry) => (entry._key || entry.id) !== recordKey));
        if (clickedRecordKey === recordKey) setClickedRecordKey('');
        return '';
    };

    return (
        <WithMock provider={playgroundProvider}>
            <div className="space-y-4">
                {useProvider ? (
                    <GridDB
                        path={providerPath}
                        where={where}
                        order={p.sortable ? { [p.orderField || 'name']: p.orderDir || 'asc' } : undefined}
                        columns={columns}
                        title={p.title || 'Playground grid'}
                        layout={layout}
                        form={p.formEnabled ? <GridUserForm /> : undefined}
                        actions={actions as any}
                        header={customHeader}
                        footer={customFooter}
                        loading={p.loading}
                        sticky={sticky}
                        selection={selectionMode}
                        selectedKeys={selectionMode === false ? undefined : selectionKeys}
                        onSelectionChange={handleSelectionChange}
                        onClickRow={p.clickable ? (record) => setClickedRecordKey(record._key || '') : undefined}
                        routeSync={p.routeSync && actionsMode !== 'none' && p.formEnabled ? { edit: true } : undefined}
                        sortable={p.sortable ? { field: p.orderField || 'name', dir: p.orderDir || 'asc' } : false}
                        pagination={{ limit: Number(p.limit || 4), align: 'end', sticky: false }}
                        groupBy={groupBy}
                        audit={p.audit}
                        createRecordKey={(record) => record._key || record.id || `u${Date.now()}`}
                    />
                ) : (
                    <GridArray
                        records={previewRecords}
                        recordId="_key"
                        columns={columns}
                        title={p.title || 'Playground grid'}
                        layout={layout}
                        form={p.formEnabled ? <GridUserForm /> : undefined}
                        actions={actions as any}
                        header={customHeader}
                        footer={customFooter}
                        loading={p.loading}
                        sticky={sticky}
                        selection={selectionMode}
                        selectedKeys={selectionMode === false ? undefined : selectionKeys}
                        onSelectionChange={handleSelectionChange}
                        onClickRow={p.clickable ? (record) => setClickedRecordKey(record._key || '') : undefined}
                        sortable={p.sortable ? { field: p.orderField || 'name', dir: p.orderDir || 'asc' } : false}
                        pagination={{ limit: Number(p.limit || 4), align: 'end', sticky: false }}
                        reorderable={!useGallery && p.reorderable}
                        onReorder={!useGallery && p.reorderable ? (nextRecords) => setRecords(nextRecords) : undefined}
                        groupBy={groupBy}
                        audit={p.audit}
                        createRecordKey={(record) => record._key || record.id || `u${Date.now()}`}
                        onSave={p.formEnabled && actionsMode !== 'none' ? handleArraySave : undefined}
                        onDelete={p.formEnabled && actionsMode !== 'none' ? handleArrayDelete : undefined}
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
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Runtime state</div>
                        <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                            {JSON.stringify({
                                arrayOrder: records.map((record) => record._key),
                                clickedRecordKey: clickedRecordKey || null,
                                providerPath,
                                filterStatus: p.filterStatus,
                                orderField: p.orderField,
                                orderDir: p.orderDir,
                            }, null, 2)}
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
        { name: 'pathMode', type: '"explicit" | "fromUrl"', default: '"explicit"', description: 'Choose between a fixed provider path and path="fromUrl".', control: 'select', options: ['explicit', 'fromUrl'], hidden: (props) => !props.useProvider },
        { name: 'layout', type: '"table" | "gallery"', default: '"table"', description: 'Layout rendered by GridCore.', control: 'select', options: ['table', 'gallery'] },
        { name: 'columnsMode', type: '"infer" | "explicit" | "render"', default: '"render"', description: 'Switch between inferred columns, explicit labels or rendered cells.', control: 'select', options: ['infer', 'explicit', 'render'] },
        { name: 'actionsMode', type: '"none" | "crud" | "custom"', default: '"custom"', description: 'No actions, built-in CRUD, or explicit modal kinds.', control: 'select', options: ['none', 'crud', 'custom'] },
        { name: 'formEnabled', type: 'boolean', default: 'true', description: 'Attach the shared form to add/edit workflows.', control: 'boolean', hidden: (props) => props.actionsMode === 'none' },
        { name: 'selection', type: 'false | "single" | "multiple"', default: '"multiple"', description: 'Selection mode used in the preview.', control: 'select', options: ['false', 'single', 'multiple'] },
        { name: 'sortable', type: 'boolean', default: 'true', description: 'Turns on initial client-side sorting.', control: 'boolean' },
        { name: 'orderField', type: '"name" | "email" | "team" | "city"', default: '"name"', description: 'Field used for initial sort or provider order.', control: 'select', options: ['name', 'email', 'team', 'city'], hidden: (props) => !props.sortable },
        { name: 'orderDir', type: '"asc" | "desc"', default: '"asc"', description: 'Sort direction.', control: 'select', options: ['asc', 'desc'], hidden: (props) => !props.sortable },
        { name: 'filterStatus', type: '"all" | "active" | "review" | "inactive"', default: '"all"', description: 'Provider-side filter used in GridDB mode.', control: 'select', options: ['all', 'active', 'review', 'inactive'], hidden: (props) => !props.useProvider },
        { name: 'reorderable', type: 'boolean', default: 'false', description: 'Turns on drag reorder in table mode.', control: 'boolean', hidden: (props) => props.layout === 'gallery' },
        { name: 'routeSync', type: 'boolean', default: 'false', description: 'Sync edit modal state to location hash.', control: 'boolean', hidden: (props) => props.layout === 'gallery' || props.actionsMode === 'none' || !props.formEnabled },
        { name: 'groupBy', type: '"none" | "role" | "status" | "team"', default: '"none"', description: 'Gallery grouping field.', control: 'select', options: ['none', 'role', 'status', 'team'], hidden: (props) => props.layout !== 'gallery' },
        { name: 'sticky', type: 'false | "top" | "bottom"', default: '"false"', description: 'Wrap the grid in a sticky card shell.', control: 'select', options: ['false', 'top', 'bottom'] },
        { name: 'limit', type: 'number', default: '4', description: 'Pagination limit.', control: 'number', min: 2, max: 8, step: 1 },
        { name: 'title', type: 'string', default: '"Playground grid"', description: 'Header title used by the default chrome.', control: 'text' },
        { name: 'headerMode', type: '"default" | "custom"', default: '"default"', description: 'Use the default card header or a custom Grid header render prop.', control: 'select', options: ['default', 'custom'] },
        { name: 'footerMode', type: '"none" | "summary"', default: '"none"', description: 'Optional Grid footer render prop.', control: 'select', options: ['none', 'summary'] },
        { name: 'clickable', type: 'boolean', default: 'false', description: 'Attach onClickRow and expose the clicked record in runtime state.', control: 'boolean' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Show the component loading state.', control: 'boolean' },
        { name: 'audit', type: 'boolean', default: 'false', description: 'Enable form audit logging for add/edit flows.', control: 'boolean', hidden: (props) => !props.formEnabled || props.actionsMode === 'none' },
    ],
    defaultProps: {
        useProvider: true,
        pathMode: 'explicit',
        layout: 'table',
        columnsMode: 'render',
        actionsMode: 'custom',
        formEnabled: true,
        selection: 'multiple',
        sortable: true,
        orderField: 'name',
        orderDir: 'asc',
        filterStatus: 'all',
        reorderable: false,
        routeSync: false,
        groupBy: 'none',
        sticky: 'false',
        limit: 4,
        title: 'Playground grid',
        headerMode: 'default',
        footerMode: 'none',
        clickable: false,
        loading: false,
        audit: false,
    },
    render: (p) => <GridPlaygroundPreview p={p} />,
};

export default function GridPage() {
    usePlayground(PLAYGROUND, 'Grid');
    const [arrayRecords, setArrayRecords] = React.useState(toArrayRecords());
    const crudProvider = React.useMemo(() => new MockDataProvider(createMockSeed()), []);
    const layoutRecords = React.useMemo(() => toGalleryRecords(), []);

    return (
        <PageLayout
            title="Grid"
            description="AI-first orchestration layer built on top of Table and Gallery. The page now moves from the smallest valid grid to progressively more explicit data, selection, action and layout patterns."
        >
            <TabbedSection
                title="Grid data sources"
                description="This section shows where Grid records come from. Start from the shortest provider-backed shape, then add route-based sourcing, query constraints, or switch to caller-owned records when you need more control."
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
                        title: 'GridDB with filter + ordering',
                        description: 'The same provider-backed load, now reduced to active teammates and reordered by email ascending. Grid still infers the columns from the incoming records.',
                        preview: (
                            <WithMock>
                                <GridDB
                                    path={GRID_SOURCE_PATH}
                                    where={{ status: 'active' }}
                                    order={{ email: 'asc' }}
                                    pagination={{ limit: 4, align: 'end', sticky: false }}
                                />
                            </WithMock>
                        ),
                        code: `<GridDB
  path="/showcase/grid/users"
  where={{ status: "active" }}
  order={{ email: "asc" }}
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
                                wrapClass="w-full"
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
                    {
                        label: 'fromUrl',
                        title: 'Load data from the current URL',
                        description: 'Use path="fromUrl" when the current route already matches the provider path you want to read. Grid forwards the pathname as-is, without query string or hash.',
                        preview: <FromUrlGridPreview />,
                        code: `<Grid
  path="fromUrl"
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
                                wrapClass="w-full"
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
                                wrapClass="w-full"
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
                                wrapClass="w-full"
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
                                wrapClass="w-full"
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
                                wrapClass="w-full"
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
      body: () => (
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
                        preview: <CrudPresetPreview provider={crudProvider} />,
                        code: `<GridDB
  path="/showcase/grid/users"
  order={{ name: "asc" }}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
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
                        preview: <ActionsPreview provider={crudProvider} />,
                        code: `<GridDB
  path="/showcase/grid/users"
  order={{ name: "asc" }}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    {
      key: "actions",
      label: "",
      sortable: false,
      render: ({ record, runAction }) => (
        <div className="flex justify-end">
          <ActionButton
            icon="eye"
            title={\`Preview \${record.name}\`}
            variant="link"
            onClick={() => runAction("preview")}
          />
        </div>
      ),
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
      size: "lg",
      position: "left",
      title: ({ record }) => \`Edit \${record?.name}\`,
      body: () => <GridUserForm />,
      footer: ({ runAction }) => (
        <>
          <ActionButton label="Save" onClick={() => runAction("save")} />
          <ActionButton variant="danger" label="Delete" onClick={() => runAction("remove")} />
        </>
      ),
    },
    delete: {
      kind: "delete",
      size: "sm",
      position: "center",
      title: ({ record }) => \`Delete \${record?.name}?\`,
      body: ({ record }) => (
        <div className="text-sm">
          This teammate will be removed from the mock provider: <span className="font-medium">{record?.email}</span>
        </div>
      ),
    },
    preview: {
      kind: "modal",
      label: "Preview",
      size: "xl",
      position: "right",
      title: ({ record }) => record?.name,
      header: ({ record }) => (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{record?.email}</span>
          <span>{record?.role}</span>
          <span>{record?.status}</span>
          <span>{record?.team}</span>
          <span>{record?.city}</span>
        </div>
      ),
      body: ({ record }) => (
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
        </div>
      ),
      footer: false,
    },
  }}
  header={({ title, runAction, selection }) => (
    <div className="flex w-full items-start justify-between gap-3">
      <div className="min-w-0">
        <div>{title}</div>
        <div className="text-xs text-muted-foreground">
          Add opens a centered form, edit keeps save and delete in the modal footer, the base edit workflow still includes delete and cancel automatically, and the extra preview action docks to the right.
        </div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <ActionButton label="Add teammate" onClick={() => runAction("add")} />
        {selection.hasSelection ? (
          <span className="text-xs text-muted-foreground">{selection.keys.length} selected</span>
        ) : null}
      </div>
    </div>
  )}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Route',
                        title: 'Routing action',
                        description: 'Use a route action when the next step belongs to navigation, not to a modal workflow.',
                        preview: <RouteActionPreview provider={crudProvider} />,
                        code: `<GridDB
  path="/showcase/grid/users"
  order={{ name: "asc" }}
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
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
                        title="Manual ordering"
                        wrapClass="w-full"
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
                        description: 'The default surface for lists. It uses the same records as the gallery tab so the only change is the surface.',
                        preview: (
                            <GridArray
                                records={layoutRecords}
                                recordId="_key"
                                columns={layoutColumns}
                                wrapClass="w-full"
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "team", label: "Team", sortable: true },
    { key: "city", label: "City", sortable: true },
  ]}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: 'Gallery',
                        title: 'Gallery layout',
                        description: 'The same records rendered as cards. Labels, order and data stay aligned with the table tab.',
                        preview: (
                            <GridArray
                                records={layoutRecords}
                                recordId="_key"
                                wrapClass="w-full"
                                layout="gallery"
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  layout="gallery"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                ]}
            />

            <PropDocsTable props={GRID_PROP_DOCS} />
        </PageLayout>
    );
}
