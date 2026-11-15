// The one error every email adapter throws (CR-130): a code the app can act on, the provider and the HTTP
// status. The message never carries a key, a token or the body of the provider's answer.

export type EmailProviderErrorCode =
    /** The adapter misses a setting (key, sender, client, library). */
    | 'not-configured'
    /** The message itself is not valid: no recipient, no body. */
    | 'invalid-message'
    /** The provider refused the credentials (401/403, revoked token). */
    | 'unauthorized'
    /** The provider refused the message (400/422: sender not verified, address not valid). */
    | 'rejected'
    | 'rate-limited'
    /** The provider or the network did not answer. */
    | 'unavailable'
    | 'unknown';

export class EmailProviderError extends Error {
    readonly code: EmailProviderErrorCode;
    readonly provider: string;
    readonly status?: number;

    constructor(code: EmailProviderErrorCode, provider: string, message: string, options: { status?: number; cause?: unknown } = {}) {
        super(message, options.cause === undefined ? undefined : { cause: options.cause });
        this.name = 'EmailProviderError';
        this.code = code;
        this.provider = provider;
        this.status = options.status;
    }
}

/** The code of an HTTP status of a provider. */
export const emailErrorCode = (status: number): EmailProviderErrorCode => {
    if (status === 401 || status === 403) return 'unauthorized';
    if (status === 429) return 'rate-limited';
    if (status === 400 || status === 404 || status === 409 || status === 422) return 'rejected';
    if (status >= 500) return 'unavailable';
    return 'unknown';
};

/**
 * A JSON call to a provider: the answer, or an `EmailProviderError` with the status and the path only.
 * A network failure is `unavailable`.
 */
export async function callEmailApi<T>(
    provider: string,
    http: typeof fetch,
    url: string,
    init: RequestInit,
): Promise<T> {
    let response: Response;
    try {
        response = await http(url, init);
    } catch (cause) {
        throw new EmailProviderError('unavailable', provider, `${provider} did not answer`, { cause });
    }
    if (!response.ok) {
        throw new EmailProviderError(emailErrorCode(response.status), provider, `${provider} answered ${response.status} on ${new URL(url).pathname}`, { status: response.status });
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
}
