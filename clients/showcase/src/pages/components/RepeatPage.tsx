import React from 'react';
import { Form, Input, Repeat } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseRepeatI18n } from '../../showcase/i18n';

export default function RepeatPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseRepeatI18n();

    const repeatProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'children', type: 'ReactNode | (record) => ReactNode', required: true, description: t.propsDocs.items.children.description },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'onAdd', type: '(value: any[]) => void', description: t.propsDocs.items.onAdd.description },
        { name: 'onRemove', type: '(index: number) => void', description: t.propsDocs.items.onRemove.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'layout', type: '"vertical" | "horizontal" | "inline"', default: '"horizontal"', description: t.propsDocs.items.layout.description, control: 'select', options: ['horizontal', 'inline'] },
        { name: 'minItems', type: 'number', description: t.propsDocs.items.minItems.description, control: 'number', min: 0, max: 5 },
        { name: 'maxItems', type: 'number', description: t.propsDocs.items.maxItems.description, control: 'number', min: 1, max: 8 },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'readOnly', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnly.description, control: 'boolean' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: repeatProps,
        showFormRecord: true,
        defaultProps: {
            name: 'items',
            className: '',
            layout: 'horizontal',
            minItems: 1,
            maxItems: 4,
            label: t.labels.items,
            readOnly: false,
        },
        render: (p, onValuesChange) => (
            <Form
                appearance="empty"
                defaultValues={{ [p.name || 'items']: [{ name: t.labels.firstItem }] }}
                onChange={onValuesChange}
            >
                <Repeat
                    name={p.name || 'items'}
                    className={p.className || undefined}
                    layout={p.layout || 'horizontal'}
                    minItems={p.minItems}
                    maxItems={p.maxItems}
                    label={p.label || undefined}
                    readOnly={p.readOnly}
                >
                    <Input name="name" label={t.labels.name} />
                </Repeat>
            </Form>
        ),
    }), [repeatProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.repeatedFields.title}
                description={t.sections.repeatedFields.description}
                preview={
                    <Form appearance="empty" defaultValues={{ items: [{ name: t.labels.design }, { name: t.labels.build }] }}>
                        <Repeat name="items" label={t.labels.tasks} minItems={1} maxItems={5}>
                            <Input name="name" label={t.labels.taskName} />
                        </Repeat>
                    </Form>
                }
                code={`import { Form, Input, Repeat } from '@llmnative/react';

<Form defaultValues={{ items: [{ name: 'Design' }] }}>
    <Repeat name="items" label="Tasks" minItems={1} maxItems={5}>
        <Input name="name" label="Task name" />
    </Repeat>
</Form>`}
            />

            <PropDocsTable props={repeatProps} title={common.sections.props} />
        </PageLayout>
    );
}
