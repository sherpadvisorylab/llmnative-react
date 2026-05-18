import React, { useEffect, useState } from "react";
import path from "../../libs/path";
import { PLACEHOLDER_USER, useTheme } from "../../Theme";
import type { UIProps } from '../types';
import { Wrapper } from "./GridSystem";
import { cn } from '../../libs/cn';
import { useEnterMotion, useMotionState } from '../../motion';
import type { MotionReference } from '../../motion';

export type AvatarFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

interface ImageAvatarProps extends UIProps {
    src: string;
    width?: number;
    height?: number;
    title?: string;
    alt?: string;
    fit?: AvatarFit;
    feedback?: React.ReactNode;
    cacheKey?: string;
}

const ImageAvatar = ({
    src,
    width      = undefined,
    height     = undefined,
    title      = undefined,
    alt        = undefined,
    fit        = 'cover',
    feedback   = undefined,
    cacheKey   = undefined,
    pre        = undefined,
    post       = undefined,
    wrapClass  = undefined,
    className  = undefined,
}: ImageAvatarProps) => {
    const theme = useTheme("image");
    const [imgSrc, setImgSrc] = useState(PLACEHOLDER_USER);

    const enterRef: MotionReference = theme.ImageAvatar?.motion?.enter ?? false;
    const hoverRef: MotionReference = theme.ImageAvatar?.motion?.hover ?? false;
    const hasHover = hoverRef !== false;

    const enterStyle = useEnterMotion(undefined, enterRef, false);
    const [hovered, setHovered] = useState(false);
    const hoverStyle = useMotionState(hovered, hoverRef, false);

    const storageKey = `avatar::${cacheKey || src}`;
    const failedStorageKey = `avatar-fetch-failed::${cacheKey || src}`;
    const resolvedAlt = alt || title || path.filename(src || PLACEHOLDER_USER);

    useEffect(() => {
        if (!src || src.startsWith('data:')) {
            setImgSrc(src || PLACEHOLDER_USER);
            return;
        }

        const cached = localStorage.getItem(storageKey);
        if (cached) {
            setImgSrc(cached);
            return;
        }

        setImgSrc(src);

        const failedAt = Number(localStorage.getItem(failedStorageKey) || 0);
        if (failedAt && Date.now() - failedAt < 24 * 60 * 60 * 1000) return;

        // Cache remote avatars opportunistically. If CORS blocks the fetch,
        // keep the browser-rendered image instead of replacing it with fallback.
        fetch(src)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const data = reader.result as string;
                    localStorage.setItem(storageKey, data);
                    localStorage.removeItem(failedStorageKey);
                    setImgSrc(data);
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.warn("ImageAvatar:", err.message);
                localStorage.setItem(failedStorageKey, String(Date.now()));
            });
    }, [src, storageKey, failedStorageKey]);

    const size = width ?? height ?? undefined;
    const imgStyle: React.CSSProperties = {
        ...(width && height
            ? { width, height, objectFit: fit }
            : size
                ? { width: size, height: size, objectFit: fit }
                : { objectFit: fit }),
        ...(hasHover ? hoverStyle : {}),
    };

    return (
        <Wrapper className={cn("flex items-center gap-3", wrapClass || theme.ImageAvatar?.wrapClass)}>
            {pre && <div className="shrink-0 self-center">{pre}</div>}
            <div
                className={cn("shrink-0", hasHover && "overflow-hidden")}
                style={enterStyle}
                onMouseEnter={hasHover ? () => setHovered(true) : undefined}
                onMouseLeave={hasHover ? () => setHovered(false) : undefined}
            >
                <img
                    src={imgSrc}
                    alt={resolvedAlt}
                    width={width ?? size}
                    height={height ?? size}
                    className={cn(className || theme.ImageAvatar?.className)}
                    title={title}
                    style={imgStyle}
                    onError={() => setImgSrc(PLACEHOLDER_USER)}
                />
                {feedback && <div className="mt-1 text-xs text-center">{feedback}</div>}
            </div>
            {post && <div className="min-w-0 self-center">{post}</div>}
        </Wrapper>
    );
};

export default ImageAvatar;
