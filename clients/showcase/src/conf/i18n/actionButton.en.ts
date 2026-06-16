import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        actionButton: {
            page: { title: 'ActionButton', description: 'Immediate synchronous action button with icon, badge, press motion, and variant system. Use LoadingButton for async operations.' },
            sections: {
                variants: { description: 'Use the variant prop to apply semantic colors without writing CSS class names.' },
                iconLabel: { title: 'Icon + label combinations', description: 'icon renders an icon from the active provider. Omit label for an icon-only button — pair with title for accessibility.' },
                onClick: { title: 'onClick handler', description: 'onClick stops propagation automatically. The button does not manage loading state — use LoadingButton for async work.' },
                disabled: { title: 'Disabled state', description: 'disabled prevents click and shows a not-allowed cursor on the wrapper. The button retains its visual shape.' },
                badge: { title: 'Badge notification', description: 'badge renders a count or text indicator top-right. Useful for pending items.' },
            },
        },
    },
});
