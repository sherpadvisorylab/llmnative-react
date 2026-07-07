import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Theme';
import { cn } from '../../libs/cn';
import { usePressMotion } from '../../motion';
import type { MotionUIProps } from '../types';
import { Wrapper } from '../ui/GridSystem';
import Icon from '../ui/Icon';

export interface ListCardProps extends MotionUIProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Metadata displayed below the description. */
    meta?: React.ReactNode;
    badge?: React.ReactNode;
    /** Leading icon or custom element. */
    icon?: string | React.ReactNode;
    /** Element displayed on the trailing edge. */
    trailing?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    /** Navigate to this URL on click. */
    href?: string;
    /** Open link in a new tab. */
    external?: boolean;
    active?: boolean;
    disabled?: boolean;
    /** Show a dashed border style. */
    dashed?: boolean;
    /** Compact layout with less padding. */
    compact?: boolean;
    align?: 'start' | 'center';
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    titleClassName?: string;
    descriptionClassName?: string;
    metaClassName?: string;
    badgeClassName?: string;
    leadingClassName?: string;
    bodyClassName?: string;
    headerClassName?: string;
    trailingClassName?: string;
    footerClassName?: string;
}

function renderIcon(icon: ListCardProps['icon']) {
    if (!icon) return null;
    if (typeof icon === 'string') {
        return <Icon name={icon} size={16} />;
    }
    return icon;
}

export default function ListCard({
    title = undefined,
    description = undefined,
    meta = undefined,
    badge = undefined,
    icon = undefined,
    trailing = undefined,
    footer = undefined,
    children = undefined,
    href = undefined,
    external = false,
    active = false,
    disabled = false,
    dashed = false,
    compact = false,
    align = 'start',
    onClick = undefined,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    titleClassName = undefined,
    descriptionClassName = undefined,
    metaClassName = undefined,
    badgeClassName = undefined,
    leadingClassName = undefined,
    bodyClassName = undefined,
    headerClassName = undefined,
    trailingClassName = undefined,
    footerClassName = undefined,
    style = undefined,
    motion: motionConfig = undefined,
}: ListCardProps) {
    const theme = useTheme('listCard');
    const isInteractive = !!href || !!onClick;
    const motion = usePressMotion(disabled || !isInteractive, style, motionConfig ?? theme.ListCard.motion?.press ?? 'press');
    const iconContent = renderIcon(icon);
    const footerContent = footer ?? children;

    const rootClassName = cn(
        'flex w-full gap-3 rounded-xl border border-border/60 bg-background p-4 text-left transition-[background-color,border-color,box-shadow,color] duration-150',
        align === 'center' ? 'items-center' : 'items-start',
        isInteractive && !disabled && 'cursor-pointer',
        theme.ListCard.className,
        active ? theme.ListCard.activeClassName : theme.ListCard.inactiveClassName,
        disabled && theme.ListCard.disabledClassName,
        dashed && theme.ListCard.dashedClassName,
        compact && theme.ListCard.compactClassName,
        className,
    );

    const content = (
        <>
            {iconContent ? (
                <div className={cn(
                    'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
                    align === 'center' && 'mt-0',
                    theme.ListCard.leadingClassName,
                    leadingClassName,
                )}>
                    {iconContent}
                </div>
            ) : null}

            <div className={cn('min-w-0 flex-1', theme.ListCard.bodyClassName, bodyClassName)}>
                {(title || badge) ? (
                    <div className={cn('flex items-center gap-2', theme.ListCard.headerClassName, headerClassName)}>
                        {title ? (
                            <div className={cn('min-w-0 flex-1 truncate text-sm font-semibold text-foreground', theme.ListCard.titleClassName, titleClassName)}>
                                {title}
                            </div>
                        ) : <div className="flex-1" />}
                        {badge ? (
                            <div className={cn('shrink-0', theme.ListCard.badgeClassName, badgeClassName)}>
                                {badge}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {description ? (
                    <div className={cn('mt-1 text-sm text-muted-foreground', theme.ListCard.descriptionClassName, descriptionClassName)}>
                        {description}
                    </div>
                ) : null}

                {meta ? (
                    <div className={cn('mt-1 text-xs text-muted-foreground', theme.ListCard.metaClassName, metaClassName)}>
                        {meta}
                    </div>
                ) : null}

                {footerContent ? (
                    <div className={cn('mt-3', theme.ListCard.footerClassName, footerClassName)}>
                        {footerContent}
                    </div>
                ) : null}
            </div>

            {trailing ? (
                <div className={cn('shrink-0 self-center', theme.ListCard.trailingClassName, trailingClassName)}>
                    {trailing}
                </div>
            ) : null}
        </>
    );

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onClick?.(event);
    };

    let root: React.ReactNode;

    if (href && !disabled) {
        root = external ? (
            <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className={rootClassName}
                style={motion.style}
                {...motion.pressHandlers}
                onClick={handleClick}
            >
                {content}
            </a>
        ) : (
            <Link
                to={href}
                className={rootClassName}
                style={motion.style}
                {...motion.pressHandlers}
                onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
            >
                {content}
            </Link>
        );
    } else if (isInteractive) {
        root = (
            <button
                type="button"
                className={rootClassName}
                style={motion.style}
                disabled={disabled}
                {...motion.pressHandlers}
                onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
            >
                {content}
            </button>
        );
    } else {
        root = (
            <div
                className={rootClassName}
                style={style}
                aria-disabled={disabled || undefined}
            >
                {content}
            </div>
        );
    }

    return (
        <Wrapper className={cn(theme.ListCard.wrapperClassName, wrapperClassName)}>
            {before}
            {root}
            {after}
        </Wrapper>
    );
}
