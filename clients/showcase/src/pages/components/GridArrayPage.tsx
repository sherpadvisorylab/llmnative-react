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
import type { I18nDict } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { useShowcaseGridArrayI18n, useShowcaseGridI18n } from '../../showcase/i18n';
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
type ShowcaseGridArrayI18n = I18nDict['showcase']['gridArray'];

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

// ─── Static column sets for section examples ─────────────────────────────────

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

const createGridArrayPropDocs = (gridT: ShowcaseGridI18n, arrayT: ShowcaseGridArrayI18n) => definePropDocs<GridArrayDocSurface>()([
    // ── GridArray-specific ────────────────────────────────────────────────────
    {
        name: 'records',
        type: 'TRecord[]',
        required: true,
        category: arrayT.propsDocs.categories.gridArray,
        description: `${arrayT.propsDocs.items.records.description} (${GRID_SOURCE_PATH}).`,
    },
    {
        name: 'recordId',
        type: 'keyof TRecord | ((record: TRecord) => string)',
        default: '"_key"',
        category: arrayT.propsDocs.categories.gridArray,
        description: arrayT.propsDocs.items.recordId.description,
        shape: `keyof TRecord\n| ((record: TRecord) => string)`,
    },
    {
        name: 'onLoad',
        type: '(records: TRecord[]) => TRecord[] | Promise<TRecord[]>',
        category: arrayT.propsDocs.categories.gridArray,
        description: arrayT.propsDocs.items.onLoad.description,
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
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.view.description,
    },
    {
        name: 'sortable',
        type: 'boolean | OrderConfig',
        default: 'true',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.sortable.description,
        shape: `boolean | { [field: string]: "asc" | "desc" }`,
    },
    {
        name: 'pagination',
        type: 'PaginationParams',
        default: '{ limit: 4, align: "end" }',
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.groupBy.description,
    },
    {
        name: 'reorderable',
        type: 'boolean',
        default: 'false',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.reorderable.description,
    },
    {
        name: 'title',
        type: 'ReactNode',
        default: '',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.title.description,
    },
    {
        name: 'header',
        type: 'ReactNode | ((ctx) => ReactNode)',
        default: 'false',
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.loading.description,
    },
    {
        name: 'sticky',
        type: '"top" | "bottom"',
        default: '',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.sticky.description,
    },
    {
        name: 'wrapperClassName',
        type: 'string',
        default: '',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.wrapperClassName.description,
    },
    {
        name: 'before',
        type: 'ReactNode',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.before.description,
    },
    {
        name: 'after',
        type: 'ReactNode',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.after.description,
    },
    {
        name: 'onRowClick',
        type: '(record: TRecord) => void',
        default: 'false',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.onRowClick.description,
    },
    {
        name: 'editDeepLink',
        type: 'boolean',
        default: 'false',
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.editDeepLink.description,
    },
    {
        name: 'onSave',
        type: 'GridMutationSaveHandler<TRecord>',
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.onDelete.description,
        shape: `(args: {
  record?: TRecord
}) => Promise<string | undefined>`,
    },
    {
        name: 'onComplete',
        type: 'GridAfterActionHandler<TRecord>',
        category: arrayT.propsDocs.categories.shared,
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
        category: arrayT.propsDocs.categories.shared,
        description: gridT.propsDocs.items.audit.description,
    },
]);

// ─── Playground prop definitions ──────────────────────────────────────────────

const createGridArraySpecificProps = (arrayT: ShowcaseGridArrayI18n): PropDef[] => [
    {
        group: arrayT.playground.groups.gridArray,
        name: 'records',
        type: 'TRecord[]',
        required: true,
        description: `${arrayT.playground.props.records.description} ${GRID_SOURCE_PATH}`,
        readOnly: true,
    },
    {
        group: arrayT.playground.groups.gridArray,
        name: 'recordId',
        type: 'keyof TRecord | ((record) => string)',
        default: '"_key"',
        description: arrayT.playground.props.recordId.description,
        control: 'textarea',
        textareaMode: 'text',
        rows: 2,
        shortcuts: [
            { label: arrayT.playground.props.recordId.shortcuts.nativeKey.label, value: '_key', help: arrayT.playground.props.recordId.shortcuts.nativeKey.help },
            { label: arrayT.playground.props.recordId.shortcuts.explicitId.label, value: 'id', help: arrayT.playground.props.recordId.shortcuts.explicitId.help },
            { label: arrayT.playground.props.recordId.shortcuts.functionId.label, value: 'record => record.id', help: arrayT.playground.props.recordId.shortcuts.functionId.help },
        ],
    },
    {
        group: arrayT.playground.groups.gridArray,
        name: 'onLoad',
        type: '(records: TRecord[]) => TRecord[] | Promise<TRecord[]>',
        description: arrayT.playground.props.onLoad.description,
        readOnly: true,
    },
];

