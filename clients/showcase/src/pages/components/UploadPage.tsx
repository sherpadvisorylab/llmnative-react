import React from 'react';
import { Form, UploadCSV, UploadDocument, UploadImage } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function UploadPage() {
    const [csvInfo, setCsvInfo] = React.useState<{ rows: number; fields: string[] } | null>(null);

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
                        <Form defaultValues={{}}>
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
                code={`import { Form, UploadImage } from 'react-firestrap';

<Form defaultValues={{}}>
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
                        <Form defaultValues={{}}>
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
                code={`import { Form, UploadDocument } from 'react-firestrap';

<Form defaultValues={{}}>
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
                code={`import { UploadCSV } from 'react-firestrap';

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
                code={`import { App, FirebaseStorageProvider, Form, UploadImage } from 'react-firestrap';

<App
  providers={{
    default: 'firebase',
    firebase: { config: firebaseConfig },
  }}
/>

<Form defaultValues={{}}>
  <UploadImage
    name="cover"
    label="Cover"
    storagePath="/uploads/covers"
  />
</Form>`}
            />
        </PageLayout>
    );
}
