import React from 'react';
import {Link} from "react-router-dom";
import {useTheme} from "../../Theme";
import {Wrapper} from "../ui/GridSystem";
import { BadgeOverlay, BadgeProps } from "../ui/Badge";
import Menu from './Menu';
import { cn } from '../../libs/cn';
import { useMotionState, usePressMotion } from '../../motion';
import type { MotionUIProps } from '../types';
import Icon from '../ui/Icon';

interface DropdownTogglerProps {
    icon?: string;
    text?: string;
}
interface DropdownProps extends Pick<MotionUIProps, 'motion'> {
    children: React.ReactNode;
    toggleButton?: string | React.ReactNode | DropdownTogglerProps;
    badge?: BadgeProps;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    alwaysOpen?: boolean;
    position?: "start" | "end";
    placement?: "auto" | "top" | "bottom";
    wrapClass?: string;
    className?: string;
    buttonClass?: string;
    badgeClass?: string;
    menuClass?: string;
    headerClass?: string;
    footerClass?: string;
}

interface DropdownButtonProps extends Pick<MotionUIProps, 'motion'> {
    children: React.ReactNode;
    badge?: BadgeProps;
    display?: "static" | "dynamic";
    className?: string;
    badgeClass?: string;
    onToggle?: () => void;
    open?: boolean;
    menuId?: string;
}

