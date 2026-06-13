import React, { useEffect, useRef, useState } from "react";
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

export interface FileProps {
    key: string;
    fileName: string;
    size: number;
    type: string;
    progress: number;
    url: string;
    base64?: string;
    variants: Record<string, any>; /* CR-042: heterogeneous crop/scale variant objects */
}

const useFileUpload = <T extends FileProps>(
    name: string,
    //value?: Array<T>,
    onChange?: FieldOnChange,
    wrapperClassName?: string
) => {
    const { value, handleChange, formWrapClass } = useFormContext({name, onChange, wrapperClassName});
    const [files, setFiles] = useState<T[]>(Array.isArray(value) ? value as unknown as T[] : []);
    const [currentFile, setCurrentFile] = useState<T | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Sync files → Form record via effect instead of inside setFiles callbacks.
    // Calling handleChange (parent setState) inside a state updater triggers React 18's
    // "Cannot update a component while rendering a different component" error.
    useEffect(() => {
        handleChange({ target: { name, value: files } });
    }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateFile = (key: string, updates: Partial<T>) => {
        setFiles(prev => prev.map(f => f.key === key ? { ...f, ...updates } : f));
    };

    const removeFile = (key: string) => {
        setFiles(prev => prev.filter(f => f.key !== key));
    };

    const handleSave = (updates: Partial<T>) => {
        if (!currentFile) return;
 
        updateFile(currentFile.key, updates);
        setCurrentFile(null);
    };

    const handleEdit = (file: T) => setCurrentFile(file);
    const handleClose = () => setCurrentFile(null);

    const handleFiles = (selectedFiles: File[]) => {
        setFiles(prev => {
            const updatedFiles = [...prev];

            selectedFiles.forEach(file => {
                const newFile = {
                    key: file.name,
                    fileName: file.name,
                    size: file.size,
                    type: file.type,
                    progress: 0,
                    base64: '',
                    variants: {}
                } as T;
                
                const existingIndex = updatedFiles.findIndex(f => f.key === file.name);
                if (existingIndex !== -1) {
                    updatedFiles[existingIndex] = newFile;
                } else {
                    updatedFiles.push(newFile);
                }

                const reader = new FileReader();
                reader.onprogress = e => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        updateFile(newFile.key, { progress: percent } as Partial<T>);
                    }
                };

                reader.onloadend = () => {
                    updateFile(newFile.key, { progress: 99 } as Partial<T>);
                    setTimeout(() => {
                        updateFile(newFile.key, {
                            progress: 100,
                            base64: `data:${file.type};base64,${render2Base64(reader.result as ArrayBuffer)}`
                        } as Partial<T>);
                    }, 500);
                };

                reader.readAsArrayBuffer(file);
            });
            
            return updatedFiles;
        });
        
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(Array.from(event.target.files || []));
    };

    return {
        files,
        currentFile,
        fileInputRef,
        formWrapClass,
        handleFiles,
        handleUploadChange,
        handleUpload: () => fileInputRef.current?.click(),
        handleRemove: (key: string) => {
            removeFile(key);
        },
        handleSave,
        handleEdit,
        handleClose
    };
};

export interface UploadDocumentProps extends FormFieldProps {
    editable?: boolean;
    multiple?: boolean;
    accept?: string;
    max?: number;
}

export interface UploadImageProps extends UploadDocumentProps {
    previewHeight?: number;
    previewWidth?: number;
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
    name,
    fileInputRef,
    accept,
    onUpload,
    onChange,
    required = false,
    multiple = false,
    height,
    width,
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
            name={name}
            type="file"
            accept={accept}
            ref={fileInputRef}
            multiple={multiple}
            required={required}
            className="hidden"
            onChange={onChange}
        />
    </>
);

const FileEditor = ({
    title,
    file,
    type,
    onSave = undefined,
    onClose = undefined
}: FileEditorProps) => {
    const [fileName, setFileName] = useState(file.fileName);

    const cropRef = useRef<{
        handleSave: () => {
            fileName: string;
            variants: Record<string, any>; /* CR-042 */
        };
    }>(null);

    const handleSave = async (): Promise<boolean> => {
        if (cropRef.current) {
            onSave?.(cropRef.current.handleSave());
        } else {
            onSave?.({ fileName, variants: {} });
        }
        return true;
    };

    return (
        <Modal
            title={title}
            onSave={handleSave}
            onClose={onClose}
            size={type === 'img' ? "fullscreen" : undefined}
        >
            {type === 'document' &&
                <FileNameEditor
                    value={fileName}
                    onChange={setFileName}
                    label={"File name"}
                />}

            {type === 'img' &&
                <CropImage
                    ref={cropRef}
                    img={file}
                />
            }
        </Modal>
    )
}
const isUploadable = (files: FileProps[], max: number, multiple: boolean) => {
    return files.length < max && (multiple || files.length === 0);
}

const urlCache = new Map<string, string>();
export const getFileUrl = (file: FileProps, suffix: string = "origin"): string => {
    if (file.base64) {
        const fileKey = `${file.fileName} ${suffix}`;
        if (!urlCache.has(fileKey)) {
            urlCache.set(fileKey, base64ToUrl(file.base64, file.type) ?? PLACEHOLDER_IMAGE);
        }
        return urlCache.get(fileKey) ?? PLACEHOLDER_IMAGE;  
    }
    return file.url;
};

