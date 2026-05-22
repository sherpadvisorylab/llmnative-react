import { DataProviderAdapter, DatabaseOptions, ReadOptions, RecordArray, RecordProps } from "./DataProvider";
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from "../ProviderConfiguration";

interface SupabaseConfig {
    url: string;
    anonKey: string;
}

const warn = (method: string) =>
    console.warn(`SupabaseDataProvider.${method}: not fully implemented yet.`);

export class SupabaseDataProvider implements DataProviderAdapter {
    private config: SupabaseConfig;

    constructor(config: SupabaseConfig) {
        this.config = config;
    }

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'SupabaseDataProvider',
            getMissingKeys(this.config as unknown as Record<string, unknown>, ['url', 'anonKey'], 'supabase.')
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    read = async (path: string, _options?: ReadOptions): Promise<any> => {
        warn("read");
        // path format: "/table/id" or "/table"
        const [, table, id] = path.split("/");
        const url = `${this.config.url}/rest/v1/${table}${id ? `?id=eq.${id}` : ""}`;
        const res = await fetch(url, {
            headers: {
                apikey: this.config.anonKey,
                Authorization: `Bearer ${this.config.anonKey}`,
            },
        });
        const data = await res.json();
        if (id) return data[0] ?? null;
        return Object.fromEntries((data as any[]).map((r: any) => [r.id, r]));
    };

    set = async (path: string, data: object): Promise<void> => {
        warn("set");
        const [, table, id] = path.split("/");
        const url = `${this.config.url}/rest/v1/${table}`;
        await fetch(url, {
            method: id ? "PUT" : "POST",
            headers: {
                apikey: this.config.anonKey,
                Authorization: `Bearer ${this.config.anonKey}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify(id ? { ...data, id } : data),
        });
    };

    update = async (path: string, data: object): Promise<void> => {
        warn("update");
        await this.set(path, data);
    };

    remove = async (path: string): Promise<void> => {
        warn("remove");
        const [, table, id] = path.split("/");
        if (!id) { console.error("SupabaseDataProvider.remove: id required"); return; }
        await fetch(`${this.config.url}/rest/v1/${table}?id=eq.${id}`, {
            method: "DELETE",
            headers: {
                apikey: this.config.anonKey,
                Authorization: `Bearer ${this.config.anonKey}`,
            },
        });
    };

    subscribe = (
        path: string | undefined,
        setRecords: (records: RecordArray) => void,
        _options?: DatabaseOptions
    ): (() => void) => {
        if (!path) return () => undefined;
        warn("subscribe — polling every 5s (no real-time)");
        const [, table] = path.split("/");
        const poll = async () => {
            const res = await fetch(`${this.config.url}/rest/v1/${table}`, {
                headers: {
                    apikey: this.config.anonKey,
                    Authorization: `Bearer ${this.config.anonKey}`,
                },
            });
            const data: any[] = await res.json();
            setRecords(data.map((r, i) => ({ ...r, _key: String(r.id ?? i), _index: i })));
        };
        void poll();
        const interval = setInterval(poll, 5000);
        return () => clearInterval(interval);
    };

    count = async (path: string): Promise<number> => {
        warn("count");
        const [, table] = path.split("/");
        const res = await fetch(`${this.config.url}/rest/v1/${table}?select=id`, {
            headers: {
                apikey: this.config.anonKey,
                Authorization: `Bearer ${this.config.anonKey}`,
                Prefer: "count=exact",
            },
        });
        const count = res.headers.get("content-range")?.split("/")[1];
        return count ? parseInt(count, 10) : 0;
    };
}
