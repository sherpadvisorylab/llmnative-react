/**
 * imageBuilder — pure utility for generating SEO/performance-optimised <img> tags
 * with srcset support. Does NOT resize images; assumes variant files already exist.
 *
 * Two srcset modes:
 *   density — fixed-size images (logos, avatars): 1x / 2x / 3x descriptors
 *             naming: image.jpg → image@2x.jpg, image@3x.jpg
 *   width   — responsive/fluid images (hero, content): width descriptors + sizes
 *             naming: image.jpg → image-400w.jpg, image-800w.jpg …
 */

export type ImgFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

export interface ImageBuilderConfig {
    /** URL, relative path, or data URI of the source image (used as src and as the 1x/base variant in srcset). */
    src: string;
    /** Alt text — required for SEO and accessibility. */
    alt: string;
    title?: string;
    /** Intrinsic display width in px. Prevents CLS (Core Web Vitals). */
    width?: number;
    /** Intrinsic display height in px. Prevents CLS (Core Web Vitals). */
    height?: number;
    fit?: ImgFit;
    position?: string;
    /**
     * loading="lazy" for below-the-fold images.
     * Do NOT use on LCP images — use priority=true instead.
     * Default: 'lazy'.
     */
    loading?: 'lazy' | 'eager';
    /**
     * Marks this as the LCP (Largest Contentful Paint) image.
     * Sets fetchpriority="high" and loading="eager". Overrides `loading`.
     */
    priority?: boolean;
    /** Default: 'async' — frees the main thread from image decoding. */
    decoding?: 'async' | 'sync' | 'auto';
    className?: string;
    crossorigin?: 'anonymous' | 'use-credentials';
    referrerpolicy?: string;
}

/** Density-based srcset: best for fixed-size images (logos, avatars, icons). */
export interface SrcsetDensityConfig {
    mode: 'density';
    /** Pixel-density multipliers. Include 1 to make the 1x variant explicit. Default: [1, 2]. */
    densities?: number[];
    /**
     * Override the suffix inserted before the extension for each density.
     * Default: density === 1 → no suffix (uses src as-is), density > 1 → '@{d}x'
     * Example: (2) => '-2x'  to get  image-2x.jpg instead of image@2x.jpg
     */
    suffix?: (density: number) => string;
}

/** Width-based srcset: best for responsive/fluid images (hero, content, cards). */
export interface SrcsetWidthConfig {
    mode: 'width';
    /** Image widths in pixels, ascending order. Example: [400, 800, 1200]. */
    widths: number[];
    /**
     * Override the suffix inserted before the extension for each width.
     * Default: (w) => `-${w}w`  →  image-400w.jpg
     */
    suffix?: (width: number) => string;
    /**
     * CSS sizes attribute — tells the browser how wide the image renders at each breakpoint.
     * Required for width-mode srcset to work correctly.
     * Example: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
     */
    sizes?: string;
}

export type SrcsetConfig = SrcsetDensityConfig | SrcsetWidthConfig;

