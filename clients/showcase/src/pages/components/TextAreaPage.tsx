import React from 'react';
import { Form, TextArea } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseTextAreaI18n } from '../../showcase/i18n';

export default function TextAreaPage() {
    const t = useShowcaseTextAreaI18n();

    const textAreaProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'placeholder', type: 'string', description: t.propsDocs.items.placeholder.description, control: 'text' },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnlyAfterSet.description, control: 'boolean' },
        {
            name: 'defaultValue',
            type: 'string',
            description: t.propsDocs.items.defaultValue.description,
            control: 'textarea',
            rows: 5,
            shortcuts: [
                { label: 'follow-up', value: 'Follow up with the customer next week.', help: 'Short CRM note.' },
                { label: 'meeting', value: 'Meeting recap:\n- Confirm budget\n- Share proposal\n- Book review call', help: 'Multiline notes example.' },
                { label: 'empty', value: '', help: 'Start from a blank textarea.' },
            ],
        },
        { name: 'minHeight', type: 'number', description: 'Minimum textarea height in pixels. Default: 96.', control: 'number', min: 48, max: 480 },
        { name: 'maxHeight', type: 'number', description: 'Maximum textarea height in pixels before internal scrolling.', control: 'number', min: 72, max: 960 },
        { name: 'feedback', type: 'string', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'id', type: 'string', description: t.propsDocs.items.id.description, control: 'text' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'textareaRef', type: 'React.RefObject<HTMLTextAreaElement | null> | ((el: HTMLTextAreaElement | null) => void)', description: t.propsDocs.items.textareaRef.description },
        { name: 'validator', type: '(value: FieldValue) => string | undefined', description: t.propsDocs.items.validator.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'labelClassName', type: 'string', description: t.propsDocs.items.labelClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: textAreaProps,
        size: 'lg',
        showFormRecord: true,
        defaultProps: {
            name: 'notes',
            label: t.labels.notes,
            placeholder: t.labels.writeShortNote,
            required: false,
            disabled: false,
            readOnlyAfterSet: false,
            defaultValue: 'Follow up with the customer next week.',
            minHeight: 120,
            maxHeight: undefined,
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
                    minHeight={p.minHeight}
                    maxHeight={p.maxHeight || undefined}
                    feedback={p.feedback || undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [t, textAreaProps]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.basicTextarea.title}
                preview={(
                    <Form appearance="empty" defaultValues={{ notes: t.labels.initialNote }}>
                        <TextArea name="notes" label={t.labels.notes} minHeight={120} />
                    </Form>
                )}
                code={`import { Form, TextArea } from '@llmnative/react';

<Form defaultValues={{ notes: 'Initial note' }}>
  <TextArea name="notes" label="Notes" minHeight={120} />
</Form>`}
            />

            <Section
                title={t.sections.autoResize.title}
                description={t.sections.autoResize.description}
                preview={(
                    <Form appearance="empty">
                        <TextArea
                            name="bio"
                            label={t.labels.bio}
                            placeholder={t.labels.startTyping}
                            minHeight={80}
                            maxHeight={160}
                        />
                    </Form>
                )}
                code={`<TextArea
  name="bio"
  label="Bio"
  placeholder="Start typing..."
  minHeight={80}
  maxHeight={160}
/>`}
            />

            <Section
                title={t.sections.feedbackPlaceholder.title}
                preview={(
                    <Form appearance="empty">
                        <TextArea
                            name="description"
                            label={t.labels.description}
                            placeholder={t.labels.describeIssue}
                            minHeight={120}
                            feedback={t.labels.beSpecific}
                        />
                    </Form>
                )}
                code={`<TextArea
  name="description"
  label="Description"
  placeholder="Describe the issue in detail..."
  minHeight={120}
  feedback="Be as specific as possible."
/>`}
            />

            <Section
                title={t.sections.addons.title}
                preview={(
                    <Form appearance="empty">
                        <TextArea
                            name="note"
                            label={t.labels.signedNote}
                            before={t.labels.note}
                            minHeight={96}
                        />
                    </Form>
                )}
                code={`<TextArea name="note" label="Signed note" before="Note" minHeight={96} />`}
            />

            <PropDocsTable props={textAreaProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
