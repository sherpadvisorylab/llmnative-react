import React from 'react';
import { Form, UploadDocument, UploadImage } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';

export default function UploadPage() {
    return (
        <PageLayout
            title="Upload"
            description="Three specialised upload fields for images, documents and CSV data. Each variant handles local preview, file management and optional cloud storage independently."
        >
            <Section
                title="Image upload"
                description="Stores image metadata in the Form record. Renders inline thumbnails with a hover overlay for preview, crop and removal. Use UploadImage inside a Form to bind the result to a record field."
                preview={
                    <div className="w-full max-w-xl">
                        <Form appearance="empty">
                            <UploadImage
                                name="images"
                                label="Gallery"
                                multiple
                                editable
                                previewHeight={88}
                                previewWidth={88}
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadImage } from '@llmnative/react';

<Form>
  <UploadImage
    name="cover"
    label="Cover photo"
    previewHeight={112}
    previewWidth={112}
  />
</Form>`}
            />

            <Section
                title="Document upload"
                description="Accepts any file type and presents a table with name, size and an upload progress bar. Files are stored as base64 in the record unless a StorageProvider is configured."
                preview={
                    <div className="w-full max-w-2xl">
                        <Form appearance="empty">
                            <UploadDocument
                                name="attachments"
                                label="Attachments"
                                multiple
                                accept=".pdf,.doc,.docx,.txt"
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadDocument } from '@llmnative/react';

<Form>
  <UploadDocument
    name="attachments"
    label="Attachments"
    multiple
    accept=".pdf,.doc,.docx"
  />
</Form>`}
            />

            <Section
                title="CSV upload"
                description="Parses CSV and TSV files with PapaParse and delivers typed rows to onDataLoaded. Works standalone — no Form wrapper needed."
                preview={
                    <div className="alert alert-info text-sm w-full">
                        See the <strong>UploadCSV</strong> sub-page for a live demo with row preview.
                    </div>
                }
                code={`import { UploadCSV } from '@llmnative/react';
import type { UploadCSVData } from '@llmnative/react';

<UploadCSV
  name="import"
  label="Drop CSV here"
  normalizeKeys
  onDataLoaded={(result) => {
    console.log(result.fields, result.data);
  }}
/>`}
            />

            <Section
                title="Cloud storage"
                description="Register a StorageProvider in App and pass storagePath on any upload field to stream files to Firebase Storage or Supabase Storage instead of storing them locally."
                preview={
                    <div className="alert alert-info text-sm w-full">
                        The showcase runs offline — storagePath demos require credentials.
                    </div>
                }
                code={`import { App } from '@llmnative/react';

// Register storage backend once
<App
  providers={{
    firebase: { config: firebaseConfig },
    services: { storage: 'firestorage' },
  }}
/>

// Then pass storagePath on any upload field
<UploadImage
  name="avatar"
  storagePath="/uploads/avatars"
/>
<UploadDocument
  name="docs"
  storagePath="/uploads/documents"
/>`}
            />
        </PageLayout>
    );
}
