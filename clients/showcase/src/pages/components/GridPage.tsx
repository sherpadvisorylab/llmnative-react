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
    useDataProvider,
} from '@llmnative/react';
import type { I18nDict, RecordProps } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { useShowcaseGridI18n } from '../../showcase/i18n';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import { definePropDocs } from '../../docs-kit/docs';
import type { PlaygroundConfig, PropDef } from '../../docs-kit/playground';

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
    fromUrl: unknown;
    where: unknown;
    order: unknown;
    fieldMap: unknown;
    columns: unknown;
    view: unknown;
    sortable: unknown;
    pagination: unknown;
    groupBy: unknown;
    loading: unknown;
    sticky: unknown;
    wrapperClassName: unknown;
    title: unknown;
    header: unknown;
    footer: unknown;
    form: unknown;
    actions: unknown;
    selection: unknown;
    onRowClick: unknown;
    reorderable: unknown;
    onReorder: unknown;
    editDeepLink: unknown;
    onLoad: unknown;
    before: unknown;
    after: unknown;
    onSave: unknown;
    onDelete: unknown;
    onComplete: unknown;
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

const buildGalleryThumb = (record: UserRecord, t: ShowcaseI18n) => {
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
    ${getRoleLabel(t, record.role).toUpperCase()}
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

const withGalleryThumbs = (records: UserRecord[], t: ShowcaseI18n): RecordProps[] => (
    records.map((record) => ({
        ...record,
        img: (
            <img
                src={buildGalleryThumb(record, t)}
                alt={`${record.role} | ${record.team} | ${record.name}`}
                style={{ aspectRatio: '4 / 3' }}
            />
        ),
    })) as unknown as RecordProps[]
);

const toGalleryRecords = (t: ShowcaseI18n) => withGalleryThumbs(toArrayRecords(), t);

type ShowcaseI18n = I18nDict['showcase']['grid'];
const useGridI18n = () => useShowcaseGridI18n() as ShowcaseI18n;

const getRoleLabel = (t: ShowcaseI18n, role: unknown) => {
    switch (String(role)) {
        case 'admin':
            return t.values.roles.admin;
        case 'editor':
            return t.values.roles.editor;
        case 'viewer':
            return t.values.roles.viewer;
        default:
            return role == null ? '' : String(role);
    }
};

const getStatusLabel = (t: ShowcaseI18n, status: unknown) => {
    switch (String(status)) {
        case 'active':
            return t.values.statuses.active;
        case 'review':
            return t.values.statuses.review;
        case 'inactive':
            return t.values.statuses.inactive;
        default:
            return status == null ? '' : String(status);
    }
};

const getBaseColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true },
    {
        key: 'role',
        label: t.labels.role,
        sortable: true,
        render: ({ value }: { value: unknown }) => <Badge className={roleClass(String(value))}>{getRoleLabel(t, value)}</Badge>,
    },
    {
        key: 'status',
        label: t.labels.status,
        sortable: true,
        render: ({ value }: { value: unknown }) => <Badge className={statusClass(String(value))}>{getStatusLabel(t, value)}</Badge>,
    },
    { key: 'team', label: t.labels.team, sortable: true },
    { key: 'city', label: t.labels.city, sortable: true },
];

const getCompactColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true },
    {
        key: 'role',
        label: t.labels.role,
        sortable: true,
        render: ({ value }: { value: unknown }) => <Badge className={roleClass(String(value))}>{getRoleLabel(t, value)}</Badge>,
    },
];

const getExplicitCompactColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true },
    { key: 'role', label: t.labels.role, sortable: true },
];

const getNonSortableCompactColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: false },
    { key: 'email', label: t.labels.email, sortable: false },
    { key: 'role', label: t.labels.role, sortable: false },
];

const getPartiallySortableCompactColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: false },
    { key: 'role', label: t.labels.role, sortable: false },
];

const getLayoutColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'role', label: t.labels.role, sortable: true },
    { key: 'team', label: t.labels.team, sortable: true },
    { key: 'city', label: t.labels.city, sortable: true },
];

const getPlaygroundColumnsBase = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true, render: 'email' },
    { key: 'role', label: t.labels.role, sortable: true },
    { key: 'status', label: t.labels.status, sortable: true },
    { key: 'team', label: t.labels.team, sortable: true },
    { key: 'city', label: t.labels.city, sortable: true },
];

const getPlaygroundColumnsCompact = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true, render: 'email' },
    { key: 'role', label: t.labels.role, sortable: true, render: 'badge' },
];

const getPlaygroundColumnsAligned = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true, className: 'min-w-[15rem]' },
    { key: 'team', label: t.labels.team, sortable: true },
    { key: 'city', label: t.labels.city, sortable: true, className: 'text-center' },
    { key: 'status', label: t.labels.status, sortable: true, render: 'badge', className: 'text-right' },
];

const getPlaygroundColumnsBadgeFocus = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'role', label: t.labels.role, sortable: true, render: 'badge' },
    { key: 'status', label: t.labels.status, sortable: true, render: 'badge' },
    { key: 'email', label: t.labels.contact, sortable: false, render: 'email' },
];

const getPlaygroundColumnsFieldMap = (t: ShowcaseI18n) => [
    { key: 'fullName', label: t.labels.fullName, sortable: true },
    { key: 'mail', label: t.labels.email, sortable: true, render: 'email' },
    { key: 'state', label: t.labels.status, sortable: true, render: 'badge' },
];

const playgroundCrudActions = ['add', 'edit', 'delete'];

const getPlaygroundCustomActions = (t: ShowcaseI18n) => ({
    add: {
        kind: 'modal',
        label: t.actions.addTeammate,
        title: t.actions.addTeammate,
        size: 'lg',
        position: 'center',
    },
    edit: {
        kind: 'modal',
        label: t.actions.edit,
        title: t.actions.editTeammate,
        size: 'lg',
        position: 'left',
    },
    delete: {
        kind: 'delete',
        label: t.actions.delete,
        title: t.actions.deleteTeammateQuestion,
        body: t.actions.deleteTeammateBody,
        size: 'sm',
        position: 'center',
    },
    preview: {
        kind: 'modal',
        label: t.actions.preview,
        title: t.actions.previewTitle,
        body: t.actions.previewBody,
        size: 'xl',
        position: 'right',
        footer: false,
    },
});

const getPlaygroundCustomActionsSeed = (t: ShowcaseI18n) => ({
    add: {
        kind: 'modal',
        label: t.actions.addTeammate,
        title: t.actions.addTeammate,
        size: 'lg',
        position: 'center',
    },
    edit: {
        kind: 'modal',
        label: t.actions.edit,
        title: t.actions.editTeammate,
        size: 'lg',
        position: 'left',
    },
    delete: {
        kind: 'delete',
        label: t.actions.delete,
        title: t.actions.deleteTeammateQuestion,
        body: t.actions.deleteTeammateFromMock,
        size: 'sm',
        position: 'center',
    },
    preview: {
        kind: 'modal',
        label: t.actions.preview,
        title: t.actions.previewTitle,
        body: t.actions.previewBody,
        size: 'xl',
        position: 'right',
        footer: false,
    },
});

type PlaygroundActionJson =
    | false
    | string[]
    | Record<string, true | false | {
        kind?: 'modal' | 'delete' | 'route' | 'external';
        label?: string;
        icon?: string;
        visible?: boolean;
        disabled?: boolean;
        title?: string;
        size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
        position?: 'center' | 'top' | 'left' | 'right' | 'bottom';
        allowFullscreen?: boolean;
        header?: string;
        body?: string;
        footer?: string | false;
        to?: string;
        href?: string;
    }>;

