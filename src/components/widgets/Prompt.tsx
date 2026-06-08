import React, { useEffect, useId, useState } from 'react';
import { useTheme } from "../../Theme";
import { Prompt as PromptConf, PromptVariables, PROMPT_CLEANUP, PROMPT_NO_REFERENCE } from '../../conf/Prompt';
import { type AIProviderCapabilities, type AIProviderAdapter, type AIRequestOptions, parseAIModelRef, formatAIModelRef } from '../../providers/ai/AIProvider';
import { useAIProvider, useAIProviderRegistry } from '../../providers/ai/AIProviderContext';
import { getAIModelCatalog } from '../../providers/ai/shared';
import { RecordProps } from '../../providers/data/DataProvider';
import { getProviderConfigurationState } from '../../providers/ProviderConfiguration';
import { Dropdown, DropdownItem } from '../blocks/Dropdown';
import Alert from '../ui/Alert';
import { LoadingButton } from '../ui/Buttons';
import { Wrapper } from '../ui/GridSystem';
import { Label, Range, Switch, TextArea } from '../ui/fields/Input';
import { Select } from '../ui/fields/Select';
import { FormFieldProps, useFormContext } from './Form';

export enum PromptMode {
    EDIT = "edit",
    RUN = "run",
    EDITOR = "edit",
    LIVE = "run"
}

type PromptOptions = AIRequestOptions & {
    value: string;
};

type PromptConfig = Partial<PromptOptions> & { enabled?: boolean };

type OnRunPrompt = (prompt: string, options: AIRequestOptions, data?: PromptVariables) => Promise<string>;

type PromptDefaultValue = {
    value?: string;
    enabled?: boolean;
    role?: string;
    language?: string;
    voice?: string;
    style?: string;
    model?: string;
    temperature?: number;
};

type RenderPlainFallback = (props: Omit<FormFieldProps, "defaultValue">) => React.ReactNode;

type RenderAIUnavailable = (props: {
    mode: PromptMode;
    providerId?: string | null;
    reason?: string;
    configured: boolean;
}) => React.ReactNode;

type PromptSharedProps = FormFieldProps & {
    rows?: number;
    defaultValue?: PromptDefaultValue;
    renderAIUnavailable?: RenderAIUnavailable;
};

type PromptEditProps = PromptSharedProps & {
    mode?: PromptMode.EDIT | PromptMode.EDITOR;
};

type PromptRunProps = PromptSharedProps & {
    mode: PromptMode.RUN | PromptMode.LIVE;
    onRunPrompt?: OnRunPrompt;
    renderPlainFallback?: RenderPlainFallback;
    renderPromptDisabled?: RenderPlainFallback;
};

export type PromptProps = PromptEditProps | PromptRunProps;

interface PromptEditorProps extends Omit<PromptEditProps, "mode"> {
    value?: RecordProps & { prompt?: PromptConfig };
}

interface PromptRunBranchProps extends Omit<PromptRunProps, "mode" | "renderPromptDisabled"> {
    value?: RecordProps & { prompt?: PromptConfig };
}

interface PromptPlainFallbackProps extends Omit<PromptRunProps, "mode" | "onRunPrompt"> {
}

type PromptAvailabilityState = {
    provider: AIProviderAdapter | null;
    providerId: string | null;
    configured: boolean;
    reason?: string;
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
const getPromptRunErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') {
        if ('reason' in error && typeof error.reason === 'string') return error.reason;
        if ('error' in error && typeof error.error === 'string') return error.error;
        if ('message' in error && typeof error.message === 'string') return error.message;
    }
    return "Prompt execution failed.";
};

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

            const catalog = await getAIModelCatalog(aiRegistry.registry);

            if (cancelled) return;

            const modelOptions = catalog.models
                .map((model) => ({
                    label: model.label,
                    value: model.id,
                }));

            setState({
                modelOptions: modelOptions.length > 0 ? modelOptions : getFallbackModelOptions(),
                capabilitiesByProvider: catalog.capabilitiesByProvider,
            });
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [aiRegistry]);

    return state;
}

