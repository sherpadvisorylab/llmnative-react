import type { PlaygroundConfig, PropDef } from '../../../docs-kit/playground';
import type { I18nDict } from '@llmnative/react';

type PromptSharedCopy = I18nDict['showcase']['promptShared'];

export const createPromptSharedProps = (t: PromptSharedCopy): PropDef[] => [
    { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text', group: t.propsDocs.groups.shared },
    { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text', group: t.propsDocs.groups.shared },
    { name: 'required', type: 'boolean', default: t.propsDocs.items.required.default, description: t.propsDocs.items.required.description, control: 'boolean', group: t.propsDocs.groups.shared },
    {
        name: 'defaultValue',
        type: 'PromptDefaultValue',
        description: t.propsDocs.items.defaultValue.description,
        control: 'json',
        rows: 10,
        group: t.propsDocs.groups.shared,
        shortcuts: [
            { label: t.playground.shortcuts.summary.label, value: { value: t.playground.defaults.conciseProjectSummary, enabled: true, role: '', language: t.playground.defaults.english, voice: '', style: t.playground.defaults.concise, model: '', temperature: 0.7 }, help: t.playground.shortcuts.summary.help },
            { label: t.playground.shortcuts.email.label, value: { value: t.playground.defaults.followUpEmail, enabled: true, role: '', language: t.playground.defaults.english, voice: t.playground.defaults.friendly, style: t.playground.defaults.concise, model: '', temperature: 0.5 }, help: t.playground.shortcuts.email.help },
            { label: t.playground.shortcuts.plain.label, value: { value: t.playground.defaults.shortHumanSummary, enabled: false, role: '', language: t.playground.defaults.english, voice: '', style: '', model: '', temperature: 0.7 }, help: t.playground.shortcuts.plain.help },
        ],
        typeDetails: t.propsDocs.items.defaultValue.typeDetails,
    },
    { name: 'rows', type: 'number', description: t.propsDocs.items.rows.description, control: 'number', min: 2, max: 14, group: t.propsDocs.groups.shared },
    { name: 'before', type: 'ReactNode', description: t.propsDocs.items.before.description, control: 'text', group: t.propsDocs.groups.shared },
    { name: 'after', type: 'ReactNode', description: t.propsDocs.items.after.description, control: 'text', group: t.propsDocs.groups.shared },
    { name: 'onChange', type: 'FieldOnChange', description: t.propsDocs.items.onChange.description, group: t.propsDocs.groups.shared },
    { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text', group: t.propsDocs.groups.shared },
    { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text', group: t.propsDocs.groups.shared },
    { name: 'inheritWrapperClassName', type: 'boolean', default: t.propsDocs.items.inheritWrapperClassName.default, description: t.propsDocs.items.inheritWrapperClassName.description, control: 'boolean', group: t.propsDocs.groups.shared },
];

export const createPromptEditorProps = (t: PromptSharedCopy): PropDef[] => [
    { name: 'mode', type: '"edit"', default: t.propsDocs.items.editorMode.default, description: t.propsDocs.items.editorMode.description, group: t.propsDocs.groups.specific },
    { name: 'renderAIUnavailable', type: '({ mode, providerId, reason, configured }) => ReactNode', description: t.propsDocs.items.renderAIUnavailableEdit.description, group: t.propsDocs.groups.specific },
];

export const createPromptLiveProps = (t: PromptSharedCopy): PropDef[] => [
    { name: 'mode', type: '"run"', default: t.propsDocs.items.runMode.default, description: t.propsDocs.items.runMode.description, group: t.propsDocs.groups.specific },
    { name: 'onRunPrompt', type: '(prompt, options, data?) => Promise<string>', description: t.propsDocs.items.onRunPrompt.description, group: t.propsDocs.groups.specific },
    {
        name: 'variables',
        type: 'PromptVariables',
        description: t.propsDocs.items.variables.description,
        control: 'json',
        rows: 5,
        group: t.propsDocs.groups.specific,
        shortcuts: [
            { label: t.playground.shortcuts.none.label, value: null, help: t.playground.shortcuts.none.help },
            { label: t.playground.shortcuts.product.label, value: { product: t.playground.defaults.atlasConsole, industry: 'DevOps' }, help: t.playground.shortcuts.product.help },
            { label: t.playground.shortcuts.customer.label, value: { customerName: 'Acme Corp', country: 'Italy' }, help: t.playground.shortcuts.customer.help },
        ],
        typeDetails: t.propsDocs.items.variables.typeDetails,
    },
    { name: 'commands', type: 'PromptCommand[]', description: t.propsDocs.items.commands.description, group: t.propsDocs.groups.specific, typeDetails: t.propsDocs.items.commands.typeDetails },
    { name: 'attachments', type: 'boolean', default: t.propsDocs.items.attachments.default, description: t.propsDocs.items.attachments.description, control: 'boolean', group: t.propsDocs.groups.specific },
    { name: 'actions', type: 'PromptAction[]', description: t.propsDocs.items.actions.description, group: t.propsDocs.groups.specific, typeDetails: t.propsDocs.items.actions.typeDetails },
    { name: 'statusItems', type: 'PromptStatusItem[]', description: t.propsDocs.items.statusItems.description, group: t.propsDocs.groups.specific, typeDetails: t.propsDocs.items.statusItems.typeDetails },
    { name: 'renderAIUnavailable', type: '({ mode, providerId, reason, configured }) => ReactNode', description: t.propsDocs.items.renderAIUnavailableRun.description, group: t.propsDocs.groups.specific },
    { name: 'renderFallback', type: '(props) => ReactNode', description: t.propsDocs.items.renderFallbackRun.description, group: t.propsDocs.groups.specific },
];

export const createPromptPlainProps = (t: PromptSharedCopy): PropDef[] => [
    { name: 'mode', type: '"run"', default: t.propsDocs.items.plainMode.default, description: t.propsDocs.items.plainMode.description, group: t.propsDocs.groups.specific },
    { name: 'renderFallback', type: '(props) => ReactNode', description: t.propsDocs.items.renderFallbackPlain.description, group: t.propsDocs.groups.specific },
];

export const executePromptPreview = async (
    t: PromptSharedCopy,
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
    const temperature = typeof config.temperature === 'number' ? config.temperature.toFixed(1) : t.playground.mockAi.defaultValue;
    const lang = String(config.language || t.playground.mockAi.defaultValue);
    const style = String(config.style || t.playground.mockAi.defaultValue);

    return [
        t.playground.mockAi.header
            .replace('{language}', lang)
            .replace('{style}', style)
            .replace('{temperature}', temperature),
        '',
        resolved,
    ].join('\n');
};

export const createPromptPlaygroundDefaults = (
    t: PromptSharedCopy,
    mode: 'edit' | 'run' | 'plain',
) => {
    const shared = {
        name: 'summary',
        label: mode === 'edit'
            ? t.playground.defaults.summaryPromptLabel
            : mode === 'plain'
                ? t.playground.defaults.summaryLabel
                : t.playground.defaults.aiSummaryLabel,
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
                value: t.playground.defaults.shortHumanSummary,
                enabled: false,
                role: '',
                language: t.playground.defaults.english,
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
            value: t.playground.defaults.conciseProjectSummary,
            enabled: true,
            role: '',
            language: t.playground.defaults.english,
            voice: '',
            style: t.playground.defaults.concise,
            model: '',
            temperature: 0.7,
        },
    };

    if (mode === 'run') {
        return {
            ...base,
            variables: { projectName: t.playground.defaults.atlasConsole },
            attachments: false,
        };
    }

    return base;
};

export const createPromptPlaygroundSeed = (
    t: PromptSharedCopy,
    defaultValue: Record<string, unknown> | undefined,
) => ({
    projectName: t.playground.defaults.atlasConsole,
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
    t: PromptSharedCopy,
    specificProps: PropDef[],
): PropDef[] => [...specificProps, ...createPromptSharedProps(t)];

export type PromptPlaygroundMode = 'edit' | 'run' | 'plain';

export const createPromptPlayground = (
    t: PromptSharedCopy,
    mode: PromptPlaygroundMode,
    render: PlaygroundConfig['render'],
    specificProps: PropDef[],
): PlaygroundConfig => ({
    props: sharedPromptPlaygroundProps(t, specificProps),
    showFormRecord: true,
    size: '2xl',
    layout: 'split',
    defaultProps: createPromptPlaygroundDefaults(t, mode),
    render,
});
