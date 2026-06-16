import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        imageAvatar: {
            page: {
                title: 'ImageAvatar',
                description: 'Avatar image with placeholder fallback and automatic localStorage caching. Remote URLs are fetched once, converted to base64 and then served instantly on subsequent renders.',
            },
            sections: {
                sizes: {
                    title: 'Sizes',
                    description: 'Pass width to set the avatar size. Height defaults to the same value for a square avatar, while fit=cover crops to fill without distortion.',
                },
                shapes: {
                    title: 'Shapes',
                    description: 'className drives the shape. Use rounded-full for circles, rounded-xl for soft squares, and add border, ring or shadow for emphasis.',
                },
                badgeOverlay: {
                    title: 'Badge overlay',
                    description: 'The badge prop renders a Badge overlay anchored to the bottom-right corner. Pass { type } for a status dot or { content, type } for a labelled badge.',
                },
                userRow: {
                    title: 'Post slot - user row',
                    description: 'after renders to the right of the avatar and is ideal for name, role or metadata. before renders to the left.',
                },
                placeholderFallback: {
                    title: 'Placeholder fallback',
                    description: 'When src is empty, unreachable or fails to load, ImageAvatar renders the theme placeholder automatically so the UI never shows a broken-image icon.',
                },
                caching: {
                    title: 'Caching - localStorage',
                    description: 'Remote URLs are fetched once, converted to base64 and stored in localStorage. Query strings are stripped from the cache key, so rotating signed URLs still reuse the same cached avatar.',
                },
            },
            labels: {
                adaLovelace: 'Ada Lovelace',
                bobChen: 'Bob Chen',
                carolWu: 'Carol Wu',
                circle: 'Circle',
                rounded: 'Rounded',
                square: 'Square',
                ring: 'Ring',
                shadow: 'Shadow',
                online: 'Online',
                away: 'Away',
                offline: 'Offline',
                onlineDot: 'online dot',
                awayDot: 'away dot',
                offlineDot: 'offline dot',
                counter: 'counter',
                label: 'label',
                notificationsCountTitle: '5 notifications',
                newBadge: 'New',
                engineer: 'Engineer',
                designer: 'Designer',
                productManager: 'Product Manager',
                noSrc: 'No src',
                brokenUrl: 'Broken URL',
                noImage: 'No image',
                user: 'User',
                srcEmpty: 'src=""',
                brokenUrlShort: 'broken URL',
                firstRender: 'first render',
                nextRender: 'next render - different signature, same cache hit',
                cacheHit: 'cache hit',
            },
            propsDocs: {
                items: {
                    src: { description: 'Avatar image URL or data URI. Empty string shows the placeholder.' },
                    title: { description: 'Tooltip and accessible name fallback when alt is not set.' },
                    alt: { description: 'Alt text for screen readers. Defaults to title or filename.' },
                    width: { description: 'Avatar width in pixels. When only width is set, height equals width.' },
                    height: { description: 'Avatar height in pixels. Set it only when the avatar is not square.' },
                    fit: { description: 'CSS object-fit. cover crops to fill the box without distortion.' },
                    badge: {
                        description: 'Badge overlay at the top-right. Pass { content, type } and omit content for a status dot.',
                        shortcuts: {
                            none: { label: 'none', help: 'Hide the badge.' },
                            count: { label: 'count', help: 'Unread count badge.' },
                            status: { label: 'status', help: 'Status dot without text.' },
                        },
                    },
                    feedback: { description: 'Content rendered below the avatar. Useful for labels or captions.' },
                    before: { description: 'Content rendered to the left of the avatar.' },
                    after: { description: 'Content rendered to the right of the avatar. Ideal for name and role.' },
                    className: { description: 'CSS classes applied to the img element.' },
                    wrapperClassName: { description: 'CSS classes applied to the outer wrapper.' },
                },
            },
            playground: {
                title: 'ImageAvatar',
            },
        },
    },
});
