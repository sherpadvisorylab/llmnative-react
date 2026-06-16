import React from 'react';
import { Form, ImageUrl, PromptMode } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseImageUrlI18n } from '../../showcase/i18n';

const SAMPLE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" fill="%232563eb"/%3E%3Ctext x="28" y="98" font-family="Arial" font-size="26" fill="white"%3EImageUrl%3C/text%3E%3C/svg%3E';

export default function ImageUrlPage() {
    const t = useShowcaseImageUrlI18n();

    const imageUrlProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'defaultValue', type: 'object', description: t.propsDocs.items.defaultValue.description, control: 'json', rows: 8, shortcuts: [
            { label: 'hero', value: { url: SAMPLE_IMAGE, alt: { value: t.labels.blueHeroIllustration }, width: 320, height: 180 }, help: 'Hero image example.' },
            { label: 'square', value: { url: SAMPLE_IMAGE, alt: { value: t.labels.squareThumbnail }, width: 240, height: 240 }, help: 'Square image example.' },
            { label: 'empty', value: { url: '', alt: { value: '' }, width: 320, height: 180 }, help: 'Empty starting object.' },
        ] },
        { name: 'value', type: 'FieldValue', description: t.propsDocs.items.value.description },
        { name: 'inheritWrapperClassName', type: 'boolean', default: 'true', description: t.propsDocs.items.inheritWrapperClassName.description, control: 'boolean' },
        { name: 'mode', type: 'PromptMode', description: t.propsDocs.items.mode.description, control: 'select', options: ['edit', 'run'] },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: imageUrlProps,
        showFormRecord: true,
        size: 'lg',
        defaultProps: {
            name: t.labels.hero,
            label: t.labels.heroImage,
            required: false,
            defaultValue: {
                url: SAMPLE_IMAGE,
                alt: { value: t.labels.blueHeroIllustration },
                width: 320,
                height: 180,
            },
            mode: PromptMode.EDIT,
            before: '',
            after: '',
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" onChange={onValuesChange}>
                <ImageUrl
                    name={p.name || t.labels.hero}
                    label={p.label || undefined}
                    required={p.required}
                    defaultValue={p.defaultValue}
                    mode={p.mode}
                    before={p.before || undefined}
                    after={p.after || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [imageUrlProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.imageMetadata.title}
                preview={(
                    <Form appearance="empty">
                        <ImageUrl name={t.labels.hero} label={t.labels.heroImage} defaultValue={{ url: SAMPLE_IMAGE, width: 320, height: 180 }} />
                    </Form>
                )}
                code={`import { Form, ImageUrl } from '@llmnative/react';

<Form>
    <ImageUrl name="hero" label="Hero image" />
</Form>`}
            />

            <PropDocsTable props={imageUrlProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
