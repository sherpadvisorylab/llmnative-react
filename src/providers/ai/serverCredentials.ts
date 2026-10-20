// Server-held AI credentials (CR-102). An app that cannot hold provider keys in the browser builds
// its adapters with a placeholder where the key goes; its proxy swaps the placeholder for the real
// key, only towards a host of that provider. Pure module: no React, no config — the browser
// registry, proxyFetch and the Node entry (`@llmnative/react/server`) all share it.

export const SERVER_CREDENTIAL_PREFIX = 'llmnative-server-credential';

const SCOPE_PATTERN = /^[A-Za-z0-9_-]+$/;
const PLACEHOLDER_PATTERN = /llmnative-server-credential:([A-Za-z0-9_-]+):([a-z-]+)/g;

/** A provider connected on the server: its id, and what its URLs are built from. Never the key. */
export type ServerAIConnection = {
    id: string;
    /** Cloudflare: the account in every Workers AI URL. */
    accountId?: string;
    /** openai-compatible: the endpoint. */
    baseUrl?: string;
};

/** The placeholder an adapter writes where the key goes: `llmnative-server-credential:<scope>:<provider>`. */
export const serverCredential = (scope: string, provider: string): string => {
    if (!SCOPE_PATTERN.test(scope)) throw new Error(`Server credential scope "${scope}" may only contain letters, digits, "-" and "_".`);
    return `${SERVER_CREDENTIAL_PREFIX}:${scope}:${provider}`;
};

/** Every placeholder in `text`, as scope and provider. */
export const findServerCredentials = (text: string): Array<{ placeholder: string; scope: string; provider: string }> =>
    [...text.matchAll(PLACEHOLDER_PATTERN)].map(([placeholder, scope, provider]) => ({ placeholder, scope, provider }));

export const containsServerCredential = (text: string): boolean => text.includes(`${SERVER_CREDENTIAL_PREFIX}:`);

/** The fixed API host of each built-in provider (openai-compatible and Cloudflare depend on the connection). */
export const AI_PROVIDER_HOSTS: Readonly<Record<string, string>> = {
    openai: 'api.openai.com',
    openrouter: 'openrouter.ai',
    opencode: 'opencode.ai',
    deepseek: 'api.deepseek.com',
    gemini: 'generativelanguage.googleapis.com',
    anthropic: 'api.anthropic.com',
    mistral: 'api.mistral.ai',
    glm: 'open.bigmodel.cn',
    groq: 'api.groq.com',
    cloudflare: 'api.cloudflare.com',
};

const trimSlashes = (path: string) => path.replace(/\/+$/, '');

/** Whether `target` is an API URL of the provider of `connection`: where its key may go. */
export const isAIProviderTarget = (connection: ServerAIConnection, target: URL): boolean => {
    if (connection.id === 'openai-compatible') {
        if (!connection.baseUrl) return false;
        const base = new URL(connection.baseUrl);
        const basePath = trimSlashes(base.pathname);
        return target.origin === base.origin && (target.pathname === basePath || target.pathname.startsWith(`${basePath}/`));
    }
    if (target.protocol !== 'https:' || target.host !== AI_PROVIDER_HOSTS[connection.id]) return false;
    // Cloudflare: one host for every account, so the key only goes to the account it belongs to.
    if (connection.id === 'cloudflare') {
        return Boolean(connection.accountId) && target.pathname.startsWith(`/client/v4/accounts/${encodeURIComponent(connection.accountId!.trim())}/`);
    }
    return true;
};
