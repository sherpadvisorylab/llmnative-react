import React from 'react';
import { Pagination } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcasePaginationI18n } from '../../showcase/i18n';

export default function PaginationPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcasePaginationI18n();

    const items = React.useMemo(
        () => Array.from({ length: 50 }, (_, i) => ({ id: i + 1, label: `${t.labels.recordPrefix} #${i + 1}` })),
        [t.labels.recordPrefix],
    );

    const propsConfig = React.useMemo<PropDef[]>(() => [
        { name: 'records', type: 'T[]', required: true, description: t.propsDocs.items.records.description },
        { name: 'children', type: '(records: T[], offset: number) => ReactNode', required: true, description: t.propsDocs.items.children.description },
        { name: 'page', type: 'number', default: '1', description: t.propsDocs.items.page.description },
        { name: 'limit', type: 'number', default: 'records.length', description: t.playground.props.limit.description, control: 'number', min: 1, step: 1 },
        { name: 'maxPageButtons', type: 'number', default: '5', description: t.playground.props.maxPageButtons.description, control: 'number', min: 3, max: 10 },
        { name: 'sticky', type: 'boolean', default: 'true', description: t.playground.props.sticky.description, control: 'boolean' },
        { name: 'align', type: '"start" | "center" | "end"', default: '"end"', description: t.playground.props.align.description, control: 'select', options: ['start', 'center', 'end'] },
        { name: 'scrollToTopOnChange', type: 'boolean', default: 'false', description: t.playground.props.scrollToTopOnChange.description, control: 'boolean' },
        { name: 'scrollBehavior', type: 'ScrollBehavior', description: t.propsDocs.items.scrollBehavior.description, control: 'select', options: ['auto', 'smooth', 'instant'] },
        { name: 'appendTo', type: 'HTMLElement | null', description: t.propsDocs.items.appendTo.description },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        props: propsConfig,
        defaultProps: { limit: 8, maxPageButtons: 5, sticky: false, align: 'end', scrollToTopOnChange: false },
        render: (p) => (
            <Pagination
                records={items}
                limit={p.limit}
                maxPageButtons={p.maxPageButtons}
                sticky={p.sticky}
                align={p.align}
                scrollToTopOnChange={p.scrollToTopOnChange}
            >
                {(pageRecords) => (
                    <div className="mb-2 grid grid-cols-4 gap-2">
                        {(pageRecords as typeof items).map((item) => (
                            <div key={item.id} className="p-2 text-center text-xs rounded-lg border bg-card">{item.label}</div>
                        ))}
                    </div>
                )}
            </Pagination>
        ),
    }), [items, propsConfig]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.interactive.title}
                description={t.sections.interactive.description}
                preview={
                    <Pagination records={items} limit={8} align="end">
                        {(pageRecords) => (
                            <div className="mb-2 grid grid-cols-4 gap-2">
                                {(pageRecords as typeof items).map((item) => (
                                    <div key={item.id} className="p-2 text-center text-xs rounded-lg border bg-card">{item.label}</div>
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
                title={t.sections.sticky.title}
                description={t.sections.sticky.description}
                preview={
                    <div className="alert alert-info text-sm">
                        <code className="font-mono">sticky</code> {t.labels.stickyPreviewLead}{' '}
                        <code className="font-mono">position: fixed; bottom: 0</code>{' '}
                        {t.labels.stickyPreviewMiddle}{' '}
                        <code className="font-mono">backdrop-filter: blur(10px)</code>{' '}
                        {t.labels.stickyPreviewEnd}
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

            <PropDocsTable props={propsConfig} title={common.sections.props} />
        </PageLayout>
    );
}