function usePromptAvailability(selectedModelRef?: string, customExecutorAvailable = false): PromptAvailabilityState {
    const ai = useAIProvider();
    const aiRegistry = useAIProviderRegistry();
    const parsedModelRef = parseAIModelRef(selectedModelRef);
    const registryKeys = Object.keys(aiRegistry?.registry ?? {});
    const requestedProviderId = parsedModelRef?.provider ?? ai?.id ?? ((aiRegistry?.defaultKey && registryKeys.includes(aiRegistry.defaultKey)) ? aiRegistry.defaultKey : null);
    const provider = requestedProviderId
        ? (aiRegistry?.registry[requestedProviderId] ?? (ai?.id === requestedProviderId ? ai : null))
        : (ai ?? null);

    if (customExecutorAvailable) {
        return {
            provider,
            providerId: requestedProviderId,
            configured: true,
        };
    }

    if (registryKeys.length === 0 && !provider) {
        return {
            provider: null,
            providerId: null,
            configured: false,
            reason: "No AI providers are registered.",
        };
    }

    const state = getProviderConfigurationState(
        provider,
        requestedProviderId ? `AI provider "${requestedProviderId}"` : "AI provider"
    );

    return {
        provider,
        providerId: requestedProviderId,
        configured: state.configured,
        reason: state.reason,
    };
}

const PromptAvailabilityNotice = ({
    mode,
    availability,
    renderAIUnavailable,
}: {
    mode: PromptMode;
    availability: PromptAvailabilityState;
    renderAIUnavailable?: RenderAIUnavailable;
}) => {
    if (availability.configured) return null;

    const customNotice = renderAIUnavailable?.({
        mode,
        providerId: availability.providerId,
        reason: availability.reason,
        configured: availability.configured,
    });

    if (customNotice !== undefined && customNotice !== null) return <>{customNotice}</>;

    return (
        <Alert
            type="warning"
            icon="warning"
            className="text-xs leading-5"
        >
            {mode === PromptMode.EDIT
                ? (availability.reason || "AI is not configured. You can still edit and save this prompt.")
                : (availability.reason || "AI is not configured. Prompt execution is unavailable.")}
        </Alert>
    );
};

export const Prompt = ({
    mode = PromptMode.EDIT,
    ...props
}: PromptProps) => {
    const { value } = useFormContext({ name: props.name });
    const rec = (value != null && typeof value === 'object' && !Array.isArray(value))
        ? value as RecordProps & { prompt?: PromptConfig }
        : undefined;
    const promptEnabled = isPromptEnabled(rec?.prompt?.enabled, props.defaultValue?.enabled, rec?.prompt);

    return mode === PromptMode.EDIT
        ? <PromptEditor {...props} value={rec} />
        : promptEnabled
            ? <PromptRun {...props} value={rec} />
            : <PromptPlainFallback {...props} />;
};

const isPromptEnabled = (value: unknown, fallback?: boolean, promptState?: unknown) => {
    if (typeof value === "string") return value === "on" || value === "true";
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (promptState && typeof promptState === "object") return false;
    return Boolean(fallback);
};

