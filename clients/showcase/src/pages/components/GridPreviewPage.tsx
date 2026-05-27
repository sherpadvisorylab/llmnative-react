import React from 'react';
import { ActionButton, buttonOutlineSecondaryClass } from '@llmnative/react';
import { useLocation } from 'react-router-dom';
import PageLayout from '../../showcase/page';

type PreviewUser = {
    _key: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive' | 'review';
    team: string;
    city: string;
};

const PREVIEW_USERS: PreviewUser[] = [
    { _key: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', team: 'Platform', city: 'Milan' },
    { _key: 'u2', name: 'Mark Williams', email: 'mark@example.com', role: 'editor', status: 'active', team: 'Marketing', city: 'Berlin' },
    { _key: 'u3', name: 'Sara Green', email: 'sara@example.com', role: 'viewer', status: 'inactive', team: 'Support', city: 'Madrid' },
    { _key: 'u4', name: 'Luke Black', email: 'luke@example.com', role: 'editor', status: 'active', team: 'Product', city: 'Remote' },
];

const downloadText = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
};

const toCsv = (records: PreviewUser[]) => {
    const headers = ['_key', 'name', 'email', 'role', 'status', 'team', 'city'];
    const rows = records.map((record) => (
        headers.map((key) => `"${String(record[key as keyof PreviewUser] ?? '').replace(/"/g, '""')}"`).join(',')
    ));
    return [headers.join(','), ...rows].join('\n');
};

export default function GridPreviewPage() {
    const location = useLocation();
    const search = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const view = search.get('view') || 'preview';
    const recordKey = search.get('record') || '';
    const selectedRecord = PREVIEW_USERS.find((record) => record._key === recordKey);
    const exportScope = selectedRecord ? [selectedRecord] : PREVIEW_USERS;
    const [copied, setCopied] = React.useState('');

    const handleCopy = React.useCallback(async (label: string, content: string) => {
        await navigator.clipboard.writeText(content);
        setCopied(label);
        window.setTimeout(() => setCopied(''), 1800);
    }, []);

    return (
        <PageLayout
            title="Grid preview workspace"
            description="A hidden companion page used by Grid custom actions. Today it lets us preview the current record and choose export formats; later we can reuse the same surface for Form preview flows."
        >
            <div className="rounded-lg border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-medium">Current view</div>
                        <div className="text-xs text-muted-foreground">
                            {view === 'export'
                                ? 'Choose an export format for the current record or the full mock dataset.'
                                : 'Inspect the selected record and use this page as a reusable preview surface.'}
                        </div>
                    </div>
                    <div className="rounded-md border px-3 py-1.5 text-xs text-muted-foreground">
                        {selectedRecord ? `Record ${selectedRecord._key}` : 'All records'}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <section className="space-y-4 rounded-lg border bg-card p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {selectedRecord ? selectedRecord.name : 'Dataset preview'}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {selectedRecord
                                ? 'This record arrived through a Grid custom action and can be reused for export or future form preview flows.'
                                : 'No specific record was passed, so the page is showing the dataset-level preview.'}
                        </p>
                    </div>

                    {selectedRecord ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
                                <div className="mt-1 text-sm">{selectedRecord.email}</div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</div>
                                <div className="mt-1 text-sm">{selectedRecord.role}</div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</div>
                                <div className="mt-1 text-sm">{selectedRecord.status}</div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team</div>
                                <div className="mt-1 text-sm">{selectedRecord.team}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                            Open this page from a record-aware Grid action to prefill the preview with a single record. The export tools still work on the full mock dataset.
                        </div>
                    )}

                    <pre className="overflow-auto rounded-md border bg-muted/40 p-4 text-xs leading-relaxed text-foreground">
                        {JSON.stringify(selectedRecord || exportScope, null, 2)}
                    </pre>
                </section>

                <section className="space-y-4 rounded-lg border bg-card p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Export options</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            This is intentionally a small action hub. We can point Grid, Form and other previews here whenever we want users to choose between export formats instead of downloading immediately.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label="Export CSV"
                            onClick={() => downloadText('grid-export.csv', toCsv(exportScope), 'text/csv;charset=utf-8')}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label="Export JSON"
                            onClick={() => downloadText('grid-export.json', JSON.stringify(exportScope, null, 2), 'application/json;charset=utf-8')}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label="Save as PDF"
                            onClick={() => window.print()}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={copied === 'json' ? 'JSON copied' : 'Copy JSON'}
                            onClick={() => handleCopy('json', JSON.stringify(exportScope, null, 2))}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={copied === 'emails' ? 'Emails copied' : 'Copy emails'}
                            onClick={() => handleCopy('emails', exportScope.map((record) => record.email).join(', '))}
                        />
                    </div>

                    <div className="rounded-md border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
                        Tip: for now this page focuses on export and preview. Later we can reuse the same layout for Form preview, print layouts and record-level review flows without changing the Grid action contract again.
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}
