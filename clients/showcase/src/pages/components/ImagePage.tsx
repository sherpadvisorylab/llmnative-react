import React, { useState } from 'react';
import { Image, Modal, Icon, useImage } from '@ash/react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
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

const SAMPLE_LANDSCAPE = makeLandscapeSvg('@ash/react', '#2563eb', '#facc15');
const SAMPLE_LANDSCAPE_ALT = makeLandscapeSvg('Campaign hero', '#059669', '#a7f3d0');
const SAMPLE_PORTRAIT = makePortraitSvg('Portrait', '#7c3aed', '#ddd6fe');

const SRC_PRESETS: Record<string, string> = {
    landscape:       SAMPLE_LANDSCAPE,
    'landscape-alt': SAMPLE_LANDSCAPE_ALT,
    portrait:        SAMPLE_PORTRAIT,
    empty:           '',
};

const IMAGE_PROPS: PropDef[] = [
    { name: 'src', type: 'string', required: true, group: 'Core', description: 'Preset image — selects between the sample assets used in the playground', control: 'select', options: ['landscape', 'landscape-alt', 'portrait', 'empty'] },
    { name: 'label', type: 'string', group: 'Core', description: 'Alt text shown to screen readers and on broken images', control: 'text' },
    { name: 'title', type: 'string', group: 'Core', description: 'Native title attribute — shown as tooltip on hover', control: 'text' },
    { name: 'placeholder', type: 'string', group: 'Core', description: 'Fallback image shown when src is empty or not yet resolved.', control: 'text', help: 'URL (https://…) · path relativo (/img/x.png) · data URI SVG (data:image/svg+xml,…) · base64 (data:image/png;base64,…). Vuoto = placeholder del tema.' },
    { name: 'width', type: 'number', group: 'Dimensions', description: 'Display width in pixels', control: 'number', min: 40, max: 640 },
    { name: 'height', type: 'number', group: 'Dimensions', description: 'Display height in pixels', control: 'number', min: 40, max: 600 },
    { name: 'fit', type: '"cover" | "contain" | "fill" | "scale-down" | "none"', group: 'Dimensions', description: 'How the image fills its box — maps to CSS object-fit', control: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'] },
    { name: 'position', type: 'string', group: 'Dimensions', description: 'Anchor point of the image inside the box — maps to CSS object-position', control: 'select', options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'] },
    { name: 'feedback', type: 'ReactNode', group: 'Slots', description: 'Caption or feedback text rendered below the image', control: 'text' },
    { name: 'pre', type: 'ReactNode', group: 'Slots', description: 'Content rendered to the left of the image', control: 'text' },
    { name: 'post', type: 'ReactNode', group: 'Slots', description: 'Content rendered to the right of the image', control: 'text' },
    { name: 'responsive', type: 'boolean', group: 'Responsive', description: 'Aggiunge srcset all\'export (toHTML / toJSON). Non cambia il preview — il browser userebbe varianti file che in demo non esistono.', control: 'boolean' },
    { name: 'srcsetMode', type: '"width" | "density"', group: 'Responsive', description: 'Strategia srcset. width (-400w/-800w/-1600w): immagini fluid/responsive, il browser sceglie in base a viewport + sizes. density (@2x/@3x): immagini a dimensione fissa (logo, avatar), il browser sceglie in base al devicePixelRatio.', control: 'select', options: ['width', 'density'], help: 'width → usa sizes per dire al browser quanto spazio occupa l\'immagine · density → nessun sizes, scelta basata sul DPR dello schermo', hidden: (p) => !p.responsive },
    { name: 'sizesPreset', type: 'string', group: 'Responsive', description: 'Descrive al browser quanto spazio visivo occupa l\'immagine al variare della viewport.', control: 'select', options: ['Hero — occupa tutta la larghezza', 'Articolo — colonna di testo (max 900px)', 'Card — griglia 2 colonne', 'Card — griglia 3 colonne', 'Thumbnail — elemento piccolo'], help: 'Hero: 100vw · Articolo: (max 900px) 100vw, 900px · Card 2col: (≤640px) 100vw, 50vw · Card 3col: (≤640px) 100vw, (≤1024px) 50vw, 33vw · Thumb: (≤640px) 50vw, 200px', hidden: (p) => !p.responsive || p.srcsetMode === 'density' },
    { name: 'className', type: 'string', group: 'Styling', description: 'CSS classes applied to the <img> element', control: 'text' },
    { name: 'wrapClass', type: 'string', group: 'Styling', description: 'CSS classes applied to the outer wrapper', control: 'text' },
];

// Filename used in export when src is a playground preset (not a real file)
const SRC_FILENAMES: Record<string, string> = {
    landscape:       'landscape.jpg',
    'landscape-alt': 'landscape-alt.jpg',
    portrait:        'portrait.jpg',
    empty:           'image.jpg',
};

const SRCSET_WIDTHS = [400, 800, 1600];

type ExportMode = 'json' | 'html';

function ImageExportPanel(p: Record<string, any>) {
    const PREVIEW_WIDTH = 320;
    const w = Number(p.width) || PREVIEW_WIDTH;
    const h = Number(p.height) || PREVIEW_WIDTH;
    const previewHeight = Math.round(PREVIEW_WIDTH * (h / w));

    const [modal, setModal] = useState<{ open: boolean; mode: ExportMode; content: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const resolvedSrc = SRC_PRESETS[p.src] ?? p.src ?? undefined;
    const exportFilename = SRC_FILENAMES[p.src] ?? (p.src ? `${p.src}.jpg` : 'image.jpg');

    const SIZES_MAP: Record<string, string> = {
        'Hero — occupa tutta la larghezza':      '100vw',
        'Articolo — colonna di testo (max 900px)': '(max-width: 900px) 100vw, 900px',
        'Card — griglia 2 colonne':              '(max-width: 640px) 100vw, 50vw',
        'Card — griglia 3 colonne':              '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
        'Thumbnail — elemento piccolo':          '(max-width: 640px) 50vw, 200px',
    };
    const sizesAttr = SIZES_MAP[p.sizesPreset] ?? '(max-width: 640px) 100vw, 50vw';

    const img = useImage({
        src:      exportFilename,
        alt:      p.label || 'Image',
        title:    p.title   || undefined,
        width:    Number(p.width)  || undefined,
        height:   Number(p.height) || undefined,
        fit:      (p.fit      || undefined) as any,
        position: (p.position || undefined) as any,
        loading:  'lazy',
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
                pre={p.pre || undefined}
                post={p.post || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
            />
            {p.responsive && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    {p.srcsetMode === 'density'
                        ? <>srcset density attivo — l'export include <code className="font-mono">1x / 2x / 3x</code> (<code className="font-mono">@2x</code> / <code className="font-mono">@3x</code>)</>
                        : <>srcset width attivo — l'export include <code className="font-mono">400w / 800w / 1600w</code></>
                    }
                </p>
            )}
            <div className="flex gap-2 mt-3 justify-center">
                <button className="btn btn-sm btn-outline-secondary flex items-center gap-1.5" onClick={() => openExport('json')}>
                    <Icon name="code" size={13} /> toJSON
                </button>
                <button className="btn btn-sm btn-outline-primary flex items-center gap-1.5" onClick={() => openExport('html')}>
                    <Icon name="file" size={13} /> toHTML
                </button>
            </div>

            {modal?.open && (
                <Modal
                    title={modal.mode === 'json' ? 'Image Params — JSON' : 'Image Tag — HTML'}
                    size="md"
                    position="center"
                    onClose={() => setModal(null)}
                    footer={
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-muted-foreground font-mono">
                                {modal.mode === 'json' ? 'ImageParams (JSON)' : '<img> tag (HTML)'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-sm btn-outline-secondary flex items-center gap-1.5"
                                    onClick={handleCopy}
                                >
                                    <Icon name={copied ? 'check' : 'copy'} size={13} />
                                    {copied ? 'Copiato!' : 'Copia'}
                                </button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setModal(null)}>
                                    Chiudi
                                </button>
                            </div>
                        </div>
                    }
                >
                    <textarea
                        readOnly
                        value={modal.content}
                        className="w-full rounded-md border bg-muted p-3 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={modal.mode === 'json' ? 18 : 12}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                </Modal>
            )}
        </>
    );
}

const PLAYGROUND: PlaygroundConfig = {
    size: 'xl',
    layout: 'split',
    props: IMAGE_PROPS,
    defaultProps: {
        src: 'landscape',
        label: 'Sample landscape illustration',
        title: 'Hover tooltip',
        placeholder: '',
        width: 320,
        height: 320,
        fit: 'cover',
        position: 'center',
        feedback: 'Caption rendered below the image',
        pre: '',
        post: '',
        responsive: false,
        srcsetMode: 'width',
        sizesPreset: 'Card — griglia 2 colonne',
        className: 'rounded-lg border',
        wrapClass: '',
    },
    render: (p) => <ImageExportPanel {...p} />,
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
                code={`import { Image } from '@ash/react';

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
                code={`import { Image } from '@ash/react';

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
                code={`import { Image } from '@ash/react';

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
                description="pre renders to the left of the image, post to the right — both vertically centred. Use them for labels, action buttons or metadata beside the image. feedback still appears below."
                preview={
                    <div className="flex flex-col gap-6 w-full">
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label="Hero banner"
                            pre={
                                <div className="flex flex-col items-end gap-1 text-right">
                                    <span className="font-semibold text-sm whitespace-nowrap">Hero banner</span>
                                    <span className="badge badge-info">ready</span>
                                </div>
                            }
                            post={
                                <div className="flex flex-col gap-1">
                                    <span className="badge badge-secondary whitespace-nowrap">1280 × 720</span>
                                    <span className="badge badge-light">SVG</span>
                                </div>
                            }
                            feedback="Used in the spring launch email."
                            className="rounded-lg border object-cover w-64"
                        />
                        <Image
                            src={SAMPLE_PORTRAIT}
                            label="Portrait"
                            pre={<span className="text-xs text-muted-foreground whitespace-nowrap">2 / 8</span>}
                            post={
                                <div className="flex flex-col gap-1 items-start">
                                    <span className="badge badge-secondary whitespace-nowrap">360 × 480</span>
                                    <span className="badge badge-light">Portrait</span>
                                </div>
                            }
                            className="rounded-lg border object-cover w-32"
                        />
                    </div>
                }
                code={`import { Image } from '@ash/react';

// pre = left, post = right, both vertically centred
<Image
    src={bannerUrl}
    label="Hero banner"
    pre={
        <div className="flex flex-col items-end gap-1 text-right">
            <span className="font-semibold text-sm">Hero banner</span>
            <span className="badge badge-info">ready</span>
        </div>
    }
    post={
        <div className="flex flex-col gap-1">
            <span className="badge badge-secondary">1280 × 720</span>
            <span className="badge badge-light">SVG</span>
        </div>
    }
    feedback="Used in the spring launch email."
    className="rounded-lg border object-cover w-64"
/>`}
            />

            <Section
                title="Fit modes"
                description="The fit prop maps to CSS object-fit and controls how the image fills its box when width and height are both set. Use cover to crop-fill, contain to letterbox, fill to stretch, scale-down to never upscale, or none to use the image's natural size."
                preview={
                    <div className="flex flex-wrap gap-6 items-start">
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
                                <span className="text-xs font-mono text-muted-foreground">{mode}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { Image } from '@ash/react';

// cover  — crops to fill the box, no empty space (default for thumbnails)
<Image src={url} width={160} height={160} fit="cover" className="rounded-lg border" />

// contain — letterboxes inside the box, full image always visible
<Image src={url} width={160} height={160} fit="contain" className="rounded-lg border bg-muted" />

// fill — stretches to fill exactly, distorts aspect ratio
<Image src={url} width={160} height={160} fit="fill" className="rounded-lg border" />

// scale-down — like contain but never upscales beyond natural size
<Image src={url} width={160} height={160} fit="scale-down" className="rounded-lg border bg-muted" />

// none — renders at natural image size, ignores width/height box
<Image src={url} width={160} height={160} fit="none" className="rounded-lg border" />`}
            />

            <Section
                title="Fixed dimensions"
                description="Pass width and height to set the display size. Use fit to control how the image content fills that box."
                preview={
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Thumbnail"
                                width={120}
                                height={120}
                                fit="cover"
                                className="rounded border"
                                feedback={<span className="text-xs text-muted-foreground">120 × 120</span>}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Card"
                                width={240}
                                height={135}
                                fit="cover"
                                className="rounded-lg border"
                                feedback={<span className="text-xs text-muted-foreground">240 × 135</span>}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Preview"
                                width={360}
                                height={202}
                                fit="cover"
                                className="rounded-xl border"
                                feedback={<span className="text-xs text-muted-foreground">360 × 202</span>}
                            />
                        </div>
                    </div>
                }
                code={`import { Image } from '@ash/react';

// thumbnail — square crop
<Image src={url} label="Thumbnail" width={120} height={120} fit="cover" className="rounded border" />

// card — 16:9 crop
<Image src={url} label="Card" width={240} height={135} fit="cover" className="rounded-lg border" />

// large preview
<Image src={url} label="Preview" width={360} height={202} fit="cover" className="rounded-xl border" />`}
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
                            fit="cover"
                            className="rounded-full border-4 border-primary"
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE}
                            label="Grayscale"
                            width={200}
                            height={120}
                            fit="cover"
                            className="rounded-lg border grayscale hover:grayscale-0 transition-all duration-300"
                            feedback={<span className="text-xs text-muted-foreground">Hover to colorize</span>}
                        />
                        <Image
                            src={SAMPLE_LANDSCAPE_ALT}
                            label="Shadow"
                            width={200}
                            height={120}
                            fit="cover"
                            className="rounded-xl shadow-xl"
                        />
                    </div>
                }
                code={`import { Image } from '@ash/react';

// circle avatar
<Image src={url} label="Avatar" width={96} height={96} fit="cover" className="rounded-full border-4 border-primary" />

// grayscale with hover colorize
<Image src={url} label="Grayscale" width={200} height={120} fit="cover" className="rounded-lg border grayscale hover:grayscale-0 transition-all" />

// drop shadow
<Image src={url} label="Shadow" width={200} height={120} fit="cover" className="rounded-xl shadow-xl" />`}
            />

            <Section
                title="useImage — HTML responsive con srcset"
                description="useImage(config) restituisce un helper con .toHtml(srcset?) che genera un tag <img> completo e SEO-ottimizzato come stringa. Non ridimensiona le immagini: presuppone che le varianti di file esistano già sul server con la naming convention generata."
                preview={
                    <div className="flex flex-col gap-8 w-full">
                        {/* Density mode */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Immagine — density 1x / 2x / 3x</span>
                                <Image
                                    src={SAMPLE_LANDSCAPE}
                                    label="Hero banner"
                                    width={280} height={157} fit="cover"
                                    className="rounded-lg border"
                                    feedback={<span className="text-xs text-muted-foreground">hero.jpg · hero@2x.jpg · hero@3x.jpg</span>}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tag HTML generato</span>
                                <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto whitespace-pre h-full">{
                                    useImage({ src: 'hero.jpg', alt: 'Hero banner', width: 400, height: 225, loading: 'lazy' })
                                        .toHtml({ mode: 'density', densities: [1, 2, 3] })
                                }</pre>
                            </div>
                        </div>
                        {/* Width mode */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Immagine — width 400w / 800w / 1200w (LCP)</span>
                                <Image
                                    src={SAMPLE_LANDSCAPE_ALT}
                                    label="Campaign hero"
                                    width={280} height={157} fit="cover"
                                    className="rounded-lg border"
                                    feedback={<span className="text-xs text-muted-foreground">photo-400w.jpg · photo-800w.jpg · photo-1200w.jpg</span>}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tag HTML generato (priority=LCP)</span>
                                <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto whitespace-pre h-full">{
                                    useImage({ src: 'photo.jpg', alt: 'Campaign hero', width: 800, height: 450, priority: true })
                                        .toHtml({ mode: 'width', widths: [400, 800, 1200], sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px' })
                                }</pre>
                            </div>
                        </div>
                    </div>
                }
                code={`import { useImage } from '@ash/react';

// Density mode — fixed-size images (logo, avatar, icon)
// Files expected: hero.jpg  hero@2x.jpg  hero@3x.jpg
const img = useImage({ src: 'hero.jpg', alt: 'Hero banner', width: 400, height: 225, loading: 'lazy' });
img.toHtml({ mode: 'density', densities: [1, 2, 3] });

// Width mode — responsive images (hero, card, content)
// Files expected: photo-400w.jpg  photo-800w.jpg  photo-1200w.jpg
// priority: true → fetchpriority="high" + loading="eager"  (LCP image)
const hero = useImage({ src: 'photo.jpg', alt: 'Campaign hero', width: 800, height: 450, priority: true });
hero.toHtml({ mode: 'width', widths: [400, 800, 1200], sizes: '(max-width: 640px) 100vw, 800px' });

// Custom suffix override: img.jpg → img-2x.jpg instead of img@2x.jpg
const logo = useImage({ src: 'img.jpg', alt: 'Img' });
logo.toHtml({ mode: 'density', densities: [1, 2], suffix: (d) => d === 1 ? '' : \`-\${d}x\` });`}
            />

            <Section
                title="useImage — JSON dei parametri"
                description="useImage(config).toJson(srcset?) restituisce un JSON con tutti gli attributi img. Utile per CMS headless, server-side rendering o quando serve passare i metadati separati dall'HTML. .params(srcset?) restituisce l'oggetto grezzo."
                preview={
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start w-full">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Immagine di riferimento</span>
                            <Image
                                src={SAMPLE_LANDSCAPE}
                                label="Card image"
                                width={280} height={157} fit="cover"
                                className="rounded-lg border"
                                feedback={<span className="text-xs text-muted-foreground">card.jpg · 640×360 · fit: cover</span>}
                            />
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">→ HTML</span>
                                <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto whitespace-pre">{
                                    useImage({ src: 'card.jpg', alt: 'Card image', width: 640, height: 360, fit: 'cover', loading: 'lazy' })
                                        .toHtml({ mode: 'width', widths: [320, 640, 1280], sizes: '(max-width: 768px) 100vw, 640px' })
                                }</pre>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">→ JSON params</span>
                            <pre className="rounded-lg border bg-muted p-3 text-xs overflow-x-auto whitespace-pre">{
                                useImage({ src: 'card.jpg', alt: 'Card image', width: 640, height: 360, fit: 'cover', loading: 'lazy' })
                                    .toJson({ mode: 'width', widths: [320, 640, 1280], sizes: '(max-width: 768px) 100vw, 640px' })
                            }</pre>
                        </div>
                    </div>
                }
                code={`import { useImage } from '@ash/react';

const img = useImage({ src: 'card.jpg', alt: 'Card image', width: 640, height: 360, fit: 'cover', loading: 'lazy' });
const srcset = { mode: 'width', widths: [320, 640, 1280], sizes: '(max-width: 768px) 100vw, 640px' };

const html   = img.toHtml(srcset);   // <img ...> HTML string
const json   = img.toJson(srcset);   // JSON string — for CMS / SSR / metadata
const params = img.params(srcset);   // ImageParams object — for custom serialisation`}
            />

            <PropDocsTable props={IMAGE_PROPS} />
        </PageLayout>
    );
}
