import React, { useId, useEffect, useState, useCallback, useRef, Fragment } from 'react';
import type { Editor } from '@tiptap/core';
import { Wrapper } from '../GridSystem';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import type { FieldValue } from '../../../providers/data/DataProvider';
import { Label, FieldError, fieldFeedbackClass } from './Input';
import { cn } from '../../../libs/cn';
import Icon from '../Icon';
import { useFileUploadCore, type FileProps } from './Upload';
import { useStorageProvider } from '../../../providers/storage/StorageProviderContext'; // CR-042
import { resizeToVariants, uploadVariants, buildSrcset } from '../../../libs/imageVariants';
import Modal from '../Modal';
import ImageDisplay from '../Image';
const LazyImageEditor = React.lazy(() => import('../../widgets/ImageEditor'));

// ── LAZY MODULE LOADER ────────────────────────────────────────────────────────
// TipTap (~400 KB) is only fetched when a RichText field is actually mounted.

const loadTipTap = () =>
    Promise.all([
        import('@tiptap/react'),                      // [0] useEditor, EditorContent
        import('@tiptap/react/menus'),                // [1] BubbleMenu
        import('@tiptap/starter-kit'),                // [2]
        import('@tiptap/extension-underline'),        // [3]
        import('@tiptap/extension-link'),             // [4]
        import('@tiptap/extension-image'),            // [5]
        import('@tiptap/extension-table'),            // [6] Table + TableRow + TableHeader + TableCell
        import('@tiptap/extension-placeholder'),      // [7]
        import('@tiptap/extension-character-count'),  // [8]
    ]);

type TipTapModules = Awaited<ReturnType<typeof loadTipTap>>;

let _cachedModules: TipTapModules | null = null;
let _loadPromise: Promise<TipTapModules> | null = null;

const ensureTipTap = (): Promise<TipTapModules> => {
    if (_cachedModules) return Promise.resolve(_cachedModules);
    if (!_loadPromise)
        _loadPromise = loadTipTap().then(m => {
            _cachedModules = m;
            return m;
        });
    return _loadPromise;
};

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ToolbarCommand =
    | 'bold' | 'italic' | 'underline' | 'strike'
    | 'headings'
    | 'heading1' | 'heading2' | 'heading3'
    | 'bulletList' | 'orderedList'
    | 'blockquote' | 'code' | 'codeBlock'
    | 'link' | 'table'
    | 'imageUpload' | 'documentUpload'
    | 'sourceCode'
    | 'undo' | 'redo' | 'clearFormat'
    | '|';

export interface StatusBarConfig {
    /** Show the DOM ancestor tag breadcrumb at the cursor (e.g. p › strong). Default: true. */
    tagBreadcrumb?: boolean;
    /** Show the word count. Default: true. */
    wordCount?: boolean;
    /** Show the character count. Default: false. */
    charCount?: boolean;
}

export interface RichTextImageUploadConfig {
    /**
     * Storage path prefix for uploaded images.
     * Requires a StorageProvider ancestor.
     * Example: "/content/posts/hero"
     */
    path?: string;
    /**
     * Pixel widths to generate as responsive srcset variants.
     * Each width produces a canvas-resized copy stored as <name>_<width>w.<ext>.
     * Pass [] to disable srcset generation entirely.
     * Default: [400, 800]
     */
    srcsetWidths?: number[];
    /**
     * Accepted MIME types for the image file picker.
     * Default: "image/*"
     */
    accept?: string;
    /**
     * Maximum file size in bytes.
     * Default: 10_485_760 (10 MB)
     */
    maxBytes?: number;
}

export interface RichTextDocumentUploadConfig {
    /**
     * Storage path prefix for uploaded documents.
     * Requires a StorageProvider ancestor.
     * Example: "/content/posts/attachments"
     */
    path?: string;
    /**
     * Accepted MIME types / file extensions for the document file picker.
     * Default: ".pdf,.doc,.docx,.txt,.csv"
     */
    accept?: string;
    /**
     * Maximum file size in bytes.
     * Default: 20_971_520 (20 MB)
     */
    maxBytes?: number;
}

