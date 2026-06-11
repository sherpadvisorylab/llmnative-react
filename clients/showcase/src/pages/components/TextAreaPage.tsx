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
    { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: 'Textarea becomes read-only (disabled) once a value has been set', control: 'boolean' },
    {
        name: 'defaultValue',
        type: 'string',
        description: 'Initial textarea value supplied from outside the form context',
        control: 'textarea',
        rows: 5,
        shortcuts: [
            { label: 'follow-up', value: 'Follow up with the customer next week.', help: 'Short CRM note.' },
            { label: 'meeting', value: 'Meeting recap:\n- Confirm budget\n- Share proposal\n- Book review call', help: 'Multiline notes example.' },
            { label: 'empty', value: '', help: 'Start from a blank textarea.' },
        ],
    },
    { name: 'rows', type: 'number', description: 'Fixed number of visible rows. Ignored when maxRows is set and content is shorter.', control: 'number', min: 2, max: 12 },
    { name: 'maxRows', type: 'number', description: 'Auto-resize the height to fit the content, up to this many rows. Once the limit is reached a scrollbar appears.', control: 'number', min: 2, max: 20 },
    { name: 'feedback', type: 'string', description: 'Helper or validation text rendered below the field', control: 'text' },
    { name: 'before', type: 'ReactNode', description: 'Input-group content rendered before (left of) the textarea', control: 'text' },
    { name: 'after', type: 'ReactNode', description: 'Input-group content rendered after (right of) the textarea', control: 'text' },
    { name: 'id', type: 'string', description: 'Explicit id for the textarea element. Auto-generated when omitted.', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'textareaRef', type: 'React.RefObject<HTMLTextAreaElement | null> | ((el: HTMLTextAreaElement | null) => void)', description: 'Ref forwarded to the underlying <textarea> element. Accepts both a RefObject and a callback ref.' },
    { name: 'validator', type: '(value: FieldValue) => string | undefined', description: 'Custom validation function. Return an error message string to block submission, or undefined when the value is valid.' },
    { name: 'className', type: 'string', description: 'Extra CSS classes applied to the textarea element', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes applied to the outer wrapper div', control: 'text' },
    { name: 'labelClassName', type: 'string', description: 'CSS classes applied to the label element', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: TEXTAREA_PROPS,
    size: 'lg',
    showFormRecord: true,
    defaultProps: {
        name: 'notes',
        label: 'Notes',
        placeholder: 'Write a short note...',
        required: false,
        disabled: false,
        readOnlyAfterSet: false,
        defaultValue: 'Follow up with the customer next week.',
        rows: 4,
        maxRows: undefined,
        feedback: '',
        before: '',
        after: '',
        className: '',
        wrapperClassName: '',
    },
    render: (p, onValuesChange) => (
        <Form appearance="empty" onChange={onValuesChange}>
            <TextArea
                name={p.name}
                label={p.label}
                placeholder={p.placeholder}
                required={p.required}
                disabled={p.disabled}
                readOnlyAfterSet={p.readOnlyAfterSet}
                defaultValue={p.defaultValue}
                rows={p.rows}
                maxRows={p.maxRows || undefined}
                feedback={p.feedback || undefined}
                before={p.before || undefined}
                after={p.after || undefined}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
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
                    <Form appearance="empty" defaultValues={{ notes: 'Initial note' }}>
                        <TextArea name="notes" label="Notes" rows={4} />
                    </Form>
                }
                code={`import { Form, TextArea } from '@llmnative/react';

<Form defaultValues={{ notes: 'Initial note' }}>
  <TextArea name="notes" label="Notes" rows={4} />
</Form>`}
            />

            <Section
                title="Auto-resize with maxRows"
                description="Set maxRows to make the textarea grow with its content. Once the row limit is reached the textarea stops expanding and shows a scrollbar."
                preview={
                    <Form appearance="empty">
                        <TextArea
                            name="bio"
                            label="Bio"
                            placeholder="Start typing - the textarea will grow as you add lines..."
                            rows={2}
                            maxRows={6}
                        />
                    </Form>
                }
                code={`<TextArea
  name="bio"
  label="Bio"
  placeholder="Start typing..."
  rows={2}
  maxRows={6}
/>`}
            />

            <Section
                title="With feedback and placeholder"
                preview={
                    <Form appearance="empty">
                        <TextArea
                            name="description"
                            label="Description"
                            placeholder="Describe the issue in detail..."
                            rows={4}
                            feedback="Be as specific as possible."
                        />
                    </Form>
                }
                code={`<TextArea
  name="description"
  label="Description"
  placeholder="Describe the issue in detail..."
  rows={4}
  feedback="Be as specific as possible."
/>`}
            />

            <Section
                title="With pre/post addons"
                preview={
                    <Form appearance="empty">
                        <TextArea
                            name="note"
                            label="Signed note"
                            before="Note"
                            rows={3}
                        />
                    </Form>
                }
                code={`<TextArea name="note" label="Signed note" before="Note" rows={3} />`}
            />

            <PropDocsTable props={TEXTAREA_PROPS} />
        </PageLayout>
    );
}