const getPlaygroundInferColumns = (t: ShowcaseI18n) => [
    { key: 'name', label: t.labels.name, sortable: true },
    { key: 'email', label: t.labels.email, sortable: true },
    { key: 'role', label: t.labels.role, sortable: true },
    { key: 'status', label: t.labels.status, sortable: true },
    { key: 'team', label: t.labels.team, sortable: true },
    { key: 'city', label: t.labels.city, sortable: true },
];

const mapPlaygroundColumn = (t: ShowcaseI18n, column: Record<string, any>) => {
    if (column.render === 'badge') {
        return {
            ...column,
            render: ({ value, key }: { value: unknown; key: string }) => {
                const text = key === 'status'
                    ? getStatusLabel(t, value)
                    : key === 'role'
                        ? getRoleLabel(t, value)
                        : value == null
                            ? ''
                            : String(value);
                const badgeClass = key === 'status'
                    ? statusClass(String(value))
                    : key === 'role'
                        ? roleClass(String(value))
                        : undefined;
                return <Badge className={badgeClass}>{text}</Badge>;
            },
        };
    }

    if (column.render === 'email') {
        return {
            ...column,
            render: ({ value }: { value: unknown }) => {
                const text = value == null ? '' : String(value);
                return text ? (
                    <a className="text-primary underline-offset-2 hover:underline" href={`mailto:${text}`}>
                        {text}
                    </a>
                ) : null;
            },
        };
    }

    return column;
};

const renderActionTextBlock = (text?: string, tone: 'body' | 'header' | 'footer' = 'body') => {
    if (!text) return undefined;
    const className = tone === 'header'
        ? 'text-sm text-muted-foreground'
        : tone === 'footer'
            ? 'text-xs text-muted-foreground'
            : 'text-sm whitespace-pre-wrap';
    return <div className={className}>{text}</div>;
};

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

const resolvePlaygroundBoolean = (value: unknown) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') return true;
        if (normalized === 'false' || normalized === '') return false;
    }
    return Boolean(value);
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

const buildPlaygroundActions = (t: ShowcaseI18n, actionsValue: unknown) => {
    if (actionsValue === false || actionsValue == null) return undefined;

    if (typeof actionsValue === 'string') {
        if (actionsValue === 'none') return undefined;
        if (actionsValue === 'crud') return playgroundCrudActions;
        if (actionsValue === 'custom') return getPlaygroundCustomActionsSeed(t);
        return undefined;
    }

    if (Array.isArray(actionsValue)) {
        const entries = actionsValue.filter((value): value is string => typeof value === 'string');
        return entries.length ? entries : undefined;
    }

    if (typeof actionsValue !== 'object') return undefined;

    const entries = Object.entries(actionsValue as PlaygroundActionJson);
    if (!entries.length) return undefined;

    const resolved = entries.reduce<Record<string, any>>((acc, [actionKey, config]) => {
        if (!config) return acc;

        if (config === true) {
            if (actionKey === 'delete') acc[actionKey] = { kind: 'delete' };
            else acc[actionKey] = { kind: 'modal' };
            return acc;
        }

        const kind = config.kind ?? (actionKey === 'delete' ? 'delete' : 'modal');

        if (kind === 'route' && config.to) {
            acc[actionKey] = {
                kind,
                label: config.label,
                icon: config.icon,
                visible: config.visible,
                disabled: config.disabled,
                to: config.to,
            };
            return acc;
        }

        if (kind === 'external' && config.href) {
            acc[actionKey] = {
                kind,
                label: config.label,
                icon: config.icon,
                visible: config.visible,
                disabled: config.disabled,
                href: config.href,
            };
            return acc;
        }

        acc[actionKey] = {
            kind,
            label: config.label,
            icon: config.icon,
            visible: config.visible,
            disabled: config.disabled,
            title: config.title,
            size: config.size,
            position: config.position,
            allowFullscreen: config.allowFullscreen,
            header: renderActionTextBlock(config.header, 'header'),
            body: renderActionTextBlock(config.body, 'body'),
            footer: config.footer === false ? false : renderActionTextBlock(config.footer, 'footer'),
        };

        return acc;
    }, {});

    return Object.keys(resolved).length ? resolved : undefined;
};

const hasPlaygroundAction = (t: ShowcaseI18n, actionsValue: unknown, actionKey: string) => {
    if (actionsValue === false || actionsValue == null) return false;
    if (typeof actionsValue === 'string') {
        if (actionsValue === 'none') return false;
        if (actionsValue === 'crud') return playgroundCrudActions.includes(actionKey);
        if (actionsValue === 'custom') return Object.prototype.hasOwnProperty.call(getPlaygroundCustomActionsSeed(t), actionKey);
        return false;
    }
    if (Array.isArray(actionsValue)) return actionsValue.includes(actionKey);
    if (typeof actionsValue === 'object') return Object.prototype.hasOwnProperty.call(actionsValue, actionKey) && (actionsValue as Record<string, unknown>)[actionKey] !== false;
    return false;
};

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
    const t = useGridI18n();
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
                <Tab layout="default" className="min-w-0">
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
    const t = useGridI18n();
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
                    <ActionButton variant="secondary" className="btn-sm" label={copied ? t.labels.copied : t.labels.copy} onClick={copy} />
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
            <Grid path={GRID_SOURCE_PATH} wrapperClassName="w-full" pagination={{ limit: 4, align: 'end', sticky: false }} />
        </WithMock>
    );
}

function FromUrlGridPreview() {
    return (
        <WithMock>
            <Grid fromUrl wrapperClassName="w-full" pagination={{ limit: 4, align: 'end', sticky: false }} />
        </WithMock>
    );
}

