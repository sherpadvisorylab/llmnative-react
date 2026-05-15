import React from 'react';
import { Image } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

function makeLandscapeSvg(label: string, bg: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${bg}"/><circle cx="510" cy="88" r="72" fill="${accent}"/><path d="M0 260 130 155 250 235 370 115 520 215 640 150V360H0z" fill="#0f172a"/><rect x="40" y="38" width="200" height="14" rx="7" fill="#ffffff44"/><text x="40" y="76" font-family="Arial" font-size="30" font-weight="700" fill="white">${label}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makePortraitSvg(label: string, bg: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480"><rect width="360" height="480" fill="${bg}"/><circle cx="290" cy="70" r="55" fill="${accent}"/><path d="M0 360 90 280 170 340 260 220 360 300V480H0z" fill="#0f172a"/><text x="28" y="64" font-family="Arial" font-size="24" font-weight="700" fill="white">${label}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_LANDSCAPE = makeLandscapeSvg('react-firestrap', '#2563eb', '#facc15');
const SAMPLE_LANDSCAPE_ALT = makeLandscapeSvg('Campaign hero', '#059669', '#a7f3d0');
const SAMPLE_PORTRAIT = makePortraitSvg('Portrait', '#7c3aed', '#ddd6fe');

const IMAGE_PROPS: PropDef[] = [
    { name: 'src', type: 'string', required: true, group: 'Core', description: 'Image source URL or data URI', control: 'text' },
    { name: 'label', type: 'string', group: 'Core', description: 'Alt text shown to screen readers and on broken images', control: 'text' },
    { name: 'title', type: 'string', group: 'Core', description: 'Native title attribute — shows as browser tooltip on hover', control: 'text' },
    { name: 'placeholder', type: 'string', group: 'Core', description: 'Fallback source used when src is empty; defaults to the theme placeholder image', control: 'text' },
    { name: 'width', type: 'number', group: 'Dimensions', description: 'img width attribute in pixels', control: 'number', min: 40, max: 800 },
    { name: 'height', type: 'number', group: 'Dimensions', description: 'img height attribute in pixels', control: 'number', min: 40, max: 600 },
    { name: 'feedback', type: 'ReactNode', group: 'Slots', description: 'Caption or feedback text rendered below the image inside the wrapper', control: 'text' },
    { name: 'pre', type: 'ReactNode', group: 'Slots', description: 'Content rendered before the image inside the wrapper', control: 'text' },
    { name: 'post', type: 'ReactNode', group: 'Slots', description: 'Content rendered after the image, before feedback', control: 'text' },
    { name: 'className', type: 'string', group: 'Styling', description: 'CSS classes applied to the <img> element', control: 'text' },
    { name: 'wrapClass', type: 'string', group: 'Styling', description: 'CSS classes applied to the outer wrapper element', control: 'text' },
    { name: 'style', type: 'CSSProperties', group: 'Styling', description: 'Inline style object on the <img> element', control: 'json' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'md',
    layout: 'split',
    props: IMAGE_PROPS,
    defaultProps: {
        src: SAMPLE_LANDSCAPE,
        label: 'Sample landscape illustration',
        title: 'Hover tooltip',
        placeholder: '',
        width: 480,
        height: 270,
        feedback: 'Caption rendered below the image',
        pre: '',
        post: '',
        className: 'rounded-lg border object-cover',
        wrapClass: '',
        style: {},
    },
    render: (p) => (
        <Image
            src={p.src || undefined}
            label={p.label || undefined}
            title={p.title || undefined}
            placeholder={p.placeholder || undefined}
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
        <PageLayout
            title="Image"
            description="Themed image wrapper with placeholder fallback, pre/post content slots and optional feedback caption."
        >
            <Section
                title="Basic image"
                description="Pass any URL or data URI to src. className is applied to the img element so you can use Tailwind utilities for rounded corners, borders and max-width directly."
                preview={
                    <Image
                        src={SAMPLE_LANDSCAPE}
                        label="Landscape illustration"
                        className="rounded-xl border max-w-md w-full"
                    />
                }
                code={`import { Image } from 'react-firestrap';

<Image
    src={imageUrl}
    label="Landscape illustration"
    className="rounded-xl border max-w-md w-full"
/>`}
            />

            <Section
                title="Feedback caption"
                description="The feedback prop renders any ReactNode below the image inside the wrapper. Use it for captions, alt descriptions or status messages."
                preview={
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label="Hero banner"
                            feedback="Hero banner — 1280 × 720 px"
                            className="rounded-lg border object-cover max-w-xs w-full"
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE_ALT}
                            label="Campaign hero"
                            feedback={
                                <span className="flex items-center gap-1 text-success font-medium">
                                    ✓ Approved
                                </span>
                            }
                            className="rounded-lg border object-cover max-w-xs w-full"
                        />
                    </div>
                }
                code={`import { Image } from 'react-firestrap';

// plain text caption
<Image
    src={bannerUrl}
    label="Hero banner"
    feedback="Hero banner — 1280 × 720 px"
    className="rounded-lg border max-w-xs w-full"
/>

// ReactNode feedback
<Image
    src={campaignUrl}
    label="Campaign hero"
    feedback={<span className="text-success font-medium">✓ Approved</span>}
    className="rounded-lg border max-w-xs w-full"
/>`}
            />

            <Section
                title="Placeholder fallback"
                description="When src is empty or not yet resolved, Image renders the placeholder. The default is the theme placeholder image; pass your own via the placeholder prop."
                preview={
                    <div className="flex flex-wrap gap-6 items-start">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground mb-1">No src — theme default</span>
                            <Image
                                src=""
                                label="Missing image"
                                className="rounded-lg border w-48 h-28 object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground mb-1">Custom placeholder</span>
                            <Image
                                src=""
                                placeholder={makePortraitSvg('Placeholder', '#475569', '#cbd5e1')}
                                label="Custom placeholder"
                                className="rounded-lg border w-48 h-28 object-cover"
                            />
                        </div>
                    </div>
                }
                code={`import { Image } from 'react-firestrap';

// theme default placeholder
<Image src="" label="Missing image" className="rounded-lg border" />

// custom placeholder
<Image
    src=""
    placeholder={placeholderUrl}
    label="Custom placeholder"
    className="rounded-lg border"
/>`}
            />

            <Section
                title="Pre / post slots"
                description="Use pre and post to inject content inside the wrapper before or after the image element. Useful for overlaying badges, adding metadata rows or building card-like layouts."
                preview={
                    <div className="flex flex-wrap gap-6 items-start">
                        <Image
                            src={SAMPLE_PORTRAIT}
                            label="Portrait"
                            pre={
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">Portrait asset</span>
                                    <span className="badge badge-info">draft</span>
                                </div>
                            }
                            post={
                                <div className="flex gap-2 mt-2">
                                    <span className="badge badge-secondary">360 × 480</span>
                                    <span className="badge badge-light">SVG</span>
                                </div>
                            }
                            className="rounded-lg border object-cover w-40"
                            wrapClass="max-w-xs"
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE_ALT}
                            label="Campaign hero"
                            pre={<p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Campaign hero</p>}
                            feedback="Used in the spring launch email."
                            className="rounded-lg border object-cover max-w-xs w-full"
                        />
                    </div>
                }
                code={`import { Image } from 'react-firestrap';

<Image
    src={portraitUrl}
    label="Portrait asset"
    pre={
        <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">Portrait asset</span>
            <span className="badge badge-info">draft</span>
        </div>
    }
    post={
        <div className="flex gap-2 mt-2">
            <span className="badge badge-secondary">360 × 480</span>
            <span className="badge badge-light">SVG</span>
        </div>
    }
    className="rounded-lg border object-cover w-40"
    wrapClass="max-w-xs"
/>`}
            />

            <Section
                title="Fixed dimensions"
                description="Pass width and height to set the img attributes directly. Combining these with object-cover keeps the display size fixed while the image fills the frame without distortion."
                preview={
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Thumbnail"
                                width={120}
                                height={120}
                                className="rounded border object-cover"
                                feedback={<span className="text-xs text-muted-foreground">120 × 120</span>}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Card"
                                width={240}
                                height={135}
                                className="rounded-lg border object-cover"
                                feedback={<span className="text-xs text-muted-foreground">240 × 135</span>}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Preview"
                                width={360}
                                height={202}
                                className="rounded-xl border object-cover"
                                feedback={<span className="text-xs text-muted-foreground">360 × 202</span>}
                            />
                        </div>
                    </div>
                }
                code={`import { Image } from 'react-firestrap';

// thumbnail
<Image src={url} label="Thumbnail" width={120} height={120} className="rounded border object-cover" />

// card preview
<Image src={url} label="Card" width={240} height={135} className="rounded-lg border object-cover" />

// large preview
<Image src={url} label="Preview" width={360} height={202} className="rounded-xl border object-cover" />`}
            />

            <Section
                title="Style variants"
                description="className targets the img element; wrapClass targets the wrapper div. Combine them to control the outer layout separately from the image styling."
                preview={
                    <div className="flex flex-wrap gap-6 items-start">
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label="Circle avatar"
                            width={96}
                            height={96}
                            className="rounded-full border-4 border-primary object-cover"
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label="Grayscale"
                            width={200}
                            height={120}
                            className="rounded-lg border object-cover grayscale hover:grayscale-0 transition-all duration-300"
                            feedback={<span className="text-xs text-muted-foreground">Hover to colorize</span>}
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE_ALT}
                            label="Shadow"
                            width={200}
                            height={120}
                            className="rounded-xl object-cover shadow-xl"
                        />
                    </div>
                }
                code={`import { Image } from 'react-firestrap';

// circle avatar
<Image src={url} label="Avatar" width={96} height={96} className="rounded-full border-4 border-primary object-cover" />

// grayscale with hover colorize
<Image src={url} label="Grayscale" width={200} height={120} className="rounded-lg border object-cover grayscale hover:grayscale-0 transition-all" />

// drop shadow
<Image src={url} label="Shadow" width={200} height={120} className="rounded-xl object-cover shadow-xl" />`}
            />

            <PropsTable props={IMAGE_PROPS} />
        </PageLayout>
    );
}
