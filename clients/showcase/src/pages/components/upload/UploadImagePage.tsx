import React from 'react';
import { Form, UploadImage } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';

const PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name bound to the Form record' },
    { name: 'label', type: 'string', description: 'Label rendered above the upload area', control: 'text' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow selecting more than one image at a time', control: 'boolean' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Show crop/edit button on hover; opens the image editor', control: 'boolean' },
    { name: 'previewWidth', type: 'number', default: '100', description: 'Thumbnail width in pixels', control: 'number', min: 48, max: 256, step: 8 },
    { name: 'previewHeight', type: 'number', default: '100', description: 'Thumbnail height in pixels', control: 'number', min: 48, max: 256, step: 8 },
    { name: 'accept', type: 'string', default: '"image/*"', description: 'Accepted MIME types (e.g. "image/png,image/jpeg")', control: 'text' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum number of files allowed', control: 'number', min: 1, max: 20 },
    { name: 'required', type: 'boolean', default: 'false', description: 'Mark field as required; blocks form submit when empty', control: 'boolean' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Called on every file list change with the updated value and form context' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the image grid, inside the outer wrapper' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the image grid, inside the outer wrapper' },
    { name: 'className', type: 'string', description: 'CSS classes on the inner container', control: 'text' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    showFormRecord: true,
    props: PROPS,
    defaultProps: {
        label: 'Gallery',
        multiple: true,
        editable: true,
        previewWidth: 112,
        previewHeight: 112,
        accept: 'image/*',
        max: 10,
        required: false,
        className: '',
        wrapperClassName: '',
    },
    render: (p, onValuesChange) => (
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
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
        </Form>
    ),
};

export default function UploadImagePage() {
    usePlayground(PLAYGROUND, 'UploadImage');

    return (
        <PageLayout
            title="UploadImage"
            description="Image upload field with inline thumbnail preview, hover overlay actions and optional multi-image support. Stores file descriptors in the Form record."
        >
            <Section
                title="Single image"
                description="Default usage: one image at a time with a fixed-size thumbnail. After upload, use the hover overlay actions to preview or remove the image."
                preview={
                    <div className="w-full max-w-sm">
                        <Form appearance="empty">
                            <UploadImage
                                name="avatar"
                                label="Avatar"
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
                title="Multiple images"
                description="Pass multiple to allow selecting several images. Each file renders as a separate thumbnail. Upload stops once the max limit is reached."
                preview={
                    <div className="w-full max-w-xl">
                        <Form appearance="empty">
                            <UploadImage
                                name="gallery"
                                label="Gallery (max 6)"
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
                title="Editable (crop)"
                description="Add editable to show a pencil icon on hover. Clicking it opens the image editor with crop and scale tools, and the generated variants are saved on that file entry in the Form record."
                preview={
                    <div className="w-full max-w-xl">
                        <Form appearance="empty">
                            <UploadImage
                                name="cover"
                                label="Cover photo (editable)"
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
                title="Accept filter"
                description="Restrict the file picker to specific MIME types. The browser enforces the filter in the native file chooser."
                preview={
                    <div className="w-full max-w-sm">
                        <Form appearance="empty">
                            <UploadImage
                                name="png_only"
                                label="PNG only"
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

            <PropDocsTable props={PROPS} />
        </PageLayout>
    );
}
