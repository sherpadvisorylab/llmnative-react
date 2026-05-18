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

function makePhotoAvatar(bg: string, skin: string, hair: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="${bg}"/><circle cx="80" cy="58" r="32" fill="${skin}"/><ellipse cx="80" cy="58" rx="20" ry="16" fill="${hair}"/><ellipse cx="80" cy="42" rx="32" ry="22" fill="${hair}"/><path d="M28 160 C28 108 132 108 132 160Z" fill="${skin}"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const AVATARS = {
    ada:   makeAvatar('AL', '#2563eb'),
    bob:   makeAvatar('BC', '#059669'),
    carol: makeAvatar('CW', '#7c3aed'),
    diana: makeAvatar('DK', '#dc2626'),
    evan:  makeAvatar('EF', '#d97706'),
    photo: makePhotoAvatar('#dbeafe', '#fcd5b0', '#92400e'),
    empty: '',
};

// ── Badge presets for playground ──────────────────────────────────────────────

const BADGE_PRESETS: Record<string, any> = {
    '':        undefined,
    'online':  { content: undefined, type: 'success' },
    'away':    { content: undefined, type: 'warning' },
    'offline': { content: undefined, type: 'secondary' },
    '5':       { content: '5',       type: 'danger' },
    'new':     { content: 'new',     type: 'primary' },
};

// ── Props definition ──────────────────────────────────────────────────────────

const AVATAR_PROPS: PropDef[] = [
    { name: 'src',       type: 'string',    required: true,       description: 'Avatar image URL or data URI. Empty string shows the placeholder.',          control: 'select', options: ['ada', 'bob', 'carol', 'diana', 'evan', 'photo', 'empty'] },
    { name: 'title',     type: 'string',       description: 'Tooltip and accessible name fallback when alt is not set.',                   control: 'text' },
    { name: 'alt',       type: 'string',       description: 'Alt text for screen readers — defaults to title or filename.',                control: 'text' },
    { name: 'width',     type: 'number', description: 'Avatar width in pixels. When only width is set, height equals width.',       control: 'number', min: 24, max: 160 },
    { name: 'height',    type: 'number', description: 'Avatar height in pixels — set only when the avatar is not square.',           control: 'number', min: 24, max: 160 },
    { name: 'fit',       type: '"cover" | "contain" | "fill" | "scale-down" | "none"', description: 'CSS object-fit. cover (default) crops to fill the box without distortion.', control: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'] },
    { name: 'badge',     type: 'BadgeDescriptor',      description: 'Badge overlay at the top-right of the avatar. Accepts a string, ReactNode, or { content, type } descriptor. Omit content for a status dot.', control: 'select', options: ['', 'online', 'away', 'offline', '5', 'new'] },
    { name: 'feedback',  type: 'ReactNode',      description: 'Content rendered below the avatar — useful for labels or captions.',         control: 'text' },
    { name: 'pre',       type: 'ReactNode',      description: 'Content rendered to the left of the avatar.',                                control: 'text' },
    { name: 'post',      type: 'ReactNode',      description: 'Content rendered to the right of the avatar — ideal for name and role.',    control: 'text' },
    { name: 'className', type: 'string',    description: 'CSS classes applied to the img element.',                                    control: 'text' },
    { name: 'wrapClass', type: 'string',    description: 'CSS classes applied to the outer wrapper.',                                  control: 'text' },
];

// ── Playground ────────────────────────────────────────────────────────────────

const PLAYGROUND: PlaygroundConfig = {
    props: AVATAR_PROPS,
    defaultProps: {
        src:       'ada',
        title:     'Ada Lovelace',
        alt:       'Ada Lovelace',
        width:     72,
        height:    72,
        fit:       'cover',
        badge:     'online',
        feedback:  '',
        pre:       '',
        post:      'Ada Lovelace',
        className: 'rounded-full border-2 border-primary',
        wrapClass: '',
    },
    render: (p) => (
        <ImageAvatar
            src={AVATARS[p.src as keyof typeof AVATARS] ?? p.src}
            title={p.title  || undefined}
            alt={p.alt      || undefined}
            width={Number(p.width)  || undefined}
            height={Number(p.height) || undefined}
            fit={p.fit      || undefined}
            badge={BADGE_PRESETS[p.badge] ?? undefined}
            feedback={p.feedback || undefined}
            pre={p.pre      || undefined}
            post={p.post ? <span className="font-medium text-sm">{p.post}</span> : undefined}
            className={p.className  || undefined}
            wrapClass={p.wrapClass  || undefined}
        />
    ),
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ImageAvatarPage() {
    usePlayground(PLAYGROUND, 'ImageAvatar');

    return (
        <PageLayout
            title="ImageAvatar"
            description="Avatar image with placeholder fallback and automatic localStorage caching — fetches remote URLs once, converts to base64, and serves instantly on every subsequent render."
        >
            {/* ── Sizes ── */}
            <Section
                title="Sizes"
                description="Pass width to set the avatar size — height defaults to the same value for a square. fit=cover crops to fill without distortion."
                preview={
                    <div className="flex flex-wrap items-end gap-6">
                        {([24, 32, 48, 64, 96, 128] as const).map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <ImageAvatar src={AVATARS.ada} title="Ada Lovelace" width={s} className="rounded-full border" />
                                <span className="text-xs text-muted-foreground font-mono">{s}px</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

<ImageAvatar src={url} title="Ada" width={32} className="rounded-full border" />
<ImageAvatar src={url} title="Ada" width={64} className="rounded-full border" />
<ImageAvatar src={url} title="Ada" width={96} className="rounded-full border" />`}
            />

            {/* ── Shapes ── */}
            <Section
                title="Shapes"
                description="className drives the shape. rounded-full for circles, rounded-xl for soft squares. Add border, ring or shadow for visual emphasis."
                preview={
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { avatar: AVATARS.ada,   label: 'Circle',        cls: 'rounded-full border-2 border-primary' },
                            { avatar: AVATARS.bob,   label: 'Rounded',       cls: 'rounded-xl border' },
                            { avatar: AVATARS.carol, label: 'Square',        cls: 'rounded border' },
                            { avatar: AVATARS.diana, label: 'Ring',          cls: 'rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background' },
                            { avatar: AVATARS.evan,  label: 'Shadow',        cls: 'rounded-full shadow-lg shadow-primary/30' },
                        ].map(({ avatar, label, cls }) => (
                            <div key={label} className="flex flex-col items-center gap-2">
                                <ImageAvatar src={avatar} title={label} width={72} className={cls} />
                                <span className="text-xs text-muted-foreground text-center">{label}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

// circle
<ImageAvatar src={url} title="Ada" width={72} className="rounded-full border-2 border-primary" />

// soft square
<ImageAvatar src={url} title="Bob" width={72} className="rounded-xl border" />

// ring highlight
<ImageAvatar src={url} title="Carol" width={72} className="rounded-full ring-2 ring-primary ring-offset-2" />

// shadow glow
<ImageAvatar src={url} title="Diana" width={72} className="rounded-full shadow-lg shadow-primary/30" />`}
            />

            {/* ── Badge overlay ── */}
            <Section
                title="Badge overlay"
                description="The badge prop renders a Badge component as an overlay anchored to the bottom-right corner. Pass { type } for a status dot, or { content, type } for a labelled badge. Accepts any BadgeProps value."
                preview={
                    <div className="flex flex-wrap items-end gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.ada}   title="Online"  width={64} className="rounded-full border" badge={{ content: undefined, type: 'success' }} />
                            <span className="text-xs text-muted-foreground">online dot</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.bob}   title="Away"    width={64} className="rounded-full border" badge={{ content: undefined, type: 'warning' }} />
                            <span className="text-xs text-muted-foreground">away dot</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.carol} title="Offline" width={64} className="rounded-full border" badge={{ content: undefined, type: 'secondary' }} />
                            <span className="text-xs text-muted-foreground">offline dot</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.diana} title="5 notifiche" width={64} className="rounded-full border" badge={{ content: '5', type: 'danger' }} />
                            <span className="text-xs text-muted-foreground">counter</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.evan}  title="New"     width={64} className="rounded-full border" badge={{ content: 'new', type: 'primary' }} />
                            <span className="text-xs text-muted-foreground">label</span>
                        </div>
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

// status dot — omit content, only type
<ImageAvatar src={url} title="Ada" width={64} className="rounded-full border"
    badge={{ content: undefined, type: 'success' }} />

// counter
<ImageAvatar src={url} title="Diana" width={64} className="rounded-full border"
    badge={{ content: '5', type: 'danger' }} />

// label
<ImageAvatar src={url} title="Evan" width={64} className="rounded-full border"
    badge={{ content: 'new', type: 'primary' }} />`}
            />

            {/* ── Post slot — user row ── */}
            <Section
                title="Post slot — user row"
                description="post renders to the right of the avatar, vertically centred. Use it for name, role, or any metadata. pre renders to the left."
                preview={
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        {[
                            { avatar: AVATARS.ada,   name: 'Ada Lovelace',   role: 'Engineer',        type: 'badge-primary',   badge: { type: 'success' } },
                            { avatar: AVATARS.bob,   name: 'Bob Chen',       role: 'Designer',        type: 'badge-success',   badge: { type: 'warning' } },
                            { avatar: AVATARS.carol, name: 'Carol Wu',       role: 'Product Manager', type: 'badge-warning',   badge: { type: 'secondary' } },
                        ].map(({ avatar, name, role, type, badge }) => (
                            <ImageAvatar
                                key={name}
                                src={avatar}
                                title={name}
                                width={44}
                                className="rounded-full border"
                                badge={badge}
                                post={
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="font-medium text-sm truncate">{name}</span>
                                        <span className={`badge ${type} text-xs self-start`}>{role}</span>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

<ImageAvatar
    src={url}
    title="Ada Lovelace"
    width={44}
    className="rounded-full border"
    badge={{ content: undefined, type: 'success' }}
    post={
        <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">Ada Lovelace</span>
            <span className="badge badge-primary text-xs">Engineer</span>
        </div>
    }
/>`}
            />

            {/* ── Placeholder fallback ── */}
            <Section
                title="Placeholder fallback"
                description="When src is empty, unreachable, or fails to load, ImageAvatar renders the theme's user placeholder automatically — no broken-image icon is ever shown."
                preview={
                    <div className="flex flex-wrap gap-8">
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

// empty src → theme placeholder
<ImageAvatar src="" title="No image" width={64} className="rounded-full border" />

// broken URL → onError → theme placeholder
<ImageAvatar src="https://broken.invalid/avatar.jpg" title="User" width={64} className="rounded-full border" />`}
            />

            {/* ── Caching ── */}
            <Section
                title="Caching — localStorage"
                description="When src is a remote URL, ImageAvatar fetches it once, converts it to base64 and stores it in localStorage. All subsequent renders load instantly, including offline. The query string is stripped automatically from the cache key — so signed URLs (AWS S3, GCS) that rotate the signature on every request still hit the same cache entry."
                preview={
                    <div className="rounded-lg border bg-muted p-4 text-sm font-mono space-y-1 text-foreground">
                        <div><span className="text-muted-foreground select-none">// first render</span></div>
                        <div>fetch(<span className="text-primary">'https://cdn.example.com/avatars/42.jpg?sig=abc'</span>)</div>
                        <div>localStorage.setItem(<span className="text-primary">'avatar::https://cdn.example.com/avatars/42.jpg'</span>, base64)</div>
                        <div className="pt-2"><span className="text-muted-foreground select-none">// next render — different signature, same cache hit</span></div>
                        <div>fetch(<span className="text-primary">'https://cdn.example.com/avatars/42.jpg?sig=xyz'</span>)</div>
                        <div>localStorage.getItem(<span className="text-primary">'avatar::https://cdn.example.com/avatars/42.jpg'</span>) <span className="text-success">✓</span></div>
                    </div>
                }
                code={`import { ImageAvatar } from 'react-firestrap';

// Remote URL — fetched once, cached as base64, served instantly thereafter
<ImageAvatar src="https://cdn.example.com/avatars/42.jpg" title="Ada" width={48} className="rounded-full" />

// Signed URL — query string is stripped internally, cache key stays stable
<ImageAvatar src={signedUrl} title="Ada" width={48} className="rounded-full" />`}
            />

            <PropsTable props={AVATAR_PROPS} />
        </PageLayout>
    );
}
