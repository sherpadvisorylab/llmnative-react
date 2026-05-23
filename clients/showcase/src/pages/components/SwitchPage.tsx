import React from 'react';
import { Form, Switch } from '@llmnative/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const SWITCH_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Label next to the switch', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'valueChecked', type: 'string | number', default: '"on"', description: 'Value saved when enabled', control: 'text' },
    { name: 'defaultValue', type: 'string | number', description: 'Initial enabled value', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Content before the switch', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the switch', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on checkbox input', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: SWITCH_PROPS,
    showFormRecord: true,
    defaultProps: {
        name: 'published',
        label: 'Published',
        title: 'Toggle published state',
        required: false,
        valueChecked: 'yes',
        defaultValue: 'yes',
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <Switch {...p} />
        </Form>
    ),
};

export default function SwitchPage() {
    usePlayground(PLAYGROUND, 'Switch');

    return (
        <PageLayout title="Switch" description="Switch-styled checkbox using the same value contract as Checkbox.">
            <Section
                title="Boolean-like toggle"
                preview={
                    <Form aspect="empty" defaultValues={{ published: 'yes' }}>
                        <Switch name="published" label="Published" valueChecked="yes" />
                    </Form>
                }
                code={`import { Form, Switch } from '@llmnative/react';

<Form defaultValues={{ published: 'yes' }}>
    <Switch name="published" label="Published" valueChecked="yes" />
</Form>`}
            />

            <PropDocsTable props={SWITCH_PROPS} />
        </PageLayout>
    );
}
