import React from 'react';
import { Form, UploadImage } from '@llmnative/react';
import PageLayout from '../../../showcase/page';
import Section from '../../../docs-kit/page/Section';
import PropDocsTable from '../../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../../docs-kit/playground';
import { useShowcaseUploadImageI18n } from '../../../showcase/i18n';

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

            <PropDocsTable props={propsConfig} title={t.propsDocs.title} />
        </PageLayout>
    );
}
