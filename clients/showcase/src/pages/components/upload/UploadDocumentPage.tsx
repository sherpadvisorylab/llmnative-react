import React from 'react';
import { Form, UploadDocument } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';

const PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name bound to the Form record' },
    { name: 'label', type: 'string', description: 'Label rendered above the file list and upload button', control: 'text' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow uploading more than one file at a time', control: 'boolean' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Enable clicking a row to open the file editor', control: 'boolean' },
    { name: 'accept', type: 'string', default: '".pdf,.doc,.docx,.txt,.iso"', description: 'Accepted file extensions (e.g. ".pdf,.docx")', control: 'text' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum number of files allowed', control: 'number', min: 1, max: 20 },
    { name: 'required', type: 'boolean', default: 'false', description: 'Mark field as required — blocks form submit when empty', control: 'boolean' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Called on every file list change with the updated value and form context' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the upload area, inside the outer wrapper' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the upload area, inside the outer wrapper' },
    { name: 'className', type: 'string', description: 'CSS classes on the inner container', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    showFormRecord: true,
    props: PROPS,
    defaultProps: {
        label: 'Attachments',
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
};

export default function UploadDocumentPage() {
    usePlayground(PLAYGROUND, 'UploadDocument');

    return (
        <PageLayout
            title="UploadDocument"
            description="File upload field that renders uploaded files as a table with name, size and progress. Accepts any file type via the accept filter. Stores file data in the Form record."
        >
            <Section
                title="Basic document upload"
                description="Single-file upload. Shows the file name, size and a progress indicator while the file is being read. Without a StorageProvider the file is stored as base64 in the Form record."
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="report"
                                label="Report"
                                accept=".pdf,.doc,.docx"
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadDocument } from '@llmnative/react';

<Form>
  <UploadDocument
    name="report"
    label="Report"
    accept=".pdf,.doc,.docx"
  />
</Form>`}
            />

            <Section
                title="Multiple files"
                description="Enable multiple to allow selecting several files in one picker interaction. Each file is displayed as a separate row. The upload button disappears once max is reached."
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="attachments"
                                label="Attachments (max 5)"
                                multiple
                                max={5}
                                accept=".pdf,.doc,.docx,.txt,.md"
                            />
                        </Form>
                    </div>
                }
                code={`<UploadDocument
  name="attachments"
  label="Attachments"
  multiple
  max={5}
  accept=".pdf,.doc,.docx,.txt,.md"
/>`}
            />

            <Section
                title="Accept filter"
                description="Restrict the file picker to specific extensions. Combine multiple extensions with commas. The field does not re-validate files dropped outside the picker."
                preview={
                    <div className="space-y-2 w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="data"
                                label="CSV / Excel only"
                                accept=".csv,.xls,.xlsx"
                            />
                        </Form>
                    </div>
                }
                code={`// Spreadsheets
<UploadDocument name="data" accept=".csv,.xls,.xlsx" />

// Images as documents (no preview)
<UploadDocument name="assets" accept=".png,.jpg,.svg" />

// All files (default)
<UploadDocument name="any" accept="*" />`}
            />

            <Section
                title="Required field"
                description="Add required to prevent the form from submitting when no file has been uploaded. The field renders a validation error below the upload area."
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="card" onComplete={async () => false}>
                            <UploadDocument
                                name="contract"
                                label="Contract (required)"
                                required
                                accept=".pdf"
                            />
                        </Form>
                    </div>
                }
                code={`<Form>
  <UploadDocument
    name="contract"
    label="Contract"
    required
    accept=".pdf"
  />
</Form>`}
            />

            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
