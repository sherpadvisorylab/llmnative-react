import {
    aiProviderHosts,
    containsServerCredential,
    replaceServerCredentialPlaceholders,
    type AIProviderHosts,
    type AIServerCredentialRef,
} from '../providers/ai/AIProvider';

/** Resolves a server-held credential from its `scope` and provider id. Returns `undefined` (or
 * throws) when nothing is configured for that pair; nothing is ever sent upstream in that case. */
export type ServerCredentialLookup = (scope: string, provider: string) => string | undefined;

export type ServerCredentialRequest = {
    url: string;
    headers?: HeadersInit;
};

export type ResolveServerCredentialsOptions = {
    /** Extra allowed hosts per provider, merged over the built-in `aiProviderHosts`. Needed for
     * `openai-compatible`, whose endpoint is user-supplied and therefore not in the fixed map. */
    hosts?: AIProviderHosts;
};

const mergeHosts = (extra?: AIProviderHosts): AIProviderHosts => {
    if (!extra) return aiProviderHosts;
    const merged: AIProviderHosts = { ...aiProviderHosts };
    for (const [provider, hosts] of Object.entries(extra)) {
        if (hosts) merged[provider as keyof AIProviderHosts] = hosts;
    }
    return merged;
};

/** Replaces every server-credential placeholder in `request` (headers and URL) with the secret
 * returned by `lookup`. A placeholder is only resolved when the request's target host belongs to
 * that provider per `aiProviderHosts` (plus any hosts passed in options); a target outside the
 * provider's hosts, an unknown provider or a missing credential all throw, so a placeholder can
 * never reach a provider. Runs in Node only — import it from `@llmnative/react/server`. */
export const resolveServerCredentials = (
    request: ServerCredentialRequest,
    lookup: ServerCredentialLookup,
    options: ResolveServerCredentialsOptions = {},
): { url: string; headers: Headers } => {
    const hosts = mergeHosts(options.hosts);

    let target: URL;
    try {
        target = new URL(request.url);
    } catch {
        throw new Error(`resolveServerCredentials: "${request.url}" is not an absolute URL.`);
    }

    const resolveRef = (ref: AIServerCredentialRef): string => {
        const allowed = hosts[ref.provider as keyof AIProviderHosts];
        if (!allowed || allowed.length === 0) {
            throw new Error(`resolveServerCredentials: unknown server-credential provider "${ref.provider}".`);
        }
        if (!allowed.includes(target.hostname)) {
            throw new Error(`resolveServerCredentials: refusing to send "${ref.provider}" credentials to host "${target.hostname}".`);
        }

        const credential = lookup(ref.scope, ref.provider);
        if (!credential) {
            throw new Error(`resolveServerCredentials: no credential configured for scope "${ref.scope}" and provider "${ref.provider}".`);
        }

        return credential;
    };

    const headers = new Headers(request.headers);
    for (const [key, value] of [...headers.entries()]) {
        if (!containsServerCredential(value)) continue;
        headers.set(key, replaceServerCredentialPlaceholders(value, resolveRef));
    }

    const url = containsServerCredential(request.url)
        ? replaceServerCredentialPlaceholders(request.url, resolveRef)
        : request.url;

    return { url, headers };
};