function SingleSelectionPreview() {
    const t = useGridI18n();
    const [clickedKey, setClickedKey] = React.useState('');

    return (
        <div className="space-y-3">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title={t.selection.chooseOneTitle}
                wrapperClassName="w-full"
                selection={{ mode: 'single', onChange: (s) => setClickedKey(s.keys[0] || '') }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
            <div className="text-xs text-muted-foreground">
                {t.labels.activeKey}: <span className="font-mono">{clickedKey || t.labels.none}</span>
            </div>
        </div>
    );
}

function MultipleSelectionPreview() {
    const t = useGridI18n();
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);

    return (
        <div className="space-y-3">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title={t.selection.bulkTitle}
                wrapperClassName="w-full"
                selection={{
                    mode: 'multiple',
                    onChange: (s) => {
                        setSelectedKeys(s.keys);
                        setSelectedRecords(s.records as UserRecord[]);
                    },
                }}
                actions={{
                    exportSelected: {
                        kind: 'modal',
                        label: t.selection.exportSelected,
                        disabled: () => !selectedKeys.length,
                        title: t.selection.exportSelectedTitle.replace('{count}', String(selectedKeys.length)),
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
    const t = useGridI18n();
    const explicitCompactColumns = React.useMemo(() => getExplicitCompactColumns(t), [t]);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={explicitCompactColumns}
                title={t.examples.actions.items.crudPreset.tab}
                wrapperClassName="w-full"
                form={<GridUserForm />}
                actions={['add', 'edit', 'delete']}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function RouteActionPreview({ provider }: { provider: MockDataProvider }) {
    const t = useGridI18n();
    const explicitCompactColumns = React.useMemo(() => getExplicitCompactColumns(t), [t]);
    return (
        <WithMock provider={provider}>
            <GridDB
                path={GRID_SOURCE_PATH}
                order={{ name: 'asc' }}
                columns={explicitCompactColumns}
                title={t.actions.routeActionTitle}
                wrapperClassName="w-full"
                actions={{
                    add: {
                        kind: 'route',
                        label: t.actions.goToCreatePage,
                        to: '/components/grid/create',
                    },
                }}
                pagination={{ limit: 4, align: 'end', sticky: false }}
            />
        </WithMock>
    );
}

function ActionsPreview({ provider }: { provider: MockDataProvider }) {
    const t = useGridI18n();
    const explicitCompactColumns = React.useMemo(() => getExplicitCompactColumns(t), [t]);
    const actionColumns = React.useMemo(() => ([
        ...explicitCompactColumns,
        {
            key: 'actions',
            label: '',
            sortable: false,
            className: 'text-right',
            render: ({ record, runAction }: { record: RecordProps; runAction: (actionKey: string) => void }) => (
                <div className="flex justify-end">
                    <ActionButton
                        icon="eye"
                        title={`${t.actions.preview} ${String(record.name)}`}
                        variant="link"
                        onClick={() => runAction('preview')}
                    />
                </div>
            ),
        },
    ]), [explicitCompactColumns, t]);

    return (
        <WithMock provider={provider}>
            <>
                <GridDB
                    path={GRID_SOURCE_PATH}
                    order={{ name: 'asc' }}
                    columns={actionColumns}
                    title={t.actions.directoryTitle}
                    wrapperClassName="w-full"
                    form={<GridUserForm />}
                    actions={{
                        add: {
                            kind: 'modal',
                            title: t.actions.addTeammate,
                            size: 'lg',
                            position: 'center',
                        },
                        edit: {
                            kind: 'modal',
                            size: 'lg',
                            position: 'left',
                            title: ({ record }) => `${t.actions.edit} ${record?.name}`,
                            body: () => <GridUserForm />,
                            footer: ({ runAction }) => (
                                <>
                                    <ActionButton label={t.actions.save} onClick={() => runAction('save')} />
                                    <ActionButton variant="danger" label={t.actions.delete} onClick={() => runAction('remove')} />
                                </>
                            ),
                        },
                        delete: {
                            kind: 'delete',
                            size: 'sm',
                            position: 'center',
                            title: ({ record }) => `${t.actions.delete} ${record?.name}?`,
                            body: ({ record }) => (
                                <div className="text-sm">
                                    {t.actions.deleteTeammateBody} <span className="font-medium">{record?.email as string}</span>
                                </div>
                            ),
                        },
                        preview: {
                            kind: 'modal',
                            label: t.actions.preview,
                            size: 'xl',
                            position: 'right',
                            title: ({ record }) => String(record?.name ?? ''),
                            header: ({ record }) => (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                    <span>{record?.email as string}</span>
                                    <span>{getRoleLabel(t, record?.role)}</span>
                                    <span>{getStatusLabel(t, record?.status)}</span>
                                    <span>{record?.team as string}</span>
                                    <span>{record?.city as string}</span>
                                </div>
                            ),
                            body: ({ record }) => (
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-lg font-semibold">{record?.name as string}</div>
                                        <div className="text-sm text-muted-foreground">{record?.email as string}</div>
                                    </div>
                                    <div className="grid gap-2 text-sm">
                                        <div><span className="font-medium">{t.actions.roleLabel}</span> {getRoleLabel(t, record?.role)}</div>
                                        <div><span className="font-medium">{t.actions.statusLabel}</span> {getStatusLabel(t, record?.status)}</div>
                                        <div><span className="font-medium">{t.actions.teamLabel}</span> {record?.team as string}</div>
                                        <div><span className="font-medium">{t.actions.cityLabel}</span> {record?.city as string}</div>
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
                                    {t.actions.headerDescription}
                                </div>
                            </div>
                            <div className="ml-auto flex shrink-0 items-center gap-2">
                                <ActionButton label={t.actions.addTeammate} onClick={() => runAction('add')} />
                                {selection.hasSelection ? (
                                    <span className="text-xs text-muted-foreground">{t.labels.selectedCount.replace('{count}', String(selection.keys.length))}</span>
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

const buildGridPropDocs = (t: ShowcaseI18n) => definePropDocs<GridDocSurface>()([
    { name: 'records', type: 'RecordArray', description: t.propsDocs.items.records.description, category: t.propsDocs.categories.data },
    { name: 'recordId', type: 'keyof TRecord | ((record) => string)', description: t.propsDocs.items.recordId.description, category: t.propsDocs.categories.data },
    { name: 'path', type: 'string', description: t.propsDocs.items.path.description, category: t.propsDocs.categories.data },
    { name: 'fromUrl', type: 'boolean', description: t.propsDocs.items.fromUrl.description, category: t.propsDocs.categories.data },
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
        description: t.propsDocs.items.where.description,
        category: t.propsDocs.categories.data,
    },
    {
        name: 'order',
        type: 'OrderClause',
        shape: `{
  [field: string]: "asc" | "desc"
}`,
        description: t.propsDocs.items.order.description,
        category: t.propsDocs.categories.data,
    },
    {
        name: 'fieldMap',
        type: 'Record<string, string>',
        shape: `{
  [targetField: string]: string
}`,
        description: t.propsDocs.items.fieldMap.description,
        category: t.propsDocs.categories.data,
    },
    {
        name: 'onLoad',
        type: '(records: TRecord[]) => TRecord[] | Promise<TRecord[]>',
        shape: `(records: TRecord[]) => TRecord[] | Promise<TRecord[]>`,
        description: t.propsDocs.items.onLoad.description,
        category: t.propsDocs.categories.data,
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
        description: t.propsDocs.items.columns.description,
        category: t.propsDocs.categories.display,
    },
    { name: 'view', type: '"table" | "gallery"', default: '"table"', description: t.propsDocs.items.view.description, category: t.propsDocs.categories.display },
    {
        name: 'sortable',
        type: 'boolean | OrderConfig',
        shape: `{
  [field: string]: "asc" | "desc"
}`,
        default: 'true',
        description: t.propsDocs.items.sortable.description,
        category: t.propsDocs.categories.display,
    },
    {
        name: 'pagination',
        type: 'PaginationParams',
        shape: `{
  limit?: number
  align?: "start" | "center" | "end"
  sticky?: false | "top" | "bottom"
}`,
        description: t.propsDocs.items.pagination.description,
        category: t.propsDocs.categories.display,
    },
    { name: 'groupBy', type: 'string | string[]', description: t.propsDocs.items.groupBy.description, category: t.propsDocs.categories.display },
    { name: 'loading', type: 'boolean', default: 'false', description: t.propsDocs.items.loading.description, category: t.propsDocs.categories.display },
    { name: 'sticky', type: '"top" | "bottom"', description: t.propsDocs.items.sticky.description, category: t.propsDocs.categories.display },
    { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, category: t.propsDocs.categories.display },
    { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, category: t.propsDocs.categories.layout },
    { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, category: t.propsDocs.categories.layout },
    { name: 'title', type: 'ReactNode', description: t.propsDocs.items.title.description, category: t.propsDocs.categories.layout },
    {
        name: 'header',
        type: 'ReactNode | ((ctx) => ReactNode)',
        shape: `ReactNode | ((ctx: {
  title?: ReactNode
  records: TRecord[]
  selection: GridSelectionState<TRecord>
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
        description: t.propsDocs.items.header.description,
        category: t.propsDocs.categories.layout,
    },
    {
        name: 'footer',
        type: 'ReactNode | ((ctx) => ReactNode)',
        shape: `ReactNode | ((ctx: {
  records: TRecord[]
  selection: GridSelectionState<TRecord>
  runAction: (actionKey: string, record?: TRecord) => void
}) => ReactNode)`,
        description: t.propsDocs.items.footer.description,
        category: t.propsDocs.categories.layout,
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
        description: t.propsDocs.items.form.description,
        category: t.propsDocs.categories.actions,
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
  allowFullscreen?: boolean
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
        description: t.propsDocs.items.actions.description,
        category: t.propsDocs.categories.actions,
    },
    {
        name: 'selection',
        type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>',
        shape: `// string shorthand — Grid manages state, no callback
"single" | "multiple"

// object form — initial keys and/or callback
{
  mode: "single" | "multiple"
  defaultKeys?: string[]
  onChange?: (selection: GridSelectionState<TRecord>) => void
}

type GridSelectionState<TRecord> = {
  keys: string[]
  records: TRecord[]
  hasSelection: boolean
  clear: () => void
}`,
        default: 'false',
        description: t.propsDocs.items.selection.description,
        category: t.propsDocs.categories.behavior,
    },
    { name: 'onRowClick', type: '(record) => void', description: t.propsDocs.items.onRowClick.description, category: t.propsDocs.categories.behavior },
    { name: 'reorderable', type: 'boolean', default: 'false', description: t.propsDocs.items.reorderable.description, category: t.propsDocs.categories.behavior },
    { name: 'onReorder', type: 'GridReorderHandler<TRecord>', description: t.propsDocs.items.onReorder.description, shape: `type GridReorderHandler<TRecord> = (
  records: TRecord[],
  meta: GridReorderMeta<TRecord>
) => void

type GridReorderMeta<TRecord> = {
  fromIndex: number;
  toIndex: number;
  record: TRecord;
}`, category: t.propsDocs.categories.behavior },
    { name: 'editDeepLink', type: 'boolean', default: 'false', description: t.propsDocs.items.editDeepLink.description, category: t.propsDocs.categories.behavior },
    {
        name: 'onSave',
        type: 'GridMutationSaveHandler<TRecord>',
        description: t.propsDocs.items.onSave.description,
        shape: `type GridMutationSaveHandler<TRecord> = (
  args: GridMutationSaveArgs<TRecord>
) => Promise<string | undefined>

type GridMutationSaveArgs<TRecord> = {
  record?: TRecord;
  action: "create" | "update";
  storagePath?: string;
}`,
        category: t.propsDocs.categories.dataLifecycle,
    },
    {
        name: 'onDelete',
        type: 'GridMutationDeleteHandler<TRecord>',
        description: t.propsDocs.items.onDelete.description,
        shape: `type GridMutationDeleteHandler<TRecord> = (
  args: GridMutationDeleteArgs<TRecord>
) => Promise<string | undefined>

type GridMutationDeleteArgs<TRecord> = {
  record?: TRecord;
}`,
        category: t.propsDocs.categories.dataLifecycle,
    },
    {
        name: 'onComplete',
        type: 'GridAfterActionHandler<TRecord>',
        description: t.propsDocs.items.onComplete.description,
        shape: `type GridAfterActionHandler<TRecord> = (
  args: GridAfterActionArgs<TRecord>
) => Promise<boolean>

type GridAfterActionArgs<TRecord> = {
  record?: TRecord;
  action: "create" | "update" | "delete";
}`,
        category: t.propsDocs.categories.dataLifecycle,
    },
    { name: 'audit', type: 'boolean', default: 'false', description: t.propsDocs.items.audit.description, category: t.propsDocs.categories.dataLifecycle },
]);

function GridPlaygroundPreview({ p }: { p: Record<string, any> }) {
    const t = useGridI18n();
    const [selectionKeys, setSelectionKeys] = React.useState<string[]>([]);
    const [selectedRecords, setSelectedRecords] = React.useState<UserRecord[]>([]);
    const [clickedRecord, setClickedRecord] = React.useState<UserRecord | null>(null);
    const [reorderPayload, setReorderPayload] = React.useState<{
        records: string[];
        meta: { fromIndex: number; toIndex: number; record: string | null };
    } | null>(null);
    const db = useDataProvider();

    const sourceMode = (p.source as 'db' | 'array') ?? 'db';
    const selectionMode = React.useMemo((): false | 'single' | 'multiple' => {
        const val = p.selection;
        if (!val || val === 'false' || val === false) return false;
        if (typeof val === 'string') return val as 'single' | 'multiple';
        return ((val as any).mode as 'single' | 'multiple') || false;
    }, [p.selection]);
    const recordId = React.useMemo(() => resolvePlaygroundRecordId(p.recordId), [p.recordId]);
    const isColumnsInfer = p.columns == null || (typeof p.columns === 'object' && !Array.isArray(p.columns) && Object.keys(p.columns).length === 0);
    const reorderableRequested = resolvePlaygroundBoolean(p.reorderable);
    const previewView = reorderableRequested ? 'table' : p.view;
    const previewSourceMode = reorderableRequested ? 'array' : sourceMode;
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
    const pagination = typeof p.pagination === 'object' && p.pagination !== null ? p.pagination : { limit: 4 };
    const where = previewSourceMode === 'db' && typeof p.where === 'object' && p.where !== null && Object.keys(p.where).length > 0 ? p.where : undefined;
    const order = previewSourceMode === 'db' && typeof p.order === 'object' && p.order !== null && Object.keys(p.order).length > 0 ? p.order : undefined;
    const fieldMap = previewSourceMode === 'db' && typeof p.fieldMap === 'object' && p.fieldMap !== null && Object.keys(p.fieldMap).length > 0 ? p.fieldMap : undefined;
    const onLoadRecords = previewSourceMode === 'db' && previewView === 'gallery'
        ? (records: UserRecord[]) => withGalleryThumbs(records, t)
        : undefined;
    const loading = p.loading as boolean | undefined;
    const sticky = (p.sticky as string) || undefined;
    const wrapperClassName = typeof p.wrapperClassName === 'string' ? p.wrapperClassName : '';
    const actions = React.useMemo(() => buildPlaygroundActions(t, p.actions), [p.actions, t]);
    const hasPreviewAction = React.useMemo(() => hasPlaygroundAction(t, p.actions, 'preview'), [p.actions, t]);
    const resolvedHeaderNode = React.useMemo(() => resolvePlaygroundNode<any>(p.header), [p.header]);
    const resolvedFooterNode = React.useMemo(() => resolvePlaygroundNode<any>(p.footer), [p.footer]);
    const resolvedBeforeNode = typeof p.before === 'string' && p.before.trim() && p.before.trim().toLowerCase() !== 'false'
        ? p.before.trim()
        : undefined;
    const resolvedAfterNode = typeof p.after === 'string' && p.after.trim() && p.after.trim().toLowerCase() !== 'false'
        ? p.after.trim()
        : undefined;

    const [rawArrayRecords, setRawArrayRecords] = React.useState<UserRecord[]>([]);
    React.useEffect(() => {
        if (previewSourceMode !== 'array') return;
        return db.subscribe(GRID_SOURCE_PATH, (recs) => setRawArrayRecords(recs as UserRecord[]));
    }, [db, previewSourceMode]);

    const arrayRecords = React.useMemo(
        () => previewView === 'gallery' ? withGalleryThumbs(rawArrayRecords, t) : rawArrayRecords,
        [previewView, rawArrayRecords, t],
    );

    const [reorderState, setReorderState] = React.useState<UserRecord[] | null>(null);
    React.useEffect(() => {
        setReorderState(null);
        setReorderPayload(null);
    }, [rawArrayRecords]);
    const reorderable = reorderableRequested && previewSourceMode === 'array' && previewView === 'table';
    const effectiveArrayRecords = reorderable && reorderState !== null ? reorderState : arrayRecords;
    const effectiveSortable = reorderable ? false : p.sortable;

    const previewColumnDef = {
        key: '_preview',
        label: '',
        sortable: false,
        className: 'w-0 text-end',
        render: ({ runAction }: { runAction: (actionKey: string) => void }) => (
            <ActionButton icon="eye" variant="link" onClick={() => runAction('preview')} />
        ),
    };
    const baseColumnSet = React.useMemo(() => {
        if (isColumnsInfer) return getPlaygroundInferColumns(t);
        if (!Array.isArray(p.columns)) return undefined;
        return p.columns.map((column) => mapPlaygroundColumn(t, column));
    }, [isColumnsInfer, p.columns, t]);
    const columns = React.useMemo(() => {
        if (!baseColumnSet) return undefined;
        if (!hasPreviewAction) return baseColumnSet;
        return [...baseColumnSet, previewColumnDef];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseColumnSet, hasPreviewAction]);

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

    const hasOutput = selectionMode !== false || p.onRowClick || reorderable;

    return (
        <div className="space-y-4">
            {reorderable && (
                <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                    {t.playground.reorderPreviewNotice}
                </div>
            )}
            {previewSourceMode === 'array' ? (
                <GridArray
                    records={effectiveArrayRecords as any}
                    recordId={recordId as any}
                    columns={columns as any}
                    title={p.title ?? t.playground.titleDefault}
                    header={resolvedHeaderNode}
                    footer={resolvedFooterNode}
                    view={previewView}
                    loading={loading}
                    sticky={sticky as any}
                    wrapperClassName={wrapperClassName}
                    before={resolvedBeforeNode}
                    after={resolvedAfterNode}
                    form={actions ? <GridUserForm /> : undefined}
                    actions={actions as any}
                    selection={resolvedSelection}
                    onRowClick={p.onRowClick ? (record) => setClickedRecord(record as UserRecord) : undefined}
                    sortable={effectiveSortable}
                    groupBy={groupBy}
                    pagination={pagination}
                    reorderable={reorderable}
                    onReorder={reorderable ? (records, meta) => {
                        const nextRecords = records as UserRecord[];
                        setReorderState(nextRecords);
                        setReorderPayload({
                            records: nextRecords.map((record) => record._key || record.id || record.email),
                            meta: {
                                fromIndex: meta.fromIndex,
                                toIndex: meta.toIndex,
                                record: (meta.record as UserRecord | undefined)?._key
                                    || (meta.record as UserRecord | undefined)?.id
                                    || (meta.record as UserRecord | undefined)?.email
                                    || null,
                            },
                        });
                    } : undefined}
                    audit={p.audit}
                    onSave={actions ? async ({ record }) => {
                        const key = (record as any)?._key || (record as any)?.id || `u${Date.now()}`;
                        return `${GRID_SOURCE_PATH}/${key}`;
                    } : undefined}
                    onDelete={actions ? async ({ record }) => (
                        record ? `${GRID_SOURCE_PATH}/${(record as any)._key}` : undefined
                    ) : undefined}
                />
            ) : (
                <GridDB
                    path={GRID_SOURCE_PATH}
                    where={where}
                    order={order}
                    fieldMap={fieldMap}
                    recordId={recordId as any}
                    columns={columns as any}
                    title={p.title ?? t.playground.titleDefault}
                    header={resolvedHeaderNode}
                    footer={resolvedFooterNode}
                    view={previewView}
                    loading={loading}
                    sticky={sticky as any}
                    wrapperClassName={wrapperClassName}
                    before={resolvedBeforeNode}
                    after={resolvedAfterNode}
                    onLoad={onLoadRecords as any}
                    form={actions ? <GridUserForm /> : undefined}
                    actions={actions as any}
                    selection={resolvedSelection}
                    onRowClick={p.onRowClick ? (record) => setClickedRecord(record as UserRecord) : undefined}
                    sortable={effectiveSortable}
                    groupBy={groupBy}
                    pagination={pagination}
                    audit={p.audit}
                    editDeepLink={p.editDeepLink && actions ? true : undefined}
                />
            )}

                {hasOutput && (
                    <div className="grid gap-3 xl:grid-cols-2">
                        {selectionMode !== false && (
                            <div className="rounded-md border bg-muted/40 p-3">
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.selection.payloadTitle}</div>
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
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.playground.rowClickPayload}</div>
                                <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                                    {JSON.stringify(clickedRecord ?? null, null, 2)}
                                </pre>
                            </div>
                        )}
                        {reorderable && (
                            <div className="rounded-md border bg-muted/40 p-3">
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.playground.reorderPayload}</div>
                                <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                                    {JSON.stringify(
                                        reorderPayload ?? {
                                            records: effectiveArrayRecords.map((record) => record._key || record.id || record.email),
                                            meta: null,
                                        },
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
    );
}

const buildPlayground = (t: ShowcaseI18n): PlaygroundConfig => ({
    size: 'fullscreen',
    layout: 'split',
    mockSeed: {
        [GRID_SOURCE_PATH]: USERS,
    },
    props: [
        // ── Data source ──────────────────────────────────────────────────────
        { name: 'source', type: '"db" | "array"', default: '"db"', description: t.playground.props.source.description, control: 'select', options: ['db', 'array'] },
        { name: 'path', type: 'string', description: t.playground.props.path.description, readOnly: true, hidden: (props) => props.source === 'array' },
        { name: 'fromUrl', type: 'boolean', default: 'false', description: t.playground.props.fromUrl.description, control: 'boolean', hidden: (props) => props.source === 'array' },
        { name: 'records', type: 'RecordArray', description: t.playground.props.records.description, readOnly: true, hidden: (props) => props.source !== 'array' },
        {
            name: 'recordId',
            type: 'keyof TRecord | ((record) => string)',
            default: '"_key"',
            description: t.playground.props.recordId.description,
            help: t.playground.props.recordId.help,
            control: 'textarea',
            textareaMode: 'text',
            rows: 3,
            shortcuts: [
                { label: t.playground.props.recordId.shortcuts?._key.label ?? '_key', value: '_key', help: t.playground.props.recordId.shortcuts?._key.help ?? '' },
                { label: t.playground.props.recordId.shortcuts?.id.label ?? 'id', value: 'id', help: t.playground.props.recordId.shortcuts?.id.help ?? '' },
                { label: t.playground.props.recordId.shortcuts?.fnId.label ?? 'fn id', value: 'record => record.id', help: t.playground.props.recordId.shortcuts?.fnId.help ?? '' },
                { label: t.playground.props.recordId.shortcuts?.concat.label ?? 'concat', value: 'record => `${record.team}-${record.id}`', help: t.playground.props.recordId.shortcuts?.concat.help ?? '' },
            ],
        },
        {
            name: 'where',
            type: 'WhereClause',
            default: '{}',
            description: t.playground.props.where.description,
            help: t.playground.props.where.help,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.playground.props.where.shortcuts?.empty.label ?? 'empty', value: {}, help: t.playground.props.where.shortcuts?.empty.help ?? '' },
                { label: t.playground.props.where.shortcuts?.active.label ?? 'active', value: { status: 'active' }, help: t.playground.props.where.shortcuts?.active.help ?? '' },
                { label: t.playground.props.where.shortcuts?.admins.label ?? 'admins', value: { role: 'admin' }, help: t.playground.props.where.shortcuts?.admins.help ?? '' },
                { label: t.playground.props.where.shortcuts?.teamIn.label ?? 'team in', value: { team: { in: ['Platform', 'Operations'] } }, help: t.playground.props.where.shortcuts?.teamIn.help ?? '' },
            ],
            hidden: (props) => props.source === 'array',
        },
        {
            name: 'order',
            type: 'OrderClause',
            default: '{}',
            description: t.playground.props.order.description,
            help: t.playground.props.order.help,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.playground.props.order.shortcuts?.none.label ?? 'none', value: {}, help: t.playground.props.order.shortcuts?.none.help ?? '' },
                { label: t.playground.props.order.shortcuts?.nameAsc.label ?? 'name asc', value: { name: 'asc' }, help: t.playground.props.order.shortcuts?.nameAsc.help ?? '' },
                { label: t.playground.props.order.shortcuts?.emailDesc.label ?? 'email desc', value: { email: 'desc' }, help: t.playground.props.order.shortcuts?.emailDesc.help ?? '' },
            ],
            hidden: (props) => props.source === 'array',
        },
        {
            name: 'fieldMap',
            type: 'Record<string, string>',
            default: '{}',
            description: t.playground.props.fieldMap.description,
            help: t.playground.props.fieldMap.help,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.playground.props.fieldMap.shortcuts?.empty.label ?? 'empty', value: {}, help: t.playground.props.fieldMap.shortcuts?.empty.help ?? '' },
                { label: t.playground.props.fieldMap.shortcuts?.fullName.label ?? 'fullName', value: { fullName: 'name' }, help: t.playground.props.fieldMap.shortcuts?.fullName.help ?? '' },
                { label: t.playground.props.fieldMap.shortcuts?.mail.label ?? 'mail', value: { mail: 'email', state: 'status' }, help: t.playground.props.fieldMap.shortcuts?.mail.help ?? '' },
            ],
            hidden: (props) => props.source === 'array',
        },
        { name: 'onLoad', type: '(data) => data', description: t.playground.props.onLoad.description, readOnly: true, hidden: (props) => props.source === 'array' },
        // ── Display ──────────────────────────────────────────────────────────
        {
            name: 'columns',
            type: 'GridColumn<TRecord>[]',
            default: JSON.stringify(getPlaygroundColumnsBase(t)),
            description: t.playground.props.columns.description,
            help: t.playground.props.columns.help,
            control: 'json',
            shortcuts: [
                { label: t.playground.props.columns.shortcuts?.infer.label ?? 'infer', value: {}, help: t.playground.props.columns.shortcuts?.infer.help ?? '' },
                { label: t.playground.props.columns.shortcuts?.base.label ?? 'base', value: getPlaygroundColumnsBase(t), help: t.playground.props.columns.shortcuts?.base.help ?? '' },
                { label: t.playground.props.columns.shortcuts?.compact.label ?? 'compact', value: getPlaygroundColumnsCompact(t), help: t.playground.props.columns.shortcuts?.compact.help ?? '' },
                { label: t.playground.props.columns.shortcuts?.badge.label ?? 'badge', value: getPlaygroundColumnsBadgeFocus(t), help: t.playground.props.columns.shortcuts?.badge.help ?? '' },
                { label: t.playground.props.columns.shortcuts?.fieldMap.label ?? 'fieldMap', value: getPlaygroundColumnsFieldMap(t), help: t.playground.props.columns.shortcuts?.fieldMap.help ?? '' },
                { label: t.playground.props.columns.shortcuts?.align.label ?? 'align', value: getPlaygroundColumnsAligned(t), help: t.playground.props.columns.shortcuts?.align.help ?? '' },
            ],
        },
        { name: 'view', type: '"table" | "gallery"', default: '"table"', description: t.playground.props.view.description, control: 'select', options: ['table', 'gallery'] },
        {
            name: 'sortable',
            type: 'boolean | OrderConfig',
            default: 'true',
            description: t.playground.props.sortable.description,
            help: t.playground.props.sortable.help,
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: t.playground.props.sortable.shortcuts?.true.label ?? 'true', value: true, help: t.playground.props.sortable.shortcuts?.true.help ?? '' },
                { label: t.playground.props.sortable.shortcuts?.false.label ?? 'false', value: false, help: t.playground.props.sortable.shortcuts?.false.help ?? '' },
                { label: t.playground.props.sortable.shortcuts?.nameAsc.label ?? 'name asc', value: { name: 'asc' }, help: t.playground.props.sortable.shortcuts?.nameAsc.help ?? '' },
            ],
        },
        {
            name: 'reorderable',
            type: 'boolean',
            default: 'false',
            description: t.playground.props.reorderable.description,
            help: t.playground.props.reorderable.help,
            control: 'textarea',
            textareaMode: 'text',
            rows: 2,
            shortcuts: [
                { label: t.playground.props.reorderable.shortcuts?.false.label ?? 'false', value: 'false', help: t.playground.props.reorderable.shortcuts?.false.help ?? '' },
                { label: t.playground.props.reorderable.shortcuts?.true.label ?? 'true', value: 'true', help: t.playground.props.reorderable.shortcuts?.true.help ?? '' },
            ],
        },
        {
            name: 'pagination',
            type: 'PaginationParams',
            default: '{"limit":4,"align":"end"}',
            description: t.playground.props.pagination.description,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.playground.props.pagination.shortcuts?.default.label ?? 'default', value: { limit: 4, align: 'end' }, help: t.playground.props.pagination.shortcuts?.default.help ?? '' },
                { label: t.playground.props.pagination.shortcuts?.compact.label ?? 'compact', value: { limit: 2, align: 'center' }, help: t.playground.props.pagination.shortcuts?.compact.help ?? '' },
                { label: t.playground.props.pagination.shortcuts?.sticky.label ?? 'sticky', value: { limit: 4, align: 'end', sticky: 'bottom' }, help: t.playground.props.pagination.shortcuts?.sticky.help ?? '' },
            ],
        },
        {
            name: 'groupBy',
            type: 'string | string[]',
            default: '',
            description: t.playground.props.groupBy.description,
            control: 'textarea',
            textareaMode: 'text',
            rows: 1,
            placeholder: t.playground.props.groupBy.placeholder,
            shortcuts: [
                { label: t.playground.props.groupBy.shortcuts?.off.label ?? 'off', value: '', help: t.playground.props.groupBy.shortcuts?.off.help ?? '' },
                { label: t.playground.props.groupBy.shortcuts?.role.label ?? 'role', value: 'role', help: t.playground.props.groupBy.shortcuts?.role.help ?? '' },
                { label: t.playground.props.groupBy.shortcuts?.status.label ?? 'status', value: 'status', help: t.playground.props.groupBy.shortcuts?.status.help ?? '' },
                { label: t.playground.props.groupBy.shortcuts?.team.label ?? 'team', value: 'team', help: t.playground.props.groupBy.shortcuts?.team.help ?? '' },
                { label: t.playground.props.groupBy.shortcuts?.roleStatus.label ?? 'role+status', value: ['role', 'status'], help: t.playground.props.groupBy.shortcuts?.roleStatus.help ?? '' },
            ],
        },
        { name: 'loading', type: 'boolean', default: 'false', description: t.playground.props.loading.description, control: 'boolean' },
        { name: 'sticky', type: '"top" | "bottom"', default: '""', description: t.playground.props.sticky.description, control: 'select', options: ['', 'top', 'bottom'] },
        { name: 'wrapperClassName', type: 'string', default: '""', description: t.playground.props.wrapperClassName.description, control: 'text' },
        {
            name: 'before',
            type: 'ReactNode',
            default: '""',
            description: t.playground.props.before.description,
            control: 'textarea',
            rows: 2,
        },
        {
            name: 'after',
            type: 'ReactNode',
            default: '""',
            description: t.playground.props.after.description,
            control: 'textarea',
            rows: 2,
        },
        // ── Layout ───────────────────────────────────────────────────────────
        { name: 'title', type: 'ReactNode', default: JSON.stringify(t.playground.titleDefault), description: t.playground.props.title.description, control: 'text' },
        {
            name: 'header',
            type: 'ReactNode | ((ctx) => ReactNode)',
            default: 'false',
            description: t.playground.props.header.description,
            help: t.playground.props.header.help,
            control: 'textarea',
            textareaMode: 'text',
            rows: 3,
            shortcuts: [
                { label: t.playground.props.header.shortcuts?.false.label ?? 'false', value: 'false', help: t.playground.props.header.shortcuts?.false.help ?? '' },
                { label: t.playground.props.header.shortcuts?.fn.label ?? 'fn', value: 'ctx => `${ctx.title} · ${ctx.records.length} records`', help: t.playground.props.header.shortcuts?.fn.help ?? '' },
                { label: t.playground.props.header.shortcuts?.text.label ?? 'text', value: 'Team directory', help: t.playground.props.header.shortcuts?.text.help ?? '' },
            ],
        },
        {
            name: 'footer',
            type: 'ReactNode | ((ctx) => ReactNode)',
            default: 'false',
            description: t.playground.props.footer.description,
            help: t.playground.props.footer.help,
            control: 'textarea',
            textareaMode: 'text',
            rows: 3,
            shortcuts: [
                { label: t.playground.props.footer.shortcuts?.false.label ?? 'false', value: 'false', help: t.playground.props.footer.shortcuts?.false.help ?? '' },
                { label: t.playground.props.footer.shortcuts?.fn.label ?? 'fn', value: 'ctx => `${ctx.records.length} records loaded`', help: t.playground.props.footer.shortcuts?.fn.help ?? '' },
                { label: t.playground.props.footer.shortcuts?.text.label ?? 'text', value: '4 records loaded', help: t.playground.props.footer.shortcuts?.text.help ?? '' },
            ],
        },
        // ── Actions ──────────────────────────────────────────────────────────
        {
            name: 'actions',
            type: '("add" | "edit" | "delete")[] | Record<string, GridAction>',
            default: JSON.stringify(getPlaygroundCustomActionsSeed(t)),
            description: t.playground.props.actions.description,
            help: t.playground.props.actions.help,
            control: 'json',
            rows: 12,
            shortcuts: [
                { label: t.playground.props.actions.shortcuts?.none.label ?? 'none', value: {}, help: t.playground.props.actions.shortcuts?.none.help ?? '' },
                { label: t.playground.props.actions.shortcuts?.crud.label ?? 'crud', value: playgroundCrudActions, help: t.playground.props.actions.shortcuts?.crud.help ?? '' },
                { label: t.playground.props.actions.shortcuts?.custom.label ?? 'custom', value: getPlaygroundCustomActionsSeed(t), help: t.playground.props.actions.shortcuts?.custom.help ?? '' },
                {
                    label: t.playground.props.actions.shortcuts?.links.label ?? 'links',
                    value: {
                        docs: { kind: 'route', label: 'Open docs', to: '/docs/grid' },
                        website: { kind: 'external', label: 'Open site', href: 'https://example.com' },
                    },
                    help: t.playground.props.actions.shortcuts?.links.help ?? '',
                },
            ],
        },
        { name: 'form', type: 'ReactElement | ((ctx) => ReactNode)', description: t.playground.props.form.description, readOnly: true },
        // ── Behavior ─────────────────────────────────────────────────────────
        {
            name: 'selection',
            type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>',
            default: 'false',
            description: t.playground.props.selection.description,
            help: t.playground.props.selection.help,
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: t.playground.props.selection.shortcuts?.off.label ?? 'off', value: false, help: t.playground.props.selection.shortcuts?.off.help ?? '' },
                { label: t.playground.props.selection.shortcuts?.single.label ?? 'single', value: 'single', help: t.playground.props.selection.shortcuts?.single.help ?? '' },
                { label: t.playground.props.selection.shortcuts?.multiple.label ?? 'multiple', value: 'multiple', help: t.playground.props.selection.shortcuts?.multiple.help ?? '' },
                { label: t.playground.props.selection.shortcuts?.defaultKeys.label ?? 'defaultKeys', value: { mode: 'single', defaultKeys: ['u1'] }, help: t.playground.props.selection.shortcuts?.defaultKeys.help ?? '' },
                { label: t.playground.props.selection.shortcuts?.multiKeys.label ?? 'multi+keys', value: { mode: 'multiple', defaultKeys: ['u1', 'u5'] }, help: t.playground.props.selection.shortcuts?.multiKeys.help ?? '' },
            ],
        },
        { name: 'onRowClick', type: '(record) => void', default: 'false', description: t.playground.props.onRowClick.description, control: 'boolean' },
        { name: 'onReorder', type: 'GridReorderHandler<TRecord>', description: t.playground.props.onReorder.description, readOnly: true, hidden: (props) => !resolvePlaygroundBoolean(props.reorderable) },
        { name: 'editDeepLink', type: 'boolean', default: 'false', description: t.playground.props.editDeepLink.description, control: 'boolean', hidden: (props) => !hasPlaygroundAction(t, props.actions, 'edit') || props.view === 'gallery' || props.source === 'array' },
        // ── Data lifecycle ────────────────────────────────────────────────────
        { name: 'onLoad', type: '(records) => records | Promise<records>', description: t.playground.props.onLoadLifecycle.description, readOnly: true },
        { name: 'onSave', type: 'GridMutationSaveHandler<TRecord>', description: t.playground.props.onSave.description, readOnly: true },
        { name: 'onDelete', type: 'GridMutationDeleteHandler<TRecord>', description: t.playground.props.onDelete.description, readOnly: true },
        { name: 'onComplete', type: 'GridAfterActionHandler<TRecord>', description: t.playground.props.onComplete.description, readOnly: true },
        { name: 'audit', type: 'boolean', default: 'false', description: t.playground.props.audit.description, control: 'boolean', hidden: (props) => !buildPlaygroundActions(t, props.actions) },
    ],
    defaultProps: {
        source: 'db',
        recordId: '_key',
        view: 'table',
        columns: getPlaygroundColumnsBase(t),
        actions: getPlaygroundCustomActionsSeed(t),
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
        before: '',
        after: '',
        title: t.playground.titleDefault,
        header: false,
        footer: false,
        onRowClick: false,
        reorderable: false,
        editDeepLink: false,
        audit: false,
    },
    render: (p) => <GridPlaygroundPreview p={p} />,
});

export default function GridPage() {
    const t = useGridI18n();
    const gridPropDocs = React.useMemo(() => buildGridPropDocs(t), [t]);
    const playground = React.useMemo(() => buildPlayground(t), [t]);
    usePlayground(playground, 'Grid');
    const [arrayRecords, setArrayRecords] = React.useState(toArrayRecords());
    const crudProvider = React.useMemo(() => new MockDataProvider(createMockSeed()), []);
    const layoutRecords = React.useMemo(() => toGalleryRecords(t), [t]);
    const compactColumns = React.useMemo(() => getCompactColumns(t), [t]);
    const explicitCompactColumns = React.useMemo(() => getExplicitCompactColumns(t), [t]);
    const nonSortableCompactColumns = React.useMemo(() => getNonSortableCompactColumns(t), [t]);
    const partiallySortableCompactColumns = React.useMemo(() => getPartiallySortableCompactColumns(t), [t]);
    const layoutColumns = React.useMemo(() => getLayoutColumns(t), [t]);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <TabbedSection
                title={t.examples.sources.title}
                description={t.examples.sources.description}
                tabs={[
                    {
                        label: t.examples.sources.items.minimal.tab,
                        title: t.examples.sources.items.minimal.title,
                        description: t.examples.sources.items.minimal.description,
                        preview: <MinimalGridPreview />,
                        code: `<Grid
  path="/showcase/grid/users"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: t.examples.sources.items.pathQuery.tab,
                        title: t.examples.sources.items.pathQuery.title,
                        description: t.examples.sources.items.pathQuery.description,
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
                        label: t.examples.sources.items.array.tab,
                        title: t.examples.sources.items.array.title,
                        description: t.examples.sources.items.array.description,
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                wrapperClassName="w-full"
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
                        label: t.examples.sources.items.fromUrl.tab,
                        title: t.examples.sources.items.fromUrl.title,
                        description: t.examples.sources.items.fromUrl.description,
                        preview: <FromUrlGridPreview />,
                        code: `<Grid
  fromUrl
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                ]}
            />

            <TabbedSection
                title={t.examples.columns.title}
                description={t.examples.columns.description}
                tabs={[
                    {
                        label: t.examples.columns.items.infer.tab,
                        title: t.examples.columns.items.infer.title,
                        description: t.examples.columns.items.infer.description,
                        preview: <MinimalGridPreview />,
                        code: `<Grid
  path="/showcase/grid/users"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                    {
                        label: t.examples.columns.items.explicit.tab,
                        title: t.examples.columns.items.explicit.title,
                        description: t.examples.columns.items.explicit.description,
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={explicitCompactColumns}
                                wrapperClassName="w-full"
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
                        label: t.examples.columns.items.render.tab,
                        title: t.examples.columns.items.render.title,
                        description: t.examples.columns.items.render.description,
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={compactColumns}
                                wrapperClassName="w-full"
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
                title={t.examples.sorting.title}
                description={t.examples.sorting.description}
                tabs={[
                    {
                        label: t.examples.sorting.items.off.tab,
                        title: t.examples.sorting.items.off.title,
                        description: t.examples.sorting.items.off.description,
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={nonSortableCompactColumns}
                                wrapperClassName="w-full"
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
                        label: t.examples.sorting.items.someFields.tab,
                        title: t.examples.sorting.items.someFields.title,
                        description: t.examples.sorting.items.someFields.description,
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={partiallySortableCompactColumns}
                                wrapperClassName="w-full"
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
                        label: t.examples.sorting.items.default.tab,
                        title: t.examples.sorting.items.default.title,
                        description: t.examples.sorting.items.default.description,
                        preview: (
                            <GridArray
                                records={toArrayRecords()}
                                recordId="_key"
                                columns={explicitCompactColumns}
                                wrapperClassName="w-full"
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
                title={t.examples.selection.title}
                description={t.examples.selection.description}
                tabs={[
                    {
                        label: t.examples.selection.items.single.tab,
                        title: t.examples.selection.items.single.title,
                        description: t.examples.selection.items.single.description,
                        preview: <SingleSelectionPreview />,
                        code: `const [clickedKey, setClickedKey] = useState("");

<GridArray
  records={records}
  recordId="_key"
  title="Choose one option"
  selection={{ mode: "single", onChange: (s) => setClickedKey(s.keys[0] || "") }}
/>`,
                    },
                    {
                        label: t.examples.selection.items.multiple.tab,
                        title: t.examples.selection.items.multiple.title,
                        description: t.examples.selection.items.multiple.description,
                        preview: <MultipleSelectionPreview />,
                        code: `const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);

<GridArray
  records={records}
  recordId="_key"
  title="Bulk selection"
  selection={{
    mode: "multiple",
    onChange: (s) => {
      setSelectedKeys(s.keys);
      setSelectedRecords(s.records);
    },
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
                title={t.examples.actions.title}
                description={t.examples.actions.description}
                tabs={[
                    {
                        label: t.examples.actions.items.crudPreset.tab,
                        title: t.examples.actions.items.crudPreset.title,
                        description: t.examples.actions.items.crudPreset.description,
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
                        label: t.examples.actions.items.customKinds.tab,
                        title: t.examples.actions.items.customKinds.title,
                        description: t.examples.actions.items.customKinds.description,
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
                        label: t.examples.actions.items.route.tab,
                        title: t.examples.actions.items.route.title,
                        description: t.examples.actions.items.route.description,
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
                title={t.examples.reorder.title}
                description={t.examples.reorder.description}
                preview={(
                    <GridArray
                        records={arrayRecords}
                        recordId="_key"
                        title={t.examples.reorder.manualOrderingTitle}
                        wrapperClassName="w-full"
                        sortable={false}
                        reorderable
                        onReorder={(records) => setArrayRecords(records)}
                        footer={() => (
                            <div className="text-xs text-muted-foreground">
                                {t.labels.currentOrder}: {arrayRecords.map((record) => record._key).join(', ')}
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
                title={t.examples.layout.title}
                description={t.examples.layout.description}
                tabs={[
                    {
                        label: t.examples.layout.items.table.tab,
                        title: t.examples.layout.items.table.title,
                        description: t.examples.layout.items.table.description,
                        preview: (
                            <GridArray
                                records={layoutRecords}
                                recordId="_key"
                                columns={layoutColumns}
                                wrapperClassName="w-full"
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
                        label: t.examples.layout.items.gallery.tab,
                        title: t.examples.layout.items.gallery.title,
                        description: t.examples.layout.items.gallery.description,
                        preview: (
                            <GridArray
                                records={layoutRecords}
                                recordId="_key"
                                wrapperClassName="w-full"
                                view="gallery"
                                pagination={{ limit: 4, align: 'end', sticky: false }}
                            />
                        ),
                        code: `<GridArray
  records={records}
  recordId="_key"
  view="gallery"
  pagination={{ limit: 4, align: "end", sticky: false }}
/>`,
                    },
                ]}
            />

            <PropDocsTable props={gridPropDocs} />
        </PageLayout>
    );
}


