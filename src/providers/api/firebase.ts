import type { ApiProviderAdapter, ApiProviderRequest } from './ApiProvider';

export type FirebaseApiProviderConfig = {
    /** Name of the Callable Function that receives { provider, request } and does the real, secret-bearing call server-side. */
    functionName: string;
    /** The registered provider's own name — sent alongside the request so the function knows which registration to resolve. */
    providerName: string;
    region?: string;
};

/** Routes through a Firebase Callable Function — the secret lives server-side, resolved there from the real tenant/user registration. */
export class FirebaseApiProviderAdapter implements ApiProviderAdapter {
    constructor(private config: FirebaseApiProviderConfig) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        const { getApp } = await import('firebase/app');
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const functions = getFunctions(getApp(), this.config.region);
        const call = httpsCallable(functions, this.config.functionName);
        const result = await call({ provider: this.config.providerName, request });
        return result.data;
    }
}
