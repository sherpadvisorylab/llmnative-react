import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        promptEditor: {
            page: {
                title: 'PromptEdit',
                description: 'Author and store the prompt template. The enabled Switch toggles between prompt mode (AI execution) and plain text mode.',
            },
            sections: {
                authorPromptText: {
                    title: 'Author prompt text',
                    description: 'In edit mode the textarea stores the raw template. The enabled Switch toggles prompt metadata on or off. When enabled, the field name is prefixed with "Prompt:" and the availability notice appears if no AI is configured.',
                },
                disabledPlainTextarea: {
                    title: 'Disabled - plain textarea',
                    description: "When enabled is false the prompt engine is off. The field stores plain text and the AI toggle and availability notice are hidden. Use this when some records need AI and others don't.",
                },
                aiUnavailableNotice: {
                    title: 'AI unavailable notice',
                    description: 'When the component is enabled but no AI provider is configured, a warning appears below the textarea. Use renderAIUnavailable to replace it with custom UI.',
                },
            },
            labels: {
                summary: 'Summary',
                descriptionField: 'Description',
                customNoticePrefix: 'Custom notice -',
                aiProviderNotConfigured: 'AI provider not configured',
                humanWrittenDescription: 'A short human-written description without AI assistance.',
                conciseProjectSummary: 'Write a concise project summary for {projectName}.',
                shortProjectSummary: 'Write a summary for {projectName}.',
            },
            propsDocs: {
                title: 'PromptEdit props',
            },
            playground: {
                title: 'PromptEdit playground',
            },
        },
    },
});