export const UploadDocument = ({
    name,
    onChange    = undefined,
    label       = undefined,
    required    = false,
    editable    = false,
    multiple    = false,
    max         = 100,
    accept      = ".pdf,.doc,.docx,.txt,.iso",
    before      = undefined,
    after       = undefined,
    wrapperClassName = undefined,
    className   = undefined,
}: UploadDocumentProps) => {
    const { files, currentFile, fileInputRef, formWrapClass, handleFiles, handleUploadChange, handleUpload, handleRemove, handleSave, handleEdit, handleClose } = useFileUpload<FileProps>(name, onChange, wrapperClassName);
    const error = useFieldValidation(name, { required, label });
    const dict = useI18n('upload');
    const [dragOver, setDragOver] = useState(false);

    const canUpload = isUploadable(files, max, multiple);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (canUpload) setDragOver(true);
    };
    const handleDragLeave = () => setDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (!canUpload) return;
        const dropped = Array.from(e.dataTransfer.files);
        handleFiles(multiple ? dropped : dropped.slice(0, 1));
    };

    return (
        <Wrapper className={formWrapClass}>
            {before}
            <div className={className}>
                {label && <Label label={label} required={required} />}

                {/* Drop zone — shown when empty or can still accept more files */}
                {canUpload && files.length === 0 && (
                    <button
                        type="button"
                        onClick={handleUpload}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
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

                {/* File list */}
                {files.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody>
                                {files.map((file) => (
                                    <tr
                                        key={file.key}
                                        className={`border-b border-border last:border-0 ${editable ? 'cursor-pointer hover:bg-muted/40' : ''}`}
                                        onClick={() => editable && handleEdit(file)}
                                    >
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <Icon name="file" className="w-4 h-4 shrink-0 text-muted-foreground" />
                                                {file.progress === 100
                                                    ? <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs" onClick={e => e.stopPropagation()}>{file.fileName}</a>
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
                                            <button
                                                type="button"
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

                        {/* Add more — inline at bottom of table */}
                        {canUpload && (
                            <div
                                className={`px-3 py-2 border-t border-border bg-muted/20 ${dragOver ? 'bg-primary/5' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Icon name="upload" className="w-3.5 h-3.5" />
                                    {dict.uploadMore}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <input
                    name={name}
                    type="file"
                    accept={accept}
                    ref={fileInputRef}
                    multiple={multiple}
                    required={required}
                    className="hidden"
                    onChange={handleUploadChange}
                />

                {error && <FieldError message={error} />}
            </div>
            {editable && currentFile && (
                <FileEditor
                    title={dict.editFileName}
                    file={currentFile}
                    type="document"
                    onSave={handleSave}
                    onClose={handleClose}
                />
            )}
            {after}
        </Wrapper>
    );
};

export const UploadImage = ({
    name,
    //value           = undefined,
    onChange        = undefined,
    label           = undefined,
    editable        = false,
    multiple        = false,
    accept          = "image/*",
    required        = false,
    max             = 100,
    previewHeight   = 100,
    previewWidth    = 100,
    before             = undefined,
    after            = undefined,
    wrapperClassName       = undefined,
    className       = undefined,
}: UploadImageProps) => {
    const { files, currentFile, fileInputRef, formWrapClass, handleUploadChange, handleUpload, handleRemove, handleSave, handleEdit, handleClose } = useFileUpload<FileProps>(name, onChange, wrapperClassName);
    const error = useFieldValidation(name, { required, label });
    const dict = useI18n('upload');

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const ScaleBadge = ({scales}: {scales: Record<string, FileProps>}) => {
        if(!scales) return undefined;
        const keys = Object.keys(scales);
        if (keys.length === 0) return null;
        return keys
            .map((key) => (
                <Badge key={key}><a href={getFileUrl(scales[key], key)} className="text-white" target="_blank" rel="noopener noreferrer">{key}</a></Badge>
            ))
        
    }
    
    return (
        <Wrapper className={formWrapClass}>
            {before}
            <Wrapper className={className}>
                {label && <Label label={label} required={required} />}
                <div className="flex gap-2 flex-wrap">
                    {files.map((img, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden rounded-lg"
                            style={{ width: previewWidth, height: previewHeight }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {img.progress === 100 ? (
                                <>
                                    <img
                                        src={getFileUrl(img)}
                                        alt={`preview-${i}`}
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                    <div
                                        className="absolute inset-0 rounded-lg bg-black/55 backdrop-blur-[1px] flex flex-col items-center justify-end pb-2 gap-1 transition-opacity"
                                        style={{ display: hoveredIndex === i ? "flex" : "none" }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <a
                                                href={getFileUrl(img)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                                            >
                                                <Icon name="eye" className="w-4 h-4" />
                                            </a>
                                            {editable && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(img)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors"
                                                >
                                                    <Icon name="pencil" className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(img.key); }}
                                                className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/70 hover:bg-red-500/90 text-white transition-colors"
                                            >
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

                    {isUploadable(files, max, multiple) && <ImageFilePlaceholder
                        name={name}
                        fileInputRef={fileInputRef}
                        accept={accept}
                        onUpload={handleUpload}
                        onChange={handleUploadChange}
                        required={required}
                        multiple={multiple}
                        height={previewHeight}
                        width={previewWidth}
                    />}
                </div>
                {error && <FieldError message={error} />}
            </Wrapper>

            {editable && currentFile && (
                <FileEditor
                    title={dict.editorImage}
                    file={currentFile}
                    type="img"
                    onSave={handleSave}
                    onClose={handleClose}
                />
            )}
            {after}
        </Wrapper>
    );
};
