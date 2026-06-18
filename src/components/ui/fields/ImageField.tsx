import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import { Wrapper } from '../GridSystem';
import { Label, FieldError, fieldFeedbackClass } from './Input';
import { cn } from '../../../libs/cn';
import Icon from '../Icon';
import ImageDisplay from '../Image';
import {
    resizeToVariants,
    uploadVariants,
    buildSrcset,
    fileNameFromUrl,
    altFromFileName,
} from '../../../libs/imageVariants';
import { useStorageProvider } from '../../../providers/storage/StorageProviderContext'; // CR-042
import ImageEditor from '../../widgets/ImageEditor';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ImageFieldValue {
    src:     string;
    alt:     string;
    srcset?: string;
    sizes?:  string;
}

export interface ImageFieldProps extends FormFieldProps {
    /**
     * Pixel widths to generate as responsive srcset variants.
     * Each width produces a canvas-resized copy.
     * Default: [] (no variants).
     * Example: [400, 800]
     */
    srcsetWidths?: number[];
    /**
     * Storage path prefix for uploading resized variants.
     * Requires a StorageProvider ancestor.
     * If omitted, variants are kept as local blob URLs.
     * Example: "/content/posts/images"
     */
    uploadPath?:     string;
    label?:          string;
    required?:       boolean;
    disabled?:       boolean;
    feedback?:       string;
    id?:             string;
    labelClassName?: string;
}

// ── Srcset variant strip ──────────────────────────────────────────────────────

