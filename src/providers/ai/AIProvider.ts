import type { PromptVariables } from '../../conf/Prompt';
import type { ProviderConfigurable } from '../ProviderConfiguration';

/** Token prices of a model, in `currency` per 1M tokens. `input === 0 && output === 0` means
 * the model is free. */
export interface AIModelPricing {
    input: number;
    output: number;
    currency: 'USD';
    /** Where the price comes from: the provider's own model listing, or the models.dev catalog. */
    source: 'provider' | 'models.dev';
}

/**
 * Where a model processes the data sent to it (CR-132): `eu`, `us`, `global` (no residency guarantee), a
 * cloud region id (e.g. `asia-northeast1`), or `unknown` when the provider does not declare it. Only what the
 * provider's endpoint guarantees, never a guess.
 */
export type AIDataRegion = 'eu' | 'us' | 'global' | 'unknown' | (string & {});

/** How a model gives a structured answer (CR-132): with the provider's own mode, or instructed in the prompt. */
export type AIStructuredOutputMode = 'native' | 'prompted';

export interface AIModelDescriptor {
    id: string;
    provider: string;
    model: string;
    label: string;
    /** Display name of the provider (e.g. 'OpenRouter'), for grouping models by provider. */
    providerLabel?: string;
    deprecated?: boolean;
    /** Absent = price not found (neither in the provider listing nor on models.dev). */
    pricing?: AIModelPricing;
    /** Where it processes the data (CR-132); absent means `unknown`. */
    dataRegion?: AIDataRegion;
    /** How it gives a structured answer (CR-132): every model gives one, natively or instructed. */
    structuredOutput?: AIStructuredOutputMode;
}

export const isFreeAIModel = (model: Pick<AIModelDescriptor, 'pricing'>): boolean =>
    model.pricing !== undefined && model.pricing.input === 0 && model.pricing.output === 0;

export interface AIProviderCapabilities {
    models: AIModelDescriptor[];
    supportsTemperature?: boolean;
    supportsVision?: boolean;
    supportsDocuments?: boolean;
    /** How the models of the provider give a structured answer (CR-132). */
    structuredOutput?: AIStructuredOutputMode;
    /** Where the provider processes the data (CR-132), as its endpoint guarantees; absent means `unknown`. */
    dataRegion?: AIDataRegion;
}

export interface AIAttachment {
    mimeType: string;
    base64: string;
    name?: string;
}

/** How much a model reasons before it answers (CR-122). */
export type AIReasoningLevel = 'low' | 'medium' | 'high' | 'max';

export interface AIRequestOptions {
    language?: string;
    voice?: string;
    style?: string;
    role?: string;
    model?: string;
    temperature?: number;
    attachments?: AIAttachment[];
    /**
     * How much the model reasons (CR-122), on the models that take it: Anthropic `output_config.effort`
     * (Claude 4.6 and later), OpenAI `reasoning_effort` (o-series, GPT-5; `max` as `high`), OpenRouter
     * `reasoning.effort`. Elsewhere (older models, Gemini) nothing is sent. Absent: the default of the model.
     */
    reasoning?: AIReasoningLevel;
}

/** Definizione di un tool che il modello può scegliere di invocare — la SDK del provider
 * riceve solo questa forma (JSON-serializzabile); l'implementazione vera resta lato
 * chiamante (mai inviata al provider). Vedi AICompleteResult per come il modello segnala
 * una richiesta di invocazione. */
export interface AIToolDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}

/** Richiesta del modello di invocare un tool con questi argomenti — il chiamante esegue
 * `name` localmente e rimanda il risultato come AIToolResult nel turno successivo. */
export interface AIToolCall {
    id: string;
    name: string;
    input: Record<string, unknown>;
}

/** Esito dell'esecuzione locale di un tool, da rimandare al modello nel turno successivo. */
export interface AIToolResult {
    toolCallId: string;
    name: string;
    output: unknown;
    isError?: boolean;
}

/** Un turno della conversazione precedente a quello corrente — passato via
 * `AICompleteRequest.history` per continuare una chat multi-turno (es. l'utente affina una
 * richiesta AI già eseguita, o il modello ha invocato un tool e ne riceve il risultato). */
