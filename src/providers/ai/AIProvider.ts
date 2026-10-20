import type { PromptVariables } from '../../conf/Prompt';
import type { ProviderConfigurable } from '../ProviderConfiguration';
import type { BuiltInAIProviderId } from './shared';

/** Token prices of a model, in `currency` per 1M tokens. `input === 0 && output === 0` means
 * the model is free. */
export interface AIModelPricing {
    input: number;
    output: number;
    currency: 'USD';
    /** Where the price comes from: the provider's own model listing, or the models.dev catalog. */
    source: 'provider' | 'models.dev';
}

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
}

export const isFreeAIModel = (model: Pick<AIModelDescriptor, 'pricing'>): boolean =>
    model.pricing !== undefined && model.pricing.input === 0 && model.pricing.output === 0;

export interface AIProviderCapabilities {
    models: AIModelDescriptor[];
    supportsTemperature?: boolean;
    supportsVision?: boolean;
    supportsDocuments?: boolean;
}

export interface AIAttachment {
    mimeType: string;
    base64: string;
    name?: string;
}

export interface AIRequestOptions {
    language?: string;
    voice?: string;
    style?: string;
    role?: string;
    model?: string;
    temperature?: number;
    attachments?: AIAttachment[];
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
}

/** Esito di una chiamata completate — testo semplice, oppure una o più richieste di tool
 * call (eventualmente accompagnate da testo, quando il modello commenta prima di invocare). */
export type AICompleteResult =
    | { type: 'text'; text: string }
    | { type: 'tool_calls'; toolCalls: AIToolCall[]; text?: string };

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

/** A server-held credential never reaches the browser: the client registry stores this opaque
 * placeholder instead of the real key and @llmnative/react/server swaps it for the secret of
 * the matching scope + provider just before the request leaves the server. The value is a plain
 * string so it survives the existing wire format unchanged (Bearer header, x-api-key, `?key=`). */
export const SERVER_CREDENTIAL_PREFIX = 'llmnative-server-credential';

const SCOPE_OR_PROVIDER = '[A-Za-z0-9_.-]+';
const SERVER_CREDENTIAL_EXACT = new RegExp(`^${SERVER_CREDENTIAL_PREFIX}:(${SCOPE_OR_PROVIDER}):(${SCOPE_OR_PROVIDER})$`);
const SERVER_CREDENTIAL_SCAN = new RegExp(`${SERVER_CREDENTIAL_PREFIX}:(${SCOPE_OR_PROVIDER}):(${SCOPE_OR_PROVIDER})`, 'g');

export type AIServerCredentialRef = {
    scope: string;
    provider: string;
};

/** Builds the placeholder a browser-side registry sends in place of a real provider key. */
export const buildServerCredentialPlaceholder = (scope: string, provider: string): string =>
    `${SERVER_CREDENTIAL_PREFIX}:${scope}:${provider}`;

/** Parses a string that is *exactly* a placeholder; returns null for any other value (including
 * a real key that happens to contain the prefix). */
export const parseServerCredentialPlaceholder = (value: string): AIServerCredentialRef | null => {
    const match = SERVER_CREDENTIAL_EXACT.exec(value);
    return match ? { scope: match[1], provider: match[2] } : null;
};

export const isServerCredentialPlaceholder = (value: string): boolean =>
    parseServerCredentialPlaceholder(value) !== null;

/** True when the value *contains* a placeholder somewhere inside it (e.g. inside an
 * `Authorization: Bearer …` header or a `?key=…` query string), not just when it is one. */
export const containsServerCredential = (value: string): boolean =>
    value.includes(`${SERVER_CREDENTIAL_PREFIX}:`);

/** Replaces every placeholder found in `value`, delegating the actual secret lookup to
 * `resolve`. The callback returns the replacement literally (no `$` expansion). */
export const replaceServerCredentialPlaceholders = (
    value: string,
    resolve: (ref: AIServerCredentialRef) => string,
): string => value.replace(SERVER_CREDENTIAL_SCAN, (_match, scope: string, provider: string) =>
    resolve({ scope, provider }));

/** Fixed hostnames of each built-in adapter's upstream API. `openai-compatible` is absent on
 * purpose: its endpoint is user-supplied, so it must be whitelisted by the caller (see
 * resolveServerCredentials options). */
export type AIProviderHosts = Partial<Record<BuiltInAIProviderId, readonly string[]>>;

export const aiProviderHosts: AIProviderHosts = {
    openai: ['api.openai.com'],
    openrouter: ['openrouter.ai'],
    opencode: ['opencode.ai'],
    deepseek: ['api.deepseek.com'],
    gemini: ['generativelanguage.googleapis.com'],
    anthropic: ['api.anthropic.com'],
    mistral: ['api.mistral.ai'],
    glm: ['open.bigmodel.cn'],
    groq: ['api.groq.com'],
    cloudflare: ['api.cloudflare.com'],
};

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
