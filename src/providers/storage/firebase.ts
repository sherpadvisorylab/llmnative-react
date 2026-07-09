import {
    getStorage as getFirebaseStorage,
    ref as storageRef,
    uploadString,
    uploadBytesResumable,
    getDownloadURL,
    getMetadata,
    deleteObject,
    listAll,
    type FirebaseStorage,
    type StorageReference,
} from 'firebase/storage';
import { getApp } from 'firebase/app';
import { Config, onConfigChange } from '../../Config';
import init, { getFirebaseConfigurationState } from '../firebase-init';
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
import type { ProviderConfigurationState } from '../ProviderConfiguration';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns the FirebaseStorage instance for the given bucket.
 *   undefined          → default bucket
 *   "gs://name.app"    → explicit GCS URL
 *   "name.appspot.com" → normalized by the Firebase SDK
 */
const getStorage = (bucket?: string): FirebaseStorage =>
    bucket ? getFirebaseStorage(getApp(), bucket) : getFirebaseStorage();

const refInfoFast = (item: StorageReference): StorageFileInfo => ({
    name: item.name,
    path: item.fullPath,
});

const refInfoWithMeta = async (item: StorageReference): Promise<StorageFileInfo> => {
    try {
        const meta = await getMetadata(item);
        return {
            name:        item.name,
            path:        item.fullPath,
            size:        meta.size,
            contentType: meta.contentType,
            updatedAt:   meta.updated,
        };
    } catch {
        return refInfoFast(item);
    }
};

// ── Provider ──────────────────────────────────────────────────────────────────

export interface FirebaseStorageProviderConfig {
    /** Used when a call doesn't pass its own `opts.bucket` — omit for the project's default bucket. */
    defaultBucket?: string;
}

export class FirebaseStorageProvider implements StorageProviderAdapter {
    private static listenerRegistered = false;
    private defaultBucket?: string;

    constructor(config: FirebaseStorageProviderConfig = {}) {
        this.defaultBucket = config.defaultBucket;
        if (!FirebaseStorageProvider.listenerRegistered && typeof onConfigChange === 'function') {
            FirebaseStorageProvider.listenerRegistered = true;
            onConfigChange((newConfig: Config) => {
                if (newConfig.firebase) init(newConfig.firebase);
            });
        }
    }

    private resolveBucket = (bucket?: string): string | undefined => bucket ?? this.defaultBucket;

    getConfigurationState(): ProviderConfigurationState {
        return getFirebaseConfigurationState();
    }

    isConfigured(): boolean {
        return this.getConfigurationState().configured;
    }

    // ── upload ──────────────────────────────────────────────────────────────

    upload = async (
        file: string | File | Blob,
        path: string,
        opts: UploadOptions = {}
    ): Promise<string | undefined> => {
        if (!file) return;
        try {
            const ref = storageRef(getStorage(this.resolveBucket(opts.bucket)), path);

            if (typeof file === 'string') {
                const snapshot = await uploadString(ref, file, 'data_url');
                return await getDownloadURL(snapshot.ref);
            }

            return await new Promise<string | undefined>((resolve, reject) => {
                const metadata = opts.contentType
                    ? { contentType: opts.contentType }
                    : file instanceof File && file.type
                        ? { contentType: file.type }
                        : undefined;

                const task = uploadBytesResumable(ref, file, metadata);

                if (opts.onProgress) {
                    task.on('state_changed', (snap) => {
                        const pct = snap.totalBytes > 0
                            ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                            : 0;
                        opts.onProgress!(pct);
                    });
                }

                task.then(async (snap) => resolve(await getDownloadURL(snap.ref))).catch(reject);
            });
        } catch (error) {
            console.error('[FirebaseStorage] upload error:', error);
        }
    };

    // ── createUpload ────────────────────────────────────────────────────────

    createUpload = (
        file: string | File | Blob,
        path: string,
        opts: UploadOptions = {}
    ): UploadHandle => {
        const ref = storageRef(getStorage(this.resolveBucket(opts.bucket)), path);

        // Data URL: uploadString has no native pause/resume
        if (typeof file === 'string') {
            let cancelled = false;
            const url: Promise<string | undefined> = (async () => {
                if (cancelled) return undefined;
                try {
                    const snap = await uploadString(ref, file, 'data_url');
                    return await getDownloadURL(snap.ref);
                } catch { return undefined; }
            })();
            return { url, pause: () => {}, resume: () => {}, cancel: () => { cancelled = true; } };
        }

        const metadata = opts.contentType
            ? { contentType: opts.contentType }
            : file instanceof File && file.type
                ? { contentType: file.type }
                : undefined;

        const task = uploadBytesResumable(ref, file, metadata);

        if (opts.onProgress) {
            task.on('state_changed', (snap) => {
                const pct = snap.totalBytes > 0
                    ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                    : 0;
                opts.onProgress!(pct);
            });
        }

        const url: Promise<string | undefined> = (async () => {
            try { return await getDownloadURL((await task).ref); }
            catch { return undefined; }
        })();

        return {
            url,
            pause:  () => { task.pause(); },
            resume: () => { task.resume(); },
            cancel: () => { task.cancel(); },
        };
    };

    // ── rename ──────────────────────────────────────────────────────────────

    /**
     * Rename a file or folder. Semantically: change the name in place.
     * Internally identical to move() - Firebase has no native rename/move API.
     */
    rename = async (from: string, to: string, opts: MoveOptions = {}): Promise<boolean> => {
        const count = await this.move(from, to, opts);
        return count > 0;
    };

    // ── move ────────────────────────────────────────────────────────────────

