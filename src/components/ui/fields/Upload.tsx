import React, { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../../../I18n";
import Modal from "../Modal";
import Badge from "../Badge";
import Percentage from "../Percentage";
import { CropImage, FileNameEditor } from "./Crop";
import { Label } from "./Input";
import { Wrapper } from "../GridSystem";
import { base64ToUrl, render2Base64 } from "../../../libs/utils";
import { PLACEHOLDER_IMAGE } from "../../../Theme";
import Icon from "../Icon";
import { FormFieldProps, FieldOnChange, useFormContext, useFieldValidation } from "../../widgets/Form";
import { FieldError } from "./Input";
import { useStorageProvider } from "../../../providers/storage/StorageProviderContext";
import { resizeVariants } from "../../../libs/imageBuilder";

export interface FileProps {
    key: string;
    fileName: string;
    size: number;
    type: string;
    progress: number;
    url: string;
    base64?: string;
    variants: Record<string, any>; /* CR-042: heterogeneous crop/scale variant objects */
    srcset?: string;   // width-based srcset string, populated when srcsetWidths is set
    sizes?: string;    // CSS sizes attribute for srcset
}

// ── CORE UPLOAD HOOK ──────────────────────────────────────────────────────────
// Headless: no Form context, no JSX. Both UploadImage and RichText use this.

export interface UseFileUploadCoreOptions {
    /** Called on every files state update. Use for Form sync. */
    onFilesChange?: (files: FileProps[]) => void;
    /** Called once when a file reaches progress 100. Use to trigger insert dialogs. */
    onFileReady?: (file: FileProps) => void;
    /** StorageProvider path. When set with a storage provider, files are auto-uploaded. */
    uploadPath?: string;
    /**
     * Pixel widths for responsive image variants. When set with uploadPath, generates
     * canvas-resized variants at each width and populates file.srcset / file.sizes.
     * Each variant is stored as <name>_<width>w.<ext>. Default: undefined (no variants).
     * Example: [400, 800] produces _400w and _800w files.
     */
    srcsetWidths?: number[];
    /** Initial file list (e.g. from a form record on load). */
    initialFiles?: FileProps[];
}

export const useFileUploadCore = ({
    onFilesChange,
    onFileReady,
    uploadPath,
    srcsetWidths,
    initialFiles,
}: UseFileUploadCoreOptions) => {
    const [files, setFiles] = useState<FileProps[]>(initialFiles ?? []);
    const storage           = useStorageProvider();
    const fileInputRef      = useRef<HTMLInputElement | null>(null);

    // Stable refs so callbacks don't need to be in useEffect deps
    const onFilesChangeRef = useRef(onFilesChange);
    onFilesChangeRef.current = onFilesChange;
    const onFileReadyRef = useRef(onFileReady);
    onFileReadyRef.current = onFileReady;
    const notifiedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        onFilesChangeRef.current?.(files);
        for (const f of files) {
            if (f.progress === 100 && !notifiedRef.current.has(f.key)) {
                notifiedRef.current.add(f.key);
                onFileReadyRef.current?.(f);
            }
        }
    }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateFile = useCallback((key: string, updates: Partial<FileProps>) => {
        setFiles(prev => prev.map(f => f.key === key ? { ...f, ...updates } : f));
    }, []);

    const removeFile = useCallback((key: string) => {
        setFiles(prev => prev.filter(f => f.key !== key));
        notifiedRef.current.delete(key);
    }, []);

    const handleFiles = useCallback((selectedFiles: File[]) => {
        // Step 1 — add placeholder entries to state (pure, no side effects in updater)
        setFiles(prev => {
            const next = [...prev];
            selectedFiles.forEach(file => {
                const entry: FileProps = {
                    key: file.name, fileName: file.name,
                    size: file.size, type: file.type,
                    progress: 0, url: '', base64: '', variants: {},
                };
                const idx = next.findIndex(f => f.key === file.name);
                if (idx !== -1) next[idx] = entry; else next.push(entry);
            });
            return next;
        });

        // Step 2 — start FileReaders outside the state updater so they run exactly once
        selectedFiles.forEach(file => {
            const reader = new FileReader();

            reader.onprogress = e => {
                if (e.lengthComputable)
                    updateFile(file.name, { progress: Math.round((e.loaded / e.total) * 75) });
            };

            reader.onloadend = async () => {
                const base64  = render2Base64(reader.result as ArrayBuffer);
                const dataUri = `data:${file.type};base64,${base64}`;
                updateFile(file.name, { base64, progress: 80 });

                if (srcsetWidths?.length) {
                    // Generate variants locally first, then upload if storage is available
                    try {
                        const variants = await resizeVariants(dataUri, srcsetWidths);
                        const resolved: Array<{ src: string; width: number }> = [];
                        for (const v of variants) {
                            if (storage && uploadPath) {
                                const baseName = file.name.replace(/\.[^/.]+$/, '');
                                const ext      = file.name.split('.').pop() ?? 'jpg';
                                const url = await storage.upload(v.src, `${uploadPath}/${baseName}_${v.width}w.${ext}`);
                                resolved.push({ src: url ?? v.src, width: v.width });
                            } else {
                                // Convert data URI → blob URL: data URIs contain commas which
                                // break srcset string parsing (format: "url1 400w, url2 800w")
                                const blob = await fetch(v.src).then(r => r.blob());
                                resolved.push({ src: URL.createObjectURL(blob), width: v.width });
                            }
                        }
                        if (resolved.length > 0) {
                            updateFile(file.name, {
                                url:    resolved.at(-1)!.src,
                                srcset: resolved.map(v => `${v.src} ${v.width}w`).join(', '),
                                sizes:  '(max-width: 640px) 100vw, 800px',
                                progress: 100,
                            });
                            return;
                        }
                    } catch { /* fall through to fallback */ }
                } else if (storage && uploadPath) {
                    try {
                        const url = await storage.upload(dataUri, `${uploadPath}/${file.name}`);
                        if (url) {
                            updateFile(file.name, { url, progress: 100 });
                            return;
                        }
                    } catch { /* fall through to fallback */ }
                }

                // Fallback: keep base64 only
                updateFile(file.name, { progress: 100 });
            };

            reader.readAsArrayBuffer(file);
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [storage, uploadPath, srcsetWidths, updateFile]);

    const handleUploadChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(Array.from(e.target.files ?? []));
    }, [handleFiles]);

    return {
        files,
        setFiles,
        fileInputRef,
        updateFile,
        handleFiles,
        handleUpload: () => fileInputRef.current?.click(),
        handleUploadChange,
        handleRemove: removeFile,
    };
};

// ── FORM-CONNECTED WRAPPER ────────────────────────────────────────────────────
// Used by UploadDocument and UploadImage — connects core to Form context.

const useFileUpload = (
    name: string,
    onChange?: FieldOnChange,
    wrapperClassName?: string,
    uploadPath?: string,
    srcsetWidths?: number[],
) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName });
    const [currentFile, setCurrentFile] = useState<FileProps | null>(null);

    const core = useFileUploadCore({
        initialFiles:   Array.isArray(value) ? (value as FileProps[]) : [],
        onFilesChange:  (files) => handleChange({ target: { name, value: files } }),
        uploadPath,
        srcsetWidths,
    });

    const handleSave = (updates: Partial<FileProps>) => {
        if (!currentFile) return;
        core.updateFile(currentFile.key, updates);
        setCurrentFile(null);
    };

    return {
        ...core,
        formWrapClass,
        currentFile,
        handleSave,
        handleEdit:  (file: FileProps) => setCurrentFile(file),
        handleClose: () => setCurrentFile(null),
    };
};

