import React from 'react';
import { Form, Input, Repeat } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const REPEAT_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Array field name in the Form record', control: 'text' },
    { name: 'children', type: 'ReactNode | (record) => ReactNode', required: true, description: 'Fields cloned for each repeated row' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'onAdd', type: '(value: any[]) => void', description: 'Called after adding an item' },
    { name: 'onRemove', type: '(index: number) => void', description: 'Called after removing an item' },
    { name: 'className', type: 'string', description: 'CSS classes on root wrapper', control: 'text' },
    { name: 'layout', type: '"vertical" | "horizontal" | "inline"', default: '"horizontal"', description: 'Repeat layout variant', control: 'select', options: ['horizontal', 'inline'] },
    { name: 'min', type: 'number', description: 'Minimum number of items', control: 'number', min: 0, max: 5 },
    { name: 'max', type: 'number', description: 'Maximum number of items', control: 'number', min: 1, max: 8 },
    { name: 'label', type: 'string', description: 'Section label with add action', control: 'text' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Hides add/remove actions', control: 'boolean' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: REPEAT_PROPS,
    showFormRecord: true,
    defaultProps: {
        name: 'items',
        className: '',
        layout: 'horizontal',
        min: 1,
        max: 4,
        label: 'Items',
        readOnly: false,
    },
    render: (p, onValuesChange) => (
        <Form
            aspect="empty"
            defaultValues={{ [p.name || 'items']: [{ name: 'First item' }] }}
            onChange={onValuesChange}
        >
            <Repeat
                name={p.name || 'items'}
                className={p.className || undefined}
                layout={p.layout || 'horizontal'}
                min={p.min}
                max={p.max}
                label={p.label || undefined}
                readOnly={p.readOnly}
            >
                <Input name="name" label="Name" />
            </Repeat>
        </Form>
    ),
};

export default function RepeatPage() {
    usePlayground(PLAYGROUND, 'Repeat');

    return (
        <PageLayout title="Repeat" description="Dynamic array field helper for adding and removing repeated form sections.">
            <Section
                title="Repeated fields"
                preview={
                    <Form aspect="empty" defaultValues={{ items: [{ name: 'Design' }, { name: 'Build' }] }}>
                        <Repeat name="items" label="Tasks" min={1} max={5}>
                            <Input name="name" label="Task name" />
                        </Repeat>
                    </Form>
                }
                code={`import { Form, Input, Repeat } from 'react-firestrap';

<Form defaultValues={{ items: [{ name: 'Design' }] }}>
    <Repeat name="items" label="Tasks" min={1} max={5}>
        <Input name="name" label="Task name" />
    </Repeat>
</Form>`}
            />

            <PropsTable props={REPEAT_PROPS} />
        </PageLayout>
    );
}