const VariantStrip = ({ srcset }: { srcset: string }) => {
    const entries = srcset.split(',').map(s => s.trim()).map(part => {
        const [url, widthStr] = part.split(' ');
        return { url, width: parseInt(widthStr, 10) };
    }).filter(e => e.url && !isNaN(e.width));
    if (entries.length < 2) return null;
    return (
        <div className="mt-2 flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">
                Responsive variants
                <span className="ml-1 font-normal opacity-60">({entries.length} generated)</span>
            </p>
            <div className="flex gap-1.5">
                {entries.map(e => (
                    <a key={e.width} href={e.url} target="_blank" rel="noopener noreferrer"
                       className="group relative flex-1 overflow-hidden rounded border border-border"
                       style={{ backgroundImage: 'repeating-conic-gradient(#e4e4e4 0% 25%, #f5f5f5 0% 50%)', backgroundSize: '8px 8px' }}>
                        <img src={e.url} alt={`${e.width}w`} className="h-12 w-full object-contain transition-opacity group-hover:opacity-80" />
                        <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] font-mono leading-none text-white">
                            {e.width}px
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <div className="rounded-md bg-black/60 p-1">
                                <Icon name="external-link" size={11} className="text-white" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ImageField = ({
    name,
    onChange       = undefined,
    defaultValue   = undefined,
    label          = undefined,
    required       = false,
    disabled       = false,
    feedback       = undefined,
    srcsetWidths   = [],
    uploadPath     = undefined,
    id             = undefined,
    labelClassName = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className      = undefined,
    before         = undefined,
    after          = undefined,
}: ImageFieldProps) => {
    const { value: raw, handleChange, formWrapClass } = useFormContext({
        name, onChange, defaultValue, wrapperClassName, inheritWrapperClassName,
    });
    const error = useFieldValidation(name, { required, label });

    const rec = (raw && typeof raw === 'object' && !Array.isArray(raw))
        ? (raw as Partial<ImageFieldValue>)
        : {} as Partial<ImageFieldValue>;

    const src    = rec.src    ?? '';
    const alt    = rec.alt    ?? '';
    const srcset = rec.srcset ?? '';
    const sizes  = rec.sizes  ?? '';

    const storage = useStorageProvider();

    const [isGenerating, setIsGenerating] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const altRef = useRef<HTMLInputElement>(null);

    const updateValue = useCallback((patch: Partial<ImageFieldValue>) => {
        handleChange?.({ target: { name, value: { ...rec, ...patch } } });
    }, [handleChange, name, rec]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-populate alt from filename on first src set (if alt is empty)
    const prevSrcRef = useRef('');
    useEffect(() => {
        if (src && src !== prevSrcRef.current && !alt) {
            updateValue({ alt: altFromFileName(fileNameFromUrl(src)) });
        }
        prevSrcRef.current = src;
    }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

    // Eager srcset generation: fires whenever src or srcsetWidths change
    useEffect(() => {
        if (!src || !srcsetWidths.length) return;
        let cancelled = false;
        setIsGenerating(true);

        (async () => {
            const { variants, naturalWidth } = await resizeToVariants(src, srcsetWidths);
            if (cancelled) return;

            const fileName = fileNameFromUrl(src);
            let entries: Array<{ url: string; width: number }>;

            // If src is a data URI (e.g. after crop), convert to blob URL for srcset —
            // data URIs contain commas that break srcset string parsing
            const srcForEntry = src.startsWith('data:')
                ? URL.createObjectURL(await fetch(src).then(r => r.blob()))
                : src;

            if (storage && uploadPath && variants.length) {
                const uploaded = await uploadVariants(variants, storage, uploadPath, fileName);
                entries = [...uploaded, { url: srcForEntry, width: naturalWidth }];
            } else {
                entries = [
                    ...variants.map(v => ({ url: v.localUrl, width: v.width })),
                    { url: srcForEntry, width: naturalWidth },
                ];
            }

            if (!cancelled) {
                updateValue({ srcset: buildSrcset(entries), sizes: '(max-width: 640px) 100vw, 800px' });
                setIsGenerating(false);
            }
        })().catch(() => { if (!cancelled) setIsGenerating(false); });

        return () => { cancelled = true; };
    }, [src, srcsetWidths.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCropSave = (dataUrl: string) => {
        // Reset srcset — the effect above will regenerate it from the new src
        updateValue({ src: dataUrl, srcset: '', sizes: '' });
        setShowCrop(false);
    };

    const hasError = !!error;

    return (
        <Wrapper className={formWrapClass}>
            {before}
            {label && <Label label={label} required={required} htmlFor={id ?? name} className={labelClassName} />}

            <div
                className={cn(
                    'rounded-lg border border-input bg-background shadow-sm transition-colors',
                    'focus-within:ring-1 focus-within:ring-ring',
                    hasError && 'border-destructive focus-within:ring-destructive/20',
                    disabled && 'cursor-not-allowed opacity-50',
                    className,
                )}
            >
                {/* Preview area */}
                <div
                    className={cn(
                        'group relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-t-lg transition-colors',
                        '[background-image:repeating-conic-gradient(#e4e4e4_0%_25%,#f5f5f5_0%_50%)]',
                        'dark:[background-image:repeating-conic-gradient(#2a2a2a_0%_25%,#343434_0%_50%)]',
                        '[background-size:16px_16px]',
                    )}
                >
                    {src ? (
                        <img
                            src={src}
                            srcSet={srcset || undefined}
                            sizes={sizes || undefined}
                            alt=""
                            className="max-h-[180px] max-w-full object-contain"
                        />
                    ) : (
                        <Icon name="image" size={36} className="opacity-20 text-muted-foreground" />
                    )}

                    {/* Icon controls — appear on hover, grouped top-right */}
                    {src && (
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <a
                                href={src}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open original"
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                            >
                                <Icon name="external-link" size={13} />
                            </a>
                            <button
                                type="button"
                                title="Crop"
                                disabled={disabled}
                                onClick={() => setShowCrop(true)}
                                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Icon name="crop" size={13} />
                            </button>
                        </div>
                    )}

                    {/* Generating indicator */}
                    {isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Icon name="loader-circle" size={14} className="animate-spin" />
                                Generating variants…
                            </div>
                        </div>
                    )}
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-3 p-3">
                    {/* src URL */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Image URL <span className="font-normal opacity-60">(path or https://…)</span>
                        </label>
                        <input
                            type="url"
                            value={src}
                            disabled={disabled}
                            onChange={e => updateValue({ src: e.target.value, srcset: '', sizes: '' })}
                            placeholder="https://example.com/image.jpg"
                            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                        />
                    </div>

                    {/* alt */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Alt text{' '}
                            <span className="font-normal opacity-60">(accessibility &amp; SEO)</span>
                            {required && <span className="ml-1 text-destructive">*</span>}
                        </label>
                        <input
                            ref={altRef}
                            type="text"
                            value={alt}
                            disabled={disabled}
                            onChange={e => updateValue({ alt: e.target.value })}
                            placeholder="E.g. Product hero shot"
                            className={cn(
                                'h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring disabled:opacity-50',
                                hasError && 'border-destructive',
                            )}
                        />
                    </div>

                    {/* Variant strip */}
                    {srcset && <VariantStrip srcset={srcset} />}
                </div>
            </div>

            {error && <FieldError message={error} />}
            {!error && feedback && <p className={fieldFeedbackClass}>{feedback}</p>}

            {after}

            {/* ImageEditor modal (lazy-loaded) */}
            {showCrop && src && (
                <ImageEditor
                    src={src}
                    mode="modal"
                    title={`Crop — ${fileNameFromUrl(src)}`}
                    onClose={() => setShowCrop(false)}
                    onSave={handleCropSave}
                />
            )}
        </Wrapper>
    );
};
