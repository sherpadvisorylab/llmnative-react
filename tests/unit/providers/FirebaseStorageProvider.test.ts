/**
 * FirebaseStorageProvider test suite.
 * Mocks firebase/storage and firebase-init to avoid real network calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockRef(name: string, fullPath: string) {
    return { name, fullPath };
}

function mockMeta(overrides: Record<string, any> = {}) {
    return { size: 100, contentType: 'image/png', updated: '2024-01-01', ...overrides };
}

// ── Mock firebase-init ────────────────────────────────────────────────────────

vi.mock('../../../src/providers/firebase-init', () => ({
    getFirebaseConfigurationState: vi.fn(() => ({ configured: true, missingKeys: [] })),
    default: vi.fn(),
}));

// ── Mock firebase/app ─────────────────────────────────────────────────────────

vi.mock('firebase/app', () => ({
    getApp: vi.fn(),
}));

// ── Mock firebase/storage ─────────────────────────────────────────────────────
// NOTE: vi.fn() calls must be inline — vi.mock factory is hoisted before outer vars.

vi.mock('firebase/storage', () => ({
    getStorage:             vi.fn(() => ({})),
    ref:                    vi.fn((_storage: any, path?: string) => ({
        name:     path?.split('/').pop() ?? '',
        fullPath: path ?? '',
    })),
    uploadString:           vi.fn(async () => ({ ref: { name: 'file.png', fullPath: 'images/file.png' } })),
    uploadBytesResumable:   vi.fn(() => {
        const task: any = {
            on: vi.fn(),
            then: (onFulfill: any, _onReject: any) =>
                Promise.resolve({ ref: { name: 'file.png', fullPath: 'uploads/file.png' } }).then(onFulfill),
            pause:  vi.fn(),
            resume: vi.fn(),
            cancel: vi.fn(),
        };
        return task;
    }),
    getDownloadURL:         vi.fn(async () => 'https://storage.example.com/file.png'),
    getMetadata:            vi.fn(async () => ({ size: 100, contentType: 'image/png', updated: '2024-01-01' })),
    deleteObject:           vi.fn(async () => undefined),
    listAll:                vi.fn(async () => ({ items: [], prefixes: [] })),
}));

// ── Mock StorageProvider (applyListFilters) ───────────────────────────────────

vi.mock('../../../src/providers/storage/StorageProvider', () => ({
    applyListFilters: vi.fn((files: any[]) => files),
}));

// ── Mock ../../Config ─────────────────────────────────────────────────────────

vi.mock('../../../src/Config', () => ({
    onConfigChange: vi.fn(),
}));

// ── Import after mocks ────────────────────────────────────────────────────────

import { FirebaseStorageProvider } from '../../../src/providers/storage/firebase';
import * as fbStorage from 'firebase/storage';

function provider() {
    return new FirebaseStorageProvider();
}

beforeEach(() => vi.clearAllMocks());

// ── getConfigurationState ─────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when Firebase is initialised', () => {
        expect(provider().getConfigurationState().configured).toBe(true);
    });
});

// ── upload — string (data URL) ────────────────────────────────────────────────

describe('upload() — string (data URL)', () => {
    it('calls uploadString and returns the download URL', async () => {
        const snapRef = mockRef('file.png', 'images/file.png');
        vi.mocked(fbStorage.uploadString).mockResolvedValueOnce({ ref: snapRef } as any);
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValueOnce('https://cdn.example.com/file.png');

        const url = await provider().upload('data:image/png;base64,ABC', 'images/file.png');

        expect(fbStorage.uploadString).toHaveBeenCalled();
        expect(url).toBe('https://cdn.example.com/file.png');
    });
});

// ── upload — File ─────────────────────────────────────────────────────────────

describe('upload() — File', () => {
    it('calls uploadBytesResumable and returns the download URL', async () => {
        const snapRef = mockRef('photo.jpg', 'uploads/photo.jpg');
        const fakeTask: any = {
            on: vi.fn(),
            then: (onFulfill: any, _onReject: any) =>
                Promise.resolve({ ref: snapRef }).then(onFulfill),
        };
        vi.mocked(fbStorage.uploadBytesResumable).mockReturnValueOnce(fakeTask);
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValueOnce('https://cdn.example.com/photo.jpg');

        const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
        const url = await provider().upload(file, 'uploads/photo.jpg');

        expect(fbStorage.uploadBytesResumable).toHaveBeenCalled();
        expect(url).toBe('https://cdn.example.com/photo.jpg');
    });

    it('calls onProgress callback during upload', async () => {
        const snapRef = mockRef('photo.jpg', 'uploads/photo.jpg');
        const onProgress = vi.fn();
        let progressCb: ((snap: any) => void) | undefined;

        const fakeTask: any = {
            on: vi.fn((_event: string, cb: any) => { progressCb = cb; }),
            then: (onFulfill: any, _onReject: any) =>
                Promise.resolve({ ref: snapRef }).then(onFulfill),
        };
        vi.mocked(fbStorage.uploadBytesResumable).mockReturnValueOnce(fakeTask);
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValueOnce('https://cdn.example.com/photo.jpg');

        const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
        const uploadPromise = provider().upload(file, 'uploads/photo.jpg', { onProgress });

        // Simulate a progress event fired by the task
        progressCb?.({ bytesTransferred: 50, totalBytes: 100 });

        await uploadPromise;

        expect(onProgress).toHaveBeenCalledWith(50);
    });
});

// ── getURL ────────────────────────────────────────────────────────────────────

describe('getURL()', () => {
    it('calls getDownloadURL and returns the URL string', async () => {
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValueOnce('https://cdn.example.com/avatar.png');
        const url = await provider().getURL('avatars/avatar.png');
        expect(fbStorage.getDownloadURL).toHaveBeenCalled();
        expect(url).toBe('https://cdn.example.com/avatar.png');
    });

    it('returns undefined and logs error when getDownloadURL throws', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(fbStorage.getDownloadURL).mockRejectedValueOnce(new Error('storage/object-not-found'));
        const url = await provider().getURL('missing/file.png');
        expect(url).toBeUndefined();
        consoleSpy.mockRestore();
    });
});

// ── getFileInfo ───────────────────────────────────────────────────────────────

describe('getFileInfo()', () => {
    it('calls getMetadata and returns StorageFileInfo with size and contentType', async () => {
        vi.mocked(fbStorage.getMetadata).mockResolvedValueOnce(
            mockMeta({ size: 2048, contentType: 'application/pdf', updated: '2024-06-01' }) as any
        );

        const info = await provider().getFileInfo('docs/file.pdf');

        expect(fbStorage.getMetadata).toHaveBeenCalled();
        expect(info).toMatchObject({ size: 2048, contentType: 'application/pdf', updatedAt: '2024-06-01' });
    });

    it('returns undefined when error code is storage/object-not-found', async () => {
        const notFound: any = new Error('Not found');
        notFound.code = 'storage/object-not-found';
        vi.mocked(fbStorage.getMetadata).mockRejectedValueOnce(notFound);

        const info = await provider().getFileInfo('docs/missing.pdf');
        expect(info).toBeUndefined();
    });
});

// ── download ──────────────────────────────────────────────────────────────────

describe('download()', () => {
    it('calls getURL then fetch and returns a Blob', async () => {
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValueOnce('https://cdn.example.com/file.txt');
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            blob: async () => new Blob(['hello'], { type: 'text/plain' }),
        } as any);

        const blob = await provider().download('files/file.txt');
        expect(blob).toBeInstanceOf(Blob);
    });

    it('returns undefined when HTTP response is not ok', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValueOnce('https://cdn.example.com/file.txt');
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false, status: 404 } as any);

        const blob = await provider().download('files/missing.txt');
        expect(blob).toBeUndefined();
        consoleSpy.mockRestore();
    });
});

// ── delete — single file ──────────────────────────────────────────────────────

describe('delete() — single file', () => {
    it('calls deleteObject and returns 1 on success', async () => {
        const count = await provider().delete('images/photo.jpg');
        expect(fbStorage.deleteObject).toHaveBeenCalled();
        expect(count).toBe(1);
    });

    it('returns 0 when file is not found', async () => {
        const notFound: any = new Error('Not found');
        notFound.code = 'storage/object-not-found';
        vi.mocked(fbStorage.deleteObject).mockRejectedValueOnce(notFound);

        const count = await provider().delete('images/missing.jpg');
        expect(count).toBe(0);
    });
});

// ── delete — recursive ────────────────────────────────────────────────────────

describe('delete() — recursive', () => {
    it('calls listAll, deletes all items, and returns count', async () => {
        const item1 = mockRef('a.jpg', 'images/a.jpg');
        const item2 = mockRef('b.jpg', 'images/b.jpg');
        vi.mocked(fbStorage.listAll).mockResolvedValueOnce({ items: [item1, item2] as any, prefixes: [] });

        const count = await provider().delete('images', { recursive: true });
        expect(fbStorage.listAll).toHaveBeenCalled();
        expect(vi.mocked(fbStorage.deleteObject)).toHaveBeenCalledTimes(2);
        expect(count).toBe(2);
    });
});

// ── list ──────────────────────────────────────────────────────────────────────

describe('list()', () => {
    it('calls listAll and returns array of StorageFileInfo', async () => {
        const item1 = mockRef('photo.jpg', 'images/photo.jpg');
        const item2 = mockRef('banner.png', 'images/banner.png');
        vi.mocked(fbStorage.listAll).mockResolvedValueOnce({ items: [item1, item2] as any, prefixes: [] });

        const files = await provider().list('images');
        expect(fbStorage.listAll).toHaveBeenCalled();
        expect(files).toHaveLength(2);
        expect(files[0]).toMatchObject({ name: 'photo.jpg', path: 'images/photo.jpg' });
    });

    it('fetches metadata per file when opts.metadata is true', async () => {
        const item1 = mockRef('photo.jpg', 'images/photo.jpg');
        vi.mocked(fbStorage.listAll).mockResolvedValueOnce({ items: [item1] as any, prefixes: [] });
        vi.mocked(fbStorage.getMetadata).mockResolvedValueOnce(
            mockMeta({ size: 512, contentType: 'image/jpeg', updated: '2024-03-15' }) as any
        );

        const files = await provider().list('images', { metadata: true });
        expect(fbStorage.getMetadata).toHaveBeenCalled();
        expect(files[0]).toMatchObject({ size: 512, contentType: 'image/jpeg' });
    });

    it('recurses into prefixes when opts.recursive is true', async () => {
        const subItem   = mockRef('nested.jpg', 'images/sub/nested.jpg');
        const subFolder = mockRef('sub', 'images/sub');

        vi.mocked(fbStorage.listAll)
            .mockResolvedValueOnce({ items: [] as any, prefixes: [subFolder] as any })
            .mockResolvedValueOnce({ items: [subItem] as any, prefixes: [] });

        const files = await provider().list('images', { recursive: true });
        expect(fbStorage.listAll).toHaveBeenCalledTimes(2);
        expect(files.some((f) => f.path === 'images/sub/nested.jpg')).toBe(true);
    });

    it('includes folder entries when opts.includeFolders is true', async () => {
        const subFolder = mockRef('sub', 'images/sub');
        vi.mocked(fbStorage.listAll).mockResolvedValueOnce({ items: [] as any, prefixes: [subFolder] as any });

        const entries = await provider().list('images', { includeFolders: true });
        expect(entries.some((e) => e.isFolder)).toBe(true);
    });
});

// ── rename ────────────────────────────────────────────────────────────────────

describe('rename()', () => {
    it('delegates to move() and returns true on a successful file rename', async () => {
        // rename calls move() → _moveFile() → download + upload + delete
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValue('https://cdn.example.com/old.jpg');
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            blob: async () => new Blob(['data'], { type: 'image/jpeg' }),
        } as any);
        vi.mocked(fbStorage.getMetadata).mockResolvedValue(mockMeta() as any);

        const snapRef = mockRef('new.jpg', 'images/new.jpg');
        const fakeTask: any = {
            on: vi.fn(),
            then: (onFulfill: any, _onReject: any) =>
                Promise.resolve({ ref: snapRef }).then(onFulfill),
        };
        vi.mocked(fbStorage.uploadBytesResumable).mockReturnValue(fakeTask);
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValue('https://cdn.example.com/new.jpg');

        const ok = await provider().rename('images/old.jpg', 'images/new.jpg');
        expect(ok).toBe(true);
    });
});

// ── createUpload — string ─────────────────────────────────────────────────────

describe('createUpload() — string', () => {
    it('returns an UploadHandle with pause, resume, cancel and a url promise', () => {
        const snapRef = mockRef('file.png', 'images/file.png');
        vi.mocked(fbStorage.uploadString).mockResolvedValue({ ref: snapRef } as any);
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValue('https://cdn.example.com/file.png');

        const handle = provider().createUpload('data:image/png;base64,ABC', 'images/file.png');

        expect(handle.url).toBeInstanceOf(Promise);
        expect(handle.pause).toBeTypeOf('function');
        expect(handle.resume).toBeTypeOf('function');
        expect(handle.cancel).toBeTypeOf('function');
    });

    it('resolves url to the download URL on success', async () => {
        const snapRef = mockRef('file.png', 'images/file.png');
        vi.mocked(fbStorage.uploadString).mockResolvedValue({ ref: snapRef } as any);
        vi.mocked(fbStorage.getDownloadURL).mockResolvedValue('https://cdn.example.com/file.png');

        const handle = provider().createUpload('data:image/png;base64,ABC', 'images/file.png');
        const url = await handle.url;

        expect(url).toBe('https://cdn.example.com/file.png');
    });
});
