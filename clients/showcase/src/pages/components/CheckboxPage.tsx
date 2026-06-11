import React from 'react';
import { Checkbox, Form } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const CHECKBOX_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Label next to the checkbox', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
    { name: 'ariaLabel', type: 'string', description: 'Accessible label for the checkbox input (used when no visible label is provided)', control: 'text' },
    { name: 'inheritWrapperClassName', type: 'boolean', default: 'true', description: 'When false, ignores the wrapperClassName inherited from the parent Form context', control: 'boolean' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'valueChecked', type: 'string | number', default: '"on"', description: 'Value saved when checked', control: 'text' },
    { name: 'defaultValue', type: 'string | number', description: 'Initial checked value', control: 'text' },
    { name: 'before', type: 'ReactNode', description: 'Content before the checkbox', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Content after the checkbox', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on checkbox input', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
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
        before: '',
        after: '',
        className: '',
        wrapperClassName: '',
    },
    render: (p, onValuesChange) => (
        <Form appearance="empty" onChange={onValuesChange}>
            <Checkbox name="accepted" {...p} />
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
                    <Form appearance="empty" defaultValues={{ accepted: 'yes' }}>
                        <Checkbox name="accepted" label="Accepted" valueChecked="yes" />
                    </Form>
                }
                code={`import { Checkbox, Form } from '@llmnative/react';

<Form defaultValues={{ accepted: 'yes' }}>
    <Checkbox name="accepted" label="Accepted" valueChecked="yes" />
</Form>`}
            />

            <PropDocsTable props={CHECKBOX_PROPS} />
        </PageLayout>
    );
}
