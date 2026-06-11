import React from 'react';
import { Badge, ListGroup } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const ITEMS = ['Backlog', 'In progress', 'Review', 'Done'];

const LIST_GROUP_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactNode[]', required: true, description: 'List item content' },
    { name: 'label', type: 'string', description: 'Optional label above the list', control: 'text' },
    { name: 'onClick', type: '(event, index) => void', description: 'Enables clickable list items' },
    { name: 'draggable', type: 'boolean', default: 'false', description: 'Makes items draggable', control: 'boolean' },
    { name: 'onDrop', type: '(text: string) => string', description: 'Transforms dragged text before it is placed on dataTransfer' },
    { name: 'activeIndices', type: 'number[]', description: 'Indexes rendered as active', control: 'json', rows: 3, shortcuts: [
        { label: 'none', value: [], help: 'No active items.' },
        { label: 'first', value: [0], help: 'First item active.' },
        { label: 'multi', value: [1, 2], help: 'Multiple active items.' },
    ] },
    { name: 'disabledIndices', type: 'number[]', description: 'Indexes rendered as disabled', control: 'json', rows: 3, shortcuts: [
        { label: 'none', value: [], help: 'No disabled items.' },
        { label: 'last', value: [3], help: 'Disable the last item.' },
        { label: 'mixed', value: [0, 3], help: 'Disable first and last items.' },
    ] },
    { name: 'loadingIndices', type: 'number[]', description: 'Indexes rendered as loading', control: 'json', rows: 3, shortcuts: [
        { label: 'none', value: [], help: 'No loading state.' },
        { label: 'single', value: [1], help: 'Second item loading.' },
        { label: 'multi', value: [1, 2], help: 'Multiple loading items.' },
    ] },
    { name: 'before', type: 'ReactNode', description: 'Content before the list', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content after the list', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on list-group', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'itemClassName', type: 'string', description: 'CSS classes on each item', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: LIST_GROUP_PROPS,
    defaultProps: {
        label: 'Workflow',
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
            {ITEMS}
        </ListGroup>
    ),
};

export default function ListGroupPage() {
    usePlayground(PLAYGROUND, 'ListGroup');

    return (
        <PageLayout title="ListGroup" description="Bootstrap-compatible list group with active, disabled, loading, click and drag states.">
            <Section
                title="Status list"
                preview={
                    <ListGroup label="Workflow" activeIndices={[1]}>
                        {[
                            <span>Backlog <Badge variant="secondary">12</Badge></span>,
                            <span>In progress <Badge variant="primary">4</Badge></span>,
                            <span>Review <Badge variant="warning">2</Badge></span>,
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

            <PropDocsTable props={LIST_GROUP_PROPS} />
        </PageLayout>
    );
}
