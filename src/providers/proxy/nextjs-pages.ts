// @ts-nocheck - scaffold template, copied to user project by CLI
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * LLMNative proxy - Next.js Pages Router.
 *
 * Place this file at:
 *   pages/api/proxy.ts
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const targetUrl = req.query.url as string | undefined;

    if (!targetUrl) {
        res.status(400).json({ error: 'Missing url query parameter' });
        return;
    }

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
        if (key === 'host' || key === 'x-llmnative-proxy') continue;
        if (typeof value === 'string') headers[key] = value;
        else if (Array.isArray(value)) headers[key] = value.join(', ');
    }

    const hasBody = !['GET', 'HEAD'].includes(req.method?.toUpperCase() ?? 'GET');

    const upstream = await fetch(targetUrl, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => res.setHeader(key, value));
    const buffer = await upstream.arrayBuffer();
    res.end(Buffer.from(buffer));
}

export const config = {
    api: { bodyParser: true },
};