// ── SHARED UTILITIES ──────────────────────────────────────────────────────────

export interface UploadDocumentProps extends FormFieldProps {
    editable?: boolean;
    multiple?: boolean;
    accept?: string;
    max?: number;
    /** StorageProvider path — when set, files are auto-uploaded on selection. */
    uploadPath?: string;
}

export interface UploadImageProps extends UploadDocumentProps {
    previewHeight?: number;
    previewWidth?: number;
    /** Pixel widths for responsive variants. Set with uploadPath to generate <name>_400w.jpg etc. and populate srcset/sizes in the Form record. */
    srcsetWidths?: number[];
}

interface FileEditorProps {
    title: string;
    file: FileProps;
    type: 'img' | 'document';
    onSave?: (result: { fileName: string; variants: Record<string, any> /* CR-042 */ }) => void;
    onClose?: () => void;
}

interface ImagePlaceholderProps {
    name: string;
    fileInputRef: React.RefObject<HTMLInputElement>;
    accept: string;
    onUpload: () => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    multiple?: boolean;
    height: number;
    width: number;
}

const ImageFilePlaceholder = ({
    name, fileInputRef, accept, onUpload, onChange,
    required = false, multiple = false, height, width,
}: ImagePlaceholderProps) => (
    <>
        <button
            type="button"
            onClick={onUpload}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 text-muted-foreground/50 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary/60 cursor-pointer"
            style={{ width, height }}
        >
            <Icon name="upload" className="w-8 h-8" />
        </button>
        <input
            name={name} type="file" accept={accept}
            ref={fileInputRef} multiple={multiple} required={required}
            className="hidden" onChange={onChange}
        />
    </>
);

