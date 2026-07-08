import React from 'react';
import { createPortal } from 'react-dom';
import {Link} from "react-router-dom";
import {useTheme} from "../../Theme";
import {Wrapper} from "../ui/GridSystem";
import { BadgeOverlay, BadgeProps, BadgeType } from "../ui/Badge";
import Menu from './Menu';
import { cn } from '../../libs/cn';
import { useMotionState, usePressMotion } from '../../motion';
import type { MotionUIProps } from '../types';
import Icon from '../ui/Icon';

/** Shorthand config for the dropdown trigger when it renders as a button + icon. */
interface DropdownTogglerProps {
    icon?: string;
    text?: string;
    title?: string;
}
interface DropdownProps extends MotionUIProps {
    children: React.ReactNode;
    /** Dropdown trigger: string (label), React element, or `DropdownTogglerProps` object. */
    trigger?: string | React.ReactNode | DropdownTogglerProps;
    badge?: BadgeProps;
    /** Fixed header rendered inside the dropdown menu. */
    header?: React.ReactNode;
    footer?: React.ReactNode;
    /** Uncontrolled open state default. */
    defaultOpen?: boolean;
    /** Controlled open state. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** When `true`, the menu stays open regardless of interaction. */
    staticOpen?: boolean;
    /** Horizontal alignment relative to the trigger. */
    position?: "start" | "end";
    /** Drop direction. */
    placement?: "auto" | "top" | "bottom";
    /** CSS positioning strategy. */
    strategy?: "fixed" | "absolute";
    triggerClassName?: string;
    badgeClassName?: string;
    menuClassName?: string;
    headerClassName?: string;
    footerClassName?: string;
}

interface DropdownButtonProps extends Pick<MotionUIProps, 'motion'> {
    children: React.ReactNode;
    badge?: BadgeProps;
    /** `"static"` — always visible; `"dynamic"` — shows/hides with the menu. */
    display?: "static" | "dynamic";
    className?: string;
    badgeClassName?: string;
    title?: string;
    onToggle?: () => void;
    open?: boolean;
    menuId?: string;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}

interface DropdownItemProps {
    /** Link URL. When set, renders as `<a>`, otherwise as `<button>`. */
    url?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    className?: string;
    children: React.ReactNode;
    /** Leading icon name. */
    icon?: string;
}
interface DropdownHeaderProps {
    children: React.ReactNode;
    className?: string;
}
interface DropdownDividerProps {
    className?: string;
}