interface DropdownItemProps {
    url?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    className?: string;
    children: React.ReactNode;
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
                             toggleButton,
                             badge              = undefined,
                             header             = undefined,
                             footer             = undefined,
                             defaultOpen        = false,
                             open: controlledOpen = undefined,
                             onOpenChange       = undefined,
                             alwaysOpen         = false,
                             position           = undefined,
                             placement          = "bottom",
                             wrapClass          = undefined,
                             className          = undefined,
                             buttonClass        = undefined,
                             menuClass          = undefined,
                             badgeClass         = undefined,
                             headerClass        = undefined,
                             footerClass        = undefined,
                             motion: motionConfig = undefined,

}: DropdownProps) => {
    const theme = useTheme("dropdown");
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const menuId = React.useId();
    const open = alwaysOpen ? true : controlledOpen ?? uncontrolledOpen;
    const [resolvedPlacement, setResolvedPlacement] = React.useState<'top' | 'bottom'>('bottom');
    const renderToggle = !alwaysOpen && toggleButton !== undefined;
    const menuMotionStyle = useMotionState(open, motionConfig ?? theme.Dropdown.motion?.open ?? 'fadeDown', theme.Dropdown.motion?.open ?? 'fadeDown');

    const updateOpen = React.useCallback((nextOpen: boolean) => {
        if (alwaysOpen) return;
        if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
    }, [alwaysOpen, controlledOpen, onOpenChange]);

    React.useEffect(() => {
        if (!open || alwaysOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
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
    }, [alwaysOpen, open, updateOpen]);
    React.useEffect(() => {
        if (!open || placement !== 'auto' || !rootRef.current) return;
        const trigger = rootRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - trigger.bottom;
        const menuHeight = menuRef.current ? menuRef.current.scrollHeight : 240;
        setResolvedPlacement(spaceBelow < menuHeight + 8 ? 'top' : 'bottom');
    }, [open, placement]);

    function isDropdownToggler(button: any): button is DropdownTogglerProps {
        return (
            typeof button === "object" &&
            button !== null &&
            !React.isValidElement(button) &&
            ("icon" in button || "text" in button)
        );
    }

    const Button = renderToggle ? <DropdownButton className={buttonClass} badge={badge} badgeClass={badgeClass} motion={motionConfig} onToggle={() => updateOpen(!open)} open={open} menuId={menuId}>
        {isDropdownToggler(toggleButton)
            ? <>
                {toggleButton.icon && <Icon name={toggleButton.icon} className={toggleButton.text ? "mr-2" : undefined} />}
                {toggleButton.text}
            </>
            : toggleButton
        }
    </DropdownButton> : null;


    return (
        <Wrapper className={wrapClass || theme.Dropdown.wrapClass}>
            <div ref={rootRef} className={cn(alwaysOpen ? "inline-block text-left" : "relative inline-block text-left", className || theme.Dropdown.className)}>
                {Button}
                <div
                     ref={menuRef}
                     id={menuId}
                     role="menu"
                     aria-hidden={!open}
                     className={cn(
                         "min-w-56 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none",
                         alwaysOpen ? "relative" : "absolute z-50",
                         !alwaysOpen && position === "end" && "right-0",
                         !alwaysOpen && position === "start" && "left-0",
                         !alwaysOpen && placement === 'auto' && resolvedPlacement === 'bottom' && "top-full mt-1",
                         !alwaysOpen && placement === 'auto' && resolvedPlacement === 'top' && "bottom-full mb-1",
                         !alwaysOpen && placement === 'top' && "bottom-full top-auto mb-1",
                         !alwaysOpen && placement === 'bottom' && "mt-2",
                         placement !== 'auto' && (menuClass || theme.Dropdown.menuClass)
                     )}
                     style={alwaysOpen
                         ? undefined
                         : {
                             ...menuMotionStyle,
                             opacity: open ? 1 : 0,
                             visibility: open ? 'visible' : 'hidden',
                             pointerEvents: open ? undefined : 'none',
                         }}
                     onClick={(e) => {
                         e.stopPropagation();
                     }}
                >
                    {header && <div className={cn("px-2 py-1.5 text-sm font-semibold", headerClass || theme.Dropdown.headerClass)}>
                        {header}
                        <DropdownDivider />
                    </div>}
                    {children}
                    {footer && <div className={(footerClass || theme.Dropdown.footerClass)}>
                        <DropdownDivider />
                        {footer}
                    </div>}
                </div>
            </div>
        </Wrapper>
    );
};


export const DropdownButton = ({
                                   children,
                                   badge        = undefined,
                                   display      = "dynamic",
                                   className    = undefined,
                                   badgeClass   = undefined,
                                   motion: motionConfig = undefined,
                                   onToggle     = undefined,
                                   open         = false,
                                   menuId       = undefined
}: DropdownButtonProps) => {
    const theme = useTheme("dropdown");
    const motion = usePressMotion(false, {cursor: "pointer"}, motionConfig ?? theme.Dropdown.motion?.press ?? 'press');

    const button = (
        <button
            type="button"
            className={cn("inline-flex items-center justify-center gap-2", className || theme.Dropdown.buttonClass)}
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
        <BadgeOverlay badge={badge} className={badgeClass || theme.Dropdown.badgeClass}>
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
    return <div className={cn("-mx-1 my-1 h-px bg-border", className || theme.Dropdown.menuDividerClass)} />;
}

interface DropdownMenuProps {
    context: string;
    Type?: 'ul' | 'ol';
    badges?: Record<string, any>;
    pre?: React.ReactNode;
    post?: React.ReactNode;
}

export const DropdownMenu = ({  
    context,
    Type          = 'ul',
    badges        = {},
    pre           = undefined,
    post          = undefined
}: DropdownMenuProps) => {
    const theme = useTheme("dropdown");

    return <Menu 
        context={context} 
        Type={Type} 
        badges={badges} 
        pre={pre} 
        post={post} 
        wrapClass={theme.Dropdown.Menu.wrapClass}
        className={theme.Dropdown.Menu.className}
        headerClass={theme.Dropdown.Menu.headerClass}
        itemClass={theme.Dropdown.Menu.itemClass}
        linkClass={theme.Dropdown.Menu.linkClass}
        iconClass={theme.Dropdown.Menu.iconClass}
        textClass={theme.Dropdown.Menu.textClass}
        badgeClass={theme.Dropdown.Menu.badgeClass}
        arrowClass={theme.Dropdown.Menu.arrowClass}
        submenuClass={theme.Dropdown.Menu.submenuClass}
    />
}
