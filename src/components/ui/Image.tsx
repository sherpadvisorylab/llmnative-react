import React, { useState } from "react";
import { Wrapper } from "./GridSystem";
import { PLACEHOLDER_IMAGE } from "../../Theme";
import { UIProps } from '../..';
import { useTheme } from "../../Theme";
import { cn } from '../../libs/cn';
import { useEnterMotion, useMotionState } from '../../motion';
import type { MotionReference } from '../../motion';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
export type ImagePosition =
    | 'center'
    | 'top' | 'bottom' | 'left' | 'right'
    | 'top left' | 'top right' | 'bottom left' | 'bottom right';

type ImageProps = {
    src: string;
    placeholder?: string;
    label?: string;
    title?: string;
    fit?: ImageFit;
    position?: ImagePosition;
    feedback?: React.ReactNode;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
    srcset?: string;
    sizes?: string;
} & UIProps;

const Image = ({
                   src,
                   placeholder   = undefined,
                   label        = undefined,
                   title        = undefined,
                   fit          = undefined,
                   position     = undefined,
                   feedback     = undefined,
                   style        = undefined,
                   width        = undefined,
                   height       = undefined,
                   srcset       = undefined,
                   sizes        = undefined,
                   pre          = undefined,
                   post         = undefined,
                   wrapClass    = undefined,
                   className    = undefined
}: ImageProps) => {
    const theme = useTheme("image");

    const enterRef: MotionReference = theme.Image.motion?.enter ?? false;
    const hoverRef: MotionReference = theme.Image.motion?.hover ?? false;
    const hasHover = hoverRef !== false;

    const enterStyle = useEnterMotion(undefined, enterRef, false);
    const [hovered, setHovered] = useState(false);
    const hoverStyle = useMotionState(hovered, hoverRef, false);

    return (
        <Wrapper className={cn("flex items-center gap-4", wrapClass || theme.Image.wrapClass)}>
            {pre && <div className="shrink-0 self-center">{pre}</div>}
            <div
                className={cn("flex min-w-0 flex-col", hasHover && "overflow-hidden")}
                style={enterStyle}
                onMouseEnter={hasHover ? () => setHovered(true) : undefined}
                onMouseLeave={hasHover ? () => setHovered(false) : undefined}
            >
                <img
                    src={src || placeholder || PLACEHOLDER_IMAGE}
                    alt={label || title || src}
                    title={title}
                    className={className || theme.Image.className}
                    style={{
                        ...(width && height
                            ? { maxWidth: width, aspectRatio: `${width} / ${height}`, width: '100%' }
                            : width
                                ? { maxWidth: width, width: '100%' }
                                : height
                                    ? { height }
                                    : {}),
                        ...(fit      ? { objectFit: fit }          : {}),
                        ...(position ? { objectPosition: position }: {}),
                        ...style,
                        ...(hasHover ? hoverStyle : {}),
                    }}
                    width={width}
                    height={height}
                    srcSet={srcset}
                    sizes={sizes}
                />
                {feedback && <div className="feedback">{feedback}</div>}
            </div>
            {post && <div className="shrink-0 self-center">{post}</div>}
        </Wrapper>
    );
};

export default Image;
