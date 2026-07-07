import React from "react";
import {useTheme} from "../../Theme";
import type { UIProps } from '../types';
import { Wrapper } from "./GridSystem";
import { cn } from '../../libs/cn';

/** Semantic color variant for `<Badge>` and any component that accepts a badge. */
export type BadgeType = "info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark";

export type BadgeDescriptor = {
    content: React.ReactNode;
    variant?: BadgeType;
    className?: string;
};

export type BadgeProps = React.ReactNode | BadgeDescriptor;

export function isBadgeDescriptor(value: BadgeProps | undefined): value is BadgeDescriptor {
    return (
        typeof value === "object" &&
        value !== null &&
        !React.isValidElement(value) &&
        "content" in value
    );
}

export function normalizeBadgeProps(
    value: BadgeProps | undefined,
    fallbackType: BadgeType = "info",
    fallbackClassName?: string
): BadgeDescriptor | undefined {
    if (value === undefined || value === null || value === false) return undefined;

    if (isBadgeDescriptor(value)) {
        return {
            ...value,
            variant: value.variant || fallbackType,
            className: cn(value.className, fallbackClassName),
        };
    }

    return {
        content: value,
        variant: fallbackType,
        className: fallbackClassName,
    };
}

export type BadgeOverlayProps = {
    /** Shorthand badge descriptor (content + variant). */
    badge?: BadgeProps;
    /** Badge content when not using the `badge` shorthand. */
    content?: React.ReactNode;
    /** Badge color variant. */
    variant?: BadgeType;
    /** Fallback variant when none is specified. */
    defaultType?: BadgeType;
    className?: string;
    /** When `true` and no badge is provided, renders children without wrapping. */
    descriptorOnly?: boolean;
    children?: React.ReactNode;
};

export const BadgeOverlay = ({
    badge,
    content = undefined,
    variant = undefined,
    defaultType = "info",
    className = undefined,
    descriptorOnly = false,
    children = undefined
}: BadgeOverlayProps): React.ReactNode => {
    const value = content !== undefined
        ? { content, variant, className }
        : badge;

    if (descriptorOnly && content === undefined && !isBadgeDescriptor(badge)) return badge ?? null;

    const normalized = normalizeBadgeProps(value, variant || defaultType, className);

    if (!normalized) return children ?? null;

    if (children !== undefined) {
        return (
            <Badge variant={normalized.variant} after={normalized.content} className={normalized.className}>
                {children}
            </Badge>
        );
    }

    return (
        <Badge variant={normalized.variant} className={normalized.className}>
            {normalized.content}
        </Badge>
    );
};

export type BadgeComponentProps = {
    children: string | React.ReactNode;
    /** Semantic color variant. */
    variant?: BadgeType;
} & UIProps;

const Badge = ({
    children,
    variant        = "info",
    before         = undefined,
    after        = undefined,
    wrapperClassName   = undefined,
    className   = undefined
}: BadgeComponentProps) => {
    const theme = useTheme("badge");

    // Overlay mode: children is a React element (not a plain string/number)
    if (React.isValidElement(children)) {
        const badgeClassName = cn("badge badge-overlay badge-" + variant, "absolute top-0 z-10", className || theme.Badge.className);
        return (
            <span className={cn("relative inline-flex", wrapperClassName)}>
                {children}
                {before !== undefined && (
                    <span className={cn(badgeClassName, "left-0 -translate-x-1/2 -translate-y-1/2")}>{before}</span>
                )}
                {after !== undefined && (
                    <span className={cn(badgeClassName, "right-0 translate-x-1/2 -translate-y-1/2")}>{after}</span>
                )}
                {before === undefined && after === undefined && (
                    <span className={cn(badgeClassName, "right-0 translate-x-1/2 -translate-y-1/2 !p-0 !min-w-0 w-2.5 h-2.5 rounded-full")} />
                )}
            </span>
        );
    }

    return (
        <Wrapper className={wrapperClassName}>
            {before}
            <span className={cn("badge badge-" + variant, className || theme.Badge.className)}>
                {children}
            </span>
            {after}
        </Wrapper>
    );
}

export default Badge;
