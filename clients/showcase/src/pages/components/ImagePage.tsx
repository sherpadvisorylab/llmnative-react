import React from 'react';
import { Image } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const SAMPLE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"%3E%3Crect width="640" height="360" fill="%232563eb"/%3E%3Ccircle cx="500" cy="90" r="70" fill="%23facc15"/%3E%3Cpath d="M0 260 140 150 250 235 360 120 640 310v50H0z" fill="%230f172a"/%3E%3Ctext x="42" y="70" font-family="Arial" font-size="34" fill="white"%3Ereact-firestrap%3C/text%3E%3C/svg%3E';

const IMAGE_PROPS: PropDef[] = [
    { name: 'src', type: 'string', required: true, description: 'Image source URL or data URI', control: 'text' },
    { name: 'placeholder', type: 'string', description: 'Reserved placeholder source prop' },
    { name: 'label', type: 'string', description: 'Alt text fallback', control: 'text' },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
    { name: 'feedback', type: 'ReactNode', description: 'Feedback rendered under the image', control: 'text' },
    { name: 'style', type: 'CSSProperties', description: 'Inline style object', control: 'json' },
    { name: 'width', type: 'number', description: 'Image width attribute', control: 'number', min: 40, max: 640 },
    { name: 'height', type: 'number', description: 'Image height attribute', control: 'number', min: 40, max: 360 },
    { name: 'pre', type: 'ReactNode', description: 'Content before the image', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after the image', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on img', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: IMAGE_PROPS,
    defaultProps: {
        src: SAMPLE_IMAGE,
        label: 'Sample dashboard illustration',
        title: 'Sample image',
        feedback: '',
        style: {},
        width: 320,
        height: 180,
        pre: '',
        post: '',
        className: 'rounded-md border object-cover',
        wrapClass: '',
    },
    render: (p) => (
        <Image
            src={p.src}
            label={p.label || undefined}
            title={p.title || undefined}
            feedback={p.feedback || undefined}
            style={p.style && typeof p.style === 'object' ? p.style : undefined}
            width={p.width || undefined}
            height={p.height || undefined}
            pre={p.pre || undefined}
            post={p.post || undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
        />
    ),
};

export default function ImagePage() {
    usePlayground(PLAYGROUND, 'Image');

    return (
        <PageLayout title="Image" description="Themed image wrapper with placeholder fallback, pre/post slots and feedback text.">
            <Section
                title="Image with caption feedback"
                preview={<Image src={SAMPLE_IMAGE} label="Preview" feedback="Rendered with Image component" className="rounded-md border max-w-sm" />}
                code={`import { Image } from 'react-firestrap';

<Image
    src={imageUrl}
    label="Preview"
    feedback="Rendered with Image component"
    className="rounded-md border max-w-sm"
/>`}
            />

            <PropsTable props={IMAGE_PROPS} />
        </PageLayout>
    );
}
