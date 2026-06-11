import type { PlaygroundConfig, PropDef } from '../../../docs-kit/playground';

export const PROMPT_SHARED_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text', group: 'Shared' },
    { name: 'label', type: 'string', description: 'Field label shown above the component', control: 'text', group: 'Shared' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks the active textarea as required', control: 'boolean', group: 'Shared' },
    {
        name: 'defaultValue',
        type: 'PromptDefaultValue',
        description: 'Initial prompt metadata: template text, enabled flag and AI settings (model, role, language, voice, style, temperature).',
        control: 'json',
        rows: 10,
        group: 'Shared',
        shortcuts: [
            { label: 'summary', value: { value: 'Write a concise project summary for {projectName}.', enabled: true, role: '', language: 'English', voice: '', style: 'concise', model: '', temperature: 0.7 }, help: 'Summary prompt with live execution enabled.' },
            { label: 'email', value: { value: 'Draft a short follow-up email for {customerName} from {company}.', enabled: true, role: '', language: 'English', voice: 'friendly', style: 'concise', model: '', temperature: 0.5 }, help: 'Customer follow-up prompt.' },
            { label: 'plain', value: { value: 'A short human-written summary.', enabled: false, role: '', language: 'English', voice: '', style: '', model: '', temperature: 0.7 }, help: 'Stored text without prompt mode.' },
        ],
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
    { name: 'rows', type: 'number', description: 'Textarea max rows before scrolling', control: 'number', min: 2, max: 14, group: 'Shared' },
    { name: 'before', type: 'ReactNode', description: 'Content rendered before the prompt block', control: 'text', group: 'Shared' },
    { name: 'after', type: 'ReactNode', description: 'Content rendered after the prompt block', control: 'text', group: 'Shared' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context', group: 'Shared' },
    { name: 'className', type: 'string', description: 'CSS classes passed to the active textarea', control: 'text', group: 'Shared' },
    { name: 'wrapperClassName', type: 'string', description: 'CSS classes passed to the outer wrapper', control: 'text', group: 'Shared' },
    { name: 'inheritWrapperClassName', type: 'boolean', default: 'true', description: 'When true the field inherits the wrapperClassName from the parent Form context', control: 'boolean', group: 'Shared' },
];

export const PROMPT_EDITOR_PROPS: PropDef[] = [
    { name: 'mode', type: '"edit"', default: '"edit"', description: 'Authors and stores the prompt template. Exposes an enabled Switch to toggle prompt metadata on/off.', group: 'Specific' },
    { name: 'renderAIUnavailable', type: '({ mode, providerId, reason, configured }) => ReactNode', description: 'Custom inline renderer shown when no AI provider is configured.', group: 'Specific' },
];

export const PROMPT_LIVE_PROPS: PropDef[] = [
    { name: 'mode', type: '"run"', default: '"run"', description: 'Executes the stored template against the active form record and writes the result back to the same field.', group: 'Specific' },
    { name: 'onRunPrompt', type: '(prompt, options, data?) => Promise<string>', description: 'Optional custom executor. When provided it is called before the default AI provider. Useful for testing, mocking or custom AI wiring.', group: 'Specific' },
    {
        name: 'variables',
        type: 'PromptVariables',
        description: 'External key→value pairs injected into the template at preview and run time. Keys match {placeholder} tokens. Merged with form record values — variables take precedence on collision.',
        control: 'json',
        rows: 5,
        group: 'Specific',
        shortcuts: [
            { label: 'none', value: null, help: 'No external variables — only the form record is used.' },
            { label: 'product', value: { product: 'Atlas Console', industry: 'DevOps' }, help: 'Product-context variables.' },
            { label: 'customer', value: { customerName: 'Acme Corp', country: 'Italy' }, help: 'Customer-context variables.' },
        ],
        typeDetails: `Record<string, unknown>`,
    },
    {
        name: 'commands',
        type: 'PromptCommand[]',
        description: 'Slash commands shown via the / button in the run-mode footer. Selecting a command calls its handler with the current textarea value and replaces it with the returned string.',
        group: 'Specific',
        typeDetails: `{
  name: string;
  description?: string;
  icon?: string;
  handler?: (currentValue: string) => string | Promise<string>;
}[]`,
    },
    {
        name: 'attachments',
        type: 'boolean',
        default: 'false',
        description: 'Enables the paperclip button in the footer bar. Attached files appear as previews above the result textarea and are forwarded as multimodal inputs to vision-capable AI providers (OpenAI images, Anthropic images + PDFs, Gemini all file types).',
        control: 'boolean',
        group: 'Specific',
    },
    {
        name: 'actions',
        type: 'PromptAction[]',
        description: 'Custom icon buttons in the run-mode footer bar. A tokenUsage key activates the built-in token usage popup after each run.',
        group: 'Specific',
        typeDetails: `{
  key: string;
  icon: string;
  label?: string;
  content?: ReactNode;
}[]`,
    },
    {
        name: 'statusItems',
        type: 'PromptStatusItem[]',
        description: "Named items shown in the status strip below the footer after each run. Built-in keys: 'tokensIn', 'tokensOut', 'contextPercent', 'model', 'duration'. Custom items accept a { key, render } object.",
        group: 'Specific',
        typeDetails: `('tokensIn' | 'tokensOut' | 'contextPercent' | 'model' | 'duration' | { key: string; render: (stats: PromptRunStats) => ReactNode })[]`,
    },
    { name: 'renderAIUnavailable', type: '({ mode, providerId, reason, configured }) => ReactNode', description: 'Custom inline renderer shown when no AI provider is configured.', group: 'Specific' },
    { name: 'renderFallback', type: '(props) => ReactNode', description: 'Custom renderer shown when prompt mode is disabled (enabled=false) — replaces the default plain textarea.', group: 'Specific' },
];

export const PROMPT_PLAIN_PROPS: PropDef[] = [
    { name: 'mode', type: '"run"', default: '"run"', description: 'Plain fallback still uses run mode but with defaultValue.enabled = false.', group: 'Specific' },
    { name: 'renderFallback', type: '(props) => ReactNode', description: 'Custom renderer shown when prompt mode is disabled.', group: 'Specific' },
];

export const PROMPT_AVAILABILITY_PROPS: PropDef[] = [
    { name: 'renderAIUnavailable', type: '({ mode, providerId, reason, configured }) => ReactNode', description: 'Custom inline renderer used when AI execution is unavailable because the selected provider is missing or not configured.', group: 'Shared' },
];

export const executePromptPreview = async (
    prompt: string,
    config: Record<string, unknown>,
    data?: Record<string, unknown>,
): Promise<string> => {
    const resolved = data
        ? Object.entries(data).reduce(
            (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v ?? '')),
            prompt,
          )
        : prompt;
    const temperature = typeof config.temperature === 'number' ? config.temperature.toFixed(1) : 'default';
    const lang = config.language || 'default';
    const style = config.style || 'default';

    return [
        `[Mock AI — language: ${lang} · style: ${style} · temp: ${temperature}]`,
        '',
        resolved,
    ].join('\n');
};

export const createPromptPlaygroundDefaults = (mode: 'edit' | 'run' | 'plain') => {
    const shared = {
        name: 'summary',
        label: mode === 'edit' ? 'Summary prompt' : mode === 'plain' ? 'Summary' : 'AI summary',
        required: false,
        rows: mode === 'plain' ? 4 : 6,
        before: '',
        after: '',
        className: '',
        wrapperClassName: '',
    };

    if (mode === 'plain') {
        return {
            ...shared,
            mode: 'run',
            defaultValue: {
                value: 'A short human-written summary.',
                enabled: false,
                role: '',
                language: 'English',
                voice: '',
                style: '',
                model: '',
                temperature: 0.7,
            },
        };
    }

    const base = {
        ...shared,
        mode,
        defaultValue: {
            value: 'Write a concise project summary for {projectName}.',
            enabled: true,
            role: '',
            language: 'English',
            voice: '',
            style: 'concise',
            model: '',
            temperature: 0.7,
        },
    };

    if (mode === 'run') {
        return {
            ...base,
            variables: { projectName: 'Atlas Console' },
            attachments: false,
        };
    }

    return base;
};

export const createPromptPlaygroundSeed = (defaultValue: Record<string, unknown> | undefined) => ({
    projectName: 'Atlas Console',
    summary: {
        value: defaultValue?.enabled ? '' : (defaultValue?.value || ''),
        prompt: {
            enabled: defaultValue?.enabled ? 'on' : '',
            value: defaultValue?.value || '',
            role: defaultValue?.role || '',
            language: defaultValue?.language || '',
            voice: defaultValue?.voice || '',
            style: defaultValue?.style || '',
            model: defaultValue?.model || '',
            temperature: defaultValue?.temperature ?? 0.7,
        },
    },
});

export const sharedPromptPlaygroundProps = (
    specificProps: PropDef[],
): PropDef[] => [...specificProps, ...PROMPT_SHARED_PROPS];

export type PromptPlaygroundMode = 'edit' | 'run' | 'plain';

export const createPromptPlayground = (
    mode: PromptPlaygroundMode,
    render: PlaygroundConfig['render'],
    specificProps: PropDef[],
): PlaygroundConfig => ({
    props: sharedPromptPlaygroundProps(specificProps),
    showFormRecord: true,
    size: '2xl',
    layout: 'split',
    defaultProps: createPromptPlaygroundDefaults(mode),
    render,
});
