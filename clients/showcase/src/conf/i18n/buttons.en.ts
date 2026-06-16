import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        buttons: {
            page: { title: 'Buttons', description: 'Semantic button states plus focused components for immediate actions, async actions, navigation and external references.' },
            sections: {
                nativeStates: { title: 'Native state classes', description: 'Use framework-owned btn state classes for simple buttons and links.' },
                outlineLink: { title: 'Outline and link', description: 'Outline states use the same semantic names and tokens as solid buttons.' },
                components: { title: 'Button components', description: 'Use the focused pages for examples, props and playgrounds specific to each button component.' },
            },
            cards: {
                actionButton: 'Immediate actions with icons, badges, disabled state and press motion.',
                loadingButton: 'Async actions with loading state, progress text and automatic disable.',
                navigation: 'Back navigation and external reference helpers.',
            },
        },
    },
});
