import React from 'react';
import { ActionButton, Badge, Modal, Table, buttonOutlineSecondaryClass, buttonPrimaryClass, useDataProvider } from '@llmnative/react';
import type { RecordProps } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const ROWS = [
    { _key: 'u1', name: 'Alice Johnson', role: 'Admin', status: 'active', team: 'Platform' },
    { _key: 'u2', name: 'Mark Williams', role: 'Editor', status: 'active', team: 'Marketing' },
    { _key: 'u3', name: 'Sara Green', role: 'Viewer', status: 'inactive', team: 'Support' },
    { _key: 'u4', name: 'Luke Black', role: 'Editor', status: 'active', team: 'Product' },
    { _key: 'u5', name: 'Julia Brown', role: 'Admin', status: 'inactive', team: 'Operations' },
    { _key: 'u6', name: 'Noah White', role: 'Viewer', status: 'active', team: 'Support' },
    { _key: 'u7', name: 'Emma Stone', role: 'Editor', status: 'review', team: 'Content' },
    { _key: 'u8', name: 'Chris Miller', role: 'Admin', status: 'active', team: 'Platform' },
];

const header = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'team', label: 'Team', sort: false },
];

const plainBody = ROWS.map((row) => ({ ...row }));

const tableBody = (ROWS.map((row) => ({
    ...row,
    status: (
        <Badge
            className={
                row.status === 'active'
                    ? 'bg-success'
                    : row.status === 'review'
                        ? 'bg-warning'
                        : 'bg-secondary'
            }
        >
            {row.status}
        </Badge>
    ),
}))) as unknown as RecordProps[];

const responsiveHeader = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'team', label: 'Team' },
    { key: 'location', label: 'Location' },
    { key: 'timezone', label: 'Timezone' },
];

const responsiveBody = ROWS.map((row, index) => ({
    ...row,
    location: ['Milan office', 'Berlin hub', 'Remote Europe', 'Madrid office'][index % 4],
    timezone: ['CET', 'UTC', 'GMT+1', 'EST'][index % 4],
}));

const scrollBody = Array.from({ length: 18 }, (_, index) => {
    const row = ROWS[index % ROWS.length];
    return {
        ...row,
        _key: `${row._key}-${index + 1}`,
        team: `${row.team} ${index + 1}`,
    };
});

const TABLE_PLAYGROUND_PATH = '/table-rows';

const TABLE_PLAYGROUND_SEED = {
    [TABLE_PLAYGROUND_PATH]: Object.fromEntries(
        ROWS.map(({ _key, ...record }) => [_key, record])
    ),
};

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

