import React from 'react';
import { ActionButton, Badge, Modal, Table, buttonOutlineSecondaryClass, buttonPrimaryClass, useDataProvider } from '@llmnative/react';
import type { RecordProps } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseTableI18n } from '../../showcase/i18n';

const TABLE_PLAYGROUND_PATH = '/table-rows';

const TABLE_HEADER_PROP_TYPE = `{
  key: string;
  label: string;
  className?: string;
  sort?: boolean;
}`;

const PAGINATION_PARAMS_TYPE = `{
  page?: number;
  limit?: number;
  maxPageButtons?: number;
  scrollToTopOnChange?: boolean;
  scrollBehavior?: ScrollBehavior;
  align?: "start" | "center" | "end";
  sticky?: boolean;
}`;

const TABLE_SELECTION_STATE_TYPE = `{
  keys: string[];
  records: RecordArray;
  clear: () => void;
  hasSelection: boolean;
}`;

const TABLE_REORDER_META_TYPE = `{
  fromIndex: number;
  toIndex: number;
  record: RecordProps;
}`;

const ROW_DEFS = [
    { _key: 'u1', name: 'Alice Johnson', roleKey: 'admin', statusKey: 'active', teamKey: 'platform' },
    { _key: 'u2', name: 'Mark Williams', roleKey: 'editor', statusKey: 'active', teamKey: 'marketing' },
    { _key: 'u3', name: 'Sara Green', roleKey: 'viewer', statusKey: 'inactive', teamKey: 'support' },
    { _key: 'u4', name: 'Luke Black', roleKey: 'editor', statusKey: 'active', teamKey: 'product' },
    { _key: 'u5', name: 'Julia Brown', roleKey: 'admin', statusKey: 'inactive', teamKey: 'operations' },
    { _key: 'u6', name: 'Noah White', roleKey: 'viewer', statusKey: 'active', teamKey: 'support' },
    { _key: 'u7', name: 'Emma Stone', roleKey: 'editor', statusKey: 'review', teamKey: 'content' },
    { _key: 'u8', name: 'Chris Miller', roleKey: 'admin', statusKey: 'active', teamKey: 'platform' },
] as const;

const LOCATION_KEYS = ['milanOffice', 'berlinHub', 'remoteEurope', 'madridOffice'] as const;
const TIMEZONES = ['CET', 'UTC', 'GMT+1', 'EST'] as const;

type TableI18n = ReturnType<typeof useShowcaseTableI18n>;
type TableRoleKey = keyof TableI18n['values']['roles'];
type TableStatusKey = keyof TableI18n['values']['statuses'];
type TableTeamKey = keyof TableI18n['values']['teams'];
type TableLocationKey = keyof TableI18n['values']['locations'];

type TableRow = {
    _key: string;
    name: string;
    role: string;
    status: string;
    team: string;
};

function buildRows(t: TableI18n): TableRow[] {
    return ROW_DEFS.map((row) => ({
        _key: row._key,
        name: row.name,
        role: t.values.roles[row.roleKey as TableRoleKey],
        status: t.values.statuses[row.statusKey as TableStatusKey],
        team: t.values.teams[row.teamKey as TableTeamKey],
    }));
}

function buildHeader(t: TableI18n) {
    return [
        { key: 'name', label: t.labels.name },
        { key: 'role', label: t.labels.role },
        { key: 'status', label: t.labels.status },
        { key: 'team', label: t.labels.team, sort: false },
    ];
}

function buildResponsiveHeader(t: TableI18n) {
    return [
        { key: 'name', label: t.labels.name },
        { key: 'role', label: t.labels.role },
        { key: 'status', label: t.labels.status },
        { key: 'team', label: t.labels.team },
        { key: 'location', label: t.labels.location },
        { key: 'timezone', label: t.labels.timezone },
    ];
}

function toTableBody(rows: TableRow[]) {
    return rows.map((row) => ({
        ...row,
        status: (
            <Badge
                className={
                    row.status === 'active' || row.status === 'attivo' || row.status === 'aktiv'
                        ? 'bg-success'
                        : row.status === 'review' || row.status === 'pruefung'
                            ? 'bg-warning'
                            : 'bg-secondary'
                }
            >
                {row.status}
            </Badge>
        ),
    })) as unknown as RecordProps[];
}

function buildResponsiveBody(rows: TableRow[], t: TableI18n) {
    return rows.map((row, index) => ({
        ...row,
        location: t.values.locations[LOCATION_KEYS[index % LOCATION_KEYS.length] as TableLocationKey],
        timezone: TIMEZONES[index % TIMEZONES.length],
    }));
}

