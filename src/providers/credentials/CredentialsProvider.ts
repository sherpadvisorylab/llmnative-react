export interface CredentialsAdapter {
    getToken(scope?: string): Promise<string>;
}
