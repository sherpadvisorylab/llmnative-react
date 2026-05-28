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
    { name: 'updatable', type: 'boolean', default: 'true', description: 'When false and the field already has a value, the textarea is locked to prevent edits', control: 'boolean' },
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
    { name: 'pre', type: 'ReactNode', description: 'Input-group content rendered before (left of) the textarea', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Input-group content rendered after (right of) the textarea', control: 'text' },
    { name: 'inputId', type: 'string', description: 'Explicit id for the textarea element. Auto-generated when omitted.' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'Extra CSS classes applied to the textarea element', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes applied to the outer wrapper div', control: 'text' },
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
        updatable: true,
        defaultValue: 'Follow up with the customer next week.',
        rows: 4,
        maxRows: undefined,
        feedback: '',
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <TextArea
                name={p.name}
                label={p.label}
                placeholder={p.placeholder}
                required={p.required}
                disabled={p.disabled}
                updatable={p.updatable}
                defaultValue={p.defaultValue}
                rows={p.rows}
                maxRows={p.maxRows || undefined}
                feedback={p.feedback || undefined}
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
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
                    <Form aspect="empty" defaultValues={{ notes: 'Initial note' }}>
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
                    <Form aspect="empty">
                        <TextArea
                            name="bio"
                            label="Bio"
                            placeholder="Start typing — the textarea will grow as you add lines..."
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
                    <Form aspect="empty">
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
                    <Form aspect="empty">
                        <TextArea
                            name="note"
                            label="Signed note"
                            pre="Note"
                            rows={3}
                        />
                    </Form>
                }
                code={`<TextArea name="note" label="Signed note" pre="Note" rows={3} />`}
            />

            <PropDocsTable props={TEXTAREA_PROPS} />
        </PageLayout>
    );
}
