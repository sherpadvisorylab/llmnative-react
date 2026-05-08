import { StorageProviderAdapter } from "./StorageProvider";

interface SupabaseStorageConfig {
    url: string;
    anonKey: string;
    bucket?: string;
}

const warn = (method: string) =>
    console.warn(`SupabaseStorageProvider.${method}: not fully implemented yet.`);

export class SupabaseStorageProvider implements StorageProviderAdapter {
    private config: SupabaseStorageConfig;

    constructor(config: SupabaseStorageConfig) {
        this.config = config;
    }

    private get bucket() {
        return this.config.bucket ?? "public";
    }

    upload = async (file: string, path: string): Promise<string | undefined> => {
        warn("upload");
        const base64 = file.split(",")[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes]);

        const res = await fetch(
            `${this.config.url}/storage/v1/object/${this.bucket}/${path}`,
            {
                method: "POST",
                headers: {
                    apikey: this.config.anonKey,
                    Authorization: `Bearer ${this.config.anonKey}`,
                },
                body: blob,
            }
        );
        if (!res.ok) { console.error("Supabase upload error:", await res.text()); return; }
        return this.getURL(path);
    };

    getURL = async (path: string): Promise<string | undefined> => {
        return `${this.config.url}/storage/v1/object/public/${this.bucket}/${path}`;
    };

    download = async (path: string): Promise<Blob | undefined> => {
        warn("download");
        const url = await this.getURL(path);
        if (!url) return;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch");
            return await res.blob();
        } catch (error) {
            console.error("Supabase download error:", error);
        }
    };

    delete = async (path: string): Promise<boolean> => {
        warn("delete");
        const res = await fetch(
            `${this.config.url}/storage/v1/object/${this.bucket}/${path}`,
            {
                method: "DELETE",
                headers: {
                    apikey: this.config.anonKey,
                    Authorization: `Bearer ${this.config.anonKey}`,
                },
            }
        );
        return res.ok;
    };
}
