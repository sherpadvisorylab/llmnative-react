import { resizeVariants as canvasResize } from './imageBuilder';
import type { StorageProviderAdapter } from '../providers/storage/StorageProvider';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ImageVariant {
    width:    number;
    /** Canvas-generated data URI — safe to pass to storage.upload(). */
    dataUri:  string;
    /** Blob URL — comma-safe for srcset strings (data URIs contain commas). */
    localUrl: string;
}

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Resize an image to each requested width, returning blob URLs (no original).
 * Widths ≥ natural image width are silently skipped (no upscaling).
 * Also returns naturalWidth so the caller can add the original to srcset.
 */
export async function resizeToVariants(
    src: string,
    widths: number[],
): Promise<{ variants: ImageVariant[]; naturalWidth: number }> {
    // canvasResize skips widths >= naturalW and always appends original as last entry
    const raw          = await canvasResize(src, widths.length ? widths : []);
    const naturalWidth = raw.at(-1)?.width ?? 0;
    const resized      = raw.slice(0, -1); // all except the appended original

    const variants: ImageVariant[] = await Promise.all(
        resized.map(async v => {
            const blob = await fetch(v.src).then(r => r.blob());
            return { width: v.width, dataUri: v.src, localUrl: URL.createObjectURL(blob) };
        }),
    );
    return { variants, naturalWidth };
}

/**
 * Upload pre-generated variants to storage, replacing local URLs with remote ones.
 * Each variant is stored as `<uploadPath>/<baseName>_<width>w.<ext>`.
 * Falls back to the variant's local blob URL if upload fails.
 */
export async function uploadVariants(
    variants: ImageVariant[],
    storage: StorageProviderAdapter,
    uploadPath: string,
    fileName: string,
): Promise<Array<{ url: string; width: number }>> {
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const ext      = fileName.split('.').pop() ?? 'jpg';
    return Promise.all(
        variants.map(async v => {
            const remote = await storage.upload(v.dataUri, `${uploadPath}/${baseName}_${v.width}w.${ext}`);
            return { url: remote ?? v.localUrl, width: v.width };
        }),
    );
}

/** Build a width-based srcset string from `{url, width}` entries. */
export function buildSrcset(entries: Array<{ url: string; width: number }>): string {
    return [...entries]
        .sort((a, b) => a.width - b.width)
        .map(e => `${e.url} ${e.width}w`)
        .join(', ');
}

// ── Utilities ─────────────────────────────────────────────────────────────────

/** Extract the filename from a URL path, data URI, or blob URL. */
export function fileNameFromUrl(url: string): string {
    if (url.startsWith('data:') || url.startsWith('blob:')) return 'image.jpg';
    try { return new URL(url).pathname.split('/').pop() || 'image.jpg'; }
    catch { return url.split('/').pop() || 'image.jpg'; }
}

/** Derive a human-readable alt text from a filename (strips extension, replaces separators). */
export function altFromFileName(fileName: string): string {
    return fileName
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^(.)/, c => c.toUpperCase());
}