    /**
     * Move a file or folder (download → upload to new path → delete old).
     * Firebase has no native move/rename API.
     * For folder moves, set opts.recursive = true.
     * Returns the number of files successfully moved.
     */
    move = async (from: string, to: string, opts: MoveOptions = {}): Promise<number> => {
        if (opts.recursive) {
            // Folder move: list all files under 'from', move each one
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
        try {
            const blob = await this.download(from, opts);
            if (!blob) return false;
            const info = await this.getFileInfo(from, opts);
            const url = await this.upload(blob, to, {
                bucket:      opts.destBucket ?? opts.bucket,
                contentType: info?.contentType,
            });
            if (!url) return false;
            await this.delete(from, { bucket: opts.bucket });
            return true;
        } catch (error) {
            console.error(`[FirebaseStorage] move error ${from} → ${to}:`, error);
            return false;
        }
    };

    // ── getURL ──────────────────────────────────────────────────────────────

    getURL = async (path: string, opts: StorageOptions = {}): Promise<string | undefined> => {
        try {
            return await getDownloadURL(storageRef(getStorage(this.resolveBucket(opts.bucket)), path));
        } catch (error) {
            console.error(`[FirebaseStorage] getURL error for ${path}:`, error);
        }
    };

    // ── getFileInfo ─────────────────────────────────────────────────────────

    getFileInfo = async (path: string, opts: StorageOptions = {}): Promise<StorageFileInfo | undefined> => {
        try {
            const ref = storageRef(getStorage(this.resolveBucket(opts.bucket)), path);
            const meta = await getMetadata(ref);
            return {
                name:        ref.name,
                path:        ref.fullPath,
                size:        meta.size,
                contentType: meta.contentType,
                updatedAt:   meta.updated,
            };
        } catch (error: unknown) {
            if ((error as { code?: string }).code === 'storage/object-not-found') return undefined;
            console.error(`[FirebaseStorage] getFileInfo error for ${path}:`, error);
            return undefined;
        }
    };

    // ── download ────────────────────────────────────────────────────────────

    download = async (path: string, opts: StorageOptions = {}): Promise<Blob | undefined> => {
        const url = await this.getURL(path, opts);
        if (!url) return;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.blob();
        } catch (error) {
            console.error(`[FirebaseStorage] download error for ${path}:`, error);
        }
    };

    // ── delete ──────────────────────────────────────────────────────────────

    /**
     * Delete a single file or all files under a folder prefix.
     * Returns the number of files deleted (0 or 1 for single file, N for recursive).
     */
    delete = async (path: string, opts: DeleteOptions = {}): Promise<number> => {
        if (opts.recursive) {
            return this._deleteFolder(path, opts);
        }
        try {
            await deleteObject(storageRef(getStorage(this.resolveBucket(opts.bucket)), path));
            return 1;
        } catch (error: unknown) {
            if ((error as { code?: string }).code === 'storage/object-not-found') return 0;
            console.error(`[FirebaseStorage] delete error for ${path}:`, error);
            return 0;
        }
    };

    private _deleteFolder = async (path: string, opts: StorageOptions): Promise<number> => {
        try {
            const ref = storageRef(getStorage(this.resolveBucket(opts.bucket)), path);
            const { items, prefixes } = await listAll(ref);

            let count = 0;
            await Promise.all(items.map(async (item) => {
                try {
                    await deleteObject(item);
                    count++;
                } catch (error: unknown) {
                    if ((error as { code?: string }).code !== 'storage/object-not-found') {
                        console.error(`[FirebaseStorage] delete failed for ${item.fullPath}:`, error);
                    }
                }
            }));

            const subCounts = await Promise.all(
                prefixes.map((prefix) => this._deleteFolder(prefix.fullPath, opts))
            );
            return count + subCounts.reduce((sum, n) => sum + n, 0);
        } catch (error) {
            console.error(`[FirebaseStorage] deleteFolder error for ${path}:`, error);
            return 0;
        }
    };

    // ── list ────────────────────────────────────────────────────────────────

    /**
     * List files (and optionally folders) under a path prefix.
     *
     * Firebase note: the SDK's listAll() means "list all pages without pagination" -
     * it is NOT recursive. Recursion over sub-folders is performed manually here.
     *
     * opts.metadata = true fetches size/contentType/updatedAt (one extra call per file).
     */
    list = async (path: string, opts: ListOptions = {}): Promise<StorageFileInfo[]> => {
        const results = await this._listLevel(path, opts);
        return applyListFilters(results, opts);
    };

    private _listLevel = async (path: string, opts: ListOptions): Promise<StorageFileInfo[]> => {
        const showFiles   = opts.includeFiles   !== false;  // default true
        const showFolders = opts.includeFolders === true;

        try {
            const ref = storageRef(getStorage(this.resolveBucket(opts.bucket)), path);
            const { items, prefixes } = await listAll(ref);

            const fileResults: StorageFileInfo[] = showFiles
                ? opts.metadata
                    ? await Promise.all(items.map(refInfoWithMeta))
                    : items.map(refInfoFast)
                : [];

            const folderResults: StorageFileInfo[] = showFolders
                ? prefixes.map((p) => ({ name: p.name, path: p.fullPath, isFolder: true }))
                : [];

            const combined = [...fileResults, ...folderResults];

            if (!opts.recursive || prefixes.length === 0) return combined;

            const subResults = await Promise.all(
                prefixes.map((prefix) => this._listLevel(prefix.fullPath, opts))
            );

            return [...combined, ...subResults.flat()];
        } catch (error) {
            console.error(`[FirebaseStorage] list error for ${path}:`, error);
            return [];
        }
    };
}

export default new FirebaseStorageProvider();
