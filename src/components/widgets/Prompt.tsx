import React, { useEffect, useId, useState } from 'react';
import { useTheme } from "../../Theme";
import { Prompt as PromptConf, PromptVariables, PROMPT_CLEANUP, PROMPT_NO_REFERENCE } from '../../conf/Prompt';
import { type AIProviderCapabilities, type AIProviderAdapter, parseAIModelRef, formatAIModelRef } from '../../providers/ai/AIProvider';
import { useAIProvider, useAIProviderRegistry } from '../../providers/ai/AIProviderContext';
import { type AIRequestOptions } from '../../providers/ai';
import { RecordProps } from '../../providers/data/DataProvider';
import { Dropdown, DropdownItem } from '../blocks/Dropdown';
import { LoadingButton } from '../ui/Buttons';
import { Wrapper } from '../ui/GridSystem';
import { Label, Range, Switch, TextArea } from '../ui/fields/Input';
import { Select } from '../ui/fields/Select';
import { FormFieldProps, useFormContext } from './Form';

export enum PromptMode {
    EDITOR = "editor",
    LIVE = "live"
}

type PromptOptions = AIRequestOptions & {
    value: string;
};

type OnRunPrompt = (prompt: string, options: AIRequestOptions, data?: PromptVariables) => Promise<string>;

export interface PromptProps extends FormFieldProps {
    mode?: PromptMode;
    onRunPrompt?: OnRunPrompt;
    renderPromptDisabled?: (props: Omit<FormFieldProps, "defaultValue">) => React.ReactNode;
    rows?: number;
    defaultValue?: {
        value?: string;
        enabled?: boolean;
        role?: string;
        language?: string;
        voice?: string;
        style?: string;
        model?: string;
        temperature?: number;
    };
}

interface PromptEditorProps extends Omit<PromptProps, "mode" | "onRunPrompt" | "renderPromptDisabled"> {
    value?: RecordProps;
}

interface PromptLiveProps extends Omit<PromptProps, "mode" | "renderPromptDisabled"> {
    value?: RecordProps;
}

interface PromptDisabledProps extends Omit<PromptProps, "mode" | "onRunPrompt"> {
}

type PromptCapabilitiesState = {
    modelOptions: Array<{ label: string; value: string }>;
    capabilitiesByProvider: Record<string, AIProviderCapabilities>;
};

const promptLabel = "Prompt: ";
const promptBodyClass = "space-y-2";
const promptHeaderClass = "flex items-center justify-between gap-3";
const promptTitleClass = "mb-0 min-w-0 text-sm font-medium leading-5 text-foreground";
const promptActionClass = "ml-auto shrink-0";

const getFallbackModelOptions = (): Array<{ label: string; value: string }> => [];

const PromptFieldHeader = ({
    htmlFor,
    label,
    required = false,
    action,
}: {
    htmlFor: string;
    label: string;
    required?: boolean;
    action?: React.ReactNode;
}) => (
    <div className={promptHeaderClass}>
        <Label
            htmlFor={htmlFor}
            label={label}
            required={required}
            className={promptTitleClass}
        />
        {action ? <div className={promptActionClass}>{action}</div> : null}
    </div>
);

function usePromptCapabilities() {
    const aiRegistry = useAIProviderRegistry();
    const [state, setState] = useState<PromptCapabilitiesState>({
        modelOptions: getFallbackModelOptions(),
        capabilitiesByProvider: {},
    });

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!aiRegistry || Object.keys(aiRegistry.registry).length === 0) {
                if (!cancelled) {
                    setState({
                        modelOptions: getFallbackModelOptions(),
                        capabilitiesByProvider: {},
                    });
                }
                return;
            }

            const entries = await Promise.all(
                Object.entries(aiRegistry.registry).map(async ([providerId, provider]) => [
                    providerId,
                    await provider.getCapabilities(),
                ] as const)
            );

            if (cancelled) return;

            const capabilitiesByProvider = entries.reduce<Record<string, AIProviderCapabilities>>((acc, [providerId, capabilities]) => {
                acc[providerId] = capabilities;
                return acc;
            }, {});

            const modelOptions = entries
                .flatMap(([, capabilities]) => capabilities.models)
                .map((model) => ({
                    label: model.label,
                    value: model.id,
                }));

            setState({
                modelOptions: modelOptions.length > 0 ? modelOptions : getFallbackModelOptions(),
                capabilitiesByProvider,
            });
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [aiRegistry]);

    return state;
}

