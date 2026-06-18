import React from 'react';
import { ImageAvatar } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseCommonI18n, useShowcaseImageAvatarI18n } from '../../showcase/i18n';

function makeAvatar(initials: string, bg: string, fg = 'white') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="${bg}"/><text x="80" y="80" font-family="Arial" font-size="56" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makePhotoAvatar(bg: string, skin: string, hair: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="${bg}"/><circle cx="80" cy="58" r="32" fill="${skin}"/><ellipse cx="80" cy="58" rx="20" ry="16" fill="${hair}"/><ellipse cx="80" cy="42" rx="32" ry="22" fill="${hair}"/><path d="M28 160 C28 108 132 108 132 160Z" fill="${skin}"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const AVATARS = {
    ada: makeAvatar('AL', '#2563eb'),
    bob: makeAvatar('BC', '#059669'),
    carol: makeAvatar('CW', '#7c3aed'),
    diana: makeAvatar('DK', '#dc2626'),
    evan: makeAvatar('EF', '#d97706'),
    photo: makePhotoAvatar('#dbeafe', '#fcd5b0', '#92400e'),
    empty: '',
};

export default function ImageAvatarPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseImageAvatarI18n();

    const avatarProps = React.useMemo<PropDef[]>(() => [
        { name: 'src', type: 'string', required: true, description: t.propsDocs.items.src.description, control: 'select', options: ['ada', 'bob', 'carol', 'diana', 'evan', 'photo', 'empty'] },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'alt', type: 'string', description: t.propsDocs.items.alt.description, control: 'text' },
        { name: 'width', type: 'number', description: t.propsDocs.items.width.description, control: 'number', min: 24, max: 160 },
        { name: 'height', type: 'number', description: t.propsDocs.items.height.description, control: 'number', min: 24, max: 160 },
        { name: 'fit', type: '"cover" | "contain" | "fill" | "scale-down" | "none"', description: t.propsDocs.items.fit.description, control: 'select', options: ['cover', 'contain', 'fill', 'scale-down', 'none'] },
        {
            name: 'badge',
            type: 'BadgeDescriptor',
            description: t.propsDocs.items.badge.description,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.propsDocs.items.badge.shortcuts?.none.label || 'none', value: null, help: t.propsDocs.items.badge.shortcuts?.none.help },
                { label: t.propsDocs.items.badge.shortcuts?.count.label || 'count', value: { content: '3', type: 'danger' }, help: t.propsDocs.items.badge.shortcuts?.count.help },
                { label: t.propsDocs.items.badge.shortcuts?.status.label || 'status', value: { type: 'success' }, help: t.propsDocs.items.badge.shortcuts?.status.help },
            ],
        },
        { name: 'feedback', type: 'ReactNode', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text' },
        { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: avatarProps,
        defaultProps: {
            src: 'ada',
            title: t.labels.adaLovelace,
            alt: t.labels.adaLovelace,
            width: 72,
            height: 72,
            fit: 'cover',
            badge: { content: '3', type: 'danger' },
            feedback: '',
            before: '',
            after: t.labels.adaLovelace,
            className: 'rounded-full border-2 border-primary',
            wrapperClassName: '',
        },
        render: (p) => (
            <ImageAvatar
                src={AVATARS[p.src as keyof typeof AVATARS] ?? p.src}
                title={p.title || undefined}
                alt={p.alt || undefined}
                width={Number(p.width) || undefined}
                height={Number(p.height) || undefined}
                fit={p.fit || undefined}
                badge={p.badge || undefined}
                feedback={p.feedback || undefined}
                before={p.before || undefined}
                after={p.after ? <span className="font-medium text-sm">{p.after}</span> : undefined}
                className={p.className || undefined}
                wrapperClassName={p.wrapperClassName || undefined}
            />
        ),
    }), [avatarProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout
            title={t.page.title}
            description={t.page.description}
        >
            <Section
                title={t.sections.sizes.title}
                description={t.sections.sizes.description}
                preview={
                    <div className="flex flex-wrap items-end gap-6">
                        {([24, 32, 48, 64, 96, 128] as const).map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <ImageAvatar src={AVATARS.ada} title={t.labels.adaLovelace} width={s} className="rounded-full border" />
                                <span className="text-xs text-muted-foreground font-mono">{s}px</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from '@llmnative/react';

<ImageAvatar src={url} title="Ada" width={32} className="rounded-full border" />
<ImageAvatar src={url} title="Ada" width={64} className="rounded-full border" />
<ImageAvatar src={url} title="Ada" width={96} className="rounded-full border" />`}
            />

            <Section
                title={t.sections.shapes.title}
                description={t.sections.shapes.description}
                preview={
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                        {[
                            { avatar: AVATARS.ada, label: t.labels.circle, cls: 'rounded-full border-2 border-primary' },
                            { avatar: AVATARS.bob, label: t.labels.rounded, cls: 'rounded-xl border' },
                            { avatar: AVATARS.carol, label: t.labels.square, cls: 'rounded border' },
                            { avatar: AVATARS.diana, label: t.labels.ring, cls: 'rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background' },
                            { avatar: AVATARS.evan, label: t.labels.shadow, cls: 'rounded-full shadow-lg shadow-primary/30' },
                        ].map(({ avatar, label, cls }) => (
                            <div key={label} className="flex flex-col items-center gap-2">
                                <ImageAvatar src={avatar} title={label} width={72} className={cls} />
                                <span className="text-center text-xs text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from '@llmnative/react';

// circle
<ImageAvatar src={url} title="Ada" width={72} className="rounded-full border-2 border-primary" />

// soft square
<ImageAvatar src={url} title="Bob" width={72} className="rounded-xl border" />

// ring highlight
<ImageAvatar src={url} title="Carol" width={72} className="rounded-full ring-2 ring-primary ring-offset-2" />

// shadow glow
<ImageAvatar src={url} title="Diana" width={72} className="rounded-full shadow-lg shadow-primary/30" />`}
            />

            <Section
                title={t.sections.badgeOverlay.title}
                description={t.sections.badgeOverlay.description}
                preview={
                    <div className="flex flex-wrap items-end gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.ada} title={t.labels.online} width={64} className="rounded-full border" badge={{ content: undefined, type: 'success' }} />
                            <span className="text-xs text-muted-foreground">{t.labels.onlineDot}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.bob} title={t.labels.away} width={64} className="rounded-full border" badge={{ content: undefined, type: 'warning' }} />
                            <span className="text-xs text-muted-foreground">{t.labels.awayDot}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.carol} title={t.labels.offline} width={64} className="rounded-full border" badge={{ content: undefined, type: 'secondary' }} />
                            <span className="text-xs text-muted-foreground">{t.labels.offlineDot}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.diana} title={t.labels.notificationsCountTitle} width={64} className="rounded-full border" badge={{ content: '5', type: 'danger' }} />
                            <span className="text-xs text-muted-foreground">{t.labels.counter}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src={AVATARS.evan} title={t.labels.newBadge} width={64} className="rounded-full border" badge={{ content: 'new', type: 'primary' }} />
                            <span className="text-xs text-muted-foreground">{t.labels.label}</span>
                        </div>
                    </div>
                }
                code={`import { ImageAvatar } from '@llmnative/react';

// status dot - omit content, only type
<ImageAvatar src={url} title="Ada" width={64} className="rounded-full border"
    badge={{ content: undefined, type: 'success' }} />

// counter
<ImageAvatar src={url} title="Diana" width={64} className="rounded-full border"
    badge={{ content: '5', type: 'danger' }} />

// label
<ImageAvatar src={url} title="Evan" width={64} className="rounded-full border"
    badge={{ content: 'new', type: 'primary' }} />`}
            />

            <Section
                title={t.sections.userRow.title}
                description={t.sections.userRow.description}
                preview={
                    <div className="flex w-full max-w-xs flex-col gap-3">
                        {[
                            { avatar: AVATARS.ada, name: t.labels.adaLovelace, role: t.labels.engineer, type: 'badge-primary', badge: { content: '' as const, type: 'success' as const } },
                            { avatar: AVATARS.bob, name: t.labels.bobChen, role: t.labels.designer, type: 'badge-success', badge: { content: '' as const, type: 'warning' as const } },
                            { avatar: AVATARS.carol, name: t.labels.carolWu, role: t.labels.productManager, type: 'badge-warning', badge: { content: '' as const, type: 'secondary' as const } },
                        ].map(({ avatar, name, role, type, badge }) => (
                            <ImageAvatar
                                key={name}
                                src={avatar}
                                title={name}
                                width={44}
                                className="rounded-full border"
                                badge={badge}
                                after={
                                    <div className="flex min-w-0 flex-col gap-0.5">
                                        <span className="truncate text-sm font-medium">{name}</span>
                                        <span className={`badge ${type} self-start text-xs`}>{role}</span>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                }
                code={`import { ImageAvatar } from '@llmnative/react';

<ImageAvatar
    src={url}
    title="Ada Lovelace"
    width={44}
    className="rounded-full border"
    badge={{ content: undefined, type: 'success' }}
    after={
        <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">Ada Lovelace</span>
            <span className="badge badge-primary text-xs">Engineer</span>
        </div>
    }
/>`}
            />

            <Section
                title={t.sections.placeholderFallback.title}
                description={t.sections.placeholderFallback.description}
                preview={
                    <div className="flex flex-wrap gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <ImageAvatar src="" title={t.labels.noSrc} width={64} className="rounded-full border" />
                            <span className="text-xs text-muted-foreground">{t.labels.srcEmpty}</span>
                        </div>
                    </div>
                }
                code={`import { ImageAvatar } from '@llmnative/react';

// empty src -> theme placeholder
<ImageAvatar src="" title="No image" width={64} className="rounded-full border" />`}
            />

            <Section
                title={t.sections.caching.title}
                description={t.sections.caching.description}
                preview={
                    <div className="space-y-1 rounded-lg border bg-muted p-4 font-mono text-sm text-foreground">
                        <div><span className="select-none text-muted-foreground">// {t.labels.firstRender}</span></div>
                        <div>fetch(<span className="text-primary">'https://cdn.example.com/avatars/42.jpg?sig=abc'</span>)</div>
                        <div>localStorage.setItem(<span className="text-primary">'avatar::https://cdn.example.com/avatars/42.jpg'</span>, base64)</div>
                        <div className="pt-2"><span className="select-none text-muted-foreground">// {t.labels.nextRender}</span></div>
                        <div>fetch(<span className="text-primary">'https://cdn.example.com/avatars/42.jpg?sig=xyz'</span>)</div>
                        <div>localStorage.getItem(<span className="text-primary">'avatar::https://cdn.example.com/avatars/42.jpg'</span>) <span className="text-success">{t.labels.cacheHit}</span></div>
                    </div>
                }
                code={`import { ImageAvatar } from '@llmnative/react';

// Remote URL - fetched once, cached as base64, served instantly thereafter
<ImageAvatar src="https://cdn.example.com/avatars/42.jpg" title="Ada" width={48} className="rounded-full" />

// Signed URL - query string is stripped internally, cache key stays stable
<ImageAvatar src={signedUrl} title="Ada" width={48} className="rounded-full" />`}
            />

            <PropDocsTable props={avatarProps} title={common.sections.props} />
        </PageLayout>
    );
}
