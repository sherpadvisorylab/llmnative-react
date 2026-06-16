import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        prompt: {
            page: {
                title: 'Prompt',
                description: 'Prompt-aware textarea field that can store literal text or an AI prompt configuration, and optionally execute it against the current form record.',
            },
            sections: {
                modes: {
                    description: 'The mode prop selects the surface. edit (default) is for authoring the prompt template. run shows execution controls, AI availability state, and writes the result back into the field.',
                },
            },
            variants: {
                editor: {
                    title: 'PromptEdit',
                    description: 'Author and maintain the stored prompt template with a dedicated edit surface.',
                },
                live: {
                    title: 'PromptRun',
                    description: 'Execute the stored prompt against the active form record and write the generated result back into the same field.',
                },
                plain: {
                    title: 'PromptPlain',
                    description: 'Plain fallback surface used when prompt mode is disabled and the field behaves like a normal textarea.',
                },
            },
        },
    },
});
