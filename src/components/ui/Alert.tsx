import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTheme } from '../../Theme';
import { UIProps } from '../..';
import { Wrapper } from "./GridSystem";
import { createPortal } from 'react-dom';
import { cn } from '../../libs/cn';
import Icon from './Icon';

export type AlertProps = {
    children: string | React.ReactNode;
    /** Semantic color variant. */
    variant?: "info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark";
    /** Visual shell:
     *  - `"default"` - full alert box with background and border (default)
     *  - `"text"` - no background, no border, width fits content; ideal for inline status indicators
     */
    appearance?: "default" | "text";
    /** Rendering mode:
     *  - `"inline"` (default) - renders where declared, normal document flow
     *  - `"fixed"` - portal to document.body, viewport-fixed above all other content
     *  - `"sticky"` - portal prepended to `anchorRef`, sticky at the top of that container
     */
    placement?: "inline" | "fixed" | "sticky";
    /** Required when placement="sticky": the scrollable container to anchor to. */
    anchorRef?: React.RefObject<HTMLElement>;
    /** Auto-dismiss timeout in ms. */
    timeout?: number;
    /** Called when the alert is dismissed. */
    onClose?: () => void;
    /** Icon name, or `true` to show the default variant icon, or `false` to hide. */
    icon?: string | boolean;
    className?: string;
} & UIProps;

const TEXT_COLORS: Record<string, string> = {
    info:      'text-blue-600',
    success:   'text-green-600',
    warning:   'text-yellow-600',
    danger:    'text-red-600',
    primary:   'text-primary',
    secondary: 'text-secondary',
    light:     'text-gray-400',
    dark:      'text-gray-800',
};

const OVERLAY_ALERT_SURFACE_CLASS = "bg-card supports-[backdrop-filter]:backdrop-blur-sm";

const Alert = ({
    children,
    variant = "info",
    appearance = "default",
    placement = "inline",
    anchorRef = undefined,
    timeout = undefined,
    onClose = undefined,
    icon = true,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined
}: AlertProps) => {
    const theme = useTheme("alert");

    // Sticky portal container — created once when placement="sticky", removed on unmount.
    const [stickyContainer, setStickyContainer] = useState<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (placement !== 'sticky') {
            setStickyContainer(null);
            return;
        }

        let frame = 0;
        let el: HTMLDivElement | null = null;
        let disposed = false;

        const attach = () => {
            const anchor = anchorRef?.current;
            if (disposed) return;
            if (!anchor) {
                frame = requestAnimationFrame(attach);
                return;
            }

            el = document.createElement('div');
            el.style.cssText = 'position:sticky;top:0;left:0;right:0;z-index:50;width:100%';
            anchor.prepend(el);
            setStickyContainer(el);
        };

        attach();

        return () => {
            disposed = true;
            if (frame) cancelAnimationFrame(frame);
            if (el) {
                el.remove();
            }
            setStickyContainer(null);
        };
    }, [placement, anchorRef]);

    const DEFAULT_ICONS: Record<string, string> = {
        info:      'info',
        success:   'check',
        warning:   'warning',
        danger:    'x-circle',
        primary:   '',
        secondary: '',
        light:     '',
        dark:      '',
    };

    const iconName: string | null = icon === false ? null
        : icon === true ? (DEFAULT_ICONS[variant] || null)
        : (icon as string) || null;

    useEffect(() => {
        if (typeof onClose === 'function') {
            const duration = timeout ?? 5000;
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [onClose, timeout]);

    const alertEl = appearance === 'text'
        ? (
            <span
                role="status"
                className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium",
                    TEXT_COLORS[variant] ?? 'text-foreground',
                    className
                )}
            >
                {iconName && <Icon name={iconName} size={14} className="shrink-0" />}
                {children}
            </span>
        )
        : (
            <div
                role="alert"
                className={cn(
                    "alert alert-" + variant,
                    className || theme.Alert.className,
                    (placement === 'fixed' || placement === 'sticky') && [
                        "w-full rounded-none border-x-0 shadow-md",
                        OVERLAY_ALERT_SURFACE_CLASS,
                    ]
                )}
            >
                {iconName && <Icon name={iconName} size={16} className="shrink-0" />}
                {children}
            </div>
        );

    if (placement === 'fixed') {
        const container = (() => {
            const id = '__alert-portal-fixed__';
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement('div');
                el.id = id;
                el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;width:100%';
                document.body.appendChild(el);
            }
            return el;
        })();
        return createPortal(alertEl, container);
    }

    if (placement === 'sticky') {
        return stickyContainer ? createPortal(alertEl, stickyContainer) : null;
    }

    const resolvedWrapClass = wrapperClassName ?? ((before || after) ? 'flex items-center gap-2' : undefined);

    return (
        <Wrapper className={resolvedWrapClass}>
            {before}
            {alertEl}
            {after}
        </Wrapper>
    );
}

export default Alert;
