import type { ApiProviderAdapter, ApiProviderRequest } from './ApiProvider';

export type SupabaseApiProviderConfig = {
    url: string;
    anonKey: string;
    /** Name of the Edge Function that receives { provider, request } and does the real, secret-bearing call server-side. */
    functionName: string;
    providerName: string;
};

/** Routes through a Supabase Edge Function — the secret lives server-side, resolved there from the real tenant/user registration. */
export class SupabaseApiProviderAdapter implements ApiProviderAdapter {
    constructor(private config: SupabaseApiProviderConfig) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        const { getSupabaseClient } = await import('../supabase-init');
        const client = getSupabaseClient(this.config.url, this.config.anonKey);
        const { data, error } = await client.functions.invoke(this.config.functionName, {
            body: { provider: this.config.providerName, request },
        });
        if (error) throw error;
        return data;
    }
}
