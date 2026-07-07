import type { ApiProviderAdapter, ApiProviderRequest } from './ApiProvider';
import { callFirebaseFunction } from '../firebase-init';

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
        return callFirebaseFunction(
            this.config.functionName,
            { provider: this.config.providerName, request },
            undefined,
            this.config.region,
        );
    }
}
