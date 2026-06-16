import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        badge: {
            page: { title: 'Badge', description: 'Inline labels for status, counters and categories. When children is a React element, Badge enters overlay mode and positions indicators on that element.' },
            sections: {
                colorVariants: { title: 'Color variants', description: 'Inline badges use text or inline React content as children.' },
                overlayAfter: { title: 'Overlay: after top-right', description: 'Pass a React element as children with after to show a badge top-right.' },
                overlayBefore: { title: 'Overlay: before top-left', description: 'Use before instead to place the badge top-left.' },
                overlayBoth: { title: 'Overlay: both corners', description: 'Both before and after coexist: top-left and top-right simultaneously.' },
                overlayDot: { title: 'Overlay: dot', description: 'No before or after renders a small dot indicator top-right.' },
                inlineMode: { title: 'Inline with before/after', description: 'In inline mode, before and after render outside the badge span.' },
            },
        },
    },
});
