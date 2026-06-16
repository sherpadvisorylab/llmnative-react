import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        alert: {
            page: { title: 'Alert', description: 'Contextual feedback messages for the user. Supports icons, auto-dismiss timeout and fixed positioning.' },
            sections: {
                variants: { description: 'Each type has preset colors and an icon.' },
                appearance: { title: 'Appearance', description: 'appearance="text" renders a compact inline indicator — no background, no border, width fits content. Ideal for status feedback next to buttons.' },
                withoutIcon: { title: 'Without icon' },
                autoDismiss: { title: 'Auto-dismiss', description: 'The alert closes automatically after the specified timeout (ms).' },
                placement: { title: 'Placement modes', description: 'placement controls where the alert renders: inline (default, in normal document flow) or fixed (viewport-pinned via portal above all content).' },
            },
        },
    },
});
