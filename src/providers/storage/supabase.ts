import type {
    StorageProviderAdapter,
    UploadOptions,
    StorageOptions,
    DeleteOptions,
    MoveOptions,
    ListOptions,
    StorageFileInfo,
    UploadHandle,
} from './StorageProvider';
import { applyListFilters } from './StorageProvider';
import {
    createConfigurationState,
    getMissingKeys,
    type ProviderConfigurationState,
} from '../ProviderConfiguration';

interface SupabaseStorageConfig {
    url: string;
    anonKey: string;
    /** Default bucket name. Falls back to "public" if omitted. */
    bucket?: string;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export class SupabaseStorageProvider implements StorageProviderAdapter {
    private config: SupabaseStorageConfig;

    constructor(config: SupabaseStorageConfig) {
        this.config = config;
    }

    getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'SupabaseStorageProvider',
            getMissingKeys(this.config as unknown as Record<string, unknown>, ['url', 'anonKey'], 'supabase.')
        );
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    private resolveBucket(bucket?: string): string {
        return bucket ?? this.config.bucket ?? 'public';
    }

    private authHeaders(): Record<string, string> {
        return {
            apikey:        this.config.anonKey,
            Authorization: `Bearer ${this.config.anonKey}`,
        };
    }

    // ── upload ──────────────────────────────────────────────────────────────

    upload = async (
        file: string | File | Blob,
        path: string,
        opts: UploadOptions = {}
    ): Promise<string | undefined> => {
        const bucket = this.resolveBucket(opts.bucket);

        let blob: Blob;
        let contentType: string | undefined = opts.contentType;

        if (typeof file === 'string') {
            const [header, base64] = file.split(',');
            contentType ??= header.match(/:(.*?);/)?.[1];
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            blob = new Blob([bytes], contentType ? { type: contentType } : undefined);
        } else {
            blob = file;
            if (file instanceof File) contentType ??= file.type || undefined;
        }

        const res = await fetch(
            `${this.config.url}/storage/v1/object/${bucket}/${path}`,
            {
                method:  'POST',
                headers: {
                    ...this.authHeaders(),
                    ...(contentType ? { 'Content-Type': contentType } : {}),
                },
                body: blob,
            }
        );

        if (!res.ok) {
            console.error('[SupabaseStorage] upload error:', await res.text());
            return;
        }

        return this.getURL(path, { bucket });
    };

    // ── createUpload ────────────────────────────────────────────────────────

    /**
     * Supabase upload with cancel support via AbortController.
     * pause() and resume() are no-ops — Supabase fetch has no native pause/resume.
     */
    createUpload = (
        file: string | File | Blob,
        path: string,
        opts: UploadOptions = {}
    ): UploadHandle => {
        const controller = new AbortController();
        const bucket = this.resolveBucket(opts.bucket);

        const url: Promise<string | undefined> = (async () => {
            let blob: Blob;
            let contentType = opts.contentType;

            if (typeof file === 'string') {
                const [header, base64] = file.split(',');
                contentType ??= header.match(/:(.*?);/)?.[1];
                const binary = atob(base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                blob = new Blob([bytes], contentType ? { type: contentType } : undefined);
            } else {
                blob = file;
                if (file instanceof File) contentType ??= file.type || undefined;
            }

            try {
                const res = await fetch(
                    `${this.config.url}/storage/v1/object/${bucket}/${path}`,
                    {
                        method:  'POST',
                        headers: {
                            ...this.authHeaders(),
                            ...(contentType ? { 'Content-Type': contentType } : {}),
                        },
                        body:   blob,
                        signal: controller.signal,
                    }
                );
                if (!res.ok) return undefined;
                return this.getURL(path, { bucket });
            } catch {
                return undefined;
            }
        })();

        return {
            url,
            pause:  () => {},
            resume: () => {},
            cancel: () => controller.abort(),
        };
    };

    // ── rename ──────────────────────────────────────────────────────────────

    /**
     * Rename a file or folder. Internally calls move().
     * For Supabase, single-file rename uses the native move API (one round-trip).
     */
    rename = async (from: string, to: string, opts: MoveOptions = {}): Promise<boolean> => {
        const count = await this.move(from, to, opts);
        return count > 0;
    };

    // ── move ────────────────────────────────────────────────────────────────

    /**
     * Move a file or folder.
     * Single file: uses Supabase's native move API (one round-trip).
     * Folder (opts.recursive = true): lists all files then moves each via native API.
     * Returns the number of files successfully moved.
     */
    move = async (from: string, to: string, opts: MoveOptions = {}): Promise<number> => {
        if (opts.recursive) {
            const files = await this.list(from, { bucket: opts.bucket, recursive: true });
            const prefix = from.endsWith('/') ? from : `${from}/`;
            const results = await Promise.all(
                files.map(async (file) => {
                    const relativePath = file.path.startsWith(prefix)
                        ? file.path.slice(prefix.length)
                        : file.path.slice(from.length);
                    const destPath = `${to}/${relativePath}`;
                    return this._moveFile(file.path, destPath, opts);
                })
            );
            return results.filter(Boolean).length;
        }

        return (await this._moveFile(from, to, opts)) ? 1 : 0;
    };

    private _moveFile = async (from: string, to: string, opts: MoveOptions): Promise<boolean> => {
        const sourceBucket = this.resolveBucket(opts.bucket);
        const destBucket   = this.resolveBucket(opts.destBucket ?? opts.bucket);
        try {
            const res = await fetch(
                `${this.config.url}/storage/v1/object/move`,
                {
                    method:  'POST',
                    headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
                    body:    JSON.stringify({
                        bucketId:          sourceBucket,
                        sourceKey:         from,
                        destinationBucket: destBucket,
                        destinationKey:    to,
                    }),
                }
            );
            return res.ok;
        } catch (error) {
            console.error(`[SupabaseStorage] move error ${from} → ${to}:`, error);
            return false;
        }
    };

    // ── getURL ──────────────────────────────────────────────────────────────

    getURL = async (path: string, opts: StorageOptions = {}): Promise<string | undefined> => {
        const bucket = this.resolveBucket(opts.bucket);
        return `${this.config.url}/storage/v1/object/public/${bucket}/${path}`;
    };

    // ── getFileInfo ─────────────────────────────────────────────────────────

    getFileInfo = async (path: string, opts: StorageOptions = {}): Promise<StorageFileInfo | undefined> => {
        const parts  = path.split('/');
        const name   = parts.pop()!;
        const prefix = parts.join('/');
        const files  = await this.list(prefix, { ...opts, metadata: true });
        return files.find((f) => f.name === name);
    };

    // ── download ────────────────────────────────────────────────────────────

    download = async (path: string, opts: StorageOptions = {}): Promise<Blob | undefined> => {
        const url = await this.getURL(path, opts);
        if (!url) return;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.blob();
        } catch (error) {
            console.error(`[SupabaseStorage] download error for ${path}:`, error);
        }
    };

