import React, { useId, useEffect, useState, useCallback, useRef, Fragment } from 'react';
import type { Editor } from '@tiptap/core';
import { Wrapper } from '../GridSystem';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import type { FieldValue } from '../../../providers/data/DataProvider';
import { Label, FieldError, fieldFeedbackClass } from './Input';
import { cn } from '../../../libs/cn';
import Icon from '../Icon';
import { useStorageProvider } from '../../../providers/storage/StorageProviderContext';

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
    /** StorageProvider path used by imageUpload and documentUpload toolbar commands. */
    uploadPath?: string;
    id?: string;
    labelClassName?: string;
    validator?: (value: FieldValue) => string | undefined;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const DEFAULT_TOOLBAR_COMMANDS: ToolbarCommand[] = [
    'bold', 'italic', 'underline', 'strike', '|',
    'heading1', 'heading2', 'heading3', '|',
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
    bold:        { icon: 'text-b',            label: 'Bold',          isActive: e => e.isActive('bold'),                      execute: e => e.chain().focus().toggleBold().run() },
    italic:      { icon: 'text-italic',       label: 'Italic',        isActive: e => e.isActive('italic'),                    execute: e => e.chain().focus().toggleItalic().run() },
    underline:   { icon: 'text-underline',    label: 'Underline',     isActive: e => e.isActive('underline'),                 execute: e => e.chain().focus().toggleUnderline().run() },
    strike:      { icon: 'text-strikethrough',label: 'Strikethrough', isActive: e => e.isActive('strike'),                   execute: e => e.chain().focus().toggleStrike().run() },
    heading1:    { icon: 'text-h-one',        label: 'Heading 1',     isActive: e => e.isActive('heading', { level: 1 }),     execute: e => e.chain().focus().toggleHeading({ level: 1 }).run() },
    heading2:    { icon: 'text-h-two',        label: 'Heading 2',     isActive: e => e.isActive('heading', { level: 2 }),     execute: e => e.chain().focus().toggleHeading({ level: 2 }).run() },
    heading3:    { icon: 'text-h-three',      label: 'Heading 3',     isActive: e => e.isActive('heading', { level: 3 }),     execute: e => e.chain().focus().toggleHeading({ level: 3 }).run() },
    bulletList:  { icon: 'list',              label: 'Bullet List',   isActive: e => e.isActive('bulletList'),                execute: e => e.chain().focus().toggleBulletList().run() },
    orderedList: { icon: 'list-numbers',      label: 'Ordered List',  isActive: e => e.isActive('orderedList'),               execute: e => e.chain().focus().toggleOrderedList().run() },
    blockquote:  { icon: 'quotes',            label: 'Blockquote',    isActive: e => e.isActive('blockquote'),                execute: e => e.chain().focus().toggleBlockquote().run() },
    code:        { icon: 'code',              label: 'Inline Code',   isActive: e => e.isActive('code'),                     execute: e => e.chain().focus().toggleCode().run() },
    codeBlock:   { icon: 'code-block',        label: 'Code Block',    isActive: e => e.isActive('codeBlock'),                 execute: e => e.chain().focus().toggleCodeBlock().run() },
    link:        { icon: 'link',              label: 'Link',          isActive: e => e.isActive('link'),                     execute: e => { const url = window.prompt('URL'); if (url) e.chain().focus().setLink({ href: url }).run(); else e.chain().focus().unsetLink().run(); } },
    table:       { icon: 'table',             label: 'Insert Table',                                                          execute: e => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    undo:        { icon: 'arrow-counter-clockwise', label: 'Undo',                                                            execute: e => e.chain().focus().undo().run() },
    redo:        { icon: 'arrow-clockwise',   label: 'Redo',                                                                  execute: e => e.chain().focus().redo().run() },
    clearFormat: { icon: 'text-t',            label: 'Clear Format',                                                          execute: e => e.chain().focus().clearNodes().unsetAllMarks().run() },
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

const RichTextToolbar = ({ editor, commands, sourceMode, onImageUpload, onDocumentUpload, onSourceToggle, compact }: ToolbarProps) => (
    <div className={cn('flex flex-wrap items-center gap-0.5 px-2 py-1', !compact && 'border-b border-border')}>
        {commands.map((cmd, i) => {
            if (cmd === '|') return <div key={i} className="mx-0.5 h-4 w-px bg-border" />;

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
                    <Icon name="file-arrow-up" size={14} />
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
    uploadPath: string | undefined;
    hasError: boolean;
    className: string | undefined;
    onEditorChange: (content: string) => void;
}

const RichTextInner = ({
    modules, name, value, outputFormat, placeholder, disabled,
    toolbar, toolbarCommands, statusBar, minHeight, maxHeight,
    uploadPath, hasError, className, onEditorChange,
}: RichTextInnerProps) => {
    const { useEditor, EditorContent } = modules[0];
    const { BubbleMenu }               = modules[1];
    const StarterKit                   = modules[2].default;
    const Underline                    = modules[3].default;
    const Link                         = modules[4].default;
    const Image                        = modules[5].default;
    const { Table, TableRow, TableHeader, TableCell } = modules[6];
    const Placeholder                  = modules[7].default;
    const CharacterCount               = modules[8].default;

    const [sourceMode, setSourceMode] = useState(false);
    const [sourceContent, setSourceContent] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef   = useRef<HTMLInputElement>(null);
    const storage       = useStorageProvider();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({ placeholder: placeholder ?? '' }),
            CharacterCount,
        ],
        content: value || '',
        editable: !disabled,
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

    // Source mode: toggle between WYSIWYG and raw HTML textarea.
    const handleSourceToggle = () => {
        if (!editor) return;
        if (!sourceMode) setSourceContent(editor.getHTML());
        else editor.commands.setContent(sourceContent);
        setSourceMode(s => !s);
    };

    // Upload helpers — use StorageProvider when available, fall back to data URL.
    const uploadAndInsert = async (file: File, insert: (url: string) => void) => {
        const reader = new FileReader();
        reader.onload = async ev => {
            const dataUrl = ev.target?.result as string;
            if (storage && uploadPath) {
                const url = await storage.upload(dataUrl, `${uploadPath}/${file.name}`);
                if (url) insert(url);
            } else {
                insert(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageFile = (file: File) => {
        if (!editor) return;
        uploadAndInsert(file, url => editor.chain().focus().setImage({ src: url }).run());
    };

    const handleDocFile = (file: File) => {
        if (!editor) return;
        uploadAndInsert(file, url =>
            editor.chain().focus().setLink({ href: url }).insertContent(file.name).run()
        );
    };

    // Floating toolbar commands exclude upload/source (they need separate triggers).
    const floatingCommands = toolbarCommands.filter(
        c => c !== 'imageUpload' && c !== 'documentUpload' && c !== 'sourceCode'
    );

    return (
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
                    onImageUpload={() => imageInputRef.current?.click()}
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
                            onImageUpload={() => imageInputRef.current?.click()}
                            onDocumentUpload={() => docInputRef.current?.click()}
                            onSourceToggle={handleSourceToggle}
                            compact
                        />
                    </div>
                </BubbleMenu>
            )}

            {/* Editor area */}
            {sourceMode ? (
                <textarea
                    aria-label={`${name} source`}
                    className="w-full resize-none bg-background px-3 py-2 font-mono text-xs text-foreground outline-none"
                    style={{ minHeight, maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
                    value={sourceContent}
                    onChange={e => setSourceContent(e.target.value)}
                />
            ) : (
                <div
                    style={{ minHeight, maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
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
                        '[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline',
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
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f);
                    e.target.value = '';
                }}
            />
            <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv"
                className="hidden"
                onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleDocFile(f);
                    e.target.value = '';
                }}
            />
        </div>
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
                    uploadPath={uploadPath}
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
