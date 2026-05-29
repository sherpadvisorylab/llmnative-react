import React from 'react';
import { Form, ImageUrl, PromptMode } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

const SAMPLE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" fill="%232563eb"/%3E%3Ctext x="28" y="98" font-family="Arial" font-size="26" fill="white"%3EImageUrl%3C/text%3E%3C/svg%3E';

const IMAGE_URL_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Object field name in the Form record', control: 'text' },
    { name: 'label', type: 'string', description: 'Label for the URL field', control: 'text' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks nested fields as required', control: 'boolean' },
    { name: 'defaultValue', type: 'object', description: 'Initial nested image object', control: 'json', rows: 8, shortcuts: [
        { label: 'hero', value: { url: SAMPLE_IMAGE, alt: { value: 'Blue hero illustration' }, width: 320, height: 180 }, help: 'Hero image example.' },
        { label: 'square', value: { url: SAMPLE_IMAGE, alt: { value: 'Square thumbnail' }, width: 240, height: 240 }, help: 'Square image example.' },
        { label: 'empty', value: { url: '', alt: { value: '' }, width: 320, height: 180 }, help: 'Empty starting object.' },
    ] },
    { name: 'mode', type: 'PromptMode', description: 'Prompt mode used for alt text', control: 'select', options: ['editor', 'live'] },
    { name: 'pre', type: 'ReactNode', description: 'Content before the field group', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the field group', control: 'text' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context' },
    { name: 'className', type: 'string', description: 'CSS classes on URL input', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: IMAGE_URL_PROPS,
    showFormRecord: true,
    size: 'lg',
    defaultProps: {
        name: 'hero',
        label: 'Hero image',
        required: false,
        defaultValue: {
            url: SAMPLE_IMAGE,
            alt: { value: 'Blue hero illustration' },
            width: 320,
            height: 180,
        },
        mode: PromptMode.EDIT,
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" onChange={onValuesChange}>
            <ImageUrl
                name={p.name || 'hero'}
                label={p.label || undefined}
                required={p.required}
                defaultValue={p.defaultValue}
                mode={p.mode}
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
            />
        </Form>
    ),
};

export default function ImageUrlPage() {
    usePlayground(PLAYGROUND, 'ImageUrl');

    return (
        <PageLayout title="ImageUrl" description="Compound form field for image URL, alt prompt metadata, width, height and live preview.">
            <Section
                title="Image metadata"
                preview={
                    <Form aspect="empty">
                        <ImageUrl name="hero" label="Hero image" defaultValue={{ url: SAMPLE_IMAGE, width: 320, height: 180 }} />
                    </Form>
                }
                code={`import { Form, ImageUrl } from '@llmnative/react';

<Form>
    <ImageUrl name="hero" label="Hero image" />
</Form>`}
            />

            <PropDocsTable props={IMAGE_URL_PROPS} />
        </PageLayout>
    );
}