    // ── delete ──────────────────────────────────────────────────────────────

    /**
     * Delete a single file or all files under a folder prefix.
     * Uses Supabase's bulk-delete API — single request even for N files.
     * Returns the number of files deleted.
     */
    delete = async (path: string, opts: DeleteOptions = {}): Promise<number> => {
        const bucket = this.resolveBucket(opts.bucket);

        let prefixes: string[];
        if (opts.recursive) {
            const files = await this.list(path, { ...opts, recursive: true });
            if (files.length === 0) return 0;
            prefixes = files.map((f) => f.path);
        } else {
            prefixes = [path];
        }

        try {
            const res = await fetch(
                `${this.config.url}/storage/v1/object/${bucket}`,
                {
                    method:  'DELETE',
                    headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ prefixes }),
                }
            );
            if (res.status === 404) return 0;
            if (!res.ok) {
                console.error('[SupabaseStorage] delete error:', await res.text());
                return 0;
            }
            return prefixes.length;
        } catch (error) {
            console.error(`[SupabaseStorage] delete error for ${path}:`, error);
            return 0;
        }
    };

    // ── list ────────────────────────────────────────────────────────────────

    /**
     * List files (and optionally folders) under a path prefix.
     * Supabase always returns metadata in the same response (no N+1 cost).
     * Folder entries have id === null in the Supabase response.
     */
    list = async (path: string, opts: ListOptions = {}): Promise<StorageFileInfo[]> => {
        const results = await this._listLevel(path, opts);
        return applyListFilters(results, opts);
    };

    private _listLevel = async (path: string, opts: ListOptions): Promise<StorageFileInfo[]> => {
        const showFiles   = opts.includeFiles   !== false;  // default true
        const showFolders = opts.includeFolders === true;
        const bucket = this.resolveBucket(opts.bucket);

        try {
            const res = await fetch(
                `${this.config.url}/storage/v1/object/list/${bucket}`,
                {
                    method:  'POST',
                    headers: { ...this.authHeaders(), 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ prefix: path, limit: 1000, offset: 0 }),
                }
            );

            if (!res.ok) {
                console.error('[SupabaseStorage] list error:', await res.text());
                return [];
            }

            type StorageItem = { id: string | null; name?: string; metadata?: { size?: number; mimetype?: string }; updated_at?: string };
            const items = (await res.json()) as StorageItem[];

            // Files: have an id. Folders: id === null (virtual directories in Supabase).
            const fileItems   = items.filter((item) => item.id !== null && item.name && !item.name.endsWith('/'));
            const folderItems = items.filter((item) => item.id === null && item.name);

            const fileResults: StorageFileInfo[] = showFiles
                ? fileItems.map((item) => ({
                    name:        item.name ?? '',
                    path:        path ? `${path}/${item.name}` : item.name ?? '',
                    size:        item.metadata?.size,
                    contentType: item.metadata?.mimetype,
                    updatedAt:   item.updated_at,
                } satisfies StorageFileInfo))
                : [];

            const folderResults: StorageFileInfo[] = showFolders
                ? folderItems.map((item) => ({
                    name:     item.name ?? '',
                    path:     path ? `${path}/${item.name}` : item.name ?? '',
                    isFolder: true,
                } satisfies StorageFileInfo))
                : [];

            const combined = [...fileResults, ...folderResults];

            if (!opts.recursive || folderItems.length === 0) return combined;

            const subResults = await Promise.all(
                folderItems.map((folder) =>
                    this._listLevel(path ? `${path}/${folder.name}` : folder.name ?? '', opts)
                )
            );

            return [...combined, ...subResults.flat()];
        } catch (error) {
            console.error(`[SupabaseStorage] list error for ${path}:`, error);
            return [];
        }
    };
}
