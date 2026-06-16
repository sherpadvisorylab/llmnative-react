import React from 'react';
import { Badge, ListGroup } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseListGroupI18n } from '../../showcase/i18n';

export default function ListGroupPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseListGroupI18n();

    const items = React.useMemo(
        () => [t.labels.backlog, t.labels.inProgress, t.labels.review, t.labels.done],
        [t],
    );

    const listGroupProps = React.useMemo<PropDef[]>(() => [
        { name: 'children', type: 'ReactNode[]', required: true, description: t.propsDocs.items.children.description },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'onClick', type: '(event, index) => void', description: t.propsDocs.items.onClick.description },
        { name: 'draggable', type: 'boolean', default: 'false', description: t.propsDocs.items.draggable.description, control: 'boolean' },
        { name: 'onDrop', type: '(text: string) => string', description: t.propsDocs.items.onDrop.description },
        {
            name: 'activeIndices',
            type: 'number[]',
            description: t.propsDocs.items.activeIndices.description,
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: t.propsDocs.items.activeIndices.shortcuts?.none.label || 'none', value: [], help: t.propsDocs.items.activeIndices.shortcuts?.none.help },
                { label: t.propsDocs.items.activeIndices.shortcuts?.first.label || 'first', value: [0], help: t.propsDocs.items.activeIndices.shortcuts?.first.help },
                { label: t.propsDocs.items.activeIndices.shortcuts?.multi.label || 'multi', value: [1, 2], help: t.propsDocs.items.activeIndices.shortcuts?.multi.help },
            ],
        },
        {
            name: 'disabledIndices',
            type: 'number[]',
            description: t.propsDocs.items.disabledIndices.description,
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: t.propsDocs.items.disabledIndices.shortcuts?.none.label || 'none', value: [], help: t.propsDocs.items.disabledIndices.shortcuts?.none.help },
                { label: t.propsDocs.items.disabledIndices.shortcuts?.last.label || 'last', value: [3], help: t.propsDocs.items.disabledIndices.shortcuts?.last.help },
                { label: t.propsDocs.items.disabledIndices.shortcuts?.mixed.label || 'mixed', value: [0, 3], help: t.propsDocs.items.disabledIndices.shortcuts?.mixed.help },
            ],
        },
        {
            name: 'loadingIndices',
            type: 'number[]',
            description: t.propsDocs.items.loadingIndices.description,
            control: 'json',
            rows: 3,
            shortcuts: [
                { label: t.propsDocs.items.loadingIndices.shortcuts?.none.label || 'none', value: [], help: t.propsDocs.items.loadingIndices.shortcuts?.none.help },
                { label: t.propsDocs.items.loadingIndices.shortcuts?.single.label || 'single', value: [1], help: t.propsDocs.items.loadingIndices.shortcuts?.single.help },
                { label: t.propsDocs.items.loadingIndices.shortcuts?.multi.label || 'multi', value: [1, 2], help: t.propsDocs.items.loadingIndices.shortcuts?.multi.help },
            ],
        },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'itemClassName', type: 'string', description: t.propsDocs.items.itemClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: listGroupProps,
        defaultProps: {
            label: t.labels.workflow,
            draggable: false,
            activeIndices: [1],
            disabledIndices: [3],
            loadingIndices: [],
            before: '',
            after: '',
            className: '',
            wrapperClassName: '',
            itemClassName: '',
        },
        render: (p) => (
            <ListGroup
                label={p.label || undefined}
                draggable={p.draggable}
                activeIndices={Array.isArray(p.activeIndices) ? p.activeIndices : []}
                disabledIndices={Array.isArray(p.disabledIndices) ? p.disabledIndices : []}
                loadingIndices={Array.isArray(p.loadingIndices) ? p.loadingIndices : []}
                before={p.before || undefined}
                after={p.after || undefined}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
                itemClassName={p.itemClassName || undefined}
            >
                {items}
            </ListGroup>
        ),
    }), [items, listGroupProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.statusList.title}
                description={t.sections.statusList.description}
                preview={
                    <ListGroup label={t.labels.workflow} activeIndices={[1]}>
                        {[
                            <span>{t.labels.backlog} <Badge variant="secondary">12</Badge></span>,
                            <span>{t.labels.inProgress} <Badge variant="primary">4</Badge></span>,
                            <span>{t.labels.review} <Badge variant="warning">2</Badge></span>,
                        ]}
                    </ListGroup>
                }
                code={`import { Badge, ListGroup } from '@llmnative/react';

<ListGroup label="Workflow" activeIndices={[1]}>
    {[
        <span>Backlog <Badge variant="secondary">12</Badge></span>,
        <span>In progress <Badge variant="primary">4</Badge></span>,
        <span>Review <Badge variant="warning">2</Badge></span>,
    ]}
</ListGroup>`}
            />

            <PropDocsTable props={listGroupProps} title={common.sections.props} />
        </PageLayout>
    );
}
