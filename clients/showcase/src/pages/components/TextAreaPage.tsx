import React from 'react';
import { Form, TextArea } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const TEXTAREA_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text' },
    { name: 'label', type: 'string', description: 'Label above the textarea', control: 'text' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text', control: 'text' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the textarea', control: 'boolean' },
    { name: 'updatable', type: 'boolean', default: 'true', description: 'When false, an existing value locks the textarea', control: 'boolean' },
    { name: 'defaultValue', type: 'string', description: 'Initial textarea value', control: 'textarea' },
    { name: 'rows', type: 'number', description: 'Textarea rows', control: 'number', min: 2, max: 12 },
    { name: 'feedback', type: 'string', description: 'Validation feedback under the field', control: 'text' },
    { name: 'pre', type: 'ReactNode', description: 'Input-group content before the textarea', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Input-group content after the textarea', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on textarea', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: TEXTAREA_PROPS,
    showFormRecord: true,
    defaultProps: {
        name: 'notes',
        label: 'Notes',
        placeholder: 'Write a short note...',
        required: false,
        disabled: false,
        updatable: true,
        defaultValue: 'Follow up with the customer next week.',
        rows: 4,
        feedback: '',
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <TextArea {...p} />
        </Form>
    ),
};

export default function TextAreaPage() {
    usePlayground(PLAYGROUND, 'TextArea');

    return (
        <PageLayout title="TextArea" description="Controlled multiline text field integrated with Form context.">
            <Section
                title="Basic textarea"
                preview={
                    <Form aspect="empty" defaultValues={{ notes: 'Initial note' }}>
                        <TextArea name="notes" label="Notes" rows={4} />
                    </Form>
                }
                code={`import { Form, TextArea } from '@llmnative/react';

<Form defaultValues={{ notes: 'Initial note' }}>
    <TextArea name="notes" label="Notes" rows={4} />
</Form>`}
            />

            <PropDocsTable props={TEXTAREA_PROPS} />
        </PageLayout>
    );
}