export const Dropdown = ({
                             children,
                             trigger,
                             badge              = undefined,
                             header             = undefined,
                             footer             = undefined,
                             defaultOpen        = false,
                             open: controlledOpen = undefined,
                             onOpenChange       = undefined,
                             staticOpen         = false,
                             position           = undefined,
                             placement          = "bottom",
                             strategy           = "fixed",
                             wrapperClassName          = undefined,
                             className          = undefined,
                             before                = undefined,
                             after               = undefined,
                             triggerClassName   = undefined,
                             menuClassName          = undefined,
                             badgeClassName         = undefined,
                             headerClassName        = undefined,
                             footerClassName        = undefined,
                             motion: motionConfig = undefined,

}: DropdownProps) => {
    const theme = useTheme("dropdown");
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const menuId = React.useId();
    const open = staticOpen ? true : controlledOpen ?? uncontrolledOpen;
    const [resolvedPlacement, setResolvedPlacement] = React.useState<'top' | 'bottom'>('bottom');
    const [maxMenuHeight, setMaxMenuHeight] = React.useState<number | undefined>(undefined);
    const [menuCoords, setMenuCoords] = React.useState<{ top?: number; bottom?: number; left?: number; right?: number } | null>(null);
    const renderToggle = !staticOpen && trigger !== undefined;
    const menuMotionStyle = useMotionState(open, motionConfig ?? theme.Dropdown.motion?.open ?? 'fadeDown', theme.Dropdown.motion?.open ?? 'fadeDown');

    const updateOpen = React.useCallback((nextOpen: boolean) => {
        if (staticOpen) return;
        if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
    }, [staticOpen, controlledOpen, onOpenChange]);

    React.useEffect(() => {
        if (!open || staticOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            // menuRef is checked separately because the "fixed" strategy portals the menu
            // to document.body (see render below) — it's no longer a DOM descendant of rootRef.
            if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
                updateOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') updateOpen(false);
        };

        window.document.addEventListener('pointerdown', handlePointerDown);
        window.document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.document.removeEventListener('pointerdown', handlePointerDown);
            window.document.removeEventListener('keydown', handleKeyDown);
        };
    }, [staticOpen, open, updateOpen]);
    React.useEffect(() => {
        if (!open || staticOpen || !triggerRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom - 8;
        const spaceAbove = triggerRect.top - 8;

        let resolved: 'top' | 'bottom';
        if (placement === 'auto') {
            const menuHeight = menuRef.current ? menuRef.current.scrollHeight : 240;
            resolved = spaceBelow < menuHeight + 8 ? 'top' : 'bottom';
            setResolvedPlacement(resolved);
        } else {
            resolved = placement === 'top' ? 'top' : 'bottom';
        }

        const available = resolved === 'top' ? spaceAbove : spaceBelow;
        setMaxMenuHeight(Math.max(160, available));

        if (strategy === 'absolute') return;

        // Fixed coords so menu escapes any stacking context (e.g. sticky topbar)
        const isEnd = position === 'end';
        const isStart = position === 'start';
        setMenuCoords(
            resolved === 'top'
                ? {
                    bottom: window.innerHeight - triggerRect.top + 4,
                    ...(isEnd ? { right: window.innerWidth - triggerRect.right } : isStart ? { left: triggerRect.left } : { left: triggerRect.left }),
                  }
                : {
                    top: triggerRect.bottom + 4,
                    ...(isEnd ? { right: window.innerWidth - triggerRect.right } : isStart ? { left: triggerRect.left } : { left: triggerRect.left }),
                  }
        );
    }, [open, placement, position, staticOpen, strategy]);

    function isDropdownToggler(button: unknown): button is DropdownTogglerProps {
        return (
            typeof button === "object" &&
            button !== null &&
            !React.isValidElement(button) &&
            ("icon" in button || "text" in button)
        );
    }

    const Button = renderToggle ? <DropdownButton className={triggerClassName} badge={badge} badgeClassName={badgeClassName} motion={motionConfig} title={isDropdownToggler(trigger) ? trigger.title : undefined} onToggle={() => updateOpen(!open)} open={open} menuId={menuId} buttonRef={triggerRef}>
        {isDropdownToggler(trigger)
            ? <>
                {trigger.icon && <Icon name={trigger.icon} className={trigger.text ? "mr-2" : undefined} />}
                {trigger.text}
            </>
            : trigger
        }
    </DropdownButton> : null;


    const resolvedWrapClass = wrapperClassName ?? theme.Dropdown.wrapperClassName ?? ((before || after) ? 'flex items-center gap-2' : undefined);

    const absolutePlacementClass = resolvedPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';
    const absolutePositionClass = position === 'end' ? 'right-0' : 'left-0';

    const menuElement = (
        <div
             ref={menuRef}
             id={menuId}
             role="menu"
             aria-hidden={!open}
             className={cn(
                 "min-w-56 overflow-y-auto rounded-xl border border-border/60 bg-popover/95 p-1 text-popover-foreground shadow-xl shadow-black/5 outline-none backdrop-blur supports-[backdrop-filter]:bg-popover/90 dark:shadow-black/20",
                 staticOpen ? "relative" : strategy === 'absolute' ? `absolute z-[200] ${absolutePlacementClass} ${absolutePositionClass}` : "fixed z-[200]",
                 menuClassName || theme.Dropdown.menuClassName
             )}
             style={staticOpen
                 ? undefined
                 : {
                     ...menuMotionStyle,
                     opacity: open ? 1 : 0,
                     visibility: open ? 'visible' : 'hidden',
                     pointerEvents: open ? undefined : 'none',
                     maxHeight: maxMenuHeight,
                     minWidth: triggerRef.current ? triggerRef.current.offsetWidth : undefined,
                     ...(strategy === 'fixed' ? menuCoords ?? {} : {}),
                 }}
             onClick={(e) => {
                 e.stopPropagation();
             }}
        >
            {header && <div className={cn("px-2 py-1.5 text-sm font-semibold", headerClassName || theme.Dropdown.headerClassName)}>
                {header}
                <DropdownDivider />
            </div>}
            {children}
            {footer && <div className={(footerClassName || theme.Dropdown.footerClassName)}>
                <DropdownDivider />
                {footer}
            </div>}
        </div>
    );

    // "fixed" strategy computes viewport-relative coordinates specifically so the menu can
    // escape ancestor stacking contexts (sticky topbars, etc.) — but a transformed ancestor
    // (e.g. Modal's enter/exit animation) still traps a same-DOM-tree `position: fixed` node
    // by creating a new containing block, clipping it via the ancestor's own overflow-hidden.
    // Portaling to document.body sidesteps that entirely; "absolute"/static stay in-place
    // since they're deliberately positioned relative to the trigger's own layout flow.
    const canPortal = !staticOpen && strategy === 'fixed' && typeof document !== 'undefined';

    return (
        <Wrapper className={resolvedWrapClass}>
            {before}
            <div ref={rootRef} className={cn(staticOpen ? "inline-block text-left" : "relative inline-block text-left", className || theme.Dropdown.className)}>
                {Button}
                {canPortal ? createPortal(menuElement, document.body) : menuElement}
            </div>
            {after}
        </Wrapper>
    );
};


