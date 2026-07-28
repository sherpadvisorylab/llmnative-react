import React, { useEffect, useId, useState } from 'react';
import { useTheme } from "../../Theme";
import { useI18n, interpolate } from "../../I18n";
import { Prompt as PromptConf, PromptVariables, PROMPT_CLEANUP, PROMPT_NO_REFERENCE } from '../../conf/Prompt';
import { type AIProviderCapabilities, type AIProviderAdapter, type AIRequestOptions, type AIAttachment, parseAIModelRef, formatAIModelRef } from '../../providers/ai/AIProvider';
import { useAIProvider, useAIProviderRegistry } from '../../providers/ai/AIProviderContext';
import { getAIModelCatalog } from '../../providers/ai/shared';
import { RecordProps } from '../../providers/data/DataProvider';
import { getProviderConfigurationState } from '../../providers/ProviderConfiguration';
import Alert from '../ui/Alert';
import Icon from '../ui/Icon';
import { type EditorCommand } from '../ui/fields/ContextMenu';
import { Wrapper } from '../ui/GridSystem';
import { Label, Switch, TextArea } from '../ui/fields/Input';
import { FormFieldProps, useFormContext } from './Form';
import { PromptUtils } from '../../libs/promptUtils';
import { Chatbot, type ChatbotAction, type ChatbotSubmitPayload } from './Chatbot';

export enum PromptMode {
    EDIT = "edit",
    RUN = "run",
}

/** Alias mantenuto per compatibilità pubblica — la vera definizione vive ora in
 * `Chatbot.tsx` (CR-071), da cui `PromptRun` la eredita passandola a `<Chatbot actions>`. */
export type PromptAction = ChatbotAction;

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

interface PromptFieldBase {
    name: string;
    label?: string;
    required?: boolean;
    onChange?: FormFieldProps["onChange"];
    before?: React.ReactNode;
    after?: React.ReactNode;
    wrapperClassName?: string;
    className?: string;
    minHeight?: number;
    maxHeight?: number;
}

interface PromptWithAI extends PromptFieldBase {
    defaultValue?: PromptDefaultValue;
    renderAIUnavailable?: RenderAIUnavailable;
}

interface PromptEditorProps extends PromptWithAI {
    value?: RecordProps & { prompt?: PromptConfig };
}

interface PromptRunProps extends PromptWithAI {
    value?: RecordProps & { prompt?: PromptConfig };
    variables?: PromptVariables;
    onRunPrompt?: OnRunPrompt;
    renderFallback?: RenderPlainFallback;
    commands?: EditorCommand[];
    commandsTrigger?: string;
    attachments?: boolean;
    actions?: PromptAction[];
    statusItems?: PromptStatusItem[];
}

interface PromptPlainFallbackProps extends PromptFieldBase {
    renderFallback?: RenderPlainFallback;
}

type PromptEditBranch = PromptEditorProps & { mode?: PromptMode.EDIT };
type PromptRunBranch = PromptRunProps & { mode: PromptMode.RUN };
export type PromptProps = PromptEditBranch | PromptRunBranch;


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

const promptBodyClass = "space-y-2";
const promptHeaderClass = "flex items-center justify-between gap-3";
const promptTitleClass = "mb-0 min-w-0 text-sm font-medium leading-5 text-foreground";
const promptActionClass = "ml-auto shrink-0";
const getFallbackModelOptions = (): Array<{ label: string; value: string }> => [];
const getPromptRunErrorMessage = (error: unknown, fallback = "Prompt execution failed.") => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') {
        if ('reason' in error && typeof error.reason === 'string') return error.reason;
        if ('error' in error && typeof error.error === 'string') return error.error;
        if ('message' in error && typeof error.message === 'string') return error.message;
    }
    return fallback;
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
            reason: undefined,
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
    const dict = useI18n('prompt');
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
                ? (availability.reason || dict.aiNotConfiguredEdit)
                : (availability.reason || dict.aiNotConfiguredRun)}
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

const getPromptToggleTitle = (enabled: boolean, dict: { toggleOnTitle: string; toggleOffTitle: string }) =>
    enabled ? dict.toggleOnTitle : dict.toggleOffTitle;

