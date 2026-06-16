import React from 'react';
import { Form, LayoutBuilder, ListGroup } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseLayoutBuilderI18n } from '../../showcase/i18n';

const FIELD_TOKENS = ['{workflow.title}', '{workflow.owner}', '{workflow.status}', '{workflow.dueDate}'];

export default function LayoutBuilderPage() {
    const t = useShowcaseLayoutBuilderI18n();

    const layoutBuilderProps = React.useMemo<PropDef[]>(() => ([
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'defaultSpan', type: 'number', default: t.propsDocs.items.defaultSpan.default, description: t.propsDocs.items.defaultSpan.description, control: 'number', min: 1, max: 12 },
        { name: 'heightPx', type: 'number', default: t.propsDocs.items.heightPx.default, description: t.propsDocs.items.heightPx.description, control: 'number', min: 80, max: 260 },
        { name: 'ref', type: 'LayoutBuilderHandle', description: t.propsDocs.items.ref.description },
    ]), [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: layoutBuilderProps,
        showFormRecord: true,
        size: 'lg',
        defaultProps: {
            name: 'layout',
            defaultSpan: 3,
            heightPx: 140,
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <div className="mb-3">
                    <ListGroup draggable label={t.labels.dragFieldsIntoRow}>
                        {FIELD_TOKENS}
                    </ListGroup>
                </div>
                <LayoutBuilder name={p.name || 'layout'} defaultSpan={p.defaultSpan} heightPx={p.heightPx} />
            </Form>
        ),
    }), [layoutBuilderProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.dragFields.title}
                description={t.sections.dragFields.description}
                preview={(
                    <Form appearance="empty">
                        <div className="mb-3">
                            <ListGroup draggable label={t.labels.fields}>{FIELD_TOKENS}</ListGroup>
                        </div>
                        <LayoutBuilder name="layout" defaultSpan={3} heightPx={140} />
                    </Form>
                )}
                code={`import { Form, LayoutBuilder, ListGroup } from '@llmnative/react';

<Form>
    <ListGroup draggable label="Fields">
        {['{workflow.title}', '{workflow.owner}']}
    </ListGroup>
    <LayoutBuilder name="layout" defaultSpan={3} heightPx={140} />
</Form>`}
            />

            <PropDocsTable props={layoutBuilderProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
