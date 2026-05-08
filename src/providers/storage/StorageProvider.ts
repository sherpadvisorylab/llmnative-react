export interface StorageProviderAdapter {
    upload(file: string, path: string): Promise<string | undefined>;
    getURL(path: string): Promise<string | undefined>;
    download(path: string): Promise<Blob | undefined>;
    delete(path: string): Promise<boolean>;
}
