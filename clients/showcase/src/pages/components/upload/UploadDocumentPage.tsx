import React from 'react';
import { Form, UploadDocument } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';

const PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name bound to the Form record' },
    { name: 'label', type: 'string', description: 'Label rendered above the drop zone or file table', control: 'text' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting and storing more than one file', control: 'boolean' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Open the file-name editor modal when a table row is clicked', control: 'boolean' },
    { name: 'accept', type: 'string', default: '".pdf,.doc,.docx,.txt,.iso"', description: 'Native file input accept filter shown in the picker and drop zone hint', control: 'text' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum number of files that can be kept in the field', control: 'number', min: 1, max: 20 },
    { name: 'required', type: 'boolean', default: 'false', description: 'Mark the hidden file input as required and show validation feedback when empty', control: 'boolean' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Called whenever the file array stored in the Form record changes' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the upload field inside the outer wrapper' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the upload field inside the outer wrapper' },
    { name: 'className', type: 'string', description: 'CSS classes applied to the inner field container', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes applied to the outer Wrapper element', control: 'text' },
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
            description="Document upload field with drag-and-drop, inline progress, removable rows and optional file-name editing. The Form record stores an array of file descriptors."
        >
            <Section
                title="Basic document upload"
                description="Single-file upload with drag-and-drop. The field reads the selected file locally, shows progress while converting it, then stores the uploaded entry in the Form record."
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

<Form appearance="empty">
  <UploadDocument
    name="report"
    label="Report"
    accept=".pdf,.doc,.docx"
  />
</Form>`}
            />

            <Section
                title="Multiple files"
                description="Enable multiple to keep several files in the same field. Each uploaded file becomes a table row, and the inline upload action stays available until max is reached."
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
                title="Editable file names"
                description="Set editable to make each row clickable. Clicking a completed row opens the built-in file-name editor modal and saves the new fileName back into the stored file entry."
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="deliverables"
                                label="Deliverables"
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
                title="Accept filter"
                description="Restrict the native file chooser to specific extensions. The same accept string is also shown inside the empty drop zone as a visual hint for the allowed formats."
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
                title="Required field"
                description="Add required to surface form validation when the field is empty. The validation message is rendered below the upload area using the standard form field error slot."
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
                code={`<Form appearance="card" onComplete={async () => false}>
  <UploadDocument
    name="contract"
    label="Contract (required)"
    required
    accept=".pdf"
  />
</Form>`}
            />

            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
