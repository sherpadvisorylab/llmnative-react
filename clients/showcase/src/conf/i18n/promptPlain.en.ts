import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        promptPlain: {
            page: {
                title: 'PromptPlain',
                description: 'Plain fallback surface used when prompt mode is disabled. The component degrades to a standard textarea without any AI execution controls.',
            },
            sections: {
                fallbackToPlainTextarea: {
                    title: 'Fallback to plain textarea',
                    description: 'When enabled is false (or missing) in run mode, the component renders a plain textarea. No gear, no footer bar, no run button, just a clean field for manually written content.',
                },
                customRenderFallback: {
                    title: 'Custom renderFallback',
                    description: 'renderFallback replaces the default plain textarea entirely. Receive the same field props and render whatever you need, from a rich editor to a read-only display.',
                },
            },
            labels: {
                summary: 'Summary',
                notes: 'Notes',
                shortHumanSummary: 'A short human-written summary.',
                followUpTwoWeeks: 'Agreed to follow up in two weeks.',
                customFallbackForField: 'Custom fallback for field',
                customFallbackSuffix: 'render a rich editor, read-only card, or anything here.',
            },
            propsDocs: {
                title: 'PromptPlain props',
            },
            playground: {
                title: 'PromptPlain playground',
            },
        },
    },
});
