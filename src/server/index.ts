/** Node-only entry point (`@llmnative/react/server`). It resolves the opaque server-credential
 * placeholders a browser-side `createServerCredentialAIRegistry(...)` sends, without importing any
 * React or DOM-only module. */
export { resolveServerCredentials } from './credentials';
export type {
    ServerCredentialLookup,
    ServerCredentialRequest,
    ResolveServerCredentialsOptions,
} from './credentials';

export {
    SERVER_CREDENTIAL_PREFIX,
    aiProviderHosts,
    buildServerCredentialPlaceholder,
    parseServerCredentialPlaceholder,
    isServerCredentialPlaceholder,
    containsServerCredential,
    replaceServerCredentialPlaceholders,
} from '../providers/ai/AIProvider';
export type { AIProviderHosts, AIServerCredentialRef } from '../providers/ai/AIProvider';
