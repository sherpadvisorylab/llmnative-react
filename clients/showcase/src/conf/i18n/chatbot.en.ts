import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        chatbot: {
            page: {
                title: 'Chatbot',
                description: 'The AI composer extracted from Prompt (CR-071): textarea, attachments, model picker, and an optional role/language/voice/style/temperature toolbar. Independent of Form — it only collects input and hands the resolved payload to onSubmit; deciding what happens next (a single completion, a multi-turn conversation with tools) is entirely up to the caller.',
            },
            sections: {
                basicComposer: {
                    title: 'Basic composer',
                    description: 'Fully controlled — value/onChange stay with the caller. onSubmit fires with the current text, an empty files array, and the selected model (empty string if no models prop is given).',
                },
                attachments: {
                    title: 'Attachments',
                    description: 'Enable the paperclip with attachments. Files are collected as raw File objects and forwarded untouched in onSubmit — Chatbot never reads or decodes their content itself.',
                },
                modelPicker: {
                    title: 'Model picker',
                    description: 'Pass models (a flat {label, value}[] list) plus selectedModel/onModelChange to let the user pick which model a turn should use — the same shape useAgent.modelsByProvider flattens to in the CMS consumer (Agentico).',
                },
                runningAndStop: {
                    title: 'Running / stop',
                    description: 'With running and no onStop, the button shows a disabled spinner (no abort capability). Pass onStop to let the user interrupt an in-flight turn immediately.',
                },
                disabledState: {
                    title: 'Disabled',
                    description: 'disabled is entirely the caller\'s call — Chatbot itself never disables Send just because the text is empty (a caller that runs a fixed template against variables, like Prompt, needs Send available even with an empty box).',
                },
            },
            labels: {
                placeholder: 'Ask something…',
                modelClaude: 'Claude Sonnet',
                modelGpt: 'GPT-4o',
                modelGemini: 'Gemini 2.5 Pro',
                stopHint: 'Click the button while running to interrupt.',
                disabledHint: 'Send stays disabled until the caller says otherwise.',
            },
            propsDocs: {
                title: 'Props',
                items: {
                    value: { description: 'Current composer text — controlled, Chatbot never owns it.' },
                    onChange: { description: 'Called with the new text on every keystroke.' },
                    onSubmit: { description: 'Called with { text, files, model, role?, voice?, style?, language?, temperature? } on Send/Enter.' },
                    placeholder: { description: 'Textarea placeholder.' },
                    running: { default: 'false', description: 'Shows the stop-styled button. Combine with onStop for real abort capability.' },
                    onStop: { description: 'Called when the user clicks the button while running. Without it, the button is a disabled spinner.' },
                    disabled: { default: 'false', description: 'Disables Send — the reason (unavailable provider, etc.) is always the caller\'s to decide and display.' },
                    attachments: { default: 'false', description: 'Enables the paperclip + file picker. Files are reported raw in onSubmit.' },
                    commands: { description: 'Slash-commands, same EditorCommand[] shape as Prompt (reuses ContextMenu as-is).' },
                    commandsTrigger: { default: '/', description: 'Trigger character for commands.' },
                    models: { description: 'Flat {label, value}[] list — omit to hide the model dropdown entirely.' },
                    selectedModel: { description: 'Currently selected model id — controlled.' },
                    onModelChange: { description: 'Called with the new model id when the user picks one.' },
                    showSettings: { default: 'false', description: 'Shows role/language/voice/style/temperature dropdowns (uncontrolled, reported via onSubmit).' },
                    minHeight: { default: '96', description: 'Textarea minimum height in pixels.' },
                    maxHeight: { default: '220', description: 'Textarea maximum height before internal scroll takes over.' },
                },
            },
        },
    },
});
