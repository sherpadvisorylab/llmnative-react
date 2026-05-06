import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

const ITEMS = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, label: `Record #${i + 1}` }));

function DemoPagination({ perPage }: { perPage: number }) {
    const [page, setPage] = useState(1);
    const total = Math.ceil(ITEMS.length / perPage);
    const slice = ITEMS.slice((page - 1) * perPage, page * perPage);

    const go = (p: number) => { if (p >= 1 && p <= total) setPage(p); };

    // Build a window of up to 5 page numbers centered on the current page
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
                <ul className="pagination justify-content-end">
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

export default function PaginationPage() {
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

            <Section
                title="Props reference"
                preview={
                    <div className="overflow-x-auto w-full">
                        <table className="table text-xs">
                            <thead>
                                <tr>
                                    <th>Prop</th>
                                    <th>Type</th>
                                    <th>Default</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['recordSet', 'T[]', '—', 'Full dataset to paginate'],
                                    ['limit', 'number', 'recordSet.length', 'Items per page'],
                                    ['navLimit', 'number', '5', 'Max visible page buttons'],
                                    ['sticky', 'boolean', 'true', 'Fix nav bar at viewport bottom'],
                                    ['align', '"start"|"center"|"end"', '"end"', 'Horizontal alignment of the nav'],
                                    ['scrollToTopOnChange', 'boolean', 'false', 'Scroll to top on page change'],
                                    ['appendTo', 'HTMLElement|null', 'undefined', 'Portal target for the nav bar'],
                                ].map(([prop, type, def, desc]) => (
                                    <tr key={prop}>
                                        <td><code className="font-mono">{prop}</code></td>
                                        <td className="text-muted-foreground">{type}</td>
                                        <td className="text-muted-foreground">{def}</td>
                                        <td>{desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                code=""
            />
        </PageLayout>
    );
}
