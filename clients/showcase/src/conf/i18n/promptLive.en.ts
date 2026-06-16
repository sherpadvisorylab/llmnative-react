import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        promptLive: {
            page: {
                title: 'PromptRun',
                description: 'Execute the stored prompt against the active form record and write the generated result back into the same field.',
            },
            sections: {
                aiUnavailableNotice: { title: 'AI unavailable notice', description: 'When no AI provider is configured the component shows an inline warning in the footer bar and disables the Run button. The edit gear is still accessible.' },
                runAgainstFormContext: { title: 'Run against form context', description: 'onRunPrompt wires a custom executor, here a local mock, so the full run flow is visible without a real AI key. The form record is passed as data and placeholders are resolved automatically.' },
                variablesResolvedPreview: { title: 'Variables - resolved preview', description: 'Pass variables to inject external values into the template. In edit mode, the eye icon in the footer bar reveals a read-only preview showing the fully resolved prompt.' },
                editModeSettingsToolbar: { title: 'Edit mode - settings toolbar', description: 'Click the gear icon to enter edit mode. The footer bar exposes model, role, language, voice, style and temperature controls, all stored in the form record under the prompt key.' },
                multiplePromptsInForm: { title: 'Multiple prompts in a form', description: 'Each Prompt field owns an independent template and AI settings, stored under its form key. Run each one separately and they never overwrite each other.' },
                customUnavailableNotice: { title: 'Custom unavailable notice', description: 'renderAIUnavailable replaces the default unavailable notice in the footer bar with your own UI, useful for links to settings or branded messages.' },
                slashCommands: { title: 'Slash commands', description: 'Pass commands to enable slash shortcuts in the result textarea. Selecting one calls its handler with the current field value.' },
                attachments: { title: 'Attachments', description: 'Set attachments to enable the paperclip button in the footer bar. Selected files appear above the result textarea and can be removed individually.' },
                multimodalInputs: { title: 'Multimodal inputs', description: 'When attachments is enabled and a compatible provider is selected, attached files are forwarded directly to the AI model alongside the prompt.' },
                statusItems: { title: 'Status items - token usage', description: 'statusItems adds a strip below the footer bar that populates after each run. Add a tokenUsage action for a detailed popup panel.' },
                promptUtils: { title: 'PromptUtils - client-side utilities', description: 'PromptUtils provides browser-safe helpers for token estimation, context window lookup, cost estimation and file-to-attachment conversion.' },
            },
            labels: {
                summary: 'Summary',
                tagline: 'Tagline',
                productDescription: 'Product description',
                meetingNotes: 'Meeting notes',
                marketingCopy: 'Marketing copy',
                documentSummary: 'Document summary',
                northwindRevamp: 'Northwind Revamp',
                atlasConsole: 'Atlas Console',
                conciseLaunchSummary: 'Write a concise launch summary for {projectName}.',
                conciseProjectSummary: 'Write a concise summary for {projectName}.',
                punchyTagline: 'Write a punchy one-line tagline for {projectName}.',
                shortProductDescription: 'Write a short product description for {projectName}. Highlight the key differentiators.',
                meetingSummary: 'Summarise the key points from this meeting.',
                devopsPlatformDescription: 'Describe our DevOps platform in 2 sentences. Focus on speed and reliability.',
                attachedDocumentSummary: 'Summarise the attached document.',
                customUnavailableFallback: 'Connect an AI provider to enable one-click summarisation.',
                tokenCountComment: '// token count (heuristic: chars / 4)',
                contextWindowComment: '// context window lookup',
                contextUsageComment: '// context usage %',
                costEstimateComment: '// cost estimate in USD',
            },
            propsDocs: {
                title: 'PromptRun props',
            },
            playground: {
                title: 'PromptRun playground',
            },
        },
    },
});
