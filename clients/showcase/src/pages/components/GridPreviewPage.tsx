import React from 'react';
import { ActionButton, buttonOutlineSecondaryClass } from '@llmnative/react';
import { useLocation } from 'react-router-dom';
import PageLayout from '../../showcase/page';
import { useShowcaseGridI18n, useShowcaseGridPreviewI18n } from '../../showcase/i18n';

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

const getRoleLabel = (grid: ReturnType<typeof useShowcaseGridI18n>, role: PreviewUser['role']) => {
    switch (role) {
        case 'admin':
            return grid.values.roles.admin;
        case 'editor':
            return grid.values.roles.editor;
        case 'viewer':
            return grid.values.roles.viewer;
    }
};

const getStatusLabel = (grid: ReturnType<typeof useShowcaseGridI18n>, status: PreviewUser['status']) => {
    switch (status) {
        case 'active':
            return grid.values.statuses.active;
        case 'inactive':
            return grid.values.statuses.inactive;
        case 'review':
            return grid.values.statuses.review;
    }
};

export default function GridPreviewPage() {
    const preview = useShowcaseGridPreviewI18n();
    const grid = useShowcaseGridI18n();
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
            title={preview.page.title}
            description={preview.page.description}
        >
            <div className="rounded-lg border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-medium">{preview.banner.currentView}</div>
                        <div className="text-xs text-muted-foreground">
                            {view === 'export'
                                ? preview.banner.exportDescription
                                : preview.banner.previewDescription}
                        </div>
                    </div>
                    <div className="rounded-md border px-3 py-1.5 text-xs text-muted-foreground">
                        {selectedRecord ? `${preview.banner.recordPrefix} ${selectedRecord._key}` : preview.banner.allRecords}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <section className="space-y-4 rounded-lg border bg-card p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {selectedRecord ? selectedRecord.name : preview.sections.datasetPreview.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {selectedRecord
                                ? preview.sections.datasetPreview.selectedRecordDescription
                                : preview.sections.datasetPreview.emptyDescription}
                        </p>
                    </div>

                    {selectedRecord ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{grid.labels.email}</div>
                                <div className="mt-1 text-sm">{selectedRecord.email}</div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{grid.labels.role}</div>
                                <div className="mt-1 text-sm">{getRoleLabel(grid, selectedRecord.role)}</div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{grid.labels.status}</div>
                                <div className="mt-1 text-sm">{getStatusLabel(grid, selectedRecord.status)}</div>
                            </div>
                            <div className="rounded-md border bg-muted/20 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{grid.labels.team}</div>
                                <div className="mt-1 text-sm">{selectedRecord.team}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                            {preview.emptyState.singleRecordHint}
                        </div>
                    )}

                    <pre className="overflow-auto rounded-md border bg-muted/40 p-4 text-xs leading-relaxed text-foreground">
                        {JSON.stringify(selectedRecord || exportScope, null, 2)}
                    </pre>
                </section>

                <section className="space-y-4 rounded-lg border bg-card p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">{preview.sections.exportOptions.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {preview.sections.exportOptions.description}
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={preview.actions.exportCsv}
                            onClick={() => downloadText('grid-export.csv', toCsv(exportScope), 'text/csv;charset=utf-8')}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={preview.actions.exportJson}
                            onClick={() => downloadText('grid-export.json', JSON.stringify(exportScope, null, 2), 'application/json;charset=utf-8')}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={preview.actions.saveAsPdf}
                            onClick={() => window.print()}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={copied === 'json' ? preview.actions.jsonCopied : preview.actions.copyJson}
                            onClick={() => handleCopy('json', JSON.stringify(exportScope, null, 2))}
                        />
                        <ActionButton
                            className={buttonOutlineSecondaryClass}
                            label={copied === 'emails' ? preview.actions.emailsCopied : preview.actions.copyEmails}
                            onClick={() => handleCopy('emails', exportScope.map((record) => record.email).join(', '))}
                        />
                    </div>

                    <div className="rounded-md border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
                        {preview.hints.futureReuse}
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}
