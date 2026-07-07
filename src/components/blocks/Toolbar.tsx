import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../Theme';
import { cn } from '../../libs/cn';

type ScrollTarget =
    | Window
    | HTMLElement
    | null
    | undefined
    | React.RefObject<HTMLElement | null>;

export interface ToolbarProps {
    leading?: React.ReactNode;
    center?: React.ReactNode;
    trailing?: React.ReactNode;
    children?: React.ReactNode;
    /** Stick the toolbar to the top of the viewport on scroll. */
    sticky?: boolean;
    /** Add shadow on scroll when `sticky` is enabled. */
    elevateOnScroll?: boolean;
    /** Scroll container to observe for sticky threshold. Defaults to `window`. */
    scrollTarget?: ScrollTarget;
    /** Px threshold before sticky/elevate activates. */
    scrollThreshold?: number;
    className?: string;
    innerClassName?: string;
    leadingClassName?: string;
    centerClassName?: string;
    trailingClassName?: string;
}

function resolveScrollElement(target: ScrollTarget): Window | HTMLElement {
    if (!target) return window;
    if ('current' in target) return target.current ?? window;
    return target;
}

function readScrollTop(target: Window | HTMLElement): number {
    return target instanceof Window ? target.scrollY : target.scrollTop;
}

export default function Toolbar({
    leading = undefined,
    center = undefined,
    trailing = undefined,
    children = undefined,
    sticky = true,
    elevateOnScroll = true,
    scrollTarget = undefined,
    scrollThreshold = 8,
    className = undefined,
    innerClassName = undefined,
    leadingClassName = undefined,
    centerClassName = undefined,
    trailingClassName = undefined,
}: ToolbarProps) {
    const theme = useTheme('toolbar');
    const centerContent = center ?? children;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!elevateOnScroll || typeof window === 'undefined') {
            setScrolled(false);
            return;
        }

        const target = resolveScrollElement(scrollTarget);
        const update = () => setScrolled(readScrollTop(target) > scrollThreshold);

        update();
        target.addEventListener('scroll', update, { passive: true });
        return () => {
            target.removeEventListener('scroll', update);
        };
    }, [elevateOnScroll, scrollTarget, scrollThreshold]);

    const wrapperClassNames = useMemo(() => cn(
        'w-full border-b border-transparent transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200',
        theme.Toolbar.wrapperClassName,
        sticky && theme.Toolbar.stickyClassName,
        elevateOnScroll ? (scrolled ? theme.Toolbar.scrolledClassName : theme.Toolbar.restingClassName) : theme.Toolbar.scrolledClassName,
        className,
    ), [theme, sticky, elevateOnScroll, scrolled, className]);

    return (
        <header className={wrapperClassNames}>
            <div className={cn('flex min-h-14 items-center gap-3 px-4', theme.Toolbar.innerClassName, innerClassName)}>
                {leading ? (
                    <div className={cn('flex min-w-0 items-center gap-2 shrink-0', theme.Toolbar.leadingClassName, leadingClassName)}>
                        {leading}
                    </div>
                ) : null}

                {centerContent ? (
                    <div className={cn('flex min-w-0 flex-1 items-center gap-3', theme.Toolbar.centerClassName, centerClassName)}>
                        {centerContent}
                    </div>
                ) : <div className="flex-1" />}

                {trailing ? (
                    <div className={cn('flex shrink-0 items-center gap-2', theme.Toolbar.trailingClassName, trailingClassName)}>
                        {trailing}
                    </div>
                ) : null}
            </div>
        </header>
    );
}