function buildScrollBody(rows: TableRow[]) {
    return Array.from({ length: 18 }, (_, index) => {
        const row = rows[index % rows.length];
        return {
            ...row,
            _key: `${row._key}-${index + 1}`,
            team: `${row.team} ${index + 1}`,
        };
    });
}

function TablePlaygroundPreview({
    p,
    t,
    seedRows,
    header,
}: {
    p: Record<string, any>;
    t: TableI18n;
    seedRows: TableRow[];
    header: Array<{ key: string; label: string; sort?: boolean }>;
}) {
    const provider = useDataProvider();
    const [sourceRows, setSourceRows] = React.useState<Array<Record<string, any>>>(seedRows);
    const [playgroundRows, setPlaygroundRows] = React.useState<RecordProps[]>(toTableBody(seedRows));
    const [multiEnabled, setMultiEnabled] = React.useState(false);
    const [dragEnabled, setDragEnabled] = React.useState(false);
    const [playgroundSelectedKeys, setPlaygroundSelectedKeys] = React.useState<string[]>([]);
    const [selectionPayload, setSelectionPayload] = React.useState<{ keys: string[]; records: string[]; hasSelection: boolean } | null>(null);
    const [reorderPayload, setReorderPayload] = React.useState<{ keys: string[]; fromIndex: number | null; toIndex: number | null }>({
        keys: toTableBody(seedRows).map((record) => String(record._key || '')),
        fromIndex: null,
        toIndex: null,
    });

    React.useEffect(() => provider.subscribe(TABLE_PLAYGROUND_PATH, setSourceRows), [provider]);

    React.useEffect(() => {
        const mappedRows = toTableBody(sourceRows as TableRow[]);
        setPlaygroundRows(mappedRows);
        setPlaygroundSelectedKeys([]);
        setSelectionPayload(null);
        setReorderPayload({
            keys: mappedRows.map((record) => String(record._key || '')),
            fromIndex: null,
            toIndex: null,
        });
    }, [sourceRows]);

    const groupBy: string | string[] | undefined = (() => {
        const value = p.groupBy;
        if (!value) return undefined;
        if (Array.isArray(value)) return value.length > 0 ? value as string[] : undefined;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return undefined;
            if (trimmed.startsWith('[')) {
                try {
                    return JSON.parse(trimmed) as string[];
                } catch {
                    return trimmed;
                }
            }
            return trimmed;
        }
        return undefined;
    })();

    return (
        <div className="min-w-0 space-y-4">
            <div className="grid gap-3 xl:grid-cols-2">
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">{t.labels.multiCheckbox}</div>
                            <div className="text-xs text-muted-foreground">{t.labels.multiCheckboxHelp}</div>
                        </div>
                        <ActionButton
                            className={`${multiEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                            label={multiEnabled ? t.labels.disableMultiCheckbox : t.labels.enableMultiCheckbox}
                            onClick={() => {
                                setMultiEnabled((current) => {
                                    const next = !current;
                                    setPlaygroundSelectedKeys([]);
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
                            <div className="text-sm font-medium">{t.labels.dragReorder}</div>
                            <div className="text-xs text-muted-foreground">{t.labels.dragReorderHelp}</div>
                        </div>
                        <ActionButton
                            className={`${dragEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                            label={dragEnabled ? t.labels.disableDrag : t.labels.enableDrag}
                            onClick={() => {
                                setDragEnabled((current) => {
                                    const next = !current;
                                    setReorderPayload({
                                        keys: playgroundRows.map((record) => String(record._key || '')),
                                        fromIndex: null,
                                        toIndex: null,
                                    });
                                    return next;
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
            <Table
                columns={header}
                records={playgroundRows}
                selectedKeys={multiEnabled ? playgroundSelectedKeys : undefined}
                onSelectionChange={multiEnabled ? ((selection) => {
                    setPlaygroundSelectedKeys(selection.keys);
                    setSelectionPayload({
                        keys: selection.keys,
                        records: selection.records.map((record) => String(record._key || record.name || t.labels.record)),
                        hasSelection: selection.hasSelection,
                    });
                }) : undefined}
                onReorder={dragEnabled ? ((reorderedRecords, meta) => {
                    setPlaygroundRows(reorderedRecords);
                    setReorderPayload({
                        keys: reorderedRecords.map((record) => String(record._key || '')),
                        fromIndex: meta.fromIndex,
                        toIndex: meta.toIndex,
                    });
                }) : undefined}
                sortable={dragEnabled ? false : p.sortable}
                groupBy={groupBy}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                footer={p.footer ? (
                    <tr>
                        <td colSpan={header.length + (dragEnabled ? 1 : 0) + (multiEnabled ? 1 : 0)} className="text-sm text-muted-foreground">
                            {p.footer}
                        </td>
                    </tr>
                ) : undefined}
                selectedClassName={p.selectedClassName || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
                heightClassName={p.heightClassName || undefined}
                scrollClassName={p.scrollClassName || undefined}
                className={p.className || undefined}
                headerClassName={p.headerClassName || undefined}
                bodyClassName={p.bodyClassName || undefined}
                footerClassName={p.footerClassName || undefined}
            />
            <div className="grid gap-3 xl:grid-cols-2">
                <div className="rounded-md border bg-muted/40 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.labels.onSelectionPayload}</div>
                    <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {multiEnabled
                            ? JSON.stringify(selectionPayload ?? {
                                keys: playgroundSelectedKeys,
                                records: [],
                                hasSelection: playgroundSelectedKeys.length > 0,
                            }, null, 2)
                            : t.labels.selectionPayloadHint}
                    </pre>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.labels.onReorderPayload}</div>
                    <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {dragEnabled
                            ? JSON.stringify(reorderPayload, null, 2)
                            : t.labels.reorderPayloadHint}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default function TablePage() {
    const t = useShowcaseTableI18n();

    const rows = React.useMemo(() => buildRows(t), [t]);
    const header = React.useMemo(() => buildHeader(t), [t]);
    const responsiveHeader = React.useMemo(() => buildResponsiveHeader(t), [t]);
    const plainBody = React.useMemo(() => rows.map((row) => ({ ...row })), [rows]);
    const tableBody = React.useMemo(() => toTableBody(rows), [rows]);
    const responsiveBody = React.useMemo(() => buildResponsiveBody(rows, t), [rows, t]);
    const scrollBody = React.useMemo(() => buildScrollBody(rows), [rows]);

    const tableProps = React.useMemo<PropDef[]>(() => [
        {
            name: 'columns',
            type: 'TableHeaderProp[]',
            description: t.propsDocs.items.columns.description,
            shape: `type TableHeaderProp = ${TABLE_HEADER_PROP_TYPE}`,
            example: `columns={[
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'team', label: 'Team', sort: false },
]}`,
        },
        { name: 'records', type: 'RecordArray', description: t.propsDocs.items.records.description },
        {
            name: 'onReorder',
            type: 'TableReorderHandler',
            description: t.propsDocs.items.onReorder.description,
            shape: `type TableReorderHandler = (
  reorderedRecords: RecordArray,
  meta: TableReorderMeta
) => void

type TableReorderMeta = ${TABLE_REORDER_META_TYPE}`,
            example: `onReorder={(reorderedRecords, meta) => {
  setRows(reorderedRecords);
  console.log(meta.fromIndex, meta.toIndex);
}}`,
        },
        { name: 'selectedKeys', type: 'string[]', description: t.propsDocs.items.selectedKeys.description },
        {
            name: 'onSelectionChange',
            type: 'TableSelectionChangeHandler',
            description: t.propsDocs.items.onSelectionChange.description,
            shape: `type TableSelectionChangeHandler = (
  selection: TableSelectionState
) => void

type TableSelectionState = ${TABLE_SELECTION_STATE_TYPE}`,
            example: `onSelectionChange={(selection) => {
  setSelectedKeys(selection.keys);
  setSelectedRecords(selection.records);
}}`,
        },
        {
            name: 'selection',
            type: '"single" | "multiple"',
            default: '"multiple"',
            description: t.propsDocs.items.selection.description,
            control: 'select',
            options: ['single', 'multiple'],
        },
        {
            name: 'sortable',
            type: 'boolean | OrderConfig',
            default: 'false',
            description: t.propsDocs.items.sortable.description,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.propsDocs.items.sortable.shortcuts?.false.label || 'false', value: false, help: t.propsDocs.items.sortable.shortcuts?.false.help },
                { label: t.propsDocs.items.sortable.shortcuts?.nameAsc.label || 'name asc', value: { field: 'name', dir: 'asc' }, help: t.propsDocs.items.sortable.shortcuts?.nameAsc.help },
                { label: t.propsDocs.items.sortable.shortcuts?.statusDesc.label || 'status desc', value: { field: 'status', dir: 'desc' }, help: t.propsDocs.items.sortable.shortcuts?.statusDesc.help },
            ],
            typeDetails: `boolean | {
  field: string;
  dir: 'asc' | 'desc';
}`,
            example: `sortable={{ field: 'name', dir: 'asc' }}`,
        },
        { name: 'onRowClick', type: '(record) => void', description: t.propsDocs.items.onRowClick.description },
        { name: 'activeKey', type: 'string | null', description: t.propsDocs.items.activeKey.description },
        {
            name: 'pagination',
            type: PAGINATION_PARAMS_TYPE,
            description: t.propsDocs.items.pagination.description,
            control: 'json',
            rows: 6,
            shortcuts: [
                { label: t.propsDocs.items.pagination.shortcuts?.default.label || 'default', value: { limit: 4, align: 'end', sticky: false }, help: t.propsDocs.items.pagination.shortcuts?.default.help },
                { label: t.propsDocs.items.pagination.shortcuts?.compact.label || 'compact', value: { limit: 2, align: 'center', sticky: false }, help: t.propsDocs.items.pagination.shortcuts?.compact.help },
                { label: t.propsDocs.items.pagination.shortcuts?.sticky.label || 'sticky', value: { limit: 4, align: 'end', sticky: true }, help: t.propsDocs.items.pagination.shortcuts?.sticky.help },
            ],
            typeDetails: PAGINATION_PARAMS_TYPE,
            example: `pagination={{ limit: 4, align: 'end', sticky: false }}`,
        },
        {
            name: 'groupBy',
            type: 'string | string[]',
            description: t.propsDocs.items.groupBy.description,
            control: 'textarea',
            textareaMode: 'text',
            rows: 1,
            placeholder: t.propsDocs.items.groupBy.placeholder,
            shortcuts: [
                { label: t.propsDocs.items.groupBy.shortcuts?.off.label || 'off', value: '', help: t.propsDocs.items.groupBy.shortcuts?.off.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.role.label || 'role', value: 'role', help: t.propsDocs.items.groupBy.shortcuts?.role.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.status.label || 'status', value: 'status', help: t.propsDocs.items.groupBy.shortcuts?.status.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.team.label || 'team', value: 'team', help: t.propsDocs.items.groupBy.shortcuts?.team.help },
                { label: t.propsDocs.items.groupBy.shortcuts?.roleStatus.label || 'role+status', value: ['role', 'status'], help: t.propsDocs.items.groupBy.shortcuts?.roleStatus.help },
            ],
        },
        { name: 'footer', type: 'ReactNode', description: t.propsDocs.items.footer.description, control: 'text' },
        { name: 'renderCell', type: '(record: RecordProps, key: string, absoluteIndex: number) => ReactNode', description: t.propsDocs.items.renderCell.description },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description },
        { name: 'selectedClassName', type: 'string', description: t.propsDocs.items.selectedClassName.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'heightClassName', type: 'string', description: t.propsDocs.items.heightClassName.description, control: 'text' },
        { name: 'scrollClassName', type: 'string', description: t.propsDocs.items.scrollClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'headerClassName', type: 'string', description: t.propsDocs.items.headerClassName.description, control: 'text' },
        { name: 'bodyClassName', type: 'string', description: t.propsDocs.items.bodyClassName.description, control: 'text' },
        { name: 'footerClassName', type: 'string', description: t.propsDocs.items.footerClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'fullscreen',
        layout: 'split',
        mockSeed: {
            [TABLE_PLAYGROUND_PATH]: Object.fromEntries(rows.map(({ _key, ...record }) => [_key, record])),
        },
        props: tableProps,
        defaultProps: {
            sortable: { field: 'name', dir: 'asc' },
            pagination: { limit: 4, align: 'end', sticky: false },
            groupBy: '',
            footer: t.playground.defaultFooter,
            selectedClassName: '',
            wrapperClassName: '',
            heightClassName: '',
            scrollClassName: '',
            className: '',
            headerClassName: '',
            bodyClassName: '',
            footerClassName: '',
        },
        render: (p) => <TablePlaygroundPreview p={p} t={t} seedRows={rows} header={header} />,
    }), [header, rows, t, tableProps]);

    usePlayground(playground, t.playground.title);

    const [selected, setSelected] = React.useState('');
    const [reorderedRows, setReorderedRows] = React.useState<RecordProps[]>(plainBody);
    const [bulkKeys, setBulkKeys] = React.useState<string[]>([]);
    const [bulkRecords, setBulkRecords] = React.useState<RecordProps[]>([]);
    const [exportOpen, setExportOpen] = React.useState(false);

    React.useEffect(() => {
        setReorderedRows(plainBody);
    }, [plainBody]);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.basicTable.title}
                description={t.sections.basicTable.description}
                preview={<Table columns={header} records={plainBody.slice(0, 4)} />}
                code={`<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'team', label: 'Team', sort: false },
  ]}
  records={rows}
/>`}
            />

            <Section
                title={t.sections.sortableColumns.title}
                description={t.sections.sortableColumns.description}
                preview={
                    <Table
                        columns={header}
                        records={tableBody}
                        sortable={{ field: 'name', dir: 'asc' }}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                }
                code={`import { Table, Badge } from '@llmnative/react';

<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'team', label: 'Team', sort: false }, // stays static
  ]}
  records={rows.map((row) => ({
    ...row,
    status: <Badge>{row.status}</Badge>,
  }))}
  sortable={{ field: 'name', dir: 'asc' }}
  pagination={{ limit: 4, align: 'end', sticky: false }}
/>`}
            />

            <Section
                title={t.sections.responsiveWidth.title}
                description={t.sections.responsiveWidth.description}
                preview={
                    <div className="w-full max-w-3xl">
                        <Table
                            columns={responsiveHeader}
                            records={responsiveBody}
                            wrapperClassName="w-full overflow-x-auto"
                            className="min-w-[48rem]"
                        />
                    </div>
                }
                code={`<div className="w-full max-w-3xl">
  <Table
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'team', label: 'Team' },
      { key: 'location', label: 'Location' },
      { key: 'timezone', label: 'Timezone' },
    ]}
    records={records}
    wrapperClassName="w-full overflow-x-auto"
    className="min-w-[48rem]"
  />
</div>`}
            />

            <Section
                title={t.sections.internalScroll.title}
                description={t.sections.internalScroll.description}
                preview={
                    <Table
                        columns={header}
                        records={scrollBody}
                        heightClassName="max-h-72"
                        className="min-w-full"
                    />
                }
                code={`<Table
  columns={header}
  records={records}
  heightClassName="max-h-72"
  className="min-w-full"
/>`}
            />

            <Section
                title={t.sections.autoHeaders.title}
                description={t.sections.autoHeaders.description}
                preview={
                    <Table
                        records={plainBody}
                        sortable={{ field: 'role', dir: 'asc' }}
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                    />
                }
                code={`<Table
  records={records}
  sortable={{ field: 'role', dir: 'asc' }}
  pagination={{ limit: 3, align: 'center', sticky: false }}
/>`}
            />

            <Section
                title={t.sections.recordClick.title}
                description={t.sections.recordClick.description}
                preview={
                    <div className="space-y-3">
                        <Table
                            columns={header}
                            records={tableBody}
                            sortable
                            onRowClick={(record) => setSelected(record._key || '')}
                            selectedClassName="bg-primary/10"
                            pagination={{ limit: 4, align: 'start', sticky: false }}
                        />
                        <div className="text-xs text-muted-foreground">
                            {t.labels.selectedKey}: <span className="font-mono">{selected || t.labels.none}</span>
                        </div>
                    </div>
                }
                code={`const [selected, setSelected] = useState('');

<Table
  columns={header}
  records={body}
  sortable
  onRowClick={(record) => setSelected(record._key || '')}
  selectedClassName="bg-primary/10"
  pagination={{ limit: 4, align: 'start', sticky: false }}
/>`}
            />

            <Section
                title={t.sections.bulkSelection.title}
                description={t.sections.bulkSelection.description}
                preview={
                    <div className="space-y-3">
                        <Table
                            columns={header}
                            records={tableBody}
                            before={(
                                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                    <span className="text-muted-foreground">
                                        {bulkKeys.length ? `${bulkKeys.length} ${t.labels.selected}` : t.labels.selectRowsToEnableBulk}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                                            label={t.labels.export}
                                            disabled={!bulkKeys.length}
                                            onClick={() => setExportOpen(true)}
                                        />
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} h-8 px-3 text-xs`}
                                            label={t.labels.clear}
                                            disabled={!bulkKeys.length}
                                            onClick={() => {
                                                setBulkKeys([]);
                                                setBulkRecords([]);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            pagination={{ limit: 4, align: 'start', sticky: false }}
                            selectedKeys={bulkKeys}
                            onSelectionChange={(selection) => {
                                setBulkKeys(selection.keys);
                                setBulkRecords(selection.records);
                            }}
                        />
                        <div className="text-xs text-muted-foreground">
                            {t.labels.selectedKeys}: <span className="font-mono">{bulkKeys.length ? bulkKeys.join(', ') : t.labels.none}</span>
                        </div>
                        {exportOpen && (
                            <Modal title={t.labels.selectedRecords} size="lg" onClose={() => setExportOpen(false)}>
                                <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                                    {JSON.stringify(bulkRecords, null, 2)}
                                </pre>
                            </Modal>
                        )}
                    </div>
                }
                code={`import { ActionButton, Modal, Table, buttonOutlineSecondaryClass } from '@llmnative/react';
import { useState } from 'react';

const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
const [selectedRecords, setSelectedRecords] = useState<RecordArray>([]);
const [exportOpen, setExportOpen] = useState(false);

<Table
  columns={header}
  records={body}
  before={(
    <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
      <span>
        {selectedKeys.length ? \`\${selectedKeys.length} selected\` : 'Select rows to enable external bulk commands'}
      </span>
      <div className="flex items-center gap-2">
        <ActionButton
          className={\`\${buttonOutlineSecondaryClass} h-8 px-3 text-xs\`}
          label="Export"
          disabled={!selectedKeys.length}
          onClick={() => setExportOpen(true)}
        />
        <ActionButton
          className={\`\${buttonOutlineSecondaryClass} h-8 px-3 text-xs\`}
          label="Clear"
          disabled={!selectedKeys.length}
          onClick={() => {
            setSelectedKeys([]);
            setSelectedRecords([]);
          }}
        />
      </div>
    </div>
  )}
  pagination={{ limit: 4, align: 'start', sticky: false }}
  selectedKeys={selectedKeys}
  onSelectionChange={(selection) => {
    setSelectedKeys(selection.keys);
    setSelectedRecords(selection.records);
  }}
/>`}
            />

            <Section
                title={t.sections.dragReorder.title}
                description={t.sections.dragReorder.description}
                preview={
                    <div className="w-full space-y-3">
                        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            <div className="font-medium">{t.labels.note}</div>
                            <div className="mt-1 text-xs leading-relaxed">
                                {t.labels.dragSortWarningTitle}{' '}
                                {t.labels.dragSortWarningBody}
                            </div>
                        </div>
                        <Table
                            columns={header}
                            records={reorderedRows}
                            onReorder={(reorderedRecords) => setReorderedRows(reorderedRecords)}
                            after={(
                                <div className="text-xs text-muted-foreground">
                                    {t.labels.currentOrder}: {reorderedRows.map((row) => row._key).join(', ')}
                                </div>
                            )}
                        />
                    </div>
                }
                code={`const [rows, setRows] = useState(body);

<Table
  columns={header}
  records={rows}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>`}
            />

            <Section
                title={t.sections.footerAndPaging.title}
                description={t.sections.footerAndPaging.description}
                preview={
                    <Table
                        columns={header}
                        records={tableBody}
                        sortable={{ field: 'status', dir: 'desc' }}
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                        footer={(
                            <tr>
                                <td colSpan={header.length} className="text-sm text-muted-foreground">
                                    {t.labels.footerSummary}
                                </td>
                            </tr>
                        )}
                    />
                }
                code={`<Table
  columns={header}
  records={body}
  sortable={{ field: 'status', dir: 'desc' }}
  pagination={{ limit: 3, align: 'center', sticky: false }}
  footer={(
    <tr>
      <td colSpan={4}>8 team members across 6 teams</td>
    </tr>
  )}
/>`}
            />

            <Section
                title={t.sections.groupedRows.title}
                description={t.sections.groupedRows.description}
                preview={
                    <Table
                        columns={header}
                        records={tableBody}
                        sortable={{ field: 'role', dir: 'asc' }}
                        groupBy="role"
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                }
                code={`<Table
  columns={header}
  records={rows}
  sortable={{ field: 'role', dir: 'asc' }}
  groupBy="role"
  pagination={{ limit: 4, align: 'end', sticky: false }}
/>

// Multi-level grouping
<Table
  columns={header}
  records={rows}
  sortable={{ field: 'role', dir: 'asc' }}
  groupBy={['role', 'status']}
/>`}
            />

            <PropDocsTable props={tableProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
