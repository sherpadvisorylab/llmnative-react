import React from 'react';
import {useTheme} from "../../Theme";
import { UIProps } from '../..';
import { Wrapper } from "./GridSystem";
import Icon from "./Icon";

interface LoaderProps extends UIProps {
    show?: boolean;
    children: React.ReactNode;
    icon?: string;
    title?: string;
    description?: string;
}

function Loader({
                    children,
                    show            = false,
                    icon            = undefined,
                    title           = undefined,
                    description     = undefined,
                    pre            = undefined,
                    post           = undefined,
                    wrapClass      = undefined,
                    className      = undefined
}: LoaderProps) {
    const theme = useTheme("loader");
    icon = icon || theme.Loader.icon;
    title = title || theme.Loader.title;
    description = description || theme.Loader.description;

    return show ? (
        <Wrapper className={wrapClass || theme.Loader.wrapClass}>
            <div className={"relative " + (className || theme.Loader.className)} style={{minHeight: "200px"}}>
                <div className="absolute top-0 bottom-0 left-0 right-0"
                    style={{zIndex:10, backdropFilter: "blur(2px)", background:"rgba(255, 255, 255, 0.5)"}}>
                    {pre}
                    {(icon || title || description) && <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        {icon && <Icon name={icon} size={32} className="animate-spin text-primary" />}
                        {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </div>}
                    {post}
                </div>
                {children}
            </div>
        </Wrapper>
    ) : children;
}

export default Loader;