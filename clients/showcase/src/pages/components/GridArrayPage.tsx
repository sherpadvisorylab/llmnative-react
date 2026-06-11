import React from 'react';
import {
    Badge,
    DataProvider,
    Email,
    GridArray,
    MockDataProvider,
    Select,
    String as TextField,
} from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import { definePropDocs } from '../../docs-kit/docs';
import type { PlaygroundConfig, PropDef } from '../../docs-kit/playground';

// ─── Types ───────────────────────────────────────────────────────────────────

type UserRecord = {
    _key?: string;
    id?: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive' | 'review';
    team: string;
    city: string;
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const GRID_SOURCE_PATH = '/showcase/grid/users';

const USERS: Record<string, Omit<UserRecord, '_key' | 'id'>> = {
    u1: { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', city: 'Milan' },
    u2: { name: 'Mark Williams', email: 'mark@example.com', role: 'editor', status: 'active', team: 'Marketing', city: 'Berlin' },
    u3: { name: 'Sara Green', email: 'sara@example.com', role: 'viewer', status: 'inactive', team: 'Support', city: 'Madrid' },
    u4: { name: 'Luke Black', email: 'luke@example.com', role: 'editor', status: 'review', team: 'Product', city: 'Remote' },
    u5: { name: 'Julia Brown', email: 'julia@example.com', role: 'admin', status: 'active', team: 'Operations', city: 'Rome' },
    u6: { name: 'Noah White', email: 'noah@example.com', role: 'viewer', status: 'active', team: 'Support', city: 'Paris' },
};

const toArrayRecords = (): UserRecord[] =>
    Object.entries(USERS).map(([_key, record]) => ({ _key, id: _key, ...record }));

// ─── Shared helpers ────────────────────────────────────────────────────────────

const statusClass = (status: string) =>
    status === 'active' ? 'bg-success' : status === 'review' ? 'bg-warning' : 'bg-secondary';

const roleClass = (role: string) =>
    role === 'admin' ? 'bg-primary' : role === 'editor' ? 'bg-info' : 'bg-secondary';

const baseColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true, render: 'email' as const },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
];

// ─── Static column sets for section examples ─────────────────────────────────

const displayColumns = [
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
];

// ─── Playground helpers ───────────────────────────────────────────────────────

const compilePlaygroundArrowFunction = <TArg, TResult>(value: string) => {
    const match = value.trim().match(/^\(?\s*([A-Za-z_$][\w$]*)\s*\)?\s*=>\s*([\s\S]+)$/);
    if (!match) return undefined;
    const [, paramName, rawBody] = match;
    const body = rawBody.trim();
    try {
        if (body.startsWith('{') && body.endsWith('}')) {
            return new Function(paramName, body) as (arg: TArg) => TResult;
        }
        return new Function(paramName, `return (${body});`) as (arg: TArg) => TResult;
    } catch {
        return undefined;
    }
};

const resolvePlaygroundRecordId = (recordIdValue: unknown) => {
    if (typeof recordIdValue !== 'string') return '_key';
    const trimmed = recordIdValue.trim();
    if (!trimmed) return '_key';
    if (!trimmed.includes('=>')) return trimmed;
    return compilePlaygroundArrowFunction<Record<string, any>, string>(trimmed) || '_key';
};

const resolvePlaygroundNode = <TCtx,>(value: unknown) => {
    if (value === false || value == null) return undefined;
    if (typeof value === 'string') {
        const normalized = value.trim();
        if (!normalized || normalized.toLowerCase() === 'false') return undefined;
        const compiled = normalized.includes('=>')
            ? compilePlaygroundArrowFunction<TCtx, React.ReactNode>(normalized)
            : undefined;
        if (compiled) {
            return (ctx: TCtx) => {
                const result = compiled(ctx);
                return result === false || result == null ? undefined : result;
            };
        }
        return normalized;
    }
    return undefined;
};

// ─── Form used inside modal CRUD actions ──────────────────────────────────────

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

