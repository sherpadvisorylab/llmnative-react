import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const ITEMS = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, label: `Record #${i + 1}` }));

function DemoPagination({ perPage }: { perPage: number }) {
    const [page, setPage] = useState(1);
    const total = Math.ceil(ITEMS.length / perPage);
    const slice = ITEMS.slice((page - 1) * perPage, page * perPage);

    const go = (p: number) => { if (p >= 1 && p <= total) setPage(p); };

    const windowSize = Math.min(5, total);
    const start = Math.max(1, Math.min(page - Math.floor(windowSize / 2), total - windowSize + 1));
    const pageNumbers = Array.from({ length: windowSize }, (_, i) => start + i);

    return (
        <div className="w-full space-y-3">
            <div className="grid grid-cols-4 gap-2">
                {slice.map((item) => (
                    <div key={item.id} className="card p-2 text-xs text-center">{item.label}</div>
                ))}
            </div>
            <nav>
                <ul className="pagination justify-end">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => go(1)}>«</button>
                    </li>
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => go(page - 1)}>‹</button>
                    </li>
                    {pageNumbers.map((p) => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => go(p)}>{p}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page === total ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => go(page + 1)}>›</button>
                    </li>
                    <li className={`page-item ${page === total ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => go(total)}>»</button>
                    </li>
                </ul>
            </nav>
            <p className="text-xs text-muted-foreground text-right">
                Page {page} of {total} · {ITEMS.length} total records
            </p>
        </div>
    );
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'recordSet', type: 'T[]', required: true, description: 'Full dataset to paginate' },
    { name: 'children', type: '(records: T[], offset: number) => ReactNode', required: true, description: 'Render function receiving current page records and offset' },
    { name: 'limit', type: 'number', default: 'recordSet.length', description: 'Number of items per page', control: 'number', min: 1, step: 1 },
    { name: 'navLimit', type: 'number', default: '5', description: 'Max number of visible page buttons', control: 'number', min: 3, max: 10 },
    { name: 'sticky', type: 'boolean', default: 'true', description: 'Fix pagination bar at viewport bottom', control: 'boolean' },
    { name: 'align', type: '"start" | "center" | "end"', default: '"end"', description: 'Horizontal alignment of the pagination controls', control: 'select', options: ['start', 'center', 'end'] },
    { name: 'scrollToTopOnChange', type: 'boolean', default: 'false', description: 'Scroll to top of page when page changes', control: 'boolean' },
    { name: 'appendTo', type: 'HTMLElement | null', description: 'Portal target for the pagination bar' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: { limit: 8, navLimit: 5, sticky: false, align: 'end', scrollToTopOnChange: false },
    render: (p) => <DemoPagination perPage={p.limit} />,
};

export default function PaginationPage() {
    usePlayground(PLAYGROUND, 'Pagination');

    return (
        <PageLayout
            title="Pagination"
            description="Page navigation with first/prev/next/last controls and a configurable page window. Used automatically by Grid."
        >
            <Section
                title="Interactive pagination — 50 records, 8 per page"
                description="Click the page controls to navigate through the dataset."
                preview={<DemoPagination perPage={8} />}
                code={`import { Pagination } from 'react-firestrap';

<Pagination recordSet={items} limit={10}>
    {(pageRecords, pageOffset) => (
        <ul>
            {pageRecords.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    )}
</Pagination>`}
            />

            <Section
                title="Sticky pagination bar"
                description="When sticky=true the pagination bar floats at the bottom of the viewport with a blur backdrop. This is the default behaviour in Grid."
                preview={
                    <div className="alert alert-info text-sm">
                        <code className="font-mono">sticky</code> renders the nav bar with{' '}
                        <code className="font-mono">position: fixed; bottom: 0</code> and a{' '}
                        <code className="font-mono">backdrop-filter: blur(10px)</code> so it floats
                        above content without fully obscuring it.
                    </div>
                }
                code={`<Pagination
    recordSet={items}
    limit={20}
    sticky           // fix the nav bar at the bottom of the viewport
    align="end"      // start | center | end
    scrollToTopOnChange
>
    {(pageRecords) => <Table rows={pageRecords} />}
</Pagination>`}
            />

            <PropDocsTable props={PROPS_CONFIG} />

        </PageLayout>
    );
}
