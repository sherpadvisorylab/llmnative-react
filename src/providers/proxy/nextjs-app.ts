/**
 * LLMNative proxy — Next.js App Router.
 *
 * Place this file at:
 *   app/api/proxy/route.ts
 */

const PASSTHROUGH_METHODS = new Set(['GET', 'HEAD']);

async function handler(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return Response.json({ error: 'Missing url query parameter' }, { status: 400 });
    }

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('x-llmnative-proxy');

    const hasBody = !PASSTHROUGH_METHODS.has(request.method.toUpperCase());

    const upstream = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: hasBody ? request.body : undefined,
        ...(hasBody ? { duplex: 'half' } : {}),
    } as RequestInit);

    return new Response(upstream.body, {
        status: upstream.status,
        headers: upstream.headers,
    });
}

export const GET     = handler;
export const POST    = handler;
export const PUT     = handler;
export const PATCH   = handler;
export const DELETE  = handler;
export const OPTIONS = handler;