const FileEditor = ({ title, file, type, onSave, onClose }: FileEditorProps) => {
    const [fileName, setFileName] = useState(file.fileName);
    const cropRef = useRef<{
        handleSave: () => { fileName: string; variants: Record<string, any> };
    }>(null);

    const handleSave = async (): Promise<boolean> => {
        onSave?.(cropRef.current ? cropRef.current.handleSave() : { fileName, variants: {} });
        return true;
    };

    return (
        <Modal title={title} onSave={handleSave} onClose={onClose}
               size={type === 'img' ? 'fullscreen' : undefined}>
            {type === 'document' && (
                <FileNameEditor value={fileName} onChange={setFileName} label="File name" />
            )}
            {type === 'img' && <CropImage ref={cropRef} img={file} />}
        </Modal>
    );
};

const isUploadable = (files: FileProps[], max: number, multiple: boolean) =>
    files.length < max && (multiple || files.length === 0);

const urlCache = new Map<string, string>();
export const getFileUrl = (file: FileProps, suffix = 'origin'): string => {
    // Prefer the storage URL when available (set after a successful upload).
    if (file.url) return file.url;
    if (file.base64) {
        const fileKey = `${file.fileName} ${suffix}`;
        if (!urlCache.has(fileKey))
            urlCache.set(fileKey, base64ToUrl(file.base64, file.type) ?? PLACEHOLDER_IMAGE);
        return urlCache.get(fileKey) ?? PLACEHOLDER_IMAGE;
    }
    return '';
};

// ── UPLOAD DOCUMENT ───────────────────────────────────────────────────────────