export const Prompt = ({
    mode = PromptMode.EDITOR,
    onRunPrompt,
    renderPromptDisabled,
    ...props
}: PromptProps) => {
    const { value } = useFormContext({ name: props.name });
    const promptEnabled = isPromptEnabled(value?.prompt?.enabled, props.defaultValue?.enabled, value?.prompt);

    return mode === PromptMode.EDITOR
        ? <PromptEditor {...props} value={value} />
        : promptEnabled
            ? <PromptLive {...props} value={value} onRunPrompt={onRunPrompt} />
            : <PromptDisabled {...props} renderPromptDisabled={renderPromptDisabled} />;
};

const isPromptEnabled = (value: unknown, fallback?: boolean, promptState?: RecordProps) => {
    if (typeof value === "string") return value === "on" || value === "true";
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (promptState && typeof promptState === "object") return false;
    return Boolean(fallback);
};

const getPromptToggleTitle = (enabled: boolean) => enabled
    ? "Prompt ON. In PromptLive, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead."
    : "Prompt OFF. In PromptLive, the prompt system is skipped and the plain fallback text is used directly. Turn ON to use this textarea as the prompt template.";

const PromptEditor = ({
    name,
    label = undefined,
    value = undefined,
    required = false,
    onChange = undefined,
    defaultValue = undefined,
    rows = 10,
    pre = undefined,
    post = undefined,
    wrapClass = undefined,
    className = undefined
}: PromptEditorProps) => {
    const { handleChange } = useFormContext({ name });
    const theme = useTheme("prompt");
    const caption = label || name;
    const promptEnabled = isPromptEnabled(value?.prompt?.enabled, defaultValue?.enabled, value?.prompt);
    const switchTitle = getPromptToggleTitle(promptEnabled);
    const editorId = useId();

    return (
        <Wrapper className={wrapClass || theme.Prompt.wrapClass}>
            <div className="flex items-center gap-2">
                {pre && <div className="shrink-0">{pre}</div>}
                <div className={`${promptBodyClass} min-w-0 flex-1`}>
                    <PromptFieldHeader
                        htmlFor={editorId}
                        label={promptEnabled ? promptLabel + caption : caption}
                        required={required}
                        action={
                        <Switch
                            name={name + ".prompt.enabled"}
                            ariaLabel={switchTitle}
                            title={switchTitle}
                            defaultValue={promptEnabled ? "on" : ""}
                            inheritFormWrapClass={false}
                            onChange={({ event }) => {
                                handleChange({
                                    target: {
                                        name: name + ".prompt.value",
                                        value: event.target.value && defaultValue?.value
                                    }
                                });
                            }}
                        />
                        }
                    />
                    <TextArea
                        inputId={editorId}
                        className={className || theme.Prompt.className}
                        name={name + (promptEnabled ? ".prompt.value" : ".value")}
                        defaultValue={promptEnabled ? defaultValue?.value : undefined}
                        onChange={onChange}
                        required={required}
                        inheritFormWrapClass={false}
                        wrapClass=""
                        maxRows={rows}
                    />
                </div>
                {post && <div className="shrink-0">{post}</div>}
            </div>
        </Wrapper>
    );
};

const promptTextareaClass = "border-0 shadow-none rounded-none focus-visible:ring-0";

