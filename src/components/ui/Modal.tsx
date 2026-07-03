import React, {useState} from 'react';
import { createPortal } from 'react-dom';
import {useTheme} from "../../Theme";
import { useI18n } from "../../I18n";
import {ActionButton, LoadingButton} from "./Buttons";
import type { MotionUIProps } from '../types';
import { useMotionEffect, useMotionState } from '../../motion';
import Icon from './Icon';
import { cn } from '../../libs/cn';

export type ModalSaveHandler = (e: React.MouseEvent<HTMLElement>) => Promise<boolean>;
export type ModalDeleteHandler = (e: React.MouseEvent<HTMLElement>) => Promise<boolean>;

/** Props for the `<Modal>` component. */
export interface ModalProps extends MotionUIProps {
    /** Modal body content. */
    children: React.ReactNode;
    /** Text or element rendered as the modal title in the header. */
    title?: React.ReactNode;
    /** Fully custom header content (replaces the default title row). */
    header?: React.ReactNode;
    /** Fully custom footer content. Pass `false` to hide the footer bar entirely. */
    footer?: React.ReactNode | false;
    /** Called when the modal should close (×, backdrop click, Cancel). */
    onClose?: () => void;
    /** Async save handler wired to the Save button. Return `true` to close. */
    onSave?: ModalSaveHandler;
    /** Async delete handler wired to the Delete button. Return `true` to close. */
    onDelete?: ModalDeleteHandler;
    /** Modal width: `"sm"` · `"md"` · `"lg"` · `"xl"` · `"2xl"` · `"fullscreen"`. */
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "fullscreen";
    /** Anchor position: `"center"` (default) · `"top"` · `"left"` · `"right"` · `"bottom"`. */
    position?: "center" | "top" | "left" | "right" | "bottom";
    /** Show a fullscreen toggle button in the header. Defaults to `false`. */
    allowFullscreen?: boolean;
    /** Show the Cancel button in the footer. Defaults to `true`. */
    showCancel?: boolean;
    /** Extra CSS classes on the header container. */
    headerClassName?: string;
    /** Extra CSS classes on the title element. */
    titleClassName?: string;
    /** Extra CSS classes on the subtitle element. */
    subtitleClassName?: string;
    /** Extra CSS classes on the body container. */
    bodyClassName?: string;
    /** Extra CSS classes on the footer container. */
    footerClassName?: string;
    /** Close the modal when the user clicks the backdrop. Defaults to `true`. */
    closeOnBackdrop?: boolean;
    /** CSS `z-index` override (useful when stacking modals). */
    zIndex?: number;
    /**
     * When `true` this modal is visually "behind" another modal stacked on top.
     * The panel becomes 10% wider (so its edge peeks out from behind the upper modal),
     * gains a semi-transparent dimming overlay, its backdrop is suppressed (the upper
     * modal's backdrop handles interaction blocking), and its cover becomes non-interactive.
     */
    stackedBehind?: boolean;
}

export interface ModalYesNoProps {
    title?: React.ReactNode;
    children: React.ReactNode;
    onYes?: (e: React.MouseEvent<HTMLElement>) => Promise<boolean>;
    onNo?: (e: React.MouseEvent<HTMLElement>) => Promise<boolean>;
    onClose?: () => void;
}

