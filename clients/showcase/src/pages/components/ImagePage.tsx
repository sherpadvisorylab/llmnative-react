import React, { useState } from 'react';
import { Image, Modal, Icon, useImage } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseImageI18n } from '../../showcase/i18n';

function makeLandscapeSvg(label: string, bg: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${bg}"/><circle cx="510" cy="88" r="72" fill="${accent}"/><path d="M0 260 130 155 250 235 370 115 520 215 640 150V360H0z" fill="#0f172a"/><rect x="40" y="38" width="200" height="14" rx="7" fill="#ffffff44"/><text x="40" y="76" font-family="Arial" font-size="30" font-weight="700" fill="white">${label}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makePortraitSvg(label: string, bg: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480"><rect width="360" height="480" fill="${bg}"/><circle cx="290" cy="70" r="55" fill="${accent}"/><path d="M0 360 90 280 170 340 260 220 360 300V480H0z" fill="#0f172a"/><text x="28" y="64" font-family="Arial" font-size="24" font-weight="700" fill="white">${label}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_LANDSCAPE = makeLandscapeSvg('@llmnative/react', '#2563eb', '#facc15');
const SAMPLE_LANDSCAPE_ALT = makeLandscapeSvg('Campaign hero', '#059669', '#a7f3d0');
const SAMPLE_PORTRAIT = makePortraitSvg('Portrait', '#7c3aed', '#ddd6fe');

const SRC_PRESETS: Record<string, string> = {
    landscape: SAMPLE_LANDSCAPE,
    'landscape-alt': SAMPLE_LANDSCAPE_ALT,
    portrait: SAMPLE_PORTRAIT,
    empty: '',
};

const SRC_FILENAMES: Record<string, string> = {
    landscape: 'landscape.jpg',
    'landscape-alt': 'landscape-alt.jpg',
    portrait: 'portrait.jpg',
    empty: 'image.jpg',
};

const SRCSET_WIDTHS = [400, 800, 1600];

type ExportMode = 'json' | 'html';
type ImageI18n = ReturnType<typeof useShowcaseImageI18n>;

function ImageExportPanel({
    t,
    ...p
}: Record<string, any> & { t: ImageI18n }) {
    const PREVIEW_WIDTH = 320;
    const w = Number(p.width) || PREVIEW_WIDTH;
    const h = Number(p.height) || PREVIEW_WIDTH;
    const previewHeight = Math.round(PREVIEW_WIDTH * (h / w));

    const [modal, setModal] = useState<{ open: boolean; mode: ExportMode; content: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const resolvedSrc = SRC_PRESETS[p.src] ?? p.src ?? undefined;
    const exportFilename = SRC_FILENAMES[p.src] ?? (p.src ? `${p.src}.jpg` : 'image.jpg');

    const sizesMap: Record<string, string> = {
        [t.playground.presets.heroFullWidth]: '100vw',
        [t.playground.presets.articleTextColumn]: '(max-width: 900px) 100vw, 900px',
        [t.playground.presets.cardTwoColumns]: '(max-width: 640px) 100vw, 50vw',
        [t.playground.presets.cardThreeColumns]: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
        [t.playground.presets.thumbnailSmall]: '(max-width: 640px) 50vw, 200px',
    };
    const sizesAttr = sizesMap[p.sizesPreset] ?? sizesMap[t.playground.presets.cardTwoColumns];

    const img = useImage({
        src: exportFilename,
        alt: p.label || t.labels.image,
        title: p.title || undefined,
        width: Number(p.width) || undefined,
        height: Number(p.height) || undefined,
        fit: (p.fit || undefined) as any,
        position: (p.position || undefined) as any,
        loading: 'lazy',
    });

    const srcsetCfg = p.responsive
        ? p.srcsetMode === 'density'
            ? { mode: 'density' as const, densities: [1, 2, 3] }
            : { mode: 'width' as const, widths: SRCSET_WIDTHS, sizes: sizesAttr }
        : undefined;

    const openExport = (mode: ExportMode) => {
        const content = mode === 'json' ? img.toJson(srcsetCfg) : img.toHtml(srcsetCfg);
        setModal({ open: true, mode, content });
        setCopied(false);
    };

    const handleCopy = () => {
        if (!modal) return;
        navigator.clipboard.writeText(modal.content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <Image
                src={resolvedSrc}
                label={p.label || undefined}
                title={p.title || undefined}
                placeholder={p.placeholder || undefined}
                fit={(p.fit || undefined) as any}
                position={(p.position || undefined) as any}
                feedback={p.feedback || undefined}
                width={PREVIEW_WIDTH}
                height={previewHeight}
                srcset={p.srcset || undefined}
                sizes={p.sizes || undefined}
                before={p.before || undefined}
                after={p.after || undefined}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
            {p.responsive && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    {p.srcsetMode === 'density'
                        ? <>{t.labels.srcsetDensityActive} <code className="font-mono">1x / 2x / 3x</code> (<code className="font-mono">@2x</code> / <code className="font-mono">@3x</code>)</>
                        : <>{t.labels.srcsetWidthActive} <code className="font-mono">400w / 800w / 1600w</code></>
                    }
                </p>
            )}
            <div className="mt-3 flex justify-center gap-2">
                <button className="btn btn-outline-secondary h-8 px-3 text-xs flex items-center gap-1.5" onClick={() => openExport('json')}>
                    <Icon name="code" size={13} /> {t.playground.export.jsonButton}
                </button>
                <button className="btn btn-outline-primary h-8 px-3 text-xs flex items-center gap-1.5" onClick={() => openExport('html')}>
                    <Icon name="file" size={13} /> {t.playground.export.htmlButton}
                </button>
            </div>

            {modal?.open && (
                <Modal
                    title={modal.mode === 'json' ? t.labels.imageParamsJson : t.labels.imageTagHtml}
                    size="md"
                    position="center"
                    onClose={() => setModal(null)}
                    footer={
                        <div className="flex w-full items-center justify-between">
                            <span className="font-mono text-xs text-muted-foreground">
                                {modal.mode === 'json' ? t.labels.imageParamsJsonShort : t.labels.imageTagHtmlShort}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-outline-secondary h-8 px-3 text-xs flex items-center gap-1.5"
                                    onClick={handleCopy}
                                >
                                    <Icon name={copied ? 'check' : 'copy'} size={13} />
                                    {copied ? t.labels.copied : t.labels.copy}
                                </button>
                                <button className="btn btn-outline-secondary h-8 px-3 text-xs" onClick={() => setModal(null)}>
                                    {t.labels.close}
                                </button>
                            </div>
                        </div>
                    }
                >
                    <textarea
                        readOnly
                        value={modal.content}
                        className="w-full resize-none rounded-md border bg-muted p-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={modal.mode === 'json' ? 18 : 12}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                </Modal>
            )}
        </>
    );
}

export default function ImagePage() {
    const t = useShowcaseImageI18n();

    const imageProps = React.useMemo<PropDef[]>(() => [
        { name: 'src', type: 'string', required: true, group: 'Core', description: t.propsDocs.items.src.description, control: 'select', options: ['landscape', 'landscape-alt', 'portrait', 'empty'] },
        { name: 'label', type: 'string', group: 'Core', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'title', type: 'string', group: 'Core', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'placeholder', type: 'string', group: 'Core', description: t.propsDocs.items.placeholder.description, control: 'text', help: t.propsDocs.items.placeholder.help },
        { name: 'width', type: 'number', group: 'Dimensions', description: t.propsDocs.items.width.description, control: 'number', min: 40, max: 640 },
        { name: 'height', type: 'number', group: 'Dimensions', description: t.propsDocs.items.height.description, control: 'number', min: 40, max: 600 },
        { name: 'fit', type: '"cover" | "contain" | "fill" | "scale-down" | "none"', group: 'Dimensions', description: t.propsDocs.items.fit.description, control: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'] },
        { name: 'position', type: 'string', group: 'Dimensions', description: t.propsDocs.items.position.description, control: 'select', options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'] },
        { name: 'feedback', type: 'ReactNode', group: 'Slots', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'before', type: 'ReactNode', group: 'Slots', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', group: 'Slots', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'srcset', type: 'string', group: 'Responsive', description: t.propsDocs.items.srcset.description, control: 'text' },
        { name: 'sizes', type: 'string', group: 'Responsive', description: t.propsDocs.items.sizes.description, control: 'text' },
        { name: 'className', type: 'string', group: 'Styling', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', group: 'Styling', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playgroundExtraProps = React.useMemo<PropDef[]>(() => [
        { name: 'responsive', type: 'boolean', group: 'Export demo', description: t.playground.props.responsive.description, control: 'boolean' },
        { name: 'srcsetMode', type: '"width" | "density"', group: 'Export demo', description: t.playground.props.srcsetMode.description, control: 'select', options: ['width', 'density'], hidden: (p) => !p.responsive },
        { name: 'sizesPreset', type: 'string', group: 'Export demo', description: t.playground.props.sizesPreset.description, control: 'select', options: [
            t.playground.presets.heroFullWidth,
            t.playground.presets.articleTextColumn,
            t.playground.presets.cardTwoColumns,
            t.playground.presets.cardThreeColumns,
            t.playground.presets.thumbnailSmall,
        ], hidden: (p) => !p.responsive || p.srcsetMode === 'density' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'xl',
        layout: 'split',
        props: [...imageProps, ...playgroundExtraProps],
        defaultProps: {
            src: 'landscape',
            label: t.labels.sampleLandscapeIllustration,
            title: t.labels.hoverTooltip,
            placeholder: '',
            width: 320,
            height: 320,
            fit: 'cover',
            position: 'center',
            feedback: t.labels.captionRenderedBelow,
            before: '',
            after: '',
            responsive: false,
            srcsetMode: 'width',
            sizesPreset: t.playground.presets.cardTwoColumns,
            className: 'rounded-lg border',
            wrapperClassName: '',
        },
        render: (p) => <ImageExportPanel {...p} t={t} />,
    }), [imageProps, playgroundExtraProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.basic.title}
                description={t.sections.basic.description}
                preview={(
                    <Image
                        src={SAMPLE_LANDSCAPE}
                        label={t.labels.landscapeIllustration}
                        className="rounded-xl border max-w-md w-full"
                    />
                )}
                code={`import { Image } from '@llmnative/react';

<Image
    src={imageSrc}
    label="Landscape illustration"
    className="rounded-xl border max-w-md w-full"
/>`}
            />

            <Section
                title={t.sections.feedbackCaption.title}
                description={t.sections.feedbackCaption.description}
                preview={(
                    <div className="flex flex-col items-start gap-6 sm:flex-row">
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label={t.labels.heroBanner}
                            feedback="Hero banner - 1280 x 720 px"
                            className="rounded-lg border object-cover max-w-xs w-full"
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE_ALT}
                            label={t.labels.campaignHero}
                            feedback={<span className="flex items-center gap-1 font-medium text-success">✓ {t.labels.approved}</span>}
                            className="rounded-lg border object-cover max-w-xs w-full"
                        />
                    </div>
                )}
                code={`import { Image } from '@llmnative/react';

// plain text caption
<Image
    src={bannerUrl}
    label="Hero banner"
    feedback="Hero banner - 1280 x 720 px"
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
                title={t.sections.placeholderFallback.title}
                description={t.sections.placeholderFallback.description}
                preview={(
                    <div className="flex flex-wrap items-start gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="mb-1 text-xs text-muted-foreground">{t.labels.noSrcThemeDefault}</span>
                            <Image
                                src=""
                                label={t.labels.missingImage}
                                className="h-28 w-48 rounded-lg border object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="mb-1 text-xs text-muted-foreground">{t.labels.customPlaceholder}</span>
                            <Image
                                src=""
                                placeholder={makePortraitSvg('Placeholder', '#475569', '#cbd5e1')}
                                label={t.labels.customPlaceholder}
                                className="h-28 w-48 rounded-lg border object-cover"
                            />
                        </div>
                    </div>
                )}
                code={`import { Image } from '@llmnative/react';

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
                title={t.sections.beforeAfter.title}
                description={t.sections.beforeAfter.description}
                preview={(
                    <div className="flex w-full flex-col gap-6">
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label={t.labels.heroBanner}
                            before={(
                                <div className="flex flex-col items-end gap-1 text-right">
                                    <span className="whitespace-nowrap text-sm font-semibold">{t.labels.heroBannerShort}</span>
                                    <span className="badge badge-info">{t.labels.ready}</span>
                                </div>
                            )}
                            after={(
                                <div className="flex flex-col gap-1">
                                    <span className="badge badge-secondary whitespace-nowrap">1280 x 720</span>
                                    <span className="badge badge-light">SVG</span>
                                </div>
                            )}
                            feedback={t.labels.usedInSpringLaunchEmail}
                            className="w-64 rounded-lg border object-cover"
                        />
                        <Image
                            src={SAMPLE_PORTRAIT}
                            label={t.labels.portrait}
                            before={<span className="whitespace-nowrap text-xs text-muted-foreground">2 / 8</span>}
                            after={(
                                <div className="flex items-start flex-col gap-1">
                                    <span className="badge badge-secondary whitespace-nowrap">360 x 480</span>
                                    <span className="badge badge-light">{t.labels.portrait}</span>
                                </div>
                            )}
                            className="w-32 rounded-lg border object-cover"
                        />
                    </div>
                )}
                code={`import { Image } from '@llmnative/react';

// before = left, after = right, both vertically centred
<Image
    src={bannerUrl}
    label="Hero banner"
    before={
        <div className="flex flex-col items-end gap-1 text-right">
            <span className="font-semibold text-sm">Hero banner</span>
            <span className="badge badge-info">ready</span>
        </div>
    }
    after={
        <div className="flex flex-col gap-1">
            <span className="badge badge-secondary">1280 x 720</span>
            <span className="badge badge-light">SVG</span>
        </div>
    }
    feedback="Used in the spring launch email."
    className="rounded-lg border object-cover w-64"
/>`}
            />

            <Section
                title={t.sections.fitModes.title}
                description={t.sections.fitModes.description}
                preview={(
                    <div className="flex flex-wrap items-start gap-6">
                        {(['cover', 'contain', 'fill', 'scale-down', 'none'] as const).map((mode) => (
                            <div key={mode} className="flex flex-col items-center gap-2">
                                <Image
                                    src={SAMPLE_LANDSCAPE}
                                    label={mode}
                                    width={160}
                                    height={160}
                                    fit={mode}
                                    className="rounded-lg border bg-muted"
                                />
                                <span className="font-mono text-xs text-muted-foreground">{mode}</span>
                            </div>
                        ))}
                    </div>
                )}
                code={`import { Image } from '@llmnative/react';

// cover  - crops to fill the box, no empty space (default for thumbnails)
<Image src={url} width={160} height={160} fit="cover" className="rounded-lg border" />

// contain - letterboxes inside the box, full image always visible
<Image src={url} width={160} height={160} fit="contain" className="rounded-lg border bg-muted" />

// fill - stretches to fill exactly, distorts aspect ratio
<Image src={url} width={160} height={160} fit="fill" className="rounded-lg border" />

// scale-down - like contain but never upscales beyond natural size
<Image src={url} width={160} height={160} fit="scale-down" className="rounded-lg border bg-muted" />

// none - renders at natural image size, ignores width/height box
<Image src={url} width={160} height={160} fit="none" className="rounded-lg border" />`}
            />

            <Section
                title={t.sections.fixedDimensions.title}
                description={t.sections.fixedDimensions.description}
                preview={(
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label={t.labels.thumbnail}
                                width={120}
                                height={120}
                                fit="cover"
                                className="rounded border"
                                feedback={<span className="text-xs text-muted-foreground">120 x 120</span>}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label={t.labels.card}
                                width={240}
                                height={135}
                                fit="cover"
                                className="rounded-lg border"
                                feedback={<span className="text-xs text-muted-foreground">240 x 135</span>}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label={t.labels.preview}
                                width={360}
                                height={202}
                                fit="cover"
                                className="rounded-xl border"
                                feedback={<span className="text-xs text-muted-foreground">360 x 202</span>}
                            />
                        </div>
                    </div>
                )}
                code={`import { Image } from '@llmnative/react';

// thumbnail - square crop
<Image src={url} label="Thumbnail" width={120} height={120} fit="cover" className="rounded border" />

// card - 16:9 crop
<Image src={url} label="Card" width={240} height={135} fit="cover" className="rounded-lg border" />

// large preview
<Image src={url} label="Preview" width={360} height={202} fit="cover" className="rounded-xl border" />`}
            />

            <Section
                title={t.sections.styleVariants.title}
                description={t.sections.styleVariants.description}
                preview={(
                    <div className="flex flex-wrap items-start gap-6">
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label={t.labels.circleAvatar}
                            width={96}
                            height={96}
                            fit="cover"
                            className="rounded-full border-4 border-primary"
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label={t.labels.grayscale}
                            width={200}
                            height={120}
                            fit="cover"
                            className="rounded-lg border grayscale hover:grayscale-0 transition-all duration-300"
                            feedback={<span className="text-xs text-muted-foreground">{t.labels.hoverToColorize}</span>}
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE_ALT}
                            label={t.labels.shadow}
                            width={200}
                            height={120}
                            fit="cover"
                            className="rounded-xl shadow-xl"
                        />
                    </div>
                )}
                code={`import { Image } from '@llmnative/react';

// circle avatar
<Image src={url} label="Avatar" width={96} height={96} fit="cover" className="rounded-full border-4 border-primary" />

// grayscale with hover colorize
<Image src={url} label="Grayscale" width={200} height={120} fit="cover" className="rounded-lg border grayscale hover:grayscale-0 transition-all" />

// drop shadow
<Image src={url} label="Shadow" width={200} height={120} fit="cover" className="rounded-xl shadow-xl" />`}
            />

            <Section
                title={t.sections.useImageHtml.title}
                description={t.sections.useImageHtml.description}
                preview={(
                    <div className="flex w-full flex-col gap-8">
                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.imageDensityTitle}</span>
                                <Image
                                    src={SAMPLE_LANDSCAPE}
                                    label={t.labels.heroBanner}
                                    width={280}
                                    height={157}
                                    fit="cover"
                                    className="rounded-lg border"
                                    feedback={<span className="text-xs text-muted-foreground">hero.jpg · hero@2x.jpg · hero@3x.jpg</span>}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.generatedHtmlTag}</span>
                                <pre className="h-full overflow-x-auto whitespace-pre rounded-lg border bg-muted p-3 text-xs">{
                                    useImage({ src: 'hero.jpg', alt: 'Hero banner', width: 400, height: 225, loading: 'lazy' })
                                        .toHtml({ mode: 'density', densities: [1, 2, 3] })
                                }</pre>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.imageWidthTitle}</span>
                                <Image
                                    src={SAMPLE_LANDSCAPE_ALT}
                                    label={t.labels.campaignHero}
                                    width={280}
                                    height={157}
                                    fit="cover"
                                    className="rounded-lg border"
                                    feedback={<span className="text-xs text-muted-foreground">photo-400w.jpg · photo-800w.jpg · photo-1200w.jpg</span>}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.generatedHtmlLcp}</span>
                                <pre className="h-full overflow-x-auto whitespace-pre rounded-lg border bg-muted p-3 text-xs">{
                                    useImage({ src: 'photo.jpg', alt: 'Campaign hero', width: 800, height: 450, priority: true })
                                        .toHtml({ mode: 'width', widths: [400, 800, 1200], sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px' })
                                }</pre>
                            </div>
                        </div>
                    </div>
                )}
                code={`import { useImage } from '@llmnative/react';

// Density mode - fixed-size images (logo, avatar, icon)
// Files expected: hero.jpg  hero@2x.jpg  hero@3x.jpg
const img = useImage({ src: 'hero.jpg', alt: 'Hero banner', width: 400, height: 225, loading: 'lazy' });
img.toHtml({ mode: 'density', densities: [1, 2, 3] });

// Width mode - responsive images (hero, card, content)
// Files expected: photo-400w.jpg  photo-800w.jpg  photo-1200w.jpg
// priority: true -> fetchpriority="high" + loading="eager"  (LCP image)
const hero = useImage({ src: 'photo.jpg', alt: 'Campaign hero', width: 800, height: 450, priority: true });
hero.toHtml({ mode: 'width', widths: [400, 800, 1200], sizes: '(max-width: 640px) 100vw, 800px' });

// Custom suffix override: img.jpg -> img-2x.jpg instead of img@2x.jpg
const logo = useImage({ src: 'img.jpg', alt: 'Img' });
logo.toHtml({ mode: 'density', densities: [1, 2], suffix: (d) => d === 1 ? '' : \`-\${d}x\` });`}
            />

            <Section
                title={t.sections.useImageJson.title}
                description={t.sections.useImageJson.description}
                preview={(
                    <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.referenceImage}</span>
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label={t.labels.cardImage}
                                width={280}
                                height={157}
                                fit="cover"
                                className="rounded-lg border"
                                feedback={<span className="text-xs text-muted-foreground">card.jpg · 640x360 · fit: cover</span>}
                            />
                            <div className="mt-2 flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.htmlArrow}</span>
                                <pre className="overflow-x-auto whitespace-pre rounded-lg border bg-muted p-3 text-xs">{
                                    useImage({ src: 'card.jpg', alt: 'Card image', width: 640, height: 360, fit: 'cover', loading: 'lazy' })
                                        .toHtml({ mode: 'width', widths: [320, 640, 1280], sizes: '(max-width: 768px) 100vw, 640px' })
                                }</pre>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.labels.jsonParamsArrow}</span>
                            <pre className="overflow-x-auto whitespace-pre rounded-lg border bg-muted p-3 text-xs">{
                                useImage({ src: 'card.jpg', alt: 'Card image', width: 640, height: 360, fit: 'cover', loading: 'lazy' })
                                    .toJson({ mode: 'width', widths: [320, 640, 1280], sizes: '(max-width: 768px) 100vw, 640px' })
                            }</pre>
                        </div>
                    </div>
                )}
                code={`import { useImage } from '@llmnative/react';

const img = useImage({ src: 'card.jpg', alt: 'Card image', width: 640, height: 360, fit: 'cover', loading: 'lazy' });
const srcset = { mode: 'width', widths: [320, 640, 1280], sizes: '(max-width: 768px) 100vw, 640px' };

const html   = img.toHtml(srcset);   // <img ...> HTML string
const json   = img.toJson(srcset);   // JSON string - for CMS / SSR / metadata
const params = img.params(srcset);   // ImageParams object - for custom serialisation`}
            />

            <PropDocsTable props={imageProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