/** JSON-serialisable representation of all <img> attributes. */
export interface ImageParams {
    src: string;
    alt: string;
    title?: string;
    width?: number;
    height?: number;
    srcset?: string;
    sizes?: string;
    style?: string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
    fetchpriority?: 'high' | 'low' | 'auto';
    class?: string;
    crossorigin?: string;
    referrerpolicy?: string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function insertSuffix(src: string, suffix: string): string {
    if (!suffix) return src;
    const qIdx = src.indexOf('?');
    const base  = qIdx !== -1 ? src.slice(0, qIdx) : src;
    const query = qIdx !== -1 ? src.slice(qIdx)    : '';
    const dot   = base.lastIndexOf('.');
    return dot === -1
        ? `${base}${suffix}${query}`
        : `${base.slice(0, dot)}${suffix}${base.slice(dot)}${query}`;
}

function buildSrcsetString(src: string, cfg: SrcsetConfig): string {
    if (cfg.mode === 'density') {
        const densities = cfg.densities ?? [1, 2];
        return densities
            .map(d => {
                const suffix = cfg.suffix
                    ? cfg.suffix(d)
                    : d === 1 ? '' : `@${d}x`;
                return `${insertSuffix(src, suffix)} ${d}x`;
            })
            .join(', ');
    }

    return cfg.widths
        .map(w => {
            const suffix = cfg.suffix ? cfg.suffix(w) : `-${w}w`;
            return `${insertSuffix(src, suffix)} ${w}w`;
        })
        .join(', ');
}

// ── Internal builders (not exported) ─────────────────────────────────────────

function buildImageParams(
    config: ImageBuilderConfig,
    srcset?: SrcsetConfig,
): ImageParams {
    const loading = config.priority ? 'eager' : (config.loading ?? 'lazy');

    const params: ImageParams = {
        src:      config.src,
        alt:      config.alt,
        width:    config.width,
        height:   config.height,
        loading,
        decoding: config.decoding ?? 'async',
        ...(config.priority        && { fetchpriority: 'high' }),
        ...(config.title           && { title: config.title }),
        ...(config.className       && { class: config.className }),
        ...(config.crossorigin     && { crossorigin: config.crossorigin }),
        ...(config.referrerpolicy  && { referrerpolicy: config.referrerpolicy }),
    };

    const styleParts: string[] = [];
    if (config.fit)      styleParts.push(`object-fit: ${config.fit}`);
    if (config.position) styleParts.push(`object-position: ${config.position}`);
    if (styleParts.length) params.style = styleParts.join('; ');

    if (srcset) {
        params.srcset = buildSrcsetString(config.src, srcset);
        if (srcset.mode === 'width' && srcset.sizes) {
            params.sizes = srcset.sizes;
        }
    }

    // Remove undefined keys for clean JSON serialisation
    return Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined),
    ) as ImageParams;
}

function imageParamsToTag(params: ImageParams): string {
    const ORDER: (keyof ImageParams)[] = [
        'src', 'srcset', 'sizes', 'alt', 'title',
        'width', 'height', 'style', 'class',
        'loading', 'decoding', 'fetchpriority',
        'crossorigin', 'referrerpolicy',
    ];

    const attrs = ORDER
        .filter(k => params[k] !== undefined)
        .map(k => `${k}="${String(params[k])}"`);

    if (attrs.length === 0) return '<img />';

    // First attr on same line as <img, rest indented
    const [first, ...rest] = attrs;
    return rest.length === 0
        ? `<img ${first} />`
        : `<img ${first}\n     ${rest.join('\n     ')} />`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface UseImageResult {
    /** Generates the <img> HTML string with all SEO/performance attributes. */
    toHtml: (srcset?: SrcsetConfig) => string;
    /** Generates a JSON string of all img attributes — for CMS, SSR or metadata. */
    toJson: (srcset?: SrcsetConfig) => string;
    /** Returns the raw ImageParams object for custom serialisation. */
    params: (srcset?: SrcsetConfig) => ImageParams;
}

/**
 * Returns toHtml / toJson / params helpers bound to the given image config.
 * Does NOT resize images — assumes variant files already exist on the server.
 *
 * @example
 * const img = useImage({ src: 'hero.jpg', alt: 'Hero', width: 800, height: 450, priority: true })
 *
 * // Responsive HTML with width-based srcset (files: hero-400w.jpg, hero-800w.jpg, hero-1200w.jpg)
 * img.toHtml({ mode: 'width', widths: [400, 800, 1200], sizes: '(max-width: 640px) 100vw, 800px' })
 *
 * // Fixed-size HTML with density srcset (files: hero.jpg, hero@2x.jpg, hero@3x.jpg)
 * img.toHtml({ mode: 'density', densities: [1, 2, 3] })
 *
 * // JSON params for CMS or SSR
 * img.toJson({ mode: 'width', widths: [400, 800, 1200], sizes: '100vw' })
 */
export function useImage(config: ImageBuilderConfig): UseImageResult {
    return {
        toHtml:  (srcset?) => imageParamsToTag(buildImageParams(config, srcset)),
        toJson:  (srcset?) => JSON.stringify(buildImageParams(config, srcset), null, 2),
        params:  (srcset?) => buildImageParams(config, srcset),
    };
}
