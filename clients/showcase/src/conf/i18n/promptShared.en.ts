import { defineLocaleMessages } from '@llmnative/react';

export default defineLocaleMessages({
    showcase: {
        promptShared: {
            propsDocs: {
                groups: {
                    shared: 'Shared',
                    specific: 'Specific',
                },
                items: {
                    name: { description: 'Field name used as form key' },
                    label: { description: 'Field label shown above the component' },
                    required: { description: 'Marks the active textarea as required', default: 'false' },
                    defaultValue: {
                        description: 'Initial prompt metadata: template text, enabled flag and AI settings (model, role, language, voice, style, temperature).',
                        typeDetails: `{
  value?: string;
  enabled?: boolean;
  role?: string;
  language?: string;
  voice?: string;
  style?: string;
  model?: string;
  temperature?: number;
}`,
                    },
                    rows: { description: 'Textarea max rows before scrolling' },
                    before: { description: 'Content rendered before the prompt block' },
                    after: { description: 'Content rendered after the prompt block' },
                    onChange: { description: 'Custom change handler called by Form context' },
                    className: { description: 'CSS classes passed to the active textarea' },
                    wrapperClassName: { description: 'CSS classes passed to the outer wrapper' },
                    inheritWrapperClassName: { description: 'When true the field inherits wrapperClassName from the parent Form context', default: 'true' },
                    editorMode: { description: 'Authors and stores the prompt template. Exposes an enabled Switch to toggle prompt metadata on or off.', default: '"edit"' },
                    runMode: { description: 'Executes the stored template against the active form record and writes the result back to the same field.', default: '"run"' },
                    plainMode: { description: 'Plain fallback still uses run mode but with defaultValue.enabled = false.', default: '"run"' },
                    renderAIUnavailableEdit: { description: 'Custom inline renderer shown when no AI provider is configured.' },
                    renderAIUnavailableRun: { description: 'Custom renderer for the unavailable notice shown when no AI provider is configured.' },
                    onRunPrompt: { description: 'Optional custom executor. When provided it runs before the default AI provider. Useful for testing, mocking or custom AI wiring.' },
                    variables: {
                        description: 'External key to value pairs injected into the template at preview and run time. Keys match {placeholder} tokens. Merged with form record values, and variables win on collisions.',
                        typeDetails: 'Record<string, unknown>',
                    },
                    commands: {
                        description: 'Commands rendered through the built-in ContextMenu inside the run-mode textarea. Selecting one calls its handler with the current field value and replaces it with the returned string.',
                        typeDetails: `{
  name: string;
  description?: string;
  icon?: string;
  handler?: (currentValue: string) => string | Promise<string>;
}[]`,
                    },
                    commandsTrigger: { description: 'Trigger character used by the internal ContextMenu for commands. Defaults to "/" when commands is present.' },
                    attachments: { description: 'Enables the paperclip button in the footer bar. Attached files appear as previews above the result textarea and are forwarded as multimodal inputs to compatible AI providers.', default: 'false' },
                    actions: {
                        description: 'Custom icon buttons in the run-mode footer bar. A tokenUsage key activates the built-in token usage popup after each run.',
                        typeDetails: `{
  key: string;
  icon: string;
  label?: string;
  content?: ReactNode;
}[]`,
                    },
                    statusItems: {
                        description: "Named items shown in the status strip below the footer after each run. Built-in keys: 'tokensIn', 'tokensOut', 'contextPercent', 'model', 'duration'.",
                        typeDetails: `('tokensIn' | 'tokensOut' | 'contextPercent' | 'model' | 'duration' | { key: string; render: (stats: PromptRunStats) => ReactNode })[]`,
                    },
                    renderFallbackRun: { description: 'Custom renderer shown when prompt mode is disabled (enabled=false), replacing the default plain textarea.' },
                    renderFallbackPlain: { description: 'Custom renderer shown when prompt mode is disabled.' },
                },
            },
            playground: {
                inspector: {
                    providerLabel: 'AI provider',
                    providerDescription: 'Pick a provider and paste an API key to wire the playground directly into the built-in AI registry. Leave the key empty to see the unavailable state.',
                    apiKeyPlaceholder: 'Paste API key for the selected provider',
                    compatibleBaseUrlPlaceholder: 'Base URL for the OpenAI-compatible endpoint',
                },
                defaults: {
                    projectName: 'projectName',
                    customerName: 'customerName',
                    company: 'company',
                    summaryLabel: 'Summary',
                    summaryPromptLabel: 'Summary prompt',
                    aiSummaryLabel: 'AI summary',
                    atlasConsole: 'Atlas Console',
                    northwindRevamp: 'Northwind Revamp',
                    shortHumanSummary: 'A short human-written summary.',
                    conciseProjectSummary: 'Write a concise project summary for {projectName}.',
                    followUpEmail: 'Draft a short follow-up email for {customerName} from {company}.',
                    english: 'English',
                    friendly: 'friendly',
                    concise: 'concise',
                },
                shortcuts: {
                    summary: { label: 'summary', help: 'Summary prompt with live execution enabled.' },
                    email: { label: 'email', help: 'Customer follow-up prompt.' },
                    plain: { label: 'plain', help: 'Stored text without prompt mode.' },
                    none: { label: 'none', help: 'No external variables, only the form record is used.' },
                    product: { label: 'product', help: 'Product-context variables.' },
                    customer: { label: 'customer', help: 'Customer-context variables.' },
                },
                mockAi: {
                    header: '[Mock AI - language: {language} · style: {style} · temp: {temperature}]',
                    defaultValue: 'default',
                },
            },
        },
    },
});