const createSharedProps = (gridT: ShowcaseGridI18n, arrayT: ShowcaseGridArrayI18n): PropDef[] => [
    {
        group: arrayT.playground.groups.shared, name: 'columns', type: 'GridColumn<TRecord>[]',
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
        group: arrayT.playground.groups.shared, name: 'actions', type: '("add"|"edit"|"delete")[] | Record<string, GridAction>',
        description: gridT.playground.props.actions.description,
        control: 'json', rows: 6,
        shortcuts: [
            { label: gridT.playground.props.actions.shortcuts?.none?.label ?? 'none', value: {}, help: gridT.playground.props.actions.shortcuts?.none?.help ?? '' },
            { label: gridT.playground.props.actions.shortcuts?.crud?.label ?? 'crud', value: ['add', 'edit', 'delete'], help: gridT.playground.props.actions.shortcuts?.crud?.help ?? '' },
            { label: gridT.playground.props.actions.shortcuts?.custom?.label ?? 'custom', value: { preview: { kind: 'modal', label: gridT.actions.preview, icon: 'eye' } }, help: gridT.playground.props.actions.shortcuts?.custom?.help ?? '' },
        ],
    },
    { group: arrayT.playground.groups.shared, name: 'form', type: 'ReactElement | ((ctx) => ReactNode)', description: gridT.playground.props.form.description, readOnly: true },
    { group: arrayT.playground.groups.shared, name: 'view', type: '"table" | "gallery"', default: '"table"', description: gridT.playground.props.view.description, control: 'select', options: ['table', 'gallery'] },
    {
        group: arrayT.playground.groups.shared, name: 'sortable', type: 'boolean | OrderConfig', default: 'true',
        description: gridT.playground.props.sortable.description,
        control: 'json', rows: 2,
        shortcuts: [
            { label: gridT.playground.props.sortable.shortcuts?.true?.label ?? 'true', value: true, help: gridT.playground.props.sortable.shortcuts?.true?.help ?? '' },
            { label: gridT.playground.props.sortable.shortcuts?.false?.label ?? 'false', value: false, help: gridT.playground.props.sortable.shortcuts?.false?.help ?? '' },
            { label: gridT.playground.props.sortable.shortcuts?.nameAsc?.label ?? 'name asc', value: { name: 'asc' }, help: gridT.playground.props.sortable.shortcuts?.nameAsc?.help ?? '' },
        ],
    },
    {
        group: arrayT.playground.groups.shared, name: 'pagination', type: 'PaginationParams', default: '{"limit":4,"align":"end"}',
        description: gridT.playground.props.pagination.description,
        control: 'json', rows: 3,
        shortcuts: [
            { label: gridT.playground.props.pagination.shortcuts?.default?.label ?? 'default', value: { limit: 4, align: 'end' }, help: gridT.playground.props.pagination.shortcuts?.default?.help ?? '' },
            { label: gridT.playground.props.pagination.shortcuts?.compact?.label ?? 'compact', value: { limit: 2, align: 'center' }, help: gridT.playground.props.pagination.shortcuts?.compact?.help ?? '' },
        ],
    },
    {
        group: arrayT.playground.groups.shared, name: 'selection', type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>', default: 'false',
        description: gridT.playground.props.selection.description,
        control: 'json', rows: 3,
        shortcuts: [
            { label: gridT.playground.props.selection.shortcuts?.off?.label ?? 'off', value: false, help: gridT.playground.props.selection.shortcuts?.off?.help ?? '' },
            { label: gridT.playground.props.selection.shortcuts?.single?.label ?? 'single', value: 'single', help: gridT.playground.props.selection.shortcuts?.single?.help ?? '' },
            { label: gridT.playground.props.selection.shortcuts?.multiple?.label ?? 'multiple', value: 'multiple', help: gridT.playground.props.selection.shortcuts?.multiple?.help ?? '' },
            { label: gridT.playground.props.selection.shortcuts?.multiKeys?.label ?? 'defaultKeys', value: { mode: 'multiple', defaultKeys: ['u1', 'u5'] }, help: gridT.playground.props.selection.shortcuts?.multiKeys?.help ?? '' },
        ],
    },
    {
        group: arrayT.playground.groups.shared, name: 'groupBy', type: 'string | string[]', default: '',
        description: gridT.playground.props.groupBy.description,
        control: 'textarea', textareaMode: 'text', rows: 1, placeholder: gridT.playground.props.groupBy.placeholder,
        shortcuts: [
            { label: gridT.playground.props.groupBy.shortcuts?.off?.label ?? 'off', value: '', help: gridT.playground.props.groupBy.shortcuts?.off?.help ?? '' },
            { label: gridT.playground.props.groupBy.shortcuts?.role?.label ?? 'role', value: 'role', help: gridT.playground.props.groupBy.shortcuts?.role?.help ?? '' },
            { label: gridT.playground.props.groupBy.shortcuts?.status?.label ?? 'status', value: 'status', help: gridT.playground.props.groupBy.shortcuts?.status?.help ?? '' },
            { label: gridT.playground.props.groupBy.shortcuts?.team?.label ?? 'team', value: 'team', help: gridT.playground.props.groupBy.shortcuts?.team?.help ?? '' },
        ],
    },
    { group: arrayT.playground.groups.shared, name: 'reorderable', type: 'boolean', default: 'false', description: gridT.playground.props.reorderable.description, control: 'json', rows: 1, shortcuts: [{ label: gridT.playground.props.reorderable.shortcuts?.false?.label ?? 'false', value: false, help: gridT.playground.props.reorderable.shortcuts?.false?.help ?? '' }, { label: gridT.playground.props.reorderable.shortcuts?.true?.label ?? 'true', value: true, help: gridT.playground.props.reorderable.shortcuts?.true?.help ?? '' }] },
    { group: arrayT.playground.groups.shared, name: 'title', type: 'ReactNode', default: JSON.stringify(arrayT.labels.teamMembers), description: gridT.playground.props.title.description, control: 'text' },
    {
        group: arrayT.playground.groups.shared, name: 'header', type: 'ReactNode | ((ctx) => ReactNode)', default: 'false',
        description: gridT.playground.props.header.description,
        control: 'textarea', textareaMode: 'text', rows: 2,
        shortcuts: [{ label: gridT.playground.props.header.shortcuts?.false?.label ?? 'false', value: 'false', help: gridT.playground.props.header.shortcuts?.false?.help ?? '' }, { label: gridT.playground.props.header.shortcuts?.fn?.label ?? 'fn', value: 'ctx => `${ctx.title} · ${ctx.records.length} records`', help: gridT.playground.props.header.shortcuts?.fn?.help ?? '' }],
    },
    {
        group: arrayT.playground.groups.shared, name: 'footer', type: 'ReactNode | ((ctx) => ReactNode)', default: 'false',
        description: gridT.playground.props.footer.description,
        control: 'textarea', textareaMode: 'text', rows: 2,
        shortcuts: [{ label: gridT.playground.props.footer.shortcuts?.false?.label ?? 'false', value: 'false', help: gridT.playground.props.footer.shortcuts?.false?.help ?? '' }, { label: gridT.playground.props.footer.shortcuts?.fn?.label ?? 'fn', value: 'ctx => `${ctx.records.length} records loaded`', help: gridT.playground.props.footer.shortcuts?.fn?.help ?? '' }],
    },
    { group: arrayT.playground.groups.shared, name: 'loading', type: 'boolean', default: 'false', description: gridT.playground.props.loading.description, control: 'boolean' },
    { group: arrayT.playground.groups.shared, name: 'sticky', type: '"top" | "bottom"', default: '', description: gridT.playground.props.sticky.description, control: 'select', options: ['', 'top', 'bottom'] },
    { group: arrayT.playground.groups.shared, name: 'wrapperClassName', type: 'string', default: '', description: gridT.playground.props.wrapperClassName.description, control: 'text' },
    { group: arrayT.playground.groups.shared, name: 'before', type: 'ReactNode', description: gridT.playground.props.before.description, control: 'textarea', rows: 2 },
    { group: arrayT.playground.groups.shared, name: 'after', type: 'ReactNode', description: gridT.playground.props.after.description, control: 'textarea', rows: 2 },
    { group: arrayT.playground.groups.shared, name: 'onRowClick', type: '(record) => void', default: 'false', description: gridT.playground.props.onRowClick.description, control: 'boolean' },
    { group: arrayT.playground.groups.shared, name: 'editDeepLink', type: 'boolean', default: 'false', description: gridT.playground.props.editDeepLink.description, control: 'boolean' },
    { group: arrayT.playground.groups.shared, name: 'onSave', type: 'GridMutationSaveHandler<TRecord>', description: gridT.playground.props.onSave.description, readOnly: true },
    { group: arrayT.playground.groups.shared, name: 'onDelete', type: 'GridMutationDeleteHandler<TRecord>', description: gridT.playground.props.onDelete.description, readOnly: true },
    { group: arrayT.playground.groups.shared, name: 'onComplete', type: 'GridAfterActionHandler<TRecord>', description: gridT.playground.props.onComplete.description, readOnly: true },
    { group: arrayT.playground.groups.shared, name: 'audit', type: 'boolean', default: 'false', description: gridT.playground.props.audit.description, control: 'boolean' },
];

