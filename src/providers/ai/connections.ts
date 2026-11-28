// The AI connections of an app (CR-134): what is connected, as the page `AIConnections` shows it, and the port
// the app implements to keep them. Secrets stay where the app keeps them (its server, a protected database): the
// page sends them once to `connect`/`addAccount` and never reads them back.

import type { AIDataRegion, AIModelDescriptor } from './AIProvider';
import type { ProviderCredentialField } from '../ProviderDescriptor';

/** One account of a provider (one of its keys; for a subscription, one subscription). Never the secret. */
export interface AIConnectionAccount {
    id: string;
    label?: string;
    /** ISO date it was added. */
    at?: string;
}

/** A connected provider, as the page may know it: never its key. */
export interface AIProviderConnectionView {
    id: string;
    label?: string;
    at?: string;
    /** The fields that are not secret, to show them again (account id, endpoint, project, location). */
    fields?: Record<string, string>;
    /** Its accounts in the order they are tried; absent: one key. */
    accounts?: AIConnectionAccount[];
}

/** An account out of credit now, and until when (ISO). */
export interface AIConnectionExhausted {
    provider: string;
    account?: string;
    until: string;
}

export interface AIConnectionsSnapshot {
    providers: AIProviderConnectionView[];
    /** The order of the providers the agents try: the list (providers and connectors) and whether a person chose it. */
    order?: { list: string[]; manual: boolean };
    exhausted?: AIConnectionExhausted[];
}

export type AIConnectionResult = { ok: true } | { ok: false; error?: string };

/**
 * The port of the connections, implemented by the app (CR-134). `connect` and `addAccount` check the credentials
 * with the provider before they keep them and say why not; the other methods are optional: the page offers what
 * the store can do.
 */
export interface AIConnectionStore {
    load(): Promise<AIConnectionsSnapshot>;
    /** Live updates (another tab, another person); absent: the page loads again after each change. */
    subscribe?(listener: (snapshot: AIConnectionsSnapshot) => void): () => void;
    connect(provider: string, fields: Record<string, string>): Promise<AIConnectionResult>;
    disconnect(provider: string): Promise<void>;
    addAccount?(provider: string, fields: Record<string, string>): Promise<AIConnectionResult>;
    removeAccount?(provider: string, accountId: string): Promise<void>;
    orderAccounts?(provider: string, accountIds: string[]): Promise<void>;
    /** CR-157: a new name for an account (absent: the accounts cannot be renamed). */
    renameAccount?(provider: string, accountId: string, label: string): Promise<void>;
    /** `null`: back to the automatic order. */
    setOrder?(order: string[] | null): Promise<void>;
    /** The models of a connected provider, with their data region and price. */
    models?(provider: string): Promise<AIModelDescriptor[]>;
}

/**
 * A connector of the app, next to the AI providers (CR-134): typically a subscription that runs on a runner
 * (Claude Code, opencode), with its own way to sign in. A form of `fields` (e.g. where the runner is and how to
 * reach it, so that two apps can share one runner) and `connect`; or `render` for a flow of its own.
 */
export interface AIConnector {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    /** Listed with the subscriptions (default) or with the providers paid by use. */
    group?: 'subscription' | 'usage';
    connected: boolean;
    /** CR-157: how many connections it has, for its box (default 1 when connected). */
    count?: number;
    fields?: ProviderCredentialField[];
    /** The saved values of the fields that are not secret, shown again. */
    values?: Record<string, string>;
    connect?(fields: Record<string, string>): Promise<AIConnectionResult>;
    disconnect?(): Promise<void>;
    /** The content of its modal instead of the form: its own sign-in, its accounts. */
    render?(context: { close: () => void }): unknown;
}

/** The data region the app prefers for its models (CR-134): `recommend` warns about the others, `require` refuses them. */
export interface AIRegionRule {
    preferred: AIDataRegion;
    mode?: 'recommend' | 'require';
}

/** Whether a model may be used under the app's region rule. */
export function isModelInRegion(model: Pick<AIModelDescriptor, 'dataRegion'>, rule?: AIRegionRule): boolean {
    if (!rule) return true;
    return (model.dataRegion ?? 'unknown') === rule.preferred;
}
