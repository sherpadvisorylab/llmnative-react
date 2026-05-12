import React from "react";
import {useTheme} from "../../Theme";
import { UIProps } from '../..';
import { Wrapper } from "./GridSystem";
import { cn } from '../../libs/cn';

export type BadgeType = "info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark";

export type BadgeProps = {
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
}: BadgeProps) => {
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