// ─── Mock wrapper ─────────────────────────────────────────────────────────────

function WithMock({ children, provider }: { children: React.ReactNode; provider?: MockDataProvider }) {
    const scopedProvider = React.useMemo(
        () => provider ?? new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }),
        [provider],
    );
    return (
        <DataProvider registry={{ default: scopedProvider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

// ─── Prop docs ────────────────────────────────────────────────────────────────

type GridArrayDocSurface = {
    records: unknown;
    recordId: unknown;
    onLoad: unknown;
    columns: unknown;
    actions: unknown;
    form: unknown;
    view: unknown;
    sortable: unknown;
    pagination: unknown;
    selection: unknown;
    groupBy: unknown;
    reorderable: unknown;
    title: unknown;
    header: unknown;
    footer: unknown;
    loading: unknown;
    sticky: unknown;
    wrapperClassName: unknown;
    pre: unknown;
    post: unknown;
    onRowClick: unknown;
    editDeepLink: unknown;
    onSave: unknown;
    onDelete: unknown;
    onComplete: unknown;
    audit: unknown;
};

const GRID_ARRAY_PROP_DOCS = definePropDocs<GridArrayDocSurface>()([
    // ── GridArray-specific ────────────────────────────────────────────────────
    {
        name: 'records',
        type: 'TRecord[]',
        required: true,
        category: 'GridArray',
        description: `Caller-owned record array. GridArray renders from this snapshot and does not subscribe to any provider. In the playground the records come from the Mock database below (path: ${GRID_SOURCE_PATH}).`,
    },
    {
        name: 'recordId',
        type: 'keyof TRecord | ((record: TRecord) => string)',
        default: '"_key"',
        category: 'GridArray',
        description: 'Identity resolver used for selection, edit state and mutation paths. Pass a field name or an arrow function.',
        shape: `keyof TRecord\n| ((record: TRecord) => string)`,
    },
    {
        name: 'onLoad',
        type: '(records: TRecord[]) => TRecord[] | Promise<TRecord[]>',
        category: 'GridArray',
        description: 'Transform records before display. Runs synchronously or asynchronously after the caller passes them in.',
        shape: `(records: TRecord[]) => TRecord[] | Promise<TRecord[]>`,
        example: `// Uppercase names before display
onLoad={(records) =>
  records.map((r) => ({ ...r, name: r.name.toUpperCase() }))
}`,
    },
    // ── Shared ────────────────────────────────────────────────────────────────
    {
        name: 'columns',
        type: 'GridColumn<TRecord>[]',
        category: 'Shared',
        description: 'Column definitions. Each item needs key and label; sortable and render are optional. Omit for auto-inferred columns.',
        shape: `Array<{
  key: keyof TRecord | string
  label: string
  sortable?: boolean
  className?: string
  render?:
    | "text" | "email" | "date" | "datetime"
    | "badge" | "image" | "boolean" | "json"
    | ((ctx: {
        record: TRecord
        value: unknown
        key: string
        rowIndex: number
        runAction: (actionKey: string) => void
      }) => React.ReactNode)
}>`,
    },
    {
        name: 'actions',
        type: '("add" | "edit" | "delete")[] | Record<string, GridAction>',
        category: 'Shared',
        description: 'Action catalog. Pass an array shorthand ["add","edit","delete"] or a declarative object for custom modal, route and external actions.',
        shape: `// Shorthand
("add" | "edit" | "delete")[]

// Declarative
Record<string, false | {
  kind: "modal" | "delete" | "route" | "external" | "inline"
  label?: string
  icon?: string
  title?: ReactNode | ((ctx) => ReactNode)
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen"
  position?: "center" | "top" | "left" | "right" | "bottom"
  body?: ReactNode | ((ctx) => ReactNode)
  footer?: ReactNode | false | ((ctx) => ReactNode)
  to?: string         // route
  href?: string       // external
  run?: (ctx) => void // inline
}>`,
    },
    {
        name: 'form',
        type: 'ReactElement | ((ctx) => ReactNode)',
        category: 'Shared',
        description: 'Add/edit form rendered inside the modal. Grid wraps it in Form automatically.',
        shape: `ReactElement | ((ctx: {
  actionKey: string
  record?: TRecord
  recordKey?: string
  isNewRecord: boolean
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
    },
    {
        name: 'view',
        type: '"table" | "gallery"',
        default: '"table"',
        category: 'Shared',
        description: 'Visual surface: table rows or gallery cards.',
    },
    {
        name: 'sortable',
        type: 'boolean | OrderConfig',
        default: 'true',
        category: 'Shared',
        description: 'Enable client-side header sorting or set an initial sort via OrderConfig.',
        shape: `boolean | { [field: string]: "asc" | "desc" }`,
    },
    {
        name: 'pagination',
        type: 'PaginationParams',
        default: '{ limit: 4, align: "end" }',
        category: 'Shared',
        description: 'Pagination forwarded to Table or Gallery.',
        shape: `{
  limit?: number
  align?: "start" | "center" | "end"
  sticky?: false | "top" | "bottom"
}`,
    },
    {
        name: 'selection',
        type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>',
        default: 'false',
        category: 'Shared',
        description: 'Row selection mode. Use the string shorthand or an object form with defaultKeys and onChange.',
        shape: `"single" | "multiple"
| {
  mode: "single" | "multiple"
  defaultKeys?: string[]
  onChange?: (selection: GridSelectionState<TRecord>) => void
}`,
    },
    {
        name: 'groupBy',
        type: 'string | string[]',
        default: '',
        category: 'Shared',
        description: 'Group rows/cards by a field. Works for both table and gallery layouts.',
    },
    {
        name: 'reorderable',
        type: 'boolean',
        default: 'false',
        category: 'Shared',
        description: 'Enable row drag & drop reorder. Disables client sorting while active.',
    },
    {
        name: 'title',
        type: 'ReactNode',
        default: '',
        category: 'Shared',
        description: 'Card header title.',
    },
    {
        name: 'header',
        type: 'ReactNode | ((ctx) => ReactNode)',
        default: 'false',
        category: 'Shared',
        description: 'Full header override. Receives GridHeaderContext when a function.',
        shape: `ReactNode | ((ctx: {
  title?: ReactNode
  records: TRecord[]
  selection: GridSelectionState<TRecord>
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
    },
    {
        name: 'footer',
        type: 'ReactNode | ((ctx) => ReactNode)',
        default: 'false',
        category: 'Shared',
        description: 'Footer override. Receives GridFooterContext when a function.',
        shape: `ReactNode | ((ctx: {
  records: TRecord[]
  selection: GridSelectionState<TRecord>
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
    },
    {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        category: 'Shared',
        description: 'Show a loading overlay on the card.',
    },
    {
        name: 'sticky',
        type: '"top" | "bottom"',
        default: '',
        category: 'Shared',
        description: 'Stick the card to the top or bottom of the scroll container.',
    },
    {
        name: 'wrapperClassName',
        type: 'string',
        default: '',
        category: 'Shared',
        description: 'CSS class on the outer card wrapper.',
    },
    {
        name: 'before',
        type: 'ReactNode',
        category: 'Shared',
        description: 'Content rendered above the table/gallery body.',
    },
    {
        name: 'after',
        type: 'ReactNode',
        category: 'Shared',
        description: 'Content rendered below the table/gallery body.',
    },
    {
        name: 'onRowClick',
        type: '(record: TRecord) => void',
        default: 'false',
        category: 'Shared',
        description: 'Called with the full record on row/card click.',
    },
    {
        name: 'editDeepLink',
        type: 'boolean',
        default: 'false',
        category: 'Shared',
        description: 'Sync edit modal to URL hash (#edit/{key}).',
    },
    {
        name: 'onSave',
        type: 'GridMutationSaveHandler<TRecord>',
        category: 'Shared',
        description: 'Override save path or implement custom persistence for create/update.',
        shape: `(args: {
  record?: TRecord
  action: "create" | "update"
  storagePath?: string
}) => Promise<string | undefined>`,
    },
    {
        name: 'onDelete',
        type: 'GridMutationDeleteHandler<TRecord>',
        category: 'Shared',
        description: 'Override delete path before the provider removes the record.',
        shape: `(args: {
  record?: TRecord
}) => Promise<string | undefined>`,
    },
    {
        name: 'onComplete',
        type: 'GridAfterActionHandler<TRecord>',
        category: 'Shared',
        description: 'Post-action hook. Return false to keep the modal open.',
        shape: `(args: {
  record?: TRecord
  action: "create" | "update" | "delete"
}) => Promise<boolean>`,
    },
    {
        name: 'audit',
        type: 'boolean',
        default: 'false',
        category: 'Shared',
        description: 'Enable form-level audit logging during modal saves.',
    },
]);

// ─── Playground prop definitions ──────────────────────────────────────────────

const GRID_ARRAY_SPECIFIC_PROPS: PropDef[] = [
    {
        group: 'GridArray',
        name: 'records',
        type: 'TRecord[]',
        required: true,
        description: `Caller-owned record array. In this playground the records come from the Mock database (see the accordion below) — edit it to see the grid update live. Path: ${GRID_SOURCE_PATH}`,
        readOnly: true,
    },
    {
        group: 'GridArray',
        name: 'recordId',
        type: 'keyof TRecord | ((record) => string)',
        default: '"_key"',
        description: 'Record identity resolver. Pass a field name like "_key" or an arrow function.',
        control: 'textarea',
        textareaMode: 'text',
        rows: 2,
        shortcuts: [
            { label: '_key', value: '_key', help: 'Use the provider/native key field.' },
            { label: 'id', value: 'id', help: 'Use the explicit id field.' },
            { label: 'fn', value: 'record => record.id', help: 'Arrow function returning the id field.' },
        ],
    },
    {
        group: 'GridArray',
        name: 'onLoad',
        type: '(records: TRecord[]) => TRecord[] | Promise<TRecord[]>',
        description: 'Transform records before display. Handled internally by the playground.',
        readOnly: true,
    },
];

const SHARED_PROPS: PropDef[] = [
    {
        group: 'Shared', name: 'columns', type: 'GridColumn<TRecord>[]',
        description: 'Column definitions. Each item needs key and label; sortable and render are optional. Omit for auto-inferred columns.',
        control: 'json', rows: 6,
        shortcuts: [
            { label: 'auto', value: null, help: 'Infer columns from record shape.' },
            { label: 'base', value: [
                { key: 'name', label: 'Name', sortable: true },
                { key: 'email', label: 'Email', sortable: true, render: 'email' },
                { key: 'role', label: 'Role', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
            ], help: 'Standard column set.' },
        ],
    },
    {
        group: 'Shared', name: 'actions', type: '("add"|"edit"|"delete")[] | Record<string, GridAction>',
        description: 'Action catalog. Pass an array shorthand ["add","edit","delete"] or a declarative object for custom modal, route and external actions.',
        control: 'json', rows: 6,
        shortcuts: [
            { label: 'none', value: {}, help: 'No actions.' },
            { label: 'crud', value: ['add', 'edit', 'delete'], help: 'Standard CRUD shorthand.' },
            { label: 'custom', value: { preview: { kind: 'modal', label: 'Preview', icon: 'eye' } }, help: 'Custom modal action.' },
        ],
    },
    { group: 'Shared', name: 'form', type: 'ReactElement | ((ctx) => ReactNode)', description: 'Add/edit form rendered inside the modal. Grid wraps it in Form automatically.', readOnly: true },
    { group: 'Shared', name: 'view', type: '"table" | "gallery"', default: '"table"', description: 'Visual surface: table rows or gallery cards.', control: 'select', options: ['table', 'gallery'] },
    {
        group: 'Shared', name: 'sortable', type: 'boolean | OrderConfig', default: 'true',
        description: 'Enable client-side header sorting or set an initial sort via OrderConfig.',
        control: 'json', rows: 2,
        shortcuts: [
            { label: 'true', value: true },
            { label: 'false', value: false },
            { label: 'name asc', value: { name: 'asc' }, help: 'Start sorted by name ascending.' },
        ],
    },
    {
        group: 'Shared', name: 'pagination', type: 'PaginationParams', default: '{"limit":4,"align":"end"}',
        description: 'Pagination forwarded to Table or Gallery.',
        control: 'json', rows: 3,
        shortcuts: [
            { label: 'default', value: { limit: 4, align: 'end' } },
            { label: 'compact', value: { limit: 2, align: 'center' } },
        ],
    },
    {
        group: 'Shared', name: 'selection', type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>', default: 'false',
        description: 'Row selection mode. onChange is wired automatically in the playground.',
        control: 'json', rows: 3,
        shortcuts: [
            { label: 'off', value: false },
            { label: 'single', value: 'single' },
            { label: 'multiple', value: 'multiple' },
            { label: 'defaultKeys', value: { mode: 'multiple', defaultKeys: ['u1', 'u5'] }, help: 'Pre-select u1 and u5.' },
        ],
    },
    {
        group: 'Shared', name: 'groupBy', type: 'string | string[]', default: '',
        description: 'Group rows/cards by a field. Works for both table and gallery layouts.',
        control: 'textarea', textareaMode: 'text', rows: 1, placeholder: 'e.g. role',
        shortcuts: [
            { label: 'off', value: '' }, { label: 'role', value: 'role' },
            { label: 'status', value: 'status' }, { label: 'team', value: 'team' },
        ],
    },
    { group: 'Shared', name: 'reorderable', type: 'boolean', default: 'false', description: 'Enable row drag & drop reorder. Disables client sorting while active.', control: 'json', rows: 1, shortcuts: [{ label: 'false', value: false }, { label: 'true', value: true }] },
    { group: 'Shared', name: 'title', type: 'ReactNode', default: '"Team members"', description: 'Card header title.', control: 'text' },
    {
        group: 'Shared', name: 'header', type: 'ReactNode | ((ctx) => ReactNode)', default: 'false',
        description: 'Full header override. Receives GridHeaderContext when a function.',
        control: 'textarea', textareaMode: 'text', rows: 2,
        shortcuts: [{ label: 'false', value: 'false' }, { label: 'fn', value: 'ctx => `${ctx.title} Â· ${ctx.records.length} records`' }],
    },
    {
        group: 'Shared', name: 'footer', type: 'ReactNode | ((ctx) => ReactNode)', default: 'false',
        description: 'Footer override. Receives GridFooterContext when a function.',
        control: 'textarea', textareaMode: 'text', rows: 2,
        shortcuts: [{ label: 'false', value: 'false' }, { label: 'fn', value: 'ctx => `${ctx.records.length} records loaded`' }],
    },
    { group: 'Shared', name: 'loading', type: 'boolean', default: 'false', description: 'Show a loading overlay on the card.', control: 'boolean' },
    { group: 'Shared', name: 'sticky', type: '"top" | "bottom"', default: '', description: 'Stick the card to the top or bottom of the scroll container.', control: 'select', options: ['', 'top', 'bottom'] },
    { group: 'Shared', name: 'wrapperClassName', type: 'string', default: '', description: 'CSS class on the outer card wrapper.', control: 'text' },
    { group: 'Shared', name: 'before', type: 'ReactNode', description: 'Content rendered above the table/gallery body.', control: 'textarea', rows: 2 },
    { group: 'Shared', name: 'after', type: 'ReactNode', description: 'Content rendered below the table/gallery body.', control: 'textarea', rows: 2 },
    { group: 'Shared', name: 'onRowClick', type: '(record) => void', default: 'false', description: 'Called with the full record on row/card click.', control: 'boolean' },
    { group: 'Shared', name: 'editDeepLink', type: 'boolean', default: 'false', description: 'Sync edit modal to URL hash (#edit/{key}).', control: 'boolean' },
    { group: 'Shared', name: 'onSave', type: 'GridMutationSaveHandler<TRecord>', description: 'Override save path or implement custom persistence for create/update.', readOnly: true },
    { group: 'Shared', name: 'onDelete', type: 'GridMutationDeleteHandler<TRecord>', description: 'Override delete path before the provider removes the record.', readOnly: true },
    { group: 'Shared', name: 'onComplete', type: 'GridAfterActionHandler<TRecord>', description: 'Post-action hook. Return false to keep the modal open.', readOnly: true },
    { group: 'Shared', name: 'audit', type: 'boolean', default: 'false', description: 'Enable form-level audit logging during modal saves.', control: 'boolean' },
];

// ─── Playground preview component ────────────────────────────────────────────

function GridArrayPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const [selectionKeys, setSelectionKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);
    const [clickedRecord, setClickedRecord] = React.useState<UserRecord | null>(null);
    const [arrayRecords, setArrayRecords] = React.useState<UserRecord[]>(toArrayRecords());

    const recordId = React.useMemo(() => resolvePlaygroundRecordId(p.recordId), [p.recordId]);

    const selectionMode = React.useMemo((): false | 'single' | 'multiple' => {
        const val = p.selection;
        if (!val || val === 'false' || val === false) return false;
        if (typeof val === 'string') return val as 'single' | 'multiple';
        return ((val as any).mode as 'single' | 'multiple') || false;
    }, [p.selection]);

    const groupBy: string | string[] | undefined = React.useMemo(() => {
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
    }, [p.groupBy]);

    const resolvedColumns = React.useMemo(() => {
        if (p.columns == null) return undefined;
        if (!Array.isArray(p.columns)) return undefined;
        return p.columns;
    }, [p.columns]);

    const resolvedSelection = React.useMemo(() => {
        if (!selectionMode) return undefined;
        const defaultKeys = p.selection && typeof p.selection === 'object'
            ? (p.selection as any).defaultKeys as string[] | undefined
            : undefined;
        return {
            mode: selectionMode,
            ...(defaultKeys?.length ? { defaultKeys } : {}),
            onChange: (s: any) => {
                setSelectionKeys(s.keys);
                setSelectedRecords(s.records as UserRecord[]);
            },
        };
    }, [selectionMode, p.selection]);

    React.useEffect(() => {
        setSelectionKeys([]);
        setSelectedRecords([]);
    }, [selectionMode]);

    const resolvedHeaderNode = React.useMemo(() => resolvePlaygroundNode<any>(p.header), [p.header]);
    const resolvedFooterNode = React.useMemo(() => resolvePlaygroundNode<any>(p.footer), [p.footer]);

    const resolvedPreNode = typeof p.pre === 'string' && p.pre.trim() && p.pre.trim().toLowerCase() !== 'false'
        ? p.pre.trim() : undefined;
    const resolvedPostNode = typeof p.post === 'string' && p.post.trim() && p.post.trim().toLowerCase() !== 'false'
        ? p.post.trim() : undefined;

    const pagination = typeof p.pagination === 'object' && p.pagination !== null ? p.pagination : { limit: 4 };
    const hasActions = Array.isArray(p.actions)
        ? p.actions.length > 0
        : typeof p.actions === 'object' && p.actions !== null && Object.keys(p.actions).length > 0;

    const actions = React.useMemo(() => {
        if (!p.actions) return undefined;
        if (Array.isArray(p.actions) && p.actions.length === 0) return undefined;
        if (typeof p.actions === 'object' && !Array.isArray(p.actions) && Object.keys(p.actions).length === 0) return undefined;
        return p.actions;
    }, [p.actions]);

    const hasOutput = selectionMode !== false || p.onRowClick;

    return (
        <div className="space-y-4">
            <GridArray
                records={arrayRecords as any}
                recordId={recordId as any}
                columns={resolvedColumns as any}
                title={p.title ?? 'Team members'}
                header={resolvedHeaderNode}
                footer={resolvedFooterNode}
                view={p.view}
                loading={p.loading}
                sticky={(p.sticky as any) || undefined}
                wrapperClassName={typeof p.wrapperClassName === 'string' ? p.wrapperClassName : ''}
                before={resolvedPreNode}
                after={resolvedPostNode}
                form={hasActions ? <GridUserForm /> : undefined}
                actions={actions as any}
                selection={resolvedSelection}
                onRowClick={p.onRowClick ? (record) => setClickedRecord(record as UserRecord) : undefined}
                sortable={p.sortable}
                groupBy={groupBy}
                pagination={pagination}
                reorderable={p.reorderable === true || p.reorderable === 'true'}
                onReorder={(records) => setArrayRecords(records as UserRecord[])}
                audit={p.audit}
                editDeepLink={p.editDeepLink && hasActions ? true : undefined}
                onSave={hasActions ? async ({ record }) => {
                    const key = (record as any)?._key || (record as any)?.id || `u${Date.now()}`;
                    setArrayRecords((prev) => {
                        const existing = prev.findIndex((r) => r._key === key);
                        if (existing >= 0) {
                            const next = [...prev];
                            next[existing] = { ...(record as UserRecord), _key: key };
                            return next;
                        }
                        return [...prev, { ...(record as UserRecord), _key: key, id: key }];
                    });
                    return `${GRID_SOURCE_PATH}/${key}`;
                } : undefined}
                onDelete={hasActions ? async ({ record }) => {
                    setArrayRecords((prev) => prev.filter((r) => r._key !== (record as any)?._key));
                    return record ? `${GRID_SOURCE_PATH}/${(record as any)._key}` : undefined;
                } : undefined}
            />

            {hasOutput && (
                <div className="grid gap-3 xl:grid-cols-2">
                    {selectionMode !== false && (
                        <div className="rounded-md border bg-muted/40 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                selection.onChange payload
                            </div>
                            <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                                {JSON.stringify({
                                    keys: selectionKeys,
                                    records: selectedRecords.map((r) => r._key || r.email),
                                    hasSelection: selectionKeys.length > 0,
                                }, null, 2)}
                            </pre>
                        </div>
                    )}
                    {p.onRowClick && (
                        <div className="rounded-md border bg-muted/40 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                onRowClick payload
                            </div>
                            <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                                {JSON.stringify(clickedRecord ?? null, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Playground config ────────────────────────────────────────────────────────

const PLAYGROUND: PlaygroundConfig = {
    size: 'fullscreen',
    layout: 'split',
    mockSeed: {
        [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])),
    },
    props: [
        ...GRID_ARRAY_SPECIFIC_PROPS,
        ...SHARED_PROPS,
    ],
    defaultProps: {
        recordId: '_key',
        view: 'table',
        columns: baseColumns,
        actions: ['add', 'edit', 'delete'],
        selection: false,
        sortable: true,
        groupBy: '',
        pagination: { limit: 4, align: 'end' },
        loading: false,
        sticky: '',
        wrapperClassName: '',
        pre: '',
        post: '',
        title: 'Team members',
        header: false,
        footer: false,
        onRowClick: false,
        reorderable: false,
        editDeepLink: false,
        audit: false,
    },
    render: (p) => (
        <WithMock>
            <GridArrayPlaygroundPreview p={p} />
        </WithMock>
    ),
};

// ─── Selection section previews ───────────────────────────────────────────────

function SingleSelectionPreview() {
    const [clickedKey, setClickedKey] = React.useState('');
    return (
        <div className="space-y-3 w-full">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title="Choose one option"
                wrapperClassName="w-full"
                selection={{ mode: 'single', onChange: (s) => setClickedKey(s.keys[0] || '') }}
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
        <div className="space-y-3 w-full">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title="Bulk selection"
                wrapperClassName="w-full"
                selection={{
                    mode: 'multiple',
                    onChange: (s) => {
                        setSelectedKeys(s.keys);
                        setSelectedRecords(s.records as UserRecord[]);
                    },
                }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
            <div className="text-xs text-muted-foreground">
                Selected: <span className="font-mono">{selectedKeys.length > 0 ? selectedKeys.join(', ') : 'none'}</span>
            </div>
        </div>
    );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function GridArrayPage() {
    usePlayground(PLAYGROUND, 'GridArray');

    return (
        <PageLayout
            title="GridArray"
            description="In-memory variant of Grid. Pass a caller-owned record array directly — no provider subscription, no network round-trip. Ideal for computed data, local state or small datasets that live entirely in the frontend."
        >
            {/* Basic usage */}
            <Section
                title="Basic usage"
                description="The shortest valid GridArray. Pass a records array and let Grid infer columns from the record shape. sortable and pagination are explicit here to keep the example contained."
                preview={(
                    <GridArray
                        records={toArrayRecords()}
                        recordId="_key"
                        columns={displayColumns as any}
                        sortable={{ name: 'asc' } as any}
                        wrapperClassName="w-full"
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<GridArray
  records={[
    { _key: "u1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active", team: "Platform", city: "Milan" },
    // ...
  ]}
  recordId="_key"
  columns={[
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "team", label: "Team", sortable: true },
  ]}
  sortable={{ name: "asc" }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* onLoad transform */}
            <Section
                title="onLoad transform"
                description="Use onLoad to normalize or enrich records before display. The transform runs once on each render cycle and supports async — Grid shows a spinner while the Promise resolves."
                preview={(
                    <GridArray
                        records={toArrayRecords()}
                        recordId="_key"
                        columns={displayColumns as any}
                        wrapperClassName="w-full"
                        onLoad={(records) =>
                            records.map((r) => ({
                                ...r,
                                name: r.name.toUpperCase(),
                                team: `[${r.team}]`,
                            }))
                        }
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<GridArray
  records={records}
  recordId="_key"
  columns={columns}
  onLoad={(records) =>
    records.map((r) => ({
      ...r,
      name: r.name.toUpperCase(),
      team: \`[\${r.team}]\`,
    }))
  }
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* Grouping */}
            <Section
                title="Grouping"
                description="groupBy separates rows under collapsible section headers. It works for both table and gallery layouts and can accept a single field or an array for multi-level grouping."
                preview={(
                    <GridArray
                        records={toArrayRecords()}
                        recordId="_key"
                        columns={displayColumns as any}
                        sortable={{ role: 'asc' } as any}
                        groupBy="role"
                        wrapperClassName="w-full"
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                )}
                code={`<GridArray
  records={records}
  recordId="_key"
  columns={columns}
  sortable={{ role: "asc" }}
  groupBy="role"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* Selection */}
            <Section
                title="Selection"
                description="selection enables row checkboxes or radio buttons. Use the string shorthand for UI-only selection, or the object form to receive onChange callbacks and pre-select rows via defaultKeys."
                bare
                preview={(
                    <div className="space-y-6 w-full">
                        <div>
                            <div className="mb-2 text-sm font-medium text-foreground">Single selection</div>
                            <SingleSelectionPreview />
                        </div>
                        <div>
                            <div className="mb-2 text-sm font-medium text-foreground">Multiple selection</div>
                            <MultipleSelectionPreview />
                        </div>
                    </div>
                )}
                code={`// Single
<GridArray
  records={records}
  recordId="_key"
  selection={{ mode: "single", onChange: (s) => setKey(s.keys[0] || "") }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>

// Multiple with pre-selected rows
<GridArray
  records={records}
  recordId="_key"
  selection={{
    mode: "multiple",
    defaultKeys: ["u1", "u5"],
    onChange: (s) => {
      setKeys(s.keys);
      setRecords(s.records);
    },
  }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            <PropDocsTable props={GRID_ARRAY_PROP_DOCS} />
        </PageLayout>
    );
}

