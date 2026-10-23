import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        identicon: {
            page: {
                title: 'Identicon',
                description: "An icon drawn from a value, as GitHub draws one for an account without a picture: a symmetric 5×5 grid, cells and hue from a hash. The same value always gives the same icon; nothing is fetched or stored.",
            },
            sections: {
                values: {
                    title: "Values",
                    description: "Each value gets its own icon: use it for repositories, tenants or users without a picture.",
                },
                sizes: {
                    title: "Sizes",
                    description: "size sets width and height in pixels; the drawing scales without blur.",
                },
                inRow: {
                    title: "In a row",
                    description: "before and after place content beside the icon; className changes its shape.",
                },
            },
            labels: {
                repository: "Repository",
            },
            propsDocs: {
                title: "Identicon props",
                items: {
                    value: { description: "What the icon stands for: the same value always draws the same icon." },
                    size: { description: "Width and height in pixels (default 40)." },
                    title: { description: "Accessible name: with it the icon is role=\"img\"; without it, decorative (aria-hidden)." },
                    before: { description: "Content rendered before the icon." },
                    after: { description: "Content rendered after the icon." },
                    className: { description: "Classes of the SVG; by default rounded-md bg-muted (theme Identicon.className)." },
                    wrapperClassName: { description: "Classes of the wrapper, present only with before or after." },
                },
            },
            playground: {
                title: 'Identicon',
            },
        },
    },
});
