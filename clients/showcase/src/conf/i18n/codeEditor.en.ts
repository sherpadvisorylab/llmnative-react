import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        codeEditor: {
            page: {
                title: 'CodeEditor',
                description: 'Code editor with syntax highlighting powered by CodeMirror 6. Lazy-loaded only when mounted. Supports HTML, JSON, JavaScript, TypeScript, CSS and Liquid syntax. Theme-aware via CSS variables and per-component theme overrides.',
            },
            sections: {
                basicUsage: {
                    title: 'Basic usage',
                    description: 'Drop CodeEditor inside a Form like any other field. The value syncs with the form record on every edit.',
                },
                languageModes: {
                    title: 'Language modes',
                    description: 'Pass language="json", "js", "ts", "css" or "liquid" to switch the syntax highlighter.',
                },
                disabledState: {
                    title: 'Disabled',
                    description: 'The disabled prop makes the editor read-only.',
                },
                commandMenu: {
                    title: 'Slash commands',
                    description: 'Pass commands to open the shared ContextMenu directly inside CodeEditor. The trigger defaults to "/" and can be customized with commandsTrigger.',
                },
            },
            labels: {
                templateBody: 'Template body',
                jsonConfig: 'JSON config',
                script: 'Script',
                stylesheet: 'Stylesheet',
                liquidTemplate: 'Liquid template',
                codeTemplateWithCommands: 'Template with commands',
                startCoding: 'Start coding…',
            },
            propsDocs: {
                title: 'CodeEditor props',
                items: {
                    name: { description: 'Field name used as form key and dot-notation path.' },
                    label: { description: 'Label rendered above the editor.' },
                    required: { description: 'Marks the field as required.' },
                    language: { description: 'Syntax language. One of: "html", "json", "js", "ts", "css", "liquid". Default: "html".' },
                    placeholder: { description: 'Placeholder text shown inside the editor when empty.' },
                    disabled: { description: 'Makes the editor read-only.' },
                    minHeight: { description: 'Minimum editor height in pixels. Default: 200.' },
                    maxHeight: { description: 'Maximum editor height in pixels before scrolling. Default: 600.' },
                    feedback: { description: 'Helper text rendered below the editor.' },
                    commands: { description: 'Slash commands shown by the shared ContextMenu. Pass an array of { name, description?, icon?, handler? }. The trigger defaults to "/" when commands is present.' },
                    commandsTrigger: { description: 'Trigger string used to open the internal ContextMenu. Defaults to "/" when commands is present.' },
                    defaultValue: { description: 'Initial value when used outside a Form context.' },
                    value: { description: 'Controlled value synced from outside the form.' },
                    labelClassName: { description: 'CSS classes applied to the label element.' },
                    className: { description: 'CSS classes applied to the editor container.' },
                    wrapperClassName: { description: 'CSS classes applied to the outer wrapper.' },
                    before: { description: 'Content rendered before the editor wrapper.' },
                    after: { description: 'Content rendered after the editor wrapper.' },
                    onChange: { description: 'Custom change handler called by Form context on every editor update.' },
                },
            },
            playground: {
                title: 'CodeEditor',
            },
        },
    },
});