export const DropdownButton = ({
                                   children,
                                   badge        = undefined,
                                   display      = "dynamic",
                                   className    = undefined,
                                   badgeClassName   = undefined,
                                   motion: motionConfig = undefined,
                                   title        = undefined,
                                   onToggle     = undefined,
                                   open         = false,
                                   menuId       = undefined,
                                   buttonRef    = undefined
}: DropdownButtonProps) => {
    const theme = useTheme("dropdown");
    const motion = usePressMotion(false, {cursor: "pointer"}, motionConfig ?? theme.Dropdown.motion?.press ?? 'press');

    const button = (
        <button
            ref={buttonRef}
            type="button"
            title={title}
            className={cn("inline-flex items-center justify-center gap-2", className || theme.Dropdown.triggerClassName)}
            style={motion.style}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={onToggle}
            {...motion.pressHandlers}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle?.();
                }
            }}
            data-display={display}
        >
            {children}
        </button>
    );

    return (
        <BadgeOverlay badge={badge} className={badgeClassName || theme.Dropdown.badgeClassName}>
            {button}
        </BadgeOverlay>
    );
};

export const DropdownItem = ({
                                 children,
                                 url        = undefined,
                                 onClick    = undefined,
                                 icon       = undefined,
                                 className  = undefined
}: DropdownItemProps) => {
    const theme = useTheme("dropdown");
    const item = icon 
        ? <span className="inline-flex min-w-0 items-center gap-2">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                <Icon name={icon} size={16} />
            </span>
            <span className="min-w-0">
                {children}
            </span>
        </span>
        : children;

    return url ? (
        <Link 
            to={url}
            role="menuitem"
            className={cn("flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className || theme.Dropdown.menuItemClass)}
        >
            {item}
        </Link>
    ) : onClick ? (
        <button 
            onClick={onClick}
            role="menuitem"
            className={cn("flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className || theme.Dropdown.menuItemClass)}
        >
            {item}
        </button>
    ) : (
        <span role="menuitem" className={cn("flex w-full select-none items-center rounded-sm px-2 py-1.5 text-sm", className || theme.Dropdown.menuItemClass)}>
            {item}
        </span>
    );
};

export const DropdownHeader = ({children, className}: DropdownHeaderProps) => {
    const theme = useTheme("dropdown");
    return (
        <div className={cn("px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground", className || theme.Dropdown.menuHeaderClass)}>
            {children}
        </div>
    );
}

export const DropdownDivider = ({className}: DropdownDividerProps) => {
    const theme = useTheme("dropdown");
    return <div className={cn("-mx-1 my-1 h-px bg-border/60", className || theme.Dropdown.menuDividerClass)} />;
}

interface DropdownMenuProps {
    menuKey: string;
    as?: 'ul' | 'ol';
    badges?: Record<string, { type?: BadgeType; children: string }>;
    before?: React.ReactNode;
    after?: React.ReactNode;
}

export const DropdownMenu = ({
    menuKey,
    as            = 'ul',
    badges        = {},
    before           = undefined,
    after          = undefined
}: DropdownMenuProps) => {
    const theme = useTheme("dropdown");

    return <Menu
        menuKey={menuKey}
        as={as}
        badges={badges}
        before={before}
        after={after}
        wrapperClassName={theme.Dropdown.Menu.wrapperClassName}
        className={theme.Dropdown.Menu.className}
        headerClassName={theme.Dropdown.Menu.headerClassName}
        itemClassName={theme.Dropdown.Menu.itemClassName}
        linkClassName={theme.Dropdown.Menu.linkClassName}
        iconClassName={theme.Dropdown.Menu.iconClassName}
        textClassName={theme.Dropdown.Menu.textClassName}
        badgeClassName={theme.Dropdown.Menu.badgeClassName}
        arrowClassName={theme.Dropdown.Menu.arrowClassName}
        submenuClassName={theme.Dropdown.Menu.submenuClassName}
    />
}
