import React from 'react';
import { Form, Input, TabDynamic } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const TAB_DYNAMIC_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Array field name in the Form record', control: 'text' },
    { name: 'children', type: 'ReactNode | (record) => ReactNode', required: true, description: 'Fields rendered inside the active tab' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'onAdd', type: '(value: any[]) => void', description: 'Called after adding a tab' },
    { name: 'onRemove', type: '(index: number) => void', description: 'Called after removing a tab' },
    { name: 'label', type: 'string', default: '"Tab"', description: 'Tab label prefix or converter template', control: 'text' },
    { name: 'min', type: 'number', default: '1', description: 'Minimum number of tabs', control: 'number', min: 0, max: 5 },
    { name: 'max', type: 'number', description: 'Maximum number of tabs', control: 'number', min: 1, max: 8 },
    { name: 'activeIndex', type: 'number', default: '0', description: 'Initial active tab', control: 'number', min: 0, max: 4 },
    { name: 'title', type: 'string', description: 'Heading above the tabs', control: 'text' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Hides add/remove actions', control: 'boolean' },
    { name: 'tabPosition', type: 'TabPosition', default: '"default"', description: 'Tab layout position', control: 'select', options: ['default', 'top', 'bottom', 'left', 'right'] },
];

const PLAYGROUND: PlaygroundConfig = {
    props: TAB_DYNAMIC_PROPS,
    showFormRecord: true,
    defaultProps: {
        name: 'sections',
        label: 'Section',
        min: 1,
        max: 4,
        activeIndex: 0,
        title: 'Dynamic sections',
        readOnly: false,
        tabPosition: 'default',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" defaultValues={{ [p.name || 'sections']: [{ title: 'Intro' }] }} onChange={onValuesChange}>
            <TabDynamic
                name={p.name || 'sections'}
                label={p.label || 'Section'}
                min={p.min}
                max={p.max}
                activeIndex={p.activeIndex}
                title={p.title || undefined}
                readOnly={p.readOnly}
                tabPosition={p.tabPosition || 'default'}
            >
                <Input name="title" label="Title" />
            </TabDynamic>
        </Form>
    ),
};

export default function TabDynamicPage() {
    usePlayground(PLAYGROUND, 'TabDynamic');

    return (
        <PageLayout title="TabDynamic" description="Dynamic tabbed array editor for repeated form sections.">
            <Section
                title="Editable tabs"
                preview={
                    <Form aspect="empty" defaultValues={{ sections: [{ title: 'Intro' }] }}>
                        <TabDynamic name="sections" label="Section" title="Dynamic sections">
                            <Input name="title" label="Title" />
                        </TabDynamic>
                    </Form>
                }
                code={`import { Form, Input, TabDynamic } from 'react-firestrap';

<Form defaultValues={{ sections: [{ title: 'Intro' }] }}>
    <TabDynamic name="sections" label="Section">
        <Input name="title" label="Title" />
    </TabDynamic>
</Form>`}
            />

            <PropsTable props={TAB_DYNAMIC_PROPS} />
        </PageLayout>
    );
}