// ─── Playground preview component ────────────────────────────────────────────

function GridArrayPlaygroundPreview({
    p,
    gridT,
    arrayT,
}: {
    p: Record<string, any>;
    gridT: ShowcaseGridI18n;
    arrayT: ShowcaseGridArrayI18n;
}) {
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
                title={p.title ?? arrayT.labels.teamMembers}
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

const createPlayground = (gridT: ShowcaseGridI18n, arrayT: ShowcaseGridArrayI18n): PlaygroundConfig => ({
    size: 'fullscreen',
    layout: 'split',
    mockSeed: {
        [GRID_SOURCE_PATH]: Object.fromEntries(Object.entries(USERS).map(([k, v]) => [k, { ...v }])),
    },
    props: [
        ...createGridArraySpecificProps(arrayT),
        ...createSharedProps(gridT, arrayT),
    ],
    defaultProps: {
        recordId: '_key',
        view: 'table',
        columns: getBaseColumns(gridT),
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
        title: arrayT.labels.teamMembers,
        header: false,
        footer: false,
        onRowClick: false,
        reorderable: false,
        editDeepLink: false,
        audit: false,
    },
    render: (p) => (
        <WithMock>
            <GridArrayPlaygroundPreview p={p} gridT={gridT} arrayT={arrayT} />
        </WithMock>
    ),
});

// ─── Selection section previews ───────────────────────────────────────────────

function SingleSelectionPreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    const [clickedKey, setClickedKey] = React.useState('');
    return (
        <div className="space-y-3 w-full">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title={gridT.selection.chooseOneTitle}
                wrapperClassName="w-full"
                selection={{ mode: 'single', onChange: (s) => setClickedKey(s.keys[0] || '') }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
            <div className="text-xs text-muted-foreground">
                {gridT.labels.activeKey}: <span className="font-mono">{clickedKey || gridT.labels.none}</span>
            </div>
        </div>
    );
}

function MultipleSelectionPreview({ gridT }: { gridT: ShowcaseGridI18n }) {
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    return (
        <div className="space-y-3 w-full">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title={gridT.selection.bulkTitle}
                wrapperClassName="w-full"
                selection={{
                    mode: 'multiple',
                    onChange: (s) => {
                        setSelectedKeys(s.keys);
                    },
                }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
            <div className="text-xs text-muted-foreground">
                {gridT.labels.selectedCount}: <span className="font-mono">{selectedKeys.length > 0 ? selectedKeys.join(', ') : gridT.labels.none}</span>
            </div>
        </div>
    );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function GridArrayPage() {
    const gridT = useShowcaseGridI18n() as ShowcaseGridI18n;
    const arrayT = useShowcaseGridArrayI18n() as ShowcaseGridArrayI18n;
    const playground = React.useMemo(() => createPlayground(gridT, arrayT), [gridT, arrayT]);
    const propDocs = React.useMemo(() => createGridArrayPropDocs(gridT, arrayT), [gridT, arrayT]);

    usePlayground(playground, 'GridArray');

    return (
        <PageLayout
            title={arrayT.page.title}
            description={arrayT.page.description}
        >
            {/* Basic usage */}
            <Section
                title={arrayT.sections.basicUsage.title}
                description={arrayT.sections.basicUsage.description}
                preview={(
                    <GridArray
                        records={toArrayRecords()}
                        recordId="_key"
                        columns={getDisplayColumns(gridT) as any}
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
                title={arrayT.sections.onLoadTransform.title}
                description={arrayT.sections.onLoadTransform.description}
                preview={(
                    <GridArray
                        records={toArrayRecords()}
                        recordId="_key"
                        columns={getDisplayColumns(gridT) as any}
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
                title={arrayT.sections.grouping.title}
                description={arrayT.sections.grouping.description}
                preview={(
                    <GridArray
                        records={toArrayRecords()}
                        recordId="_key"
                        columns={getDisplayColumns(gridT) as any}
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
                title={arrayT.sections.selection.title}
                description={arrayT.sections.selection.description}
                bare
                preview={(
                    <div className="space-y-6 w-full">
                        <div>
                            <div className="mb-2 text-sm font-medium text-foreground">{arrayT.labels.singleSelection}</div>
                            <SingleSelectionPreview gridT={gridT} />
                        </div>
                        <div>
                            <div className="mb-2 text-sm font-medium text-foreground">{arrayT.labels.multipleSelection}</div>
                            <MultipleSelectionPreview gridT={gridT} />
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

            <PropDocsTable props={propDocs} />
        </PageLayout>
    );
}

