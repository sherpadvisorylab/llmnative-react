import React from 'react';
import { MockDataProvider, DataProvider, GridDB, Badge } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { Section } from '../../docs-kit/page';
import { useShowcaseFileManagerI18n, useShowcaseCommonI18n } from '../../showcase/i18n';

interface FileEntry { id?: string; name: string; type: string; size: number; date: string; status: string; }

const FILES: FileEntry[] = [
    { id: '1', name: 'report-q2.pdf', type: 'PDF', size: 245000, date: '2026-07-10', status: 'synced' },
    { id: '2', name: 'logo-hd.png', type: 'Image', size: 1200000, date: '2026-07-09', status: 'synced' },
    { id: '3', name: 'backup-v3.zip', type: 'Archive', size: 8400000, date: '2026-07-08', status: 'uploading' },
    { id: '4', name: 'invoices-2026.csv', type: 'CSV', size: 56000, date: '2026-07-07', status: 'synced' },
    { id: '5', name: 'presentation.pptx', type: 'PPTX', size: 3200000, date: '2026-07-06', status: 'error' },
];

const FILES_SEED = Object.fromEntries(FILES.map((f) => [f.id!, { ...f }]));
const mockProvider = new MockDataProvider({ '/files': FILES_SEED });

function WithMock({ children }: { children: React.ReactNode }) {
    const scoped = React.useMemo(() => mockProvider, []);
    return <DataProvider registry={{ default: scoped }} defaultKey="default">{children}</DataProvider>;
}

function formatSize(bytes: number): string {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
}

const SEED_CODE = `const files = [
  { name: 'report-q2.pdf', type: 'PDF', size: 245000, date: '2026-07-10', status: 'synced' },
  { name: 'logo-hd.png', type: 'Image', size: 1200000, date: '2026-07-09', status: 'synced' },
  // ...
];`;

const PROVIDER_CODE = `const provider = new MockDataProvider({ '/files': FILE_SEED });

<DataProvider registry={{ default: provider }} defaultKey="default">
  <GridDB path="/files" ... />
</DataProvider>`;

const GRID_CODE = `<GridDB
  path="/files"
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'type', label: 'Type' },
    { key: 'size', label: 'Size', render: ({ value }) => formatBytes(value) },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: ({ value }) =>
      <Badge variant={statusColor(value)}>{value}</Badge> },
  ]}
  actions={['add', 'edit', 'delete']}
  pagination={{ limit: 5 }}
/>`;

export default function FileManagerPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseFileManagerI18n();
    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.seedData.title}
                description={t.sections.seedData.description}
                code={SEED_CODE}
            />
            <Section
                title={t.sections.providerSetup.title}
                description={t.sections.providerSetup.description}
                code={PROVIDER_CODE}
            />
            <Section
                title={t.sections.fileGrid.title}
                description={t.sections.fileGrid.description}
                preview={
                    <WithMock>
                        <div className="space-y-4">
                            <GridDB
                                path="/files"
                                columns={[
                                    { key: 'name', label: 'Name', sortable: true },
                                    { key: 'type', label: 'Type' },
                                    { key: 'size', label: 'Size', render: ({ value }) => formatSize(value) },
                                    { key: 'date', label: 'Date' },
                                    { key: 'status', label: 'Status', render: ({ value }) =>
                                        <Badge variant={value === 'synced' ? 'success' : value === 'uploading' ? 'warning' : 'danger'}>{value}</Badge> },
                                ]}
                                actions={['add', 'edit', 'delete']}
                                pagination={{ limit: 5 }}
                            />
                        </div>
                    </WithMock>
                }
                code={GRID_CODE}
            />
        </PageLayout>
    );
}
