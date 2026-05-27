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
import PageLayout from '../../showcase/page';
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
    layout: unknown;
    sortable: unknown;
    pagination: unknown;
    groupBy: unknown;
    loading: unknown;
    sticky: unknown;
    wrapClass: unknown;
    title: unknown;
    header: unknown;
    footer: unknown;
    form: unknown;
    actions: unknown;
    selection: unknown;
    onClickRow: unknown;
    reorderable: unknown;
    onReorder: unknown;
    editDeepLink: unknown;
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

const playgroundColumnsBase = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true, render: 'email' },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'city', label: 'City', sortable: true },
];

const playgroundColumnsCompact = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true, render: 'email' },
    { key: 'role', label: 'Role', sortable: true, render: 'badge' },
];

const playgroundColumnsAligned = [
    { key: 'name', label: 'Name', sortable: true, className: 'min-w-[15rem]' },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'city', label: 'City', sortable: true, className: 'text-center' },
    { key: 'status', label: 'Status', sortable: true, render: 'badge', className: 'text-right' },
];

const playgroundColumnsBadgeFocus = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: 'badge' },
    { key: 'status', label: 'Status', sortable: true, render: 'badge' },
    { key: 'email', label: 'Contact', sortable: false, render: 'email' },
];

const playgroundColumnsFieldMap = [
    { key: 'fullName', label: 'Full name', sortable: true },
    { key: 'mail', label: 'Email', sortable: true, render: 'email' },
    { key: 'state', label: 'Status', sortable: true, render: 'badge' },
];

const playgroundCrudActions = ['add', 'edit', 'delete'];

const playgroundCustomActions = {
    add: {
        kind: 'modal',
        label: 'Add teammate',
        title: 'Add teammate',
        size: 'lg',
        position: 'center',
    },
    edit: {
        kind: 'modal',
        label: 'Edit',
        title: 'Edit teammate',
        size: 'lg',
        position: 'left',
    },
    delete: {
        kind: 'delete',
        label: 'Delete',
        title: 'Delete teammate?',
        body: 'The selected teammate will be removed from the mock provider.',
        size: 'sm',
        position: 'center',
    },
    preview: {
        kind: 'modal',
        label: 'Preview',
        title: 'Teammate preview',
        body: 'Open a read-only side panel for the selected teammate.',
        size: 'xl',
        position: 'right',
        footer: false,
    },
};

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
        buttonFullscreen?: boolean;
        header?: string;
        body?: string;
        footer?: string | false;
        to?: string;
        href?: string;
    }>;

const playgroundInferColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'city', label: 'City', sortable: true },
];

