import type { ProviderConfigurable } from '../ProviderConfiguration';

// ── Shared option types ───────────────────────────────────────────────────────

export interface UploadOptions {
    /** Target bucket. Falls back to the provider's default bucket if omitted. */
    bucket?: string;
    /** MIME type hint (e.g. 'image/png'). Provider may infer it from the file when omitted. */
    contentType?: string;
    /** Called during upload with the completion percentage (0–100). */
    onProgress?: (percent: number) => void;
}

export interface StorageOptions {
    /** Target bucket. Falls back to the provider's default bucket if omitted. */
    bucket?: string;
}

export interface DeleteOptions extends StorageOptions {
    /**
     * When true, deletes all files under the given path prefix (folder delete).
     * Returns the total number of files deleted.
     * Default: false — deletes a single file and returns 0 (not found) or 1 (deleted).
     */
    recursive?: boolean;
}

export interface MoveOptions extends StorageOptions {
    /**
     * Destination bucket. Falls back to the source bucket if omitted.
     * Only relevant for cross-bucket moves.
     */
    destBucket?: string;
    /**
     * When true, treats `from` as a folder prefix and moves every file under it
     * to the corresponding path under `to`. Returns the number of files moved.
     * Default: false — moves a single file.
     */
    recursive?: boolean;
}

export interface ListOptions extends StorageOptions {
    /** Traverse sub-folders and return files at any depth. Default: false (direct children only). */
    recursive?: boolean;
    /**
     * Include file entries in the results.
     * Default: true.
     */
    includeFiles?: boolean;
    /**
     * Include virtual folder/directory entries in the results.
     * Default: false. When true, folder entries have isFolder: true.
     */
    includeFolders?: boolean;
    /**
     * Only return files whose extension matches.
     * Case-insensitive. Pass a single string ('jpg') or an array (['jpg', 'png']).
     * Has no effect on folder entries.
     */
    filterByExtension?: string | string[];
    /**
     * Maximum number of entries to return (applied after all other filters).
     * Omit for no limit.
     */
    limit?: number;
    /**
     * When true, fetches size / contentType / updatedAt for each file.
     * On Firebase this requires one extra network call per file (N+1).
     * On Supabase metadata is always available at no extra cost.
     * Default: false.
     */
    metadata?: boolean;
}

// ── Result types ──────────────────────────────────────────────────────────────

export interface StorageFileInfo {
    /** Filename without the directory prefix. */
    name: string;
    /** Full path as stored in the provider (e.g. "images/avatar.png"). */
    path: string;
    size?: number;
    contentType?: string;
    updatedAt?: string;
    /** Present and true when this entry represents a virtual folder (only when includeFolders: true). */
    isFolder?: boolean;
}

/**
 * Handle returned by createUpload — allows pause, resume and cancel mid-flight.
 * pause() and resume() are no-ops on providers that do not support them (e.g. Supabase via fetch).
 */
export interface UploadHandle {
    /** Resolves to the public download URL when the upload completes, or undefined on failure/cancel. */
    readonly url: Promise<string | undefined>;
    /** Pauses the upload. No-op if the provider does not support it. */
    pause(): void;
    /** Resumes a paused upload. No-op if the provider does not support it. */
    resume(): void;
    /** Cancels the upload. Always supported. */
    cancel(): void;
}

// ── Contract ──────────────────────────────────────────────────────────────────

/**
 * Common storage interface (Ports & Adapters).
 * Concrete implementations: FirebaseStorageProvider, SupabaseStorageProvider.
 *
 * All methods accept an optional `opts.bucket` to target a specific bucket
 * instead of the provider's configured default.
 */
export interface StorageProviderAdapter extends ProviderConfigurable {
    /**
     * Upload a file and return its public download URL.
     * Accepts a data URL string, a File, or a Blob.
     * Fire-and-forget: no pause/resume. Use createUpload() for controllable uploads.
     */
    upload(file: string | File | Blob, path: string, opts?: UploadOptions): Promise<string | undefined>;

    /**
     * Start a controllable upload and return a handle with pause / resume / cancel.
     * pause() and resume() are no-ops on Supabase (only Firebase supports them natively).
     */
    createUpload(file: string | File | Blob, path: string, opts?: UploadOptions): UploadHandle;

    /**
     * Rename a file or folder in place (same parent directory, new name).
     * For folder rename, set opts.recursive = true.
     * Semantically equivalent to move() — use rename() when only the name changes,
     * move() when relocating across directories or buckets.
     * Returns true if at least one file was successfully renamed.
     */
    rename(from: string, to: string, opts?: MoveOptions): Promise<boolean>;

    /**
     * Move a file or folder to a different path, directory, or bucket.
     * For folder move, set opts.recursive = true.
     * Use opts.destBucket to move across buckets.
     * Returns the number of files successfully moved (0 on failure, 1 for single file).
     */
    move(from: string, to: string, opts?: MoveOptions): Promise<number>;

    /** Return the public download URL for a stored file. */
    getURL(path: string, opts?: StorageOptions): Promise<string | undefined>;

    /**
     * Return metadata for a single file.
     * Returns undefined if the file does not exist.
     */
    getFileInfo(path: string, opts?: StorageOptions): Promise<StorageFileInfo | undefined>;

    /** Download a file as a Blob. */
    download(path: string, opts?: StorageOptions): Promise<Blob | undefined>;

    /**
     * Delete a file or all files under a folder prefix.
     * Returns the number of files deleted:
     *   - Single file (default): 0 if not found, 1 if deleted.
     *   - Folder (opts.recursive = true): total files deleted.
     */
    delete(path: string, opts?: DeleteOptions): Promise<number>;

    /**
     * List files (and optionally folders) under a path prefix.
     *
     * Key options:
     *   recursive       — traverse sub-folders (default: false, direct children only)
     *   includeFiles    — include file entries (default: true)
     *   includeFolders  — include folder entries with isFolder: true (default: false)
     *   filterByExtension — case-insensitive extension filter: 'jpg' or ['jpg','png']
     *   limit           — cap the number of results after all other filters
     *   metadata        — fetch size/contentType/updatedAt (N+1 cost on Firebase)
     */
    list(path: string, opts?: ListOptions): Promise<StorageFileInfo[]>;
}

// ── Internal helpers (shared across implementations) ──────────────────────────

/** Returns true if `filename` matches any of the allowed extensions. Case-insensitive. */
export function matchesExtension(filename: string, filter: string | string[]): boolean {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const allowed = Array.isArray(filter)
        ? filter.map((e) => e.toLowerCase().replace(/^\./, ''))
        : [filter.toLowerCase().replace(/^\./, '')];
    return allowed.includes(ext);
}

/** Apply limit and extension filter to a list of StorageFileInfo entries. */
export function applyListFilters(items: StorageFileInfo[], opts: ListOptions): StorageFileInfo[] {
    let result = items;

    if (opts.filterByExtension !== undefined) {
        result = result.filter(
            (item) => item.isFolder || matchesExtension(item.name, opts.filterByExtension!)
        );
    }

    if (opts.limit !== undefined && opts.limit > 0) {
        result = result.slice(0, opts.limit);
    }

    return result;
}