const PromptEditor = ({
    name,
    label = undefined,
    value = undefined,
    required = false,
    onChange = undefined,
    defaultValue = undefined,
    minHeight = 160,
    maxHeight = 240,
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    renderAIUnavailable = undefined
}: PromptEditorProps) => {
    const { handleChange } = useFormContext({ name });
    const theme = useTheme("prompt");
    const dict = useI18n('prompt');
    const caption = label || name;
    const promptEnabled = isPromptEnabled(value?.prompt?.enabled, defaultValue?.enabled, value?.prompt);
    const switchTitle = getPromptToggleTitle(promptEnabled, dict);
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
                        label={promptEnabled ? dict.promptLabel + caption : caption}
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
                        minHeight={minHeight}
                        maxHeight={maxHeight}
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

const buildPromptOptions = (
    promptConfig: PromptConfig | undefined,
    defaults: PromptDefaultValue | undefined,
): PromptOptions => ({
    value: String(promptConfig?.value ?? defaults?.value ?? ''),
    role: String(promptConfig?.role ?? defaults?.role ?? ''),
    language: String(promptConfig?.language ?? defaults?.language ?? ''),
    voice: String(promptConfig?.voice ?? defaults?.voice ?? ''),
    style: String(promptConfig?.style ?? defaults?.style ?? ''),
    model: String(promptConfig?.model ?? defaults?.model ?? ''),
    temperature: typeof promptConfig?.temperature === 'number'
        ? promptConfig.temperature
        : defaults?.temperature,
});

const PromptRun = ({
    name,
    label,
    value,
    required,
    onChange,
    defaultValue,
    minHeight = 120,
    maxHeight = 160,
    before,
    after,
    wrapperClassName,
    className,
    onRunPrompt,
    renderAIUnavailable,
    variables,
    commands,
    commandsTrigger,
    attachments,
    actions,
    statusItems,
}: PromptRunProps) => {
    const { handleChange, record } = useFormContext({ name });
    const theme = useTheme("prompt");
    const dict = useI18n('prompt');
    const caption = label || name;
    const [editing, setEditing] = useState(false);
    const [templateText, setTemplateText] = useState(defaultValue?.value ?? '');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [runStats, setRunStats] = useState<PromptRunStats | null>(null);
    const ai = useAIProvider();
    const aiRegistry = useAIProviderRegistry();
    const defaultModelRef = (typeof localStorage !== 'undefined' && localStorage.getItem('prompt.model'))
        || (ai ? formatAIModelRef(ai.id, ai.defaultModel) : '');
    const { modelOptions } = usePromptCapabilities();
    const resolvedPromptOptions = React.useMemo(
        () => buildPromptOptions(value?.prompt, defaultValue),
        [defaultValue, value?.prompt],
    );

    const selectedModelRef = resolvedPromptOptions.model || defaultModelRef;
    const fieldId = useId();
    const availability = usePromptAvailability(selectedModelRef, Boolean(onRunPrompt));
    const runDisabled = !availability.configured;
    const [runError, setRunError] = useState<string | null>(null);
    const customUnavailableNotice = !runError && !availability.configured
        ? renderAIUnavailable?.({
            mode: PromptMode.RUN,
            providerId: availability.providerId,
            reason: availability.reason,
            configured: availability.configured,
        })
        : null;

    const resolvedPreview = React.useMemo(() => {
        if (!templateText) return '';
        const merged = { ...(record as PromptVariables), ...variables };
        return PromptConf.parsePrompt(templateText, merged);
    }, [templateText, record, variables]);
    const hasVariableSubstitution = resolvedPreview !== templateText;

    const setField = (field: string, val: string) =>
        handleChange?.({ target: { name: field, value: val } } as React.ChangeEvent<HTMLInputElement>);

    // Il built-in "tokenUsage" (CR-047) auto-compila il proprio content da runStats — un
    // concetto specifico di Prompt (single-shot, un solo run alla volta), mai qualcosa che
    // Chatbot deve sapere. Ogni altra action passa invariata.
    const resolvedActions: ChatbotAction[] | undefined = actions?.map((action) => (
        action.key === 'tokenUsage' && !action.content
            ? {
                ...action,
                content: runStats ? (
                    <div className="px-3 py-2 text-xs space-y-1">
                        <p className="font-medium text-foreground">{dict.tokenUsage}</p>
                        <p className="text-muted-foreground">{interpolate(dict.tokenInput, { count: String(runStats.tokensIn) })}</p>
                        <p className="text-muted-foreground">{interpolate(dict.tokenOutput, { count: String(runStats.tokensOut) })}</p>
                        {runStats.contextPercent !== null && <p className="text-muted-foreground">{interpolate(dict.tokenContext, { percent: runStats.contextPercent.toFixed(1) })}</p>}
                        {runStats.estimatedCost !== null && <p className="text-muted-foreground">{interpolate(dict.tokenCost, { amount: runStats.estimatedCost.toFixed(5) })}</p>}
                        <p className="text-muted-foreground">{interpolate(dict.tokenTime, { seconds: (runStats.durationMs / 1000).toFixed(1) })}</p>
                    </div>
                ) : (
                    <p className="px-3 py-2 text-xs text-muted-foreground">{dict.tokenUsageEmpty}</p>
                ),
            }
            : action
    ));

    // Riceve il pacchetto già risolto da Chatbot (testo, allegati grezzi, modello, tono) e
    // applica la "politica" di Prompt: esegue SEMPRE il template autorato
    // (resolvedPromptOptions), mai il testo visibile nella textarea — la stessa logica di
    // runHandler pre-estrazione, solo i dati arrivano da payload invece che da closure
    // locali (attachedFiles/selectedModelRef letti direttamente).
    const handleChatbotSubmit = async (payload: ChatbotSubmitPayload) => {
        const modelRef = payload.model || selectedModelRef || defaultModelRef;
        const parsed = parseAIModelRef(modelRef);
        const resolvedProvider = parsed
            ? (aiRegistry?.registry[parsed.provider] ?? ai ?? undefined)
            : (ai ?? undefined);
        const startMs = Date.now();
        try {
            const mergedData = { ...(record as PromptVariables), ...variables };
            const fileAttachments = await Promise.all(
                payload.files.map((file) => PromptUtils.fileToAttachment(file))
            );
            const result = await runPrompt(
                {
                    ...resolvedPromptOptions,
                    model: modelRef,
                    role: payload.role ?? resolvedPromptOptions.role,
                    voice: payload.voice ?? resolvedPromptOptions.voice,
                    style: payload.style ?? resolvedPromptOptions.style,
                    language: payload.language ?? resolvedPromptOptions.language,
                    temperature: payload.temperature ?? resolvedPromptOptions.temperature,
                },
                mergedData,
                onRunPrompt,
                resolvedProvider,
                fileAttachments.length > 0 ? fileAttachments : undefined,
                { noProvider: dict.noProvider, noResponse: dict.noResponse },
            );
            const durationMs = Date.now() - startMs;
            setRunError(null);
            handleChange?.({ target: { name: name + ".value", value: result } });
            // Persiste tono/lingua/voce/stile scelti nel composer al momento dell'uso —
            // non a ogni apertura del dropdown, solo quando davvero consumati da un run.
            if (payload.role !== undefined) setField(name + ".prompt.role", payload.role);
            if (payload.voice !== undefined) setField(name + ".prompt.voice", payload.voice);
            if (payload.style !== undefined) setField(name + ".prompt.style", payload.style);
            if (payload.language !== undefined) setField(name + ".prompt.language", payload.language);
            if (statusItems && statusItems.length > 0) {
                const resolved = PromptConf.parsePrompt(resolvedPromptOptions.value ?? '', mergedData);
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
            setRunError(getPromptRunErrorMessage(error, dict.runFailed));
        }
    };

    return (
        <Wrapper className={wrapperClassName || theme.Prompt.wrapperClassName}>
            <div className="flex items-center gap-2">
                {before && <div className="shrink-0">{before}</div>}
                <div className={`${promptBodyClass} min-w-0 flex-1`}>
                    {caption && (
                        <PromptFieldHeader
                            htmlFor={fieldId}
                            label={editing ? `${dict.promptLabel}${caption}` : caption}
                            required={required}
                        />
                    )}
                    <div className="group relative">
                        {/* Settings overlay — gear on hover (result) / X always visible (edit) */}
                        <button
                            type="button"
                            title={editing ? dict.closeEditor : dict.editSettings}
                            className={`absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md transition-all ${editing ? "bg-warning/10 text-warning opacity-100" : "bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground"}`}
                            onClick={() => setEditing((e) => !e)}
                        >
                            <Icon name={editing ? "x" : "settings"} size={13} />
                        </button>

                        {editing ? (
                            <div className="overflow-hidden rounded-xl border border-input shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-warning focus-within:ring-offset-0">
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
                                    minHeight={minHeight}
                                    maxHeight={maxHeight}
                                />
                                {hasVariableSubstitution && previewOpen && (
                                    <div className="border-t border-input px-4 py-3 bg-muted/20">
                                        <p className="whitespace-pre-wrap text-sm text-foreground/70">{resolvedPreview}</p>
                                    </div>
                                )}
                                {hasVariableSubstitution && (
                                    <div className="flex items-center justify-end border-t border-input px-2 py-1">
                                        <button
                                            type="button"
                                            title={previewOpen ? dict.hidePreview : dict.showPreview}
                                            className={`${promptGhostIcon} flex items-center justify-center ${previewOpen ? "bg-muted text-foreground" : ""}`}
                                            onClick={() => setPreviewOpen((o) => !o)}
                                        >
                                            <Icon name={previewOpen ? "eye-off" : "eye"} size={13} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Chatbot
                                    name={name + ".value"}
                                    value={value?.value !== undefined ? String(value.value) : ''}
                                    onChange={(text) => {
                                        handleChange?.({ target: { name: name + ".value", value: text } });
                                        onChange?.({
                                            event: { target: { name: name + '.value', value: text } } as React.ChangeEvent<HTMLTextAreaElement>,
                                            name: name + '.value',
                                            value: text,
                                            record: record ?? {},
                                            onChange: handleChange ?? (() => {}),
                                        });
                                    }}
                                    disabled={runDisabled}
                                    onSubmit={(payload) => { void handleChatbotSubmit(payload); }}
                                    attachments={attachments}
                                    commands={commands}
                                    commandsTrigger={commandsTrigger}
                                    models={modelOptions}
                                    selectedModel={selectedModelRef}
                                    onModelChange={(id) => setField(name + ".prompt.model", id)}
                                    showSettings
                                    defaultRole={resolvedPromptOptions.role}
                                    defaultVoice={resolvedPromptOptions.voice}
                                    defaultStyle={resolvedPromptOptions.style}
                                    defaultLanguage={resolvedPromptOptions.language}
                                    defaultTemperature={resolvedPromptOptions.temperature}
                                    actions={resolvedActions}
                                    minHeight={minHeight}
                                    maxHeight={maxHeight}
                                    className={className || theme.Prompt.className}
                                    wrapperClassName=""
                                />

                                {(runError || !availability.configured) && (
                                    customUnavailableNotice ? (
                                        <div className="mt-1">{customUnavailableNotice}</div>
                                    ) : (
                                        <span className="mt-1 flex min-w-0 items-center gap-1 text-xs text-warning">
                                            <Icon name="triangle-alert" size={13} className="shrink-0" />
                                            <span className="truncate">
                                                {runError ?? (availability.reason || dict.aiNotConfiguredShort)}
                                            </span>
                                        </span>
                                    )
                                )}

                                {statusItems && statusItems.length > 0 && runStats && (
                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-lg border border-input/50 bg-muted/20 px-4 py-1.5 text-[11px] text-muted-foreground">
                                        {statusItems.map((item) => {
                                            if (typeof item === 'string') {
                                                switch (item) {
                                                    case 'tokensIn': return <span key="tokensIn">{interpolate(dict.tokenInput, { count: runStats.tokensIn })}</span>;
                                                    case 'tokensOut': return <span key="tokensOut">{interpolate(dict.tokenOutput, { count: runStats.tokensOut })}</span>;
                                                    case 'contextPercent': return runStats.contextPercent !== null
                                                        ? <span key="ctx">{interpolate(dict.tokenContext, { percent: runStats.contextPercent.toFixed(1) })}</span>
                                                        : null;
                                                    case 'model': return <span key="model" className="font-mono">{(parseAIModelRef(runStats.model)?.model || runStats.model).split('/').pop()}</span>;
                                                    case 'duration': return <span key="dur">{interpolate(dict.tokenTime, { seconds: (runStats.durationMs / 1000).toFixed(1) })}</span>;
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
                            </>
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
    minHeight = 96,
    maxHeight = 120,
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
                                minHeight={minHeight}
                                maxHeight={maxHeight}
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
    provider?: AIProviderAdapter,
    attachments?: AIAttachment[],
    messages?: { noProvider?: string; noResponse?: string },
): Promise<string> => {
    const { value: promptText, model: modelRef, ...requestOptions } = options ?? {};

    if (onRunPrompt) {
        return onRunPrompt(promptText, { ...requestOptions, model: modelRef, attachments }, data);
    }

    if (!promptText) return '';
    if (!provider) {
        throw new Error(messages?.noProvider ?? "No AI provider is available for this prompt.");
    }

    const parsed = parseAIModelRef(modelRef);
    const model = parsed?.model || modelRef || provider.defaultModel;

    const response = await provider.complete({
        ...requestOptions,
        model,
        prompt: [PROMPT_CLEANUP, promptText, PROMPT_NO_REFERENCE].join('\n'),
        data,
        attachments,
    });

    if (response?.type !== 'text' || !response.text.trim()) {
        throw new Error(messages?.noResponse ?? "The AI provider returned no response.");
    }

    return response.text;
};

export default Prompt;