const mapPlaygroundColumn = (column: Record<string, any>) => {
    if (column.render === 'badge') {
        return {
            ...column,
            render: ({ value, key }: { value: unknown; key: string }) => {
                const text = value == null ? '' : String(value);
                const badgeClass = key === 'status'
                    ? statusClass(text)
                    : key === 'role'
                        ? roleClass(text)
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

const buildPlaygroundActions = (actionsValue: unknown) => {
    if (actionsValue === false || actionsValue == null) return undefined;

    if (typeof actionsValue === 'string') {
        if (actionsValue === 'none') return undefined;
        if (actionsValue === 'crud') return playgroundCrudActions;
        if (actionsValue === 'custom') return playgroundCustomActions;
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
            buttonFullscreen: config.buttonFullscreen,
            header: renderActionTextBlock(config.header, 'header'),
            body: renderActionTextBlock(config.body, 'body'),
            footer: config.footer === false ? false : renderActionTextBlock(config.footer, 'footer'),
        };

        return acc;
    }, {});

    return Object.keys(resolved).length ? resolved : undefined;
};

const hasPlaygroundAction = (actionsValue: unknown, actionKey: string) => {
    if (actionsValue === false || actionsValue == null) return false;
    if (typeof actionsValue === 'string') {
        if (actionsValue === 'none') return false;
        if (actionsValue === 'crud') return playgroundCrudActions.includes(actionKey);
        if (actionsValue === 'custom') return Object.prototype.hasOwnProperty.call(playgroundCustomActions, actionKey);
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
            <Grid fromUrl wrapClass="w-full" pagination={{ limit: 4, align: 'end', sticky: false }} />
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
        <div className="space-y-3">
            <GridArray
                records={toArrayRecords()}
                recordId="_key"
                title="Bulk selection"
                wrapClass="w-full"
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
    { name: 'recordId', type: 'keyof TRecord | ((record) => string)', description: 'Single record identity strategy used for selection, reorder, edit state and create/update storage paths.', category: 'Data' },
    { name: 'path', type: 'string', description: 'Use with GridDB to specify the DataProvider collection path.', category: 'Data' },
    { name: 'fromUrl', type: 'boolean', description: 'Use with GridDB to derive the collection path from the current route pathname. Mutually exclusive with path.', category: 'Data' },
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
        type: '(records: TRecord[]) => TRecord[] | Promise<TRecord[]>',
        shape: `(records: TRecord[]) => TRecord[] | Promise<TRecord[]>`,
        description: 'Normalize or enrich records before display. Runs after the provider converts raw data into the typed record array. Supports async â€” Grid shows a spinner while the Promise resolves. Available on both GridDB and GridArray.',
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
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show a loading spinner on the grid card. Useful while async data is being prepared before passing it to records.', category: 'Display' },
    { name: 'sticky', type: '"top" | "bottom"', description: 'Stick the card to the top or bottom of the scroll container. Applies a CSS sticky class to the card wrapper.', category: 'Display' },
    { name: 'wrapClass', type: 'string', description: 'Extra CSS class forwarded to the outer card wrapper. Use this to set width constraints (e.g. w-full) or margins.', category: 'Display' },
    { name: 'pre', type: 'ReactNode', description: 'Optional content rendered above the table or gallery body, inside the grid card.', category: 'Layout' },
    { name: 'post', type: 'ReactNode', description: 'Optional content rendered below the table or gallery body, inside the grid card.', category: 'Layout' },
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
    {
        name: 'selection',
        type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>',
        shape: `// string shorthand â€” Grid manages state, no callback
"single" | "multiple"

// object form â€” initial keys and/or callback
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
        description: 'Enables row selection. Use the string shorthand when Grid only needs to show selection UI. Add the object form to receive change callbacks via onChange or pre-select rows via defaultKeys. Grid always manages selection state internally.',
        category: 'Behavior',
    },
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
    { name: 'editDeepLink', type: 'boolean', default: 'false', description: 'Sync edit modal to URL hash. Opening a row edit appends #edit/{key} so the modal survives reload and is bookmarkable.', category: 'Behavior' },
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
    const previewLayout = reorderableRequested ? 'table' : p.layout;
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
    const onLoadRecords = previewSourceMode === 'db' && previewLayout === 'gallery'
        ? (records: UserRecord[]) => withGalleryThumbs(records)
        : undefined;
    const loading = p.loading as boolean | undefined;
    const sticky = (p.sticky as string) || undefined;
    const wrapClass = typeof p.wrapClass === 'string' ? p.wrapClass : '';
    const actions = React.useMemo(() => buildPlaygroundActions(p.actions), [p.actions]);
    const hasPreviewAction = React.useMemo(() => hasPlaygroundAction(p.actions, 'preview'), [p.actions]);
    const resolvedHeaderNode = React.useMemo(() => resolvePlaygroundNode<any>(p.header), [p.header]);
    const resolvedFooterNode = React.useMemo(() => resolvePlaygroundNode<any>(p.footer), [p.footer]);
    const resolvedPreNode = typeof p.pre === 'string' && p.pre.trim() && p.pre.trim().toLowerCase() !== 'false'
        ? p.pre.trim()
        : undefined;
    const resolvedPostNode = typeof p.post === 'string' && p.post.trim() && p.post.trim().toLowerCase() !== 'false'
        ? p.post.trim()
        : undefined;

    const [rawArrayRecords, setRawArrayRecords] = React.useState<UserRecord[]>([]);
    React.useEffect(() => {
        if (previewSourceMode !== 'array') return;
        return db.subscribe(GRID_SOURCE_PATH, (recs) => setRawArrayRecords(recs as UserRecord[]));
    }, [db, previewSourceMode]);

    const arrayRecords = React.useMemo(
        () => previewLayout === 'gallery' ? withGalleryThumbs(rawArrayRecords) : rawArrayRecords,
        [previewLayout, rawArrayRecords],
    );

    const [reorderState, setReorderState] = React.useState<UserRecord[] | null>(null);
    React.useEffect(() => {
        setReorderState(null);
        setReorderPayload(null);
    }, [rawArrayRecords]);
    const reorderable = reorderableRequested && previewSourceMode === 'array' && previewLayout === 'table';
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
        if (isColumnsInfer) return playgroundInferColumns;
        if (!Array.isArray(p.columns)) return undefined;
        return p.columns.map((column) => mapPlaygroundColumn(column));
    }, [isColumnsInfer, p.columns]);
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

    const hasOutput = selectionMode !== false || p.onClickRow || reorderable;

    return (
        <div className="space-y-4">
            {reorderable && (
                <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                    Reorder preview attivo: il playground usa automaticamente <code>layout="table"</code>, <code>source="array"</code> e <code>sortable=false</code> per mostrare il drag & drop.
                </div>
            )}
            {previewSourceMode === 'array' ? (
                <GridArray
                    records={effectiveArrayRecords as any}
                    recordId={recordId as any}
                    columns={columns as any}
                    title={p.title ?? 'Team members'}
                    header={resolvedHeaderNode}
                    footer={resolvedFooterNode}
                    layout={previewLayout}
                    loading={loading}
                    sticky={sticky as any}
                    wrapClass={wrapClass}
                    pre={resolvedPreNode}
                    post={resolvedPostNode}
                    form={actions ? <GridUserForm /> : undefined}
                    actions={actions as any}
                    selection={resolvedSelection}
                    onClickRow={p.onClickRow ? (record) => setClickedRecord(record as UserRecord) : undefined}
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
                    title={p.title ?? 'Team members'}
                    header={resolvedHeaderNode}
                    footer={resolvedFooterNode}
                    layout={previewLayout}
                    loading={loading}
                    sticky={sticky as any}
                    wrapClass={wrapClass}
                    pre={resolvedPreNode}
                    post={resolvedPostNode}
                    onLoad={onLoadRecords as any}
                    form={actions ? <GridUserForm /> : undefined}
                    actions={actions as any}
                    selection={resolvedSelection}
                    onClickRow={p.onClickRow ? (record) => setClickedRecord(record as UserRecord) : undefined}
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
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">selection.onChange payload</div>
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
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onClickRow payload</div>
                                <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                                    {JSON.stringify(clickedRecord ?? null, null, 2)}
                                </pre>
                            </div>
                        )}
                        {reorderable && (
                            <div className="rounded-md border bg-muted/40 p-3">
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onReorder payload</div>
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

const PLAYGROUND: PlaygroundConfig = {
    size: 'fullscreen',
    layout: 'split',
    mockSeed: {
        [GRID_SOURCE_PATH]: USERS,
    },
    props: [
        // â”€â”€ Data source â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        { name: 'source', type: '"db" | "array"', default: '"db"', description: 'Switch between GridDB (provider-backed, supports where/order) and GridArray (caller-owned records).', control: 'select', options: ['db', 'array'] },
        { name: 'path', type: 'string', description: 'GridDB: DataProvider collection path (fixed to mock in playground).', readOnly: true, hidden: (props) => props.source === 'array' },
        { name: 'fromUrl', type: 'boolean', default: 'false', description: 'GridDB: derive the path from the current route instead.', control: 'boolean', hidden: (props) => props.source === 'array' },
        { name: 'records', type: 'RecordArray', description: 'GridArray: caller-owned record set. Edit the mock database below to change the data.', readOnly: true, hidden: (props) => props.source !== 'array' },
        {
            name: 'recordId',
            type: 'keyof TRecord | ((record) => string)',
            default: '"_key"',
            description: 'Single record identity strategy used across selection, reorder, edit state and create/update paths. Both _key and id are present in the playground data.',
            help: 'Use a field name like `_key` or `id`, or a one-line arrow function like `record => `${record.team}-${record.id}``. New records are saved using this same resolver, so keep it unique and stable.',
            control: 'textarea',
            textareaMode: 'text',
            rows: 3,
            shortcuts: [
                { label: '_key', value: '_key', help: 'Use the provider/native key field.' },
                { label: 'id', value: 'id', help: 'Use the explicit id field.' },
                { label: 'fn id', value: 'record => record.id', help: 'Arrow function returning the id field.' },
                { label: 'concat', value: 'record => `${record.team}-${record.id}`', help: 'Concatenate two fields into a derived key.' },
            ],
        },
        {
            name: 'where',
            type: 'WhereClause',
            default: '{}',
            description: 'Provider-side filter (GridDB only). e.g. {"status":"active"} or {"role":{"in":["admin","editor"]}}.',
            help: 'Keys and string values must be quoted. Example: {"status":"active"}',
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: 'empty', value: {}, help: 'No provider-side filter.' },
                { label: 'active', value: { status: 'active' }, help: 'Show only active teammates.' },
                { label: 'admins', value: { role: 'admin' }, help: 'Show only admin records.' },
                { label: 'team in', value: { team: { in: ['Platform', 'Operations'] } }, help: 'Example with nested operators.' },
            ],
            hidden: (props) => props.source === 'array',
        },
        {
            name: 'order',
            type: 'OrderClause',
            default: '{}',
            description: 'Provider-side ordering (GridDB only). e.g. {"name":"asc"} or {"email":"desc"}.',
            help: 'Keys and direction values must be quoted. Example: {"name":"asc"}',
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: 'none', value: {}, help: 'Keep provider default order.' },
                { label: 'name asc', value: { name: 'asc' }, help: 'Order by name ascending.' },
                { label: 'email desc', value: { email: 'desc' }, help: 'Order by email descending.' },
            ],
            hidden: (props) => props.source === 'array',
        },
        {
            name: 'fieldMap',
            type: 'Record<string, string>',
            default: '{}',
            description: 'Provider-side field remapping (GridDB only). Maps target field names to source field names in the provider record.',
            help: 'Example: {"fullName":"name"} maps the provider "name" field to "fullName".',
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: 'empty', value: {}, help: 'No field remapping.' },
                { label: 'fullName', value: { fullName: 'name' }, help: 'Map provider name to UI fullName.' },
                { label: 'mail', value: { mail: 'email', state: 'status' }, help: 'Example with multiple remapped keys.' },
            ],
            hidden: (props) => props.source === 'array',
        },
        { name: 'onLoad', type: '(data) => data', description: 'Provider-side normalization hook for GridDB responses before records are built (GridDB only).', readOnly: true, hidden: (props) => props.source === 'array' },
        // â”€â”€ Display â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        {
            name: 'columns',
            type: 'GridColumn<TRecord>[]',
            default: JSON.stringify(playgroundColumnsBase),
            description: 'Column definitions as JSON. In this playground, `{}` means inferred columns using the current record shape.',
            help: 'Available JSON-friendly fields here: key, label, sortable, className, render. Playground shorthands supported for render: "email" and "badge". Set `{}` for inferred columns.',
            control: 'json',
            shortcuts: [
                { label: 'infer', value: {}, help: 'Uses playground auto-detect based on the current record shape.' },
                { label: 'base', value: playgroundColumnsBase, help: 'Neutral full example with standard text columns and email render.' },
                { label: 'compact', value: playgroundColumnsCompact, help: 'Shorter 3-column setup.' },
                { label: 'badge', value: playgroundColumnsBadgeFocus, help: 'Highlights badge and email render modes.' },
                { label: 'fieldMap', value: playgroundColumnsFieldMap, help: 'Works together with the fieldMap example above: fullName -> name, mail -> email, state -> status.' },
                { label: 'align', value: playgroundColumnsAligned, help: 'Shows className and alignment-oriented configuration.' },
            ],
        },
        { name: 'layout', type: '"table" | "gallery"', default: '"table"', description: 'Visual surface used by GridCore.', control: 'select', options: ['table', 'gallery'] },
        {
            name: 'sortable',
            type: 'boolean | OrderConfig',
            default: 'true',
            description: 'Enable client-side sorting or set an initial sort order via OrderConfig.',
            help: 'Use true/false or a JSON object like {"name":"asc"}.',
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: 'true', value: true, help: 'Enable sortable headers.' },
                { label: 'false', value: false, help: 'Disable sorting.' },
                { label: 'name asc', value: { name: 'asc' }, help: 'Start with a name ascending sort.' },
            ],
        },
        {
            name: 'reorderable',
            type: 'boolean',
            default: 'false',
            description: 'Enable row drag reorder. In the playground, turning this on switches the preview to the array/table setup needed for drag & drop and temporarily disables sortable sorting.',
            help: 'Use true to enable drag & drop. While active, the preview uses array mode, forces table layout, and turns sortable off so the row handle behavior is immediately visible. The callback/function part belongs to `onReorder`, not `reorderable`.',
            control: 'textarea',
            textareaMode: 'text',
            rows: 2,
            shortcuts: [
                { label: 'false', value: 'false', help: 'Disable drag & drop.' },
                { label: 'true', value: 'true', help: 'Enable row drag & drop.' },
            ],
        },
        {
            name: 'pagination',
            type: 'PaginationParams',
            default: '{"limit":4,"align":"end"}',
            description: 'Pagination config forwarded to Table or Gallery.',
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: 'default', value: { limit: 4, align: 'end' }, help: 'Default showcase pagination.' },
                { label: 'compact', value: { limit: 2, align: 'center' }, help: 'Smaller page size, centered controls.' },
                { label: 'sticky', value: { limit: 4, align: 'end', sticky: 'bottom' }, help: 'Show sticky bottom pagination.' },
            ],
        },
        {
            name: 'groupBy',
            type: 'string | string[]',
            default: '',
            description: 'Group rows by a field. Works for both table and gallery layouts. Pass a field name or a JSON array for multi-level grouping.',
            control: 'textarea',
            textareaMode: 'text',
            rows: 1,
            placeholder: 'e.g. role or ["role","status"]',
            shortcuts: [
                { label: 'off', value: '', help: 'No grouping.' },
                { label: 'role', value: 'role', help: 'Group by role.' },
                { label: 'status', value: 'status', help: 'Group by status.' },
                { label: 'team', value: 'team', help: 'Group by team.' },
                { label: 'role+status', value: ['role', 'status'], help: 'Multi-level: role then status.' },
            ],
        },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Show a loading spinner on the grid card.', control: 'boolean' },
        { name: 'sticky', type: '"top" | "bottom"', default: '""', description: 'Stick the card at the top or bottom of the scroll container.', control: 'select', options: ['', 'top', 'bottom'] },
        { name: 'wrapClass', type: 'string', default: '""', description: 'Extra CSS class forwarded to the outer card wrapper.', control: 'text' },
        {
            name: 'pre',
            type: 'ReactNode',
            default: '""',
            description: 'Optional content rendered above the table or gallery body.',
            control: 'textarea',
            rows: 2,
        },
        {
            name: 'post',
            type: 'ReactNode',
            default: '""',
            description: 'Optional content rendered below the table or gallery body.',
            control: 'textarea',
            rows: 2,
        },
        // â”€â”€ Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        { name: 'title', type: 'ReactNode', default: '"Team members"', description: 'Card header title.', control: 'text' },
        {
            name: 'header',
            type: 'ReactNode | ((ctx) => ReactNode)',
            default: 'false',
            description: 'Header override. Use plain text or a one-line arrow function that receives the Grid header ctx.',
            help: 'Examples: `Team directory` or `ctx => `${ctx.title} Â· ${ctx.records.length} records``.',
            control: 'textarea',
            textareaMode: 'text',
            rows: 3,
            shortcuts: [
                { label: 'false', value: 'false', help: 'Use the default Grid header.' },
                { label: 'fn', value: 'ctx => `${ctx.title} Â· ${ctx.records.length} records`', help: 'Function example using the header ctx.' },
                { label: 'text', value: 'Team directory', help: 'Static text header example.' },
            ],
        },
        {
            name: 'footer',
            type: 'ReactNode | ((ctx) => ReactNode)',
            default: 'false',
            description: 'Footer override. Use plain text or a one-line arrow function that receives the Grid footer ctx.',
            help: 'Examples: `4 records loaded` or `ctx => `${ctx.selection.keys.length} selected``.',
            control: 'textarea',
            textareaMode: 'text',
            rows: 3,
            shortcuts: [
                { label: 'false', value: 'false', help: 'No custom footer.' },
                { label: 'fn', value: 'ctx => `${ctx.records.length} records loaded`', help: 'Function example using the footer ctx.' },
                { label: 'text', value: '4 records loaded', help: 'Static text footer example.' },
            ],
        },
        // â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        {
            name: 'actions',
            type: '("add" | "edit" | "delete")[] | Record<string, GridAction>',
            default: JSON.stringify(playgroundCustomActions),
            description: 'Action catalog as JSON. Supports CRUD array shorthand and declarative modal, delete, route and external actions.',
            help: 'JSON cannot express functions, so this playground supports the declarative subset: static strings/booleans plus kind, label, icon, size, position, to, href, header, body and footer=false.',
            control: 'json',
            rows: 12,
            shortcuts: [
                { label: 'none', value: {}, help: 'No actions.' },
                { label: 'crud', value: playgroundCrudActions, help: 'Standard add/edit/delete shortcuts.' },
                { label: 'custom', value: playgroundCustomActions, help: 'Custom modal and preview actions.' },
                {
                    label: 'links',
                    value: {
                        docs: { kind: 'route', label: 'Open docs', to: '/docs/grid' },
                        website: { kind: 'external', label: 'Open site', href: 'https://example.com' },
                    },
                    help: 'Route and external action examples.',
                },
            ],
        },
        { name: 'form', type: 'ReactElement | ((ctx) => ReactNode)', description: 'Add/edit form. Grid wraps it in Form automatically for add and edit actions.', readOnly: true },
        // â”€â”€ Behavior â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        {
            name: 'selection',
            type: 'false | "single" | "multiple" | GridSelectionConfig<TRecord>',
            default: false,
            description: 'Selection mode. The playground wires onChange automatically â€” the payload is shown below the grid when active.',
            help: 'Use false to disable, "single"/"multiple" for string shorthand, or an object for defaultKeys. onChange is always wired internally.',
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: 'off', value: false, help: 'No row selection.' },
                { label: 'single', value: 'single', help: 'Single selection, Grid manages state internally.' },
                { label: 'multiple', value: 'multiple', help: 'Multiple selection, Grid manages state internally.' },
                { label: 'defaultKeys', value: { mode: 'single', defaultKeys: ['u1'] }, help: 'Single with u1 pre-selected on mount.' },
                { label: 'multi+keys', value: { mode: 'multiple', defaultKeys: ['u1', 'u5'] }, help: 'Multiple with u1 and u5 pre-selected on mount.' },
            ],
        },
        { name: 'onClickRow', type: '(record) => void', default: 'false', description: 'Called with the full record on row or card click. Enable to see the payload below.', control: 'boolean' },
        { name: 'onReorder', type: 'GridReorderHandler<TRecord>', description: 'Receives the reordered record array and drag metadata. Handled internally by the playground when reorderable is true.', readOnly: true, hidden: (props) => !resolvePlaygroundBoolean(props.reorderable) },
        { name: 'editDeepLink', type: 'boolean', default: 'false', description: 'Sync edit modal to URL hash. Opening a row edit appends #edit/{key} so the modal survives reload and is bookmarkable.', control: 'boolean', hidden: (props) => !hasPlaygroundAction(props.actions, 'edit') || props.layout === 'gallery' || props.source === 'array' },
        // â”€â”€ Data lifecycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        { name: 'onLoad', type: '(records) => records | Promise<records>', description: 'Normalize or enrich records before display. In the playground this automatically adds gallery thumbnails when layout is gallery.', readOnly: true },
        { name: 'onSave', type: 'GridMutationSaveHandler<TRecord>', description: 'Override save target path or implement custom persistence for create/update. Handled automatically by the playground.', readOnly: true },
        { name: 'onDelete', type: 'GridMutationDeleteHandler<TRecord>', description: 'Override delete target path before the provider removes the record. Handled automatically by the playground.', readOnly: true },
        { name: 'onAfterAction', type: 'GridAfterActionHandler<TRecord>', description: 'Post-action hook. Return false to keep the modal open after save/delete.', readOnly: true },
        { name: 'audit', type: 'boolean', default: 'false', description: 'Enables form-level audit logging during modal saves.', control: 'boolean', hidden: (props) => !buildPlaygroundActions(props.actions) },
    ],
    defaultProps: {
        source: 'db',
        recordId: '_key',
        layout: 'table',
        columns: playgroundColumnsBase,
        actions: playgroundCustomActions,
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
                        description: 'Use fromUrl when the current route already matches the provider path you want to read. Grid forwards the pathname as-is, without query string or hash.',
                        preview: <FromUrlGridPreview />,
                        code: `<Grid
  fromUrl
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
  selection={{ mode: "single", onChange: (s) => setClickedKey(s.keys[0] || "") }}
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
