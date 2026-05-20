import React from 'react';
import { ActionButton, Badge, Modal, Table, buttonOutlineSecondaryClass, buttonPrimaryClass, useDataProvider } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

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

const tableBody = ROWS.map((row) => ({
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
}));

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
}[]`;

const PAGINATION_PARAMS_TYPE = `{
  page?: number;
  limit?: number;
  navLimit?: number;
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

const TABLE_PROPS: PropDef[] = [
    { name: 'header', type: TABLE_HEADER_PROP_TYPE, description: 'Optional column definitions. Each item describes a table column and can override sorting locally.' },
    { name: 'body', type: 'RecordArray', required: true, description: 'Array of row records to render.' },
    { name: 'onReorder', type: '(reorderedRecords, meta) => void', description: 'Called after a drag reorder with the full reordered record set and the moved row metadata. When provided, drag and drop is enabled automatically.' },
    { name: 'selectedKeys', type: 'string[]', description: 'Controlled selection state. When you provide it together with onSelectionChange, the table renders multi-select checkboxes.' },
    { name: 'onSelectionChange', type: `(selection: ${TABLE_SELECTION_STATE_TYPE}) => void`, description: 'Called whenever selected rows change. When provided, the selection checkbox column appears automatically.' },
    { name: 'sortable', type: 'boolean | OrderConfig', default: 'false', description: 'Enables header sorting. Pass an OrderConfig object to set the initial client-side sort without a separate order prop.', control: 'json' },
    { name: 'onClick', type: '(record) => void', description: 'Called with the clicked record.' },
    { name: 'pagination', type: PAGINATION_PARAMS_TYPE, description: 'Shared pagination configuration. Default align is "end", so controls are right-aligned unless overridden.', control: 'json' },
    { name: 'Footer', type: 'ReactNode', description: 'Footer row or content rendered inside tfoot.', control: 'text' },
    { name: 'selectedClass', type: 'string', description: 'Class applied to the active row after click.', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS class applied to the outer responsive wrapper. Use it for width and horizontal overflow behavior.', control: 'text' },
    { name: 'heightClass', type: 'string', description: 'Tailwind height or max-height class for the inner viewport. When set, the table enables internal vertical scrolling automatically.', control: 'text' },
    { name: 'scrollClass', type: 'string', description: 'Additional CSS class applied to the inner viewport. Use it as an addon for overflow styling or fine-grained tweaks.', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the table element.', control: 'text' },
    { name: 'headerClass', type: 'string', description: 'CSS classes applied to thead.', control: 'text' },
    { name: 'bodyClass', type: 'string', description: 'CSS classes applied to tbody.', control: 'text' },
    { name: 'footerClass', type: 'string', description: 'CSS classes applied to tfoot.', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'fullscreen',
    layout: 'split',
    mockSeed: TABLE_PLAYGROUND_SEED,
    props: TABLE_PROPS,
    defaultProps: {
        sortable: { field: 'name', dir: 'asc' },
        pagination: { limit: 4, align: 'end', sticky: false },
        Footer: '8 team members',
        selectedClass: '',
        wrapClass: '',
        heightClass: '',
        scrollClass: '',
        className: '',
        headerClass: '',
        bodyClass: '',
        footerClass: '',
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
        keys: tableBody.map((record) => record._key || ''),
        fromIndex: null,
        toIndex: null,
    });

    provider.useListener(TABLE_PLAYGROUND_PATH, setSourceRows);

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
        setPlaygroundRows(mappedRows);
        setPlaygroundSelectedKeys([]);
        setSelectionPayload(null);
        setReorderPayload({
            keys: mappedRows.map((record) => record._key || ''),
            fromIndex: null,
            toIndex: null,
        });
    }, [mapRows, sourceRows]);

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
                header={header}
                body={playgroundRows}
                selectedKeys={multiEnabled ? playgroundSelectedKeys : undefined}
                onSelectionChange={multiEnabled ? ((selection) => {
                    setPlaygroundSelectedKeys(selection.keys);
                    setSelectionPayload({
                        keys: selection.keys,
                        records: selection.records.map((record) => record._key || record.name || 'record'),
                        hasSelection: selection.hasSelection,
                    });
                }) : undefined}
                onReorder={dragEnabled ? ((reorderedRecords, meta) => {
                    setPlaygroundRows(reorderedRecords);
                    setReorderPayload({
                        keys: reorderedRecords.map((record) => record._key || ''),
                        fromIndex: meta.fromIndex,
                        toIndex: meta.toIndex,
                    });
                }) : undefined}
                sortable={dragEnabled ? false : p.sortable}
                pagination={p.pagination && typeof p.pagination === 'object' ? p.pagination : undefined}
                Footer={p.Footer ? (
                    <tr>
                        <td colSpan={header.length + (dragEnabled ? 1 : 0) + (multiEnabled ? 1 : 0)} className="text-sm text-muted-foreground">
                            {p.Footer}
                        </td>
                    </tr>
                ) : undefined}
                selectedClass={p.selectedClass || undefined}
                wrapClass={p.wrapClass || undefined}
                heightClass={p.heightClass || undefined}
                scrollClass={p.scrollClass || undefined}
                className={p.className || undefined}
                headerClass={p.headerClass || undefined}
                bodyClass={p.bodyClass || undefined}
                footerClass={p.footerClass || undefined}
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
    const [reorderedRows, setReorderedRows] = React.useState(plainBody);
    const [bulkKeys, setBulkKeys] = React.useState<string[]>([]);
    const [bulkRecords, setBulkRecords] = React.useState(plainBody.slice(0, 0));
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
                        header={header}
                        body={tableBody.slice(0, 4)}
                    />
                }
                code={`<Table
  header={[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'team', label: 'Team', sort: false },
  ]}
  body={rows}
/>`}
            />

            <Section
                title="Sortable columns"
                description="Enable sorting once with sortable. Columns inherit that default unless a specific header opts out with sort: false, so the difference is visible without repeating sort: true everywhere."
                preview={
                    <Table
                        header={header}
                        body={tableBody}
                        sortable={{ field: 'name', dir: 'asc' }}
                        pagination={{ limit: 4, align: 'end', sticky: false }}
                    />
                }
                code={`import { Table, Badge } from 'react-firestrap';

<Table
  header={[
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'team', label: 'Team', sort: false }, // stays static
  ]}
  body={rows.map((row) => ({
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
                            header={responsiveHeader}
                            body={responsiveBody}
                            wrapClass="w-full overflow-x-auto"
                            className="min-w-[48rem]"
                        />
                    </div>
                }
                code={`<div className="w-full max-w-3xl">
  <Table
    header={[
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'team', label: 'Team' },
      { key: 'location', label: 'Location' },
      { key: 'timezone', label: 'Timezone' },
    ]}
    body={records}
    wrapClass="w-full overflow-x-auto"
    className="min-w-[48rem]"
  />
</div>`}
            />

            <Section
                title="Internal scroll"
                description="If you want a fixed-height viewport with vertical scrolling inside the table area, declare a height or max-height class directly. The table enables internal scrolling automatically, and scrollClass stays available only for extra tweaks."
                preview={
                    <Table
                        header={header}
                        body={scrollBody}
                        heightClass="max-h-72"
                        className="min-w-full"
                    />
                }
                code={`<Table
  header={header}
  body={records}
  heightClass="max-h-72"
  className="min-w-full"
/>`}
            />

            <Section
                title="Auto headers"
                description="When you omit header, Table derives columns from the first record. If sortable is true, those generated columns are sortable by default."
                preview={
                    <Table
                        body={plainBody}
                        sortable={{ field: 'role', dir: 'asc' }}
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                    />
                }
                code={`<Table
  body={records}
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
                            header={header}
                            body={tableBody}
                            sortable
                            onClick={(record) => setSelected(record._key || '')}
                            selectedClass="table-info"
                            pagination={{ limit: 4, align: 'start', sticky: false }}
                        />
                        <div className="text-xs text-muted-foreground">
                            Selected key: <span className="font-mono">{selected || 'none'}</span>
                        </div>
                    </div>
                }
                code={`const [selected, setSelected] = useState('');

<Table
  header={header}
  body={body}
  sortable
  onClick={(record) => setSelected(record._key || '')}
  selectedClass="table-info"
  pagination={{ limit: 4, align: 'start', sticky: false }}
/>`}
            />

            <Section
                title="Bulk selection"
                description="onSelectionChange is enough to turn on the checkbox column. Commands stay outside the component: here they live in the table header, and Export opens a modal with the selected records JSON."
                preview={
                    <div className="space-y-3">
                        <Table
                            header={header}
                            body={tableBody}
                            pre={(
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
  header={header}
  body={body}
  pre={(
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
                            header={header}
                            body={reorderedRows}
                            onReorder={(reorderedRecords) => setReorderedRows(reorderedRecords)}
                            post={
                                <div className="text-xs text-muted-foreground">
                                    Current order: {reorderedRows.map((row) => row._key).join(', ')}
                                </div>
                            }
                        />
                    </div>
                }
                code={`const [rows, setRows] = useState(body);

<Table
  header={header}
  body={rows}
  onReorder={(reorderedRecords) => setRows(reorderedRecords)}
/>`}
            />

            <Section
                title="Footer and paging"
                description="Footer content lives in tfoot and pagination stays delegated to the shared Pagination component. Use pagination.align to place controls on the left, center or right."
                preview={
                    <Table
                        header={header}
                        body={tableBody}
                        sortable={{ field: 'status', dir: 'desc' }}
                        pagination={{ limit: 3, align: 'center', sticky: false }}
                        Footer={(
                            <tr>
                                <td colSpan={header.length} className="text-sm text-muted-foreground">
                                    8 team members across 6 teams
                                </td>
                            </tr>
                        )}
                    />
                }
                code={`<Table
  header={header}
  body={body}
  sortable={{ field: 'status', dir: 'desc' }}
  pagination={{ limit: 3, align: 'center', sticky: false }}
  Footer={(
    <tr>
      <td colSpan={4}>8 team members across 6 teams</td>
    </tr>
  )}
/>`}
            />

            <PropsTable props={TABLE_PROPS} />
        </PageLayout>
    );
}
