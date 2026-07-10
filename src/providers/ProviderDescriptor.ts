// Generic, category-agnostic description of a provider a consuming app can offer the user
// to connect — separate from the runtime adapter contract each category defines (e.g.
// AIProviderAdapter, EmailProviderAdapter), which is about *executing* requests once
// configured. This is about telling a "connect" UI what to render before that: what the
// provider is called, what credential fields it needs, and where to go get them.

export type ProviderCredentialField = {
    key:          string;
    label:        string;
    type:         'text' | 'password';
    placeholder?: string;
};

export type ProviderDescriptor = {
    id:          string;
    label:        string;
    description:  string;
    credentialFields: ProviderCredentialField[];
    /** Where to go find/generate this credential (the provider's own dashboard/API keys page). */
    credentialsUrl?:  string;
    /** Short guidance on where in that dashboard to look, when the URL alone isn't obvious. */
    credentialsHint?: string;
};
