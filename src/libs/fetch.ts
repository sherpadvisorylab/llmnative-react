import {sleep} from "./utils";

// Diagnostic console.warn/console.log calls below echo the request/URL for debugging — but
// every AI provider adapter (react/src/providers/ai/*) sends its API key via a header
// (Authorization, x-api-key) or, for Gemini, a `?key=` query param. Logging the raw
// request/URL on any network failure (bad key, rate limit, CORS, 5xx) would print the
// plaintext key to the browser devtools console. Redact before logging, never before sending.
const SENSITIVE_HEADER_PATTERN = /auth|key|token|secret/i;
const SENSITIVE_QUERY_PARAMS = ['key', 'apikey', 'api_key', 'access_token', 'token', 'secret'];

function redactedHeadersForLogging(headers: HeadersInit | undefined): Record<string, string> {
    if (!headers) return {};
    const entries = headers instanceof Headers
        ? Array.from(headers.entries())
        : Array.isArray(headers)
            ? headers
            : Object.entries(headers);
    return entries.reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = SENSITIVE_HEADER_PATTERN.test(key) ? '[REDACTED]' : value;
        return acc;
    }, {});
}

function redactedRequestForLogging(request: RequestInit): RequestInit {
    return { ...request, headers: redactedHeadersForLogging(request.headers) };
}

function redactedUrlForLogging(url: string): string {
    try {
        const parsed = new URL(url, 'http://placeholder-base.invalid');
        let changed = false;
        for (const param of SENSITIVE_QUERY_PARAMS) {
            if (parsed.searchParams.has(param)) {
                parsed.searchParams.set(param, '[REDACTED]');
                changed = true;
            }
        }
        if (!changed) return url;
        return url.startsWith('http') ? parsed.toString() : `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return url;
    }
}

interface FetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH";
    headers?: Record<string, string>;
    body?: Record<string, unknown> | string;
    /** Lets a caller cancel an in-flight request (e.g. a "stop" button on a long AI call). */
    signal?: AbortSignal;
}

function resolveContentType(options: FetchOptions) {
    const { body, headers } = options;
    const contentType = headers?.["Content-Type"] || "";

    const allowedContentTypes = Array.isArray(body) || typeof body === 'object'
        ? ["application/json", "application/x-www-form-urlencoded", "multipart/form-data"]
        : ["text/plain", "text/html"];

    if (allowedContentTypes.includes(contentType)) {
        return contentType;
    }

    return typeof body === 'object'
        ? "application/json"
        : typeof body === 'string' && body.startsWith("<")
            ? "text/html"
            : "text/plain";
}

export async function fetchRest(
    url: string,
    options: FetchOptions | null = null,
    fetchFn: typeof fetch = globalThis.fetch
): Promise<any> { // CR-042: return type is JSON | string | null, shape determined by caller
    const request: RequestInit = {
        redirect: "follow",
        method: options?.method?.toUpperCase() || "GET",
        headers: options?.headers || {},
        signal: options?.signal,
    };

    if (options?.body) {
        if (["GET", "HEAD"].includes(request.method as string)) {
            url += (url.includes("?") ? "&" : "?") + new URLSearchParams(options.body as Record<string, string>);
        } else {
            switch (resolveContentType(options)) {
                case "application/json":
                    request.body = JSON.stringify(options.body);
                    break;

                case "application/x-www-form-urlencoded":
                    request.body = new URLSearchParams(options.body as Record<string, string>);
                    break;

                case "multipart/form-data": {
                    const formData = new FormData();
                    const body = options.body as Record<string, unknown>;
                    for (const key in body) {
                        formData.append(key, body[key] as string | Blob);
                    }
                    request.body = formData;
                    break;
                }
                case "text/html":
                case "text/plain":
                    if (typeof options.body !== 'string') {
                        throw new Error("Fetch: Body must be a string for text/plain or text/html content types.");
                    }
                    request.body = options.body;
                    break;
                default:
                    throw new Error(`Fetch: Unsupported Content-Type`);
            }
        }
    }

    return fetchFn(url, request)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw { response, text }; });
            }

            const accept = options?.headers?.['Accept'];
            const contentType = response.headers.get('Content-Type')?.split(";")[0];
            if (accept && accept.split(";")[0] !== contentType) {
                return response.text().then(text => { throw { response, text }; });
            }

            return response?.headers && response.headers.get('Content-Type') === "application/json"
                ? response.json()
                : response.text();
        })
        .catch(error => {
            if (error.message) {
                console.warn(`fetch: ${error.message}`, redactedUrlForLogging(url), redactedRequestForLogging(request));
                return null;
            }
            const { response, text } = error;
            function getResponse() {
                const contentType = response?.headers.get('Content-Type')?.split(";")[0] || "";

                if (contentType === "application/json" && (text.startsWith("{") || text.startsWith("["))) {
                    const json = JSON.parse(text);
                    console.warn(`fetch: Error`, redactedUrlForLogging(url), redactedRequestForLogging(request), response.status, json);
                    return json;
                } else {
                    const accept = options?.headers?.['Accept']?.split(";")[0] || "";

                    const wrongContentType = accept !== contentType
                        ? "Request Accept header does not match response Content-Type (Accept: " + accept + ", Content-Type: " + contentType + ")"
                        : accept === "application/json"
                            ? "Request Accept header is application/json but response is not JSON"
                            : null;

                    console.warn(`fetch: ${wrongContentType}`, redactedUrlForLogging(url), redactedRequestForLogging(request), response.status, text);
                    return (wrongContentType && accept === "application/json"
                            ? {error: text, status: 520}
                            : text
                    );
                }
            }

            throw getResponse();
        });
}

export async function fetchJson(
    url: string,
    options: FetchOptions | null = null,
    fetchFn: typeof fetch = globalThis.fetch
): Promise<any> { // CR-042: delegates to fetchRest, shape caller-determined
    return fetchRest(url, {
        ...options,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...options?.headers,
        }
    }, fetchFn)
    .then(response => {
        if (response?.error) {
            throw response;
        }
        return response;
    });
}

export async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries: number = 3,
    statusNoRetry: number[] = [429],
    fetchFn: typeof fetch = globalThis.fetch
): Promise<any | Response> {
    return fetchFn(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            if (!statusNoRetry.includes(response.status) && maxRetries > 0) {
                console.log("Retrying...", maxRetries, redactedUrlForLogging(url), redactedRequestForLogging(options));

                return sleep(500)
                    .then(() => fetchWithRetry(url, options, maxRetries - 1, statusNoRetry, fetchFn));
            }

            console.error(response);
            return response;
        })
        .catch((err) => console.error(err, "BBBBBBBBBBBBBBBBBBBBBBB"));
}
