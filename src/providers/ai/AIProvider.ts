import type { PromptVariables } from '../../conf/Prompt';
import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface AIModelDescriptor {
    id: string;
    provider: string;
    model: string;
    label: string;
    deprecated?: boolean;
}

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
