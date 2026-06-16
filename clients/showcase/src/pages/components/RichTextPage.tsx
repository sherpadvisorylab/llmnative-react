import React from 'react';
import { Form, RichText } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseRichTextI18n } from '../../showcase/i18n';

export default function RichTextPage() {
    const t = useShowcaseRichTextI18n();

    const richTextProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'placeholder', type: 'string', description: t.propsDocs.items.placeholder.description, control: 'text' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        {
            name: 'toolbar',
            type: '"fixed" | "floating" | false',
            default: '"fixed"',
            description: t.propsDocs.items.toolbar.description,
            control: 'select',
            options: ['"fixed"', '"floating"', 'false'],
        },
        {
            name: 'outputFormat',
            type: '"html" | "json" | "text"',
            default: '"html"',
            description: t.propsDocs.items.outputFormat.description,
            control: 'select',
            options: ['"html"', '"json"', '"text"'],
        },
        { name: 'statusBar', type: 'boolean | StatusBarConfig', default: 'false', description: t.propsDocs.items.statusBar.description, control: 'boolean' },
        { name: 'minHeight', type: 'number', default: '120', description: t.propsDocs.items.minHeight.description, control: 'number', min: 80, max: 600 },
        { name: 'maxHeight', type: 'number', description: t.propsDocs.items.maxHeight.description, control: 'number', min: 120, max: 1200 },
        { name: 'uploadPath', type: 'string', description: t.propsDocs.items.uploadPath.description, control: 'text' },
        { name: 'feedback', type: 'string', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'defaultValue', type: 'string', description: t.propsDocs.items.defaultValue.description, control: 'textarea', rows: 3 },
        { name: 'validator', type: '(value: FieldValue) => string | undefined', description: t.propsDocs.items.validator.description },
        { name: 'id', type: 'string', description: t.propsDocs.items.id.description, control: 'text' },
        { name: 'labelClassName', type: 'string', description: t.propsDocs.items.labelClassName.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: richTextProps,
        size: 'lg',
        showFormRecord: true,
        defaultProps: {
            name: 'content',
            label: t.labels.content,
            required: false,
            disabled: false,
            toolbar: '"fixed"',
            outputFormat: '"html"',
            statusBar: false,
            minHeight: 160,
            feedback: '',
            placeholder: t.labels.startTyping,
            before: '',
            after: '',
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <RichText
                    name={p.name}
                    label={p.label}
                    required={p.required}
                    disabled={p.disabled}
                    toolbar={p.toolbar === 'false' ? false : p.toolbar as 'fixed' | 'floating'}
                    outputFormat={p.outputFormat as 'html' | 'json' | 'text'}
                    statusBar={p.statusBar}
                    minHeight={p.minHeight}
                    feedback={p.feedback || undefined}
                    placeholder={p.placeholder || undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [t, richTextProps]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>

            <Section
                title={t.sections.basicUsage.title}
                description={t.sections.basicUsage.description}
                preview={(
                    <Form appearance="empty">
                        <RichText
                            name="body"
                            label={t.labels.articleBody}
                        />
                    </Form>
                )}
                code={`import { Form, RichText } from '@llmnative/react';

<Form>
  <RichText name="body" label="Article body" />
</Form>`}
            />

            <Section
                title={t.sections.toolbarModes.title}
                description={t.sections.toolbarModes.description}
                preview={(
                    <div className="flex flex-col gap-6">
                        <Form appearance="empty">
                            <RichText
                                name="fixed"
                                label={'toolbar="fixed"'}
                                toolbar="fixed"
                                minHeight={100}
                            />
                        </Form>
                        <Form appearance="empty">
                            <RichText
                                name="floating"
                                label={'toolbar="floating" — select text to reveal'}
                                toolbar="floating"
                                minHeight={100}
                            />
                        </Form>
                        <Form appearance="empty">
                            <RichText
                                name="notoolbar"
                                label={'toolbar={false}'}
                                toolbar={false}
                                minHeight={80}
                            />
                        </Form>
                    </div>
                )}
                code={`<RichText name="a" toolbar="fixed" />
<RichText name="b" toolbar="floating" />
<RichText name="c" toolbar={false} />`}
            />

            <Section
                title={t.sections.customCommands.title}
                description={t.sections.customCommands.description}
                preview={(
                    <Form appearance="empty">
                        <RichText
                            name="notes"
                            label={t.labels.notes}
                            toolbarCommands={['bold', 'italic', 'underline', '|', 'bulletList', 'orderedList', '|', 'undo', 'redo']}
                            minHeight={100}
                        />
                    </Form>
                )}
                code={`<RichText
  name="notes"
  label="Notes"
  toolbarCommands={[
    'bold', 'italic', 'underline', '|',
    'bulletList', 'orderedList', '|',
    'undo', 'redo',
  ]}
/>`}
            />

            <Section
                title={t.sections.tableSupport.title}
                description={t.sections.tableSupport.description}
                preview={(
                    <Form appearance="empty">
                        <RichText
                            name="data"
                            label={t.labels.content}
                            toolbarCommands={['bold', 'italic', '|', 'bulletList', 'orderedList', '|', 'table', '|', 'undo', 'redo']}
                            minHeight={120}
                        />
                    </Form>
                )}
                code={`<RichText
  name="data"
  toolbarCommands={[
    'bold', 'italic', '|',
    'bulletList', 'orderedList', '|',
    'table', '|',
    'undo', 'redo',
  ]}
/>`}
            />

            <Section
                title={t.sections.sourceCode.title}
                description={t.sections.sourceCode.description}
                preview={(
                    <Form appearance="empty">
                        <RichText
                            name="html"
                            label={t.labels.content}
                            toolbarCommands={['bold', 'italic', 'underline', '|', 'bulletList', '|', 'sourceCode']}
                            minHeight={120}
                        />
                    </Form>
                )}
                code={`<RichText
  name="html"
  toolbarCommands={[
    'bold', 'italic', 'underline', '|',
    'bulletList', '|',
    'sourceCode',
  ]}
/>`}
            />

            <Section
                title={t.sections.statusBar.title}
                description={t.sections.statusBar.description}
                preview={(
                    <Form appearance="empty">
                        <RichText
                            name="comment"
                            label={t.labels.comment}
                            statusBar={true}
                            minHeight={120}
                        />
                    </Form>
                )}
                code={`// statusBar={true} — word count + tag breadcrumb (defaults)
<RichText name="comment" label="Comment" statusBar={true} />

// Fine-grained control:
<RichText
  name="comment"
  statusBar={{ tagBreadcrumb: true, wordCount: true, charCount: true }}
/>`}
            />

            <Section
                title={t.sections.outputFormats.title}
                description={t.sections.outputFormats.description}
                preview={(
                    <div className="flex flex-col gap-4">
                        <Form appearance="empty" showFormRecord>
                            <RichText
                                name="html"
                                label={'outputFormat="html" (default)'}
                                outputFormat="html"
                                minHeight={80}
                            />
                        </Form>
                        <Form appearance="empty" showFormRecord>
                            <RichText
                                name="txt"
                                label={'outputFormat="text"'}
                                outputFormat="text"
                                minHeight={80}
                            />
                        </Form>
                    </div>
                )}
                code={`<RichText name="body" outputFormat="html" />   // default
<RichText name="body" outputFormat="json" />   // TipTap JSON doc
<RichText name="body" outputFormat="text" />   // plain text only`}
            />

            <Section
                title={t.sections.disabledState.title}
                description={t.sections.disabledState.description}
                preview={(
                    <Form
                        appearance="empty"
                        defaultValues={{ description: '<p>This content is <strong>read-only</strong> and cannot be edited.</p>' }}
                    >
                        <RichText
                            name="description"
                            label={t.labels.description}
                            disabled
                            toolbar={false}
                            minHeight={80}
                        />
                    </Form>
                )}
                code={`<Form defaultValues={{ description: '<p>Read-only content.</p>' }}>
  <RichText name="description" disabled toolbar={false} />
</Form>`}
            />

            <PropDocsTable props={richTextProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
