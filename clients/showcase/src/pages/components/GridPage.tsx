import React from 'react';
import { Grid, Badge, MockDataProvider, DataProviderAdapter } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

// ── Shared mock data ──────────────────────────────────────────────────────────

const USERS_SEED: Record<string, any> = {
    u1: { name: 'Alice Johnson', email: 'alice@example.com',   role: 'admin',  status: 'active'   },
    u2: { name: 'Mark Williams', email: 'mark@example.com',    role: 'editor', status: 'active'   },
    u3: { name: 'Sara Green',    email: 'sara@example.com',    role: 'viewer', status: 'inactive' },
    u4: { name: 'Luke Black',    email: 'luke@example.com',    role: 'editor', status: 'active'   },
    u5: { name: 'Julia Brown',   email: 'julia@example.com',   role: 'admin',  status: 'inactive' },
};

const ORDERS_SEED: Record<string, any> = {
    o1: { customer: 'Alice Johnson', product: 'Pro Plan',     amount: 49.00, status: 'paid',    date: '2025-04-01' },
    o2: { customer: 'Mark Williams', product: 'Starter Plan', amount: 19.00, status: 'paid',    date: '2025-04-03' },
    o3: { customer: 'Sara Green',    product: 'Pro Plan',     amount: 49.00, status: 'pending', date: '2025-04-05' },
    o4: { customer: 'Luke Black',    product: 'Enterprise',   amount: 199.0, status: 'paid',    date: '2025-04-07' },
    o5: { customer: 'Julia Brown',   product: 'Starter Plan', amount: 19.00, status: 'failed',  date: '2025-04-08' },
};

const STATUS_COLOR: Record<string, string> = {
    active: 'bg-success', inactive: 'bg-secondary',
    paid: 'bg-success', pending: 'bg-warning', failed: 'bg-danger',
};

const ROLE_COLOR: Record<string, string> = {
    admin: 'bg-primary', editor: 'bg-info', viewer: 'bg-secondary',
};

