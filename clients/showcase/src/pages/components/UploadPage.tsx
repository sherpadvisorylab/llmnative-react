import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import { useShowcaseCommonI18n, useShowcaseUploadI18n } from '../../showcase/i18n';

export default function UploadPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseUploadI18n();

    const variantPages = [
        {
            title: t.variants.image.title,
            path: '/components/upload/image',
            description: t.variants.image.description,
        },
        {
            title: t.variants.document.title,
            path: '/components/upload/document',
            description: t.variants.document.description,
        },
        {
            title: t.variants.csv.title,
            path: '/components/upload/csv',
            description: t.variants.csv.description,
        },
    ];

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={common.sections.variants}
                description={t.sections.variants.description}
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

// CSV parser - standalone, no Form needed
<UploadCSV
  name="import"
  label="Drop CSV here"
  normalizeKeys
  onDataLoaded={(result) => console.log(result.fields, result.data)}
/>`}
            />

            <Section
                title={t.sections.cloudStorage.title}
                description={t.sections.cloudStorage.description}
                preview={
                    <div className="alert alert-info text-sm w-full">
                        {t.labels.storageNotice}
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
