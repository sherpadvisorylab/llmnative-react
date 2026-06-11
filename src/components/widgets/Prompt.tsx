import React, { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from "../../Theme";
import { Prompt as PromptConf, PromptVariables, PROMPT_CLEANUP, PROMPT_NO_REFERENCE } from '../../conf/Prompt';
import { type AIProviderCapabilities, type AIProviderAdapter, type AIRequestOptions, parseAIModelRef, formatAIModelRef } from '../../providers/ai/AIProvider';
import { useAIProvider, useAIProviderRegistry } from '../../providers/ai/AIProviderContext';
import { getAIModelCatalog } from '../../providers/ai/shared';
import { RecordProps } from '../../providers/data/DataProvider';
import { getProviderConfigurationState } from '../../providers/ProviderConfiguration';
import { Dropdown, DropdownItem } from '../blocks/Dropdown';
import Alert from '../ui/Alert';
import { ActionButton, LoadingButton } from '../ui/Buttons';
import Icon from '../ui/Icon';
import { Wrapper } from '../ui/GridSystem';
import { Label, Range, Switch, TextArea } from '../ui/fields/Input';
import { Select } from '../ui/fields/Select';
import { FormFieldProps, useFormContext } from './Form';
import { PromptUtils } from '../../libs/promptUtils';

export enum PromptMode {
    EDIT = "edit",
    RUN = "run",
}

export type PromptCommand = {
    name: string;
    description?: string;
    icon?: string;
    handler?: (currentValue: string) => string | Promise<string>;
};

export type PromptAction = {
    key: string;
    icon: string;
    label?: string;
    content?: React.ReactNode;
};

export type PromptStatusItem =
    | 'tokensIn' | 'tokensOut' | 'contextPercent' | 'model' | 'duration'
    | { key: string; render: (stats: PromptRunStats) => React.ReactNode };

export type PromptRunStats = {
    tokensIn: number;
    tokensOut: number;
    contextPercent: number | null;
    model: string;
    durationMs: number;
    estimatedCost: number | null;
};

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
    variables?: PromptVariables;
};

type PromptEditProps = PromptSharedProps & {
    mode?: PromptMode.EDIT;
};

type PromptRunProps = PromptSharedProps & {
    mode: PromptMode.RUN;
    onRunPrompt?: OnRunPrompt;
    renderFallback?: RenderPlainFallback;
    commands?: PromptCommand[];
    attachments?: boolean;
    actions?: PromptAction[];
    statusItems?: PromptStatusItem[];
};

export type PromptProps = PromptEditProps | PromptRunProps;

interface PromptEditorProps extends Omit<PromptEditProps, "mode"> {
    value?: RecordProps & { prompt?: PromptConfig };
}

interface PromptRunBranchProps extends Omit<PromptRunProps, "mode"> {
    value?: RecordProps & { prompt?: PromptConfig };
}

interface PromptPlainFallbackProps extends Omit<PromptRunProps, "mode" | "onRunPrompt"> {}


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
            variant="warning"
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
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
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
        <Wrapper className={wrapperClassName || theme.Prompt.wrapperClassName}>
            <div className="flex items-center gap-2">
                {before && <div className="shrink-0">{before}</div>}
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
                            inheritWrapperClassName={false}
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
                        id={editorId}
                        className={className || theme.Prompt.className}
                        name={name + (promptEnabled ? ".prompt.value" : ".value")}
                        defaultValue={promptEnabled ? defaultValue?.value : undefined}
                        onChange={onChange}
                        required={required}
                        inheritWrapperClassName={false}
                        wrapperClassName=""
                        maxRows={rows}
                    />
                    <PromptAvailabilityNotice
                        mode={PromptMode.EDIT}
                        availability={availability}
                        renderAIUnavailable={renderAIUnavailable}
                    />
                </div>
                {after && <div className="shrink-0">{after}</div>}
            </div>
        </Wrapper>
    );
};

const promptTextareaClass = "border-0 shadow-none rounded-none focus-visible:ring-0 resize-none";
const promptGhostIcon = "h-7 w-7 cursor-pointer rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const promptModelTrigger = "h-7 max-w-[140px] rounded-md px-2 text-xs gap-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground truncate";

