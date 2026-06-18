import React, {useRef, useEffect, useCallback, useState} from 'react';
import { useI18n } from "../../I18n";
import Modal from "../ui/Modal";
import {LoadingButton} from "../ui/Buttons";
import Icon from "../ui/Icon";
import { cn } from "../../libs/cn";

export type ImageEditorProps = {
    src: string;
    title?: string;
    width?: number;
    height?: number;
    mode?: "modal" | "inline";
    onImageLoad?: () => void;
    onClose?: () => void;
    onSave?: (dataUrl: string) => void;
};

type DrawingMode =
    | 'ZOOMIN'
    | 'ZOOMOUT'
    | 'UNDO'
    | 'REDO'
    | 'CROPPER'
    | 'FLIPX'
    | 'FLIPY'
    | 'ROTATE'
    | 'FREE_DRAWING'
    | 'LINE_DRAWING'
    | 'TEXT'
    | 'circle'
    | 'rect'
    | 'triangle';

type LineDrawingOptions = {
    width?: number;
    color?: string;
    arrowType?: {
        tail?: string;
        head?: string;
    };
};

const Divider = () => <div className="h-5 w-px bg-border shrink-0 mx-0.5" />;

const ImageEditor = ({
                         src,
                         title          = undefined,
                         width          = 700,
                         height         = 500,
                         mode           = "inline",
                         onImageLoad    = undefined,
                         onClose        = undefined,
                         onSave         = undefined
}: ImageEditorProps) => {
    const dict = useI18n('imageEditor');
    const rootEl = useRef<HTMLDivElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageEditorInst = useRef<any>(null); // CR-042: tui-image-editor has no TS types
    const objStyle = {
        width: 10,
        color: 'rgba(255,0,0,0.5)',
        fill: 'transparent'
    };

    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!rootEl.current) return;

        let editor: any; // CR-042: tui-image-editor has no TS types; dynamic import returns untyped class instance
        let cancelled = false;

        const initEditor = async () => {
            const [{ default: TuiImageEditor }] = await Promise.all([
                import('tui-image-editor'),
                import('tui-image-editor/dist/tui-image-editor.css'),
            ]);

            if (cancelled || !rootEl.current) return;

            editor = new TuiImageEditor(rootEl.current, {
                cssMaxWidth: width,
                cssMaxHeight: height,
                selectionStyle: {
                    cornerSize: 10,
                    rotatingPointOffset: 70,
                    cornerColor: 'white',
                    cornerStrokeColor: 'red',
                    borderColor: 'red',
                },
            });

            imageEditorInst.current = editor;

            if (src) {
                editor.loadImageFromURL(src, 'Sample Image')
                    .then(() => {
                        onImageLoad?.();
                        editor.clearUndoStack();
                        editor.clearRedoStack();
                    })
                    .catch((err: unknown) => {
                        console.error('Error loading image:', err);
                    });
            }

            editor.on('objectAdded', (obj: unknown) => {
                console.log('objectAdded', obj);
                editor.stopDrawingMode();
            });

            editor.on('addText', (pos: unknown) => {
                const p = pos as { originPosition?: { x?: number; y?: number } };
                editor.stopDrawingMode();
                editor.addText('init text', {
                    styles: {
                        fill: '#FF0000',
                        fontSize: 30,
                        fontWeight: 'bold',
                    },
                    position: {
                        x: p.originPosition?.x,
                        y: p.originPosition?.y,
                    },
                });
            });
        };

        initEditor();

        return () => {
            cancelled = true;
            editor?.destroy();
            imageEditorInst.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height]);

    const loadImage = useCallback(() => {
        const editor = imageEditorInst.current;
        if (!src || !editor) return;

        editor.loadImageFromURL(src, 'Sample Image')
            .then(() => {
                onImageLoad?.();
                editor.clearUndoStack();
                editor.clearRedoStack();
            })
            .catch((err: unknown) => {
                console.error('Error loading image:', err);
            });
    }, [src, onImageLoad]);

    useEffect(() => {
        if (imageEditorInst.current) loadImage();
    }, [loadImage]);

    const handleStartDrawingMode = (e: React.MouseEvent<HTMLButtonElement>, mode: DrawingMode) => {
        e.preventDefault();

        const editor = imageEditorInst.current;
        if (!editor) return;

        const maxZoom = 3;
        const minZoom = 1;

        switch (mode) {
            case 'ZOOMIN':
                if (zoom < maxZoom) setZoom((prev) => prev * 1.2);
                break;
            case 'ZOOMOUT':
                if (zoom > minZoom) setZoom((prev) => Math.max(prev * 0.8, minZoom));
                break;
            case 'UNDO':
                if (!editor.isEmptyUndoStack()) editor.undo();
                break;
            case 'REDO':
                if (!editor.isEmptyRedoStack()) editor.redo();
                break;
            case 'FLIPX':
                editor.flipX();
                break;
            case 'FLIPY':
                editor.flipY();
                break;
            case 'ROTATE':
                editor.rotate(90);
                break;
            case 'CROPPER':
                editor.startDrawingMode(mode);
                break;
            case 'FREE_DRAWING':
                editor.startDrawingMode(mode, { width: objStyle.width, color: objStyle.color });
                break;
            case 'LINE_DRAWING':
                editor.startDrawingMode(mode, {
                    width: objStyle.width,
                    color: objStyle.color,
                    arrowType: { tail: 'chevron' },
                } as LineDrawingOptions);
                break;
            case 'TEXT':
                editor.startDrawingMode(mode);
                break;
            case 'circle':
            case 'rect':
            case 'triangle':
                editor.setDrawingShape(mode, {
                    fill: objStyle.fill,
                    stroke: objStyle.color,
                    strokeWidth: 3,
                });
                editor.startDrawingMode('SHAPE');
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (mode !== "modal") return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mode]);

    const handleSave = async () => {
        const editor = imageEditorInst.current;
        if (!editor) return;
        try {
            const cropRect = editor.getCropzoneRect?.() as { left: number; top: number; width: number; height: number } | null;
            if (cropRect && cropRect.width > 0 && cropRect.height > 0) {
                await editor.crop(cropRect);
            }
        } catch { }
        await onSave?.(editor.toDataURL());
    };

    const handleClose = () => {
        onClose?.();
    };

    const toolBtn = "inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    const ToolButtons = (
        <>
            <button className={toolBtn} title={dict.undo} onClick={(e) => handleStartDrawingMode(e, 'UNDO')}>
                <Icon name="arrow-arc-left" size={16} />
            </button>
            <button className={toolBtn} title={dict.redo} onClick={(e) => handleStartDrawingMode(e, 'REDO')}>
                <Icon name="arrow-arc-right" size={16} />
            </button>
            <button className={toolBtn} title={dict.zoomOut} onClick={(e) => handleStartDrawingMode(e, 'ZOOMOUT')}>
                <Icon name="magnifying-glass-minus" size={16} />
            </button>
            <button className={toolBtn} title={dict.zoomIn} onClick={(e) => handleStartDrawingMode(e, 'ZOOMIN')}>
                <Icon name="magnifying-glass-plus" size={16} />
            </button>
            <Divider />
            <button className={toolBtn} title={dict.crop} onClick={(e) => handleStartDrawingMode(e, 'CROPPER')}>
                <Icon name="crop" size={16} />
            </button>
            <button className={toolBtn} title={dict.flipHorizontal} onClick={(e) => handleStartDrawingMode(e, 'FLIPX')}>
                <Icon name="arrow-line-right" size={16} />
            </button>
            <button className={toolBtn} title={dict.flipVertical} onClick={(e) => handleStartDrawingMode(e, 'FLIPY')}>
                <Icon name="arrow-line-down" size={16} />
            </button>
            <button className={toolBtn} title={dict.rotate} onClick={(e) => handleStartDrawingMode(e, 'ROTATE')}>
                <Icon name="camera-rotate" size={16} />
            </button>
            <Divider />
            <button className={toolBtn} title={dict.freeDrawing} onClick={(e) => handleStartDrawingMode(e, 'FREE_DRAWING')}>
                <Icon name="pencil" size={16} />
            </button>
            <button className={toolBtn} title={dict.arrow} onClick={(e) => handleStartDrawingMode(e, 'LINE_DRAWING')}>
                <Icon name="arrow-right" size={16} />
            </button>
            <button className={toolBtn} title={dict.text} onClick={(e) => handleStartDrawingMode(e, 'TEXT')}>
                <Icon name="text-t" size={16} />
            </button>
            <button className={toolBtn} title={dict.rectangle} onClick={(e) => handleStartDrawingMode(e, 'rect')}>
                <Icon name="rectangle" size={16} />
            </button>
            <button className={toolBtn} title={dict.circle} onClick={(e) => handleStartDrawingMode(e, 'circle')}>
                <Icon name="circle" size={16} />
            </button>
            <button className={toolBtn} title={dict.triangle} onClick={(e) => handleStartDrawingMode(e, 'triangle')}>
                <Icon name="triangle" size={16} />
            </button>
        </>
    );

    const ModalHeader = (
        <div className="flex flex-1 min-w-0 items-center gap-0.5 overflow-x-auto">
            <span className="shrink-0 text-sm font-semibold text-foreground pr-2 mr-1">
                {title || dict.title}
            </span>
            <Divider />
            {ToolButtons}
            {onSave && (
                <>
                    <Divider />
                    <LoadingButton className="btn-primary btn-sm ml-1" onClick={handleSave} icon="floppy-disk" label={dict.save} />
                </>
            )}
        </div>
    );

    const InlineToolbar = (
        <div className="flex items-center gap-0.5 border-b px-2 py-1">
            {ToolButtons}
            {onSave && (
                <div className="ml-auto pl-2">
                    <LoadingButton className="btn-primary btn-sm" onClick={handleSave} icon="floppy-disk" label={dict.save} />
                </div>
            )}
        </div>
    );

    const Canvas = (
        <div
            className={cn(
                'flex w-full items-center justify-center overflow-auto pt-3',
                '[background-image:repeating-conic-gradient(#e4e4e4_0%_25%,#f5f5f5_0%_50%)]',
                'dark:[background-image:repeating-conic-gradient(#2a2a2a_0%_25%,#343434_0%_50%)]',
                '[background-size:16px_16px]',
            )}
            style={{ minHeight: (height * zoom) + 'px' }}
        >
            <style>{`.tui-image-editor,.tui-image-editor canvas{background:transparent!important}`}</style>
            <div
                ref={rootEl}
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    display: 'inline-block',
                    userSelect: 'none',
                    width: width + 'px',
                    height: (height * zoom) + 'px',
                }}
            />
        </div>
    );

    if (mode === "modal") {
        return (
            <Modal
                size="xl"
                header={ModalHeader}
                bodyClassName="overflow-hidden p-0"
                onClose={handleClose}
                footer={false}
            >
                {Canvas}
            </Modal>
        );
    }

    return (
        <>
            {InlineToolbar}
            {Canvas}
        </>
    );
};

export default ImageEditor;
