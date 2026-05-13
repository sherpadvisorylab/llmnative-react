import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface StorageProviderAdapter extends ProviderConfigurable {
    upload(file: string, path: string): Promise<string | undefined>;
    getURL(path: string): Promise<string | undefined>;
    download(path: string): Promise<Blob | undefined>;
    delete(path: string): Promise<boolean>;
}
