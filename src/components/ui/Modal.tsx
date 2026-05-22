import React, {useState} from 'react';
import { createPortal } from 'react-dom';
import {useTheme} from "../../Theme";
import {ActionButton, LoadingButton} from "./Buttons";
import type { MotionUIProps } from '../types';
import { useMotionEffect, useMotionState } from '../../motion';
import Icon from './Icon';
import { cn } from '../../libs/cn';

export type ModalSaveHandler = (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
export type ModalDeleteHandler = (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;

interface ModalProps extends MotionUIProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode | false;
    onClose?: () => void;
    onSave?: ModalSaveHandler;
    onDelete?: ModalDeleteHandler;
    size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
    position?: "center" | "top" | "left" | "right" | "bottom";
    buttonFullscreen?: boolean;
    buttonCancel?: boolean;
    headerClass?: string;
    titleClass?: string;
    subTitleClass?: string;
    bodyClass?: string;
    footerClass?: string;
    closeOnBackdrop?: boolean;
}

interface ModalYesNoProps {
    title?: React.ReactNode;
    children: React.ReactNode;
    onYes?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
    onNo?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
    onClose?: () => void;
}

interface ModalOkProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    onClose?: () => void;
}

const Modal = (props: ModalProps) => {
    return <ModalDefault {...props} />;
};

