/**
 * LLMNative proxy - Cloudflare Worker.
 *
 * Deploy as a Worker or use as a Pages Function at:
 *   functions/api/proxy.ts
 */
export default {
    async fetch(request: Request): Promise<Response> {
        const { searchParams } = new URL(request.url);
        const targetUrl = searchParams.get('url');

        if (!targetUrl) {
            return Response.json({ error: 'Missing url query parameter' }, { status: 400 });
        }

        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('x-llmnative-proxy');

        const hasBody = !['GET', 'HEAD'].includes(request.method.toUpperCase());

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
    },
};
