import React, {useRef, useEffect, useCallback, useState} from 'react';
import TuiImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import Modal from "../ui/Modal";
import {LoadingButton} from "../ui/Buttons";
import Icon from "../ui/Icon";

type ImageEditorProps = {
    imageUrl: string;
    title?: string;
    width?: number;
    height?: number;
    modal?: boolean;
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

const ImageEditor = ({
                         imageUrl,
                         title          = undefined,
                         width          = 700,
                         height         = 500,
                         modal          = false,
                         onImageLoad    = undefined,
                         onClose        = undefined,
                         onSave         = undefined
}: ImageEditorProps) => {
    const rootEl = useRef<HTMLDivElement | null>(null);
    const imageEditorInst = useRef<InstanceType<typeof TuiImageEditor> | null>(null);
    const objStyle = {
        width: 10,
        color: 'rgba(255,0,0,0.5)',
        fill: 'transparent'
    }

    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!rootEl.current) return;

        const editor = new TuiImageEditor(rootEl.current, {
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

        editor.on('objectAdded', (obj) => {
            console.log('objectAdded', obj);
            editor.stopDrawingMode();
        });

        editor.on('addText', (pos) => {
            editor.stopDrawingMode();
            editor.addText('init text', {
                styles: {
                    fill: '#FF0000',
                    fontSize: 30,
                    fontWeight: 'bold',
                },
                position: {
                    x: pos.originPosition.x,
                    y: pos.originPosition.y,
                },
            });
        });

        return () => {
            editor.destroy();
            imageEditorInst.current = null;
        };
    }, [width, height]);


    const loadImage = useCallback(() => {
        const editor = imageEditorInst.current;
        if (!imageUrl || !editor) return;

        editor.loadImageFromURL(imageUrl, 'Sample Image')
            .then(() => {
                onImageLoad?.();
                editor.clearUndoStack();
                editor.clearRedoStack();
            })
            .catch((err) => {
                console.error('Error loading image:', err);
            });
    }, [imageUrl, onImageLoad]);

    useEffect(() => {
        loadImage();
    }, [loadImage]);


    const handleStartDrawingMode = (e: React.MouseEvent<HTMLButtonElement>, mode: DrawingMode) => {
        e.preventDefault();

        const editor = imageEditorInst.current;
        if (!editor) return;

        const maxZoom = 3;
        const minZoom = 1;

        switch (mode) {
            // 🔍 Zoom controls
            case 'ZOOMIN':
                if (zoom < maxZoom) setZoom((prev) => prev * 1.2);
                break;

            case 'ZOOMOUT':
                if (zoom > minZoom) setZoom((prev) => Math.max(prev * 0.8, minZoom));
                break;

            // 🔁 History controls
            case 'UNDO':
                if (!editor.isEmptyUndoStack()) editor.undo();
                break;
            case 'REDO':
                if (!editor.isEmptyRedoStack()) editor.redo();
                break;

            // 🔄 Transform controls
            case 'FLIPX':
                editor.flipX();
                break;
            case 'FLIPY':
                editor.flipY();
                break;
            case 'ROTATE':
                editor.rotate(90);
                break;

            // ✂️ Crop
            case 'CROPPER':
                editor.startDrawingMode(mode);
                break;

            // ✏️ Free drawing
            case 'FREE_DRAWING':
                editor.startDrawingMode(mode, {
                    width: objStyle.width,
                    color: objStyle.color,
                });
                break;

            // ➖ Line drawing
            case 'LINE_DRAWING':
                editor.startDrawingMode(mode, {
                    width: objStyle.width,
                    color: objStyle.color,
                    arrowType: {
                        tail: 'chevron',
                    },
                } as LineDrawingOptions);
                break;

            // 🔤 Text
            case 'TEXT':
                editor.startDrawingMode(mode);
                break;

            // 🟠🟦🔺 Shapes
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

    const handleSave = async () => {
        const editor = imageEditorInst.current;
        if (!editor) return;

        await onSave?.(editor.toDataURL());

        document.body.style.overflow = '';
    };

    const handleClose = () => {
        document.body.style.overflow = '';
        onClose?.();
    }

    window.document.body.style.overflow = 'hidden';
    const toolButtonClass = "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
    const Controls = <div className={"flex border-b"}>
        <div className={"border-end"}>
            <button className={toolButtonClass} title="Undo" onClick={(e) => handleStartDrawingMode(e, 'UNDO')}>
                <Icon name="arrow-arc-left" />
            </button>
            <button className={toolButtonClass} title="Redo" onClick={(e) => handleStartDrawingMode(e, 'REDO')}>
                <Icon name="arrow-arc-right" />
            </button>
            <button className={toolButtonClass} title="Zoom In" onClick={(e) => handleStartDrawingMode(e, 'ZOOMOUT')}>
                <Icon name="magnifying-glass-minus" />
            </button>
            <button className={toolButtonClass} title="Zoom Out" onClick={(e) => handleStartDrawingMode(e, 'ZOOMIN')}>
                <Icon name="magnifying-glass-plus" />
            </button>
        </div>
        <div className={"border-end"}>
            <button className={toolButtonClass} title="Crop" onClick={(e) => handleStartDrawingMode(e, 'CROPPER')}>
                <Icon name="crop" />
            </button>
            <button className={toolButtonClass} title="Flip X" onClick={(e) => handleStartDrawingMode(e, 'FLIPX')}>
                <Icon name="arrow-line-right" />
            </button>
            <button className={toolButtonClass} title="Flip Y" onClick={(e) => handleStartDrawingMode(e, 'FLIPY')}>
                <Icon name="arrow-line-down" />
            </button>
            <button className={toolButtonClass} title="Rotate" onClick={(e) => handleStartDrawingMode(e, 'ROTATE')}>
                <Icon name="camera-rotate" />
            </button>
        </div>
        <div className={"border-end"}>
            <button className={toolButtonClass} title="Free Drawing" onClick={(e) => handleStartDrawingMode(e, 'FREE_DRAWING')}>
                <Icon name="pencil" />
            </button>
            <button className={toolButtonClass} title="Line" onClick={(e) => handleStartDrawingMode(e, 'LINE_DRAWING')}>
                <Icon name="arrow-right" />
            </button>
            <button className={toolButtonClass} title="Text" onClick={(e) => handleStartDrawingMode(e, 'TEXT')}>
                <Icon name="text-t" />
            </button>
            <button className={toolButtonClass} title="Rect" onClick={(e) => handleStartDrawingMode(e, 'rect')}>
                <Icon name="rectangle" />
            </button>
            <button className={toolButtonClass} title="Circle" onClick={(e) => handleStartDrawingMode(e, 'circle')}>
                <Icon name="circle" />
            </button>
            <button className={toolButtonClass} title="Triangle" onClick={(e) => handleStartDrawingMode(e, 'triangle')}>
                <Icon name="triangle" />
            </button>
        </div>
        {onSave && <div className={"ml-auto"}>
            <LoadingButton className={"btn-primary"} onClick={handleSave} icon={"floppy-disk"} label={"Save"} />
        </div>}
    </div>;

    const Editor =
        <div ref={rootEl}
             className={"flex justify-center"}
             style={{
                 transform: `scale(${zoom})`,
                 transformOrigin: 'top center',
                 display: 'inline-block',
                 userSelect: 'none',
                 width: '100%',
                 height: (height * zoom) + 'px'
             }}/>;


    return (modal
            ? <Modal
                size={"xl"}
                title={title || "Image Editor"}
                header={Controls}
                className={"bg-secondary"}
                bodyClass={"overflow-hidden"}
                onClose={handleClose}
                footer={false}
            >
                {Editor}
            </Modal>
            : <>{Controls}{Editor}</>
    );
};

export default ImageEditor;