function WithMock({ seed, children }: { seed: Record<string, Record<string, any>>; children: React.ReactNode }) {
    const provider = React.useMemo(() => new MockDataProvider(seed), []);
    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

export default function GridPage() {
    return (
        <PageLayout
            title="Grid widget"
            description="Real-time CRUD table and gallery powered by any DataProvider. Sorting, pagination, modal editing and custom column renderers are all built in."
        >
            {/* ── Read-only table ── */}
            <Section
                title="Read-only table"
                description="Minimal config: dataStoragePath + columns. The Grid subscribes to the DataProvider and re-renders on every change."
                preview={
                    <WithMock seed={{ '/users': USERS_SEED }}>
                        <Grid
                            dataStoragePath="/users"
                            columns={[
                                { key: 'name',  label: 'Name',   sort: true },
                                { key: 'email', label: 'Email'  },
                                { key: 'role',  label: 'Role',   onDisplay: ({ value }) =>
                                    <Badge className={ROLE_COLOR[value] ?? 'bg-secondary'}>{value}</Badge> },
                                { key: 'status', label: 'Status', onDisplay: ({ value }) =>
                                    <Badge className={STATUS_COLOR[value] ?? 'bg-secondary'}>{value}</Badge> },
                            ]}
                            type="table"
                        />
                    </WithMock>
                }
                code={`import { Grid, Badge, DataProvider, MockDataProvider } from 'react-firestrap';

const provider = new MockDataProvider({ '/users': USERS_SEED });

<DataProvider registry={{ default: provider }} defaultKey="default">
    <Grid
        dataStoragePath="/users"
        columns={[
            { key: 'name',   label: 'Name',   sort: true },
            { key: 'email',  label: 'Email'  },
            { key: 'role',   label: 'Role',   onDisplay: ({ value }) =>
                <Badge className="bg-primary">{value}</Badge> },
            { key: 'status', label: 'Status', onDisplay: ({ value }) =>
                <Badge className="bg-success">{value}</Badge> },
        ]}
        type="table"
    />
</DataProvider>`}
            />

            {/* ── Full CRUD ── */}
            <Section
                title="Full CRUD with modal form"
                description="Add allowedActions and a modal prop — the Grid auto-generates add/edit/delete controls and opens an inline form modal."
                preview={
                    <WithMock seed={{ '/users': USERS_SEED }}>
                        <Grid
                            dataStoragePath="/users"
                            columns={[
                                { key: 'name',  label: 'Name',   sort: true },
                                { key: 'email', label: 'Email'  },
                                { key: 'role',  label: 'Role',   onDisplay: ({ value }) =>
                                    <Badge className={ROLE_COLOR[value] ?? 'bg-secondary'}>{value}</Badge> },
                                { key: 'status', label: 'Status', onDisplay: ({ value }) =>
                                    <Badge className={STATUS_COLOR[value] ?? 'bg-secondary'}>{value}</Badge> },
                            ]}
                            allowedActions={['add', 'edit', 'delete']}
                            modal={{ mode: 'form', size: 'md' }}
                            type="table"
                        />
                    </WithMock>
                }
                code={`<Grid
    dataStoragePath="/users"
    columns={columns}
    allowedActions={['add', 'edit', 'delete']}
    modal={{ mode: 'form', size: 'md' }}
    type="table"
/>`}
            />

            {/* ── Pagination ── */}
            <Section
                title="Pagination"
                description="Add a pagination prop to split large datasets into pages. perPage controls the page size."
                preview={
                    <WithMock seed={{ '/users': USERS_SEED }}>
                        <Grid
                            dataStoragePath="/users"
                            columns={[
                                { key: 'name',  label: 'Name',   sort: true },
                                { key: 'email', label: 'Email'  },
                                { key: 'role',  label: 'Role'   },
                            ]}
                            pagination={{ limit: 3 }}
                            type="table"
                        />
                    </WithMock>
                }
                code={`<Grid
    dataStoragePath="/users"
    columns={columns}
    pagination={{ limit: 3 }}
    type="table"
/>`}
            />

            {/* ── Column formatters ── */}
            <Section
                title="Column formatters"
                description="onDisplay receives { value, record, key }. Return any React node. Built-in converter strings: 'toDate', 'toCamel', 'toSnake'."
                preview={
                    <WithMock seed={{ '/orders': ORDERS_SEED }}>
                        <Grid
                            dataStoragePath="/orders"
                            columns={[
                                { key: 'customer', label: 'Customer', sort: true },
                                { key: 'product',  label: 'Product'  },
                                { key: 'amount',   label: 'Amount',   onDisplay: ({ value }) =>
                                    <span className="font-mono">€ {Number(value).toFixed(2)}</span> },
                                { key: 'status',   label: 'Status',   onDisplay: ({ value }) =>
                                    <Badge className={STATUS_COLOR[value] ?? 'bg-secondary'}>{value}</Badge> },
                                { key: 'date',     label: 'Date' },
                            ]}
                            type="table"
                        />
                    </WithMock>
                }
                code={`<Grid
    dataStoragePath="/orders"
    columns={[
        { key: 'customer', label: 'Customer', sort: true },
        { key: 'product',  label: 'Product'  },
        { key: 'amount',   label: 'Amount',
          onDisplay: ({ value }) => \`€ \${Number(value).toFixed(2)}\` },
        { key: 'status',   label: 'Status',
          onDisplay: ({ value }) => <Badge>{value}</Badge> },
        { key: 'date',     label: 'Date' },
    ]}
    type="table"
/>`}
            />

            {/* ── In-memory dataArray ── */}
            <Section
                title="In-memory dataArray (no provider needed)"
                description="Pass dataArray instead of dataStoragePath to render static or computed data without any DataProvider."
                preview={
                    <Grid
                        dataArray={Object.entries(USERS_SEED).map(([_key, v]) => ({ _key, ...v }))}
                        columns={[
                            { key: 'name',  label: 'Name'  },
                            { key: 'email', label: 'Email' },
                            { key: 'role',  label: 'Role'  },
                        ]}
                        type="table"
                    />
                }
                code={`// No DataProvider needed — data lives in the component
<Grid
    dataArray={[
        { _key: 'u1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
        { _key: 'u2', name: 'Mark',  email: 'mark@example.com',  role: 'editor' },
    ]}
    columns={[
        { key: 'name',  label: 'Name'  },
        { key: 'email', label: 'Email' },
        { key: 'role',  label: 'Role'  },
    ]}
    type="table"
/>`}
            />
        </PageLayout>
    );
}