export interface RichTextProps extends FormFieldProps {
    placeholder?: string;
    disabled?: boolean;
    feedback?: string;
    /** Position of the formatting toolbar. false hides it entirely. Default: 'fixed'. */
    toolbar?: 'fixed' | 'floating' | false;
    /** Ordered list of toolbar commands to show. Defaults to all commands. */
    toolbarCommands?: ToolbarCommand[];
    /** Format used to read/write the field value. Default: 'html'. */
    outputFormat?: 'html' | 'json' | 'text';
    /** Show the status bar below the editor. Pass true for defaults or a config object. Default: false. */
    statusBar?: boolean | StatusBarConfig;
    /** Minimum editor height in px. Default: 120. */
    minHeight?: number;
    /** Maximum editor height in px; content scrolls beyond this. */
    maxHeight?: number;
    /**
     * Image upload behaviour for the imageUpload toolbar command.
     * Pass an object to enable uploads; omit to keep images as base64 data URIs.
     */
    imageUpload?: RichTextImageUploadConfig;
    /**
     * Document upload behaviour for the documentUpload toolbar command.
     * Pass an object to enable cloud storage uploads; omit to use data URI fallback.
     */
    documentUpload?: RichTextDocumentUploadConfig;
    /** @deprecated Use imageUpload.path instead. */
    uploadPath?: string;
    id?: string;
    labelClassName?: string;
    validator?: (value: FieldValue) => string | undefined;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const DEFAULT_TOOLBAR_COMMANDS: ToolbarCommand[] = [
    'bold', 'italic', 'underline', 'strike', '|',
    'headings', '|',
    'bulletList', 'orderedList', '|',
    'blockquote', 'code', 'codeBlock', '|',
    'link', '|',
    'imageUpload', 'documentUpload', '|',
    'table', '|',
    'sourceCode', '|',
    'undo', 'redo', 'clearFormat',
];

const resolveStatusBarConfig = (raw: boolean | StatusBarConfig): StatusBarConfig => {
    if (raw === true) return { tagBreadcrumb: true, wordCount: true, charCount: false };
    if (raw === false) return {};
    return { tagBreadcrumb: true, wordCount: true, charCount: false, ...raw };
};

// ── TOOLBAR BUTTON DEFINITIONS ────────────────────────────────────────────────

interface ToolbarButtonDef {
    icon: string;
    label: string;
    isActive?: (editor: Editor) => boolean;
    execute: (editor: Editor) => void;
}

const TOOLBAR_DEFS: Partial<Record<Exclude<ToolbarCommand, '|'>, ToolbarButtonDef>> = {
    bold:        { icon: 'bold',              label: 'Bold',          isActive: e => e.isActive('bold'),                      execute: e => e.chain().focus().toggleBold().run() },
    italic:      { icon: 'italic',            label: 'Italic',        isActive: e => e.isActive('italic'),                    execute: e => e.chain().focus().toggleItalic().run() },
    underline:   { icon: 'underline',         label: 'Underline',     isActive: e => e.isActive('underline'),                 execute: e => e.chain().focus().toggleUnderline().run() },
    strike:      { icon: 'strikethrough',     label: 'Strikethrough', isActive: e => e.isActive('strike'),                   execute: e => e.chain().focus().toggleStrike().run() },
    heading1:    { icon: 'heading-1',         label: 'Heading 1',     isActive: e => e.isActive('heading', { level: 1 }),     execute: e => e.chain().focus().toggleHeading({ level: 1 }).run() },
    heading2:    { icon: 'heading-2',         label: 'Heading 2',     isActive: e => e.isActive('heading', { level: 2 }),     execute: e => e.chain().focus().toggleHeading({ level: 2 }).run() },
    heading3:    { icon: 'heading-3',         label: 'Heading 3',     isActive: e => e.isActive('heading', { level: 3 }),     execute: e => e.chain().focus().toggleHeading({ level: 3 }).run() },
    bulletList:  { icon: 'list',              label: 'Bullet List',   isActive: e => e.isActive('bulletList'),                execute: e => e.chain().focus().toggleBulletList().run() },
    orderedList: { icon: 'list-ordered',      label: 'Ordered List',  isActive: e => e.isActive('orderedList'),               execute: e => e.chain().focus().toggleOrderedList().run() },
    blockquote:  { icon: 'quote',             label: 'Blockquote',    isActive: e => e.isActive('blockquote'),                execute: e => e.chain().focus().toggleBlockquote().run() },
    code:        { icon: 'code',              label: 'Inline Code',   isActive: e => e.isActive('code'),                     execute: e => e.chain().focus().toggleCode().run() },
    codeBlock:   { icon: 'square-code',       label: 'Code Block',    isActive: e => e.isActive('codeBlock'),                 execute: e => e.chain().focus().toggleCodeBlock().run() },
    link:        { icon: 'link',              label: 'Link',          isActive: e => e.isActive('link'),                     execute: e => { if (e.isActive('link')) { e.chain().focus().unsetLink().run(); return; } const url = window.prompt('URL'); if (url) e.chain().focus().setLink({ href: url }).run(); } },
    table:       { icon: 'table',             label: 'Insert Table',                                                          execute: e => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    undo:        { icon: 'undo-2',            label: 'Undo',                                                                  execute: e => e.chain().focus().undo().run() },
    redo:        { icon: 'redo-2',            label: 'Redo',                                                                  execute: e => e.chain().focus().redo().run() },
    clearFormat: { icon: 'eraser',            label: 'Clear Format',                                                          execute: e => e.chain().focus().clearNodes().unsetAllMarks().run() },
};

// ── INTERNAL: TOOLBAR BUTTON ──────────────────────────────────────────────────

const ToolbarButton = ({ def, editor }: { def: ToolbarButtonDef; editor: Editor }) => {
    const isActive = def.isActive?.(editor) ?? false;
    return (
        <button
            type="button"
            title={def.label}
            onMouseDown={ev => { ev.preventDefault(); def.execute(editor); }}
            className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
                'hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40',
                isActive && 'bg-muted text-primary',
            )}
        >
            <Icon name={def.icon} size={14} />
        </button>
    );
};

// ── INTERNAL: HEADING PICKER ──────────────────────────────────────────────────

const HEADING_OPTIONS = [
    { value: 0,  label: 'Normal',    previewClass: 'text-sm',              execute: (e: Editor) => e.chain().focus().setParagraph().run() },
    { value: 1,  label: 'Heading 1', previewClass: 'text-2xl font-bold',   execute: (e: Editor) => e.chain().focus().setHeading({ level: 1 }).run() },
    { value: 2,  label: 'Heading 2', previewClass: 'text-xl font-semibold',execute: (e: Editor) => e.chain().focus().setHeading({ level: 2 }).run() },
    { value: 3,  label: 'Heading 3', previewClass: 'text-lg font-semibold',execute: (e: Editor) => e.chain().focus().setHeading({ level: 3 }).run() },
] as const;

