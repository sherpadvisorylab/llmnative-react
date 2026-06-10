import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { FileProps, getFileUrl } from "./Upload";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_SCALES: Record<string, number> = {
    "1:1": 1,
    "3:4": 3 / 4,
    "4:3": 4 / 3,
};

const MIN_CROP = 48;

// Derives the variant filename from the original: "photo.jpg" + "1:1" → "photo_1x1.jpg"
const variantFileName = (origName: string, scale: string): string => {
    const ext    = origName.split('.').pop() ?? '';
    const base   = origName.replace(/\.[^/.]+$/, '');
    const suffix = `_${scale.replace(':', 'x')}`;
    return `${base}${suffix}.${ext}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CropProps {
    fileName: string;
    type: string;
    scale: string;
    top: number;
    left: number;
    width: number;
    height: number;
    base64?: string;
}

interface ImageProps extends FileProps {
    variants: Record<string, CropProps>;
}

interface Bounds { width: number; height: number }

type RHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const CURSOR: Record<RHandle, string> = {
    nw: 'nwse-resize', n: 'ns-resize',  ne: 'nesw-resize', e: 'ew-resize',
    se: 'nwse-resize', s: 'ns-resize',  sw: 'nesw-resize', w: 'ew-resize',
};

// Tracks the `dark` class on <html> (Tailwind class-based dark mode).
// Used to switch the checkerboard palette without importing the theme context.
const useDarkMode = (): boolean => {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    useEffect(() => {
        const obs = new MutationObserver(() =>
            setDark(document.documentElement.classList.contains('dark'))
        );
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return dark;
};

// ─── CropImage ────────────────────────────────────────────────────────────────

export const CropImage = forwardRef(({
    img,
    title,
    scales: scalesProp,
}: {
    img: ImageProps;
    title?: string;
    /** Custom aspect ratios. Defaults to { "1:1": 1, "3:4": 0.75, "4:3": 1.33 }. */
    scales?: Record<string, number>;
}, ref) => {
    const SCALES = scalesProp ?? DEFAULT_SCALES;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef    = useRef<HTMLImageElement | null>(null);

    const initSelected = (): string[] => {
        const fromVariants = Object.keys(img.variants ?? {}).filter(k => k in SCALES);
        return fromVariants.length ? fromVariants : Object.keys(SCALES);
    };

    const isDark = useDarkMode();

    const [selectedScales,   setSelectedScales  ] = useState<string[]>(initSelected);
    const [activeScale,      setActiveScale     ] = useState<string>(() => initSelected()[0] ?? Object.keys(SCALES)[0]);
    const [originalFileName, setOriginalFileName] = useState<string>(img.fileName);
    const [cropData,         setCropData        ] = useState<Record<string, CropProps>>(img.variants ?? {});
    const [imgBounds,        setImgBounds       ] = useState<Bounds | null>(null);
    const [imgReady,         setImgReady        ] = useState<boolean>(false);
    const [isDragging,       setIsDragging      ] = useState<boolean>(false);

    // Refs for stable window-level event handlers
    const cropDataRef         = useRef(cropData);
    const imgBoundsRef        = useRef(imgBounds);
    const activeScaleRef      = useRef(activeScale);
    const selectedRef         = useRef(selectedScales);
    const originalFileNameRef = useRef(originalFileName);
    useEffect(() => { cropDataRef.current         = cropData;        }, [cropData]);
    useEffect(() => { imgBoundsRef.current        = imgBounds;       }, [imgBounds]);
    useEffect(() => { activeScaleRef.current      = activeScale;     }, [activeScale]);
    useEffect(() => { selectedRef.current         = selectedScales;  }, [selectedScales]);
    useEffect(() => { originalFileNameRef.current = originalFileName;}, [originalFileName]);

    // Auto-update every variant's fileName when originalFileName changes.
    // Variant names are always derived — they are not independently editable.
    useEffect(() => {
        setCropData(prev => {
            const updated: Record<string, CropProps> = {};
            for (const [scale, data] of Object.entries(prev)) {
                updated[scale] = { ...data, fileName: variantFileName(originalFileName, scale) };
            }
            return updated;
        });
    }, [originalFileName]); // eslint-disable-line react-hooks/exhaustive-deps

    type DragState   = { offsetX: number; offsetY: number };
    type ResizeState = { handle: RHandle; sx: number; sy: number; sl: number; st: number; sw: number; sh: number };
    const dragRef   = useRef<DragState   | null>(null);
    const resizeRef = useRef<ResizeState | null>(null);

    // ── Window mouse handlers ─────────────────────────────────────────────────
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const drag   = dragRef.current;
            const resize = resizeRef.current;
            if (!drag && !resize) return;

            const scale  = activeScaleRef.current;
            const bounds = imgBoundsRef.current;
            const crop   = cropDataRef.current[scale];
            if (!bounds || !crop) return;

            const ratio = SCALES[scale] ?? 1;

            if (drag) {
                const l = Math.max(0, Math.min(e.clientX - drag.offsetX, bounds.width  - crop.width));
                const t = Math.max(0, Math.min(e.clientY - drag.offsetY, bounds.height - crop.height));
                setCropData(prev => ({ ...prev, [scale]: { ...prev[scale], left: l, top: t } }));
            }

            if (resize) {
                const { handle: h, sx, sy, sl, st, sw: sw0, sh: sh0 } = resize;
                const dx = e.clientX - sx;
                const dy = e.clientY - sy;

                let nl = sl, nt = st, nw = sw0, nh = sh0;

                if (h === 'n' || h === 's') {
                    // Height-driven: ratio always maintained, box stays horizontally centred
                    const delta = h === 'n' ? -dy : dy;
                    nh = Math.max(MIN_CROP, sh0 + delta);
                    nw = nh * ratio;
                    if (h === 'n') nt = st + sh0 - nh;
                    nl = sl + (sw0 - nw) / 2;
                } else if (h === 'e' || h === 'w') {
                    // Width-driven: ratio always maintained, box stays vertically centred
                    const delta = h === 'w' ? -dx : dx;
                    nw = Math.max(MIN_CROP, sw0 + delta);
                    nh = nw / ratio;
                    if (h === 'w') nl = sl + sw0 - nw;
                    nt = st + (sh0 - nh) / 2;
                } else {
                    // Corner: dominant axis drives, ratio locks the other dimension
                    const adx = h.includes('e') ? dx : -dx;
                    const ady = h.includes('s') ? dy : -dy;
                    const delta = Math.abs(adx) > Math.abs(ady) ? adx : ady;
                    nw = Math.max(MIN_CROP, sw0 + delta);
                    nh = nw / ratio;
                    if (h.includes('n')) nt = st + sh0 - nh;
                    if (h.includes('w')) nl = sl + sw0 - nw;
                }

                // Clamp position to image bounds
                nl = Math.max(0, nl);
                nt = Math.max(0, nt);

                // Proportional bounds clamp: scale both dims together so ratio is never broken
                const availW = bounds.width  - nl;
                const availH = bounds.height - nt;
                if (nw > availW || nh > availH) {
                    const s = Math.min(availW / nw, availH / nh);
                    nw *= s;
                    nh *= s;
                }
                if (nw < MIN_CROP) { nw = MIN_CROP; nh = nw / ratio; }
                if (nh < MIN_CROP) { nh = MIN_CROP; nw = nh * ratio; }

                setCropData(prev => ({ ...prev, [scale]: { ...prev[scale], left: nl, top: nt, width: nw, height: nh } }));
            }
        };

        const onUp = () => { dragRef.current = null; resizeRef.current = null; setIsDragging(false); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup',   onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, []);

    // ── Measure + init crop when img loads or active scale changes ────────────
    useLayoutEffect(() => {
        if (!imgReady) return;
        const el = imgRef.current;
        if (!el) return;
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;

        setImgBounds(prev =>
            prev && prev.width === width && prev.height === height ? prev : { width, height }
        );

        if (!cropDataRef.current[activeScale]) {
            const ratio = SCALES[activeScale] ?? 1;
            const maxW  = Math.min(width * 0.78, height * ratio * 0.78);
            const maxH  = maxW / ratio;
            setCropData(prev => ({
                ...prev,
                [activeScale]: {
                    fileName: variantFileName(originalFileNameRef.current, activeScale),
                    type: img.type, scale: activeScale,
                    left: (width - maxW) / 2, top: (height - maxH) / 2,
                    width: maxW, height: maxH, base64: '',
                },
            }));
        }
    }, [activeScale, imgReady]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Imperative save ───────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
        handleSave: (): { fileName: string; variants: Record<string, CropProps> } => {
            const canvas = canvasRef.current;
            const ctx    = canvas?.getContext('2d');
            const el     = imgRef.current;
            if (!canvas || !ctx || !el) return { fileName: originalFileNameRef.current, variants: {} };

            const bounds   = imgBoundsRef.current;
            const variants: Record<string, CropProps> = {};

            for (const scale of selectedRef.current) {
                const data = cropDataRef.current[scale];
                if (!data || !bounds) continue;

                const dX = el.naturalWidth  / bounds.width;
                const dY = el.naturalHeight / bounds.height;
                const { top, left, width, height } = data;
                canvas.width  = Math.round(width  * dX);
                canvas.height = Math.round(height * dY);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(el, left * dX, top * dY, width * dX, height * dY, 0, 0, canvas.width, canvas.height);
                variants[scale] = { ...data, base64: canvas.toDataURL(data.type) };
            }

            return { fileName: originalFileNameRef.current, variants };
        },
    }));

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCardClick = (scale: string) => {
        if (!selectedScales.includes(scale)) setSelectedScales(prev => [...prev, scale]);
        setActiveScale(scale);
    };

    const handleRemove = (scale: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = selectedScales.filter(s => s !== scale);
        setSelectedScales(next);
        if (scale === activeScale) {
            const remaining = next.filter(s => s in SCALES);
            setActiveScale(remaining[0] ?? Object.keys(SCALES).find(s => s !== scale) ?? Object.keys(SCALES)[0]);
        }
    };

    const handleMoveStart = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        const crop = cropDataRef.current[activeScale];
        if (!crop) return;
        dragRef.current = { offsetX: e.clientX - crop.left, offsetY: e.clientY - crop.top };
        setIsDragging(true);
    };

    const handleResizeStart = (e: React.MouseEvent, handle: RHandle) => {
        e.preventDefault(); e.stopPropagation();
        const crop = cropDataRef.current[activeScale];
        if (!crop) return;
        resizeRef.current = { handle, sx: e.clientX, sy: e.clientY, sl: crop.left, st: crop.top, sw: crop.width, sh: crop.height };
        setIsDragging(true);
    };

    const isActiveEnabled = selectedScales.includes(activeScale);
    const activeCrop      = cropData[activeScale];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        // h-full fills the modal body (which is flex-1 in the fullscreen modal)
        <div className={["flex gap-4 h-full min-h-0", title ? "flex-col" : ""].join(' ')}>
            {title && <h3 className="text-base font-semibold shrink-0">{title}</h3>}

            <div className="flex gap-4 flex-1 min-h-0">
                {/* ── LEFT: image canvas ───────────────────────────────────────── */}
                <div
                    className="flex-1 min-w-0 min-h-0 flex items-center justify-center rounded-xl overflow-hidden"
                    style={{
                        cursor: isDragging ? 'grabbing' : undefined,
                        ...(isDark
                            ? {
                                backgroundColor: '#1a1a1a',
                                backgroundImage:
                                    'linear-gradient(45deg,#272727 25%,transparent 25%),' +
                                    'linear-gradient(-45deg,#272727 25%,transparent 25%),' +
                                    'linear-gradient(45deg,transparent 75%,#272727 75%),' +
                                    'linear-gradient(-45deg,transparent 75%,#272727 75%)',
                              }
                            : {
                                backgroundColor: '#f0f0f0',
                                backgroundImage:
                                    'linear-gradient(45deg,#dcdcdc 25%,transparent 25%),' +
                                    'linear-gradient(-45deg,#dcdcdc 25%,transparent 25%),' +
                                    'linear-gradient(45deg,transparent 75%,#dcdcdc 75%),' +
                                    'linear-gradient(-45deg,transparent 75%,#dcdcdc 75%)',
                              }
                        ),
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0,0 10px,10px -10px,-10px 0',
                    }}
                >
                    {isActiveEnabled ? (
                        <div className="relative select-none" style={{ display: 'inline-block', lineHeight: 0 }}>
                            <img
                                src={getFileUrl(img)}
                                alt="Crop target"
                                ref={imgRef}
                                // The image fills the left panel but never exceeds the modal body height
                                style={{ maxHeight: 'calc(100dvh - 200px)', maxWidth: '100%', display: 'block' }}
                                draggable={false}
                                onLoad={() => setImgReady(true)}
                            />
                            {activeCrop && imgBounds && (
                                <CropOverlay
                                    crop={activeCrop}
                                    onMoveStart={handleMoveStart}
                                    onResizeStart={handleResizeStart}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-zinc-500 select-none">
                            <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2M9 12l2 2 4-4" />
                            </svg>
                            <p className="text-sm">Click <strong className="text-zinc-300">{activeScale}</strong> to enable this crop</p>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: sidebar ───────────────────────────────────────────── */}
                <div className="w-52 shrink-0 flex flex-col gap-4 min-h-0">
                    {/* Original filename */}
                    <div>
                        <NativeFileNameEditor
                            value={originalFileName}
                            onChange={setOriginalFileName}
                            label="File name"
                        />
                    </div>

                    {/* Ratio cards */}
                    <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
                            Variants
                        </p>
                        {Object.keys(SCALES).map(scale => (
                            <RatioCard
                                key={scale}
                                scale={scale}
                                ratio={SCALES[scale]}
                                img={img}
                                crop={cropData[scale]}
                                bounds={imgBounds}
                                enabled={selectedScales.includes(scale)}
                                active={scale === activeScale}
                                onClick={() => handleCardClick(scale)}
                                onRemove={e => handleRemove(scale, e)}
                            />
                        ))}
                    </div>

                    {/* Derived variant filename — read-only, shown for reference */}
                    {isActiveEnabled && activeCrop && (
                        <div className="shrink-0 pt-3 border-t border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Output file</p>
                            <p className="text-xs text-foreground/70 truncate tabular-nums" title={activeCrop.fileName}>
                                {activeCrop.fileName ?? variantFileName(originalFileName, activeScale)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
});

CropImage.displayName = 'CropImage';

// ─── RatioCard ────────────────────────────────────────────────────────────────
// Clickable card showing a live CSS-based preview thumbnail of the current crop.
// Clicking an enabled card activates it for editing; clicking a disabled one enables it.
// The × button removes the variant from the save output.

interface RatioCardProps {
    scale: string;
    ratio: number;
    img: ImageProps;
    crop: CropProps | undefined;
    bounds: Bounds | null;
    enabled: boolean;
    active: boolean;
    onClick: () => void;
    onRemove: (e: React.MouseEvent) => void;
}

// Maximum thumbnail bounding box: 120×88px — maintains correct aspect ratio inside.
const THUMB_MAX_W = 120;
const THUMB_MAX_H = 88;

const getThumbDims = (ratio: number) => {
    let w = THUMB_MAX_H * ratio;
    let h = THUMB_MAX_H;
    if (w > THUMB_MAX_W) { w = THUMB_MAX_W; h = THUMB_MAX_W / ratio; }
    return { w: Math.round(w), h: Math.round(h) };
};

const RatioCard = ({ scale, ratio, img, crop, bounds, enabled, active, onClick, onRemove }: RatioCardProps) => {
    const { w: tw, h: th } = getThumbDims(ratio);

    // CSS background trick for live preview — no canvas needed
    const previewStyle = ((): React.CSSProperties => {
        if (!crop || !bounds || !crop.width) return { background: 'hsl(var(--muted))' };
        const s = tw / crop.width;
        return {
            backgroundImage:    `url(${getFileUrl(img)})`,
            backgroundSize:     `${Math.round(bounds.width * s)}px ${Math.round(bounds.height * s)}px`,
            backgroundPosition: `-${Math.round(crop.left * s)}px -${Math.round(crop.top * s)}px`,
            backgroundRepeat:   'no-repeat',
        };
    })();

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'relative group flex flex-col rounded-lg border-2 transition-all overflow-hidden w-full text-left',
                active
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : enabled
                        ? 'border-border hover:border-primary/40 bg-card'
                        : 'border-dashed border-muted-foreground/25 bg-transparent hover:border-muted-foreground/50',
            ].join(' ')}
        >
            {/* Thumbnail area */}
            <div className="flex items-center justify-center py-3 px-3 bg-muted/20">
                {enabled && crop && bounds ? (
                    <div
                        className="rounded shadow-sm overflow-hidden shrink-0"
                        style={{ width: tw, height: th, ...previewStyle }}
                    />
                ) : (
                    <div
                        className="rounded border border-dashed border-muted-foreground/30 flex items-center justify-center shrink-0"
                        style={{ width: tw, height: th }}
                    >
                        <svg className="w-5 h-5 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Label row */}
            <div className="flex items-center justify-between px-2.5 py-1.5 border-t border-border/60">
                <span className={['text-xs font-semibold tabular-nums', active ? 'text-primary' : 'text-foreground'].join(' ')}>
                    {scale}
                </span>
                {active && enabled && (
                    <span className="text-xs text-primary/60 font-normal">active</span>
                )}
                {enabled && (
                    <span
                        role="button"
                        tabIndex={-1}
                        onClick={onRemove}
                        title={`Remove ${scale} variant`}
                        className="ml-auto w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-base leading-none"
                    >
                        ×
                    </span>
                )}
            </div>
        </button>
    );
};

// ─── CropOverlay ──────────────────────────────────────────────────────────────
// 4 semi-transparent rects + crop box + 8 resize handles (4 corners, 4 edges).
// Parent must be `display: inline-block` shrink-wrapping the <img> so overlays
// never bleed outside the image area.

interface CropOverlayProps {
    crop: CropProps;
    onMoveStart: (e: React.MouseEvent) => void;
    onResizeStart: (e: React.MouseEvent, handle: RHandle) => void;
}

const CropOverlay = ({ crop, onMoveStart, onResizeStart }: CropOverlayProps) => {
    const { top, left, width, height } = crop;

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Dark mask */}
            <div className="absolute" style={{ top: 0, left: 0, right: 0, height: top,              background: 'rgba(0,0,0,0.55)' }} />
            <div className="absolute" style={{ top: top+height, left: 0, right: 0, bottom: 0,       background: 'rgba(0,0,0,0.55)' }} />
            <div className="absolute" style={{ top, left: 0, width: left, height,                   background: 'rgba(0,0,0,0.55)' }} />
            <div className="absolute" style={{ top, left: left+width, right: 0, height,             background: 'rgba(0,0,0,0.55)' }} />

            {/* Crop box */}
            <div
                onMouseDown={onMoveStart}
                className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
                style={{ top, left, width, height, border: '1.5px solid rgba(255,255,255,0.92)', boxSizing: 'border-box' }}
            >
                {/* Rule-of-thirds grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px),' +
                            'linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)',
                        backgroundSize: '33.33% 33.33%',
                    }}
                />

                {/* Corner handles */}
                {(['nw', 'ne', 'sw', 'se'] as RHandle[]).map(h => (
                    <div
                        key={h}
                        onMouseDown={e => { e.stopPropagation(); onResizeStart(e, h); }}
                        className="absolute pointer-events-auto"
                        style={{
                            cursor: CURSOR[h], width: 22, height: 22,
                            display: 'flex',
                            alignItems:     h.includes('n') ? 'flex-start' : 'flex-end',
                            justifyContent: h.includes('w') ? 'flex-start' : 'flex-end',
                            ...(h.includes('n') ? { top: -2 }    : { bottom: -2 }),
                            ...(h.includes('w') ? { left: -2 }   : { right: -2 }),
                        }}
                    >
                        <span style={{ display: 'block', width: 10, height: 10, background: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }} />
                    </div>
                ))}

                {/* Edge handles */}
                {(['n', 's'] as RHandle[]).map(h => (
                    <div key={h} onMouseDown={e => { e.stopPropagation(); onResizeStart(e, h); }}
                        className="absolute pointer-events-auto"
                        style={{ cursor: CURSOR[h], ...(h === 'n' ? { top: -4 } : { bottom: -4 }), left: '50%', transform: 'translateX(-50%)', width: 24, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <span style={{ display: 'block', width: 20, height: 4, background: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }} />
                    </div>
                ))}
                {(['e', 'w'] as RHandle[]).map(h => (
                    <div key={h} onMouseDown={e => { e.stopPropagation(); onResizeStart(e, h); }}
                        className="absolute pointer-events-auto"
                        style={{ cursor: CURSOR[h], ...(h === 'w' ? { left: -4 } : { right: -4 }), top: '50%', transform: 'translateY(-50%)', width: 12, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <span style={{ display: 'block', width: 4, height: 20, background: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── NativeFileNameEditor ─────────────────────────────────────────────────────
// Pure HTML — no Form context dependency.
// CropImage lives inside a Modal portal that shares React context with the
// parent Form, so framework fields (Input, Switch) would write into the parent's
// record via useFormContext. This component uses only a plain <input>.

interface FileNameEditorProps {
    value: string;
    onChange: (newName: string) => void;
    scale?: string;
    label?: string;
}

const NativeFileNameEditor = ({ value, onChange, label, scale }: FileNameEditorProps) => {
    const ext    = value?.split('.').pop() ?? '';
    const suffix = scale ? `_${scale.replace(':', 'x')}` : undefined;

    const stripSuffix = (fullName: string): string => {
        const base = fullName.replace(/\.[^/.]+$/, '');
        if (!suffix) return base;
        return base.endsWith(suffix) ? base.slice(0, -suffix.length) : base;
    };

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
            <div className="flex items-center gap-1.5">
                <input
                    type="text"
                    defaultValue={stripSuffix(value || '')}
                    onBlur={e => onChange(`${e.target.value.trim()}${suffix ?? ''}.${ext}`)}
                    className="flex-1 h-8 min-w-0 rounded-md border border-input bg-background px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {suffix && (
                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">{suffix}.{ext}</span>
                )}
            </div>
        </div>
    );
};

// Kept for backward compat — external consumers that imported FileNameEditor
export const FileNameEditor = NativeFileNameEditor;
