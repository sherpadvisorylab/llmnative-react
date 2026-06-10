import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';

const variantPages = [
    {
        title: 'UploadImage',
        path: '/components/upload/image',
        description: 'Inline thumbnail grid with hover overlay for preview, crop and removal. Supports single or multiple images.',
    },
    {
        title: 'UploadDocument',
        path: '/components/upload/document',
        description: 'File list with name, size and progress bar. Accepts any file type via the accept filter.',
    },
    {
        title: 'UploadCSV',
        path: '/components/upload/csv',
        description: 'Drag-and-drop CSV parser. Delivers typed rows and field names to onDataLoaded. Works standalone without a Form.',
    },
];

export default function UploadPage() {
    return (
        <PageLayout
            title="Upload"
            description="Three specialised upload fields for images, documents and CSV data. Each variant manages local preview, file binding and optional cloud storage independently."
        >
            <Section
                title="Variants"
                description="Choose the variant that matches the file type. All three extend FormFieldProps and bind their result to the enclosing Form record via the name prop."
                preview={
                    <div className="grid gap-3 md:grid-cols-3">
                        {variantPages.map((page) => (
                            <Link
                                key={page.path}
                                to={page.path}
                                className="block rounded-md border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                <h3 className="font-semibold text-foreground">{page.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
                            </Link>
                        ))}
                    </div>
                }
                code={`import { Form, UploadImage, UploadDocument, UploadCSV } from '@llmnative/react';

// Image thumbnails with optional crop editor
<Form>
  <UploadImage name="cover" label="Cover" multiple editable previewHeight={112} previewWidth={112} />
</Form>

// File list with name, size and progress
<Form>
  <UploadDocument name="attachments" label="Attachments" multiple accept=".pdf,.docx" />
</Form>

// CSV parser — standalone, no Form needed
<UploadCSV
  name="import"
  label="Drop CSV here"
  normalizeKeys
  onDataLoaded={(result) => console.log(result.fields, result.data)}
/>`}
            />

            <Section
                title="Cloud storage"
                description="Register a StorageProvider in App and pass storagePath on UploadImage or UploadDocument to stream files to Firebase Storage or Supabase Storage instead of keeping them as local base64."
                preview={
                    <div className="alert alert-info text-sm w-full">
                        The showcase runs offline — storagePath demos require a configured StorageProvider.
                    </div>
                }
                code={`import { App } from '@llmnative/react';

<App
  providers={{
    firebase: { config: firebaseConfig },
    services: { storage: 'firestorage' },
  }}
/>

// storagePath is resolved by the active StorageProvider at upload time
<UploadImage  name="avatar"  storagePath="/uploads/avatars" />
<UploadDocument name="docs" storagePath="/uploads/documents" />`}
            />
        </PageLayout>
    );
}
