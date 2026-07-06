import type { ApiProviderAdapter, ApiProviderRequest } from './ApiProvider';

/** Resolves via a local function, no network. Dev/tests. */
export class MockApiProviderAdapter implements ApiProviderAdapter {
    constructor(private resolver: (request: ApiProviderRequest) => unknown | Promise<unknown>) {}

    async fetch(request: ApiProviderRequest): Promise<unknown> {
        return this.resolver(request);
    }
}
