import React from 'react';
import { Checkbox, Form } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const CHECKBOX_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Label next to the checkbox', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'valueChecked', type: 'string | number', default: '"on"', description: 'Value saved when checked', control: 'text' },
    { name: 'defaultValue', type: 'string | number', description: 'Initial checked value', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Content before the checkbox', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the checkbox', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on checkbox input', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: CHECKBOX_PROPS,
    showFormRecord: true,
    defaultProps: {
        name: 'accepted',
        label: 'Accepted',
        title: 'Accept terms',
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
            <Checkbox {...p} />
        </Form>
    ),
};

export default function CheckboxPage() {
    usePlayground(PLAYGROUND, 'Checkbox');

    return (
        <PageLayout title="Checkbox" description="Single checkbox field that stores a configured checked value in the Form record.">
            <Section
                title="Checked value"
                preview={
                    <Form aspect="empty" defaultValues={{ accepted: 'yes' }}>
                        <Checkbox name="accepted" label="Accepted" valueChecked="yes" />
                    </Form>
                }
                code={`import { Checkbox, Form } from 'react-firestrap';

<Form defaultValues={{ accepted: 'yes' }}>
    <Checkbox name="accepted" label="Accepted" valueChecked="yes" />
</Form>`}
            />

            <PropDocsTable props={CHECKBOX_PROPS} />
        </PageLayout>
    );
}