const PromptLive = ({
    name,
    label,
    value,
    required,
    onChange,
    defaultValue,
    rows = 6,
    pre,
    post,
    wrapClass,
    className,
    onRunPrompt
}: PromptLiveProps) => {
    const { handleChange, record } = useFormContext({ name });
    const theme = useTheme("prompt");
    const caption = label || name;
    const [editing, setEditing] = useState(false);
    const ai = useAIProvider();
    const aiRegistry = useAIProviderRegistry();
    const promptDefaults = PromptConf.defaults();
    const defaultModelRef = (typeof localStorage !== 'undefined' && localStorage.getItem('prompt.model'))
        || (ai ? formatAIModelRef(ai.id, ai.defaultModel) : '');
    const { modelOptions, capabilitiesByProvider } = usePromptCapabilities();

    const selectedModelRef = value?.prompt?.model?.toString() || defaultValue?.model || defaultModelRef;
    const selectedProvider = parseAIModelRef(selectedModelRef)?.provider;
    const selectedCapabilities = selectedProvider ? capabilitiesByProvider[selectedProvider] : undefined;
    const supportsTemperature = selectedCapabilities?.supportsTemperature ?? true;
    const fieldId = useId();

    return (
        <Wrapper className={wrapClass || theme.Prompt.wrapClass}>
            <div className="flex items-center gap-2">
                {pre && <div className="shrink-0">{pre}</div>}
                <div className={`${promptBodyClass} min-w-0 flex-1`}>
                <PromptFieldHeader
                    htmlFor={fieldId}
                    label={caption}
                    required={required}
                />
                <div className="rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring">
                    <div className="overflow-hidden rounded-t-md">
                        <div className={editing ? '' : 'hidden'}>
                            <TextArea
                                inputId={fieldId}
                                name={name + ".prompt.value"}
                                defaultValue={defaultValue?.value}
                                onChange={onChange}
                                required={true}
                                inheritFormWrapClass={false}
                                wrapClass=""
                                className={`${className || theme.Prompt.className} ${promptTextareaClass}`}
                                maxRows={rows}
                            />
                        </div>
                        <div className={editing ? 'hidden' : ''}>
                            <TextArea
                                name={name + ".value"}
                                onChange={onChange}
                                required={required}
                                inheritFormWrapClass={false}
                                wrapClass=""
                                className={`${className || theme.Prompt.className} ${promptTextareaClass}`}
                                maxRows={rows}
                            />
                        </div>
                    </div>
                    <div className="relative flex items-center gap-2 border-t border-input bg-muted/30 px-2 py-1.5 rounded-b-md">
                        <Switch
                            name={name + ".prompt.editing"}
                            ariaLabel={editing ? "Mode: editing prompt template" : "Mode: viewing result"}
                            title={editing ? "Switch to result mode" : "Switch to edit prompt template"}
                            defaultValue=""
                            inheritFormWrapClass={false}
                            onChange={({ event }) => setEditing(event.target.value === 'on')}
                        />
                        <span className="select-none text-xs text-muted-foreground">
                            {editing ? "Edit prompt" : "Result"}
                        </span>
                        <div className="flex-1" />
                        {editing && (
                            <Dropdown position="end" toggleButton={{ icon: "settings" }} buttonClass="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" menuClass="bottom-full top-auto mb-1 mt-0">
                                <DropdownItem>
                                    <Select
                                        name={name + ".prompt.role"}
                                        pre="Role"
                                        defaultValue={defaultValue?.role}
                                        inheritFormWrapClass={false}
                                        className="text-xs"
                                        options={PromptConf.getRoles()}
                                        optionEmpty={{ label: "Default (" + promptDefaults.role + ")", value: "" }}
                                    />
                                </DropdownItem>
                                <DropdownItem>
                                    <Select
                                        name={name + ".prompt.language"}
                                        pre="Language"
                                        defaultValue={defaultValue?.language}
                                        inheritFormWrapClass={false}
                                        className="text-xs"
                                        options={PromptConf.getLangs()}
                                        optionEmpty={{ label: "Default (" + promptDefaults.language + ")", value: "" }}
                                    />
                                </DropdownItem>
                                <DropdownItem>
                                    <Select
                                        name={name + ".prompt.voice"}
                                        pre="Voice"
                                        defaultValue={defaultValue?.voice}
                                        inheritFormWrapClass={false}
                                        className="text-xs"
                                        options={PromptConf.getVoices()}
                                        optionEmpty={{ label: "Default (" + promptDefaults.voice + ")", value: "" }}
                                    />
                                </DropdownItem>
                                <DropdownItem>
                                    <Select
                                        name={name + ".prompt.style"}
                                        pre="Style"
                                        defaultValue={defaultValue?.style}
                                        inheritFormWrapClass={false}
                                        className="text-xs"
                                        options={PromptConf.getStyles()}
                                        optionEmpty={{ label: "Default (" + promptDefaults.style + ")", value: "" }}
                                    />
                                </DropdownItem>
                                <DropdownItem>
                                    <Select
                                        name={name + ".prompt.model"}
                                        pre="Model"
                                        defaultValue={defaultValue?.model}
                                        inheritFormWrapClass={false}
                                        className="text-xs"
                                        options={modelOptions}
                                        optionEmpty={{ label: "Default (" + defaultModelRef + ")", value: "" }}
                                    />
                                </DropdownItem>
                                {supportsTemperature && (
                                    <DropdownItem>
                                        <Range
                                            name={name + ".prompt.temperature"}
                                            label="Temperature"
                                            defaultValue={defaultValue?.temperature}
                                            inheritFormWrapClass={false}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                        />
                                    </DropdownItem>
                                )}
                            </Dropdown>
                        )}
                        {!editing && (
                            <LoadingButton
                                icon="stars"
                                label="Run"
                                onClick={async () => {
                                    const modelRef = value?.prompt?.model?.toString() || defaultModelRef;
                                    const parsed = parseAIModelRef(modelRef);
                                    const resolvedProvider = parsed
                                        ? (aiRegistry?.registry[parsed.provider] ?? ai ?? undefined)
                                        : (ai ?? undefined);
                                    handleChange?.({
                                        target: {
                                            name: name + ".value",
                                            value: await runPrompt(value?.prompt, record, onRunPrompt, resolvedProvider),
                                        },
                                    });
                                }}
                            />
                        )}
                    </div>
                </div>
                </div>
                {post && <div className="shrink-0">{post}</div>}
            </div>
        </Wrapper>
    );
};

