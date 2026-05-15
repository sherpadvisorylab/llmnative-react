import React from "react";
import {useTheme} from "../../Theme";
import type { UIProps } from '../types';
import { Wrapper } from "./GridSystem";
import { cn } from '../../libs/cn';

export type BadgeType = "info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark";

export type BadgeDescriptor = {
    content: React.ReactNode;
    type?: BadgeType;
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
            type: value.type || fallbackType,
            className: cn(value.className, fallbackClassName),
        };
    }

    return {
        content: value,
        type: fallbackType,
        className: fallbackClassName,
    };
}

export type BadgeOverlayProps = {
    badge?: BadgeProps;
    content?: React.ReactNode;
    type?: BadgeType;
    defaultType?: BadgeType;
    className?: string;
    descriptorOnly?: boolean;
    children?: React.ReactNode;
};

export const BadgeOverlay = ({
    badge,
    content = undefined,
    type = undefined,
    defaultType = "info",
    className = undefined,
    descriptorOnly = false,
    children = undefined
}: BadgeOverlayProps): React.ReactNode => {
    const value = content !== undefined
        ? { content, type, className }
        : badge;

    if (descriptorOnly && content === undefined && !isBadgeDescriptor(badge)) return badge ?? null;

    const normalized = normalizeBadgeProps(value, type || defaultType, className);

    if (!normalized) return children ?? null;

    if (children !== undefined) {
        return (
            <Badge type={normalized.type} post={normalized.content} className={normalized.className}>
                {children}
            </Badge>
        );
    }

    return (
        <Badge type={normalized.type} className={normalized.className}>
            {normalized.content}
        </Badge>
    );
};

export type BadgeComponentProps = {
    children: string | React.ReactNode;
    type?: BadgeType;
} & UIProps;

const Badge = ({
    children,
    type        = "info",
    pre         = undefined,
    post        = undefined,
    wrapClass   = undefined,
    className   = undefined
}: BadgeComponentProps) => {
    const theme = useTheme("badge");

    // Overlay mode: children is a React element (not a plain string/number)
    if (React.isValidElement(children)) {
        const badgeClass = cn("badge badge-overlay badge-" + type, "absolute top-0 z-10", className || theme.Badge.className);
        return (
            <span className={cn("relative inline-flex", wrapClass)}>
                {children}
                {pre !== undefined && (
                    <span className={cn(badgeClass, "left-0 -translate-x-1/2 -translate-y-1/2")}>{pre}</span>
                )}
                {post !== undefined && (
                    <span className={cn(badgeClass, "right-0 translate-x-1/2 -translate-y-1/2")}>{post}</span>
                )}
                {pre === undefined && post === undefined && (
                    <span className={cn(badgeClass, "right-0 translate-x-1/2 -translate-y-1/2 !p-0 !min-w-0 w-2.5 h-2.5 rounded-full")} />
                )}
            </span>
        );
    }

    return (
        <Wrapper className={wrapClass}>
            {pre}
            <span className={cn("badge badge-" + type, className || theme.Badge.className)}>
                {children}
            </span>
            {post}
        </Wrapper>
    );
}

export default Badge;
