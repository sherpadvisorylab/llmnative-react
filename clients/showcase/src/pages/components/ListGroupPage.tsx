import React from 'react';
import { Badge, ListGroup } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const ITEMS = ['Backlog', 'In progress', 'Review', 'Done'];

const LIST_GROUP_PROPS: PropDef[] = [
    { name: 'children', type: 'ReactNode[]', required: true, description: 'List item content' },
    { name: 'label', type: 'string', description: 'Optional label above the list', control: 'text' },
    { name: 'onClick', type: '(event, index) => void', description: 'Enables clickable list items' },
    { name: 'draggable', type: 'boolean', default: 'false', description: 'Makes items draggable', control: 'boolean' },
    { name: 'onDrop', type: '(text: string) => string', description: 'Transforms dragged text before it is placed on dataTransfer' },
    { name: 'actives', type: 'number[]', description: 'Indexes rendered as active', control: 'json' },
    { name: 'disables', type: 'number[]', description: 'Indexes rendered as disabled', control: 'json' },
    { name: 'loaders', type: 'number[]', description: 'Indexes rendered as loading', control: 'json' },
    { name: 'pre', type: 'ReactNode', description: 'Content before the list', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the list', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on list-group', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
    { name: 'itemClass', type: 'string', description: 'CSS classes on each item', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: LIST_GROUP_PROPS,
    defaultProps: {
        label: 'Workflow',
        draggable: false,
        actives: [1],
        disables: [3],
        loaders: [],
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
        itemClass: '',
    },
    render: (p) => (
        <ListGroup
            label={p.label || undefined}
            draggable={p.draggable}
            actives={Array.isArray(p.actives) ? p.actives : []}
            disables={Array.isArray(p.disables) ? p.disables : []}
            loaders={Array.isArray(p.loaders) ? p.loaders : []}
            pre={p.pre || undefined}
            post={p.post || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
            itemClass={p.itemClass || undefined}
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
                    <ListGroup label="Workflow" actives={[1]}>
                        {[
                            <span>Backlog <Badge type="secondary">12</Badge></span>,
                            <span>In progress <Badge type="primary">4</Badge></span>,
                            <span>Review <Badge type="warning">2</Badge></span>,
                        ]}
                    </ListGroup>
                }
                code={`import { Badge, ListGroup } from 'react-firestrap';

<ListGroup label="Workflow" actives={[1]}>
    {[
        <span>Backlog <Badge type="secondary">12</Badge></span>,
        <span>In progress <Badge type="primary">4</Badge></span>,
        <span>Review <Badge type="warning">2</Badge></span>,
    ]}
</ListGroup>`}
            />

            <PropDocsTable props={LIST_GROUP_PROPS} />
        </PageLayout>
    );
}
