import React, { useEffect, useState } from "react";
import path from "../../libs/path";
import {PLACEHOLDER_USER, useTheme} from "../../Theme";
import type { UIProps } from '../types';
import { Wrapper } from "./GridSystem";

interface ImageAvatarProps extends UIProps {
    src: string;
    width?: number;
    height?: number;
    title?: string;
    alt?: string;
    cacheKey?: string;
}

const ImageAvatar = ({
    src,
    width      = undefined,
    height     = undefined,
    title      = undefined,
    alt        = undefined,
    cacheKey   = undefined,
    pre        = undefined,
    post       = undefined,
    wrapClass  = undefined,
    className  = undefined,
}: ImageAvatarProps) => {
    const theme = useTheme("image");
    const [imgSrc, setImgSrc] = useState(PLACEHOLDER_USER);

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
        const retryAfterMs = 24 * 60 * 60 * 1000;
        if (failedAt && Date.now() - failedAt < retryAfterMs) {
            return;
        }

        // Cache remote avatars opportunistically. If CORS blocks the fetch,
        // keep the browser-rendered image instead of replacing it with fallback.
        fetch(src)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load image (${res.status})`);
                return res.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    localStorage.setItem(storageKey, base64data);
                    localStorage.removeItem(failedStorageKey);
                    setImgSrc(base64data);
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.warn("ImageAvatar error:", err.message);
                localStorage.setItem(failedStorageKey, String(Date.now()));
            });
    }, [src, storageKey, failedStorageKey]);

    return (
        <Wrapper className={wrapClass || theme.ImageAvatar.wrapClass}>
            {pre}
            <img
                key={imgSrc}
                src={imgSrc}
                alt={resolvedAlt}
                width={width}
                height={height}
                className={className}
                title={title}
                onError={() => setImgSrc(PLACEHOLDER_USER)}
            />
            {post}
        </Wrapper>
    );
};

export default ImageAvatar;
