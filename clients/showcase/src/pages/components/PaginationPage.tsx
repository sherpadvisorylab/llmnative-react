import React from 'react';
import { Pagination } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const ITEMS = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, label: `Record #${i + 1}` }));

const PROPS_CONFIG: PropDef[] = [
    { name: 'records', type: 'T[]', required: true, description: 'Full dataset to paginate' },
    { name: 'children', type: '(records: T[], offset: number) => ReactNode', required: true, description: 'Render function receiving current page records and offset' },
    { name: 'limit', type: 'number', default: 'records.length', description: 'Number of items per page', control: 'number', min: 1, step: 1 },
    { name: 'maxPageButtons', type: 'number', default: '5', description: 'Max number of visible page buttons', control: 'number', min: 3, max: 10 },
    { name: 'sticky', type: 'boolean', default: 'true', description: 'Fix pagination bar at viewport bottom', control: 'boolean' },
    { name: 'align', type: '"start" | "center" | "end"', default: '"end"', description: 'Horizontal alignment of the pagination controls', control: 'select', options: ['start', 'center', 'end'] },
    { name: 'scrollToTopOnChange', type: 'boolean', default: 'false', description: 'Scroll to top of page when page changes', control: 'boolean' },
    { name: 'appendTo', type: 'HTMLElement | null', description: 'Portal target for the pagination bar' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    props: PROPS_CONFIG,
    defaultProps: { limit: 8, maxPageButtons: 5, sticky: false, align: 'end', scrollToTopOnChange: false },
    render: (p) => (
        <Pagination
            records={ITEMS}
            limit={p.limit}
            maxPageButtons={p.maxPageButtons}
            sticky={p.sticky}
            align={p.align}
            scrollToTopOnChange={p.scrollToTopOnChange}
        >
            {(pageRecords) => (
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {(pageRecords as typeof ITEMS).map((item) => (
                        <div key={item.id} className="card p-2 text-xs text-center">{item.label}</div>
                    ))}
                </div>
            )}
        </Pagination>
    ),
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
                preview={
                    <Pagination records={ITEMS} limit={8} align="end">
                        {(pageRecords) => (
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                {(pageRecords as typeof ITEMS).map((item) => (
                                    <div key={item.id} className="card p-2 text-xs text-center">{item.label}</div>
                                ))}
                            </div>
                        )}
                    </Pagination>
                }
                code={`import { Pagination } from '@llmnative/react';

<Pagination records={items} limit={10}>
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
    records={items}
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
