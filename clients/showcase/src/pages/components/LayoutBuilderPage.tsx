import React from 'react';
import { Form, LayoutBuilder, ListGroup } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const LAYOUT_BUILDER_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Form field name that stores row layout items', control: 'text' },
    { name: 'defaultSpan', type: 'number', default: '1', description: 'Default column span for dropped fields', control: 'number', min: 1, max: 12 },
    { name: 'heightPx', type: 'number', default: '100', description: 'Builder row height in pixels', control: 'number', min: 80, max: 260 },
    { name: 'ref', type: 'LayoutBuilderHandle', description: 'Imperative API: getValue, setValue, clear' },
];

const FIELD_TOKENS = ['{workflow.title}', '{workflow.owner}', '{workflow.status}', '{workflow.dueDate}'];

const PLAYGROUND: PlaygroundConfig = {
    props: LAYOUT_BUILDER_PROPS,
    showFormRecord: true,
    size: 'lg',
    defaultProps: {
        name: 'layout',
        defaultSpan: 3,
        heightPx: 140,
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <div className="mb-3">
                <ListGroup draggable label="Drag fields into the row">
                    {FIELD_TOKENS}
                </ListGroup>
            </div>
            <LayoutBuilder name={p.name || 'layout'} defaultSpan={p.defaultSpan} heightPx={p.heightPx} />
        </Form>
    ),
};

export default function LayoutBuilderPage() {
    usePlayground(PLAYGROUND, 'LayoutBuilder');

    return (
        <PageLayout title="LayoutBuilder" description="Interactive 12-column row builder for arranging dragged field tokens.">
            <Section
                title="Drag fields into the row"
                preview={
                    <Form aspect="empty">
                        <div className="mb-3">
                            <ListGroup draggable label="Fields">{FIELD_TOKENS}</ListGroup>
                        </div>
                        <LayoutBuilder name="layout" defaultSpan={3} heightPx={140} />
                    </Form>
                }
                code={`import { Form, LayoutBuilder, ListGroup } from 'react-firestrap';

<Form>
    <ListGroup draggable label="Fields">
        {['{workflow.title}', '{workflow.owner}']}
    </ListGroup>
    <LayoutBuilder name="layout" defaultSpan={3} heightPx={140} />
</Form>`}
            />

            <PropsTable props={LAYOUT_BUILDER_PROPS} />
        </PageLayout>
    );
}
