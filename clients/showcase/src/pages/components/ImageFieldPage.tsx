import React from 'react';
import { Form, ImageField } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseImageFieldI18n } from '../../showcase/i18n';

const SAMPLE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%232563eb"/%3E%3Ctext x="40" y="240" font-family="Arial" font-size="48" fill="white"%3EImageField%3C/text%3E%3C/svg%3E';

export default function ImageFieldPage() {
    const t = useShowcaseImageFieldI18n();

    const props = React.useMemo<PropDef[]>(() => [
        { name: 'name',            type: 'string',            required: true,  description: t.propsDocs.items.name.description,           control: 'text' },
        { name: 'label',           type: 'string',                             description: t.propsDocs.items.label.description,          control: 'text' },
        { name: 'required',        type: 'boolean',           default: 'false', description: t.propsDocs.items.required.description,      control: 'boolean' },
        { name: 'defaultValue',    type: 'ImageFieldValue',                    description: t.propsDocs.items.defaultValue.description,   control: 'json', rows: 6, shortcuts: [
            { label: 'with src',  value: { src: SAMPLE_IMAGE, alt: t.labels.sampleImageAlt },            help: 'Image with src and alt.' },
            { label: 'empty',     value: { src: '', alt: '' },                                            help: 'Empty starting value.' },
        ] },
        { name: 'value',           type: 'ImageFieldValue',                    description: t.propsDocs.items.value.description },
        { name: 'srcsetWidths',    type: 'number[]',          default: '[]',   description: t.propsDocs.items.srcsetWidths.description,   control: 'json' },
        { name: 'uploadPath',      type: 'string',                             description: t.propsDocs.items.uploadPath.description,     control: 'text' },
        { name: 'disabled',        type: 'boolean',           default: 'false', description: t.propsDocs.items.disabled.description,      control: 'boolean' },
        { name: 'feedback',        type: 'string',                             description: t.propsDocs.items.feedback.description,       control: 'text' },
        { name: 'before',          type: 'ReactNode',                          description: t.propsDocs.items.before.description,         control: 'text' },
        { name: 'after',           type: 'ReactNode',                          description: t.propsDocs.items.after.description,          control: 'text' },
        { name: 'onChange',        type: 'FieldOnChange',                      description: t.propsDocs.items.onChange.description },
        { name: 'className',       type: 'string',                             description: t.propsDocs.items.className.description,      control: 'text' },
        { name: 'wrapperClassName', type: 'string',                            description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props,
        showFormRecord: true,
        size: 'lg',
        defaultProps: {
            name:         'hero',
            label:        t.labels.heroImage,
            required:     false,
            defaultValue: { src: SAMPLE_IMAGE, alt: t.labels.sampleImageAlt },
            srcsetWidths: [],
            disabled:     false,
            feedback:     '',
            before:       '',
            after:        '',
            className:    '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <ImageField
                    name={p.name || 'hero'}
                    label={p.label || undefined}
                    required={p.required}
                    defaultValue={p.defaultValue}
                    srcsetWidths={Array.isArray(p.srcsetWidths) ? p.srcsetWidths : []}
                    uploadPath={p.uploadPath || undefined}
                    disabled={p.disabled}
                    feedback={p.feedback || undefined}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [props, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.basic.title}
                preview={(
                    <Form appearance="empty">
                        <ImageField
                            name="hero"
                            label={t.labels.heroImage}
                            defaultValue={{ src: SAMPLE_IMAGE, alt: t.labels.sampleImageAlt }}
                        />
                    </Form>
                )}
                code={`import { Form, ImageField } from '@llmnative/react';

<Form>
    <ImageField
        name="hero"
        label="Hero image"
        defaultValue={{ src: 'https://example.com/image.jpg', alt: 'Hero shot' }}
    />
</Form>`}
            />

            <Section
                title={t.sections.withVariants.title}
                preview={(
                    <Form appearance="empty">
                        <ImageField
                            name="hero"
                            label={t.labels.heroImage}
                            srcsetWidths={[400, 800]}
                            defaultValue={{ src: SAMPLE_IMAGE, alt: t.labels.sampleImageAlt }}
                        />
                    </Form>
                )}
                code={`import { Form, ImageField } from '@llmnative/react';

// srcsetWidths eagerly generates canvas-resized variants when src changes.
// With a StorageProvider + uploadPath, variants are uploaded and get durable URLs.
<Form>
    <ImageField
        name="hero"
        label="Hero image"
        srcsetWidths={[400, 800]}
        uploadPath="/content/images"
        defaultValue={{ src: 'https://example.com/image.jpg', alt: 'Hero shot' }}
    />
</Form>`}
            />

            <PropDocsTable props={props} title={t.propsDocs.title} />
        </PageLayout>
    );
}