const PromptRun = ({
    name,
    label,
    value,
    required,
    onChange,
    defaultValue,
    rows = 6,
    before,
    after,
    wrapperClassName,
    className,
    onRunPrompt,
    renderAIUnavailable,
    variables,
    commands,
    attachments,
    actions,
    statusItems,
}: PromptRunBranchProps) => {
    const { handleChange, record } = useFormContext({ name });
    const theme = useTheme("prompt");
    const caption = label || name;
    const [editing, setEditing] = useState(false);
    const [templateText, setTemplateText] = useState(defaultValue?.value ?? '');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<{ file: File; objectUrl: string }[]>([]);
    const removeAttachment = React.useCallback((idx: number) => {
        setAttachedFiles((prev) => {
            URL.revokeObjectURL(prev[idx].objectUrl);
            return prev.filter((_, i) => i !== idx);
        });
    }, []);
    const [runStats, setRunStats] = useState<PromptRunStats | null>(null);
    const attachInputRef = useRef<HTMLInputElement>(null);
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

    const resolvedPreview = React.useMemo(() => {
        if (!templateText) return '';
        const merged = { ...(record as PromptVariables), ...variables };
        return PromptConf.parsePrompt(templateText, merged);
    }, [templateText, record, variables]);
    const hasVariableSubstitution = resolvedPreview !== templateText;

    const modelLabel = selectedModelRef
        ? (parseAIModelRef(selectedModelRef)?.model || selectedModelRef).split('/').pop() || selectedModelRef
        : null;

    const runHandler = async () => {
        const modelRef = value?.prompt?.model?.toString() || defaultModelRef;
        const parsed = parseAIModelRef(modelRef);
        const resolvedProvider = parsed
            ? (aiRegistry?.registry[parsed.provider] ?? ai ?? undefined)
            : (ai ?? undefined);
        const startMs = Date.now();
        try {
            const mergedData = { ...(record as PromptVariables), ...variables };
            const result = await runPrompt(value?.prompt as PromptOptions, mergedData, onRunPrompt, resolvedProvider);
            const durationMs = Date.now() - startMs;
            setRunError(null);
            handleChange?.({ target: { name: name + ".value", value: result } });
            if (statusItems && statusItems.length > 0) {
                const resolved = PromptConf.parsePrompt(value?.prompt?.value?.toString() ?? '', mergedData);
                const tokensIn = PromptUtils.countTokens(resolved);
                const tokensOut = PromptUtils.countTokens(result ?? '');
                const ctxPct = PromptUtils.contextPercent(tokensIn, modelRef);
                const estimatedCost = PromptUtils.estimateCost(tokensIn, tokensOut, modelRef);
                setRunStats({
                    tokensIn,
                    tokensOut,
                    contextPercent: ctxPct > 0 ? ctxPct : null,
                    model: modelRef,
                    durationMs,
                    estimatedCost: isFinite(estimatedCost) ? estimatedCost : null,
                });
            }
        } catch (error) {
            setRunError(getPromptRunErrorMessage(error));
        }
    };

    const getResultValue = (): string => {
        const fieldData = record?.[name];
        if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData)) {
            return String((fieldData as Record<string, unknown>).value ?? '');
        }
        return '';
    };

    const applyCommand = React.useCallback(async (cmd: PromptCommand) => {
        if (!cmd.handler) return;
        const current = getResultValue();
        const newValue = await cmd.handler(current);
        handleChange?.({ target: { name: name + ".value", value: newValue } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, handleChange, record]);

    const setField = (field: string, val: string) =>
        handleChange?.({ target: { name: field, value: val } } as React.ChangeEvent<HTMLInputElement>);

    return (
        <Wrapper className={wrapperClassName || theme.Prompt.wrapperClassName}>
            <div className="flex items-center gap-2">
                {before && <div className="shrink-0">{before}</div>}
                <div className={`${promptBodyClass} min-w-0 flex-1`}>
                    {caption && (
                        <PromptFieldHeader
                            htmlFor={fieldId}
                            label={editing ? `Prompt: ${caption}` : caption}
                            required={required}
                        />
                    )}
                    <div className={`group relative rounded-xl border border-input shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-offset-0 ${editing ? "focus-within:ring-warning" : "focus-within:ring-ring"}`}>
                        {/* Settings overlay — gear on hover (result) / X always visible (edit) */}
                        <button
                            type="button"
                            title={editing ? "Close prompt editor" : "Edit prompt settings"}
                            className={`absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md transition-all ${editing ? "bg-warning/10 text-warning opacity-100" : "bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground"}`}
                            onClick={() => setEditing((e) => !e)}
                        >
                            <Icon name={editing ? "x" : "settings"} size={13} />
                        </button>

                        <div className="overflow-hidden rounded-t-xl">
                            <div className={editing ? '' : 'hidden'}>
                                <TextArea
                                    id={fieldId}
                                    name={name + ".prompt.value"}
                                    defaultValue={defaultValue?.value}
                                    onChange={(params) => {
                                        setTemplateText(String(params.event.target.value ?? ''));
                                        onChange?.(params);
                                    }}
                                    required={true}
                                    inheritWrapperClassName={false}
                                    wrapperClassName=""
                                    className={`${className || theme.Prompt.className} ${promptTextareaClass}`}
                                    maxRows={rows}
                                />
                                {editing && hasVariableSubstitution && previewOpen && (
                                    <div className="border-t border-input px-4 py-3 bg-muted/20">
                                        <p className="whitespace-pre-wrap text-sm text-foreground/70">{resolvedPreview}</p>
                                    </div>
                                )}
                            </div>
                            <div className={editing ? 'hidden' : ''}>
                                {attachedFiles.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto border-b border-input px-3 py-2.5">
                                        {attachedFiles.map(({ file, objectUrl }, i) => (
                                            <div key={objectUrl} className="relative shrink-0">
                                                {file.type.startsWith('image/') ? (
                                                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-input bg-muted/30">
                                                        <img src={objectUrl} alt={file.name} className="h-full w-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-2.5 py-2 text-xs">
                                                        <Icon name="file-text" size={18} className="shrink-0 text-muted-foreground" />
                                                        <div className="max-w-[100px]">
                                                            <p className="truncate font-medium text-foreground">{file.name}</p>
                                                            <p className="text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow"
                                                    onClick={() => removeAttachment(i)}
                                                >
                                                    <Icon name="x" size={9} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <TextArea
                                    name={name + ".value"}
                                    onChange={(params) => {
                                        onChange?.(params);
                                    }}
                                    required={required}
                                    inheritWrapperClassName={false}
                                    wrapperClassName=""
                                    className={`${className || theme.Prompt.className} ${promptTextareaClass}`}
                                    maxRows={rows}
                                />
                            </div>
                        </div>

                        {/* Hidden file input for attachments */}
                        {attachments && (
                            <input
                                ref={attachInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newFiles = Array.from(e.target.files as FileList).map((file) => ({
                                            file,
                                            objectUrl: URL.createObjectURL(file),
                                        }));
                                        setAttachedFiles((prev) => [...prev, ...newFiles]);
                                        e.target.value = '';
                                    }
                                }}
                            />
                        )}

                        <div className="relative flex items-center gap-1 border-t border-input px-2 py-1 rounded-b-xl">

                            {/* Run-mode left: upload + slash + custom actions — separator before settings */}
                            {!editing && (attachments || (commands?.length ?? 0) > 0 || (actions?.length ?? 0) > 0) && (
                                <>
                                    {attachments && (
                                        <button
                                            type="button"
                                            title="Attach files"
                                            className={`${promptGhostIcon} flex items-center justify-center`}
                                            onClick={() => attachInputRef.current?.click()}
                                        >
                                            <Icon name="paperclip" size={13} />
                                        </button>
                                    )}
                                    {commands && commands.length > 0 && (
                                        <Dropdown
                                            trigger={{ icon: 'slash', title: 'Commands' }}
                                            placement="top"
                                            position="start"
                                            triggerClassName={`${promptGhostIcon} flex items-center justify-center`}
                                        >
                                            {commands.map((cmd) => (
                                                <DropdownItem
                                                    key={cmd.name}
                                                    icon={cmd.icon}
                                                    onClick={() => applyCommand(cmd)}
                                                >
                                                    <span className="font-medium">/{cmd.name}</span>
                                                    {cmd.description && (
                                                        <span className="ml-2 text-xs text-muted-foreground">{cmd.description}</span>
                                                    )}
                                                </DropdownItem>
                                            ))}
                                        </Dropdown>
                                    )}
                                    {actions?.map((action) =>
                                        action.content ? (
                                            <Dropdown
                                                key={action.key}
                                                trigger={{ icon: action.icon, title: action.label }}
                                                placement="top"
                                                position="start"
                                                triggerClassName={promptGhostIcon}
                                            >
                                                {action.key === 'tokenUsage' ? (
                                                    runStats ? (
                                                        <div className="px-3 py-2 text-xs space-y-1">
                                                            <p className="font-medium text-foreground">Token usage</p>
                                                            <p className="text-muted-foreground">Input: {runStats.tokensIn} tok</p>
                                                            <p className="text-muted-foreground">Output: {runStats.tokensOut} tok</p>
                                                            {runStats.contextPercent !== null && <p className="text-muted-foreground">Context: {runStats.contextPercent.toFixed(1)}%</p>}
                                                            {runStats.estimatedCost !== null && <p className="text-muted-foreground">Cost: ~${runStats.estimatedCost.toFixed(5)}</p>}
                                                            <p className="text-muted-foreground">Time: {(runStats.durationMs / 1000).toFixed(1)}s</p>
                                                        </div>
                                                    ) : (
                                                        <p className="px-3 py-2 text-xs text-muted-foreground">Run the prompt to see token usage.</p>
                                                    )
                                                ) : action.content}
                                            </Dropdown>
                                        ) : (
                                            <button
                                                key={action.key}
                                                type="button"
                                                title={action.label}
                                                className={`${promptGhostIcon} flex items-center justify-center`}
                                            >
                                                <Icon name={action.icon} size={13} />
                                            </button>
                                        )
                                    )}
                                    <div className="mx-1 h-4 w-px shrink-0 bg-border" />
                                </>
                            )}

                            {/* Run-mode settings: shown only when AI is available (no error) */}
                            {!editing && !runError && availability.configured && (
                                <>
                                    {/* Model */}
                                    <Dropdown
                                        trigger={{ icon: "cpu", text: modelLabel ?? "Model" }}
                                        placement="top"
                                        position="start"
                                        triggerClassName={promptModelTrigger}
                                    >
                                        <DropdownItem onClick={() => setField(name + ".prompt.model", "")}>
                                            Default
                                        </DropdownItem>
                                        {modelOptions.map((opt) => (
                                            <DropdownItem key={opt.value} onClick={() => setField(name + ".prompt.model", opt.value)}>
                                                {opt.label}
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>

                                    {/* Role */}
                                    <Dropdown trigger={{ icon: "user", title: "Role" }} placement="top" position="start" triggerClassName={promptGhostIcon}>
                                        <DropdownItem onClick={() => setField(name + ".prompt.role", "")}>Default ({promptDefaults.role})</DropdownItem>
                                        {PromptConf.getRoles().map((v) => (
                                            <DropdownItem key={v} onClick={() => setField(name + ".prompt.role", v)}>{v}</DropdownItem>
                                        ))}
                                    </Dropdown>

                                    {/* Language */}
                                    <Dropdown trigger={{ icon: "globe", title: "Language" }} placement="top" position="start" triggerClassName={promptGhostIcon}>
                                        <DropdownItem onClick={() => setField(name + ".prompt.language", "")}>Default ({promptDefaults.language})</DropdownItem>
                                        {PromptConf.getLangs().map((v) => (
                                            <DropdownItem key={v} onClick={() => setField(name + ".prompt.language", v)}>{v}</DropdownItem>
                                        ))}
                                    </Dropdown>

                                    {/* Voice */}
                                    <Dropdown trigger={{ icon: "mic", title: "Voice" }} placement="top" position="start" triggerClassName={promptGhostIcon}>
                                        <DropdownItem onClick={() => setField(name + ".prompt.voice", "")}>Default ({promptDefaults.voice})</DropdownItem>
                                        {PromptConf.getVoices().map((v) => (
                                            <DropdownItem key={v} onClick={() => setField(name + ".prompt.voice", v)}>{v}</DropdownItem>
                                        ))}
                                    </Dropdown>

                                    {/* Style */}
                                    <Dropdown trigger={{ icon: "feather", title: "Style" }} placement="top" position="start" triggerClassName={promptGhostIcon}>
                                        <DropdownItem onClick={() => setField(name + ".prompt.style", "")}>Default ({promptDefaults.style})</DropdownItem>
                                        {PromptConf.getStyles().map((v) => (
                                            <DropdownItem key={v} onClick={() => setField(name + ".prompt.style", v)}>{v}</DropdownItem>
                                        ))}
                                    </Dropdown>

                                    {/* Temperature */}
                                    {supportsTemperature && (
                                        <Dropdown trigger={{ icon: "thermometer", title: "Temperature" }} placement="top" position="start" triggerClassName={promptGhostIcon}>
                                            <DropdownItem>
                                                <Range name={name + ".prompt.temperature"} label="Temperature" defaultValue={defaultValue?.temperature} inheritWrapperClassName={false} min={0} max={1} step={0.1} />
                                            </DropdownItem>
                                        </Dropdown>
                                    )}
                                </>
                            )}

                            {/* Spacer — always pushes right-side items to the far right */}
                            <div className="flex-1" />

                            {/* Availability / run-error notice — right side, replaces slash button when present */}
                            {!editing && (runError || !availability.configured) && (
                                <span className="flex min-w-0 items-center gap-1 text-xs text-warning truncate mr-1">
                                    <Icon name="triangle-alert" size={13} className="shrink-0" />
                                    <span className="truncate">
                                        {runError ?? (availability.reason || "AI not configured")}
                                    </span>
                                </span>
                            )}

                            {/* Preview toggle — only in edit mode when variables produce substitutions */}
                            {editing && hasVariableSubstitution && (
                                <button
                                    type="button"
                                    title={previewOpen ? "Hide preview" : "Show resolved preview"}
                                    className={`${promptGhostIcon} flex items-center justify-center ${previewOpen ? "bg-muted text-foreground" : ""}`}
                                    onClick={() => setPreviewOpen((o) => !o)}
                                >
                                    <Icon name={previewOpen ? "eye-off" : "eye"} size={13} />
                                </button>
                            )}

                            {/* Run — icon only, hidden in edit mode */}
                            {!editing && (
                                <LoadingButton
                                    icon="send"
                                    loadingLabel=""
                                    disabled={runDisabled}
                                    title={runTitle ?? "Run prompt"}
                                    variant="primary"
                                    className="!p-0 h-8 w-8"
                                    onClick={runHandler}
                                />
                            )}
                        </div>

                        {/* Status strip — shown after a run when statusItems are configured */}
                        {statusItems && statusItems.length > 0 && runStats && !editing && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-b-xl border-t border-input/50 bg-muted/20 px-4 py-1.5 text-[11px] text-muted-foreground">
                                {statusItems.map((item) => {
                                    if (typeof item === 'string') {
                                        switch (item) {
                                            case 'tokensIn': return <span key="tokensIn">↑ {runStats.tokensIn} tok</span>;
                                            case 'tokensOut': return <span key="tokensOut">↓ {runStats.tokensOut} tok</span>;
                                            case 'contextPercent': return runStats.contextPercent !== null
                                                ? <span key="ctx">ctx {runStats.contextPercent.toFixed(1)}%</span>
                                                : null;
                                            case 'model': return <span key="model" className="font-mono">{(parseAIModelRef(runStats.model)?.model || runStats.model).split('/').pop()}</span>;
                                            case 'duration': return <span key="dur">{(runStats.durationMs / 1000).toFixed(1)}s</span>;
                                            default: return null;
                                        }
                                    }
                                    return <span key={item.key}>{item.render(runStats)}</span>;
                                })}
                                {runStats.estimatedCost !== null && !statusItems.some((i) => typeof i === 'object' && i.key === 'cost') && (
                                    <span className="ml-auto font-mono">~${runStats.estimatedCost.toFixed(5)}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {after && <div className="shrink-0">{after}</div>}
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
    before,
    after,
    wrapperClassName,
    className,
    renderFallback,
}: PromptPlainFallbackProps) => {
    const theme = useTheme("prompt");
    const disabledId = useId();

    return (
        <Wrapper className={wrapperClassName || theme.Prompt.wrapperClassName}>
            <div className="flex items-center gap-2">
                {before && <div className="shrink-0">{before}</div>}
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
                                id={disabledId}
                                className={className || theme.Prompt.className}
                                name={name + ".value"}
                                onChange={onChange}
                                required={required}
                                inheritWrapperClassName={false}
                                wrapperClassName=""
                                maxRows={rows}
                            />
                        </div>
                    )}
                </div>
                {after && <div className="shrink-0">{after}</div>}
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