const PromptDisabled = ({
    name,
    label,
    required,
    onChange,
    rows,
    pre,
    post,
    wrapClass,
    className,
    renderPromptDisabled
}: PromptDisabledProps) => {
    const theme = useTheme("prompt");
    const disabledId = useId();

    return (
        <Wrapper className={wrapClass || theme.Prompt.wrapClass}>
            <div className="flex items-center gap-2">
                {pre && <div className="shrink-0">{pre}</div>}
                <div className="min-w-0 flex-1">
                    {renderPromptDisabled?.({ name, label, required, onChange }) ?? (
                        <div className={promptBodyClass}>
                            {label && (
                                <PromptFieldHeader
                                    htmlFor={disabledId}
                                    label={label}
                                    required={required}
                                />
                            )}
                            <TextArea
                                inputId={disabledId}
                                className={className || theme.Prompt.className}
                                name={name + ".value"}
                                onChange={onChange}
                                required={required}
                                inheritFormWrapClass={false}
                                wrapClass=""
                                maxRows={rows}
                            />
                        </div>
                    )}
                </div>
                {post && <div className="shrink-0">{post}</div>}
            </div>
        </Wrapper>
    );
};

export const runPrompt = async (
    options: PromptOptions,
    data?: PromptVariables,
    onRunPrompt?: OnRunPrompt,
    provider?: AIProviderAdapter
): Promise<string> => {
    const { value: promptText, model: modelRef, ...requestOptions } = options ?? {};

    if (onRunPrompt) {
        return onRunPrompt(promptText, { ...requestOptions, model: modelRef }, data);
    }

    if (!provider || !promptText) return '';

    const parsed = parseAIModelRef(modelRef);
    const model = parsed?.model || modelRef || provider.defaultModel;

    const response = await provider.complete({
        ...requestOptions,
        model,
        prompt: [PROMPT_CLEANUP, promptText, PROMPT_NO_REFERENCE].join('\n'),
        data,
    });

    return typeof response === 'string' ? response : '';
};

export default Prompt;
