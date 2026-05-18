import React from 'react';
import { ImageAvatar } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

// ── Sample avatars ────────────────────────────────────────────────────────────

function makeAvatar(initials: string, bg: string, fg = 'white') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="${bg}"/><text x="80" y="80" font-family="Arial" font-size="56" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makePhotoAvatar(bg: string, accent: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="${bg}"/><circle cx="80" cy="62" r="30" fill="${accent}"/><path d="M30 148 C30 110 130 110 130 148" fill="${accent}"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const AVATARS = {
    ada:   makeAvatar('AL', '#2563eb'),
    bob:   makeAvatar('BC', '#059669'),
    carol: makeAvatar('CW', '#7c3aed'),
    diana: makeAvatar('DK', '#dc2626'),
    photo: makePhotoAvatar('#0f172a', '#94a3b8'),
    empty: '',
};

// ── Props definition ──────────────────────────────────────────────────────────

const AVATAR_PROPS: PropDef[] = [
    { name: 'src', type: 'string', required: true, group: 'Core', description: 'Avatar image URL, data URI, or empty string to show placeholder', control: 'select', options: ['ada', 'bob', 'carol', 'diana', 'photo', 'empty'] },
    { name: 'title', type: 'string', group: 'Core', description: 'Tooltip text and accessible name when alt is not provided', control: 'text' },
    { name: 'alt', type: 'string', group: 'Core', description: 'Alt text for screen readers — falls back to title or filename', control: 'text' },
    { name: 'cacheKey', type: 'string', group: 'Core', description: 'Explicit localStorage cache key — useful when src is a signed URL that changes on each request', control: 'text' },
    { name: 'width', type: 'number', group: 'Dimensions', description: 'Avatar width in pixels', control: 'number', min: 24, max: 160 },
    { name: 'height', type: 'number', group: 'Dimensions', description: 'Avatar height in pixels — defaults to width when omitted', control: 'number', min: 24, max: 160 },
    { name: 'fit', type: '"cover" | "contain" | "fill" | "scale-down" | "none"', group: 'Dimensions', description: 'CSS object-fit — cover crops to fill the box (default)', control: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'] },
    { name: 'feedback', type: 'ReactNode', group: 'Slots', description: 'Content rendered below the avatar — useful for status indicators or labels', control: 'text' },
    { name: 'pre', type: 'ReactNode', group: 'Slots', description: 'Content rendered to the left of the avatar', control: 'text' },
    { name: 'post', type: 'ReactNode', group: 'Slots', description: 'Content rendered to the right of the avatar — ideal for name and role', control: 'text' },
    { name: 'className', type: 'string', group: 'Styling', description: 'CSS classes applied to the img element', control: 'text' },
    { name: 'wrapClass', type: 'string', group: 'Styling', description: 'CSS classes applied to the outer wrapper', control: 'text' },
];

const SRC_MAP: Record<string, string> = AVATARS;

const PLAYGROUND: PlaygroundConfig = {
    props: AVATAR_PROPS,
    defaultProps: {
        src: 'ada',
        title: 'Ada Lovelace',
        alt: 'Ada Lovelace',
        cacheKey: '',
        width: 72,
        height: 72,
        fit: 'cover',
        feedback: '',
        pre: '',
        post: 'Ada Lovelace',
        className: 'rounded-full border-2 border-primary',
        wrapClass: '',
    },
    render: (p) => (
        <ImageAvatar
            src={SRC_MAP[p.src] ?? p.src}
            title={p.title || undefined}
            alt={p.alt || undefined}
            cacheKey={p.cacheKey || undefined}
            width={Number(p.width) || undefined}
            height={Number(p.height) || undefined}
            fit={p.fit || undefined}
            feedback={p.feedback || undefined}
            pre={p.pre || undefined}
            post={p.post
                ? <span className="font-medium text-sm">{p.post}</span>
                : undefined}
            className={p.className || undefined}
            wrapClass={p.wrapClass || undefined}
        />
    ),
    size: 'xl',
    layout: 'split',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ImageAvatarPage() {
    usePlayground(PLAYGROUND, 'ImageAvatar');

    return (
        <PageLayout
            title="ImageAvatar"
            description="Avatar image with placeholder fallback and automatic localStorage caching — converts remote URLs to base64 once and never fetches again."
        >
            <Section
                title="Sizes"
                description="Pass width (and optionally height) to control the avatar size. When only width is set, height defaults to the same value producing a square. fit=cover crops the image to fill the box without distortion."
                preview={
                    <div className="flex flex-wrap items-end gap-6">
                        {([24, 32, 48, 64, 96, 128] as const).map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <ImageAvatar
                                    src={AVATARS.ada}
                                    title="Ada Lovelace"
                                    width={s}
                                    className="rounded-full border"
                                />
                                <span className="text-xs text-muted-foreground font-mono">{s}px</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

<ImageAvatar src={avatarUrl} title="Ada Lovelace" width={24} className="rounded-full border" />
<ImageAvatar src={avatarUrl} title="Ada Lovelace" width={48} className="rounded-full border" />
<ImageAvatar src={avatarUrl} title="Ada Lovelace" width={96} className="rounded-full border" />`}
            />

            <Section
                title="Shapes"
                description="className controls the visual shape. rounded-full for circles, rounded-lg for soft squares. Use border and ring utilities to add emphasis."
                preview={
                    <div className="flex flex-wrap items-start gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.bob} title="Bob Chen" width={72} className="rounded-full border-2 border-primary" />
                            <span className="text-xs text-muted-foreground">rounded-full</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.carol} title="Carol Wu" width={72} className="rounded-xl border" />
                            <span className="text-xs text-muted-foreground">rounded-xl</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.diana} title="Diana Kim" width={72} className="rounded border" />
                            <span className="text-xs text-muted-foreground">rounded (square)</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.ada} title="Ada Lovelace" width={72} className="rounded-full ring-2 ring-primary ring-offset-2" />
                            <span className="text-xs text-muted-foreground">ring</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.photo} title="User" width={72} height={96} fit="cover" className="rounded-xl border" />
                            <span className="text-xs text-muted-foreground">portrait 72×96</span>
                        </div>
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

// circle
<ImageAvatar src={url} title="Ada" width={72} className="rounded-full border-2 border-primary" />

// soft square
<ImageAvatar src={url} title="Bob" width={72} className="rounded-xl border" />

// ring highlight
<ImageAvatar src={url} title="Carol" width={72} className="rounded-full ring-2 ring-primary ring-offset-2" />

// portrait (different width/height)
<ImageAvatar src={url} title="User" width={72} height={96} fit="cover" className="rounded-xl border" />`}
            />

            <Section
                title="Post slot — user row"
                description="The post slot renders to the right of the avatar, vertically centred. Use it for name, role, or any metadata. pre renders to the left."
                preview={
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        {[
                            { avatar: AVATARS.ada,   name: 'Ada Lovelace',  role: 'Engineer',       badge: 'badge-primary' },
                            { avatar: AVATARS.bob,   name: 'Bob Chen',      role: 'Designer',       badge: 'badge-success' },
                            { avatar: AVATARS.carol, name: 'Carol Wu',      role: 'Product Manager', badge: 'badge-warning' },
                        ].map(({ avatar, name, role, badge }) => (
                            <ImageAvatar
                                key={name}
                                src={avatar}
                                title={name}
                                width={44}
                                className="rounded-full border"
                                post={
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="font-medium text-sm truncate">{name}</span>
                                        <span className={`badge ${badge} text-xs self-start`}>{role}</span>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

<ImageAvatar
    src={avatarUrl}
    title="Ada Lovelace"
    width={44}
    className="rounded-full border"
    post={
        <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">Ada Lovelace</span>
            <span className="badge badge-primary text-xs">Engineer</span>
        </div>
    }
/>`}
            />

            <Section
                title="Feedback — status indicator"
                description="The feedback slot renders below the avatar image, centred. Use it for online/offline status, a label, or any short inline node."
                preview={
                    <div className="flex flex-wrap gap-8">
                        <ImageAvatar
                            src={AVATARS.ada}
                            title="Ada Lovelace"
                            width={64}
                            className="rounded-full border-2 border-success"
                            feedback={<span className="badge badge-success text-xs">online</span>}
                        />
                        <ImageAvatar
                            src={AVATARS.bob}
                            title="Bob Chen"
                            width={64}
                            className="rounded-full border-2 border-muted"
                            feedback={<span className="badge badge-secondary text-xs">away</span>}
                        />
                        <ImageAvatar
                            src={AVATARS.carol}
                            title="Carol Wu"
                            width={64}
                            className="rounded-full border-2 border-muted"
                            feedback={<span className="badge badge-light text-xs">offline</span>}
                        />
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

<ImageAvatar
    src={avatarUrl}
    title="Ada Lovelace"
    width={64}
    className="rounded-full border-2 border-success"
    feedback={<span className="badge badge-success text-xs">online</span>}
/>`}
            />

            <Section
                title="Placeholder fallback"
                description="When src is empty, unreachable, or fails to load, ImageAvatar renders the theme's user placeholder automatically. No broken-image icon is ever shown."
                preview={
                    <div className="flex flex-wrap gap-6 items-end">
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src="" title="No src" width={64} className="rounded-full border" />
                            <span className="text-xs text-muted-foreground">src=""</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src="https://broken.invalid/avatar.jpg" title="Broken URL" width={64} className="rounded-full border" />
                            <span className="text-xs text-muted-foreground">broken URL</span>
                        </div>
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

// empty src → placeholder
<ImageAvatar src="" title="No image" width={64} className="rounded-full border" />

// broken URL → onError fires → placeholder
<ImageAvatar src="https://broken.invalid/avatar.jpg" title="User" width={64} className="rounded-full border" />`}
            />

            <Section
                title="Caching — localStorage"
                description="When src is a remote URL, ImageAvatar fetches it once, converts it to a base64 data URI, and stores it in localStorage under the key avatar::{src}. Subsequent renders are instant and work offline. Use cacheKey when src is a signed URL that changes on each request but refers to the same image."
                preview={
                    <div className="rounded-lg border bg-muted p-4 text-sm font-mono space-y-1">
                        <div><span className="text-muted-foreground">// first render</span></div>
                        <div>fetch(<span className="text-primary">'https://cdn.example.com/avatars/123.jpg'</span>)</div>
                        <div>localStorage.setItem(<span className="text-primary">'avatar::https://cdn…'</span>, base64)</div>
                        <div className="pt-1"><span className="text-muted-foreground">// subsequent renders (same session or later)</span></div>
                        <div>localStorage.getItem(<span className="text-primary">'avatar::https://cdn…'</span>) <span className="text-success">// instant</span></div>
                        <div className="pt-1"><span className="text-muted-foreground">// signed URLs — use cacheKey to decouple key from URL</span></div>
                        <div>{'<'}ImageAvatar src=<span className="text-primary">{'{signedUrl}'}</span> cacheKey=<span className="text-primary">"user-123"</span> {'/>'}</div>
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

// Standard — cacheKey derived from src automatically
<ImageAvatar src="https://cdn.example.com/avatars/123.jpg" title="Ada" width={48} className="rounded-full" />

// Signed URLs change on each request — pin cacheKey to a stable identifier
<ImageAvatar
    src={signedUrl}
    cacheKey="user-123"
    title="Ada"
    width={48}
    className="rounded-full"
/>`}
            />

            <PropsTable props={AVATAR_PROPS} />
        </PageLayout>
    );
}
