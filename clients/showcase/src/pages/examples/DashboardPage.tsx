import React from 'react';
import { MockDataProvider, DataProvider, GridDB, Badge, Card } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { Section } from '../../docs-kit/page';
import { useShowcaseDashboardI18n, useShowcaseCommonI18n } from '../../showcase/i18n';

interface Order { id?: string; customer: string; amount: number; status: string; items: number; date: string; }

const ORDERS: Order[] = [
    { id: '1', customer: 'Alice Rossi', amount: 320, status: 'completed', items: 3, date: '2026-07-08' },
    { id: '2', customer: 'Bob Bianchi', amount: 150, status: 'pending', items: 1, date: '2026-07-09' },
    { id: '3', customer: 'Carla Verdi', amount: 890, status: 'completed', items: 5, date: '2026-07-07' },
    { id: '4', customer: 'Davide Neri', amount: 45, status: 'cancelled', items: 2, date: '2026-07-06' },
    { id: '5', customer: 'Elena Gialli', amount: 2100, status: 'completed', items: 7, date: '2026-07-05' },
    { id: '6', customer: 'Francesco Marini', amount: 75, status: 'pending', items: 1, date: '2026-07-09' },
];

const ORDERS_SEED = Object.fromEntries(ORDERS.map((o) => [o.id!, { ...o }]));
const mockProvider = new MockDataProvider({ '/orders': ORDERS_SEED });

function WithMock({ children, provider }: { children: React.ReactNode; provider?: MockDataProvider }) {
    const scoped = React.useMemo(() => provider ?? mockProvider, [provider]);
    return <DataProvider registry={{ default: scoped }} defaultKey="default">{children}</DataProvider>;
}

const GRID_CODE = `<GridDB
  path="/orders"
  columns={[
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', render: ({ value }) => \`€ \${value}\` },
    { key: 'status', label: 'Status', render: ({ value }) => <Badge variant={statusColor(value)}>{value}</Badge> },
    { key: 'date', label: 'Date' },
  ]}
  pagination={{ limit: 5 }}
/>`;

const METRICS_CODE = `<Card>
  <div className="text-2xl font-bold">€3,580</div>
  <div className="text-sm text-muted-foreground">Total revenue</div>
</Card>`;

export default function DashboardPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseDashboardI18n();
    const totalRevenue = ORDERS.reduce((sum, o) => sum + (o.status === 'completed' ? o.amount : 0), 0);
    const pendingOrders = ORDERS.filter((o) => o.status === 'pending').length;
    const totalOrders = ORDERS.length;

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.metricsOverview.title}
                description={t.sections.metricsOverview.description}
                code={METRICS_CODE}
                preview={
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card>
                            <div className="p-4">
                                <div className="text-2xl font-bold">€{totalRevenue}</div>
                                <div className="text-sm text-muted-foreground">Total revenue</div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4">
                                <div className="text-2xl font-bold">{pendingOrders}</div>
                                <div className="text-sm text-muted-foreground">Pending orders</div>
                            </div>
                        </Card>
                        <Card>
                            <div className="p-4">
                                <div className="text-2xl font-bold">{totalOrders}</div>
                                <div className="text-sm text-muted-foreground">Total orders</div>
                            </div>
                        </Card>
                    </div>
                }
            />
            <Section
                title={t.sections.recentOrders.title}
                description={t.sections.recentOrders.description}
                code={GRID_CODE}
                preview={
                    <WithMock>
                        <GridDB
                            path="/orders"
                            columns={[
                                { key: 'customer', label: 'Customer', sortable: true },
                                { key: 'amount', label: 'Amount', render: ({ value }) => `€ ${value}` },
                                { key: 'status', label: 'Status', render: ({ value }) =>
                                    <Badge variant={value === 'completed' ? 'success' : value === 'pending' ? 'warning' : 'danger'}>{value}</Badge> },
                                { key: 'date', label: 'Date' },
                            ]}
                            pagination={{ limit: 5 }}
                        />
                    </WithMock>
                }
            />
        </PageLayout>
    );
}
