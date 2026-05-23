import React, { useState } from 'react';
import { Form, UploadCSV, UploadDocument, UploadImage } from '@llmnative/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const UPLOAD_IMAGE_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name in the form record' },
    { name: 'label', type: 'string', description: 'Label above the upload area', control: 'text' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple file selection', control: 'boolean' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Show crop/edit button after upload', control: 'boolean' },
    { name: 'previewWidth', type: 'number', description: 'Thumbnail width in pixels', control: 'number', min: 32, max: 512, step: 8 },
    { name: 'previewHeight', type: 'number', description: 'Thumbnail height in pixels', control: 'number', min: 32, max: 512, step: 8 },
    { name: 'storagePath', type: 'string', description: 'Storage provider path for cloud upload' },
    { name: 'accept', type: 'string', description: 'Accepted MIME types (e.g. "image/png,image/jpeg")' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the upload field', control: 'boolean' },
];

const UPLOAD_DOCUMENT_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name in the form record' },
    { name: 'label', type: 'string', description: 'Label above the upload area' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple file selection' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Allow removing uploaded files' },
    { name: 'accept', type: 'string', description: 'Accepted file extensions (e.g. ".pdf,.docx")' },
    { name: 'storagePath', type: 'string', description: 'Storage provider path for cloud upload' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the upload field' },
];

const UPLOAD_CSV_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name' },
    { name: 'label', type: 'string', description: 'Drop zone label text' },
    { name: 'normalizeKeys', type: 'boolean', default: 'false', description: 'Convert header keys to camelCase' },
    { name: 'removeEmptyFields', type: 'boolean', default: 'false', description: 'Strip fields with empty/null values' },
    {
        name: 'onDataLoaded',
        type: 'UploadCSVDataLoadedHandler',
        description: 'Callback fired after CSV is parsed.',
        shape: `type UploadCSVDataLoadedHandler = (
  results: UploadCSVData
) => void

interface UploadCSVData {
  data: UploadCSVRow[];
  fields: string[];
  file: File;
}

interface UploadCSVRow {
  [key: string]: UploadCSVCell;
}

type UploadCSVCell = string | null | undefined`,
        example: `onDataLoaded={(result) => {
  console.log(result.fields, result.data);
}}`,
    },
    {
        name: 'onParseField',
        type: 'UploadCSVParseFieldHandler',
        description: 'Optional field-level transform hook before parsed values are committed into the result rows.',
        shape: `type UploadCSVParseFieldHandler = (
  field: UploadCSVParseField
) => UploadCSVParseField | undefined

type UploadCSVParseField = [key: string, value: UploadCSVCell]`,
        example: `onParseField={([key, value]) => {
  if (key === 'price') return [key, Number(value)];
  return [key, value];
}}`,
    },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    showFormRecord: true,
    props: UPLOAD_IMAGE_PROPS,
    defaultProps: { label: 'Images', multiple: true, editable: true, previewWidth: 112, previewHeight: 112, disabled: false },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <UploadImage
                name="images"
                label={p.label}
                multiple={p.multiple}
                editable={p.editable}
                previewWidth={p.previewWidth}
                previewHeight={p.previewHeight}
                disabled={p.disabled}
            />
        </Form>
    ),
};

export default function UploadPage() {
    usePlayground(PLAYGROUND, 'Upload');
    const [csvInfo, setCsvInfo] = useState<{ rows: number; fields: string[] } | null>(null);

    return (
        <PageLayout
            title="Upload"
            description="Image, document and CSV upload fields. The showcase runs offline, so files are read locally unless a StorageProvider and storagePath are configured."
        >
            <Section
                title="Image upload"
                description="Reads image files locally and stores the generated metadata in the Form record. Enable editable to open the crop editor after upload."
                preview={
                    <div className="w-full max-w-xl">
                        <Form aspect="empty">
                            <UploadImage
                                name="images"
                                label="Gallery"
                                multiple
                                editable
                                previewHeight={112}
                                previewWidth={112}
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadImage } from '@llmnative/react';

<Form>
  <UploadImage
    name="images"
    label="Gallery"
    multiple
    editable
    previewHeight={112}
    previewWidth={112}
  />
</Form>`}
            />

            <Section
                title="Document upload"
                description="Accepts documents and shows file name, size and progress. Without storagePath it keeps the file as local base64 data."
                preview={
                    <div className="w-full max-w-2xl">
                        <Form aspect="empty">
                            <UploadDocument
                                name="documents"
                                label="Attachments"
                                multiple
                                editable
                                accept=".pdf,.doc,.docx,.txt,.md"
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadDocument } from '@llmnative/react';

<Form>
  <UploadDocument
    name="documents"
    label="Attachments"
    multiple
    editable
    accept=".pdf,.doc,.docx,.txt,.md"
  />
</Form>`}
            />

            <Section
                title="CSV parser"
                description="Parses CSV or TSV files with Papa Parse and exposes normalized rows to application code."
                preview={
                    <div className="w-full max-w-2xl space-y-4">
                        <UploadCSV
                            name="csv"
                            label="Drag or click to upload CSV"
                            normalizeKeys
                            removeEmptyFields
                            onDataLoaded={(result) => setCsvInfo({ rows: result.data.length, fields: result.fields })}
                        />
                        <div className="rounded-md border bg-card p-4 text-sm">
                            <p className="font-semibold">Parsed result</p>
                            <p className="mt-1 text-muted-foreground">
                                {csvInfo
                                    ? `${csvInfo.rows} rows, fields: ${csvInfo.fields.join(', ')}`
                                    : 'No CSV loaded yet.'}
                            </p>
                        </div>
                    </div>
                }
                code={`import { UploadCSV } from '@llmnative/react';

<UploadCSV
  name="csv"
  label="Drag or click to upload CSV"
  normalizeKeys
  removeEmptyFields
  onDataLoaded={(result) => {
    console.log(result.fields, result.data);
  }}
/>`}
            />

            <Section
                title="Cloud storage"
                description="When App registers a StorageProvider and you pass storagePath, uploads are sent to the configured backend."
                preview={
                    <div className="alert alert-info text-sm w-full">
                        The local showcase intentionally leaves storagePath unset so demos work without credentials.
                    </div>
                }
                code={`import { App, FirebaseStorageProvider, Form, UploadImage } from '@llmnative/react';

<App
  providers={{
    firebase: firebaseConfig,
    services: { storage: 'firestorage' },
  }}
/>

<Form>
  <UploadImage
    name="cover"
    label="Cover"
    storagePath="/uploads/covers"
  />
</Form>`}
            />

            <PropDocsTable props={UPLOAD_IMAGE_PROPS} title="UploadImage props" />
            <PropDocsTable props={UPLOAD_DOCUMENT_PROPS} title="UploadDocument props" />
            <PropDocsTable props={UPLOAD_CSV_PROPS} title="UploadCSV props" />

        </PageLayout>
    );
}