const ModalDefault = ({
                          children,
                          title             = undefined,
                          header            = undefined,
                          footer            = undefined,
                          onClose           = undefined,
                          onSave            = undefined,
                          onDelete          = undefined,
                          size              = undefined,
                          position          = undefined,
                          buttonFullscreen  = true,
                          buttonCancel      = true,
                          pre               = undefined,
                          post              = undefined,
                          wrapClass         = undefined,
                          className         = undefined,
                          headerClass       = undefined,
                          titleClass        = undefined,
                          subTitleClass     = undefined,
                          bodyClass         = undefined,
                          footerClass       = undefined,
                          closeOnBackdrop   = true,
                          motion: motionConfig = undefined
}: ModalProps) => {
    const theme = useTheme("modal");
    const [entered, setEntered] = React.useState(false);
    const closingRef = React.useRef(false);
    const closeTimerRef = React.useRef<number | undefined>(undefined);

    const [sizeClass, setSizeClass] = useState(size);

    const dialogSizeClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        fullscreen: "max-w-none w-screen h-dvh rounded-none",
    }[sizeClass || theme.Modal.size || "lg"];

    const sideWidthClass = {
        sm: "w-72",
        md: "w-96",
        lg: "w-[36rem]",
        xl: "w-[48rem]",
        fullscreen: "w-screen",
    }[sizeClass || theme.Modal.size || "lg"];

    const verticalHeightClass = {
        sm: "max-h-[30vh]",
        md: "max-h-[45vh]",
        lg: "max-h-[60vh]",
        xl: "max-h-[85vh]",
        fullscreen: "h-dvh max-h-none",
    }[sizeClass || theme.Modal.size || "lg"];

    const positions = {
        center: {
            coverClass: "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4",
            dialogClass: cn("relative z-50 flex w-full flex-col overflow-hidden rounded-lg border bg-card shadow-xl", dialogSizeClass, wrapClass || theme.Modal.wrapClass),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClass: cn("flex items-center justify-between gap-3 border-b px-4 py-3", headerClass || theme.Modal.headerClass),
            titleClass: cn("text-lg font-semibold leading-none", titleClass || theme.Modal.titleClass),
            subTitleClass: cn("mt-1 text-sm text-muted-foreground", subTitleClass || theme.Modal.subTitleClass),
            bodyClass: cn("min-h-0 flex-1 overflow-auto p-4", bodyClass || theme.Modal.bodyClass),
            footerClass: cn("flex items-center justify-end gap-2 border-t px-4 py-3", footerClass || theme.Modal.footerClass),
        },
        top: {
            coverClass: "",
            dialogClass: cn("fixed left-0 right-0 top-0 z-50 flex flex-col border-b bg-card shadow-xl", verticalHeightClass, wrapClass || theme.Modal.wrapClass),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClass: cn("flex items-center justify-between gap-3 border-b px-4 py-3", headerClass || theme.Modal.headerClass),
            titleClass: cn("text-lg font-semibold leading-none", titleClass || theme.Modal.titleClass),
            subTitleClass: cn("mt-1 text-sm text-muted-foreground", subTitleClass || theme.Modal.subTitleClass),
            bodyClass: cn("min-h-0 flex-1 overflow-auto p-4", bodyClass || theme.Modal.bodyClass),
            footerClass: cn("flex items-center justify-end gap-2 border-t px-4 py-3", footerClass || theme.Modal.footerClass),
        },
        left: {
            coverClass: "",
            dialogClass: cn("fixed bottom-0 left-0 top-0 z-50 flex max-w-full flex-col border-r bg-card shadow-xl", sideWidthClass, wrapClass || theme.Modal.wrapClass),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClass: cn("flex items-center justify-between gap-3 border-b px-4 py-3", headerClass || theme.Modal.headerClass),
            titleClass: cn("text-lg font-semibold leading-none", titleClass || theme.Modal.titleClass),
            subTitleClass: cn("mt-1 text-sm text-muted-foreground", subTitleClass || theme.Modal.subTitleClass),
            bodyClass: cn("min-h-0 flex-1 overflow-auto p-4", bodyClass || theme.Modal.bodyClass),
            footerClass: cn("flex items-center justify-end gap-2 border-t px-4 py-3", footerClass || theme.Modal.footerClass),
        },
        right: {
            coverClass: "",
            dialogClass: cn("fixed bottom-0 right-0 top-0 z-50 flex max-w-full flex-col border-l bg-card shadow-xl", sideWidthClass, wrapClass || theme.Modal.wrapClass),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClass: cn("flex items-center justify-between gap-3 border-b px-4 py-3", headerClass || theme.Modal.headerClass),
            titleClass: cn("text-lg font-semibold leading-none", titleClass || theme.Modal.titleClass),
            subTitleClass: cn("mt-1 text-sm text-muted-foreground", subTitleClass || theme.Modal.subTitleClass),
            bodyClass: cn("min-h-0 flex-1 overflow-auto p-4", bodyClass || theme.Modal.bodyClass),
            footerClass: cn("flex items-center justify-end gap-2 border-t px-4 py-3", footerClass || theme.Modal.footerClass),
        },
        bottom: {
            coverClass: "",
            dialogClass: cn("fixed bottom-0 left-0 right-0 z-50 flex flex-col border-t bg-card shadow-xl", verticalHeightClass, wrapClass || theme.Modal.wrapClass),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClass: cn("flex items-center justify-between gap-3 border-b px-4 py-3", headerClass || theme.Modal.headerClass),
            titleClass: cn("text-lg font-semibold leading-none", titleClass || theme.Modal.titleClass),
            subTitleClass: cn("mt-1 text-sm text-muted-foreground", subTitleClass || theme.Modal.subTitleClass),
            bodyClass: cn("min-h-0 flex-1 overflow-auto p-4", bodyClass || theme.Modal.bodyClass),
            footerClass: cn("flex items-center justify-end gap-2 border-t px-4 py-3", footerClass || theme.Modal.footerClass),
        }
    }

    const modalPosition = sizeClass === "fullscreen" ? "center" : (position || theme.Modal.position);
    const pos = positions[modalPosition as keyof typeof positions];
    const coverClass = sizeClass === "fullscreen"
        ? cn(pos.coverClass, "!overflow-hidden !p-0")
        : pos.coverClass;

    React.useEffect(() => {
        const originalOverflow = window.document.body.style.overflow;
        window.document.body.style.overflow = "hidden";
        const frame = window.requestAnimationFrame(() => setEntered(true));

        return () => {
            window.cancelAnimationFrame(frame);
            if (closeTimerRef.current !== undefined) {
                window.clearTimeout(closeTimerRef.current);
            }
            window.document.body.style.overflow = originalOverflow || "auto";
        };
    }, []);

    const modalMotionReference = motionConfig ?? theme.Modal.motion?.[modalPosition as keyof NonNullable<typeof theme.Modal.motion>] ?? 'fade';
    const dialogMotion = useMotionEffect(modalMotionReference, modalMotionReference);

    const handleClose = () => {
        if (closingRef.current) return;
        closingRef.current = true;
        setEntered(false);
        window.document.body.style.overflow = "auto";
        const closeDelay = dialogMotion.transition.duration + dialogMotion.transition.delay;
        closeTimerRef.current = window.setTimeout(() => {
            onClose?.();
        }, closeDelay);
    }

    const dialogStyle = useMotionState(entered, modalMotionReference, modalMotionReference);

    const backdropStyle: React.CSSProperties = {
        ...useMotionState(entered, theme.Modal.motion?.backdrop ?? 'fade', theme.Modal.motion?.backdrop ?? 'fade'),
        cursor: closeOnBackdrop && onClose ? 'pointer' : 'default',
    };

    const coverStyle: React.CSSProperties = {
        cursor: modalPosition === "center" && closeOnBackdrop && onClose ? 'pointer' : 'default',
    };

    const showFooter = footer !== false && (footer || onSave || onDelete || (buttonCancel && onClose));

    const closeButtonClass = "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    return createPortal(<>
        <div
            className={coverClass}
            style={coverStyle}
            onClick={() => {
                if (modalPosition === "center" && closeOnBackdrop && onClose) {
                    handleClose();
                }
            }}
        >
            <div className={pos.dialogClass} style={dialogStyle} onClick={(e) => e.stopPropagation()}>
                {pre}
                <div className={pos.contentClass}>
                    {(header || title || buttonFullscreen || onClose) && <div className={pos.headerClass}>
                        <div className="min-w-0">
                            {title && <h3 className={pos.titleClass}>{title}</h3>}
                            {(title && header) && <div className={pos.subTitleClass}>{header}</div>}
                            {!title && header && (typeof header === "string" ? <h3 className={pos.titleClass}>{header}</h3> : header)}
                        </div>
                        {(buttonFullscreen || onClose) && <div className="ml-auto flex shrink-0 items-center gap-1">
                            {buttonFullscreen && <button
                                type="button"
                                title={sizeClass === "fullscreen" ? "Exit fullscreen" : "Enter fullscreen"}
                                aria-label={sizeClass === "fullscreen" ? "Exit fullscreen" : "Enter fullscreen"}
                                className={closeButtonClass}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSizeClass((prev) => prev === "fullscreen" ? size === "fullscreen" ? "lg" : size : "fullscreen")
                                }}
                            >
                                <Icon name={sizeClass === "fullscreen" ? theme.Modal.iconCollapse : theme.Modal.iconExpand} size={18} />
                            </button>}
                            {onClose && <button
                                type="button"
                                title="Close"
                                aria-label="Close"
                                className={closeButtonClass}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClose();
                                }}
                            >
                                <Icon name="x" size={20} />
                            </button>}
                        </div>}
                    </div>}
                    <div className={pos.bodyClass}>{children}</div>
                    {showFooter && <div className={pos.footerClass}>
                        {footer}
                        {onSave && <LoadingButton
                            className="btn-primary"
                            label={"Save"}
                            onClick={async (e) => {
                                e.preventDefault();
                                
                                if (await onSave(e)) {
                                    handleClose()
                                }
                            }}
                        />}
                        {onDelete && <LoadingButton
                            className="btn-danger"
                            label={"Delete"}
                            onClick={async (e) => {
                                e.preventDefault();
                                await onDelete(e);
                                handleClose()
                            }}
                        />}
                        {buttonCancel && onClose && <ActionButton
                            className="btn-link"
                            label={"Cancel"}
                            onClick={handleClose}
                        />}
                    </div>}
                </div>
                {post}
            </div>
        </div>
        <div
            data-rf-modal-backdrop=""
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            style={backdropStyle}
            onClick={() => {
                if (closeOnBackdrop && onClose) {
                    handleClose();
                }
            }}
        />
    </>, document.body);
};

export const ModalYesNo = ({
                               children,
                               title    = undefined,
                               onYes    = undefined,
                               onNo     = undefined,
                               onClose  = undefined
}: ModalYesNoProps) => {
    return <ModalDefault
        title={title}
        onClose={onClose}
        buttonFullscreen={false}
        footer={<>
            {onYes && <LoadingButton
                className="btn-primary"
                label={"Yes"}
                onClick={async (e) => {
                    e.preventDefault();
                    await onYes(e);
                    onClose?.()
                }}
            />}
            {onNo && <LoadingButton
                className="btn-secondary"
                label={"No"}
                onClick={async (e) => {
                    e.preventDefault();
                    await onNo(e);
                    onClose?.()
                }}
            />}
        </>}
    >
        {children}
    </ModalDefault>
}

export const ModalOk = ({
                            children,
                            title       = undefined,
                            onClose     = undefined
                        }: ModalOkProps) => {
    return <ModalDefault
        title={title}
        onClose={onClose}
        buttonFullscreen={false}
        footer={<>
            <ActionButton className="btn-primary" label={"Ok"} onClick={onClose} />
        </>}
    >
        {children}
    </ModalDefault>
}

export default Modal;
