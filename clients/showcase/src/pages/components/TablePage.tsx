import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const ROWS = [
    { id: 1, name: 'Alice Johnson', role: 'Admin', status: 'active' },
    { id: 2, name: 'Mark Williams', role: 'Editor', status: 'active' },
    { id: 3, name: 'Sara Green', role: 'Viewer', status: 'inactive' },
    { id: 4, name: 'Luke Black', role: 'Editor', status: 'active' },
    { id: 5, name: 'Julia Brown', role: 'Admin', status: 'inactive' },
];

const STATUS_BADGE: Record<string, string> = {
    active: 'bg-success',
    inactive: 'bg-secondary',
};

const TABLE_PROPS: PropDef[] = [
    { name: 'rows', type: 'RecordArray', required: true, description: 'Array of row records to render' },
    { name: 'headers', type: 'TableHeaderProp[]', required: true, description: 'Column definitions: key, label, sort, className' },
    { name: 'onSelect', type: '(record) => void', description: 'Callback when a row is clicked' },
    { name: 'selected', type: 'string', description: 'Key of the currently selected row' },
    { name: 'scrollClass', type: 'string', description: 'CSS class for the scroll wrapper (e.g. fixed-table-container)', control: 'text' },
    { name: 'tableClass', type: 'string', description: 'CSS classes on the <table> element', control: 'select', options: ['table', 'table table-striped', 'table table-hover', 'table table-striped table-hover', 'table table-bordered'] },
    { name: 'onSort', type: '(key: string, direction: "asc" | "desc") => void', description: 'Callback when a sortable column header is clicked' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'xl',
    props: TABLE_PROPS,
    defaultProps: { tableClass: 'table table-striped' },
    render: (p) => (
        <div className="bootstrap-table w-full">
            <table className={p.tableClass}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {ROWS.map((row) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.role}</td>
                            <td>
                                <span className={`badge ${STATUS_BADGE[row.status]}`}>
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
};

export default function TablePage() {
    usePlayground(PLAYGROUND, 'Table');
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <PageLayout
            title="Table"
            description="Data table with striping, row selection and custom column renderers. Used internally by the Grid widget."
        >
            <Section
                title="Striped table with row selection"
                description="Click a row to select it. The selected row is highlighted via the table-info class."
                preview={
                    <div className="bootstrap-table w-full">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={`cursor-pointer ${selected === row.id ? 'table-info' : ''}`}
                                        onClick={() => setSelected(row.id === selected ? null : row.id)}
                                    >
                                        <td>{row.name}</td>
                                        <td>{row.role}</td>
                                        <td>
                                            <span className={`badge ${STATUS_BADGE[row.status]}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                code={`{/* In practice you use the Grid widget which handles all of this automatically */}
import { Grid, Badge } from 'react-firestrap';

<Grid
    dataStoragePath="/users"
    columns={[
        { key: 'name',   label: 'Name',   sort: true },
        { key: 'role',   label: 'Role' },
        { key: 'status', label: 'Status',
          onDisplay: ({ value }) => (
              <Badge type={value === 'active' ? 'success' : 'secondary'}>{value}</Badge>
          )
        },
    ]}
    allowedActions={['add', 'edit', 'delete']}
    type="table"
/>`}
            />

            <Section
                title="Fixed-height scrollable table"
                description="Wrap with fixed-table-container to constrain height and enable vertical scrolling."
                preview={
                    <div className="bootstrap-table w-full">
                        <div className="fixed-table-container" style={{ maxHeight: '140px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...ROWS, ...ROWS].map((row, i) => (
                                        <tr key={`${row.id}-${i}`}>
                                            <td>{row.name}</td>
                                            <td>{row.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                code={`{/* Grid applies scrollClass automatically from the theme */}
<Grid
    dataStoragePath="/users"
    columns={columns}
    type="table"
    // theme.Table.scrollClass = "fixed-table-container" by default
/>`}
            />

            <PropsTable props={TABLE_PROPS} />

        </PageLayout>
    );
}