const getPromptToggleTitle = (enabled: boolean) => enabled
    ? "Prompt ON. In PromptRun, this textarea is treated as the prompt template and can be executed against the current record. Turn OFF to skip the prompt system and use the plain fallback text instead."
    : "Prompt OFF. In PromptRun, the prompt system is skipped and the plain fallback text is used directly. Turn ON to use this textarea as the prompt template.";

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
    className = undefined,
    renderAIUnavailable = undefined
}: PromptEditorProps) => {
    const { handleChange } = useFormContext({ name });
    const theme = useTheme("prompt");
    const caption = label || name;
    const promptEnabled = isPromptEnabled(value?.prompt?.enabled, defaultValue?.enabled, value?.prompt);
    const switchTitle = getPromptToggleTitle(promptEnabled);
    const editorId = useId();
    const selectedModelRef = value?.prompt?.model?.toString() || defaultValue?.model;
    const availability = usePromptAvailability(selectedModelRef);

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
                    <PromptAvailabilityNotice
                        mode={PromptMode.EDIT}
                        availability={availability}
                        renderAIUnavailable={renderAIUnavailable}
                    />
                </div>
                {post && <div className="shrink-0">{post}</div>}
            </div>
        </Wrapper>
    );
};

const promptTextareaClass = "border-0 shadow-none rounded-none focus-visible:ring-0";

const PromptRun = ({
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
    onRunPrompt,
    renderAIUnavailable
}: PromptRunBranchProps) => {
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
    const availability = usePromptAvailability(selectedModelRef, Boolean(onRunPrompt));
    const runDisabled = !availability.configured;
    const runTitle = runDisabled
        ? (availability.reason || "AI is not configured. Prompt execution is unavailable.")
        : undefined;
    const [runError, setRunError] = useState<string | null>(null);

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
                            <Dropdown position="end" placement="auto" toggleButton={{ icon: "settings" }} buttonClass="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
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
                                loadingLabel="Running..."
                                disabled={runDisabled}
                                title={runTitle}
                                onClick={async () => {
                                    const modelRef = value?.prompt?.model?.toString() || defaultModelRef;
                                    const parsed = parseAIModelRef(modelRef);
                                    const resolvedProvider = parsed
                                        ? (aiRegistry?.registry[parsed.provider] ?? ai ?? undefined)
                                        : (ai ?? undefined);

                                    try {
                                        const result = await runPrompt(value?.prompt as PromptOptions, record, onRunPrompt, resolvedProvider);
                                        setRunError(null);
                                        handleChange?.({
                                            target: {
                                                name: name + ".value",
                                                value: result,
                                            },
                                        });
                                    } catch (error) {
                                        setRunError(getPromptRunErrorMessage(error));
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
                <PromptAvailabilityNotice
                    mode={PromptMode.RUN}
                    availability={availability}
                    renderAIUnavailable={renderAIUnavailable}
                />
                {runError && (
                    <Alert
                        type="danger"
                        icon="warning"
                        className="text-xs leading-5"
                    >
                        {runError}
                    </Alert>
                )}
                </div>
                {post && <div className="shrink-0">{post}</div>}
            </div>
        </Wrapper>
    );
};

const PromptPlainFallback = ({
    name,
    label,
    required,
    onChange,
    rows,
    pre,
    post,
    wrapClass,
    className,
    renderPlainFallback,
    renderPromptDisabled
}: PromptPlainFallbackProps) => {
    const theme = useTheme("prompt");
    const disabledId = useId();
    const renderFallback = renderPlainFallback ?? renderPromptDisabled;

    return (
        <Wrapper className={wrapClass || theme.Prompt.wrapClass}>
            <div className="flex items-center gap-2">
                {pre && <div className="shrink-0">{pre}</div>}
                <div className="min-w-0 flex-1">
                    {renderFallback?.({ name, label, required, onChange }) ?? (
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

    if (!promptText) return '';
    if (!provider) {
        throw new Error("No AI provider is available for this prompt.");
    }

    const parsed = parseAIModelRef(modelRef);
    const model = parsed?.model || modelRef || provider.defaultModel;

    const response = await provider.complete({
        ...requestOptions,
        model,
        prompt: [PROMPT_CLEANUP, promptText, PROMPT_NO_REFERENCE].join('\n'),
        data,
    });

    if (typeof response !== 'string' || !response.trim()) {
        throw new Error("The AI provider returned no response.");
    }

    return response;
};

export default Prompt;
