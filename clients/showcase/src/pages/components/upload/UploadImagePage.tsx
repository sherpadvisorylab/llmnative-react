import React from 'react';
import { Form, UploadImage, StorageProvider } from '@llmnative/react';
import type { StorageProviderAdapter, FileProps } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';
import { useShowcaseUploadImageI18n } from '../../../showcase/i18n';

function dataUriToBlobUrl(dataUri: string): string {
    const [header, base64] = dataUri.split(',');
    const mimeType = header.split(':')[1]?.split(';')[0] ?? 'application/octet-stream';
    const bytes = atob(base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return URL.createObjectURL(new Blob([arr], { type: mimeType }));
}

const demoStorage: StorageProviderAdapter = {
    upload: async (file: string | File | Blob) => {
        if (typeof file === 'string') return dataUriToBlobUrl(file);
        return URL.createObjectURL(file as Blob);
    },
    createUpload: (_file: string | File | Blob, _path: string) => ({
        url: Promise.resolve(undefined),
        pause: () => {},
        resume: () => {},
        cancel: () => {},
    }),
    rename: async () => false,
    move: async () => 0,
    getURL: async () => undefined,
    getFileInfo: async () => undefined,
    download: async () => undefined,
    delete: async () => 0,
    list: async () => [],
};

interface SrcsetVariant { src: string; width: number; fileName: string; }

function SrcsetDemo({ label }: { label: string }) {
    const [variants, setVariants] = React.useState<SrcsetVariant[]>([]);

    const handleChange = React.useCallback(({ value }: { value: unknown }) => {
        const files = value as FileProps[] | undefined;
        if (!files?.length) { setVariants([]); return; }
        const file = files[0];
        if (!file.srcset) return;
        const baseName = file.fileName.replace(/\.[^/.]+$/, '');
        const ext = file.fileName.split('.').pop() ?? 'jpg';
        const parsed: SrcsetVariant[] = file.srcset.split(',').map((s: string) => s.trim()).map((part: string) => {
            const [src, widthStr] = part.split(' ');
            const width = parseInt(widthStr, 10);
            return { src, width, fileName: `${baseName}_${width}w.${ext}` };
        });
        setVariants(parsed);
    }, []);

    return (
        <div className="w-full max-w-xl space-y-4">
            <StorageProvider registry={{ demo: demoStorage }} defaultKey="demo">
                <Form appearance="empty">
                    <UploadImage
                        name="hero"
                        label={label}
                        uploadPath="/uploads/hero"
                        generateSrcset
                        onChange={handleChange}
                        previewHeight={112}
                        previewWidth={112}
                    />
                </Form>
            </StorageProvider>

            {variants.length > 0 && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Generated variants — {variants.length} files uploaded to <code className="font-mono">/uploads/hero/</code>
                    </p>
                    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${variants.length}, 1fr)` }}>
                        {variants.map(v => (
                            <div key={v.width} className="space-y-1.5">
                                <img
                                    src={v.src}
                                    alt={v.fileName}
                                    className="w-full rounded-md bg-muted/40 object-cover aspect-video"
                                />
                                <p className="text-xs font-mono text-foreground break-all">{v.fileName}</p>
                                <p className="text-xs text-muted-foreground">{v.width}px wide</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UploadImagePage() {
    const t = useShowcaseUploadImageI18n();

    const propsConfig = React.useMemo<PropDef[]>(() => ([
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'multiple', type: 'boolean', default: t.propsDocs.items.multiple.default, description: t.propsDocs.items.multiple.description, control: 'boolean' },
        { name: 'editable', type: 'boolean', default: t.propsDocs.items.editable.default, description: t.propsDocs.items.editable.description, control: 'boolean' },
        { name: 'previewWidth', type: 'number', default: t.propsDocs.items.previewWidth.default, description: t.propsDocs.items.previewWidth.description, control: 'number', min: 48, max: 256, step: 8 },
        { name: 'previewHeight', type: 'number', default: t.propsDocs.items.previewHeight.default, description: t.propsDocs.items.previewHeight.description, control: 'number', min: 48, max: 256, step: 8 },
        { name: 'accept', type: 'string', default: t.propsDocs.items.accept.default, description: t.propsDocs.items.accept.description, control: 'text' },
        { name: 'max', type: 'number', default: t.propsDocs.items.max.default, description: t.propsDocs.items.max.description, control: 'number', min: 1, max: 20 },
        { name: 'required', type: 'boolean', default: t.propsDocs.items.required.default, description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'uploadPath', type: 'string', description: t.propsDocs.items.uploadPath.description, control: 'text' },
        { name: 'generateSrcset', type: 'boolean', default: t.propsDocs.items.generateSrcset.default, description: t.propsDocs.items.generateSrcset.description, control: 'boolean' },
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
            editable: true,
            previewWidth: 112,
            previewHeight: 112,
            accept: 'image/*',
            max: 10,
            required: false,
            uploadPath: '/uploads/demo',
            generateSrcset: false,
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <StorageProvider registry={{ demo: demoStorage }} defaultKey="demo">
                <Form appearance="empty" onChange={onValuesChange}>
                    <UploadImage
                        name="images"
                        label={p.label || undefined}
                        multiple={p.multiple}
                        editable={p.editable}
                        previewWidth={Number(p.previewWidth)}
                        previewHeight={Number(p.previewHeight)}
                        accept={p.accept || 'image/*'}
                        max={Number(p.max)}
                        required={p.required}
                        uploadPath={p.uploadPath || undefined}
                        generateSrcset={p.generateSrcset}
                        className={p.className || undefined}
                        wrapperClassName={p.wrapperClassName || undefined}
                    />
                </Form>
            </StorageProvider>
        ),
    }), [propsConfig, t.playground.defaultLabel]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.singleImage.title}
                description={t.sections.singleImage.description}
                preview={
                    <div className="w-full max-w-sm">
                        <Form appearance="empty">
                            <UploadImage
                                name="avatar"
                                label={t.labels.avatar}
                                previewHeight={112}
                                previewWidth={112}
                            />
                        </Form>
                    </div>
                }
                code={`import { Form, UploadImage } from '@llmnative/react';

<Form appearance="empty">
  <UploadImage
    name="avatar"
    label="Avatar"
    previewHeight={112}
    previewWidth={112}
  />
</Form>`}
            />

            <Section
                title={t.sections.multipleImages.title}
                description={t.sections.multipleImages.description}
                preview={
                    <div className="w-full max-w-xl">
                        <Form appearance="empty">
                            <UploadImage
                                name="gallery"
                                label={t.labels.galleryMax}
                                multiple
                                max={6}
                                previewHeight={88}
                                previewWidth={88}
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="empty">
  <UploadImage
    name="gallery"
    label="Gallery"
    multiple
    max={6}
    previewHeight={88}
    previewWidth={88}
  />
</Form>`}
            />

            <Section
                title={t.sections.editableCrop.title}
                description={t.sections.editableCrop.description}
                preview={
                    <div className="w-full max-w-xl">
                        <Form appearance="empty">
                            <UploadImage
                                name="cover"
                                label={t.labels.coverPhotoEditable}
                                multiple
                                editable
                                previewHeight={112}
                                previewWidth={112}
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="empty">
  <UploadImage
    name="cover"
    label="Cover photo"
    multiple
    editable
    previewHeight={112}
    previewWidth={112}
  />
</Form>`}
            />

            <Section
                title={t.sections.acceptFilter.title}
                description={t.sections.acceptFilter.description}
                preview={
                    <div className="w-full max-w-sm">
                        <Form appearance="empty">
                            <UploadImage
                                name="png_only"
                                label={t.labels.pngOnly}
                                accept="image/png"
                                previewHeight={88}
                                previewWidth={88}
                            />
                        </Form>
                    </div>
                }
                code={`<Form appearance="empty">
  <UploadImage
    name="logo"
    label="Logo (PNG only)"
    accept="image/png"
    previewHeight={88}
    previewWidth={88}
  />
</Form>`}
            />

            <Section
                title={t.sections.responsiveSrcset.title}
                description={t.sections.responsiveSrcset.description}
                preview={
                    <SrcsetDemo label={t.labels.heroImage} />
                }
                code={`import { Form, UploadImage, StorageProvider } from '@llmnative/react';
import { FirebaseStorageProvider } from '@llmnative/react';

const storage = new FirebaseStorageProvider({ bucket: 'my-app.appspot.com' });

<StorageProvider registry={{ cloud: storage }} defaultKey="cloud">
  <Form appearance="empty">
    <UploadImage
      name="hero"
      label="Hero image"
      uploadPath="/uploads/hero"
      generateSrcset
      previewHeight={112}
      previewWidth={112}
    />
  </Form>
</StorageProvider>

// Form record entry after upload:
// {
//   fileName: 'photo.jpg',
//   url: 'https://cdn.example.com/uploads/hero/photo.jpg',
//   srcset: 'https://cdn.../photo_400w.jpg 400w, https://cdn.../photo_800w.jpg 800w',
//   sizes: '(max-width: 640px) 100vw, 800px',
// }`}
            />

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
