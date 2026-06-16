import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        loader: {
            page: { title: 'Loader', description: 'Overlay spinner that wraps any content. When show=true, a blurred backdrop with a themed spinner is rendered on top of children — the content remains in the DOM and is revealed instantly when the loader is dismissed.' },
            sections: {
                showHide: { title: 'Show / hide', description: 'Toggle show to overlay or reveal the wrapped content. The content is always mounted — no layout shift when the loader disappears.' },
                custom: { title: 'Custom icon and message', description: 'Override the theme defaults per-instance with icon, title, and description. The icon value is a class name — any icon supported by the configured icon provider works.' },
                card: { title: 'Card integration', description: 'Card exposes a showLoader prop as a convenience shorthand — it wraps the card body in a Loader automatically.' },
                other: { title: 'Other loading indicators in the framework', description: '@llmnative/react ships additional loading patterns for different contexts.' },
            },
        },
    },
});
