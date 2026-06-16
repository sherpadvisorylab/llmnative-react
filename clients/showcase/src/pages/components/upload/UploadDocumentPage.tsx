import React from 'react';
import { Form, UploadDocument } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';
import { useShowcaseUploadDocumentI18n } from '../../../showcase/i18n';

export default function UploadDocumentPage() {
    const t = useShowcaseUploadDocumentI18n();

    const propsConfig = React.useMemo<PropDef[]>(() => ([
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'multiple', type: 'boolean', default: t.propsDocs.items.multiple.default, description: t.propsDocs.items.multiple.description, control: 'boolean' },
        { name: 'editable', type: 'boolean', default: t.propsDocs.items.editable.default, description: t.propsDocs.items.editable.description, control: 'boolean' },
        { name: 'accept', type: 'string', default: t.propsDocs.items.accept.default, description: t.propsDocs.items.accept.description, control: 'text' },
        { name: 'max', type: 'number', default: t.propsDocs.items.max.default, description: t.propsDocs.items.max.description, control: 'number', min: 1, max: 20 },
        { name: 'required', type: 'boolean', default: t.propsDocs.items.required.default, description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ]), [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        showFormRecord: true,
        props: propsConfig,
        defaultProps: {
            label: t.playground.defaultLabel,
            multiple: true,
            editable: false,
            accept: '.pdf,.doc,.docx,.txt,.md',
            max: 10,
            required: false,
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <UploadDocument
                    name="documents"
                    label={p.label || undefined}
                    multiple={p.multiple}
                    editable={p.editable}
                    accept={p.accept || '.pdf,.doc,.docx,.txt'}
                    max={Number(p.max)}
                    required={p.required}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [propsConfig, t.playground.defaultLabel]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.basicUpload.title}
                description={t.sections.basicUpload.description}
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="report"
                                label={t.labels.report}
                                accept=".pdf,.doc,.docx"
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadDocument } from '@llmnative/react';

<Form appearance="empty">
  <UploadDocument
    name="report"
    label="Report"
    accept=".pdf,.doc,.docx"
  />
</Form>`}
            />

            <Section
                title={t.sections.multipleFiles.title}
                description={t.sections.multipleFiles.description}
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="attachments"
                                label={t.labels.attachmentsMax}
                                multiple
                                max={5}
                                accept=".pdf,.doc,.docx,.txt,.md"
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="empty">
  <UploadDocument
    name="attachments"
    label="Attachments (max 5)"
    multiple
    max={5}
    accept=".pdf,.doc,.docx,.txt,.md"
  />
</Form>`}
            />

            <Section
                title={t.sections.editableFileNames.title}
                description={t.sections.editableFileNames.description}
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="deliverables"
                                label={t.labels.deliverables}
                                editable
                                multiple
                                max={4}
                                accept=".pdf,.docx,.txt"
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="empty">
  <UploadDocument
    name="deliverables"
    label="Deliverables"
    editable
    multiple
    max={4}
    accept=".pdf,.docx,.txt"
  />
</Form>`}
            />

            <Section
                title={t.sections.acceptFilter.title}
                description={t.sections.acceptFilter.description}
                preview={
                    <div className="space-y-2 w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="data"
                                label={t.labels.csvExcelOnly}
                                accept=".csv,.xls,.xlsx"
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="empty">
  <UploadDocument
    name="data"
    label="CSV / Excel only"
    accept=".csv,.xls,.xlsx"
  />
</Form>

<Form appearance="empty">
  <UploadDocument
    name="assets"
    label="Assets"
    accept=".png,.jpg,.svg"
  />
</Form>`}
            />

            <Section
                title={t.sections.requiredField.title}
                description={t.sections.requiredField.description}
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="card" onComplete={async () => false}>
                            <UploadDocument
                                name="contract"
                                label={t.labels.contractRequired}
                                required
                                accept=".pdf"
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="card" onComplete={async () => false}>
  <UploadDocument
    name="contract"
    label="Contract (required)"
    required
    accept=".pdf"
  />
</Form>`}
            />

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