export type AIConversationTurn =
    | { role: 'user'; content: string }
    | { role: 'assistant'; content?: string; toolCalls?: AIToolCall[] }
    | { role: 'tool_result'; results: AIToolResult[] };

/**
 * The structured answer a project asks for (CR-132): a JSON Schema the answer must follow. The result then
 * carries `data`, already validated; an answer that does not follow it, even after one correction, is an
 * `AIOutputError`.
 */
export interface AIStructuredOutput {
    schema: Record<string, unknown>;
    /** A short name of the answer (e.g. `lead_classification`), for the providers that want one. */
    name?: string;
    /** What the answer is, for the model. */
    description?: string;
}

/** The tokens a call used, as the provider reports them. */
export interface AIUsage {
    inputTokens: number;
    outputTokens: number;
}

export interface AICompleteRequest extends AIRequestOptions {
    prompt: string;
    data?: PromptVariables;
    /** Turni precedenti della conversazione — assente = primo turno (solo `prompt`). */
    history?: AIConversationTurn[];
    /** Tool che il modello può invocare a sua discrezione in questo turno. */
    tools?: AIToolDefinition[];
    /** Annulla la richiesta in corso (es. un bottone "interrompi" lato chiamante). */
    signal?: AbortSignal;
    /** Id stabile per l'intera conversazione (generato una volta da chi possiede la sessione,
     * es. useAgent — mai dal provider), trasportato come header `x-llmnative-log-id` verso il
     * proxy dev di Vite: se il logging file è abilitato (`createProxyPlugin` con
     * `ProxyLogOptions.enabled`), il proxy accoda request/response di OGNI turno con questo id
     * allo stesso file — un file per conversazione. Assente = nessun logging per questa
     * chiamata, comportamento identico a oggi. */
    logId?: string;
    /** The structured answer the project wants (CR-132). Not with `tools`. */
    output?: AIStructuredOutput;
    /** The most tokens of the answer; absent: the provider's default (Anthropic: 4096). */
    maxOutputTokens?: number;
}

/** Esito di una chiamata completate — testo semplice, oppure una o più richieste di tool
 * call (eventualmente accompagnate da testo, quando il modello commenta prima di invocare). */
export type AICompleteResult =
    | { type: 'text'; text: string; /** The structured answer (CR-132), when `output` was asked: valid against its schema. */ data?: unknown; usage?: AIUsage }
    | { type: 'tool_calls'; toolCalls: AIToolCall[]; text?: string; usage?: AIUsage };

/** A structured answer that does not follow its schema, after one correction (CR-132). Holds no prompt and no answer. */
export class AIOutputError extends Error {
    readonly code = 'invalid-output' as const;
    constructor(readonly provider: string, readonly errors: string[]) {
        super(`${provider}: the answer does not follow the schema (${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '; …' : ''})`);
        this.name = 'AIOutputError';
    }
}

export interface AIKeyValidationResult {
    valid: boolean;
    /** Human-readable error from the provider API (e.g. "Incorrect API key provided"). */
    error?: string;
    /** URL to the provider's API key management page, for showing in UI. */
    dashboardUrl?: string;
}

export interface AIProviderAdapter extends ProviderConfigurable {
    id: string;
    label: string;
    defaultModel: string;
    /** URL to the provider's API key management page. */
    dashboardUrl?: string;
    getCapabilities(forceRefresh?: boolean): Promise<AIProviderCapabilities>;
    complete(request: AICompleteRequest): Promise<AICompleteResult | null>;
    /** Makes a live API call to verify the key is accepted. Never uses cache. */
    validateApiKey(): Promise<AIKeyValidationResult>;
}

export interface AIModelRef {
    provider: string;
    model: string;
}

export const formatAIModelRef = (provider: string, model: string): string => `${provider}/${model}`;

export const parseAIModelRef = (value?: string | null): AIModelRef | null => {
    if (!value) return null;

    const separator = value.indexOf('/');
    if (separator <= 0 || separator === value.length - 1) return null;

    return {
        provider: value.slice(0, separator),
        model: value.slice(separator + 1),
    };
};
