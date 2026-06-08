import React from 'react';
import {
    Badge,
    DataProvider,
    Email,
    GridDB,
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

// Dataset loaded by explicit path
const USERS: Record<string, Omit<UserRecord, '_key' | 'id'>> = {
    u1: { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', city: 'Milan' },
    u2: { name: 'Mark Williams', email: 'mark@example.com', role: 'editor', status: 'active', team: 'Marketing', city: 'Berlin' },
    u3: { name: 'Sara Green', email: 'sara@example.com', role: 'viewer', status: 'inactive', team: 'Support', city: 'Madrid' },
    u4: { name: 'Luke Black', email: 'luke@example.com', role: 'editor', status: 'review', team: 'Product', city: 'Remote' },
    u5: { name: 'Julia Brown', email: 'julia@example.com', role: 'admin', status: 'active', team: 'Operations', city: 'Rome' },
    u6: { name: 'Noah White', email: 'noah@example.com', role: 'viewer', status: 'active', team: 'Support', city: 'Paris' },
};

// Dataset loaded by fromUrl (resolves to /components/grid/db — the current page URL)
const FROM_URL_PATH = '/components/grid/db';
const FROM_URL_USERS: Record<string, Omit<UserRecord, '_key' | 'id'>> = {
    f1: { name: 'Carlos Diaz', email: 'carlos@demo.com', role: 'admin', status: 'active', team: 'Dev', city: 'Barcelona' },
    f2: { name: 'Yuki Tanaka', email: 'yuki@demo.com', role: 'editor', status: 'active', team: 'Design', city: 'Tokyo' },
    f3: { name: 'Priya Nair', email: 'priya@demo.com', role: 'viewer', status: 'review', team: 'QA', city: 'Mumbai' },
    f4: { name: 'Lena Schulz', email: 'lena@demo.com', role: 'editor', status: 'inactive', team: 'Support', city: 'Berlin' },
};

// ─── Column sets ──────────────────────────────────────────────────────────────

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
        () => provider ?? new MockDataProvider({
            [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])),
            [FROM_URL_PATH]: Object.fromEntries(Object.entries(FROM_URL_USERS).map(([k, v]) => [k, { ...v }])),
        }),
        [provider],
    );
    return (
        <DataProvider registry={{ default: scopedProvider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

// ─── Prop docs ────────────────────────────────────────────────────────────────

type GridDbDocSurface = {
    path: unknown;
    fromUrl: unknown;
    recordId: unknown;
    where: unknown;
    order: unknown;
    fieldMap: unknown;
    columns: unknown;
    actions: unknown;
    form: unknown;
    layout: unknown;
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
    wrapClass: unknown;
    pre: unknown;
    post: unknown;
    onClickRow: unknown;
    editDeepLink: unknown;
    onSave: unknown;
    onDelete: unknown;
    onAfterAction: unknown;
    audit: unknown;
};

const GRID_DB_PROP_DOCS = definePropDocs<GridDbDocSurface>()([
    // ── GridDB-specific ───────────────────────────────────────────────────────
    {
        name: 'path',
        type: 'string',
        required: true,
        category: 'GridDB',
        description: 'DataProvider collection path. Use with fromUrl={false} (default).',
    },
    {
        name: 'fromUrl',
        type: 'boolean',
        default: 'false',
        category: 'GridDB',
        description: 'When true, derive the collection path from the current route pathname instead of path. fromUrl always wins: path is ignored when fromUrl is set. Mutually exclusive with path at the type level.',
    },
    {
        name: 'recordId',
        type: 'keyof TRecord | ((record: TRecord) => string)',
        default: '"_key"',
        category: 'GridDB',
        description: 'Identity resolver used for selection, edit state and mutation paths. Pass a field name or an arrow function.',
        shape: `keyof TRecord\n| ((record: TRecord) => string)`,
    },
    {
        name: 'where',
        type: 'WhereClause',
        default: '{}',
        category: 'GridDB',
        description: 'Provider-side filter applied before records are streamed. e.g. {"status":"active"}',
        shape: `{
  [field: string]:
    | string | number | boolean | null
    | string[] | number[]
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
    },
    {
        name: 'order',
        type: 'OrderClause',
        default: '{}',
        category: 'GridDB',
        description: 'Provider-side ordering applied before records are streamed. e.g. {"name":"asc"}',
        shape: `{ [field: string]: "asc" | "desc" }`,
    },
    {
        name: 'fieldMap',
        type: 'Record<string, string>',
        default: '{}',
        category: 'GridDB',
        description: 'Remap provider field names to UI field names. e.g. {"fullName":"name"} maps provider "name" to "fullName".',
        shape: `{ [targetField: string]: string }`,
        example: `// Map provider field "name" â†’ UI field "fullName"
fieldMap={{ fullName: "name" }}`,
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
        name: 'layout',
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
        name: 'wrapClass',
        type: 'string',
        default: '',
        category: 'Shared',
        description: 'CSS class on the outer card wrapper.',
    },
    {
        name: 'pre',
        type: 'ReactNode',
        category: 'Shared',
        description: 'Content rendered above the table/gallery body.',
    },
    {
        name: 'post',
        type: 'ReactNode',
        category: 'Shared',
        description: 'Content rendered below the table/gallery body.',
    },
    {
        name: 'onClickRow',
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
        name: 'onAfterAction',
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

const GRID_DB_SPECIFIC_PROPS: PropDef[] = [
    {
        group: 'GridDB',
        name: 'path',
        type: 'string',
        required: true,
        description: 'DataProvider collection path.',
        control: 'text',
        readOnly: true,
        default: GRID_SOURCE_PATH,
    },
    {
        group: 'GridDB',
        name: 'fromUrl',
        type: 'boolean',
        default: 'false',
        description: `Derive the collection path from the current route pathname. fromUrl always wins over path. In this playground the URL resolves to "${FROM_URL_PATH}" (different dataset).`,
        control: 'boolean',
    },
    {
        group: 'GridDB',
        name: 'recordId',
        type: 'keyof TRecord | ((record) => string)',
        default: '"_key"',
        description: 'Record identity resolver.',
        control: 'textarea',
        textareaMode: 'text',
        rows: 2,
        shortcuts: [
            { label: '_key', value: '_key' },
            { label: 'id', value: 'id' },
            { label: 'fn', value: 'record => record.id', help: 'Arrow function.' },
        ],
    },
    {
        group: 'GridDB',
        name: 'where',
        type: 'WhereClause',
        default: '{}',
        description: 'Provider-side filter applied before records are streamed. e.g. {"status":"active"}',
        control: 'json',
        rows: 4,
        shortcuts: [
            { label: 'empty', value: {}, help: 'No filter.' },
            { label: 'active', value: { status: 'active' } },
            { label: 'admins', value: { role: 'admin' } },
        ],
    },
    {
        group: 'GridDB',
        name: 'order',
        type: 'OrderClause',
        default: '{}',
        description: 'Provider-side ordering applied before records are streamed. e.g. {"name":"asc"}',
        control: 'json',
        rows: 4,
        shortcuts: [
            { label: 'none', value: {}, help: 'Provider default order.' },
            { label: 'name asc', value: { name: 'asc' } },
            { label: 'email desc', value: { email: 'desc' } },
        ],
    },
    {
        group: 'GridDB',
        name: 'fieldMap',
        type: 'Record<string, string>',
        default: '{}',
        description: 'Remap provider field names to UI field names. e.g. {"fullName":"name"} maps provider "name" to "fullName".',
        control: 'json',
        rows: 4,
        shortcuts: [
            { label: 'empty', value: {}, help: 'No remapping.' },
            { label: 'fullName', value: { fullName: 'name' } },
        ],
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
    { group: 'Shared', name: 'layout', type: '"table" | "gallery"', default: '"table"', description: 'Visual surface: table rows or gallery cards.', control: 'select', options: ['table', 'gallery'] },
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
    { group: 'Shared', name: 'wrapClass', type: 'string', default: '', description: 'CSS class on the outer card wrapper.', control: 'text' },
    { group: 'Shared', name: 'pre', type: 'ReactNode', description: 'Content rendered above the table/gallery body.', control: 'textarea', rows: 2 },
    { group: 'Shared', name: 'post', type: 'ReactNode', description: 'Content rendered below the table/gallery body.', control: 'textarea', rows: 2 },
    { group: 'Shared', name: 'onClickRow', type: '(record) => void', default: 'false', description: 'Called with the full record on row/card click.', control: 'boolean' },
    { group: 'Shared', name: 'editDeepLink', type: 'boolean', default: 'false', description: 'Sync edit modal to URL hash (#edit/{key}).', control: 'boolean' },
    { group: 'Shared', name: 'onSave', type: 'GridMutationSaveHandler<TRecord>', description: 'Override save path or implement custom persistence for create/update.', readOnly: true },
    { group: 'Shared', name: 'onDelete', type: 'GridMutationDeleteHandler<TRecord>', description: 'Override delete path before the provider removes the record.', readOnly: true },
    { group: 'Shared', name: 'onAfterAction', type: 'GridAfterActionHandler<TRecord>', description: 'Post-action hook. Return false to keep the modal open.', readOnly: true },
    { group: 'Shared', name: 'audit', type: 'boolean', default: 'false', description: 'Enable form-level audit logging during modal saves.', control: 'boolean' },
];

// ─── Playground preview component ────────────────────────────────────────────

function GridDbPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const [selectionKeys, setSelectionKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);
    const [clickedRecord, setClickedRecord] = React.useState<UserRecord | null>(null);

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

    const where = typeof p.where === 'object' && p.where !== null && Object.keys(p.where).length > 0 ? p.where : undefined;
    const order = typeof p.order === 'object' && p.order !== null && Object.keys(p.order).length > 0 ? p.order : undefined;
    const fieldMap = typeof p.fieldMap === 'object' && p.fieldMap !== null && Object.keys(p.fieldMap).length > 0 ? p.fieldMap : undefined;

    const hasActions = Array.isArray(p.actions)
        ? p.actions.length > 0
        : typeof p.actions === 'object' && p.actions !== null && Object.keys(p.actions).length > 0;

    const actions = React.useMemo(() => {
        if (!p.actions) return undefined;
        if (Array.isArray(p.actions) && p.actions.length === 0) return undefined;
        if (typeof p.actions === 'object' && !Array.isArray(p.actions) && Object.keys(p.actions).length === 0) return undefined;
        return p.actions;
    }, [p.actions]);

    const hasOutput = selectionMode !== false || p.onClickRow;

    return (
        <div className="space-y-4">
            <GridDB
                {...(p.fromUrl ? { fromUrl: true as const } : { path: GRID_SOURCE_PATH })}
                where={where}
                order={order}
                fieldMap={fieldMap}
                recordId={recordId as any}
                columns={resolvedColumns as any}
                title={p.title ?? 'Team members'}
                header={resolvedHeaderNode}
                footer={resolvedFooterNode}
                layout={p.layout}
                loading={p.loading}
                sticky={(p.sticky as any) || undefined}
                wrapClass={typeof p.wrapClass === 'string' ? p.wrapClass : ''}
                pre={resolvedPreNode}
                post={resolvedPostNode}
                form={hasActions ? <GridUserForm /> : undefined}
                actions={actions as any}
                selection={resolvedSelection}
                onClickRow={p.onClickRow ? (record) => setClickedRecord(record as UserRecord) : undefined}
                sortable={p.sortable}
                groupBy={groupBy}
                pagination={pagination}
                audit={p.audit}
                editDeepLink={p.editDeepLink && hasActions ? true : undefined}
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
                    {p.onClickRow && (
                        <div className="rounded-md border bg-muted/40 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                onClickRow payload
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
        [FROM_URL_PATH]: Object.fromEntries(Object.entries(FROM_URL_USERS).map(([k, v]) => [k, { ...v }])),
    },
    props: [
        ...GRID_DB_SPECIFIC_PROPS,
        ...SHARED_PROPS,
    ],
    defaultProps: {
        path: GRID_SOURCE_PATH,
        fromUrl: false,
        recordId: '_key',
        layout: 'table',
        columns: baseColumns,
        actions: ['add', 'edit', 'delete'],
        selection: false,
        sortable: true,
        groupBy: '',
        where: {},
        order: {},
        fieldMap: {},
        pagination: { limit: 4, align: 'end' },
        loading: false,
        sticky: '',
        wrapClass: '',
        pre: '',
        post: '',
        title: 'Team members',
        header: false,
        footer: false,
        onClickRow: false,
        reorderable: false,
        editDeepLink: false,
        audit: false,
    },
    render: (p) => (
        <WithMock>
            <GridDbPlaygroundPreview p={p} />
        </WithMock>
    ),
};

// ─── Section previews ─────────────────────────────────────────────────────────

function BasicUsagePreview() {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={displayColumns as any}
                sortable={{ name: 'asc' } as any}
                wrapClass="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function FilterPreview() {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={displayColumns as any}
                where={{ status: 'active' }}
                wrapClass="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function OrderPreview() {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={displayColumns as any}
                order={{ name: 'asc' }}
                wrapClass="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function FromUrlPreview() {
    return (
        <WithMock>
            <GridDB
                fromUrl
                columns={displayColumns as any}
                wrapClass="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function GroupingPreview() {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={displayColumns as any}
                sortable={{ role: 'asc' } as any}
                groupBy="role"
                wrapClass="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function GridDbPage() {
    usePlayground(PLAYGROUND, 'GridDB');

    return (
        <PageLayout
            title="GridDB"
            description="Provider-backed variant of Grid. Subscribes to a DataProvider path and streams real-time updates automatically. Supports provider-side filtering (where), sorting (order) and field remapping (fieldMap) so the grid never over-fetches."
        >
            {/* Basic usage */}
            <Section
                title="Basic usage"
                description="The shortest valid GridDB. Provide a path and let Grid subscribe to the collection and infer columns from the incoming records."
                preview={<BasicUsagePreview />}
                code={`<GridDB
  path="/showcase/grid/users"
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

            {/* Provider-side filter */}
            <Section
                title="Provider-side filter"
                description="where filters records at the provider level before they reach the component — no over-fetch. The example below shows only active teammates."
                preview={<FilterPreview />}
                code={`<GridDB
  path="/showcase/grid/users"
  columns={columns}
  where={{ status: "active" }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* Provider-side order */}
            <Section
                title="Provider-side order"
                description="order sorts records at the provider level. The example below sorts teammates by name ascending before the component receives them."
                preview={<OrderPreview />}
                code={`<GridDB
  path="/showcase/grid/users"
  columns={columns}
  order={{ name: "asc" }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* fromUrl */}
            <Section
                title="fromUrl — route-driven path"
                description={`fromUrl tells GridDB to resolve the collection path from the current route pathname instead of a hardcoded path. fromUrl always wins: path is ignored when fromUrl is set. This preview reads from "${FROM_URL_PATH}" (the current page URL).`}
                preview={<FromUrlPreview />}
                code={`// Route: /products/catalog
// GridDB subscribes to "/products/catalog" automatically
<GridDB
  fromUrl
  columns={columns}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* Grouping */}
            <Section
                title="Grouping"
                description="groupBy separates rows under section headers. Works for both table and gallery layouts. Provider-side order is combined with client-side grouping in this example."
                preview={<GroupingPreview />}
                code={`<GridDB
  path="/showcase/grid/users"
  columns={columns}
  sortable={{ role: "asc" }}
  groupBy="role"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            <PropDocsTable props={GRID_DB_PROP_DOCS} />
        </PageLayout>
    );
}