export const UploadDocument = ({
    name,
    onChange         = undefined,
    label            = undefined,
    required         = false,
    editable         = false,
    multiple         = false,
    max              = 100,
    accept           = '.pdf,.doc,.docx,.txt,.iso',
    uploadPath       = undefined,
    before           = undefined,
    after            = undefined,
    wrapperClassName = undefined,
    className        = undefined,
}: UploadDocumentProps) => {
    const {
        files, currentFile, fileInputRef, formWrapClass,
        handleFiles, handleUploadChange, handleUpload, handleRemove,
        handleSave, handleEdit, handleClose,
    } = useFileUpload(name, onChange, wrapperClassName, uploadPath);
    const error = useFieldValidation(name, { required, label });
    const dict  = useI18n('upload');
    const [dragOver, setDragOver] = useState(false);

    const canUpload = isUploadable(files, max, multiple);

    const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); if (canUpload) setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);
    const handleDrop      = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        if (!canUpload) return;
        handleFiles(multiple ? Array.from(e.dataTransfer.files) : [e.dataTransfer.files[0]]);
    };

    return (
        <Wrapper className={formWrapClass}>
            {before}
            <div className={className}>
                {label && <Label label={label} required={required} />}

                {canUpload && files.length === 0 && (
                    <button
                        type="button" onClick={handleUpload}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        className={[
                            'w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 px-4 transition-colors cursor-pointer',
                            dragOver
                                ? 'border-primary/60 bg-primary/8 text-primary'
                                : 'border-muted-foreground/25 bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary/70',
                        ].join(' ')}
                    >
                        <Icon name="upload" className="w-8 h-8" />
                        <span className="text-sm font-medium">
                            {dragOver ? dict.dropToUpload : dict.clickOrDrag}
                        </span>
                        <span className="text-xs opacity-60">{accept}</span>
                    </button>
                )}

                {files.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody>
                                {files.map(file => (
                                    <tr key={file.key}
                                        className={`border-b border-border last:border-0 ${editable ? 'cursor-pointer hover:bg-muted/40' : ''}`}
                                        onClick={() => editable && handleEdit(file)}
                                    >
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <Icon name="file" className="w-4 h-4 shrink-0 text-muted-foreground" />
                                                {file.progress === 100
                                                    ? <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer"
                                                         className="hover:underline truncate max-w-xs"
                                                         onClick={e => e.stopPropagation()}>{file.fileName}</a>
                                                    : <span className="truncate max-w-xs text-muted-foreground">{file.fileName}</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-muted-foreground text-right whitespace-nowrap w-24">
                                            {file.progress === 100
                                                ? (file.size / 1024).toFixed(2) + ' KB'
                                                : <Percentage max={100} min={0} value={file.progress} appearance="bar" />
                                            }
                                        </td>
                                        <td className="px-3 py-2.5 w-10 text-right">
                                            <button type="button"
                                                onClick={e => { e.stopPropagation(); handleRemove(file.key); }}
                                                className="flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
                                            >
                                                <Icon name="x" className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {canUpload && (
                            <div className={`px-3 py-2 border-t border-border bg-muted/20 ${dragOver ? 'bg-primary/5' : ''}`}
                                 onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                <button type="button" onClick={handleUpload}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                    <Icon name="upload" className="w-3.5 h-3.5" />
                                    {dict.uploadMore}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <input name={name} type="file" accept={accept} ref={fileInputRef}
                       multiple={multiple} required={required} className="hidden"
                       onChange={handleUploadChange} />

                {error && <FieldError message={error} />}
            </div>

            {editable && currentFile && (
                <FileEditor title={dict.editFileName} file={currentFile} type="document"
                            onSave={handleSave} onClose={handleClose} />
            )}
            {after}
        </Wrapper>
    );
};

// ── UPLOAD IMAGE ──────────────────────────────────────────────────────────────

export const UploadImage = ({
    name,
    onChange         = undefined,
    label            = undefined,
    editable         = false,
    multiple         = false,
    accept           = 'image/*',
    required         = false,
    max              = 100,
    previewHeight    = 100,
    previewWidth     = 100,
    uploadPath       = undefined,
    srcsetWidths     = undefined,
    before           = undefined,
    after            = undefined,
    wrapperClassName = undefined,
    className        = undefined,
}: UploadImageProps) => {
    const {
        files, currentFile, fileInputRef, formWrapClass,
        handleUploadChange, handleUpload, handleRemove,
        handleSave, handleEdit, handleClose,
    } = useFileUpload(name, onChange, wrapperClassName, uploadPath, srcsetWidths);
    const error = useFieldValidation(name, { required, label });
    const dict  = useI18n('upload');

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const ScaleBadge = ({ scales }: { scales: Record<string, FileProps> }) => {
        if (!scales) return undefined;
        const keys = Object.keys(scales);
        if (keys.length === 0) return null;
        return keys.map(key => (
            <Badge key={key}>
                <a href={getFileUrl(scales[key], key)} className="text-white" target="_blank" rel="noopener noreferrer">
                    {key}
                </a>
            </Badge>
        ));
    };

    return (
        <Wrapper className={formWrapClass}>
            {before}
            <Wrapper className={className}>
                {label && <Label label={label} required={required} />}
                <div className="flex gap-2 flex-wrap">
                    {files.map((img, i) => (
                        <div key={i} className="relative overflow-hidden rounded-lg"
                             style={{ width: previewWidth, height: previewHeight }}
                             onMouseEnter={() => setHoveredIndex(i)}
                             onMouseLeave={() => setHoveredIndex(null)}>
                            {img.progress === 100 ? (
                                <>
                                    <img src={getFileUrl(img)} alt={`preview-${i}`}
                                         className="object-cover w-full h-full rounded-lg" />
                                    <div className="absolute inset-0 rounded-lg bg-black/55 backdrop-blur-[1px] flex flex-col items-center justify-end pb-2 gap-1 transition-opacity"
                                         style={{ display: hoveredIndex === i ? 'flex' : 'none' }}>
                                        <div className="flex items-center gap-1.5">
                                            <a href={getFileUrl(img)} target="_blank" rel="noopener noreferrer"
                                               className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors">
                                                <Icon name="eye" className="w-4 h-4" />
                                            </a>
                                            {editable && (
                                                <button type="button" onClick={() => handleEdit(img)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors">
                                                    <Icon name="pencil" className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button type="button"
                                                onClick={e => { e.preventDefault(); e.stopPropagation(); handleRemove(img.key); }}
                                                className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/70 hover:bg-red-500/90 text-white transition-colors">
                                                <Icon name="x" className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {editable && img.variants && Object.keys(img.variants).length > 0 && (
                                            <div className="flex flex-wrap gap-1 px-1">
                                                <ScaleBadge scales={img.variants} />
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Percentage max={100} min={0} value={img.progress} appearance="circle" />
                            )}
                        </div>
                    ))}

                    {isUploadable(files, max, multiple) && (
                        <ImageFilePlaceholder
                            name={name} fileInputRef={fileInputRef} accept={accept}
                            onUpload={handleUpload} onChange={handleUploadChange}
                            required={required} multiple={multiple}
                            height={previewHeight} width={previewWidth}
                        />
                    )}
                </div>
                {error && <FieldError message={error} />}
            </Wrapper>

            {editable && currentFile && (
                <FileEditor title={dict.editorImage} file={currentFile} type="img"
                            onSave={handleSave} onClose={handleClose} />
            )}
            {after}
        </Wrapper>
    );
};
