import type { PlaygroundConfig, PropDef } from '../../../docs-kit/playground';

export const PROMPT_SHARED_PROPS: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name used as form key', control: 'text', group: 'Shared' },
    { name: 'label', type: 'string', description: 'Field label shown above the active textarea', control: 'text', group: 'Shared' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks the active textarea as required', control: 'boolean', group: 'Shared' },
    {
        name: 'defaultValue',
        type: 'PromptValue',
        description: 'Initial prompt metadata and stored prompt text.',
        control: 'json',
        rows: 10,
        group: 'Shared',
        shortcuts: [
            { label: 'summary', value: { value: 'Write a concise project summary for {projectName}.', enabled: true, role: '', language: 'English', voice: '', style: 'concise', model: '', temperature: 0.7 }, help: 'Summary prompt with live execution enabled.' },
            { label: 'email', value: { value: 'Draft a short follow-up email for {customerName}.', enabled: true, role: '', language: 'English', voice: 'friendly', style: 'concise', model: '', temperature: 0.5 }, help: 'Customer follow-up prompt.' },
            { label: 'plain', value: { value: 'Plain textarea mode without AI prompt metadata.', enabled: false, role: '', language: 'English', voice: '', style: '', model: '', temperature: 0.7 }, help: 'Stored text without prompt mode.' },
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
    { name: 'rows', type: 'number', description: 'Textarea rows', control: 'number', min: 2, max: 14, group: 'Shared' },
    { name: 'pre', type: 'ReactNode', description: 'Content rendered before the prompt block', control: 'text', group: 'Shared' },
    { name: 'post', type: 'ReactNode', description: 'Content rendered after the prompt block', control: 'text', group: 'Shared' },
    { name: 'onChange', type: 'FieldOnChange', description: 'Custom change handler called by Form context', group: 'Shared' },
    { name: 'className', type: 'string', description: 'CSS classes passed to the active textarea', control: 'text', group: 'Shared' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes passed to the outer wrapper', control: 'text', group: 'Shared' },
];

export const PROMPT_EDITOR_PROPS: PropDef[] = [
    { name: 'mode', type: '"editor"', default: '"editor"', description: 'Authors and stores the prompt itself instead of executing it.', group: 'Specific' },
];

export const PROMPT_LIVE_PROPS: PropDef[] = [
    { name: 'mode', type: '"live"', default: '"live"', description: 'Shows the result surface and lets the user execute the stored prompt against the current form record.', group: 'Specific' },
    { name: 'onRunPrompt', type: '(prompt, config, data) => Promise<string>', description: 'Optional custom executor used in live mode before falling back to the default AI provider.', group: 'Specific' },
];

export const PROMPT_PLAIN_PROPS: PropDef[] = [
    { name: 'mode', type: '"live"', default: '"live"', description: 'Plain fallback still uses live mode, but with `defaultValue.enabled` disabled.', group: 'Specific' },
    { name: 'renderPromptDisabled', type: '(props) => ReactNode', description: 'Custom renderer shown when prompt mode is disabled and the component falls back to a plain textarea.', group: 'Specific' },
];

export const executePromptPreview = async (
    prompt: string,
    config: Record<string, any>,
    data?: Record<string, any>,
) => {
    const projectName = data?.projectName || data?.customerName || 'Untitled project';
    const temperature = typeof config.temperature === 'number' ? config.temperature.toFixed(1) : 'default';

    return [
        `Generated for: ${projectName}`,
        `Language: ${config.language || 'default'}`,
        `Tone: ${config.style || 'default'}`,
        `Temperature: ${temperature}`,
        '',
        prompt.replace(/\{projectName\}/g, projectName).replace(/\{customerName\}/g, projectName),
    ].join('\n');
};

export const createPromptPlaygroundDefaults = (mode: 'editor' | 'live' | 'plain') => {
    const shared = {
        name: 'summary',
        label: mode === 'editor' ? 'Summary prompt' : mode === 'plain' ? 'Summary' : 'AI summary',
        required: false,
        rows: mode === 'plain' ? 4 : 6,
        pre: '',
        post: '',
        className: '',
        wrapClass: '',
    };

    if (mode === 'plain') {
        return {
            ...shared,
            mode: 'live',
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

    return {
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
};

export const createPromptPlaygroundSeed = (defaultValue: any) => ({
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

export type PromptPlaygroundMode = 'editor' | 'live' | 'plain';

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