const HeadingPicker = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = React.useState(false);
    const ref = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const currentLabel =
        editor.isActive('heading', { level: 1 }) ? 'H1' :
        editor.isActive('heading', { level: 2 }) ? 'H2' :
        editor.isActive('heading', { level: 3 }) ? 'H3' :
        'P';

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                title="Paragraph style"
                onMouseDown={ev => { ev.preventDefault(); setOpen(o => !o); }}
                className="inline-flex h-7 items-center gap-0.5 rounded px-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
                {currentLabel}
                <Icon name="chevron-down" size={10} />
            </button>
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-md border border-border bg-background shadow-lg">
                    {HEADING_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onMouseDown={ev => {
                                ev.preventDefault();
                                opt.execute(editor);
                                setOpen(false);
                            }}
                            className={cn(
                                'block w-full px-3 py-1.5 text-left leading-snug transition-colors hover:bg-muted',
                                opt.previewClass,
                                opt.value === 0 && editor.isActive('paragraph') && 'bg-muted/60',
                                opt.value !== 0 && editor.isActive('heading', { level: opt.value }) && 'bg-muted/60',
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── INTERNAL: TOOLBAR ─────────────────────────────────────────────────────────

interface ToolbarProps {
    editor: Editor;
    commands: ToolbarCommand[];
    sourceMode: boolean;
    onImageUpload: () => void;
    onDocumentUpload: () => void;
    onSourceToggle: () => void;
    compact?: boolean;
}

const RichTextToolbar = ({ editor, commands, sourceMode, onImageUpload, onDocumentUpload, onSourceToggle, compact }: ToolbarProps) => {
    const [, rerender] = React.useReducer(n => n + 1, 0);

    React.useEffect(() => {
        editor.on('selectionUpdate', rerender);
        editor.on('transaction', rerender);
        return () => {
            editor.off('selectionUpdate', rerender);
            editor.off('transaction', rerender);
        };
    }, [editor]);

    return (
    <div className={cn('flex flex-wrap items-center gap-0.5 px-2 py-1', !compact && 'border-b border-border')}>
        {commands.map((cmd, i) => {
            if (cmd === '|') return <div key={i} className="mx-0.5 h-4 w-px bg-border" />;

            if (cmd === 'headings') return <HeadingPicker key={cmd} editor={editor} />;

            if (cmd === 'imageUpload') return (
                <button key={cmd} type="button" title="Upload Image"
                    onMouseDown={ev => { ev.preventDefault(); onImageUpload(); }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors hover:bg-muted">
                    <Icon name="image" size={14} />
                </button>
            );

            if (cmd === 'documentUpload') return (
                <button key={cmd} type="button" title="Upload Document"
                    onMouseDown={ev => { ev.preventDefault(); onDocumentUpload(); }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors hover:bg-muted">
                    <Icon name="file-up" size={14} />
                </button>
            );

            if (cmd === 'sourceCode') return (
                <button key={cmd} type="button" title="Source Code"
                    onMouseDown={ev => { ev.preventDefault(); onSourceToggle(); }}
                    className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors hover:bg-muted',
                        sourceMode && 'bg-muted text-primary',
                    )}>
                    <Icon name="code" size={14} />
                </button>
            );

            const def = TOOLBAR_DEFS[cmd];
            if (!def) return null;
            return <ToolbarButton key={cmd} def={def} editor={editor} />;
        })}
    </div>
    );
};

// ── INTERNAL: STATUS BAR ──────────────────────────────────────────────────────

const getTagBreadcrumb = (editor: Editor): string[] => {
    try {
        const { $anchor } = editor.state.selection;
        const crumbs: string[] = [];
        for (let d = $anchor.depth; d >= 0; d--) {
            const name = $anchor.node(d).type.name;
            if (name !== 'doc') crumbs.unshift(name);
        }
        return crumbs;
    } catch {
        return [];
    }
};

const RichTextStatusBar = ({ editor, config }: { editor: Editor; config: StatusBarConfig }) => {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const update = () => setTick(n => n + 1);
        editor.on('selectionUpdate', update);
        editor.on('transaction', update);
        return () => { editor.off('selectionUpdate', update); editor.off('transaction', update); };
    }, [editor]);

    // suppress unused-variable warning — tick is read to trigger re-render
    void tick;

    const crumbs = config.tagBreadcrumb ? getTagBreadcrumb(editor) : [];
    const charCountStorage = (editor.storage as unknown as Record<string, unknown>)['characterCount'] as
        | { characters: () => number; words: () => number }
        | undefined;

    return (
        <div className="flex items-center gap-3 border-t border-border px-3 py-1 text-xs text-muted-foreground select-none">
            {config.tagBreadcrumb && crumbs.length > 0 && (
                <div className="flex items-center gap-1 font-mono">
                    {crumbs.map((tag, i) => (
                        <Fragment key={i}>
                            {i > 0 && <span className="opacity-40">›</span>}
                            <span>{tag}</span>
                        </Fragment>
                    ))}
                </div>
            )}
            <div className="ml-auto flex items-center gap-3">
                {config.wordCount && charCountStorage && (
                    <span>{charCountStorage.words()} words</span>
                )}
                {config.charCount && charCountStorage && (
                    <span>{charCountStorage.characters()} chars</span>
                )}
            </div>
        </div>
    );
};

// ── IMAGE INSERT / EDIT DIALOG ────────────────────────────────────────────────

type InsertSlideItem = { fileProps: FileProps; preview: string; defaultAlt: string };
type EditDialogState = { pos: number; attrs: Record<string, unknown> };
interface ImageDialogValues { alt: string; href: string; target: string; enabled: boolean }

// Shared variant thumbnails strip
const VariantStrip = ({ srcset }: { srcset: string }) => {
    const variants = srcset.split(',').map(s => s.trim()).map(part => {
        const [src, widthStr] = part.split(' ');
        return { src, width: parseInt(widthStr, 10) };
    }).filter(v => v.src && !isNaN(v.width));
    if (!variants.length) return null;
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">
                Responsive variants <span className="font-normal opacity-60">({variants.length} generated)</span>
            </p>
            <div className="flex gap-1.5">
                {variants.map(v => (
                    <a key={v.width} href={v.src} target="_blank" rel="noopener noreferrer"
                       className="group relative flex-1 overflow-hidden rounded border border-border"
                       style={{ backgroundImage: 'repeating-conic-gradient(#e4e4e4 0% 25%, #f5f5f5 0% 50%)', backgroundSize: '8px 8px' }}>
                        <img src={v.src} alt={`${v.width}w`} className="h-12 w-full object-contain transition-opacity group-hover:opacity-80" />
                        <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 py-0.5 text-[9px] font-mono leading-none text-white">
                            {v.width}px
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

// Slider dialog for insert mode — shows all selected images, one at a time with nav
const ImageInsertSlider = ({
    items,
    onInsertAll,
    onCropSave,
    onCancel,
}: {
    items: InsertSlideItem[];
    onInsertAll: (values: ImageDialogValues[]) => void;
    onCropSave: (idx: number, dataUrl: string) => void;
    onCancel: () => void;
}) => {
    const [idx, setIdx] = useState(0);
    const [perImage, setPerImage] = useState<ImageDialogValues[]>(() =>
        items.map(it => ({ alt: it.defaultAlt, href: '', target: '_blank', enabled: true }))
    );
    const [showCrop, setShowCrop] = useState(false);
    const altRef = useRef<HTMLInputElement>(null);
    useEffect(() => { altRef.current?.focus(); }, [idx]);

    // Extend perImage when more files finish uploading after the dialog opened
    useEffect(() => {
        setPerImage(prev => {
            if (items.length <= prev.length) return prev;
            const extra = items.slice(prev.length).map(it => ({ alt: it.defaultAlt, href: '', target: '_blank', enabled: true }));
            return [...prev, ...extra];
        });
    }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const total        = items.length;
    const item         = items[idx] ?? items[0];
    const vals         = perImage[idx] ?? { alt: '', href: '', target: '_blank', enabled: true };
    const enabledCount = perImage.filter(v => v.enabled).length;

    const update = (patch: Partial<ImageDialogValues>) =>
        setPerImage(prev => prev.map((v, i) => i === idx ? { ...v, ...patch } : v));

    return (
        <>
        <Modal
            title={total === 1 ? 'Insert image' : 'Insert images'}
            onClose={onCancel}
            size="md"
            footer={
                <div className="flex w-full items-center justify-between">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
                        <input type="checkbox" checked={vals.enabled}
                            onChange={e => update({ enabled: e.target.checked })}
                            className="h-4 w-4 rounded accent-primary" />
                        Include
                    </label>
                    <div className="flex gap-2">
                        <button type="button" onClick={onCancel}
                            className="h-8 rounded-md px-3 text-sm transition-colors hover:bg-muted">
                            Cancel
                        </button>
                        <button type="button" onClick={() => onInsertAll(perImage)} disabled={enabledCount === 0}
                            className="h-8 rounded-md bg-primary px-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                            {total === 1 ? 'Insert' : `Insert (${enabledCount})`}
                        </button>
                    </div>
                </div>
            }
        >
            {/* Thumbnail strip + counter nav */}
            {total > 1 && (
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                        {items.map((it, i) => (
                            <button key={i} type="button" onClick={() => setIdx(i)}
                                title={it.fileProps.fileName}
                                className={cn(
                                    'relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                                    i === idx ? 'border-primary shadow' : 'border-transparent opacity-50 hover:opacity-90',
                                    !perImage[i]?.enabled && 'opacity-20 grayscale',
                                )}>
                                <img src={it.preview} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-0.5">
                        <button type="button" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
                            className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                            <Icon name="chevron-left" size={14} />
                        </button>
                        <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">{idx + 1} / {total}</span>
                        <button type="button" onClick={() => setIdx(i => Math.min(items.length - 1, i + 1))} disabled={idx >= items.length - 1}
                            className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                            <Icon name="chevron-right" size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main preview */}
            <div
                className={cn(
                    'group relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-lg transition-opacity',
                    '[background-image:repeating-conic-gradient(#e4e4e4_0%_25%,#f5f5f5_0%_50%)]',
                    'dark:[background-image:repeating-conic-gradient(#2a2a2a_0%_25%,#343434_0%_50%)]',
                    '[background-size:16px_16px]',
                    !vals.enabled && 'opacity-40',
                )}
            >
                <img src={item.preview} alt="" className="max-h-[160px] max-w-full object-contain" />

                {/* Icon controls — appear on hover, grouped top-right */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                        href={item.preview}
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
                        onClick={() => setShowCrop(true)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    >
                        <Icon name="crop" size={13} />
                    </button>
                </div>
            </div>
            <p className="mt-1.5 truncate font-mono text-xs text-muted-foreground">{item.fileProps.fileName}</p>

            {item.fileProps.srcset && <VariantStrip srcset={item.fileProps.srcset} />}

            <div className="mt-3 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                    Alt text <span className="font-normal opacity-60">(accessibility &amp; SEO)</span>
                </label>
                <input ref={altRef} type="text" value={vals.alt}
                    onChange={e => update({ alt: e.target.value })}
                    placeholder="E.g. Team photo at company retreat"
                    className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
            </div>

            <div className="mt-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                    Link URL <span className="font-normal opacity-60">(optional)</span>
                </label>
                <div className="flex gap-1.5">
                    <input type="url" value={vals.href}
                        onChange={e => update({ href: e.target.value })}
                        placeholder="https://..."
                        className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                    <select value={vals.target} onChange={e => update({ target: e.target.value })}
                        disabled={!vals.href}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-ring disabled:opacity-40">
                        <option value="_blank">New tab</option>
                        <option value="_self">Same tab</option>
                    </select>
                </div>
            </div>
        </Modal>

        {showCrop && (
            <React.Suspense fallback={null}>
                <LazyImageEditor
                    src={item.preview}
                    mode="modal"
                    title={`Crop — ${item.fileProps.fileName}`}
                    onClose={() => setShowCrop(false)}
                    onSave={(dataUrl) => { onCropSave(idx, dataUrl); setShowCrop(false); }}
                />
            </React.Suspense>
        )}
        </>
    );
};

// Simple modal for editing an already-inserted image
const ImageEditDialog = ({
    state,
    onConfirm,
    onCancel,
}: {
    state: EditDialogState;
    onConfirm: (values: ImageDialogValues) => void;
    onCancel: () => void;
}) => {
    const [alt,    setAlt   ] = useState(state.attrs.alt    as string ?? '');
    const [href,   setHref  ] = useState(state.attrs.href   as string ?? '');
    const [target, setTarget] = useState(state.attrs.target as string ?? '_blank');
    const altRef = useRef<HTMLInputElement>(null);
    useEffect(() => { altRef.current?.focus(); }, []);

    const src = state.attrs.src as string | undefined;

    return (
        <Modal
            title="Edit image"
            onClose={onCancel}
            size="sm"
            footer={
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onCancel}
                        className="h-8 rounded-md px-3 text-sm transition-colors hover:bg-muted">
                        Cancel
                    </button>
                    <button type="button" onClick={() => onConfirm({ alt, href, target, enabled: true })}
                        className="h-8 rounded-md bg-primary px-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
                        Save
                    </button>
                </div>
            }
        >
            {src && (
                <div className="mb-3 overflow-hidden rounded-lg bg-muted/40">
                    <ImageDisplay src={src} fit="contain" height={140} wrapperClassName="w-full" className="w-full" />
                </div>
            )}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                    Alt text <span className="font-normal opacity-60">(accessibility &amp; SEO)</span>
                </label>
                <input ref={altRef} type="text" value={alt} onChange={e => setAlt(e.target.value)}
                    placeholder="E.g. Team photo at company retreat"
                    className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
            </div>
            <div className="mt-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                    Link URL <span className="font-normal opacity-60">(optional)</span>
                </label>
                <div className="flex gap-1.5">
                    <input type="url" value={href} onChange={e => setHref(e.target.value)}
                        placeholder="https://..."
                        className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                    <select value={target} onChange={e => setTarget(e.target.value)}
                        disabled={!href}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-1 focus:ring-ring disabled:opacity-40">
                        <option value="_blank">New tab</option>
                        <option value="_self">Same tab</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};

// ── INTERNAL: EDITOR INNER ────────────────────────────────────────────────────
// Rendered only after TipTap modules are loaded — all TipTap hooks live here.

interface RichTextInnerProps {
    modules: TipTapModules;
    name: string;
    value: string;
    outputFormat: 'html' | 'json' | 'text';
    placeholder: string | undefined;
    disabled: boolean;
    toolbar: 'fixed' | 'floating' | false;
    toolbarCommands: ToolbarCommand[];
    statusBar: StatusBarConfig | false;
    minHeight: number;
    maxHeight: number | undefined;
    imageUpload: RichTextImageUploadConfig | undefined;
    documentUpload: RichTextDocumentUploadConfig | undefined;
    hasError: boolean;
    className: string | undefined;
    onEditorChange: (content: string) => void;
}

const RichTextInner = ({
    modules, name, value, outputFormat, placeholder, disabled,
    toolbar, toolbarCommands, statusBar, minHeight, maxHeight,
    imageUpload, documentUpload, hasError, className, onEditorChange,
}: RichTextInnerProps) => {
    const { useEditor, EditorContent } = modules[0];
    const { BubbleMenu }               = modules[1];
    const StarterKit                   = modules[2].default;
    const Underline                    = modules[3].default;
    const Link                         = modules[4].default;
    const Image                        = modules[5].default;
    const ImageExtended = Image.extend({
        addAttributes() {
            return {
                ...(this.parent?.() ?? {}),
                srcset:   { default: null },
                sizes:    { default: null },
                loading:  { default: null },
                decoding: { default: null },
                href:     { default: null },
                target:   { default: null },
            };
        },
        renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
            const { href, target, ...rest } = HTMLAttributes;
            const extDefaults = ((this.options as unknown) as { HTMLAttributes?: Record<string, unknown> }).HTMLAttributes ?? {};
            const imgAttrs = Object.fromEntries(
                Object.entries({ ...extDefaults, ...rest })
                    .filter(([, v]) => v !== null && v !== undefined)
            );
            // CR-042 — DOMOutputSpec tuple type requires a const assertion to satisfy TS
            const imgSpec = ['img', imgAttrs] as const;
            if (href) {
                return ['a', { href, target: target ?? '_blank', rel: 'noopener noreferrer' }, imgSpec] as unknown as readonly [string, ...unknown[]];
            }
            return imgSpec as unknown as readonly [string, ...unknown[]];
        },
    });
    const { Table, TableRow, TableHeader, TableCell } = modules[6];
    const Placeholder                  = modules[7].default;
    const CharacterCount               = modules[8].default;

    const [sourceMode, setSourceMode] = useState(false);
    const [sourceContent, setSourceContent] = useState('');
    const [insertQueue, setInsertQueue] = useState<InsertSlideItem[]>([]);
    const [editDialog,  setEditDialog ] = useState<EditDialogState | null>(null);
    const [, rerenderOnSelection] = React.useReducer(n => n + 1, 0);
    const docInputRef = useRef<HTMLInputElement>(null);

    // Always default to [400, 800] so the Insert-image dialog shows variant previews
    // even without a StorageProvider (variants are generated as local blob URLs).
    // Pass imageUpload={{ srcsetWidths: [] }} to disable entirely.
    const resolvedSrcsetWidths = imageUpload?.srcsetWidths !== undefined
        ? imageUpload.srcsetWidths
        : [400, 800];

    const storage = useStorageProvider();

    const imgCore = useFileUploadCore({
        uploadPath: imageUpload?.path,
        srcsetWidths: resolvedSrcsetWidths,
        onFileReady: (fp) => {
            const defaultAlt = fp.fileName
                .replace(/\.[^/.]+$/, '')
                .replace(/[-_]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .replace(/^(.)/, c => c.toUpperCase());
            // Compute preview directly — avoids getFileUrl/urlCache entirely
            const preview = fp.url || (fp.base64 ? `data:${fp.type};base64,${fp.base64}` : '');
            setInsertQueue(prev => [...prev, { fileProps: fp, preview, defaultAlt }]);
        },
    });

    const editorContentMinHeight = minHeight - 16; // subtract py-2 (8px top + 8px bottom)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { target: null, rel: 'noopener noreferrer nofollow' },
            }),
            ImageExtended.configure({ allowBase64: true }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({ placeholder: placeholder ?? '' }),
            CharacterCount,
        ],
        content: value || '',
        editable: !disabled,
        editorProps: {
            attributes: {
                style: `min-height: ${editorContentMinHeight}px`,
            },
            handleClick(view, pos, event) {
                if (event.ctrlKey || event.metaKey) {
                    const marks = view.state.doc.resolve(pos).marks();
                    const linkMark = marks.find(m => m.type.name === 'link');
                    if (linkMark?.attrs.href) {
                        window.open(linkMark.attrs.href as string, '_blank', 'noopener,noreferrer');
                        return true;
                    }
                }
                // Use event.target + posAtDOM for reliable image detection.
                // The `pos` param is only the "nearest" position and can miss leaf nodes.
                const target = event.target as HTMLElement;
                if (target.tagName === 'IMG') {
                    try {
                        const imgPos = view.posAtDOM(target, 0);
                        const node = view.state.doc.nodeAt(imgPos);
                        if (node?.type.name === 'image') {
                            setEditDialog({ pos: imgPos, attrs: node.attrs as Record<string, unknown> });
                            return true;
                        }
                    } catch { /* ignore — posAtDOM can throw if element is outside the doc */ }
                }
                return false;
            },
        },
        onUpdate: ({ editor: ed }) => {
            const content =
                outputFormat === 'json' ? JSON.stringify(ed.getJSON()) :
                outputFormat === 'text' ? ed.getText() :
                ed.getHTML();
            onEditorChange(content);
        },
    });

    // Sync external value changes (e.g. form load).
    const prevValueRef = useRef(value);
    useEffect(() => {
        if (!editor || value === prevValueRef.current) return;
        prevValueRef.current = value;
        const current =
            outputFormat === 'json' ? JSON.stringify(editor.getJSON()) :
            outputFormat === 'text' ? editor.getText() :
            editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(
                outputFormat === 'json' && value ? (JSON.parse(value) as object) : (value || ''),
            );
        }
    }, [value, editor, outputFormat]);

    // Keep ProseMirror min-height in sync with the minHeight prop.
    // Also subscribe to selectionUpdate so RichTextInner re-renders when the cursor moves,
    // ensuring the link tooltip popup always reads a fresh href from the editor state.
    useEffect(() => {
        if (!editor) return;
        editor.view.dom.style.minHeight = `${editorContentMinHeight}px`;
        editor.on('selectionUpdate', rerenderOnSelection);
        return () => { editor.off('selectionUpdate', rerenderOnSelection); };
    }, [editor, editorContentMinHeight]);

    // Source mode: toggle between WYSIWYG and raw HTML textarea.
    const handleSourceToggle = () => {
        if (!editor) return;
        if (!sourceMode) setSourceContent(editor.getHTML());
        else editor.commands.setContent(sourceContent);
        setSourceMode(s => !s);
    };

    const readAsDataUrl = (file: File): Promise<string> =>
        new Promise(resolve => {
            const r = new FileReader();
            r.onload = ev => resolve(ev.target?.result as string);
            r.readAsDataURL(file);
        });

    const handleDocFiles = async (files: File[]) => {
        if (!editor) return;
        const maxBytes = documentUpload?.maxBytes ?? 20_971_520;
        for (const file of files) {
            if (file.size > maxBytes) {
                alert(`"${file.name}" exceeds the ${Math.round(maxBytes / 1_048_576)} MB limit.`);
                continue;
            }
            let url: string;
            if (storage && documentUpload?.path) {
                try {
                    const uploaded = await storage.upload(file, `${documentUpload.path}/${file.name}`);
                    url = uploaded ?? await readAsDataUrl(file);
                } catch {
                    url = await readAsDataUrl(file);
                }
            } else {
                url = await readAsDataUrl(file);
            }
            const sizeLabel = file.size < 1_048_576
                ? `${Math.round(file.size / 1024)} KB`
                : `${(file.size / 1_048_576).toFixed(1)} MB`;
            editor.chain().focus()
                .insertContent([
                    {
                        type: 'text',
                        marks: [{ type: 'link', attrs: { href: url, target: '_blank', rel: 'noopener noreferrer' } }],
                        text: `📎 ${file.name} (${sizeLabel})`,
                    },
                    { type: 'text', text: ' ' },
                ])
                .run();
        }
    };

    const handleInsertAll = (values: ImageDialogValues[]) => {
        if (!editor) return;
        const nodes: object[] = [];
        values.forEach(({ alt, href, target, enabled }, i) => {
            if (!enabled) return;
            const item = insertQueue[i];
            if (!item) return;
            imgCore.handleRemove(item.fileProps.key);
            const src = item.fileProps.url || item.preview;
            const base = {
                alt:    alt    || null,
                href:   href   || null,
                target: href ? (target || '_blank') : null,
            };
            const attrs = item.fileProps.srcset
                ? { ...base, src, srcset: item.fileProps.srcset, sizes: item.fileProps.sizes ?? '(max-width: 640px) 100vw, 800px', loading: 'lazy', decoding: 'async' }
                : { ...base, src };
            nodes.push({ type: 'image', attrs });
        });
        if (nodes.length) editor.chain().focus().insertContent(nodes).run();
        setInsertQueue([]);
    };

    const handleUpdateInsertItem = (idx: number, updates: Partial<InsertSlideItem>) => {
        setInsertQueue(prev => prev.map((item, i) => i === idx ? { ...item, ...updates } : item));
    };

    const handleCropItem = useCallback(async (cropIdx: number, dataUrl: string) => {
        // Read fileName before the async gap, using functional updater
        let fileName = 'image.jpg';
        setInsertQueue(prev => {
            fileName = prev[cropIdx]?.fileProps.fileName ?? 'image.jpg';
            return prev.map((it, i) =>
                i === cropIdx
                    ? { ...it, preview: dataUrl, fileProps: { ...it.fileProps, url: dataUrl, srcset: '', sizes: '' } }
                    : it
            );
        });

        if (!resolvedSrcsetWidths.length) return;
        try {
            const { variants, naturalWidth } = await resizeToVariants(dataUrl, resolvedSrcsetWidths);
            const resizedEntries = storage && imageUpload?.path
                ? await uploadVariants(variants, storage, imageUpload.path, fileName)
                : variants.map(v => ({ url: v.localUrl, width: v.width }));
            // Convert the cropped dataUrl → blob URL: data URIs contain commas that break
            // both srcset string parsing and VariantStrip's split(',') parser
            const originalBlob = await fetch(dataUrl).then(r => r.blob());
            const originalLocalUrl = URL.createObjectURL(originalBlob);
            const allEntries = [...resizedEntries, { url: originalLocalUrl, width: naturalWidth }];
            const newSrcset = buildSrcset(allEntries);
            setInsertQueue(prev => prev.map((it, i) =>
                i === cropIdx
                    ? { ...it, fileProps: { ...it.fileProps, srcset: newSrcset, sizes: '(max-width: 640px) 100vw, 800px' } }
                    : it
            ));
        } catch { /* variants not critical, preview is already updated */ }
    }, [resolvedSrcsetWidths, storage, imageUpload?.path]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEditConfirm = ({ alt, href, target }: ImageDialogValues) => {
        if (!editor || !editDialog) return;
        const { pos, attrs } = editDialog;
        setEditDialog(null);
        const node = editor.state.doc.nodeAt(pos);
        if (node?.type.name === 'image') {
            const { tr } = editor.state;
            tr.setNodeMarkup(pos, null, {
                ...attrs,
                alt:    alt    || null,
                href:   href   || null,
                target: href ? (target || '_blank') : null,
            });
            editor.view.dispatch(tr);
        }
    };


    // Floating toolbar commands exclude upload/source (they need separate triggers).
    const floatingCommands = toolbarCommands.filter(
        c => c !== 'imageUpload' && c !== 'documentUpload' && c !== 'sourceCode'
    );

    return (
        <>
        {insertQueue.length > 0 && (
            <ImageInsertSlider
                items={insertQueue}
                onInsertAll={handleInsertAll}
                onCropSave={handleCropItem}
                onCancel={() => {
                    insertQueue.forEach(item => imgCore.handleRemove(item.fileProps.key));
                    setInsertQueue([]);
                }}
            />
        )}
        {editDialog && (
            <ImageEditDialog
                state={editDialog}
                onConfirm={handleEditConfirm}
                onCancel={() => setEditDialog(null)}
            />
        )}
        <div
            className={cn(
                'rounded-md border border-input bg-background shadow-sm transition-colors',
                'focus-within:ring-1 focus-within:ring-ring',
                hasError && 'border-destructive focus-within:ring-destructive/20',
                disabled && 'cursor-not-allowed opacity-50',
                className,
            )}
        >
            {/* Fixed toolbar */}
            {toolbar === 'fixed' && editor && (
                <RichTextToolbar
                    editor={editor}
                    commands={toolbarCommands}
                    sourceMode={sourceMode}
                    onImageUpload={imgCore.handleUpload}
                    onDocumentUpload={() => docInputRef.current?.click()}
                    onSourceToggle={handleSourceToggle}
                />
            )}

            {/* Floating (bubble) toolbar — appears on text selection */}
            {toolbar === 'floating' && editor && (
                <BubbleMenu editor={editor}>
                    <div className="flex items-center gap-0.5 rounded-md border border-border bg-background px-1 py-0.5 shadow-lg">
                        <RichTextToolbar
                            editor={editor}
                            commands={floatingCommands}
                            sourceMode={sourceMode}
                            onImageUpload={imgCore.handleUpload}
                            onDocumentUpload={() => docInputRef.current?.click()}
                            onSourceToggle={handleSourceToggle}
                            compact
                        />
                    </div>
                </BubbleMenu>
            )}

            {/* Link tooltip — shown when cursor is inside a link with a valid href */}
            {editor && !sourceMode && (
                <BubbleMenu
                    editor={editor}
                    shouldShow={({ editor: ed, from, to }) => {
                        if (from !== to) return false;
                        if (!ed.isActive('link')) return false;
                        return !!(ed.getAttributes('link').href as string | undefined);
                    }}
                    options={{ placement: 'bottom-start', offset: 6 }}
                >
                    {(() => {
                        const href = editor.getAttributes('link').href as string | undefined ?? '';
                        return (
                            <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 shadow-md">
                                <Icon name="link" size={12} className="shrink-0 text-muted-foreground" />
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="max-w-[220px] truncate text-xs text-primary underline"
                                >
                                    {href}
                                </a>
                                <div className="mx-0.5 h-3 w-px bg-border" />
                                <button
                                    type="button"
                                    title="Edit link"
                                    onMouseDown={ev => {
                                        ev.preventDefault();
                                        const url = window.prompt('URL', href);
                                        if (url) editor.chain().focus().setLink({ href: url }).run();
                                        else if (url === '') editor.chain().focus().unsetLink().run();
                                    }}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-muted"
                                >
                                    <Icon name="pencil" size={11} />
                                </button>
                                <button
                                    type="button"
                                    title="Remove link"
                                    onMouseDown={ev => {
                                        ev.preventDefault();
                                        editor.chain().focus().unsetLink().run();
                                    }}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-muted"
                                >
                                    <Icon name="unlink" size={11} />
                                </button>
                            </div>
                        );
                    })()}
                </BubbleMenu>
            )}

            {/* Editor area */}
            {sourceMode ? (
                <textarea
                    aria-label={`${name} source`}
                    className="w-full resize-none bg-background px-3 py-2 font-mono text-xs text-foreground outline-none"
                    style={{ minHeight: editorContentMinHeight, maxHeight, overflowY: 'auto' }}
                    value={sourceContent}
                    onChange={e => setSourceContent(e.target.value)}
                />
            ) : (
                <div
                    style={{ maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
                    className={cn(
                        'w-full px-3 py-2 text-sm',
                        '[&_.ProseMirror]:outline-none',
                        '[&_.ProseMirror_p]:my-1',
                        '[&_.ProseMirror_h1]:my-2 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold',
                        '[&_.ProseMirror_h2]:my-2 [&_.ProseMirror_h2]:text-xl  [&_.ProseMirror_h2]:font-semibold',
                        '[&_.ProseMirror_h3]:my-1 [&_.ProseMirror_h3]:text-lg  [&_.ProseMirror_h3]:font-semibold',
                        '[&_.ProseMirror_ul]:list-disc   [&_.ProseMirror_ul]:pl-6',
                        '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6',
                        '[&_.ProseMirror_blockquote]:my-2 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground',
                        '[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-xs',
                        '[&_.ProseMirror_pre]:my-2 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-3',
                        '[&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse',
                        '[&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:px-2 [&_.ProseMirror_td]:py-1',
                        '[&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:bg-muted [&_.ProseMirror_th]:px-2 [&_.ProseMirror_th]:py-1 [&_.ProseMirror_th]:font-semibold',
                        '[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:pointer-events-none',
                        '[&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
                    )}
                >
                    <EditorContent editor={editor} />
                </div>
            )}

            {/* Status bar */}
            {statusBar && editor && (
                <RichTextStatusBar editor={editor} config={statusBar} />
            )}

            {/* Hidden file inputs for upload commands */}
            <input
                ref={imgCore.fileInputRef}
                type="file"
                multiple
                accept={imageUpload?.accept ?? 'image/*'}
                className="hidden"
                onChange={e => {
                    const maxBytes = imageUpload?.maxBytes ?? 10_485_760;
                    const files = Array.from(e.target.files ?? []);
                    const oversized = files.find(f => f.size > maxBytes);
                    if (oversized) {
                        alert(`"${oversized.name}" exceeds the ${Math.round(maxBytes / 1_048_576)} MB limit.`);
                        e.target.value = '';
                        return;
                    }
                    imgCore.handleUploadChange(e);
                }}
            />
            <input
                ref={docInputRef}
                type="file"
                multiple
                accept={documentUpload?.accept ?? '.pdf,.doc,.docx,.txt,.csv'}
                className="hidden"
                onChange={e => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) void handleDocFiles(files);
                    e.target.value = '';
                }}
            />
        </div>
        </>
    );
};

// ── EXPORTED COMPONENT ────────────────────────────────────────────────────────

export const RichText = ({
    name,
    onChange          = undefined,
    defaultValue      = undefined,
    label             = undefined,
    required          = false,
    placeholder       = undefined,
    disabled          = false,
    feedback          = undefined,
    toolbar           = 'fixed',
    toolbarCommands   = DEFAULT_TOOLBAR_COMMANDS,
    outputFormat      = 'html',
    statusBar         = false,
    minHeight         = 120,
    maxHeight         = undefined,
    imageUpload       = undefined,
    documentUpload    = undefined,
    uploadPath        = undefined,
    id                = undefined,
    labelClassName    = undefined,
    inheritWrapperClassName = true,
    wrapperClassName  = undefined,
    className         = undefined,
    before            = undefined,
    after             = undefined,
    validator         = undefined,
}: RichTextProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({
        name,
        onChange,
        wrapperClassName,
        defaultValue,
        inheritWrapperClassName,
    });
    const error = useFieldValidation(name, { required, label, validator });
    const generatedId = useId();
    const elementId = id ?? generatedId;

    const [modules, setModules] = useState<TipTapModules | null>(_cachedModules);

    useEffect(() => {
        if (modules) return;
        ensureTipTap().then(setModules);
    }, [modules]);

    const handleEditorChange = useCallback(
        (content: string) => {
            handleChange?.({ target: { name, value: content } });
        },
        [handleChange, name],
    );

    const resolvedStatusBar = statusBar === false ? false : resolveStatusBarConfig(statusBar);
    const resolvedImageUpload: RichTextImageUploadConfig | undefined =
        imageUpload ?? (uploadPath ? { path: uploadPath } : undefined);

    return (
        <Wrapper className={formWrapClass}>
            {before}
            {label && (
                <Label
                    label={label}
                    required={required}
                    htmlFor={elementId}
                    className={labelClassName}
                />
            )}
            {modules ? (
                <RichTextInner
                    modules={modules}
                    name={name}
                    value={(value as string) ?? ''}
                    outputFormat={outputFormat}
                    placeholder={placeholder}
                    disabled={disabled}
                    toolbar={toolbar}
                    toolbarCommands={toolbarCommands}
                    statusBar={resolvedStatusBar}
                    minHeight={minHeight}
                    maxHeight={maxHeight}
                    imageUpload={resolvedImageUpload}
                    documentUpload={documentUpload}
                    hasError={!!error}
                    className={className}
                    onEditorChange={handleEditorChange}
                />
            ) : (
                <div
                    className={cn(
                        'rounded-md border border-input bg-muted/30 shadow-sm',
                        error && 'border-destructive',
                    )}
                    style={{ minHeight }}
                    aria-busy="true"
                    aria-label={label}
                />
            )}
            {after}
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>
            }
        </Wrapper>
    );
};

export default RichText;
