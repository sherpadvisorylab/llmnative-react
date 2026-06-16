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
import type { I18nDict } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { useShowcaseGridDbI18n, useShowcaseGridI18n } from '../../showcase/i18n';
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

type ShowcaseGridI18n = I18nDict['showcase']['grid'];
type ShowcaseGridDbI18n = I18nDict['showcase']['gridDb'];

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

const getRoleLabel = (t: ShowcaseGridI18n, role: string) =>
    role === 'admin' ? t.values.roles.admin : role === 'editor' ? t.values.roles.editor : role === 'viewer' ? t.values.roles.viewer : role;

const getStatusLabel = (t: ShowcaseGridI18n, status: string) =>
    status === 'active' ? t.values.statuses.active : status === 'review' ? t.values.statuses.review : status === 'inactive' ? t.values.statuses.inactive : status;

const getBaseColumns = (t: ShowcaseGridI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true, render: 'email' as const },
    { key: 'role', label: t.labels.role, sortable: true },
    { key: 'status', label: t.labels.status, sortable: true },
    { key: 'team', label: t.labels.team, sortable: true },
];

const getDisplayColumns = (t: ShowcaseGridI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true },
    {
        key: 'role',
        label: t.labels.role,
        sortable: true,
        render: ({ value }: { value: string }) => <Badge className={roleClass(value)}>{getRoleLabel(t, value)}</Badge>,
    },
    {
        key: 'status',
        label: t.labels.status,
        sortable: true,
        render: ({ value }: { value: string }) => <Badge className={statusClass(value)}>{getStatusLabel(t, value)}</Badge>,
    },
    { key: 'team', label: t.labels.team, sortable: true },
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