export interface ModalOkProps {
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
                          allowFullscreen  = false,
                          showCancel      = true,
                          before               = undefined,
                          after              = undefined,
                          wrapperClassName         = undefined,
                          className         = undefined,
                          headerClassName       = undefined,
                          titleClassName        = undefined,
                          subtitleClassName     = undefined,
                          bodyClassName         = undefined,
                          footerClassName       = undefined,
                          closeOnBackdrop   = true,
                          zIndex            = undefined,
                          stackedBehind     = false,
                          motion: motionConfig = undefined
}: ModalProps) => {
    const theme = useTheme("modal");
    const dict = useI18n('modal');
    const [entered, setEntered] = React.useState(false);
    const closingRef = React.useRef(false);
    const closeTimerRef = React.useRef<number | undefined>(undefined);

    const [sizeClass, setSizeClass] = useState(size);

    const dialogSizeClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
        fullscreen: "max-w-none w-screen h-dvh rounded-none",
    }[sizeClass || theme.Modal.size || "lg"];

    const sideWidthClass = {
        sm: "w-72",
        md: "w-96",
        lg: "w-[36rem]",
        xl: "w-[48rem]",
        "2xl": "w-[64rem]",
        fullscreen: "w-screen",
    }[sizeClass || theme.Modal.size || "lg"];

    const verticalHeightClass = {
        sm: "max-h-[30vh]",
        md: "max-h-[45vh]",
        lg: "max-h-[60vh]",
        xl: "max-h-[85vh]",
        "2xl": "max-h-[90vh]",
        fullscreen: "h-dvh max-h-none",
    }[sizeClass || theme.Modal.size || "lg"];

    const positions = {
        center: {
            coverClass: "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4",
            dialogClass: cn("relative z-50 flex w-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-xl", sizeClass !== "fullscreen" && "max-h-[calc(100dvh-2rem)]", dialogSizeClass, wrapperClassName || theme.Modal.wrapperClassName),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClassName: cn("flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3", headerClassName || theme.Modal.headerClassName),
            titleClassName: cn("text-lg font-semibold leading-none", titleClassName || theme.Modal.titleClassName),
            subtitleClassName: cn("mt-1 text-sm text-muted-foreground", subtitleClassName || theme.Modal.subtitleClassName),
            bodyClassName: cn("min-h-0 flex-1 overflow-auto p-4", bodyClassName || theme.Modal.bodyClassName),
            footerClassName: cn("flex items-center justify-end gap-3 border-t border-border/60 px-4 py-3", footerClassName || theme.Modal.footerClassName),
        },
        top: {
            coverClass: "fixed inset-0 z-50",
            dialogClass: cn("fixed left-0 right-0 top-0 z-50 flex flex-col border-b border-border/60 bg-card shadow-xl", verticalHeightClass, wrapperClassName || theme.Modal.wrapperClassName),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClassName: cn("flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3", headerClassName || theme.Modal.headerClassName),
            titleClassName: cn("text-lg font-semibold leading-none", titleClassName || theme.Modal.titleClassName),
            subtitleClassName: cn("mt-1 text-sm text-muted-foreground", subtitleClassName || theme.Modal.subtitleClassName),
            bodyClassName: cn("min-h-0 flex-1 overflow-auto p-4", bodyClassName || theme.Modal.bodyClassName),
            footerClassName: cn("flex items-center justify-end gap-3 border-t border-border/60 px-4 py-3", footerClassName || theme.Modal.footerClassName),
        },
        left: {
            coverClass: "fixed inset-0 z-50",
            dialogClass: cn("fixed bottom-0 left-0 top-0 z-50 flex max-w-full flex-col border-r border-border/60 bg-card shadow-xl", sideWidthClass, wrapperClassName || theme.Modal.wrapperClassName),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClassName: cn("flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3", headerClassName || theme.Modal.headerClassName),
            titleClassName: cn("text-lg font-semibold leading-none", titleClassName || theme.Modal.titleClassName),
            subtitleClassName: cn("mt-1 text-sm text-muted-foreground", subtitleClassName || theme.Modal.subtitleClassName),
            bodyClassName: cn("min-h-0 flex-1 overflow-auto p-4", bodyClassName || theme.Modal.bodyClassName),
            footerClassName: cn("flex items-center justify-end gap-3 border-t border-border/60 px-4 py-3", footerClassName || theme.Modal.footerClassName),
        },
        right: {
            coverClass: "fixed inset-0 z-50",
            dialogClass: cn("fixed bottom-0 right-0 top-0 z-50 flex max-w-full flex-col border-l border-border/60 bg-card shadow-xl", sideWidthClass, wrapperClassName || theme.Modal.wrapperClassName),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClassName: cn("flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3", headerClassName || theme.Modal.headerClassName),
            titleClassName: cn("text-lg font-semibold leading-none", titleClassName || theme.Modal.titleClassName),
            subtitleClassName: cn("mt-1 text-sm text-muted-foreground", subtitleClassName || theme.Modal.subtitleClassName),
            bodyClassName: cn("min-h-0 flex-1 overflow-auto p-4", bodyClassName || theme.Modal.bodyClassName),
            footerClassName: cn("flex items-center justify-end gap-3 border-t border-border/60 px-4 py-3", footerClassName || theme.Modal.footerClassName),
        },
        bottom: {
            coverClass: "fixed inset-0 z-50",
            dialogClass: cn("fixed bottom-0 left-0 right-0 z-50 flex flex-col border-t border-border/60 bg-card shadow-xl", verticalHeightClass, wrapperClassName || theme.Modal.wrapperClassName),
            contentClass: cn("flex min-h-0 flex-1 flex-col", className || theme.Modal.className),
            headerClassName: cn("flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3", headerClassName || theme.Modal.headerClassName),
            titleClassName: cn("text-lg font-semibold leading-none", titleClassName || theme.Modal.titleClassName),
            subtitleClassName: cn("mt-1 text-sm text-muted-foreground", subtitleClassName || theme.Modal.subtitleClassName),
            bodyClassName: cn("min-h-0 flex-1 overflow-auto p-4", bodyClassName || theme.Modal.bodyClassName),
            footerClassName: cn("flex items-center justify-end gap-3 border-t border-border/60 px-4 py-3", footerClassName || theme.Modal.footerClassName),
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
        ...(zIndex !== undefined ? { zIndex: zIndex - 10 } : {}),
    };

    const coverStyle: React.CSSProperties = {
        cursor: closeOnBackdrop && onClose ? 'pointer' : 'default',
        ...(zIndex !== undefined ? { zIndex } : {}),
        ...(stackedBehind ? { pointerEvents: 'none' } : {}),
    };

    // GTM-style depth effect: scale back + shift away from edge + transition
    const stackedTransform: React.CSSProperties = stackedBehind ? {
        transform: position === 'left'
            ? 'scale(0.94) translateX(-14px)'
            : position === 'right'
                ? 'scale(0.94) translateX(14px)'
                : position === 'bottom'
                    ? 'scale(0.94) translateY(14px)'
                    : position === 'top'
                        ? 'scale(0.94) translateY(-14px)'
                        : 'scale(0.94)',
        transformOrigin: position === 'left' ? 'left center'
            : position === 'right' ? 'right center'
            : position === 'bottom' ? 'bottom center'
            : position === 'top' ? 'top center'
            : 'center',
        transition: 'transform 200ms ease, filter 200ms ease',
        filter: 'brightness(0.7)',
    } : {};

    const showFooter = footer !== false && (footer || onSave || onDelete || (showCancel && onClose));

    const closeButtonClass = "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    return createPortal(<>
        <div
            className={coverClass}
            style={coverStyle}
            onClick={() => {
                if (closeOnBackdrop && onClose) {
                    handleClose();
                }
            }}
        >
            <div
                className={pos.dialogClass}
                style={{
                    ...dialogStyle,
                    ...stackedTransform,
                    ...(zIndex !== undefined ? { zIndex } : {}),
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {before}
                <div className={pos.contentClass}>
                    {(header || title || allowFullscreen || onClose) && <div className={pos.headerClassName}>
                        <div className="min-w-0">
                            {title && <h3 className={pos.titleClassName}>{title}</h3>}
                            {(title && header) && <div className={pos.subtitleClassName}>{header}</div>}
                            {!title && header && (typeof header === "string" ? <h3 className={pos.titleClassName}>{header}</h3> : header)}
                        </div>
                        {(allowFullscreen || onClose) && <div className="ml-auto flex shrink-0 items-center gap-1">
                            {allowFullscreen && <button
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
                                title={dict.close}
                                aria-label={dict.close}
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
                    <div className={pos.bodyClassName}>{children}</div>
                    {showFooter && <div className={pos.footerClassName}>
                        {footer}
                        {!footer && onSave && <LoadingButton
                            variant="primary"
                            label={dict.save}
                            onClick={async (e) => {
                                e.preventDefault();

                                if (await onSave(e)) {
                                    handleClose()
                                }
                            }}
                        />}
                        {!footer && onDelete && <LoadingButton
                            variant="danger"
                            label={dict.delete}
                            onClick={async (e) => {
                                e.preventDefault();
                                await onDelete(e);
                                handleClose()
                            }}
                        />}
                        {!footer && showCancel && onClose && <ActionButton
                            variant="link"
                            label={dict.cancel}
                            onClick={handleClose}
                        />}
                    </div>}
                </div>
                {after}
            </div>
        </div>
        {!stackedBehind && (
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
        )}
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
        allowFullscreen={false}
        footer={<>
            {onYes && <LoadingButton
                variant="primary"
                label={"Yes"}
                onClick={async (e) => {
                    e.preventDefault();
                    await onYes(e);
                    onClose?.()
                }}
            />}
            {onNo && <LoadingButton
                variant="secondary"
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
        allowFullscreen={false}
        footer={<>
            <ActionButton variant="primary" label={"Ok"} onClick={onClose} />
        </>}
    >
        {children}
    </ModalDefault>
}

export default Modal;