const TABLE_PROPS: PropDef[] = [
    { name: 'columns', type: 'TableHeaderProp[]', description: 'Optional column definitions. Each item describes a table column and can override sorting locally.', shape: `type TableHeaderProp = ${TABLE_HEADER_PROP_TYPE}`, example: `columns={[
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'team', label: 'Team', sort: false },
]}` },
    { name: 'records', type: 'RecordArray', description: 'Array of row records to render.' },
    { name: 'onReorder', type: 'TableReorderHandler', description: 'Called after a drag reorder with the full reordered record set and the moved row metadata. When provided, drag and drop is enabled automatically.', shape: `type TableReorderHandler = (
  reorderedRecords: RecordArray,
  meta: TableReorderMeta
) => void

type TableReorderMeta = ${TABLE_REORDER_META_TYPE}`, example: `onReorder={(reorderedRecords, meta) => {
  setRows(reorderedRecords);
  console.log(meta.fromIndex, meta.toIndex);
}}` },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection state. When you provide it together with onSelectionChange, the table renders multi-select checkboxes.' },
    { name: 'onSelectionChange', type: 'TableSelectionChangeHandler', description: 'Called whenever selected rows change. When provided, the selection checkbox column appears automatically.', shape: `type TableSelectionChangeHandler = (
  selection: TableSelectionState
) => void

type TableSelectionState = ${TABLE_SELECTION_STATE_TYPE}`, example: `onSelectionChange={(selection) => {
  setSelectedKeys(selection.keys);
  setSelectedRecords(selection.records);
}}` },
    { name: 'selection', type: '"single" | "multiple"', default: '"multiple"', description: 'Selection mode. "multiple" renders checkboxes; "single" renders radio buttons. Only visible when onSelectionChange or selectedKeys is provided.', control: 'select', options: ['single', 'multiple'] },
    { name: 'sortable', type: 'boolean | OrderConfig', default: 'false', description: 'Enables header sorting. Pass an OrderConfig object to set the initial client-side sort without a separate order prop.', control: 'json', rows: 4, shortcuts: [
        { label: 'false', value: false, help: 'Disable sorting.' },
        { label: 'name asc', value: { field: 'name', dir: 'asc' }, help: 'Start sorted by name ascending.' },
        { label: 'status desc', value: { field: 'status', dir: 'desc' }, help: 'Start sorted by status descending.' },
    ], typeDetails: `boolean | {
  field: string;
  dir: 'asc' | 'desc';
}`, example: `sortable={{ field: 'name', dir: 'asc' }}` },
    { name: 'onRowClick', type: '(record) => void', description: 'Called with the clicked record.' },
    { name: 'activeKey', type: 'string | null', description: 'Controlled active row key. When provided, the component uses this value instead of its internal click-tracked state to apply selectedClassName to the matching row.' },
    { name: 'pagination', type: PAGINATION_PARAMS_TYPE, description: 'Shared pagination configuration. Default align is "end", so controls are right-aligned unless overridden.', control: 'json', rows: 6, shortcuts: [
        { label: 'default', value: { limit: 4, align: 'end', sticky: false }, help: 'Right-aligned default pagination.' },
        { label: 'compact', value: { limit: 2, align: 'center', sticky: false }, help: 'Smaller pages, centered controls.' },
        { label: 'sticky', value: { limit: 4, align: 'end', sticky: true }, help: 'Sticky footer pagination.' },
    ], typeDetails: PAGINATION_PARAMS_TYPE, example: `pagination={{ limit: 4, align: 'end', sticky: false }}` },
    {
        name: 'groupBy',
        type: 'string | string[]',
        description: 'Group rows by a field name. Inserts a separator header row when the field value changes. Works alongside sorting — rows cluster naturally when sorted by the same field. Pass an array for multi-level grouping.',
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
    { name: 'footer', type: 'ReactNode', description: 'Footer row or content rendered inside tfoot.', control: 'text' },
    { name: 'renderCell', type: '(record: RecordProps, key: string, absoluteIndex: number) => ReactNode', description: 'Custom cell renderer. When provided it replaces the default field-value resolution for every cell. Receives the full record, the column key and the absolute row index across pages.' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered to the left of the table, vertically centered and stretching to the full table height. Use it for contextual actions, toolbars or status panels.' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered to the right of the table, vertically centered and stretching to the full table height.' },
    { name: 'selectedClassName', type: 'string', description: 'Class applied to the active row after click.', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS class applied to the outer responsive wrapper. Use it for width and horizontal overflow behavior.', control: 'text' },
    { name: 'heightClassName', type: 'string', description: 'Tailwind height or max-height class for the inner viewport. When set, the table enables internal vertical scrolling automatically.', control: 'text' },
    { name: 'scrollClassName', type: 'string', description: 'Additional CSS class applied to the inner viewport. Use it as an addon for overflow styling or fine-grained tweaks.', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the table element.', control: 'text' },
    { name: 'headerClassName', type: 'string', description: 'CSS classes applied to thead.', control: 'text' },
    { name: 'bodyClassName', type: 'string', description: 'CSS classes applied to tbody.', control: 'text' },
    { name: 'footerClassName', type: 'string', description: 'CSS classes applied to tfoot.', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'fullscreen',
    layout: 'split',
    mockSeed: TABLE_PLAYGROUND_SEED,
    props: TABLE_PROPS,
    defaultProps: {
        sortable: { field: 'name', dir: 'asc' },
        pagination: { limit: 4, align: 'end', sticky: false },
        groupBy: '',
        footer: '8 team members',
        selectedClassName: '',
        wrapperClassName: '',
        heightClassName: '',
        scrollClassName: '',
        className: '',
        headerClassName: '',
        bodyClassName: '',
        footerClassName: '',
    },
    render: (p) => <TablePlaygroundPreview p={p} />,
};

function TablePlaygroundPreview({ p }: { p: Record<string, any> }) {
    const provider = useDataProvider();
    const [sourceRows, setSourceRows] = React.useState<Array<Record<string, any>>>(ROWS);
    const [playgroundRows, setPlaygroundRows] = React.useState(tableBody);
    const [multiEnabled, setMultiEnabled] = React.useState(false);
    const [dragEnabled, setDragEnabled] = React.useState(false);
    const [playgroundSelectedKeys, setPlaygroundSelectedKeys] = React.useState<string[]>([]);
    const [selectionPayload, setSelectionPayload] = React.useState<{ keys: string[]; records: string[]; hasSelection: boolean } | null>(null);
    const [reorderPayload, setReorderPayload] = React.useState<{ keys: string[]; fromIndex: number | null; toIndex: number | null }>({
        keys: tableBody.map((record) => String(record._key || '')),
        fromIndex: null,
        toIndex: null,
    });

    React.useEffect(() => {
        return provider.subscribe(TABLE_PLAYGROUND_PATH, setSourceRows);
    }, [provider]);

    const mapRows = React.useCallback((rows: Array<Record<string, any>>) => rows.map((row) => ({
        ...row,
        status: (
            <Badge
                className={
                    row.status === 'active'
                        ? 'bg-success'
                        : row.status === 'review'
                            ? 'bg-warning'
                            : 'bg-secondary'
                }
            >
                {row.status}
            </Badge>
        ),
    })), []);

    React.useEffect(() => {
        const mappedRows = mapRows(sourceRows);
        setPlaygroundRows(mappedRows as unknown as RecordProps[]);
        setPlaygroundSelectedKeys([]);
        setSelectionPayload(null);
        setReorderPayload({
            keys: (mappedRows as Array<Record<string, unknown>>).map((record) => String(record._key || '')),
            fromIndex: null,
            toIndex: null,
        });
    }, [mapRows, sourceRows]);

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

    return (
        <div className="min-w-0 space-y-4">
            <div className="grid gap-3 xl:grid-cols-2">
                <div className="rounded-md border bg-muted/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium">Multi checkbox</div>
                            <div className="text-xs text-muted-foreground">Enable controlled multi-selection and inspect the onSelectionChange payload live.</div>
                        </div>
                        <ActionButton
                            className={`${multiEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} btn-sm`}
                            label={multiEnabled ? 'Disable multi checkbox' : 'Enable multi checkbox'}
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
                            <div className="text-sm font-medium">Drag reorder</div>
                            <div className="text-xs text-muted-foreground">Enable row drag and drop, then inspect the reordered record set and movement metadata. While drag is active, sorting is suspended so manual order stays visible.</div>
                        </div>
                        <ActionButton
                            className={`${dragEnabled ? buttonPrimaryClass : buttonOutlineSecondaryClass} btn-sm`}
                            label={dragEnabled ? 'Disable drag' : 'Enable drag'}
                            onClick={() => {
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
            </div>
            <Table
                columns={header}
                records={playgroundRows}
                selectedKeys={multiEnabled ? playgroundSelectedKeys : undefined}
                onSelectionChange={multiEnabled ? ((selection) => {
                    setPlaygroundSelectedKeys(selection.keys);
                    setSelectionPayload({
                        keys: selection.keys,
                        records: selection.records.map((record) => String(record._key || record.name || 'record')),
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
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onSelectionChange payload</div>
                    <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {multiEnabled
                            ? JSON.stringify(selectionPayload ?? {
                                keys: playgroundSelectedKeys,
                                records: [],
                                hasSelection: playgroundSelectedKeys.length > 0,
                            }, null, 2)
                            : 'Enable multi checkbox above, then select rows to see the callback payload here.'}
                    </pre>
                </div>
                <div className="rounded-md border bg-muted/40 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">onReorder payload</div>
                    <pre className="overflow-auto whitespace-pre-wrap break-all text-xs text-foreground">
                        {dragEnabled
                            ? JSON.stringify(reorderPayload, null, 2)
                            : 'Enable drag above, then move rows to inspect the reordered record set and drag metadata.'}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default function TablePage() {
    usePlayground(PLAYGROUND, 'Table');
    const [selected, setSelected] = React.useState<string>('');
    const [reorderedRows, setReorderedRows] = React.useState<RecordProps[]>(plainBody);
    const [bulkKeys, setBulkKeys] = React.useState<string[]>([]);
    const [bulkRecords, setBulkRecords] = React.useState<RecordProps[]>([]);
    const [exportOpen, setExportOpen] = React.useState(false);

    return (
        <PageLayout
            title="Table"
            description="Presentational data table with internal header sorting, optional pagination, drag reorder, bulk selection and stable row selection by record."
        >
            <Section
                title="Basic table"
                description="The default table is plain and predictable: no sorting, no row click behavior and no selected state. It stretches to the available container width."
                preview={
                    <Table
                        columns={header}
                        records={tableBody.slice(0, 4)}
                    />
                }
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
                title="Sortable columns"
                description="Enable sorting once with sortable. Columns inherit that default unless a specific header opts out with sort: false, so the difference is visible without repeating sort: true everywhere."
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
                title="Responsive width"
                description="A solid Tailwind or shadcn pattern is: full-width wrapper with horizontal overflow, then a table that keeps at least its own minimum readable width. This avoids squeezing columns into unusable layouts."
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
                title="Internal scroll"
                description="If you want a fixed-height viewport with vertical scrolling inside the table area, declare a height or max-height class directly. The table enables internal scrolling automatically, and scrollClassName stays available only for extra tweaks."
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
                title="Auto headers"
                description="When you omit header, Table derives columns from the first record. If sortable is true, those generated columns are sortable by default."
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
                title="Record click"
                description="onClick receives the whole record, so selection stays correct even after sorting or pagination. Consumers can use record._key directly."
                preview={
                    <div className="space-y-3">
                        <Table
                            columns={header}
                            records={tableBody}
                            sortable
                            onRowClick={(record) => setSelected(record._key || '')}
                            selectedClassName="table-info"
                            pagination={{ limit: 4, align: 'start', sticky: false }}
                        />
                        <div className="text-xs text-muted-foreground">
                            Selected key: <span className="font-mono">{selected || 'none'}</span>
                        </div>
                    </div>
                }
                code={`const [selected, setSelected] = useState('');

<Table
  columns={header}
  records={body}
  sortable
  onRowClick={(record) => setSelected(record._key || '')}
  selectedClassName="table-info"
  pagination={{ limit: 4, align: 'start', sticky: false }}
/>`}
            />

            <Section
                title="Bulk selection"
                description="onSelectionChange is enough to turn on the checkbox column. Commands stay outside the component: here they live in the table header, and Export opens a modal with the selected records JSON."
                preview={
                    <div className="space-y-3">
                        <Table
                            columns={header}
                            records={tableBody}
                            before={(
                                <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                                    <span className="text-muted-foreground">
                                        {bulkKeys.length ? `${bulkKeys.length} selected` : 'Select rows to enable external bulk commands'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} btn-sm`}
                                            label="Export"
                                            disabled={!bulkKeys.length}
                                            onClick={() => setExportOpen(true)}
                                        />
                                        <ActionButton
                                            className={`${buttonOutlineSecondaryClass} btn-sm`}
                                            label="Clear"
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
                            Selected keys: <span className="font-mono">{bulkKeys.length ? bulkKeys.join(', ') : 'none'}</span>
                        </div>
                        {exportOpen && (
                            <Modal
                                title="Selected records"
                                size="lg"
                                onClose={() => setExportOpen(false)}
                            >
                                <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                                    {JSON.stringify(bulkRecords, null, 2)}
                                </pre>
                            </Modal>
                        )}
                    </div>
                }
                code={`const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
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
        <button disabled={!selectedKeys.length} onClick={() => setExportOpen(true)}>Export</button>
        <button disabled={!selectedKeys.length} onClick={() => {
          setSelectedKeys([]);
          setSelectedRecords([]);
        }}>Clear</button>
      </div>
    </div>
  )}
  pagination={{ limit: 4, align: 'start', sticky: false }}
  selectedKeys={selectedKeys}
  onSelectionChange={(selection) => {
    setSelectedKeys(selection.keys);
    setSelectedRecords(selection.records);
  }}
/>

{exportOpen && (
  <Modal title="Selected records" onClose={() => setExportOpen(false)}>
    <pre>{JSON.stringify(selectedRecords, null, 2)}</pre>
  </Modal>
)}`}
            />

            <Section
                title="Drag reorder"
                description="Provide onReorder to make rows draggable. The callback receives the new ordered records, which is the right place to persist the change."
                preview={
                    <div className="w-full space-y-3">
                        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            <div className="font-medium">Note</div>
                            <div className="mt-1 text-xs leading-relaxed">
                                Manual reorder and sorting should not drive the same table view together.
                                If <code>onReorder</code> is combined with sortable sorting, manual reorder wins, sorting is ignored, and the component logs a warning.
                            </div>
                        </div>
                        <Table
                            columns={header}
                            records={reorderedRows}
                            onReorder={(reorderedRecords) => setReorderedRows(reorderedRecords)}
                            after={
                                <div className="text-xs text-muted-foreground">
                                    Current order: {reorderedRows.map((row) => row._key).join(', ')}
                                </div>
                            }
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
                title="Footer and paging"
                description="Footer content lives in tfoot and pagination stays delegated to the shared Pagination component. Use pagination.align to place controls on the left, center or right."
                preview={
                    <Table
                        columns={header}
                        records={tableBody}
                        sortable={{ field: 'status', dir: 'desc' }}
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                        footer={(
                            <tr>
                                <td colSpan={header.length} className="text-sm text-muted-foreground">
                                    8 team members across 6 teams
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
                title="Grouped rows"
                description="Pass a field name to groupBy to insert a separator header row between groups. Grouping pairs naturally with sorting on the same field — rows cluster automatically. Pass an array for multi-level grouping."
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

            <PropDocsTable props={TABLE_PROPS} />
        </PageLayout>
    );
}