function GridUserForm({ t }: { t: ShowcaseGridI18n }) {
    return (
        <>
            <TextField name="name" label={t.labels.name} required />
            <Email name="email" label={t.labels.email} required />
            <Select
                name="role"
                label={t.labels.role}
                required
                options={[
                    { value: 'admin', label: t.values.roles.admin },
                    { value: 'editor', label: t.values.roles.editor },
                    { value: 'viewer', label: t.values.roles.viewer },
                ]}
            />
            <Select
                name="status"
                label={t.labels.status}
                required
                options={[
                    { value: 'active', label: t.values.statuses.active },
                    { value: 'review', label: t.values.statuses.review },
                    { value: 'inactive', label: t.values.statuses.inactive },
                ]}
            />
            <TextField name="team" label={t.labels.team} required />
            <TextField name="city" label={t.labels.city} required />
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

const createGridDbPropDocs = (gridT: ShowcaseGridI18n, dbT: ShowcaseGridDbI18n) => definePropDocs<GridDbDocSurface>()([
    // ── GridDB-specific ───────────────────────────────────────────────────────
    {
        name: 'path',
        type: 'string',
        required: true,
        category: dbT.propsDocs.categories.gridDb,
        description: dbT.propsDocs.items.path.description,
    },
    {
        name: 'fromUrl',
        type: 'boolean',
        default: 'false',
        category: dbT.propsDocs.categories.gridDb,
        description: dbT.propsDocs.items.fromUrl.description,
    },
    {
        name: 'recordId',
        type: 'keyof TRecord | ((record: TRecord) => string)',
        default: '"_key"',
        category: dbT.propsDocs.categories.gridDb,
        description: dbT.propsDocs.items.recordId.description,
        shape: `keyof TRecord\n| ((record: TRecord) => string)`,
    },
    {
        name: 'where',
        type: 'WhereClause',
        default: '{}',
        category: dbT.propsDocs.categories.gridDb,
        description: `${dbT.propsDocs.items.where.description} e.g. {"status":"active"}`,
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
        category: dbT.propsDocs.categories.gridDb,
        description: `${dbT.propsDocs.items.order.description} e.g. {"name":"asc"}`,
        shape: `{ [field: string]: "asc" | "desc" }`,
    },
    {
        name: 'fieldMap',
        type: 'Record<string, string>',
        default: '{}',
        category: dbT.propsDocs.categories.gridDb,
        description: `${dbT.propsDocs.items.fieldMap.description} e.g. {"fullName":"name"} maps provider "name" to "fullName".`,
        shape: `{ [targetField: string]: string }`,
        example: `// Map provider field "name" -> UI field "fullName"
fieldMap={{ fullName: "name" }}`,
    },
    // ── Shared ────────────────────────────────────────────────────────────────
    {
        name: 'columns',
        type: 'GridColumn<TRecord>[]',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.columns.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.actions.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.form.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.view.description,
    },
    {
        name: 'sortable',
        type: 'boolean | OrderConfig',
        default: 'true',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.sortable.description,
        shape: `boolean | { [field: string]: "asc" | "desc" }`,
    },
    {
        name: 'pagination',
        type: 'PaginationParams',
        default: '{ limit: 4, align: "end" }',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.pagination.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.selection.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.groupBy.description,
    },
    {
        name: 'reorderable',
        type: 'boolean',
        default: 'false',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.reorderable.description,
    },
    {
        name: 'title',
        type: 'ReactNode',
        default: '',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.title.description,
    },
    {
        name: 'header',
        type: 'ReactNode | ((ctx) => ReactNode)',
        default: 'false',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.header.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.footer.description,
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
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.loading.description,
    },
    {
        name: 'sticky',
        type: '"top" | "bottom"',
        default: '',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.sticky.description,
    },
    {
        name: 'wrapperClassName',
        type: 'string',
        default: '',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.wrapperClassName.description,
    },
    {
        name: 'before',
        type: 'ReactNode',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.before.description,
    },
    {
        name: 'after',
        type: 'ReactNode',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.after.description,
    },
    {
        name: 'onRowClick',
        type: '(record: TRecord) => void',
        default: 'false',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.onRowClick.description,
    },
    {
        name: 'editDeepLink',
        type: 'boolean',
        default: 'false',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.editDeepLink.description,
    },
    {
        name: 'onSave',
        type: 'GridMutationSaveHandler<TRecord>',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.onSave.description,
        shape: `(args: {
  record?: TRecord
  action: "create" | "update"
  storagePath?: string
}) => Promise<string | undefined>`,
    },
    {
        name: 'onDelete',
        type: 'GridMutationDeleteHandler<TRecord>',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.onDelete.description,
        shape: `(args: {
  record?: TRecord
}) => Promise<string | undefined>`,
    },
    {
        name: 'onComplete',
        type: 'GridAfterActionHandler<TRecord>',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.onComplete.description,
        shape: `(args: {
  record?: TRecord
  action: "create" | "update" | "delete"
}) => Promise<boolean>`,
    },
    {
        name: 'audit',
        type: 'boolean',
        default: 'false',
        category: dbT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.audit.description,
    },
]);

// ─── Playground prop definitions ──────────────────────────────────────────────

const createGridDbSpecificProps = (dbT: ShowcaseGridDbI18n): PropDef[] => [
    {
        group: dbT.playground.groups.gridDb,
        name: 'path',
        type: 'string',
        required: true,
        description: dbT.playground.props.path.description,
        control: 'text',
        readOnly: true,
        default: GRID_SOURCE_PATH,
    },
    {
        group: dbT.playground.groups.gridDb,
        name: 'fromUrl',
        type: 'boolean',
        default: 'false',
        description: `${dbT.playground.props.fromUrl.description} "${FROM_URL_PATH}".`,
        control: 'boolean',
    },
    {
        group: dbT.playground.groups.gridDb,
        name: 'recordId',
        type: 'keyof TRecord | ((record) => string)',
        default: '"_key"',
        description: dbT.playground.props.recordId.description,
        control: 'textarea',
        textareaMode: 'text',
        rows: 2,
        shortcuts: [
            { label: dbT.playground.props.recordId.shortcuts.nativeKey.label, value: '_key', help: dbT.playground.props.recordId.shortcuts.nativeKey.help },
            { label: dbT.playground.props.recordId.shortcuts.explicitId.label, value: 'id', help: dbT.playground.props.recordId.shortcuts.explicitId.help },
            { label: dbT.playground.props.recordId.shortcuts.functionId.label, value: 'record => record.id', help: dbT.playground.props.recordId.shortcuts.functionId.help },
        ],
    },
    {
        group: dbT.playground.groups.gridDb,
        name: 'where',
        type: 'WhereClause',
        default: '{}',
        description: dbT.playground.props.where.description,
        control: 'json',
        rows: 4,
        shortcuts: [
            { label: dbT.playground.props.where.shortcuts.empty.label, value: {}, help: dbT.playground.props.where.shortcuts.empty.help },
            { label: dbT.playground.props.where.shortcuts.active.label, value: { status: 'active' }, help: dbT.playground.props.where.shortcuts.active.help },
            { label: dbT.playground.props.where.shortcuts.admins.label, value: { role: 'admin' }, help: dbT.playground.props.where.shortcuts.admins.help },
        ],
    },
    {
        group: dbT.playground.groups.gridDb,
        name: 'order',
        type: 'OrderClause',
        default: '{}',
        description: dbT.playground.props.order.description,
        control: 'json',
        rows: 4,
        shortcuts: [
            { label: dbT.playground.props.order.shortcuts.none.label, value: {}, help: dbT.playground.props.order.shortcuts.none.help },
            { label: dbT.playground.props.order.shortcuts.nameAsc.label, value: { name: 'asc' }, help: dbT.playground.props.order.shortcuts.nameAsc.help },
            { label: dbT.playground.props.order.shortcuts.emailDesc.label, value: { email: 'desc' }, help: dbT.playground.props.order.shortcuts.emailDesc.help },
        ],
    },
    {
        group: dbT.playground.groups.gridDb,
        name: 'fieldMap',
        type: 'Record<string, string>',
        default: '{}',
        description: dbT.playground.props.fieldMap.description,
        control: 'json',
        rows: 4,
        shortcuts: [
            { label: dbT.playground.props.fieldMap.shortcuts.empty.label, value: {}, help: dbT.playground.props.fieldMap.shortcuts.empty.help },
            { label: dbT.playground.props.fieldMap.shortcuts.fullName.label, value: { fullName: 'name' }, help: dbT.playground.props.fieldMap.shortcuts.fullName.help },
        ],
    },
];

const createSharedProps = (gridT: ShowcaseGridI18n, dbT: ShowcaseGridDbI18n): PropDef[] => [
    {
        group: dbT.playground.groups.shared, name: 'columns', type: 'GridColumn<TRecord>[]',
        description: gridT.playground.props.columns.description,
        control: 'json', rows: 6,
        shortcuts: [
            { label: gridT.playground.props.columns.shortcuts?.infer?.label ?? 'auto', value: null, help: gridT.playground.props.columns.shortcuts?.infer?.help ?? '' },
            { label: 'base', value: [
                { key: 'name', label: gridT.labels.name, sortable: true },
                { key: 'email', label: gridT.labels.email, sortable: true, render: 'email' },
                { key: 'role', label: gridT.labels.role, sortable: true },
                { key: 'status', label: gridT.labels.status, sortable: true },
            ], help: gridT.playground.props.columns.shortcuts?.base?.help ?? '' },
        ],
    },
    {
        group: dbT.playground.groups.shared, name: 'actions', type: '("add"|"edit"|"delete")[] | Record<string, GridAction>',
        description: gridT.playground.props.actions.description,
        control: 'json', rows: 6,
        shortcuts: [
            { label: gridT.playground.props.actions.shortcuts?.none?.label ?? 'none', value: {}, help: gridT.playground.props.actions.shortcuts?.none?.help ?? '' },
            { label: gridT.playground.props.actions.shortcuts?.crud?.label ?? 'crud', value: ['add', 'edit', 'delete'], help: gridT.playground.props.actions.shortcuts?.crud?.help ?? '' },
            { label: gridT.playground.props.actions.shortcuts?.custom?.label ?? 'custom', value: { preview: { kind: 'modal', label: gridT.actions.preview, icon: 'eye' } }, help: gridT.playground.props.actions.shortcuts?.custom?.help ?? '' },
        ],
    },
    { group: dbT.playground.groups.shared, name: 'form', type: 'ReactElement | ((ctx) => ReactNode)', description: gridT.playground.props.form.description, readOnly: true },
    { group: dbT.playground.groups.shared, name: 'view', type: '"table" | "gallery"', default: '"table"', description: gridT.playground.props.view.description, control: 'select', options: ['table', 'gallery'] },
    {
        group: dbT.playground.groups.shared, name: 'sortable', type: 'boolean | OrderConfig', default: 'true',
        description: gridT.playground.props.sortable.description,
        control: 'json', rows: 2,
        shortcuts: [
            { label: gridT.playground.props.sortable.shortcuts?.true?.label ?? 'true', value: true, help: gridT.playground.props.sortable.shortcuts?.true?.help ?? '' },
            { label: gridT.playground.props.sortable.shortcuts?.false?.label ?? 'false', value: false, help: gridT.playground.props.sortable.shortcuts?.false?.help ?? '' },
            { label: gridT.playground.props.sortable.shortcuts?.nameAsc?.label ?? 'name asc', value: { name: 'asc' }, help: gridT.playground.props.sortable.shortcuts?.nameAsc?.help ?? '' },
        ],
    },
    {
        group: dbT.playground.groups.shared, name: 'pagination', type: 'PaginationParams', default: '{"limit":4,"align":"end"}',
        description: gridT.playground.props.pagination.description,
        control: 'json', rows: 3,
        shortcuts: [
            { label: gridT.playground.props.pagination.shortcuts?.default?.label ?? 'default', value: { limit: 4, align: 'end' }, help: gridT.playground.props.pagination.shortcuts?.default?.help ?? '' },
            { label: gridT.playground.props.pagination.shortcuts?.compact?.label ?? 'compact', value: { limit: 2, align: 'center' }, help: gridT.playground.props.pagination.shortcuts?.compact?.help ?? '' },
        ],
    },
    {
        group: dbT.playground.groups.shared, name: 'selection', type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>', default: 'false',
        description: gridT.playground.props.selection.description,
        control: 'json', rows: 3,
        shortcuts: [
            { label: gridT.playground.props.selection.shortcuts?.off?.label ?? 'off', value: false, help: gridT.playground.props.selection.shortcuts?.off?.help ?? '' },
            { label: gridT.playground.props.selection.shortcuts?.single?.label ?? 'single', value: 'single', help: gridT.playground.props.selection.shortcuts?.single?.help ?? '' },
            { label: gridT.playground.props.selection.shortcuts?.multiple?.label ?? 'multiple', value: 'multiple', help: gridT.playground.props.selection.shortcuts?.multiple?.help ?? '' },
            { label: gridT.playground.props.selection.shortcuts?.defaultKeys?.label ?? 'defaultKeys', value: { mode: 'multiple', defaultKeys: ['u1', 'u5'] }, help: gridT.playground.props.selection.shortcuts?.defaultKeys?.help ?? '' },
        ],
    },
    {
        group: dbT.playground.groups.shared, name: 'groupBy', type: 'string | string[]', default: '',
        description: gridT.playground.props.groupBy.description,
        control: 'textarea', textareaMode: 'text', rows: 1, placeholder: gridT.playground.props.groupBy.placeholder ?? 'e.g. role',
        shortcuts: [
            { label: gridT.playground.props.groupBy.shortcuts?.off?.label ?? 'off', value: '', help: gridT.playground.props.groupBy.shortcuts?.off?.help ?? '' },
            { label: gridT.playground.props.groupBy.shortcuts?.role?.label ?? 'role', value: 'role', help: gridT.playground.props.groupBy.shortcuts?.role?.help ?? '' },
            { label: gridT.playground.props.groupBy.shortcuts?.status?.label ?? 'status', value: 'status', help: gridT.playground.props.groupBy.shortcuts?.status?.help ?? '' },
            { label: gridT.playground.props.groupBy.shortcuts?.team?.label ?? 'team', value: 'team', help: gridT.playground.props.groupBy.shortcuts?.team?.help ?? '' },
        ],
    },
    { group: dbT.playground.groups.shared, name: 'reorderable', type: 'boolean', default: 'false', description: gridT.playground.props.reorderable.description, control: 'json', rows: 1, shortcuts: [{ label: gridT.playground.props.reorderable.shortcuts?.false?.label ?? 'false', value: false, help: gridT.playground.props.reorderable.shortcuts?.false?.help ?? '' }, { label: gridT.playground.props.reorderable.shortcuts?.true?.label ?? 'true', value: true, help: gridT.playground.props.reorderable.shortcuts?.true?.help ?? '' }] },
    { group: dbT.playground.groups.shared, name: 'title', type: 'ReactNode', default: `"${dbT.labels.teamMembers}"`, description: gridT.playground.props.title.description, control: 'text' },
    {
        group: dbT.playground.groups.shared, name: 'header', type: 'ReactNode | ((ctx) => ReactNode)', default: 'false',
        description: gridT.playground.props.header.description,
        control: 'textarea', textareaMode: 'text', rows: 2,
        shortcuts: [{ label: gridT.playground.props.header.shortcuts?.false?.label ?? 'false', value: 'false', help: gridT.playground.props.header.shortcuts?.false?.help ?? '' }, { label: gridT.playground.props.header.shortcuts?.fn?.label ?? 'fn', value: 'ctx => `${ctx.title} · ${ctx.records.length} records`', help: gridT.playground.props.header.shortcuts?.fn?.help ?? '' }],
    },
    {
        group: dbT.playground.groups.shared, name: 'footer', type: 'ReactNode | ((ctx) => ReactNode)', default: 'false',
        description: gridT.playground.props.footer.description,
        control: 'textarea', textareaMode: 'text', rows: 2,
        shortcuts: [{ label: gridT.playground.props.footer.shortcuts?.false?.label ?? 'false', value: 'false', help: gridT.playground.props.footer.shortcuts?.false?.help ?? '' }, { label: gridT.playground.props.footer.shortcuts?.fn?.label ?? 'fn', value: 'ctx => `${ctx.records.length} records loaded`', help: gridT.playground.props.footer.shortcuts?.fn?.help ?? '' }],
    },
    { group: dbT.playground.groups.shared, name: 'loading', type: 'boolean', default: 'false', description: gridT.playground.props.loading.description, control: 'boolean' },
    { group: dbT.playground.groups.shared, name: 'sticky', type: '"top" | "bottom"', default: '', description: gridT.playground.props.sticky.description, control: 'select', options: ['', 'top', 'bottom'] },
    { group: dbT.playground.groups.shared, name: 'wrapperClassName', type: 'string', default: '', description: gridT.playground.props.wrapperClassName.description, control: 'text' },
    { group: dbT.playground.groups.shared, name: 'before', type: 'ReactNode', description: gridT.playground.props.before.description, control: 'textarea', rows: 2 },
    { group: dbT.playground.groups.shared, name: 'after', type: 'ReactNode', description: gridT.playground.props.after.description, control: 'textarea', rows: 2 },
    { group: dbT.playground.groups.shared, name: 'onRowClick', type: '(record) => void', default: 'false', description: gridT.playground.props.onRowClick.description, control: 'boolean' },
    { group: dbT.playground.groups.shared, name: 'editDeepLink', type: 'boolean', default: 'false', description: gridT.playground.props.editDeepLink.description, control: 'boolean' },
    { group: dbT.playground.groups.shared, name: 'onSave', type: 'GridMutationSaveHandler<TRecord>', description: gridT.playground.props.onSave.description, readOnly: true },
    { group: dbT.playground.groups.shared, name: 'onDelete', type: 'GridMutationDeleteHandler<TRecord>', description: gridT.playground.props.onDelete.description, readOnly: true },
    { group: dbT.playground.groups.shared, name: 'onComplete', type: 'GridAfterActionHandler<TRecord>', description: gridT.playground.props.onComplete.description, readOnly: true },
    { group: dbT.playground.groups.shared, name: 'audit', type: 'boolean', default: 'false', description: gridT.playground.props.audit.description, control: 'boolean' },
];

// ─── Playground preview component ────────────────────────────────────────────

function GridDbPlaygroundPreview({ p, gridT, dbT }: { p: Record<string, any>; gridT: ShowcaseGridI18n; dbT: ShowcaseGridDbI18n }) {
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

    const hasOutput = selectionMode !== false || p.onRowClick;

    return (
        <div className="space-y-4">
            <GridDB
                {...(p.fromUrl ? { fromUrl: true as const } : { path: GRID_SOURCE_PATH })}
                where={where}
                order={order}
                fieldMap={fieldMap}
                recordId={recordId as any}
                columns={resolvedColumns as any}
                title={p.title ?? dbT.labels.teamMembers}
                header={resolvedHeaderNode}
                footer={resolvedFooterNode}
                view={p.view}
                loading={p.loading}
                sticky={(p.sticky as any) || undefined}
                wrapperClassName={typeof p.wrapperClassName === 'string' ? p.wrapperClassName : ''}
                before={resolvedPreNode}
                after={resolvedPostNode}
                form={hasActions ? <GridUserForm t={gridT} /> : undefined}
                actions={actions as any}
                selection={resolvedSelection}
                onRowClick={p.onRowClick ? (record) => setClickedRecord(record as UserRecord) : undefined}
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
                                {gridT.selection.payloadTitle}
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
                                {gridT.playground.rowClickPayload}
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

const createPlayground = (gridT: ShowcaseGridI18n, dbT: ShowcaseGridDbI18n): PlaygroundConfig => ({
    size: 'fullscreen',
    layout: 'split',
    mockSeed: {
        [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])),
        [FROM_URL_PATH]: Object.fromEntries(Object.entries(FROM_URL_USERS).map(([k, v]) => [k, { ...v }])),
    },
    props: [
        ...createGridDbSpecificProps(dbT),
        ...createSharedProps(gridT, dbT),
    ],
    defaultProps: {
        path: GRID_SOURCE_PATH,
        fromUrl: false,
        recordId: '_key',
        view: 'table',
        columns: getBaseColumns(gridT),
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
        wrapperClassName: '',
        pre: '',
        post: '',
        title: dbT.labels.teamMembers,
        header: false,
        footer: false,
        onRowClick: false,
        reorderable: false,
        editDeepLink: false,
        audit: false,
    },
    render: (p) => (
        <WithMock>
            <GridDbPlaygroundPreview p={p} gridT={gridT} dbT={dbT} />
        </WithMock>
    ),
});

// ─── Section previews ─────────────────────────────────────────────────────────

function BasicUsagePreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={getDisplayColumns(gridT) as any}
                sortable={{ name: 'asc' } as any}
                wrapperClassName="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function FilterPreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={getDisplayColumns(gridT) as any}
                where={{ status: 'active' }}
                wrapperClassName="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function OrderPreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={getDisplayColumns(gridT) as any}
                order={{ name: 'asc' }}
                wrapperClassName="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function FromUrlPreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    return (
        <WithMock>
            <GridDB
                fromUrl
                columns={getDisplayColumns(gridT) as any}
                wrapperClassName="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function GroupingPreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    const provider = React.useMemo(() => new MockDataProvider({ [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])) }), []);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                columns={getDisplayColumns(gridT) as any}
                sortable={{ role: 'asc' } as any}
                groupBy="role"
                wrapperClassName="w-full"
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function GridDbPage() {
    const gridT = useShowcaseGridI18n() as ShowcaseGridI18n;
    const dbT = useShowcaseGridDbI18n() as ShowcaseGridDbI18n;
    const playground = React.useMemo(() => createPlayground(gridT, dbT), [gridT, dbT]);
    const propDocs = React.useMemo(() => createGridDbPropDocs(gridT, dbT), [gridT, dbT]);

    usePlayground(playground, 'GridDB');

    return (
        <PageLayout
            title={dbT.page.title}
            description={dbT.page.description}
        >
            {/* Basic usage */}
            <Section
                title={dbT.sections.basicUsage.title}
                description={dbT.sections.basicUsage.description}
                preview={<BasicUsagePreview gridT={gridT} />}
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
                title={dbT.sections.providerFilter.title}
                description={dbT.sections.providerFilter.description}
                preview={<FilterPreview gridT={gridT} />}
                code={`<GridDB
  path="/showcase/grid/users"
  columns={columns}
  where={{ status: "active" }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* Provider-side order */}
            <Section
                title={dbT.sections.providerOrder.title}
                description={dbT.sections.providerOrder.description}
                preview={<OrderPreview gridT={gridT} />}
                code={`<GridDB
  path="/showcase/grid/users"
  columns={columns}
  order={{ name: "asc" }}
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            {/* fromUrl */}
            <Section
                title={dbT.sections.fromUrl.title}
                description={`${dbT.sections.fromUrl.description} "${FROM_URL_PATH}".`}
                preview={<FromUrlPreview gridT={gridT} />}
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
                title={dbT.sections.grouping.title}
                description={dbT.sections.grouping.description}
                preview={<GroupingPreview gridT={gridT} />}
                code={`<GridDB
  path="/showcase/grid/users"
  columns={columns}
  sortable={{ role: "asc" }}
  groupBy="role"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`}
            />

            <PropDocsTable props={propDocs} />
        </PageLayout>
    );
}

